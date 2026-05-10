import cobertor from "@/assets/products-bc/cobertor.jpg";
import travesseiro from "@/assets/products-bc/travesseiro.jpg";
import toalha from "@/assets/products-bc/toalha.jpg";
import airfryer from "@/assets/products-bc/airfryer.jpg";
import liquidificador from "@/assets/products-bc/liquidificador.jpg";
import cafeteira from "@/assets/products-bc/cafeteira.jpg";
import organizador from "@/assets/products-bc/organizador.jpg";
import jogoJantar from "@/assets/products-bc/jogo-jantar.jpg";
import lencol from "@/assets/products-bc/lencol.jpg";
import batedeira from "@/assets/products-bc/batedeira.jpg";
import difusor from "@/assets/products-bc/difusor.jpg";
import edredom from "@/assets/products-bc/edredom.jpg";
import chaleira from "@/assets/products-bc/chaleira.jpg";
import sherpaMain from "@/assets/products-bc/sherpa-main.jpg";
import sherpaCinza from "@/assets/products-bc/sherpa-cinza.jpg";
import sherpaMarrom from "@/assets/products-bc/sherpa-marrom.jpg";
import sherpaRose from "@/assets/products-bc/sherpa-rose.jpg";
import sherpaVermelho from "@/assets/products-bc/sherpa-vermelho.jpg";
import sherpaAzul from "@/assets/products-bc/sherpa-azul.jpg";
import sherpaBege from "@/assets/products-bc/sherpa-bege.jpg";
import sherpaPreto from "@/assets/products-bc/sherpa-preto.jpg";
import tomimi1 from "@/assets/products-bc/tomimi-1.jpg";
import tomimi2 from "@/assets/products-bc/tomimi-2.jpg";
import tomimi3 from "@/assets/products-bc/tomimi-3.jpg";
import tomimi4 from "@/assets/products-bc/tomimi-4.jpg";
import tomimi5 from "@/assets/products-bc/tomimi-5.jpg";
import tomimi6 from "@/assets/products-bc/tomimi-6.jpg";
import tomimi7 from "@/assets/products-bc/tomimi-7.jpg";
import oliverPotes1 from "@/assets/products-bc/oliver-potes-1.jpg";
import biancoPanelas1 from "@/assets/products-bc/bianco-panelas-1.jpg";
import biancoPanelas2 from "@/assets/products-bc/bianco-panelas-2.jpg";
import biancoPanelas3 from "@/assets/products-bc/bianco-panelas-3.jpg";
import biancoPanelas4 from "@/assets/products-bc/bianco-panelas-4.jpg";
import biancoPanelas5 from "@/assets/products-bc/bianco-panelas-5.jpg";
import biancoPanelas6 from "@/assets/products-bc/bianco-panelas-6.jpg";
import gaabor1 from "@/assets/products-bc/gaabor-1.jpg";
import gaabor2 from "@/assets/products-bc/gaabor-2.jpg";
import gaabor3 from "@/assets/products-bc/gaabor-3.jpg";
import gaabor4 from "@/assets/products-bc/gaabor-4.jpg";
import gaabor5 from "@/assets/products-bc/gaabor-5.jpg";
import gaabor6 from "@/assets/products-bc/gaabor-6.jpg";

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  tag?: string;
  description?: string;
  sizes?: string[];
  sizeLabel?: string;
  colorVariants?: { label: string; colors: string[]; image?: string }[];
}

