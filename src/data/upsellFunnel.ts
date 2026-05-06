import effervescentImg from "@/assets/upsell-effervescent.png";
import armafImg from "@/assets/upsell-armaf-club-de-nuit.png";
import kit5ArabesImg from "@/assets/upsell-kit5-arabes.png";
import tenisAcademiaImg from "@/assets/upsell-tenis-academia.jpg";
import kitTenisRelogioImg from "@/assets/upsell-kit-tenis-relogio.jpg";
import tenisCamurcaImg from "@/assets/upsell-tenis-camurca.jpg";

export type FunnelStepKind = "upsell" | "downsell";

export interface FunnelStepProduct {
  /** ID único usado no carrinho/order */
  id: number;
  /** Nome do produto exibido nas páginas e salvo no pedido */
  name: string;
  /** Subtítulo curto (aparece sob o título principal) */
  tagline: string;
  /** Imagem principal */
  image: string;
  /** Preço promocional desta etapa */
  price: number;
  /** Preço "de" para mostrar economia */
  originalPrice: number;
  /** Bullets persuasivos */
  bullets: string[];
  /** Headline persuasiva grande */
  headline: string;
  /** Texto pequeno acima do headline */
  badge: string;
  /** Quando definido, exige que o cliente escolha um tamanho antes de pagar */
  sizes?: string[];
}

export interface FunnelStep {
  id: string;
  kind: FunnelStepKind;
  product: FunnelStepProduct;
  /** Para onde ir se o cliente ACEITAR a oferta */
  onAcceptNext: string;
  /** Para onde ir se o cliente RECUSAR a oferta */
  onRejectNext: string;
}

/**
 * Funil infinito:
 *  Effervescent (upsell → downsell) → Armaf (upsell → downsell) → Kit 5 Árabes (upsell → downsell) → /obrigado
 *  Após /obrigado o cliente sai do loop. (Loop "infinito" pode reiniciar voltando a /upsell-perfume1, mas
 *  por padrão fechamos para não cansar — basta trocar a última rota se quiser.)
 */
