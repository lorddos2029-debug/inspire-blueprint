import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const toCents = (value: unknown) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.round(numeric * 100) : 0;
};

const normalizeItems = (items: any[], amountInCents: number) => {
  const safeItems = items.map((item) => ({
    title: String(item?.name || 'Produto').trim(),
    quantity: Math.max(1, Number(item?.quantity || 1)),
    originalUnitPrice: Math.max(0, toCents(item?.price)),
  }));

  const originalTotal = safeItems.reduce((sum, item) => sum + item.originalUnitPrice * item.quantity, 0);

  if (originalTotal <= 0) {
    const baseUnitPrice = Math.floor(amountInCents / safeItems.length);
    let remainder = amountInCents - baseUnitPrice * safeItems.length;
    return safeItems.map((item, index) => ({
      title: item.title,
      quantity: item.quantity,
      tangible: true,
      unitPrice: baseUnitPrice + (index === safeItems.length - 1 ? remainder : 0),
    }));
  }

  let allocated = 0;
  const normalized = safeItems.map((item, index) => {
    const lineOriginalTotal = item.originalUnitPrice * item.quantity;
    let lineAllocatedTotal = Math.round((lineOriginalTotal / originalTotal) * amountInCents);
    if (index === safeItems.length - 1) lineAllocatedTotal = amountInCents - allocated;
    allocated += lineAllocatedTotal;
    const unitPrice = Math.floor(lineAllocatedTotal / item.quantity);
    const remainder = lineAllocatedTotal - unitPrice * item.quantity;
    return { title: item.title, quantity: item.quantity, tangible: true, unitPrice, lineRemainder: remainder };
  });

  return normalized.map((item, index) => ({
    title: item.title,
    quantity: item.quantity,
    tangible: item.tangible,
    unitPrice: item.unitPrice + (index === normalized.length - 1 ? item.lineRemainder : 0),
  }));
};

