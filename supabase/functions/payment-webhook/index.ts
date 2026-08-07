import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PIXEL_ID = "2169110563856510";

async function hashSHA256(value: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(value);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Webhook received:", JSON.stringify(body));

    // Payout sends: { type, objectId, data: { id, status, metadata, ... } }
    // metadata contains our internal orderId (uuid)
    const data = body?.data || body?.transaction || {};
    const transactionId = String(
      data?.id || body?.objectId || body?.transactionId || body?.id || data?.transactionId || ""
    ).trim();
    const externalReference = String(
      data?.externalRef || data?.externalReference || body?.externalReference || body?.externalRef || ""
    ).trim();
    
    // metadata pode vir como string (Payout) ou objeto (PinPay)
    const rawMetadata = data?.metadata ?? body?.metadata ?? "";
    const orderIdMetadata = String(
      typeof rawMetadata === "object" && rawMetadata !== null
        ? (rawMetadata.order_id || rawMetadata.orderId || rawMetadata.external_reference || rawMetadata.externalReference || "")
        : rawMetadata
    ).trim();
    
    // PinPay metadata aninhado
    const pinpayInternalOrderId = data?.metadata?.order_id || body?.metadata?.order_id || "";

    const status = String(data?.status || body?.status || "").toLowerCase();
    const eventName = String(body?.event || body?.type || "").toLowerCase();
    
    // UTMs: PinPay as aninha em data.utm ou body.utm. Payout costuma não aninhar.
    const webhookUtm = (
      (data?.utm && typeof data.utm === "object" ? data.utm : {}) ||
      (body?.utm && typeof body.utm === "object" ? body.utm : {}) ||
      (data?.tracking_parameters && typeof data.tracking_parameters === "object" ? data.tracking_parameters : {}) ||
      (body?.tracking_parameters && typeof body.tracking_parameters === "object" ? body.tracking_parameters : {}) ||
      {}
    ) as Record<string, string>;
    const lookupReference = transactionId || externalReference || orderIdMetadata;

    if (!lookupReference) {
      return new Response(JSON.stringify({ error: "No transaction reference" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const updateOrderStatus = async (paymentStatus: string) => {
      if (orderIdMetadata) {
        await supabase.from("orders").update({ payment_status: paymentStatus, transaction_id: transactionId || null }).eq("id", orderIdMetadata);
      }
      if (transactionId) {
        await supabase.from("orders").update({ payment_status: paymentStatus }).eq("transaction_id", transactionId);
      }
      if (externalReference) {
        await supabase.from("orders").update({ payment_status: paymentStatus }).eq("ticket", externalReference);
      }
    };

    const loadOrder = async () => {
      if (orderIdMetadata) {
        const { data: o } = await supabase.from("orders").select("*").eq("id", orderIdMetadata).maybeSingle();
        if (o) return o;
      }
      if (transactionId) {
        const { data: o } = await supabase.from("orders").select("*").eq("transaction_id", transactionId).maybeSingle();
        if (o) return o;
      }
      if (externalReference) {
        const { data: o } = await supabase.from("orders").select("*").eq("ticket", externalReference).maybeSingle();
        if (o) return o;
      }
      return null;
    };

    // Determine normalized status
    const isPaid = eventName === "transaction.paid" || ["paid", "approved", "authorized"].includes(status);
    const isRefused = ["refused", "failed", "denied", "rejected", "canceled", "cancelled", "chargeback"].includes(status)
      || eventName.includes("refused") || eventName.includes("failed") || eventName.includes("canceled");

    if (!isPaid) {
      const normalizedStatus = isRefused ? "refused" : (status || "pending");
      console.log(`Status "${normalizedStatus}" is not paid, updating order without firing Purchase events`);
      await updateOrderStatus(normalizedStatus);
      return new Response(JSON.stringify({ success: true, status: normalizedStatus }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const order = await loadOrder();

    if (!order) {
      console.error("Order not found for transaction:", transactionId, "externalReference:", externalReference);
      return new Response(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Idempotency guard: if order already marked as paid, skip duplicate processing
    if (order.payment_status === "paid") {
      console.log(`Order ${order.id} already paid, skipping duplicate webhook`);
      return new Response(JSON.stringify({ success: true, status: "paid", duplicate: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Atomic update: only mark as paid if not already paid (prevents race conditions on concurrent webhooks)
    const { data: updatedRows, error: updateError } = await supabase
      .from("orders")
      .update({ payment_status: "paid", tracking_status: "pagamento_aprovado" })
      .eq("id", order.id)
      .neq("payment_status", "paid")
      .select("id");

    if (updateError) {
      console.error("Error updating order to paid:", updateError);
    }

    // If no rows were updated, another concurrent webhook already processed this order
    if (!updatedRows || updatedRows.length === 0) {
      console.log(`Order ${order.id} was concurrently marked paid, skipping duplicate processing`);
      return new Response(JSON.stringify({ success: true, status: "paid", duplicate: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 0a. Enviar pedido para PósVenda Pro (rastreio + SMS automático)
    try {
      const POSVENDA_TOKEN = "RAIO-99BF99";
      const items = (order.items as any[]) || [];
      const posvendaPayload = {
        status: "paid",
        orderId: order.order_number || order.id,
        customer: {
          name: order.customer_name,
          email: order.customer_email,
          document: (order.customer_cpf || "").replace(/\D/g, ""),
          phone: (order.customer_phone || "").replace(/\D/g, "").startsWith("55")
            ? (order.customer_phone || "").replace(/\D/g, "")
            : "55" + (order.customer_phone || "").replace(/\D/g, ""),
        },
        address: {
          street: order.street || "",
          number: order.number || "",
          complement: order.complement || "",
          neighborhood: order.neighborhood || "",
          city: order.city || "",
          state: order.state || "",
          zipcode: (order.cep || "").replace(/\D/g, ""),
        },
        products: items.map((p: any) => ({
          name: p.name,
          quantity: p.quantity,
          priceInCents: Math.round(Number(p.price) * 100),
        })),
        paymentMethod: (order.payment_method || "").toLowerCase().includes("pix") ? "pix" : "credit_card",
      };

      const posvendaRes = await fetch(
        `https://xncotgcngryyokbbmess.supabase.co/functions/v1/webhook?token=${POSVENDA_TOKEN}&platform=zedy`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(posvendaPayload),
        }
      );
      const posvendaText = await posvendaRes.text();
      console.log("PósVenda Pro response:", posvendaRes.status, posvendaText);

      // Salvar tracking_code retornado caso processado automaticamente
      try {
        const posvendaData = JSON.parse(posvendaText);
        if (posvendaData?.tracking_code) {
          await supabase
            .from("orders")
            .update({ tracking_code: posvendaData.tracking_code })
            .eq("id", order.id);
        }
      } catch (_) { /* ignore parse */ }
    } catch (posvendaErr) {
      console.warn("PósVenda Pro failed:", posvendaErr);
    }

    // 0. Disparar e-mail "pagamento aprovado" (via fetch direto com service-role auth)
    try {
      const { data: fullOrder } = await supabase
        .from("orders").select("order_number, customer_name, customer_email, total, tracking_code")
        .eq("id", order.id).maybeSingle();
      if (fullOrder?.customer_email) {
        const emailRes = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
            "apikey": supabaseKey,
          },
          body: JSON.stringify({
            templateName: "payment-approved",
            recipientEmail: fullOrder.customer_email,
            idempotencyKey: `payment-approved-${order.id}`,
            templateData: {
              customerName: fullOrder.customer_name,
              orderNumber: fullOrder.order_number || order.id.slice(0, 8),
              trackingCode: fullOrder.tracking_code || "",
              total: Number(fullOrder.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
            },
          }),
        });
        const emailText = await emailRes.text();
        console.log("Email payment-approved response:", emailRes.status, emailText);
      }
    } catch (emailErr) {
      console.warn("Email payment-approved failed:", emailErr);
    }

    const approvedNow = new Date().toISOString().replace("T", " ").slice(0, 19);
    const items = (order.items as any[]) || [];
    // Use internal order UUID as UTMIFY orderId to match the "waiting_payment"
    // event sent at order creation (send-utmify-order uses order.id / metadata UUID).
    // Falling back to gateway IDs would create a duplicate "paid" record disconnected
    // from the original campaign attribution.
    const utmifyOrderId = order.id || externalReference || order.transaction_id || transactionId;

    // 1. Purchase (Facebook CAPI) é disparado exclusivamente pelo client-side
    // polling do checkout, evitando eventos duplicados de conversão.


    // 2. Send to UTMIFY as paid exactly once
    const UTMIFY_API_TOKEN = Deno.env.get("UTMIFY_API_TOKEN");
    if (UTMIFY_API_TOKEN && !order.utmify_paid_sent_at) {
      try {
        const { data: utmifyLockRows, error: utmifyLockError } = await supabase
          .from("orders")
          .update({ utmify_paid_sent_at: new Date().toISOString() })
          .eq("id", order.id)
          .is("utmify_paid_sent_at", null)
          .select("id");

        if (utmifyLockError) {
          console.error("Error locking UTMIFY paid send:", utmifyLockError);
        }

        if (!utmifyLockRows || utmifyLockRows.length === 0) {
          console.log(`UTMIFY paid already sent for order ${order.id}, skipping duplicate send`);
          return new Response(JSON.stringify({ success: true, status: "paid", duplicate: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const createdAtUtmify = order.created_at
          ? new Date(order.created_at).toISOString().replace("T", " ").slice(0, 19)
          : approvedNow;

        const paymentMethodUtmify =
          (order.payment_method || "").toLowerCase().includes("pix") ? "pix" : "credit_card";

        const utmifyPayload = {
          orderId: utmifyOrderId,
          platform: "LovableStore",
          paymentMethod: paymentMethodUtmify,
          status: "paid",
          createdAt: createdAtUtmify,
          approvedDate: approvedNow,
          refundedAt: null,
          customer: {
            name: order.customer_name,
            email: order.customer_email,
            phone: order.customer_phone || null,
            document: order.customer_cpf || null,
            country: "BR",
          },
          products: items.map((p: any) => ({
            id: String(p.id),
            name: p.name,
            planId: null,
            planName: null,
            quantity: p.quantity,
            priceInCents: Math.round(Number(p.price) * 100),
          })),
          trackingParameters: (() => {
            const stored = (order as any).tracking_parameters && typeof (order as any).tracking_parameters === "object"
              ? (order as any).tracking_parameters as Record<string, string>
              : {};
            const pick = (k: string) => stored[k] || webhookUtm?.[k] || null;
            return {
              src: stored.src || null,
              sck: stored.sck || null,
              utm_source: pick("utm_source"),
              utm_campaign: pick("utm_campaign"),
              utm_medium: pick("utm_medium"),
              utm_content: pick("utm_content"),
              utm_term: pick("utm_term"),
            };
          })(),
          commission: {
            totalPriceInCents: Math.round(Number(order.total) * 100),
            gatewayFeeInCents: 0,
            userCommissionInCents: Math.round(Number(order.total) * 100),
            currency: "BRL",
          },
        };

        const utmifyRes = await fetch("https://api.utmify.com.br/api-credentials/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-token": UTMIFY_API_TOKEN },
          body: JSON.stringify(utmifyPayload),
        });
        const utmifyText = await utmifyRes.text();
        console.log("UTMIFY webhook response:", utmifyRes.status, utmifyText);

        if (!utmifyRes.ok) {
          await supabase.from("orders").update({ utmify_paid_sent_at: null }).eq("id", order.id);
          console.error("UTMIFY webhook rejected payload, lock reverted");
        }
      } catch (utmErr: any) {
        await supabase.from("orders").update({ utmify_paid_sent_at: null }).eq("id", order.id);
        console.error("UTMIFY webhook error:", utmErr.message);
      }
    }

    return new Response(JSON.stringify({ success: true, status: "paid" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Webhook error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
