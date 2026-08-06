// Reconciliação de PIX: a PinPay envia o postback para uma URL configurada na
// conta (fora do nosso controle), então o `payment-webhook` muitas vezes nunca
// é chamado e a venda fica presa em "waiting_payment" na UTMify.
// Esta função roda por cron, lista as transações recentes na PinPay e
// reencaminha para o `payment-webhook` toda transação aprovada cujo pedido
// ainda não está marcado como pago.
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
    const secretKey = Deno.env.get("PINPAY_SECRET_KEY")?.trim();
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!secretKey) return json({ error: "PINPAY_SECRET_KEY not configured" }, 500);

    const supabase = createClient(supabaseUrl, serviceKey);

    // Pedidos PIX ainda não pagos das últimas 48h
    const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const { data: pending, error: pendingError } = await supabase
      .from("orders")
      .select("id, transaction_id, payment_status, created_at")
      .neq("payment_status", "paid")
      .gte("created_at", since)
      .limit(500);

    if (pendingError) throw new Error(`orders lookup failed: ${pendingError.message}`);
    if (!pending || pending.length === 0) return json({ checked: 0, forwarded: 0 });

    const byTxId = new Map<string, string>();
    const byOrderId = new Map<string, string>();
    for (const o of pending) {
      if (o.transaction_id) byTxId.set(String(o.transaction_id), o.id);
      byOrderId.set(String(o.id), o.id);
    }

    const res = await fetch("https://api.usepinpay.com/functions/v1/api-v1/transactions?limit=100", {
      headers: { Accept: "application/json", Authorization: `Bearer ${secretKey}` },
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(`PinPay list failed: ${res.status} ${JSON.stringify(payload).slice(0, 200)}`);

    const list: any[] = Array.isArray(payload?.data) ? payload.data : [];
    let forwarded = 0;

    for (const tx of list) {
      const status = String(tx?.status || "").toLowerCase();
      if (!APPROVED.includes(status)) continue;

      const txId = String(tx?.id || "");
      const externalRef = String(tx?.external_reference || tx?.metadata?.order_id || "");
      const orderId = byTxId.get(txId) || byOrderId.get(externalRef);
      if (!orderId) continue;

      const forwardRes = await fetch(`${supabaseUrl}/functions/v1/payment-webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${serviceKey}`,
          apikey: serviceKey,
        },
        body: JSON.stringify({
          type: "transaction.paid",
          data: { id: txId, status: "paid", metadata: { order_id: orderId } },
        }),
      });
      const text = await forwardRes.text();
      console.log("reconcile forward:", orderId, forwardRes.status, text.slice(0, 200));
      if (forwardRes.ok) forwarded++;
    }

    return json({ checked: pending.length, transactions: list.length, forwarded });
  } catch (err) {
    console.error("reconcile-pix-payments error:", err);
    return json({ error: err instanceof Error ? err.message : "Unknown error" }, 500);
  }
});
