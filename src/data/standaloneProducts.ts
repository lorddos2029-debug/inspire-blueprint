import relogioImg from "@/assets/products/relogio-classic.jpg";
import relogioChronosImg from "@/assets/products/relogio-chronos.jpg";
import relogioPaganiImg from "@/assets/products/relogio-pagani.jpg";
import carteiraImg from "@/assets/products/carteira-couro.jpg";
import oculosImg from "@/assets/products/oculos-aviador.jpg";
import cintoImg from "@/assets/products/cinto-couro.jpg";
import mocassimImg from "@/assets/products/mocassim-premium.jpg";
import sueterImg from "@/assets/products/sueter-tricot.jpg";
import camisaTricotImg from "@/assets/products/camisa-tricot-1.jpg";
import techDailyInsiderImg from "@/assets/products/tech-daily-preto-1.png";
import techDailyInsiderPremiumImg from "@/assets/products/tech-daily-v2-1.png";

export interface StandaloneProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  tag?: string;
}

export const standaloneProducts: StandaloneProduct[] = [
  {
    id: "sp-1",
    slug: "relogio-classic-silver-masculino",
    name: "Relógio Classic Silver Masculino",
    price: 97.90,
    originalPrice: 349.90,
    image: relogioImg,
    images: [relogioImg, relogioChronosImg, relogioPaganiImg],
    tag: "72% OFF",
  },
  {
    id: "sp-2",
    slug: "carteira-couro-legitimo-premium",
    name: "Carteira Couro Legítimo Premium",
    price: 79.90,
    originalPrice: 149.90,
    image: carteiraImg,
    tag: "47% OFF",
  },
  {
    id: "sp-3",
    slug: "oculos-aviador-polarizado-uv400",
    name: "Óculos Aviador Polarizado UV400",
    price: 99.90,
    originalPrice: 199.90,
    image: oculosImg,
    tag: "50% OFF",
  },
  {
    id: "sp-4",
    slug: "cinto-couro-reversivel-dupla-face",
    name: "Cinto Couro Reversível Dupla Face",
    price: 69.90,
    originalPrice: 129.90,
    image: cintoImg,
    tag: "46% OFF",
  },
  {
    id: "sp-5",
    slug: "mocassim-premium-camurca-masculino",
    name: "Mocassim Premium Camurça Masculino",
    price: 249.90,
    originalPrice: 459.90,
    image: mocassimImg,
    tag: "46% OFF",
  },
  {
    id: "sp-6",
    slug: "sueter-tricot-gola-redonda-masculino",
    name: "Suéter Tricot Gola Redonda Masculino",
    price: 159.90,
    originalPrice: 279.90,
    image: sueterImg,
    tag: "43% OFF",
  },
  {
    id: "sp-7",
    slug: "camisa-camiseta-estilosa-masculina-malha-tricot-texturizada",
    name: "Camisa Camiseta Estilosa Masculina Malha Tricot Texturizada",
    price: 45.00,
    originalPrice: 119.90,
    image: camisaTricotImg,
    tag: "62% OFF",
  },
  {
    id: "sp-8",
    slug: "camiseta-basica-tech-daily-insider",
    name: "Camiseta Básica Tech Daily Insider",
    price: 59.90,
    originalPrice: 129.90,
    image: techDailyInsiderImg,
    tag: "54% OFF",
  },
  {
    id: "sp-9",
    slug: "camiseta-basica-tech-daily-insider-modal-premium",
    name: "Camiseta Básica Tech Daily Insider Premium",
    price: 69.90,
    originalPrice: 149.90,
    image: techDailyInsiderPremiumImg,
    tag: "53% OFF",
  },
];
