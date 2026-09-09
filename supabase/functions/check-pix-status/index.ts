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

    let status = "";
    let lastError = "";

    // UrusPay: GET /api/v1/status/{venda_id} (venda_id é numérico).
    const urusKey = Deno.env.get("URUSPAY_API_KEY")?.trim();
    if (urusKey && /^\d+$/.test(transactionId)) {
      try {
        const res = await fetch(`https://urusbot.online/api/v1/status/${transactionId}`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${urusKey}` },
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          lastError = `uruspay ${res.status} ${JSON.stringify(payload).slice(0, 200)}`;
        } else {
          status = payload?.pago === true ? "paid" : String(payload?.status || "").toLowerCase();
        }
      } catch (err) {
        lastError = (err as Error).message;
      }
    }

    // PrimeCash atualizada: GET /v1/transactions/{id} com Basic auth.
    const primecashKey = Deno.env.get("PRIMECASH_SECRET_KEY_V2")?.trim() || Deno.env.get("PRIMECASH_SECRET_KEY")?.trim();

    const primecashHost = Deno.env.get("PRIMECASH_API_HOST")?.trim() || "api.useprimecash.com";
    if (!status && primecashKey) {
      try {
        const res = await fetch(`https://${primecashHost}/v1/transactions/${encodeURIComponent(transactionId)}`, {
          headers: { Accept: "application/json", Authorization: `Basic ${btoa(`${primecashKey}:x`)}` },
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          lastError = `primecash ${res.status} ${JSON.stringify(payload).slice(0, 200)}`;
        } else {
          const tx = payload?.data || payload;
          status = String(tx?.status || "").toLowerCase();
        }
      } catch (err) {
        lastError = (err as Error).message;
      }
    }

    // Fallback: PinPay (contas antigas) — lista as transações recentes.
    const secretKey = Deno.env.get("PINPAY_SECRET_KEY")?.trim();
    if (!status && secretKey) {
      const base = "https://api.usepinpay.com/functions/v1/api-v1";
      try {
        const res = await fetch(`${base}/transactions?limit=100`, {
          headers: { Accept: "application/json", Authorization: `Bearer ${secretKey}` },
        });
        const payload = await res.json().catch(() => ({}));
        if (!res.ok) {
          lastError = `${res.status} ${JSON.stringify(payload).slice(0, 200)}`;
        } else {
          const list: any[] = Array.isArray(payload?.data) ? payload.data : [];
          const tx = list.find(
            (t) => String(t?.id || "") === transactionId
              || (orderId && String(t?.external_reference || "") === orderId),
          );
          status = String(tx?.status || "").toLowerCase();
        }
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
