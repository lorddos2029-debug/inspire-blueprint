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
  const originalTotal = safeItems.reduce((s, it) => s + it.originalUnitPrice * it.quantity, 0);
  if (originalTotal <= 0) {
    const base = Math.floor(amountInCents / safeItems.length);
    const rem = amountInCents - base * safeItems.length;
    return safeItems.map((it, i) => ({ title: it.title, quantity: it.quantity, tangible: true, unitPrice: base + (i === safeItems.length - 1 ? rem : 0) }));
  }
  let allocated = 0;
  const normalized = safeItems.map((it, i) => {
    const lineOrig = it.originalUnitPrice * it.quantity;
    let lineAlloc = Math.round((lineOrig / originalTotal) * amountInCents);
    if (i === safeItems.length - 1) lineAlloc = amountInCents - allocated;
    allocated += lineAlloc;
    const unit = Math.floor(lineAlloc / it.quantity);
    const rem = lineAlloc - unit * it.quantity;
    return { title: it.title, quantity: it.quantity, tangible: true, unitPrice: unit, lineRemainder: rem };
  });
  return normalized.map((it, i) => ({ title: it.title, quantity: it.quantity, tangible: it.tangible, unitPrice: it.unitPrice + (i === normalized.length - 1 ? it.lineRemainder : 0) }));
};

async function getProvider(): Promise<string> {
  try {
    const url = Deno.env.get('SUPABASE_URL') || '';
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || Deno.env.get('SUPABASE_ANON_KEY') || '';
    const supabase = createClient(url, key);
    const { data } = await supabase.from('payment_settings').select('pix_provider').eq('id', 1).maybeSingle();
    return (data?.pix_provider as string) || 'primecash';
  } catch {
    return 'primecash';
  }
}

async function callVumePay(params: { customer: any; items: any[]; amount: number; externalRef?: string; trackingParameters?: any }) {
  const publicKey = Deno.env.get('VUMEPAY_PUBLIC_KEY')?.trim();
  const secretKey = Deno.env.get('VUMEPAY_SECRET_KEY')?.trim();
  if (!publicKey || !secretKey) throw new Error('VUMEPAY credentials are not configured');

  const { customer, items, amount, externalRef, trackingParameters } = params;
  const cpfDigits = (customer?.cpf || '').replace(/\D/g, '');
  const phoneDigits = (customer?.phone || '').replace(/\D/g, '');
  const amountFloat = Math.round(Number(amount) * 100) / 100;
  const description = items.map((it: any) => `${it?.quantity || 1}x ${String(it?.name || 'Produto').trim()}`).join(', ').slice(0, 255) || 'Pagamento via PIX';

  const payload: Record<string, unknown> = {
    amount: amountFloat,
    description,
    customer: {
      name: String(customer?.name || 'Cliente').trim(),
      email: String(customer?.email || 'cliente@email.com').trim(),
      phone: phoneDigits || undefined,
      document: cpfDigits || undefined,
    },
  };
  const utm = trackingParameters && typeof trackingParameters === 'object' ? trackingParameters as Record<string, unknown> : {};
  const metadata: Record<string, unknown> = {};
  if (typeof externalRef === 'string' && externalRef.trim()) metadata.externalRef = externalRef.trim();
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => {
    const v = utm[k];
    if (typeof v === 'string' && v.trim()) metadata[k] = v.trim();
  });
  if (Object.keys(metadata).length > 0) payload.metadata = metadata;

  const response = await fetch('https://api.vumepay.com.br/api/v1/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json', 'X-Public-Key': publicKey, 'X-Secret-Key': secretKey },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  console.log('VumePay PIX status:', response.status, 'response:', JSON.stringify(data));

  if (!response.ok || data?.success === false) {
    const msg = data?.message || data?.error || 'Não foi possível gerar o PIX. Tente novamente em instantes.';
    return { ok: false, error: msg, attempt: { provider: 'vumepay', status: response.status, message: msg } };
  }
  const tx = data?.data || data;
  const pix = tx?.pix || {};
  const qrCodeText = pix?.qr_code || pix?.qrCode || pix?.code || pix?.copyPaste || '';
  const qrBase64Raw = pix?.qr_code_image || pix?.qrCodeBase64 || pix?.base64 || '';
  const qrBase64 = typeof qrBase64Raw === 'string' && qrBase64Raw.startsWith('data:') ? qrBase64Raw.split(',')[1] || '' : qrBase64Raw || '';
  if (!qrCodeText) return { ok: false, error: 'QR não retornado.', attempt: { provider: 'vumepay', status: response.status, message: 'QR não retornado' } };
  return {
    ok: true,
    result: {
      provider: 'vumepay',
      externalRef: typeof externalRef === 'string' ? externalRef : '',
      transactionId: tx?.transaction_id || tx?.id || '',
      qrCode: qrCodeText,
      qrCodeBase64: qrBase64,
      copyPaste: qrCodeText,
      status: tx?.status || 'pending',
      attempts: [],
    },
  };
}

