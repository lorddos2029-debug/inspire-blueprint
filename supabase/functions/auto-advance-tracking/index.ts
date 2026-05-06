// Avança automaticamente o status de rastreio de pedidos elegíveis
// e dispara e-mails para "pedido_enviado" e "entregue".
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STATUS_TO_EMAIL: Record<string, string> = {
  pedido_enviado: "order-shipped",
  entregue: "order-delivered",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const nowIso = new Date().toISOString();
  const { data: due, error } = await supabase
    .from("orders")
    .select("id, customer_email, customer_name, order_number, tracking_code, tracking_status, auto_next_status, auto_next_at, payment_status")
    .eq("auto_advance_enabled", true)
    .eq("payment_status", "paid")
    .not("auto_next_status", "is", null)
    .lte("auto_next_at", nowIso)
    .limit(100);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let advanced = 0;
  let emailsSent = 0;
  const errors: string[] = [];

  for (const o of due || []) {
    const newStatus = o.auto_next_status as string;
    const { error: updErr } = await supabase
      .from("orders")
      .update({ tracking_status: newStatus })
      .eq("id", o.id)
      .eq("tracking_status", o.tracking_status); // evita corrida

    if (updErr) {
      errors.push(`${o.id}: ${updErr.message}`);
      continue;
    }
    advanced++;

    const tpl = STATUS_TO_EMAIL[newStatus];
    if (tpl && o.customer_email && o.payment_status === "paid") {
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: tpl,
            recipientEmail: o.customer_email,
            idempotencyKey: `${tpl}-${o.id}`,
            templateData: {
              customerName: o.customer_name,
              orderNumber: o.order_number,
              trackingCode: o.tracking_code,
            },
          },
        });
        emailsSent++;
      } catch (e) {
        errors.push(`email ${o.id}: ${(e as Error).message}`);
      }
    }
  }

  return new Response(
    JSON.stringify({ checked: due?.length ?? 0, advanced, emailsSent, errors }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
