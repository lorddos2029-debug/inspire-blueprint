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
    ],
  },
  {
    title: "Eletroportáteis",
    products: [
      
      { id: "ep-2", name: "Cafeteira Elétrica Premium 15 Xícaras", price: 269.9, originalPrice: 489.9, image: cafeteira, tag: "45% OFF", slug: "cafeteira-eletrica-premium-15-xicaras" },
    ],
  },
  {
    title: "Mesa Posta",
    products: [
      { id: "mp-1", name: "Aparelho de Jantar Porcelana Fio Dourado 30 Peças", price: 599.9, originalPrice: 1099.9, image: jogoJantar, tag: "45% OFF", slug: "aparelho-jantar-porcelana-fio-dourado-30-pecas" },
      
    ],
  },
  {
    title: "Organização",
    products: [
      { id: "og-1", name: "Kit Organizadores Cozinha Bambu - 6 Peças", price: 159.9, originalPrice: 289.9, image: organizador, tag: "45% OFF", slug: "kit-organizadores-cozinha-bambu-modular" },
      
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
