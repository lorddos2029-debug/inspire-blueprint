import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FunnelData {
  productId?: string | null;
  productName?: string;
  productPrice?: number;
  productOriginalPrice?: number;
  productDescription?: string;
  productSizes?: string[];
  productColors?: string[];
  reviewsCount?: number;
  reviewsAverage?: number;
  reviewsSample?: Array<{ author?: string; rating?: number; text?: string }>;
  funnel: {
    produto: number;
    dados: number;
    endereco: number;
    pagamento: number;
    pedidos: number;
  };
  period: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const data = (await req.json()) as FunnelData;
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const f = data.funnel;
    const totalEntered = f.produto || f.dados || 1;
    const conversion = totalEntered > 0 ? ((f.pedidos / totalEntered) * 100).toFixed(2) : "0";
    const dropProduto = f.produto > 0 ? (((f.produto - f.dados) / f.produto) * 100).toFixed(1) : "0";
    const dropDados = f.dados > 0 ? (((f.dados - f.endereco) / f.dados) * 100).toFixed(1) : "0";
    const dropEndereco = f.endereco > 0 ? (((f.endereco - f.pagamento) / f.endereco) * 100).toFixed(1) : "0";
    const dropPagamento = f.pagamento > 0 ? (((f.pagamento - f.pedidos) / f.pagamento) * 100).toFixed(1) : "0";

    const reviewsBlock = data.reviewsSample?.length
      ? data.reviewsSample.slice(0, 5).map((r) => `- ${r.rating ?? "?"}/5: "${(r.text || "").slice(0, 200)}"`).join("\n")
      : "Sem avaliações disponíveis.";

    const userPrompt = `Você é um especialista em CRO (Conversion Rate Optimization) e e-commerce de moda masculina brasileira. Analise os dados abaixo e forneça um diagnóstico CURTO, OBJETIVO e ACIONÁVEL sobre por que as pessoas NÃO estão comprando.

PERÍODO ANALISADO: ${data.period}

PRODUTO: ${data.productName || "Geral (todos os produtos)"}
${data.productPrice ? `Preço atual: R$ ${data.productPrice.toFixed(2)}` : ""}
${data.productOriginalPrice ? `Preço original (de): R$ ${data.productOriginalPrice.toFixed(2)} → desconto de ${Math.round(((data.productOriginalPrice - (data.productPrice || 0)) / data.productOriginalPrice) * 100)}%` : ""}
${data.productSizes?.length ? `Tamanhos: ${data.productSizes.join(", ")}` : ""}
${data.productColors?.length ? `Cores: ${data.productColors.join(", ")}` : ""}
${data.productDescription ? `Descrição: ${data.productDescription.slice(0, 400)}` : ""}

AVALIAÇÕES (${data.reviewsCount || 0} reviews, média ${data.reviewsAverage?.toFixed(1) || "N/A"}/5):
${reviewsBlock}

FUNIL COMPLETO:
1. Visitas à página do produto: ${f.produto}
2. Iniciaram checkout (Dados): ${f.dados}  → abandono ${dropProduto}%
3. Preencheram Endereço: ${f.endereco}  → abandono ${dropDados}%
4. Chegaram ao Pagamento: ${f.pagamento}  → abandono ${dropEndereco}%
5. Pedidos confirmados: ${f.pedidos}  → abandono ${dropPagamento}%

TAXA DE CONVERSÃO TOTAL: ${conversion}%

Responda em PORTUGUÊS BRASILEIRO usando este formato EXATO em markdown:

## 🎯 Diagnóstico Principal
[1-2 frases identificando o MAIOR problema]

## 📉 Onde estão perdendo
[Liste os 2-3 pontos críticos do funil com número e %]

## 💡 Causas Prováveis
- **Preço:** [análise]
- **Página do produto:** [análise]
- **Avaliações/Prova social:** [análise]
- **Checkout:** [análise]

## ✅ Ações Recomendadas (em ordem de prioridade)
1. [ação concreta e específica]
2. [ação concreta]
3. [ação concreta]

Seja DIRETO. Sem enrolação. Use dados específicos.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-5",
        messages: [
          { role: "system", content: "Você é um analista sênior de CRO e e-commerce. Suas análises são curtas, baseadas em dados, e altamente acionáveis." },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em alguns segundos." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos na sua workspace." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "Erro na análise de IA" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result = await response.json();
    const analysis = result.choices?.[0]?.message?.content || "Sem resposta da IA";

    return new Response(JSON.stringify({ analysis, metrics: { conversion, dropProduto, dropDados, dropEndereco, dropPagamento } }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-funnel error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
