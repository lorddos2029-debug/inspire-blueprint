import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const UTMIFY_API_TOKEN = Deno.env.get("UTMIFY_API_TOKEN");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!UTMIFY_API_TOKEN) {
      throw new Error("UTMIFY_API_TOKEN not configured");
    }
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Backend credentials not configured");
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const {
      orderId, paymentMethod, status, customer, products,
      totalInCents, createdAt, approvedDate, trackingParameters,
    } = body;

    if (!orderId || !status || !customer?.name || !customer?.email || !Array.isArray(products) || products.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid payload" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedStatus = String(status).toLowerCase();
    const statusColumn = normalizedStatus === "paid" ? "utmify_paid_sent_at" : normalizedStatus === "waiting_payment" ? "utmify_waiting_sent_at" : null;

    if (!statusColumn) {
      return new Response(JSON.stringify({ success: true, skipped: true, reason: "status_not_tracked" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const nowIso = new Date().toISOString();
    // Aceita o UUID interno (id), o ticket gerado no checkout ou o ID retornado pelo gateway (transaction_id).
    // Isso garante que o evento "paid" disparado pelo webhook (que usa order.id) consiga atualizar o
    // mesmo pedido que recebeu "waiting_payment" do checkout.
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(orderId));
    const orFilter = isUuid
      ? `id.eq.${orderId},ticket.eq.${orderId},transaction_id.eq.${orderId}`
      : `ticket.eq.${orderId},transaction_id.eq.${orderId}`;
    const { data: order, error: orderLookupError } = await supabase
      .from("orders")
      .select(`id, ${statusColumn}`)
      .or(orFilter)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (orderLookupError) {
      throw new Error(`Order lookup failed: ${orderLookupError.message}`);
    }

    if (!order) {
      return new Response(JSON.stringify({ success: true, skipped: true, reason: "order_not_found" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (order[statusColumn]) {
      return new Response(JSON.stringify({ success: true, duplicate: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: lockedRows, error: lockError } = await supabase
      .from("orders")
      .update({ [statusColumn]: nowIso })
      .eq("id", order.id)
      .is(statusColumn, null)
      .select("id");

    if (lockError) {
      throw new Error(`Order lock failed: ${lockError.message}`);
    }

    if (!lockedRows || lockedRows.length === 0) {
      return new Response(JSON.stringify({ success: true, duplicate: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const utmifyPayload = {
      orderId,
      platform: "LovableStore",
      paymentMethod: paymentMethod === "pix" ? "pix" : "credit_card",
      status,
      createdAt,
      approvedDate: approvedDate || null,
      refundedAt: null,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone || null,
        document: customer.cpf || null,
        country: "BR",
      },
      products: products.map((p: any) => ({
        id: String(p.id),
        name: p.name,
        planId: null,
        planName: null,
        quantity: p.quantity,
        priceInCents: Math.round(p.price * 100),
      })),
      trackingParameters: trackingParameters || {
        src: null, sck: null,
        utm_source: null, utm_campaign: null,
        utm_medium: null, utm_content: null, utm_term: null,
      },
      commission: {
        totalPriceInCents: totalInCents,
        gatewayFeeInCents: 0,
        userCommissionInCents: totalInCents,
        currency: "BRL",
      },
    };

    console.log("Sending to UTMIFY:", JSON.stringify(utmifyPayload));

    const response = await fetch("https://api.utmify.com.br/api-credentials/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-token": UTMIFY_API_TOKEN,
      },
      body: JSON.stringify(utmifyPayload),
    });

    const responseText = await response.text();
    console.log("UTMIFY response:", response.status, responseText);

    if (!response.ok) {
      await supabase.from("orders").update({ [statusColumn]: null }).eq("id", order.id);
      throw new Error(`UTMIFY API error [${response.status}]: ${responseText}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("UTMIFY error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
