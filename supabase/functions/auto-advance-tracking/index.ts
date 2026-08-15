// Avança automaticamente o status de rastreio de pedidos elegíveis
// e dispara e-mails para "pedido_enviado" e "entregue".
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const STATUS_FLOW: Record<string, { next: string | null; delayHours: number; emailTemplate: string | null }> = {
  pagamento_aprovado: { next: "preparando_pedido", delayHours: 2, emailTemplate: "payment-approved" },
  preparando_pedido: { next: "pedido_enviado", delayHours: 24, emailTemplate: "order-created" },
  pedido_enviado: { next: "em_transito", delayHours: 48, emailTemplate: "order-shipped" },
  em_transito: { next: "saiu_para_entrega", delayHours: 72, emailTemplate: null },
  saiu_para_entrega: { next: "entregue", delayHours: 8, emailTemplate: null },
  entregue: { next: null, delayHours: 0, emailTemplate: "order-delivered" },
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
    const currentStatus = o.tracking_status;
    const flowConfig = STATUS_FLOW[currentStatus] || STATUS_FLOW[o.auto_next_status || ""];
    const newStatus = o.auto_next_status as string;
    
    // Determinar próximo passo após este
    const nextFlow = STATUS_FLOW[newStatus];
    const nextStatus = nextFlow?.next || null;
    const nextAt = nextFlow ? new Date(new Date().getTime() + nextFlow.delayHours * 60 * 60 * 1000).toISOString() : null;

    const { error: updErr } = await supabase
      .from("orders")
      .update({ 
        tracking_status: newStatus,
        auto_next_status: nextStatus,
        auto_next_at: nextAt
      })
      .eq("id", o.id)
      .eq("tracking_status", o.tracking_status);

    if (updErr) {
      errors.push(`${o.id}: ${updErr.message}`);
      continue;
    }
    advanced++;

    const tpl = flowConfig?.emailTemplate;
    if (tpl && o.customer_email && o.payment_status === "paid") {
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: tpl,
            recipientEmail: o.customer_email,
            idempotencyKey: `${tpl}-${o.id}-${newStatus}`,
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