async function callPrimeCash(params: { customer: any; items: any[]; amount: number; shipping?: any; externalRef?: string; trackingParameters?: any; clientIp: string; webhookUrl: string; providerLabel?: string; secretEnvKey?: string; apiUrl?: string }) {
  const envKey = params.secretEnvKey || 'PRIMECASH_SECRET_KEY_V2';
  const providerLabel = params.providerLabel || 'primecash';
  // PrimeCash atualizada (app.useprimecash.com): host novo + Basic auth com a chave secreta.
  const primecashHost = Deno.env.get('PRIMECASH_API_HOST')?.trim() || 'api.useprimecash.com';
  const apiUrl = params.apiUrl || `https://${primecashHost}/v1/transactions`;
  const key = Deno.env.get(envKey)?.trim() || Deno.env.get('PRIMECASH_SECRET_KEY')?.trim();
  console.log('primecash auth env used:', Deno.env.get(envKey) ? envKey : 'PRIMECASH_SECRET_KEY', 'host:', primecashHost, 'keyLen:', key?.length ?? 0);
  if (!key) throw new Error(`${envKey} is not configured`);
  const { customer, items, amount, shipping, externalRef, trackingParameters, clientIp, webhookUrl } = params;
  const amountInCents = toCents(amount);
  const cpfDigits = (customer?.cpf || '').replace(/\D/g, '');
  const phoneDigits = (customer?.phone || '').replace(/\D/g, '');
  const normalizedItems = normalizeItems(items, amountInCents);

  const utm = trackingParameters && typeof trackingParameters === 'object' ? trackingParameters as Record<string, unknown> : {};
  const utmObj: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'src', 'sck'].forEach((k) => {
    const v = utm[k];
    if (typeof v === 'string' && v.trim()) utmObj[k] = v.trim();
  });
  
  // Backfill if missing but identifiable
  if (!utmObj.utm_source) {
     if (utm.fbclid) utmObj.utm_source = 'facebook';
     else if (utm.gclid) utmObj.utm_source = 'google';
     else if (utm.ttclid) utmObj.utm_source = 'tiktok';
     else if (utm.kwai_click_id) utmObj.utm_source = 'kwai';
  }
  
  if (utmObj.utm_source) {
    if (!utmObj.utm_medium) utmObj.utm_medium = 'paid';
    if (!utmObj.utm_campaign) utmObj.utm_campaign = 'ads_campaign';
  }

  const zipcode = (shipping?.cep || '').replace(/\D/g, '');
  const addressLine = shipping
    ? `${shipping.street || ''}, ${shipping.number || ''}${shipping.complement ? ` - ${shipping.complement}` : ''}, ${shipping.neighborhood || ''}, ${shipping.city || ''} - ${shipping.state || ''}, CEP: ${shipping.cep || ''}`
    : undefined;
  const addressObj = shipping
    ? {
        street: shipping.street || '',
        streetNumber: shipping.number || '',
        complement: shipping.complement || '',
        neighborhood: shipping.neighborhood || '',
        city: shipping.city || '',
        state: shipping.state || '',
        zipCode: zipcode,
        zipcode,
        country: 'BR',
      }
    : undefined;
  const extRef = typeof externalRef === 'string' && externalRef.trim() ? externalRef.trim() : `order-${Date.now()}`;

  const payload: Record<string, unknown> = {
    paymentMethod: 'pix',
    amount: amountInCents,
    ip: clientIp,
    postbackUrl: webhookUrl,
    externalRef: extRef,
    // A PrimeCash atualizada exige metadata como string.
    metadata: JSON.stringify({
      externalRef: extRef,
      ...utmObj,
      customer_address: addressLine,
      ...(addressObj ? { address: addressObj } : {}),
    }),
    customer: {
      name: String(customer?.name || 'Cliente').trim(),
      email: String(customer?.email || 'cliente@email.com').trim(),
      phone: phoneDigits || '11999999999',
      document: { type: 'cpf', number: cpfDigits || '00000000000' },
      ...(addressObj ? { address: addressObj } : {}),
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
      zipcode,
      country: 'BR',
    };
  }
  if (Object.keys(utmObj).length > 0) payload.utm = utmObj;

  const authToken = btoa(`${key}:x`);
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'accept': 'application/json', 'authorization': `Basic ${authToken}` },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  console.log(`${providerLabel} PIX status:`, response.status, 'response:', JSON.stringify(data));

  if (!response.ok) {
    let inner = typeof data?.message === 'string' ? data.message : JSON.stringify(data);
    try { const p = JSON.parse(inner); if (p?.message) inner = p.message; } catch {}
    const isAntifraud = /SecureProxy/i.test(inner || '') || response.status === 424;
    const friendly = isAntifraud ? 'Não foi possível gerar o PIX no momento (antifraude). Tente novamente em instantes.' : 'Não foi possível gerar o PIX. Tente novamente em instantes.';
    return { ok: false, error: friendly, attempt: { provider: providerLabel, status: response.status, message: inner } };
  }
  const tx = data?.data || data;
  const pix = tx?.pix || tx?.paymentMethod || {};
  const qrCodeText = pix?.qrcode || pix?.code || pix?.copyPaste || pix?.copy_paste || pix?.payload || tx?.qrcode || '';
  const qrBase64Raw = pix?.qrcodeBase64 || pix?.qrCodeBase64 || pix?.base64 || pix?.image || tx?.qrCodeBase64 || '';
  const qrBase64 = typeof qrBase64Raw === 'string' && qrBase64Raw.startsWith('data:') ? qrBase64Raw.split(',')[1] || '' : qrBase64Raw;
  if (!qrCodeText) return { ok: false, error: 'QR não retornado.', attempt: { provider: providerLabel, status: response.status, message: 'QR não retornado' } };
  return {
    ok: true,
    result: {
      provider: providerLabel,
      externalRef: typeof externalRef === 'string' ? externalRef : '',
      transactionId: tx?.id || tx?.transactionId || tx?.identifier || '',
      qrCode: qrCodeText,
      qrCodeBase64: qrBase64,
      copyPaste: qrCodeText,
      status: tx?.status || 'PENDING',
      attempts: [],
    },
  };
}

