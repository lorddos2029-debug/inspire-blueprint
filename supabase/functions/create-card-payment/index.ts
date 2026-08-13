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

async function callPagouAI(params: { customer: any; items: any[]; amount: number; card: any; installments: number; shipping?: any; externalRef?: string; trackingParameters?: any; clientIp: string; webhookUrl: string }) {
  const secretKey = Deno.env.get('PAGOUAI_SECRET_KEY')?.trim();
  if (!secretKey) throw new Error('PAGOUAI_SECRET_KEY is not configured');

  const { customer, items, amount, card, installments, shipping, externalRef, clientIp, webhookUrl } = params;
  
  const payload = {
    amount: Math.round(amount * 100),
    installments: installments || 1,
    capture: true,
    payment_method: 'credit_card',
    postback_url: webhookUrl,
    metadata: {
      external_ref: externalRef || `order-${Date.now()}`,
    },
    customer: {
      name: customer?.name || 'Cliente',
      email: customer?.email || '',
      phone: (customer?.phone || '').replace(/\D/g, ''),
      document: {
        type: 'cpf',
        number: (customer?.cpf || '').replace(/\D/g, ''),
      },
    },
    card: {
      number: (card.number || '').replace(/\D/g, ''),
      holder_name: card.holder_name || customer?.name || 'Cliente',
      exp_month: String(card.exp_month || '1').padStart(2, '0'),
      exp_year: String(card.exp_year || '2026').slice(-2),
      cvv: String(card.cvv || ''),
    },
    items: items.map((item: any) => {
      let title = item.name;
      if (title.includes("GOKOCO Escova modeladora")) {
        title = "Escova modeladora de íons negativos de 38 mm – 9 ajustes de temperatura";
      }
      return {
        title,
        unit_price: Math.round(item.price * 100),
        quantity: item.quantity,
        tangible: true,
      };
    }),
  };

  const response = await fetch('https://api.pagou.ai/v2/transactions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${secretKey}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  console.log('PagouAI card status:', response.status, 'response:', JSON.stringify(data));

  const txId = String(data?.id || '');
  const status = String(data?.status || 'failed').toLowerCase();
  
  return {
    id: txId,
    status: status,
    refusal_reason: data?.refuse_reason || data?.message || (response.ok ? null : 'Pagamento recusado.'),
    raw: data,
  };
}

async function callPayout(params: any) {
  const PAYOUT_SECRET_KEY = Deno.env.get('PAYOUT_SECRET_KEY')?.trim();
  if (!PAYOUT_SECRET_KEY) throw new Error('PAYOUT_SECRET_KEY is not configured');

  const { customer, items, amount, card, installments, shipping, client_ip, externalRef, webhookUrl, trackingParameters } = params;
  const authToken = btoa(`${PAYOUT_SECRET_KEY}:x`);
  const amountInCents = Math.round(amount * 100);

  const utm = trackingParameters && typeof trackingParameters === 'object' ? trackingParameters as Record<string, unknown> : {};
  const utmFields: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck'].forEach((k) => {
    const v = utm[k];
    if (typeof v === 'string' && v.trim()) utmFields[k] = v.trim();
  });

  if (!utmFields.utm_source) {
    if (utm.fbclid) utmFields.utm_source = 'facebook';
    else if (utm.gclid) utmFields.utm_source = 'google';
    else if (utm.ttclid) utmFields.utm_source = 'tiktok';
    else if (utm.kwai_click_id) utmFields.utm_source = 'kwai';
  }
  if (utmFields.utm_source) {
    if (!utmFields.utm_medium) utmFields.utm_medium = 'paid';
    if (!utmFields.utm_campaign) utmFields.utm_campaign = 'ads_campaign';
  }

  const payload: Record<string, unknown> = {
    paymentMethod: 'credit_card',
    amount: amountInCents,
    installments: installments || 1,
    ip: client_ip,
    postbackUrl: webhookUrl,
    externalRef: typeof externalRef === 'string' && externalRef.trim() ? externalRef.trim() : `order-${Date.now()}`,
    customer: {
      name: customer?.name || 'Cliente',
      email: customer?.email || '',
      phone: (customer?.phone || '').replace(/\D/g, ''),
      document: { type: 'cpf', number: (customer?.cpf || '').replace(/\D/g, '') },
      ...(shipping ? {
        address: {
          street: shipping.street || '',
          streetNumber: shipping.number || '',
          complement: shipping.complement || '',
          neighborhood: shipping.neighborhood || '',
          city: shipping.city || '',
          state: shipping.state || '',
          zipCode: (shipping.cep || '').replace(/\D/g, ''),
          zipcode: (shipping.cep || '').replace(/\D/g, ''),
          country: 'BR',
        },
      } : {}),
    },
    card: {
      number: (card.number || '').replace(/\D/g, ''),
      holderName: card.holder_name || customer?.name || 'Cliente',
      expirationMonth: parseInt(String(card.exp_month || '1'), 10),
      expirationYear: parseInt(String(card.exp_year || '2026'), 10),
      cvv: String(card.cvv || ''),
    },
    items: items.map((item: any) => {
      let title = item.name;
      if (title.includes("GOKOCO Escova modeladora")) {
        title = "Escova modeladora de íons negativos de 38 mm – 9 ajustes de temperatura";
      }
      return {
        title,
        unitPrice: Math.round(item.price * 100),
        quantity: item.quantity,
        tangible: true,
      };
    }),
    utm: utmFields,
    metadata: {
      externalRef: typeof externalRef === 'string' && externalRef.trim() ? externalRef.trim() : `order-${Date.now()}`,
      ...utmFields,
      customer_address: shipping ? `${shipping.street}, ${shipping.number}${shipping.complement ? ` - ${shipping.complement}` : ''}, ${shipping.neighborhood}, ${shipping.city} - ${shipping.state}, CEP: ${shipping.cep}` : undefined
    }
  };

  if (shipping) {
    payload.shipping = {
      name: customer?.name || 'Cliente',
      street: shipping.street || '',
      streetNumber: shipping.number || '',
      complement: shipping.complement || '',
      neighborhood: shipping.neighborhood || '',
      city: shipping.city || '',
      state: shipping.state || '',
      zipcode: (shipping.cep || '').replace(/\D/g, ''),
      country: 'BR',
    };
  }

  const response = await fetch('https://api.payoutbr.com.br/v1/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'accept': 'application/json', 'authorization': `Basic ${authToken}` },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  const txData = data?.data ?? data;
  const txId = String(txData?.id ?? data?.id ?? '');
  const status = String(txData?.status ?? data?.status ?? '').toLowerCase();
  console.log('Payout card status:', response.status, 'tx:', txId, 'result:', status);

  const refused = txData?.refusedReason ?? txData?.refuseReason;
  const refusalText =
    (typeof refused === 'string' ? refused : refused?.description) ||
    txData?.acquirerMessage ||
    data?.message ||
    (response.ok ? null : 'Pagamento recusado.');

  return {
    id: txId,
    status: status,
    refusal_reason: refusalText,
    raw: data,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { customer, items, amount, card, installments, shipping, client_ip, trackingParameters, externalRef } = body;

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const webhookUrl = `${SUPABASE_URL}/functions/v1/payment-webhook`;
    const clientIp = client_ip || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '213.123.123.13';

    const provider = await getCardProvider();
    console.log('Card provider selected:', provider);

    let result;
    if (provider === 'pagouai') {
      result = await callPagouAI({ customer, items, amount, card, installments, shipping, externalRef, clientIp, webhookUrl });
    } else {
      result = await callPayout({ customer, items, amount, card, installments, shipping, client_ip: clientIp, externalRef, webhookUrl, trackingParameters });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('Error creating card payment:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});