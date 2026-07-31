const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  const { id } = await req.json().catch(() => ({ id: "" }));
  const key = Deno.env.get("PINPAY_SECRET_KEY")!.trim();
  const base = "https://api.usepinpay.com/functions/v1/api-v1";
  const urls = [
    `${base}/transactions`,
    `${base}/transactions?limit=3`,
    `${base}/transactions/${id}`,
    `${base}/pix/${id}`,
    `${base}/transactions?external_reference=${id}`,
  ];
  const out: any[] = [];
  for (const u of urls) {
    try {
      const r = await fetch(u, { headers: { Accept: "application/json", Authorization: `Bearer ${key}` } });
      const t = await r.text();
      out.push({ u, status: r.status, body: t.slice(0, 800) });
    } catch (e) { out.push({ u, error: String(e) }); }
  }
  return new Response(JSON.stringify(out, null, 2), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