export const FUNNEL_STEPS: Record<string, FunnelStep> = {
  // ============ 1) EFFERVESCENT ============
  "upsell-perfume1": {
    id: "upsell-perfume1",
    kind: "upsell",
    onAcceptNext: "/upsell-perfume2",
    onRejectNext: "/downsell-perfume1",
    product: {
      id: 9001,
      name: "Perfume de Nicho Effervescent 100ml — LAB 8",
      tagline: "Edição limitada • Fragrância amadeirada efervescente",
      image: effervescentImg,
      price: 59.0,
      originalPrice: 249.9,
      headline: "Leve o perfume de nicho EFFERVESCENT 100ml por apenas R$ 59",
      badge: "OFERTA EXCLUSIVA — APENAS AGORA",
      bullets: [
        "Fragrância de nicho com assinatura única — pouca gente tem.",
        "Frasco premium 100ml com fixação prolongada (8h+).",
        "Notas amadeiradas, frescas e sofisticadas — uso diurno e noturno.",
        "Por apenas R$ 59 hoje (preço normal R$ 249,90).",
      ],
    },
  },
  "downsell-perfume1": {
    id: "downsell-perfume1",
    kind: "downsell",
    onAcceptNext: "/upsell-perfume2",
    onRejectNext: "/upsell-perfume2",
    product: {
      id: 9002,
      name: "Perfume de Nicho Effervescent 100ml — LAB 8 (Oferta Final)",
      tagline: "Última chance • Você não verá esta oferta de novo",
      image: effervescentImg,
      price: 39.0,
      originalPrice: 249.9,
      headline: "ESPERE! Leve o EFFERVESCENT por apenas R$ 39 — última chance",
      badge: "DESCONTO ESPECIAL DE DESPEDIDA",
      bullets: [
        "Última oportunidade de levar este perfume de nicho.",
        "Mesmo frasco 100ml premium, com R$ 20 a menos.",
        "Sem cobrança extra de frete — vai junto do seu pedido.",
        "Por apenas R$ 39, hoje.",
      ],
    },
  },

  // ============ 2) ARMAF CLUB DE NUIT ============
  "upsell-perfume2": {
    id: "upsell-perfume2",
    kind: "upsell",
    onAcceptNext: "/upsell-perfume3",
    onRejectNext: "/downsell-perfume2",
    product: {
      id: 9003,
      name: "Perfume Armaf Club de Nuit Intense Eau de Toilette 105ml Masculino",
      tagline: "Original • O perfume que conquistou o Brasil",
      image: armafImg,
      price: 59.0,
      originalPrice: 399.0,
      headline: "Adicione o ARMAF CLUB DE NUIT INTENSE 105ml por apenas R$ 59",
      badge: "ÚNICA CHANCE NESSE PREÇO",
      bullets: [
        "Original, frasco 105ml lacrado direto do importador.",
        "Notas de bergamota, maçã preta, ananás e baunilha.",
        "Fixação espantosa (10h+) e projeção marcante.",
        "Preço de loja física: R$ 399 — hoje, R$ 59.",
      ],
    },
  },
  "downsell-perfume2": {
    id: "downsell-perfume2",
    kind: "downsell",
    onAcceptNext: "/upsell-perfume3",
    onRejectNext: "/upsell-perfume3",
    product: {
      id: 9004,
      name: "Perfume Armaf Club de Nuit Intense 105ml (Oferta Final)",
      tagline: "Último desconto disponível",
      image: armafImg,
      price: 39.0,
      originalPrice: 399.0,
      headline: "ESPERE! Leve o ARMAF CLUB DE NUIT por apenas R$ 39",
      badge: "OFERTA DE DESPEDIDA",
      bullets: [
        "Mesmo frasco 105ml original, R$ 20 a menos.",
        "Não verá esta oferta novamente.",
        "Vai junto do seu pedido — sem frete extra.",
        "Por apenas R$ 39 — hoje.",
      ],
    },
  },

  // ============ 3) KIT 5 BODY SPLASH ÁRABES ============
  "upsell-perfume3": {
    id: "upsell-perfume3",
    kind: "upsell",
    onAcceptNext: "/resolverastreio",
    onRejectNext: "/downsell-perfume3",
    product: {
      id: 9005,
      name: "Kit 5 Body Splash Masculinos 60ml — Perfumes Árabes",
      tagline: "5 fragrâncias árabes em 1 kit completo",
      image: kit5ArabesImg,
      price: 59.0,
      originalPrice: 349.5,
      headline: "Complete sua coleção: KIT 5 BODY SPLASH ÁRABES por R$ 59",
      badge: "KIT COMPLETO 5 FRAGRÂNCIAS",
      bullets: [
        "5 fragrâncias árabes selecionadas em frascos 60ml cada.",
        "Inclui Madeira, Essência Homem, Kayrox e Intenso.",
        "Perfeito para variar o perfume todos os dias.",
        "Valor unitário: R$ 69,90 — Kit hoje por R$ 59.",
      ],
    },
  },
  "downsell-perfume3": {
    id: "downsell-perfume3",
    kind: "downsell",
    onAcceptNext: "/resolverastreio",
    onRejectNext: "/resolverastreio",
    product: {
      id: 9006,
      name: "Kit 5 Body Splash Masculinos 60ml — Árabes (Oferta Final)",
      tagline: "Última oferta do funil",
      image: kit5ArabesImg,
      price: 39.0,
      originalPrice: 349.5,
      headline: "ÚLTIMA CHANCE: Kit 5 Body Splash Árabes por R$ 39",
      badge: "OFERTA FINAL DE DESPEDIDA",
      bullets: [
        "5 fragrâncias árabes 60ml — completas.",
        "R$ 20 OFF a mais nesta tela final.",
        "Não verá esta oferta novamente.",
        "Por apenas R$ 39 — vai junto do seu pedido.",
      ],
    },
  },

  // ============================================================
  //                  FUNIL DE TÊNIS (SLIP ON)
  // ============================================================
  // 1) TÊNIS ACADEMIA / CORRIDA
  "upsell-tenis1": {
    id: "upsell-tenis1",
    kind: "upsell",
    onAcceptNext: "/upsell-tenis2",
    onRejectNext: "/downsell-tenis1",
    product: {
      id: 9101,
      name: "Tênis Masculino Academia Esportivo Leve Confortável Caminhada Corrida",
      tagline: "Leve, respirável, ideal para academia e corrida",
      image: tenisAcademiaImg,
      price: 47.0,
      originalPrice: 249.9,
      headline: "Adicione o TÊNIS ACADEMIA por apenas R$ 47",
      badge: "OFERTA EXCLUSIVA — APENAS AGORA",
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
      bullets: [
        "Cabedal em malha respirável (mesh) — pé fresco o dia todo.",
        "Entressola EVA com absorção de impacto e retorno de energia.",
        "Solado emborrachado antiderrapante — segurança em todo piso.",
        "Apenas 280g — extremamente leve, ideal para treino e corrida.",
      ],
    },
  },
  "downsell-tenis1": {
    id: "downsell-tenis1",
    kind: "downsell",
    onAcceptNext: "/upsell-tenis2",
    onRejectNext: "/upsell-tenis2",
    product: {
      id: 9102,
      name: "Tênis Masculino Academia Esportivo (Oferta Final)",
      tagline: "Última chance • Você não verá esta oferta de novo",
      image: tenisAcademiaImg,
      price: 37.0,
      originalPrice: 249.9,
      headline: "ESPERE! Leve o TÊNIS ACADEMIA por apenas R$ 37",
      badge: "DESCONTO ESPECIAL DE DESPEDIDA",
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
      bullets: [
        "Mesmo modelo leve e respirável — agora com R$ 10 a menos.",
        "Vai junto do seu pedido — sem cobrança extra de frete.",
        "Última oportunidade nesta tela.",
        "Apenas R$ 37, hoje.",
      ],
    },
  },

  // 2) KIT TÊNIS + RELÓGIO DIGITAL
  "upsell-tenis2": {
    id: "upsell-tenis2",
    kind: "upsell",
    onAcceptNext: "/upsell-tenis3",
    onRejectNext: "/downsell-tenis2",
    product: {
      id: 9103,
      name: "Kit Tênis Esportivo + Relógio Digital Fitness",
      tagline: "Tênis premium + relógio digital — kit completo",
      image: kitTenisRelogioImg,
      price: 47.0,
      originalPrice: 349.9,
      headline: "KIT TÊNIS + RELÓGIO DIGITAL por apenas R$ 47",
      badge: "KIT COMPLETO — BRINDE EXCLUSIVO",
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
      bullets: [
        "1 Tênis esportivo branco premium + 1 relógio digital fitness.",
        "Relógio LED com cronômetro, alarme e pulseira de silicone.",
        "Kit perfeito para academia, corrida e dia a dia.",
        "Valor unitário do kit: R$ 349 — hoje, R$ 59.",
      ],
    },
  },
  "downsell-tenis2": {
    id: "downsell-tenis2",
    kind: "downsell",
    onAcceptNext: "/upsell-tenis3",
    onRejectNext: "/upsell-tenis3",
    product: {
      id: 9104,
      name: "Kit Tênis Esportivo + Relógio Digital (Oferta Final)",
      tagline: "Última oferta deste kit",
      image: kitTenisRelogioImg,
      price: 37.0,
      originalPrice: 349.9,
      headline: "ESPERE! Leve o KIT TÊNIS + RELÓGIO por apenas R$ 37",
      badge: "OFERTA DE DESPEDIDA",
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
      bullets: [
        "Mesmo kit completo (tênis + relógio), com R$ 10 OFF.",
        "Não verá esta oferta novamente.",
        "Vai junto do seu pedido — sem frete extra.",
        "Por apenas R$ 37 — hoje.",
      ],
    },
  },

  // 3) TÊNIS CAMURÇA CADARÇO TRANÇADO
  "upsell-tenis3": {
    id: "upsell-tenis3",
    kind: "upsell",
    onAcceptNext: "/resolverastreio",
    onRejectNext: "/downsell-tenis3",
    product: {
      id: 9105,
      name: "Tênis Masculino Camurça Cadarço Trançado Envio Seguro",
      tagline: "Estilo urbano premium • Camurça com cadarço trançado",
      image: tenisCamurcaImg,
      price: 47.0,
      originalPrice: 299.9,
      headline: "Complete sua coleção: TÊNIS CAMURÇA por R$ 47",
      badge: "EDIÇÃO PREMIUM — ÚLTIMOS PARES",
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
      bullets: [
        "Cabedal em camurça premium com toque macio e elegante.",
        "Cadarço trançado exclusivo — visual urbano marcante.",
        "Solado branco em borracha resistente, com excelente aderência.",
        "Combina com jeans, social e looks casuais — vale por 2 tênis.",
      ],
    },
  },
  "downsell-tenis3": {
    id: "downsell-tenis3",
    kind: "downsell",
    onAcceptNext: "/resolverastreio",
    onRejectNext: "/resolverastreio",
    product: {
      id: 9106,
      name: "Tênis Masculino Camurça Cadarço Trançado (Oferta Final)",
      tagline: "Última oferta do funil",
      image: tenisCamurcaImg,
      price: 37.0,
      originalPrice: 299.9,
      headline: "ÚLTIMA CHANCE: Tênis Camurça por R$ 37",
      badge: "OFERTA FINAL DE DESPEDIDA",
      sizes: ["37", "38", "39", "40", "41", "42", "43"],
      bullets: [
        "Mesmo tênis camurça premium com cadarço trançado.",
        "R$ 10 OFF a mais nesta tela final.",
        "Não verá esta oferta novamente.",
        "Por apenas R$ 37 — vai junto do seu pedido.",
      ],
    },
  },
};

export const getFunnelStep = (stepId: string): FunnelStep | undefined => FUNNEL_STEPS[stepId];