export const products: Product[] = [
  {
    id: 1,
    slug: "cobertor-plush-king-toque-de-nuvem",
    name: "Cobertor Plush King Size Toque de Nuvem 2,40m x 2,60m - Antialérgico",
    price: 189.9,
    originalPrice: 349.9,
    image: cobertor,
    images: [cobertor, edredom, lencol],
    tag: "46% OFF",
    description:
      "Cobertor plush king size com toque ultramacio, fibras antialérgicas e térmicas que mantêm o calor sem pesar. Acabamento premium com costura reforçada para garantir durabilidade após muitas lavagens.",
    sizes: ["Solteiro", "Casal", "Queen", "King"],
    colorVariants: [
      { label: "Bege Areia", colors: ["#e6dcc8"] },
      { label: "Off White", colors: ["#f5f0e6"] },
      { label: "Cinza Pérola", colors: ["#cfcfcf"] },
    ],
  },
  {
    id: 2,
    slug: "kit-2-travesseiros-conforto-premium",
    name: "Kit 2 Travesseiros Conforto Premium Antiácaro 50x70cm - 100% Algodão",
    price: 99.9,
    originalPrice: 199.9,
    image: travesseiro,
    images: [travesseiro, lencol, edredom],
    tag: "50% OFF",
    description:
      "Par de travesseiros com enchimento em fibra siliconada hipoalergênica, capa 100% algodão, costura quilt para suporte cervical perfeito e noites verdadeiramente revigorantes.",
    sizes: ["Padrão 50x70"],
    colorVariants: [
      { label: "Branco", colors: ["#ffffff"] },
    ],
  },
  {
    id: 3,
    slug: "jogo-5-toalhas-banho-egiptia-fio-penteado",
    name: "Jogo 5 Toalhas de Banho Linha Egípcia Fio Penteado 500g/m²",
    price: 169.9,
    originalPrice: 329.9,
    image: toalha,
    images: [toalha, lencol, travesseiro],
    tag: "48% OFF",
    description:
      "Jogo com 5 toalhas premium em algodão egípcio fio penteado de 500g/m². Altíssima absorção, toque aveludado, secagem rápida e cores que não desbotam mesmo após muitas lavagens.",
    sizes: ["Banho 70x140", "Banhão 90x150"],
    colorVariants: [
      { label: "Branco / Bege / Marfim", colors: ["#ffffff", "#e6dcc8", "#f5f0e6"] },
      { label: "Cinza / Azul / Branco", colors: ["#cfcfcf", "#1e3a5f", "#ffffff"] },
    ],
  },
  {
    id: 4,
    slug: "air-fryer-fritadeira-eletrica-5l-digital",
    name: "Air Fryer Fritadeira Elétrica 5L Digital com Painel Touch e 8 Funções",
    price: 449.9,
    originalPrice: 799.9,
    image: airfryer,
    images: [airfryer, liquidificador, cafeteira],
    tag: "44% OFF",
    description:
      "Fritadeira sem óleo de 5 litros, painel digital touch, 8 programas pré-definidos (frango, batata, peixe, carne, legumes, sobremesa, fermentar e descongelar). Tecnologia Rapid Air para resultados crocantes por fora e suculentos por dentro.",
    sizes: ["110V", "220V"],
    colorVariants: [
      { label: "Preto Premium", colors: ["#000000"] },
    ],
  },
  {
    id: 5,
    slug: "liquidificador-power-1200w-jarra-vidro",
    name: "Liquidificador Power 1200W Jarra de Vidro 2L com 12 Velocidades",
    price: 299.9,
    originalPrice: 539.9,
    image: liquidificador,
    images: [liquidificador, batedeira, airfryer],
    tag: "44% OFF",
    description:
      "Liquidificador profissional com 1200W de potência, jarra de vidro reforçado de 2L, 12 velocidades + função pulsar e lâminas de aço inox 6 pontas. Triturador de gelo e ingredientes congelados.",
    sizes: ["110V", "220V"],
    colorVariants: [
      { label: "Inox Premium", colors: ["#c0c0c0"] },
    ],
  },
  {
    id: 6,
    slug: "cafeteira-eletrica-premium-15-xicaras",
    name: "Cafeteira Elétrica Premium 15 Xícaras com Filtro Permanente e Timer",
    price: 269.9,
    originalPrice: 489.9,
    image: cafeteira,
    images: [cafeteira, chaleira, jogoJantar],
    tag: "45% OFF",
    description:
      "Cafeteira elétrica premium com capacidade para 15 xícaras, jarra de vidro com marcador de nível, filtro permanente, painel digital com timer programável e função manter aquecido por até 2 horas.",
    sizes: ["110V", "220V"],
    colorVariants: [
      { label: "Preto Fosco", colors: ["#1a1a1a"] },
    ],
  },
  {
    id: 7,
    slug: "kit-organizadores-cozinha-bambu-modular",
    name: "Kit Organizadores de Cozinha em Bambu Modular - 6 Peças",
    price: 159.9,
    originalPrice: 289.9,
    image: organizador,
    images: [organizador, jogoJantar, batedeira],
    tag: "45% OFF",
    description:
      "Kit completo com 6 organizadores modulares em bambu natural e plástico transparente livre de BPA. Ideal para mantimentos, talheres, temperos e utensílios. Empilháveis e laváveis.",
    sizes: ["Único"],
    colorVariants: [
      { label: "Bambu Natural", colors: ["#d2b48c", "#ffffff"] },
    ],
  },
  {
    id: 8,
    slug: "aparelho-jantar-porcelana-fio-dourado-30-pecas",
    name: "Aparelho de Jantar Porcelana Fio Dourado 30 Peças - Serve 6 Pessoas",
    price: 599.9,
    originalPrice: 1099.9,
    image: jogoJantar,
    images: [jogoJantar, organizador, cafeteira],
    tag: "45% OFF",
    description:
      "Aparelho de jantar em porcelana fina decorada com fio dourado. 30 peças incluindo pratos rasos, fundos, sobremesa, xícaras com pires e bowls. Serve 6 pessoas com elegância e sofisticação.",
    sizes: ["30 peças"],
    colorVariants: [
      { label: "Branco com Fio Dourado", colors: ["#ffffff", "#d4af37"] },
    ],
  },
  {
    id: 9,
    slug: "jogo-lencol-king-percal-400-fios-egipcio",
    name: "Jogo de Lençol King Percal 400 Fios 100% Algodão Egípcio - 4 Peças",
    price: 349.9,
    originalPrice: 649.9,
    image: lencol,
    images: [lencol, edredom, travesseiro],
    tag: "46% OFF",
    description:
      "Jogo de lençol king com 4 peças em percal 400 fios, 100% algodão egípcio. Toque suave, caimento perfeito e durabilidade incomparável. Inclui lençol com elástico, lençol superior e 2 fronhas.",
    sizes: ["Solteiro", "Casal", "Queen", "King"],
    colorVariants: [
      { label: "Off White", colors: ["#f5f0e6"] },
      { label: "Bege Areia", colors: ["#e6dcc8"] },
      { label: "Cinza Claro", colors: ["#d3d3d3"] },
    ],
  },
  {
    id: 10,
    slug: "batedeira-planetaria-1000w-tigela-inox",
    name: "Batedeira Planetária 1000W Tigela de Inox 5L com 10 Velocidades",
    price: 899.9,
    originalPrice: 1599.9,
    image: batedeira,
    images: [batedeira, liquidificador, airfryer],
    tag: "44% OFF",
    description:
      "Batedeira planetária profissional com motor de 1000W, tigela de aço inox de 5 litros, 10 velocidades e 3 batedores (globo, gancho e pá). Ideal para massas leves, pesadas e claras em neve.",
    sizes: ["110V", "220V"],
    colorVariants: [
      { label: "Branco Pérola", colors: ["#f5f5f5"] },
    ],
  },
  {
    id: 11,
    slug: "edredom-king-pluma-ganso-naturale",
    name: "Edredom King Pluma de Ganso Naturale 600g/m² - Térmico Premium",
    price: 459.9,
    originalPrice: 849.9,
    image: edredom,
    images: [edredom, lencol, travesseiro],
    tag: "46% OFF",
    description:
      "Edredom king com enchimento em pluma de ganso naturale 600g/m², capa 100% algodão acetinado e costura matelassê. Conforto térmico premium para todas as estações.",
    sizes: ["Solteiro", "Casal", "Queen", "King"],
    colorVariants: [
      { label: "Off White", colors: ["#f5f0e6"] },
      { label: "Bege Sand", colors: ["#e6dcc8"] },
    ],
  },
  {
    id: 12,
    slug: "chaleira-eletrica-inox-17l-temperatura-variavel",
    name: "Chaleira Elétrica Inox 1,7L com Temperatura Variável e Desligamento Automático",
    price: 219.9,
    originalPrice: 399.9,
    image: chaleira,
    images: [chaleira, cafeteira, jogoJantar],
    tag: "45% OFF",
    description:
      "Chaleira elétrica em inox premium com capacidade de 1,7 litros, ajuste de temperatura variável (40°C a 100°C), desligamento automático e proteção contra superaquecimento. Ideal para chás, cafés especiais e infusões.",
    sizes: ["110V", "220V"],
    colorVariants: [
      { label: "Preto Fosco", colors: ["#1a1a1a"] },
    ],
  },
  {
    id: 13,
    slug: "difusor-aromas-ultrassonico-luz-ambiente",
    name: "Difusor de Aromas Ultrassônico com Luz de Ambiente 7 Cores - 300ml",
    price: 149.9,
    originalPrice: 269.9,
    image: difusor,
    images: [difusor, travesseiro, lencol],
    tag: "44% OFF",
    description:
      "Difusor ultrassônico com reservatório de 300ml, vaporização silenciosa, luz de ambiente em 7 cores e desligamento automático. Acabamento em cerâmica branca com detalhes em madeira natural para ambientes sofisticados.",
    sizes: ["300ml"],
    colorVariants: [
      { label: "Branco com Madeira", colors: ["#ffffff", "#d2b48c"] },
    ],
  },
  {
    id: 14,
    slug: "edredom-sherpa-coberdrom-casal-queen-dupla-face-pele-de-carneiro",
    name: "Edredom Sherpa Cobertor Manta Coberdrom Casal Queen Dupla Face Pele de Carneiro Grosso",
    price: 69.9,
    originalPrice: 199.9,
    image: sherpaMarrom,
    images: [sherpaMarrom, sherpaMain, sherpaCinza, sherpaPreto, sherpaVermelho, sherpaRose, sherpaBege, sherpaAzul],
    tag: "65% OFF",
    description:
      "Edredom Coberdrom Sherpa dupla face Queen Size, com um lado em pele de carneiro (sherpa) ultramacia e o outro em microfibra premium aveludada. Quentíssimo, encorpado e perfeito para os dias mais frios. Antialérgico e com costura matelassê reforçada.",
    sizes: ["Casal/Queen"],
    colorVariants: [
      { label: "Marrom Chocolate", colors: ["#5b3a29"], image: sherpaMarrom },
      { label: "Cinza Pérola", colors: ["#bdbdbd"], image: sherpaCinza },
      { label: "Preto", colors: ["#1a1a1a"], image: sherpaPreto },
      { label: "Vermelho", colors: ["#a81b1b"], image: sherpaVermelho },
      { label: "Rosé", colors: ["#c69a96"], image: sherpaRose },
      { label: "Bege", colors: ["#b89b78"], image: sherpaBege },
      { label: "Azul Marinho", colors: ["#1e2f55"], image: sherpaAzul },
    ],
  },
  {
    id: 15,
    slug: "travesseiro-cervical-tomimi-espuma-memoria-ergonomico",
    name: "Travesseiro Cervical Tomimi, sono confortável, espuma de memória ergonômica sem odor",
    price: 69.9,
    originalPrice: 229.9,
    image: tomimi1,
    images: [tomimi1, tomimi2, tomimi3, tomimi4, tomimi5, tomimi6, tomimi7],
    tag: "70% OFF",
    description:
      "Travesseiro Cervical Tomimi com espuma viscoelástica de memória de alta densidade e design biônico em forma de borboleta. Suporte ergonômico para a coluna cervical, alivia dores no pescoço e ombros, livre de formaldeído e sem odor. Ideal para dormir de lado, de costas ou de bruços.",
    sizes: [],
  },
  {
    id: 16,
    slug: "kit-10-potes-vidro-640ml-hermetico-marmita-fit-oliver-home",
    name: "Kit 10 Potes de Vidro 640ml Hermético Marmita Fit com Tampa 4 Travas Oliver Home",
    price: 89.9,
    originalPrice: 249.9,
    image: oliverPotes1,
    images: [oliverPotes1],
    tag: "64% OFF",
    description:
      "Kit com 10 potes de vidro borossilicato resistente de 640ml, ideais para marmita fit, meal prep e organização da despensa. Tampa hermética com 4 travas de segurança e vedação em silicone atóxico que mantém os alimentos frescos por muito mais tempo, sem vazamentos. Vidro temperado livre de BPA, pode ir ao freezer, microondas, forno convencional e lava-louças. Empilháveis, transparentes e com tamanho perfeito para uma refeição completa.",
    sizes: [],
  },
  {
    id: 17,
    slug: "jogo-panelas-10-pecas-antiaderente-bianco-vanilla",
    name: "Jogo de Panelas 10 Peças Antiaderente com Tampa de Vidro Temperado Bianco Vanilla",
    price: 79.9,
    originalPrice: 299.9,
    image: biancoPanelas1,
    images: [biancoPanelas1, biancoPanelas2, biancoPanelas3, biancoPanelas4, biancoPanelas5, biancoPanelas6],
    tag: "73% OFF",
    description:
      "Jogo de Panelas Bianco Vanilla com 10 peças completas para equipar toda a sua cozinha: 1 caçarola grande, 1 caçarola média, 1 panela funda, 1 frigideira grande, 1 frigideira média, 1 leiteira, 1 escumadeira, 1 espátula e 1 concha em nylon resistente, além das tampas de vidro temperado com respiro. Revestimento interno antiaderente de alta performance com partículas minerais, livre de PFOA, que dispensa óleo no preparo e facilita a limpeza. Corpo em alumínio reforçado com pintura externa texturizada vanilla efeito pedra, distribuição uniforme de calor e economia de gás. Cabos e alças em baquelite ergonômico que permanecem frios durante o uso. Tampas de vidro temperado com aro de inox para acompanhar o cozimento sem perder calor. Compatível com fogões a gás, elétrico e vitrocerâmico. Acabamento sofisticado que combina com qualquer decoração de cozinha moderna.",
    sizes: [],
  },
  {
    id: 18,
    slug: "fritadeira-air-fryer-gaabor-duo-digital-touch-4-2l",
    name: "Fritadeira Elétrica Air Fryer Gaabor Duo Digital Touch sem Óleo 4.2L 127V 220V Preto",
    price: 89.9,
    originalPrice: 379.9,
    image: gaabor1,
    images: [gaabor1, gaabor2, gaabor3, gaabor4, gaabor5, gaabor6],
    tag: "76% OFF",
    description:
      "Fritadeira Elétrica Air Fryer Gaabor Duo com tecnologia de circulação de ar quente 360° que frita, assa, gratina e aquece os alimentos com 0% de óleo, reduzindo até 90% da gordura das suas refeições. Capacidade generosa de 4,2 litros, ideal para famílias de até 5 pessoas, com cesto antiaderente removível livre de PFOA, mais saudável e fácil de limpar. Painel digital touch screen com 8 programas pré-definidos (batata frita, frango, peixe, carne, legumes, camarão, bolo e cupcake), além de ajuste manual de temperatura de 80°C a 200°C e timer programável de até 60 minutos. Visor frontal em vidro temperado para acompanhar o preparo sem abrir o cesto e perder calor. Sistema de desligamento automático ao remover o cesto, proteção contra superaquecimento e pés antiderrapantes. Bivolt automático (127V/220V), motor potente de 1500W que esquenta em segundos e cozinha de forma uniforme. Design moderno em preto fosco premium, compacto e fácil de guardar. Acompanha receituário digital e manual em português.",
    sizes: ["127V", "220V"],
    sizeLabel: "Voltagem",
    colorVariants: [
      { label: "Preto", colors: ["#1a1a1a"] },
    ],
  },
];
