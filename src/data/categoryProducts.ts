import camisaPoloClockImg from "@/assets/products/camisa-polo-clock.jpg";
import camisaPoloCourtImg from "@/assets/products/camisa-polo-court.jpg";
import relogioPaganiImg from "@/assets/products/relogio-pagani.jpg";
import relogioChronosImg from "@/assets/products/relogio-chronos.jpg";
import shortLinhoImg from "@/assets/products/short-linho-kit.jpg";
import camisaLinhoImg from "@/assets/products/camisa-linho-rout.jpg";
import sapatoOxfordImg from "@/assets/products/sapato-oxford.jpg";
import portaCartaoImg from "@/assets/products/porta-cartao.jpg";
import perfumeKitImg from "@/assets/perfume-kit-trio.png";
import perfumeKitDuoImg from "@/assets/perfume-kit-duo.png";
import perfumeEnigmaImg from "@/assets/perfume-enigma.png";

export interface CategoryProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
  slug?: string;
}

export interface ProductCategory {
  title: string;
  products: CategoryProduct[];
}

export const productCategories: ProductCategory[] = [
  {
    title: "Camisa Polo",
    products: [
      {
        id: "cat-polo-1",
        name: "Camisa Polo Clock",
        price: 209.00,
        image: camisaPoloClockImg,
        slug: "camisa-polo-ventura-masculina",
      },
      {
        id: "cat-polo-2",
        name: "Camisa Polo Court",
        price: 219.00,
        image: camisaPoloCourtImg,
        slug: "camisa-polo-court",
      },
    ],
  },
  {
    title: "Relógios",
    products: [
      {
        id: "cat-rel-1",
        name: "Relógio Automático Pagani Luxury",
        price: 949.00,
        originalPrice: 1080.00,
        image: relogioPaganiImg,
        tag: "5% OFF",
        slug: "relogio-automatico-pagani-luxury",
      },
      {
        id: "cat-rel-2",
        name: "Relógio Chronos Poedagar",
        price: 189.00,
        image: relogioChronosImg,
        slug: "relogio-chronos-poedagar",
      },
    ],
  },
  {
    title: "Shorts & Camisas",
    products: [
      {
        id: "cat-short-1",
        name: "Kit 4 Short Masculino Linho Bermuda",
        price: 69.90,
        originalPrice: 159.90,
        image: shortLinhoImg,
        tag: "56% OFF",
        slug: "kit-4-short-masculino-linho-bermuda-confortavel-verao-praia-festa",
      },
      {
        id: "cat-short-2",
        name: "Camisa Linho Rout Manga Curta",
        price: 189.00,
        originalPrice: 249.00,
        image: camisaLinhoImg,
        tag: "24% OFF",
        slug: "camisa-linho-rout-manga-curta",
      },
    ],
  },
  {
    title: "Calçados & Acessórios",
    products: [
      {
        id: "cat-calc-1",
        name: "Sapato Oxford Couro Legítimo",
        price: 289.90,
        originalPrice: 459.90,
        image: sapatoOxfordImg,
        tag: "37% OFF",
        slug: "sapato-oxford-couro-legitimo",
      },
      {
        id: "cat-calc-2",
        name: "Porta-Cartão Slim Couro Premium",
        price: 59.90,
        originalPrice: 99.90,
        image: portaCartaoImg,
        tag: "40% OFF",
        slug: "porta-cartao-slim-couro-premium",
      },
    ],
  },
  {
    title: "Perfumes",
    products: [
      {
        id: "cat-perf-1",
        name: "Kit Body Splash Masculino Barbarius + Enigma + Midtown 200ml",
        price: 89.90,
        originalPrice: 249.90,
        image: perfumeKitImg,
        tag: "64% OFF",
        slug: "kit-body-splash-masculino-barbarius-enigma-midtown-200ml",
      },
      {
        id: "cat-perf-2",
        name: "Kit Body Splash Masculino Barbarius e Midtown 200ml by Primacial",
        price: 69.90,
        originalPrice: 179.90,
        image: perfumeKitDuoImg,
        tag: "61% OFF",
        slug: "kit-body-splash-masculino-barbarius-midtown-200ml-primacial",
      },
    ],
  },
];
