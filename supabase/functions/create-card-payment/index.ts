import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYOUT_SECRET_KEY = Deno.env.get('PAYOUT_SECRET_KEY')?.trim();
    if (!PAYOUT_SECRET_KEY) {
      throw new Error('PAYOUT_SECRET_KEY is not configured');
    }

    const { customer, items, amount, card, installments, shipping, client_ip, trackingParameters, externalRef } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Items are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Valid amount is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!card || !card.number) {
      return new Response(JSON.stringify({ error: 'Card data is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authToken = btoa(`${PAYOUT_SECRET_KEY}:x`);
    const amountInCents = Math.round(amount * 100);

    const clientIp =
      client_ip ||
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      '213.123.123.13';

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const webhookUrl = `${SUPABASE_URL}/functions/v1/payment-webhook`;

    const payload: Record<string, unknown> = {
      paymentMethod: 'credit_card',
      amount: amountInCents,
      installments: installments || 1,
      ip: clientIp,
      postbackUrl: webhookUrl,
      metadata: typeof externalRef === 'string' && externalRef.trim() ? externalRef.trim() : `order-${Date.now()}`,
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
        holderName: card.holder_name || customer?.name || 'Cliente',
        expirationMonth: parseInt(String(card.exp_month || '1'), 10),
        expirationYear: parseInt(String(card.exp_year || '2026'), 10),
        cvv: String(card.cvv || ''),
      },
      items: items.map((item: any) => ({
        title: item.name,
        unitPrice: Math.round(item.price * 100),
        quantity: item.quantity,
        tangible: true,
      })),
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

    const utm = trackingParameters && typeof trackingParameters === 'object'
      ? trackingParameters as Record<string, unknown>
      : {};
    const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
    const utmObj: Record<string, string> = {};
    utmFields.forEach((key) => {
      const value = utm[key];
      if (typeof value === 'string' && value.trim()) {
        utmObj[key] = value.trim();
      }
    });
    if (Object.keys(utmObj).length > 0) {
      payload.utm = utmObj;
    }

    console.log('Sending card payment to Payout');

    const response = await fetch('https://api.payoutbr.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'authorization': `Basic ${authToken}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('Payout card status:', response.status);
    console.log('Payout card response:', JSON.stringify(data));

    // Normalize: Payout may return either { id, status, ... } or { data: { id, status, ... } }
    const txData = data?.data ?? data;
    const txId = String(txData?.id ?? data?.id ?? '');
    let txStatus = String(txData?.status ?? data?.status ?? '').toLowerCase();

    // Try to extract a meaningful refusal reason from various Payout response shapes
    const extractReason = (d: any): string => {
      if (!d) return '';
      const candidates = [
        d?.refuseReason,
        d?.refuse_reason,
        d?.acquirerMessage,
        d?.acquirer_message,
        d?.acquirerResponseCode,
        d?.gatewayResponseMessage,
        d?.message,
        d?.error,
        d?.errors,
        d?.data?.refuseReason,
        d?.data?.acquirerMessage,
        d?.data?.message,
      ];
      for (const c of candidates) {
        if (typeof c === 'string' && c.trim()) return c.trim();
        if (Array.isArray(c) && c.length) {
          const joined = c.map((x: any) => typeof x === 'string' ? x : (x?.message || JSON.stringify(x))).filter(Boolean).join('; ');
          if (joined) return joined;
        }
      }
      return '';
    };

    // Translate common gateway reasons to friendly Portuguese messages
    const friendlyReason = (raw: string): string => {
      const r = (raw || '').toLowerCase();
      if (!r) return 'Pagamento recusado pela operadora do cartão.';
      if (r.includes('insufficient') || r.includes('saldo') || r.includes('limite')) return 'Cartão sem limite/saldo disponível.';
      if (r.includes('expired') || r.includes('vencid') || r.includes('expir')) return 'Cartão vencido. Verifique a data de validade.';
      if (r.includes('cvv') || r.includes('security code') || r.includes('código de segurança')) return 'Código de segurança (CVV) inválido.';
      if (r.includes('invalid card') || r.includes('cartão inválido') || r.includes('invalid number')) return 'Número do cartão inválido.';
      if (r.includes('do not honor') || r.includes('não autorizad') || r.includes('not authorized') || r.includes('declined')) return 'Compra não autorizada pelo banco emissor. Entre em contato com seu banco ou tente outro cartão.';
      if (r.includes('fraud') || r.includes('suspect')) return 'Transação bloqueada por suspeita de fraude. Use outro cartão ou contate seu banco.';
      if (r.includes('blocked') || r.includes('bloquead')) return 'Cartão bloqueado pelo emissor.';
      if (r.includes('issuer') || r.includes('emissor')) return 'Emissor do cartão indisponível. Tente novamente em instantes.';
      if (r.includes('timeout')) return 'Tempo esgotado na comunicação com o banco. Tente novamente.';
      // Use the raw message if it already looks user-friendly (short Portuguese-ish text)
      if (raw.length < 120) return raw;
      return 'Pagamento recusado pela operadora do cartão.';
    };

    const rawReason = extractReason(data);
    const friendly = (response.ok && txStatus && !['refused','failed','denied','rejected','error'].includes(txStatus))
      ? ''
      : friendlyReason(rawReason);

    if (!response.ok) {
      // Even on error, return structured response so client can persist refused/failed status
      console.error(`Payout API error [${response.status}]:`, rawReason || JSON.stringify(data));
      return new Response(JSON.stringify({
        id: txId || null,
        status: txStatus || 'refused',
        error: friendly,
        refusal_reason: friendly,
        raw_reason: rawReason,
        raw: data,
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      id: txId,
      status: txStatus || 'pending',
      refusal_reason: friendly || null,
      raw_reason: rawReason || null,
      raw: data,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error creating card payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