async function callPinPay(params: { customer: any; items: any[]; amount: number; externalRef?: string; trackingParameters?: any; webhookUrl?: string }) {
  const secretKey = Deno.env.get('PINPAY_SECRET_KEY')?.trim();
  if (!secretKey) throw new Error('PINPAY_SECRET_KEY is not configured');

  const { customer, items, amount, externalRef, trackingParameters, webhookUrl } = params;
  const amountInCents = toCents(amount);
  const cpfDigits = (customer?.cpf || '').replace(/\D/g, '');
  const description = items.map((it: any) => `${it?.quantity || 1}x ${String(it?.name || 'Produto').trim()}`).join(', ').slice(0, 140) || 'Pagamento via PIX';
  const extRef = (typeof externalRef === 'string' && externalRef.trim()) ? externalRef.trim() : `order-${Date.now()}`;
  const utm = trackingParameters && typeof trackingParameters === 'object' ? trackingParameters as Record<string, unknown> : {};
  const str = (k: string) => (typeof utm[k] === 'string' && utm[k] ? String(utm[k]) : null);
  const utmFields = {
    utm_source: str('utm_source'),
    utm_campaign: str('utm_campaign'),
    utm_medium: str('utm_medium'),
    utm_content: str('utm_content'),
    utm_term: str('utm_term'),
    src: str('src'),
    sck: str('sck'),
  };
  // Repassa as UTMs na URL de checkout também: integrações nativas do gateway
  // (ex.: UTMify pelo PinPay) leem a query string para atribuir a origem.
  const utmQuery = Object.entries(utmFields)
    .filter(([, v]) => !!v)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join('&');
  const checkoutUrl = (typeof utm.checkout_url === 'string' && utm.checkout_url)
    || `https://belacasaoficial.online/checkout${utmQuery ? `?${utmQuery}` : ''}`;

  const payload: Record<string, unknown> = {
    amount: amountInCents,
    description,
    external_reference: extRef,
    externalRef: extRef,
    // Garante que o PinPay notifique nosso webhook (marca o pedido como pago e
    // envia o evento "paid" para a UTMify já com os parâmetros de campanha).
    ...(webhookUrl ? { postback_url: webhookUrl, postbackUrl: webhookUrl, webhook_url: webhookUrl, callback_url: webhookUrl } : {}),
    customer: {
      name: String(customer?.name || 'Cliente').trim(),
      email: String(customer?.email || 'cliente@email.com').trim(),
      document: { number: cpfDigits || '00000000000' },
    },
    utm: utmFields,
    tracking_parameters: utmFields,
    metadata: {
      external_reference: extRef,
      order_id: extRef,
      checkout_url: checkoutUrl,
      ...utmFields,
    },
  };

  const response = await fetch('https://api.usepinpay.com/functions/v1/api-v1/pix', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Bearer ${secretKey}`,
    },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  console.log('PinPay PIX status:', response.status, 'response:', JSON.stringify(data));

  if (!response.ok) {
    const msg = data?.message || data?.error || 'Não foi possível gerar o PIX. Tente novamente em instantes.';
    return { ok: false, error: msg, attempt: { provider: 'pinpay', status: response.status, message: typeof msg === 'string' ? msg : JSON.stringify(data) } };
  }
  const tx = data?.data || data;
  const pix = tx?.pix || {};
  const qrCodeText = pix?.qr_code || pix?.qrCode || pix?.code || pix?.copyPaste || '';
  const qrBase64Raw = pix?.qr_code_base64 || pix?.qrCodeBase64 || pix?.base64 || '';
  const qrBase64 = typeof qrBase64Raw === 'string' && qrBase64Raw.startsWith('data:') ? qrBase64Raw.split(',')[1] || '' : qrBase64Raw || '';
  if (!qrCodeText) return { ok: false, error: 'QR não retornado.', attempt: { provider: 'pinpay', status: response.status, message: 'QR não retornado' } };
  return {
    ok: true,
    result: {
      provider: 'pinpay',
      externalRef: extRef,
      transactionId: tx?.id || tx?.transaction_id || '',
      qrCode: qrCodeText,
      qrCodeBase64: qrBase64,
      copyPaste: qrCodeText,
      status: tx?.status || 'pending',
      attempts: [],
    },
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  try {
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
    const webhookUrl = `${SUPABASE_URL}/functions/v1/payment-webhook`;
    const body = await req.json();
    const { customer, items: rawItems, amount, shipping, externalRef, trackingParameters, client_ip, provider: providerOverride } = body;

    if (!rawItems || !Array.isArray(rawItems) || rawItems.length === 0) {
      return new Response(JSON.stringify({ error: 'Items are required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // Send the original product name to the payment gateway
    const items = rawItems.map((it: any) => {
      let name = String(it?.name || 'Produto').trim();
      if (name.includes("GOKOCO Escova modeladora")) {
        name = "Escova modeladora de íons negativos de 38 mm – 9 ajustes de temperatura";
      }
      return { ...it, name };
    });
    if (!amount || amount <= 0) {
      return new Response(JSON.stringify({ error: 'Valid amount is required' }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const forwardedIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
    const clientIp = (typeof client_ip === 'string' && client_ip.trim()) ? client_ip.trim()
      : forwardedIp || req.headers.get('cf-connecting-ip') || req.headers.get('x-real-ip') || '177.32.120.10';

    const provider = (typeof providerOverride === 'string' && providerOverride.trim()) ? providerOverride.trim() : await getProvider();
    console.log('PIX provider selected:', provider);

    let outcome;
    if (provider === 'payout') {
      outcome = await callPrimeCash({ customer, items, amount, shipping, externalRef, trackingParameters, clientIp, webhookUrl, providerLabel: 'payout', secretEnvKey: 'PAYOUT_SECRET_KEY', apiUrl: 'https://api.payoutbr.com.br/v1/transactions' });
    } else if (provider === 'vumepay') {
      outcome = await callVumePay({ customer, items, amount, externalRef, trackingParameters });
    } else if (provider === 'pinpay') {
      outcome = await callPinPay({ customer, items, amount, externalRef, trackingParameters, webhookUrl });
    } else {
      outcome = await callPrimeCash({ customer, items, amount, shipping, externalRef, trackingParameters, clientIp, webhookUrl, providerLabel: 'primecash', secretEnvKey: 'PRIMECASH_SECRET_KEY' });
    }

    if (!outcome.ok) {
      return new Response(JSON.stringify({ status: 'failed', error: outcome.error, attempts: [outcome.attempt] }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify(outcome.result), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: unknown) {
    console.error('Error creating PIX payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: errorMessage }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
