import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const APPROVED = ["paid", "approved", "authorized", "completed", "succeeded"];

const json = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const secretKey = Deno.env.get("PAYOUT_SECRET_KEY")?.trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!secretKey) return json({ error: "PAYOUT_SECRET_KEY not configured" }, 500);

    const supabase = createClient(supabaseUrl, serviceKey);

    // Pedidos de cartão ainda não pagos das últimas 48h
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const { data: pending, error: pendingError } = await supabase
      .from("orders")
      .select("id, transaction_id, payment_status, created_at")
      .eq("payment_method", "credit_card")
      .neq("payment_status", "paid")
      .gte("created_at", since)
      .limit(200);

    if (pendingError) throw new Error(`orders lookup failed: ${pendingError.message}`);
    if (!pending || pending.length === 0) return json({ checked: 0, forwarded: 0 });

    const byTxId = new Map<string, string>();
    const byOrderId = new Map<string, string>();
    for (const o of pending) {
      if (o.transaction_id) byTxId.set(String(o.transaction_id), o.id);
      byOrderId.set(String(o.id), o.id);
    }

    // Busca transações recentes na Payout
    const res = await fetch("https://api.payout.com.br/v1/transactions?limit=50", {
      headers: { 
        "Accept": "application/json", 
        "Authorization": `Bearer ${secretKey}` 
      },
    });
    
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`Payout list failed: ${res.status} ${JSON.stringify(payload).slice(0, 200)}`);

    const list: any[] = Array.isArray(payload?.data) ? payload.data : [];
    let forwarded = 0;

    for (const tx of list) {
      const status = String(tx?.status || "").toLowerCase();
      if (!APPROVED.includes(status)) continue;

      const txId = String(tx?.id || "");
      const externalRef = String(tx?.externalRef || tx?.metadata?.order_id || "");
      
      // Tenta associar pelo ID da transação ou pela referência externa (nosso order UUID)
      const orderId = byTxId.get(txId) || byOrderId.get(externalRef);
      if (!orderId) continue;

      // Encaminha para o webhook interno para disparar UTMify, E-mail e Pós-Venda
      const forwardRes = await fetch(`${supabaseUrl}/functions/v1/payment-webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
        body: JSON.stringify({
          type: "transaction.paid",
          data: { 
            id: txId, 
            status: "paid", 
            externalRef: externalRef,
            metadata: { order_id: orderId } 
          },
        }),
      });
      
      const text = await forwardRes.text();
      console.log(`reconcile-card forward: order=${orderId} status=${forwardRes.status} response=${text.slice(0, 100)}`);
      if (forwardRes.ok) forwarded++;
    }

    return json({ checked: pending.length, transactions: list.length, forwarded });
  } catch (err) {
    console.error("reconcile-card-payments error:", err);
    return json({ error: err instanceof Error ? err.message : "Unknown error" }, 500);
  }
});
