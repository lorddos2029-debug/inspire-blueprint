// Consulta o status de uma transação PIX diretamente no gateway (PinPay).
// Serve como rede de segurança caso o postback do gateway não chegue:
// quando o pagamento está aprovado, reencaminha um webhook interno para
// `payment-webhook`, que marca o pedido como pago e envia o evento "paid"
// para a UTMify já com os parâmetros de campanha salvos no pedido.
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
    const body = await req.json().catch(() => ({}));
    const transactionId = String(body?.transactionId || "").trim();
    const orderId = String(body?.orderId || "").trim();

    if (!transactionId) return json({ error: "transactionId is required" }, 400);

    const secretKey = Deno.env.get("PINPAY_SECRET_KEY")?.trim();
    if (!secretKey) return json({ error: "PINPAY_SECRET_KEY not configured" }, 500);

    const base = "https://api.usepinpay.com/functions/v1/api-v1";
    const endpoints = [
      `${base}/transactions/${transactionId}`,
      `${base}/pix/${transactionId}`,
    ];

    let status = "";
    let lastError = "";
    for (const url of endpoints) {
      try {
        const res = await fetch(url, {
          headers: { Accept: "application/json", Authorization: `Bearer ${secretKey}` },
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          lastError = `${res.status} ${JSON.stringify(payload).slice(0, 200)}`;
          continue;
        }
        const tx = payload?.data || payload;
        status = String(tx?.status || "").toLowerCase();
        if (status) break;
      } catch (err) {
        lastError = (err as Error).message;
      }
    }

    if (!status) return json({ status: "unknown", error: lastError || null });

    if (!APPROVED.includes(status)) return json({ status, paid: false });

    // Reaproveita toda a lógica de pós-pagamento (pedido pago, e-mails,
    // Facebook CAPI e UTMify com atribuição) do webhook oficial.
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const forwardRes = await fetch(`${supabaseUrl}/functions/v1/payment-webhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
      body: JSON.stringify({
        type: "transaction.paid",
        data: { id: transactionId, status: "paid", metadata: orderId ? { order_id: orderId } : undefined },
      }),
    });
    const forwardText = await forwardRes.text();
    console.log("check-pix-status forward:", forwardRes.status, forwardText);

    return json({ status, paid: true, forwarded: forwardRes.ok });
  } catch (err) {
    console.error("check-pix-status error:", err);
    return json({ error: err instanceof Error ? err.message : "Unknown error" }, 500);
  }
});
