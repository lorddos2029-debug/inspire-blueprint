import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { customer, items, amount, externalRef, trackingParameters } = body;

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

    const publicKey = Deno.env.get('VUMEPAY_PUBLIC_KEY')?.trim();
    const secretKey = Deno.env.get('VUMEPAY_SECRET_KEY')?.trim();
    if (!publicKey || !secretKey) throw new Error('VUMEPAY credentials are not configured');

    const cpfDigits = (customer?.cpf || '').replace(/\D/g, '');
    const phoneDigits = (customer?.phone || '').replace(/\D/g, '');
    const amountFloat = Math.round(Number(amount) * 100) / 100;

    const description = items
      .map((it: any) => `${it?.quantity || 1}x ${String(it?.name || 'Produto').trim()}`)
      .join(', ')
      .slice(0, 255) || 'Pagamento via PIX';

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

    console.log('Sending PIX to VumePay:', JSON.stringify(payload));
    const response = await fetch('https://api.vumepay.com.br/api/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Public-Key': publicKey,
        'X-Secret-Key': secretKey,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));
    console.log('VumePay PIX status:', response.status);
    console.log('VumePay PIX response:', JSON.stringify(data));

    if (!response.ok || data?.success === false) {
      const msg = data?.message || data?.error || 'Não foi possível gerar o PIX. Tente novamente em instantes.';
      return new Response(JSON.stringify({
        status: 'failed',
        error: msg,
        attempts: [{ provider: 'vumepay', status: response.status, message: msg }],
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const tx = data?.data || data;
    const pix = tx?.pix || {};
    const qrCodeText = pix?.qr_code || pix?.qrCode || pix?.code || pix?.copyPaste || '';
    const qrBase64Raw = pix?.qr_code_image || pix?.qrCodeBase64 || pix?.base64 || '';
    const qrBase64 = typeof qrBase64Raw === 'string' && qrBase64Raw.startsWith('data:')
      ? qrBase64Raw.split(',')[1] || ''
      : qrBase64Raw || '';

    if (!qrCodeText || typeof qrCodeText !== 'string' || !qrCodeText.trim()) {
      return new Response(JSON.stringify({
        status: 'failed',
        error: 'QR não retornado. Tente novamente em instantes.',
        attempts: [{ provider: 'vumepay', status: response.status, message: 'QR não retornado' }],
      }), { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const result = {
      provider: 'vumepay',
      externalRef: typeof externalRef === 'string' ? externalRef : '',
      transactionId: tx?.transaction_id || tx?.id || '',
      qrCode: qrCodeText,
      qrCodeBase64: qrBase64,
      copyPaste: qrCodeText,
      status: tx?.status || 'pending',
      attempts: [],
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
