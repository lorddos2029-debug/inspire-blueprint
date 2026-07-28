const cobertor = "/assets/products-bc/cobertor.jpg";
const travesseiro = "/assets/products-bc/travesseiro.jpg";
const toalha = "/assets/products-bc/toalha.jpg";
const airfryer = "/assets/products-bc/airfryer.jpg";
const liquidificador = "/assets/products-bc/liquidificador.jpg";
const cafeteira = "/assets/products-bc/cafeteira.jpg";
const organizador = "/assets/products-bc/organizador.jpg";
const jogoJantar = "/assets/products-bc/jogo-jantar.jpg";
const lencol = "/assets/products-bc/lencol.jpg";
const edredom = "/assets/products-bc/edredom.jpg";
const chaleira = "/assets/products-bc/chaleira.jpg";
const batedeira = "/assets/products-bc/batedeira.jpg";

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
    title: "Cama & Banho",
    products: [
      { 
        id: "cb-1", 
        name: "Coberdrom Casal Queen Dupla Face Sherpa", 
        price: 79.9, 
        originalPrice: 599.4, 
        image: "/assets/products-bc/kit6-coberdrom-main.png", 
        tag: "87% OFF", 
        slug: "coberdrom-casal-queen-dupla-face-sherpa-extra-macio" 
      },
    ],
  },
  {
    title: "Eletroportáteis",
    products: [
      { 
        id: "ep-1", 
        name: "Air Fryer Gaabor Duo Digital Touch 4.2L", 
        price: 89.9, 
        originalPrice: 379.9, 
        image: "/assets/products-bc/gaabor-1.jpg", 
        tag: "76% OFF", 
        slug: "fritadeira-air-fryer-gaabor-duo-digital-touch-4-2l" 
      },
      { 
        id: "ep-2", 
        name: "Liquidificador Mondial L-99 Turbo 550W", 
        price: 69.9, 
        originalPrice: 249.9, 
        image: "/assets/products-bc/mondial-l99-preto.png", 
        tag: "72% OFF", 
        slug: "liquidificador-mondial-l-99-turbo-3-velocidades-550w" 
      },
    ],
  },
  {
    title: "Organização",
    products: [
      { 
        id: "og-1", 
        name: "Kit 2 Escovas Elétricas Multifuncional 9 em 1", 
        price: 69.9, 
        originalPrice: 249.9, 
        image: "/assets/products-bc/escova-limpeza-1.png", 
        tag: "72% OFF", 
        slug: "kit-2-escovas-limpeza-eletrica-multifuncional-9-em-1-retratil" 
      },
    ],
  },
  {
    title: "Conforto & Sono",
    products: [
      { 
        id: "cs-1", 
        name: "Jogo de Panelas 10 Peças Bianco Vanilla", 
        price: 89.9, 
        originalPrice: 349.9, 
        image: "/assets/products-bc/panelas-v2/sahara.jpg", 
        tag: "74% OFF", 
        slug: "jogo-de-panelas-10-pecas-antiaderente-bianco-vanilla-teflon-ditalia" 
      },
      { 
        id: "cs-2", 
        name: "Aspirador de Pó Robô IDALI LIFE", 
        price: 119.9, 
        originalPrice: 599.9, 
        image: "/assets/products-bc/idali/76.png", 
        tag: "80% OFF", 
        slug: "aspirador-po-robo-inteligente-idali-life-sensores-anti-queda" 
      },
    ],
  },
];