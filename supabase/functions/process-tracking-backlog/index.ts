import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const now = new Date();
    const thirtyFiveDaysAgo = new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString();

    console.log(`Processing backlog: orders older than ${thirtyFiveDaysAgo}`);

    // 1. Identificar pedidos PAGO de 35+ dias com status inicial e auto-avanço habilitado
    // que não avançaram por algum motivo.
    const { data: backlog, error: fetchError } = await supabase
      .from("orders")
      .select("id, tracking_status, auto_advance_enabled")
      .eq("payment_status", "paid")
      .or("tracking_status.eq.pagamento_aprovado,tracking_status.eq.pedido_recebido,tracking_status.eq.em_separacao")
      .lt("created_at", thirtyFiveDaysAgo)
      .limit(200);


    if (fetchError) throw fetchError;

    let updated = 0;
    for (const order of backlog || []) {
      // Forçar avanço para 'preparando_pedido'
      // O auto-advance vai cuidar do resto dos passos
      const nextFlow = { next: "pedido_enviado", delayHours: 1 };
      const nextAt = new Date(now.getTime() + nextFlow.delayHours * 60 * 60 * 1000).toISOString();
      
      const { error: updError } = await supabase
        .from("orders")
        .update({
          tracking_status: "preparando_pedido",
          auto_next_status: nextFlow.next,
          auto_next_at: nextAt,
          auto_advance_enabled: true
        })
        .eq("id", order.id);

      if (!updError) updated++;
    }


    return new Response(JSON.stringify({ success: true, processed: backlog?.length || 0, updated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
