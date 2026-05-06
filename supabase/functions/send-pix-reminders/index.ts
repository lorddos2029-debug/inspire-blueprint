// Sends a one-time reminder email for unpaid PIX orders created TODAY only.
// Email contains ONLY a button linking back to /checkout?restore=ORDER_ID
// (cart is restored from the saved order). NO PIX is regenerated.
// Idempotency guarded by `pix_reminder_sent_at`.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://alphaoficial.online";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Optional: allow forced run targeting specific order IDs via body
    let forceOrderIds: string[] | null = null;
    try {
      if (req.method === "POST") {
        const body = await req.json().catch(() => ({}));
        if (Array.isArray(body?.orderIds)) forceOrderIds = body.orderIds;
        if (body?.resendAll === true) forceOrderIds = forceOrderIds || [];
      }
    } catch {}

    // Apenas PIX criados HOJE (a partir de 00:00 do dia atual em horário local de Brasília)
    // Usamos UTC e descontamos 3h para alinhar com Brasília (UTC-3).
    const now = new Date();
    const brasiliaNow = new Date(now.getTime() - 3 * 60 * 60 * 1000);
    const startOfDayBrasilia = new Date(Date.UTC(
      brasiliaNow.getUTCFullYear(),
      brasiliaNow.getUTCMonth(),
      brasiliaNow.getUTCDate(),
      0, 0, 0,
    ));
    // Converte de volta para UTC real (adiciona 3h)
    const startOfDayUTC = new Date(startOfDayBrasilia.getTime() + 3 * 60 * 60 * 1000).toISOString();
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();

    let query = supabase
      .from("orders")
      .select("id, order_number, customer_name, customer_email, total, items, payment_method, payment_status, created_at, pix_reminder_sent_at")
      .ilike("payment_method", "%pix%")
      .eq("payment_status", "pending")
      .limit(100);

    if (forceOrderIds && forceOrderIds.length > 0) {
      query = query.in("id", forceOrderIds);
    } else {
      query = query
        .lte("created_at", fiveMinAgo)
        .gte("created_at", startOfDayUTC)
        .is("pix_reminder_sent_at", null);
    }

    const { data: orders, error } = await query;

    if (error) {
      console.error("Failed to query unpaid PIX orders:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sent = 0, skipped = 0, failed = 0;
    const results: any[] = [];

    for (const order of orders || []) {
      if (!order.customer_email) { skipped++; results.push({ order: order.order_number, reason: "no_email" }); continue; }

      // Atomic lock unless forced
      if (!forceOrderIds) {
        const { data: locked } = await supabase
          .from("orders")
          .update({ pix_reminder_sent_at: new Date().toISOString() })
          .eq("id", order.id)
          .is("pix_reminder_sent_at", null)
          .select("id");
        if (!locked || locked.length === 0) { skipped++; results.push({ order: order.order_number, reason: "already_sent" }); continue; }
      } else {
        await supabase.from("orders").update({ pix_reminder_sent_at: new Date().toISOString() }).eq("id", order.id);
      }

      const items = (order.items as any[]) || [];
      const productSummary = items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ");
      const rawImage = items[0]?.image || "";
      const productImage = rawImage
        ? (rawImage.startsWith("http") ? rawImage : `${SITE_URL}${rawImage.startsWith("/") ? "" : "/"}${rawImage}`)
        : "";
      const totalFmt = Number(order.total).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
      const orderNumber = order.order_number || String(order.id).slice(0, 8);
      const checkoutUrl = `${SITE_URL}/checkout?restore=${encodeURIComponent(order.id)}`;

      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
            "apikey": supabaseKey,
          },
          body: JSON.stringify({
            templateName: "pix-reminder",
            recipientEmail: order.customer_email,
            idempotencyKey: `pix-reminder-${order.id}-${Date.now()}`,
            templateData: {
              customerName: order.customer_name,
              orderNumber,
              total: totalFmt,
              productSummary,
              productImage,
              checkoutUrl,
            },
          }),
        });
        if (!res.ok) {
          failed++;
          results.push({ order: orderNumber, reason: `send_failed_${res.status}` });
          if (!forceOrderIds) {
            await supabase.from("orders").update({ pix_reminder_sent_at: null }).eq("id", order.id);
          }
          console.warn("Reminder send failed:", res.status, await res.text());
        } else {
          sent++;
          results.push({ order: orderNumber, reason: "sent" });
        }
      } catch (err) {
        failed++;
        results.push({ order: orderNumber, reason: "exception" });
        if (!forceOrderIds) {
          await supabase.from("orders").update({ pix_reminder_sent_at: null }).eq("id", order.id);
        }
        console.warn("Reminder send error:", err);
      }
    }

    return new Response(JSON.stringify({ success: true, processed: orders?.length || 0, sent, skipped, failed, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("send-pix-reminders error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
