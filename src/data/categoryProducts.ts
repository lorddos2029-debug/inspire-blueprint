const amazonProd1 = "/assets/products-amazon/prod-1.jpg";
const amazonProd2 = "/assets/products-amazon/prod-2.jpg";
const amazonProd3 = "/assets/products-amazon/prod-3.jpg";
const amazonProd4 = "/assets/products-amazon/prod-4.jpg";
const amazonProd5 = "/assets/products-amazon/prod-5.jpg";
const amazonProd6 = "/assets/products-amazon/prod-6.jpg";
const amazonProd7 = "/assets/products-amazon/prod-7.jpg";

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
      { id: "cb-1", name: "Cobertor Plush King Toque de Nuvem", price: 189.9, originalPrice: 349.9, image: amazonProd1, tag: "46% OFF", slug: "cobertor-plush-king-toque-de-nuvem" },
      { id: "cb-2", name: "Jogo 5 Toalhas Linha Egípcia 500g/m²", price: 169.9, originalPrice: 329.9, image: amazonProd3, tag: "48% OFF", slug: "jogo-5-toalhas-banho-egiptia-fio-penteado" },
    ],
  },
  {
    title: "Eletroportáteis",
    products: [
      { id: "ep-1", name: "Air Fryer Digital 5L com 8 Funções", price: 449.9, originalPrice: 799.9, image: amazonProd4, tag: "44% OFF", slug: "air-fryer-fritadeira-eletrica-5l-digital" },
      { id: "ep-2", name: "Cafeteira Elétrica Premium 15 Xícaras", price: 269.9, originalPrice: 489.9, image: cafeteira, tag: "45% OFF", slug: "cafeteira-eletrica-premium-15-xicaras" },
    ],
  },
  {
    title: "Mesa Posta",
    products: [
      { id: "mp-1", name: "Aparelho de Jantar Porcelana Fio Dourado 30 Peças", price: 599.9, originalPrice: 1099.9, image: jogoJantar, tag: "45% OFF", slug: "aparelho-jantar-porcelana-fio-dourado-30-pecas" },
      { id: "mp-2", name: "Chaleira Elétrica Inox 1,7L Temperatura Variável", price: 219.9, originalPrice: 399.9, image: amazonProd6, tag: "45% OFF", slug: "chaleira-eletrica-inox-17l-temperatura-variavel" },
    ],
  },
  {
    title: "Organização",
    products: [
      { id: "og-1", name: "Kit Organizadores Cozinha Bambu - 6 Peças", price: 159.9, originalPrice: 289.9, image: organizador, tag: "45% OFF", slug: "kit-organizadores-cozinha-bambu-modular" },
      { id: "og-2", name: "Liquidificador Power 1200W Jarra de Vidro 2L", price: 299.9, originalPrice: 539.9, image: amazonProd5, tag: "44% OFF", slug: "liquidificador-power-1200w-jarra-vidro" },
    ],
  },
  {
    title: "Conforto & Sono",
    products: [
      { id: "cs-1", name: "Edredom King Pluma de Ganso Naturale 600g/m²", price: 459.9, originalPrice: 849.9, image: edredom, tag: "46% OFF", slug: "edredom-king-pluma-ganso-naturale" },
      { id: "cs-2", name: "Jogo de Lençol King Percal 400 Fios", price: 349.9, originalPrice: 649.9, image: amazonProd7, tag: "46% OFF", slug: "jogo-lencol-king-percal-400-fios-egipcio" },
    ],
  },
];
