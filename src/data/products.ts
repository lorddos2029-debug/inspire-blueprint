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
import kit6Main from "@/assets/products-bc/kit6-coberdrom-main.png";
import kit6Cinza from "@/assets/products-bc/kit6-coberdrom-cinza.jpg";
import kit6Preto from "@/assets/products-bc/kit6-coberdrom-preto.jpg";
import kit6Vermelho from "@/assets/products-bc/kit6-coberdrom-vermelho.jpg";
import kit6Bege from "@/assets/products-bc/kit6-coberdrom-bege.jpg";
import kit6Azul from "@/assets/products-bc/kit6-coberdrom-azul.jpg";
import kit6Marrom from "@/assets/products-bc/kit6-coberdrom-marrom.jpg";
import kit6Life1 from "@/assets/products-bc/kit6-coberdrom-lifestyle1.jpg";
import kit6Life2 from "@/assets/products-bc/kit6-coberdrom-lifestyle2.jpg";
import kit6Life3 from "@/assets/products-bc/kit6-coberdrom-lifestyle3.jpg";
import mondialPreto from "@/assets/products-bc/mondial-l99-preto.png";
import mondialVermelho from "@/assets/products-bc/mondial-l99-vermelho.png";
import mondialLife from "@/assets/products-bc/mondial-l99-lifestyle.png";
import mondialPotencia from "@/assets/products-bc/mondial-l99-potencia.png";
import mondialJarra from "@/assets/products-bc/mondial-l99-jarra.png";
import mondialFiltro from "@/assets/products-bc/mondial-l99-filtro.png";
import mondialTapa from "@/assets/products-bc/mondial-l99-tapa.png";
import mondialLaminas from "@/assets/products-bc/mondial-l99-laminas.png";
import mondialPies from "@/assets/products-bc/mondial-l99-pies.png";
import mondialDimensoes from "@/assets/products-bc/mondial-l99-dimensoes.png";
import idali76 from "@/assets/products-bc/idali/76.png";
import idali77 from "@/assets/products-bc/idali/77.png";
import idali80 from "@/assets/products-bc/idali/80.png";
import idali81 from "@/assets/products-bc/idali/81.png";
import idali82 from "@/assets/products-bc/idali/82.png";
import idali83 from "@/assets/products-bc/idali/83.png";
import idali84 from "@/assets/products-bc/idali/84.png";
import ventisol1 from "@/assets/products-bc/ventisol-a1-1.png";
import ventisol2 from "@/assets/products-bc/ventisol-a1-2.png";
import ventisol3 from "@/assets/products-bc/ventisol-a1-3.png";
import ventisol4 from "@/assets/products-bc/ventisol-a1-4.png";
import ventisol5 from "@/assets/products-bc/ventisol-a1-5.png";
import ventisol6 from "@/assets/products-bc/ventisol-a1-6.png";
import escova1 from "@/assets/products-bc/escova-limpeza-1.png";
import escova2 from "@/assets/products-bc/escova-limpeza-2.png";
import escova3 from "@/assets/products-bc/escova-limpeza-3.png";
import escova4 from "@/assets/products-bc/escova-limpeza-4.png";
import escova5 from "@/assets/products-bc/escova-limpeza-5.png";
import escova6 from "@/assets/products-bc/escova-limpeza-6.png";
import escova7 from "@/assets/products-bc/escova-limpeza-7.png";
import escova8 from "@/assets/products-bc/escova-limpeza-8.png";

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
  {
    id: 19,
    slug: "coberdrom-casal-queen-dupla-face-sherpa-extra-macio",
    name: "Coberdrom Casal Queen Dupla Face Sherpa Extra Macio e Aconchegante",
    price: 79.9,
    originalPrice: 599.4,
    image: kit6Main,
    images: [kit6Main, kit6Cinza, kit6Preto, kit6Vermelho, kit6Bege, kit6Azul, kit6Marrom],
    tag: "87% OFF",
    description:
      "Coberdrom Casal/Queen Dupla Face Sherpa de altíssima qualidade, confeccionado com dupla face premium: um lado em sherpa pele de carneiro ultramacia e fofinha, e o outro em microfibra aveludada de altíssima gramatura, garantindo aquecimento térmico superior nas noites mais frias sem pesar no corpo. Tamanho Casal/Queen 2,20m x 2,40m, perfeito para cobrir a cama com sobra. Tecido antialérgico, antiácaro e hipoalergênico — seguro para crianças, idosos e pessoas com pele sensível. Costura matelassê reforçada que mantém o enchimento bem distribuído após muitas lavagens. Disponível em 6 cores elegantes (Cinza, Preto, Vermelho, Bege, Azul Marinho e Marrom Chocolate) para combinar com qualquer estilo de decoração. Acabamento sofisticado que eleva o visual do seu quarto. Estoque limitadíssimo!",
    sizes: ["Casal/Queen"],
    colorVariants: [
      { label: "Cinza", colors: ["#8a8a8a"], image: kit6Cinza },
      { label: "Preto", colors: ["#1a1a1a"], image: kit6Preto },
      { label: "Vermelho", colors: ["#c4161c"], image: kit6Vermelho },
      { label: "Bege", colors: ["#d2b48c"], image: kit6Bege },
      { label: "Azul Marinho", colors: ["#1e2a44"], image: kit6Azul },
      { label: "Marrom Chocolate", colors: ["#5a3a22"], image: kit6Marrom },
    ],
  },
  {
    id: 20,
    slug: "liquidificador-mondial-l-99-turbo-3-velocidades-550w",
    name: "Liquidificador Mondial L-99 Turbo 3 Velocidades 550W",
    price: 69.9,
    originalPrice: 249.9,
    image: mondialPreto,
    images: [mondialPreto, mondialLife, mondialPotencia, mondialJarra, mondialFiltro, mondialTapa, mondialLaminas, mondialPies, mondialDimensoes],
    tag: "72% OFF",
    description:
      "Liquidificador Mondial L-99 Turbo Power, o queridinho das cozinhas brasileiras agora com motor potente de 550W para triturar, bater e processar com facilidade os alimentos do dia a dia. Conta com 3 velocidades + função pulsar e função Turbo, oferecendo controle total para preparar sucos, vitaminas, sopas, molhos, papinhas e até quebrar gelo sem esforço. Jarra de San Cristal de altíssima capacidade (2,2L totais / 1,6L úteis), super resistente a quedas, livre de BPA e com marcação de volume em alto-relevo para facilitar o preparo. Lâminas de aço inoxidável de 4 pontas que trituram com mais precisão e rapidez, mantendo o fio por muito mais tempo. Função autolimpeza exclusiva que auxilia na higienização do copo e das lâminas em segundos — basta colocar água com detergente e acionar. Acompanha filtro destacável que separa polpas, sementes e bagaços, deixando os sucos lisinhos como os de loja. Tampa com vaso medidor removível para adicionar ingredientes durante o preparo sem desligar o aparelho. Base com pés antiderrapantes que garantem estabilidade total mesmo nas velocidades mais altas, além de compartimento traseiro para guardar o fio e facilitar a organização. Design compacto e elegante (21cm x 20cm x 40cm, apenas 1,3kg), encaixa em qualquer bancada. Selo Inmetro, motor com proteção contra superaquecimento e bivolt (versão 127V/220V). Disponível nas cores Preto e Vermelho para combinar com a sua cozinha.",
    sizes: ["110V", "220V"],
    sizeLabel: "Voltagem",
    colorVariants: [
      { label: "Preto", colors: ["#1a1a1a"], image: mondialPreto },
      { label: "Vermelho", colors: ["#c4161c"], image: mondialVermelho },
    ],
  },
  {
    id: 21,
    slug: "aspirador-po-robo-inteligente-idali-life-sensores-anti-queda",
    name: "Aspirador de Pó Para Casa Robô Inteligente Com Sensores Anti-queda IDALI LIFE",
    price: 119.9,
    originalPrice: 599.9,
    image: idali76,
    images: [idali76, idali83, idali81, idali82, idali84, idali77, idali80],
    tag: "80% OFF",
    description:
      "Aspirador de Pó Robô Inteligente IDALI LIFE 3 em 1: varre, aspira e passa pano ao mesmo tempo, garantindo limpeza profunda em pisos, carpetes baixos e tapetes finos. Conta com sensores anti-queda de alta precisão que detectam escadas, desníveis e obstáculos, protegendo o robô e a sua casa enquanto trabalha sozinho. Função MOP integrada — basta acoplar o reservatório de água com pano de microfibra e ele passa pano enquanto aspira, eliminando manchas leves e mantendo o piso brilhando. Equipado com 2 escovas laterais giratórias que alcançam cantos, frestas, rodapés e pés de móveis, e sucção potente que retira poeira, fios de cabelo, pelos de pets e migalhas com facilidade. Conexão Wi-Fi e Bluetooth 2.4G compatível com o aplicativo Tuya/Smart Life, Amazon Alexa e Google Home — controle por voz com comandos simples como 'Alexa, ligue o aspirador'. Sistema de Recarga Automática: quando a bateria está fraca o robô retorna sozinho para a base de carregamento, sem precisar da sua ajuda. Design ultrafino e leve, passa embaixo de sofás, camas e armários sem dificuldade. Bateria de longa duração para limpar a casa inteira em uma única carga. Operação silenciosa, ideal para usar com bebês, crianças e pets em casa. Acompanha: 1 robô aspirador IDALI LIFE, 1 base de carregamento, 2 escovas laterais sobressalentes, 1 reservatório de água + pano de microfibra MOP, 1 controle remoto, 1 manual em português. Cor: Preto Premium.",
    sizes: [],
  },
  {
    id: 22,
    slug: "aquecedor-eletrico-3-em-1-termo-ventilador-a1-ventisol",
    name: "Aquecedor elétrico 3 em 1 com termo ventilador A1 - Ventisol",
    price: 79.9,
    originalPrice: 249.9,
    image: ventisol1,
    images: [ventisol1, ventisol2, ventisol3, ventisol4, ventisol5, ventisol6],
    tag: "68% OFF",
    description:
      "Aquecedor Elétrico Ventisol A1 3 em 1 com Termo Ventilador: aquece, ventila e renova o ar do ambiente com apenas um aparelho compacto. Possui 3 funções selecionáveis no botão giratório — Ventilação (somente ar natural para o verão), Aquecimento Suave 1000W (ideal para quartos pequenos e dias amenos) e Aquecimento Máximo 2000W (potência total para aquecer salas e ambientes maiores rapidamente). Termostato ajustável com controle preciso de temperatura: o aparelho liga e desliga sozinho mantendo o ambiente sempre na temperatura ideal, economizando energia. Resistência cerâmica PTC de alta eficiência que aquece em segundos, sem ressecar o ar e sem queimar oxigênio. Sistema de segurança completo com proteção contra superaquecimento, desligamento automático em caso de tombamento e grade frontal reforçada que protege contra contato acidental — seguro para casas com crianças e pets. Alça superior ergonômica para transportar de cômodo em cômodo com praticidade. Design moderno em preto fosco premium, compacto (apenas 26cm de altura) e leve, ocupa pouquíssimo espaço. Bivolt manual (versão 127V ou 220V), motor silencioso para usar durante o sono sem incomodar. Indicado para quartos, salas, escritórios, banheiros (afastado de água), consultórios e até em viagens. Selo Inmetro e garantia oficial Ventisol — marca brasileira referência em climatização há mais de 30 anos.",
    sizes: ["127V", "220V"],
    sizeLabel: "Voltagem",
  },
  {
    id: 23,
    slug: "kit-2-escovas-limpeza-eletrica-multifuncional-9-em-1-retratil",
    name: "Kit 2 Escovas de limpeza elétrica multifuncional 9 em 1, retrátil - com cabo estendido para banheiro, cozinha e quarto",
    price: 69.9,
    originalPrice: 249.9,
    image: escova1,
    images: [escova1, escova2, escova3, escova4, escova8, escova5, escova7, escova6],
    tag: "72% OFF",
    description:
      "Kit com 2 Escovas Elétricas de Limpeza Multifuncionais 9 em 1 com cabo retrátil estendido — o par perfeito para deixar uma na cozinha/banheiro e outra para limpezas pesadas, ou economizar comprando junto com quem você ama. Cada escova acompanha 9 cabeças intercambiáveis de troca rápida com encaixe magnético: escova de cerdas duras (azulejo, rejunte, sapatos), escova de cerdas macias (vidros, espelhos, carros), escova cônica (cantos e frestas), escova arredondada (pias e torneiras), esponja amarela com fibra verde (panelas, fogão, louças), disco de microfibra branco (estofados, sofá), boina de polimento (carro, móveis), disco azul scrubber (box, vaso sanitário) e disco de feltro (polimento final). Motor potente sem fio com bateria recarregável de 3000mAh de longa duração (mais de 90 minutos por carga) e carregamento rápido via cabo Type-C incluso. Display de LED indica o nível da bateria em tempo real. Velocidade de rotação ajustável até 400 RPM, removendo sujeira pesada, gordura, mofo, ferrugem leve e manchas em segundos sem esforço — o motor faz o trabalho por você. Cabo de alumínio extensível e retrátil (uso curto para detalhes ou estendido até 100cm para alcançar tetos, boxes altos, pisos e cantos sem se abaixar), perfeito para idosos, gestantes e quem tem problemas de coluna. À prova d'água IPX5 — pode molhar à vontade, ideal para banheiro, box, pia, cozinha, fogão, churrasqueira, carro, jardim e até para limpar rodas e calotas. Design ergonômico antiderrapante, leve e silencioso. Acompanha por kit: 2 escovas elétricas + 2 cabos extensores de alumínio + 9 cabeças/acessórios + 2 cabos USB Type-C + manual em português. Garantia oficial e nota fiscal BelaCasa. Pague 1 e leve o kit completo de 2 unidades — promoção por tempo limitadíssimo!",
    sizes: [],
  },
];
