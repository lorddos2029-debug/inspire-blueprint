// Dispara e-mail "order-shipped" para todos pedidos pagos com tracking_status='pedido_enviado'
// que ainda não receberam o e-mail (idempotência via idempotencyKey).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Pega o batch desta execução (limite pequeno por causa do CPU time da edge)
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "60"), 200);

  const { data: orders, error } = await supabase
    .from("orders")
    .select("id, customer_email, customer_name, order_number, tracking_code")
    .eq("payment_status", "paid")
    .eq("tracking_status", "pedido_enviado")
    .not("customer_email", "is", null)
    .limit(limit);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Pré-filtra: pula quem já tem registro no email_send_log com este idempotencyKey/template
  const ids = (orders || []).map((o) => o.id);
  const { data: alreadyLogged } = await supabase
    .from("email_send_log")
    .select("metadata")
    .eq("template_name", "order-shipped")
    .in("metadata->>order_id", ids.length ? ids : [""]);

  const sentSet = new Set(
    (alreadyLogged || [])
      .map((r: any) => r.metadata?.order_id)
      .filter(Boolean)
  );

  let sent = 0;
  let skipped = 0;
  const errors: string[] = [];

  for (const o of orders || []) {
    if (sentSet.has(o.id)) { skipped++; continue; }

    let success = false;
    for (let attempt = 0; attempt < 4 && !success; attempt++) {
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${supabaseKey}`,
            "apikey": supabaseKey,
          },
          body: JSON.stringify({
            templateName: "order-shipped",
            recipientEmail: o.customer_email,
            idempotencyKey: `order-shipped-${o.id}`,
            templateData: {
              customerName: o.customer_name,
              orderNumber: o.order_number,
              trackingCode: o.tracking_code,
              order_id: o.id,
            },
          }),
        });
        const text = await res.text();
        if (res.ok) { sent++; success = true; }
        else if (res.status === 429 || /rate limit/i.test(text)) {
          const m = text.match(/Retry after (\d+)ms/);
          const wait = m ? Math.min(parseInt(m[1]) + 200, 16000) : 2000;
          await sleep(wait);
        } else {
          errors.push(`${o.id}: HTTP ${res.status} ${text.slice(0,80)}`);
          break;
        }
      } catch (e) {
        errors.push(`${o.id}: ${(e as Error).message}`);
        break;
      }
    }
    // pequeno delay entre envios pra não estourar rate-limit
    await sleep(120);
  }

  return new Response(
    JSON.stringify({ total: orders?.length ?? 0, sent, skipped, errors: errors.slice(0, 20) }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