const buildBasePayload = (params: {
  amountInCents: number;
  customer: any;
  shipping: any;
  items: any[];
  externalRef: any;
  trackingParameters: any;
  clientIp: string;
  webhookUrl: string;
}) => {
  const { amountInCents, customer, shipping, items, externalRef, trackingParameters, clientIp, webhookUrl } = params;
  const cpfDigits = (customer?.cpf || '').replace(/\D/g, '');
  const phoneDigits = (customer?.phone || '').replace(/\D/g, '');
  const normalizedItems = normalizeItems(items, amountInCents);

  const payload: Record<string, unknown> = {
    paymentMethod: 'pix',
    amount: amountInCents,
    ip: clientIp,
    postbackUrl: webhookUrl,
    metadata: typeof externalRef === 'string' && externalRef.trim() ? externalRef.trim() : `order-${Date.now()}`,
    customer: {
      name: String(customer?.name || 'Cliente').trim(),
      email: String(customer?.email || 'cliente@email.com').trim(),
      phone: phoneDigits || '11999999999',
      document: { type: 'cpf', number: cpfDigits || '00000000000' },
    },
    items: normalizedItems,
    pix: { expiresInDays: 1 },
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

  const utm = trackingParameters && typeof trackingParameters === 'object' ? trackingParameters as Record<string, unknown> : {};
  const utmFields = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
  const utmObj: Record<string, string> = {};
  utmFields.forEach((key) => {
    const value = utm[key];
    if (typeof value === 'string' && value.trim()) utmObj[key] = value.trim();
  });
  if (Object.keys(utmObj).length > 0) payload.utm = utmObj;

  return payload;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const webhookUrl = `${SUPABASE_URL}/functions/v1/payment-webhook`;

    const body = await req.json();
    const { customer, items, amount, shipping, externalRef, trackingParameters, client_ip, provider: providerOverride } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Items are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Valid amount is required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Decide provider: explicit override > saved setting > default 'primecash'
    let provider: 'payout' | 'primecash' = 'primecash';
    if (providerOverride === 'payout' || providerOverride === 'primecash') {
      provider = providerOverride;
    } else if (SUPABASE_URL && SERVICE_KEY) {
      try {
        const admin = createClient(SUPABASE_URL, SERVICE_KEY);
        const { data: settings } = await admin
          .from('payment_settings')
          .select('pix_provider')
          .eq('id', 1)
          .maybeSingle();
        if (settings?.pix_provider === 'primecash' || settings?.pix_provider === 'payout') {
          provider = settings.pix_provider;
        }
      } catch (e) {
        console.error('Failed to read payment_settings:', e);
      }
    }
    console.log('Using PIX provider:', provider);

    const forwardedIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const clientIp =
      (typeof client_ip === 'string' && client_ip.trim()) ? client_ip.trim() :
      forwardedIp || req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || '177.32.120.10';

    const amountInCents = toCents(amount);
    const payload = buildBasePayload({ amountInCents, customer, shipping, items, externalRef, trackingParameters, clientIp, webhookUrl });

    type ProviderId = 'payout' | 'primecash';
    const callProvider = async (p: ProviderId) => {
      if (p === 'primecash') {
        const key = Deno.env.get('PRIMECASH_SECRET_KEY')?.trim();
        if (!key) throw new Error('PRIMECASH_SECRET_KEY is not configured');
        const authToken = btoa(`${key}:x`);
        console.log('Sending PIX to PrimeCash:', JSON.stringify(payload));
        const r = await fetch('https://api.primecashbrasil.com/v1/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'accept': 'application/json', 'authorization': `Basic ${authToken}` },
          body: JSON.stringify(payload),
        });
        return { response: r, providerName: 'PrimeCash' as const };
      } else {
        const key = Deno.env.get('PAYOUT_SECRET_KEY')?.trim();
        if (!key) throw new Error('PAYOUT_SECRET_KEY is not configured');
        const authToken = btoa(`${key}:x`);
        console.log('Sending PIX to Payout:', JSON.stringify(payload));
        const r = await fetch('https://api.payoutbr.com.br/v1/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'accept': 'application/json', 'authorization': `Basic ${authToken}` },
          body: JSON.stringify(payload),
        });
        return { response: r, providerName: 'Payout' as const };
      }
    };

    const extractQr = (data: any) => {
      const tx = data?.data || data;
      const pix = tx?.pix || tx?.paymentMethod || {};
      const qrCodeText =
        pix?.qrcode || pix?.code || pix?.copyPaste || pix?.copy_paste || pix?.payload || tx?.qrcode || '';
      const qrBase64Raw =
        pix?.qrcodeBase64 || pix?.qrCodeBase64 || pix?.base64 || pix?.image || tx?.qrCodeBase64 || '';
      const qrBase64 = typeof qrBase64Raw === 'string' && qrBase64Raw.startsWith('data:')
        ? qrBase64Raw.split(',')[1] || ''
        : qrBase64Raw;
      return {
        tx,
        qrCodeText,
        qrBase64,
        hasQr: typeof qrCodeText === 'string' && qrCodeText.trim().length > 0,
      };
    };

    const fallbackProvider: ProviderId = provider === 'primecash' ? 'payout' : 'primecash';
    const attempts: Array<{ provider: ProviderId; status: number; message: string }> = [];

    const tryProvider = async (p: ProviderId) => {
      const { response, providerName } = await callProvider(p);
      const data = await response.json().catch(() => ({}));
      console.log(`${providerName} PIX status:`, response.status);
      console.log(`${providerName} PIX response:`, JSON.stringify(data));

      let innerMessage = typeof data?.message === 'string' ? data.message : JSON.stringify(data);
      try {
        const parsed = JSON.parse(innerMessage);
        if (parsed && typeof parsed.message === 'string') innerMessage = parsed.message;
      } catch {}

      if (!response.ok) {
        attempts.push({ provider: p, status: response.status, message: innerMessage });
        return { ok: false as const, providerName, status: response.status, message: innerMessage, data };
      }

      const qr = extractQr(data);
      if (!qr.hasQr) {
        attempts.push({ provider: p, status: response.status, message: 'QR não retornado' });
        return { ok: false as const, providerName, status: response.status, message: 'QR não retornado', data };
      }

      return { ok: true as const, providerName, data, qr };
    };

    let attempt = await tryProvider(provider);
    let usedProvider: ProviderId = provider;

    if (!attempt.ok) {
      console.log(`Primary provider ${provider} failed. Falling back to ${fallbackProvider}.`);
      const fb = await tryProvider(fallbackProvider);
      if (fb.ok) {
        attempt = fb;
        usedProvider = fallbackProvider;
      } else {
        const last = attempts[attempts.length - 1];
        const isAntifraud = /SecureProxy/i.test(last?.message || '') || last?.status === 424;
        const friendly = isAntifraud
          ? `Não foi possível gerar o PIX no momento (antifraude). Tente novamente em instantes ou use outros dados.`
          : `Não foi possível gerar o PIX. Tente novamente em instantes.`;
        return new Response(JSON.stringify({
          status: 'failed',
          error: friendly,
          attempts,
        }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
      }
    }

    const { tx, qrCodeText, qrBase64 } = attempt.qr;
    const result = {
      provider: usedProvider,
      externalRef: typeof externalRef === 'string' ? externalRef : '',
      transactionId: tx?.id || tx?.transactionId || tx?.identifier || '',
      qrCode: qrCodeText,
      qrCodeBase64: qrBase64,
      copyPaste: qrCodeText,
      status: tx?.status || 'PENDING',
      attempts,
    };

    return new Response(JSON.stringify(result), {
      status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    console.error('Error creating PIX payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
