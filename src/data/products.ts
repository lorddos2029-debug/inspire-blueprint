const CP = "/assets/cp/";

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  image: string;
  /** Segunda imagem exibida no hover do card (padrão Casa Prestige) */
  hoverImage?: string;
  images?: string[];
  tag?: string;
  description?: string;
  sizes?: string[];
  sizeLabel?: string;
  colorVariants?: { label: string; colors: string[]; image?: string }[];
}

const BC = "/assets/products-bc/";

const ESC = "/assets/products-bc/escova-ions/";

const COB = "/assets/products-bc/cobertor-flannel/";

export const products: Product[] = [
  {
    id: 27,
    slug: "cobertor-manta-casal-queen-king-flannel-canelado-antialergico-300g",
    name: "Cobertor Manta Casal Queen King Flannel Canelado Antialérgico 300g/m² Grosso Macio Com Barra Inverno Mantinha Quente",
    price: 69.9,
    originalPrice: 189.9,
    image: `${COB}img-149.png`,
    hoverImage: `${COB}img-150.png`,
    images: [
      `${COB}img-149.png`,
      `${COB}img-150.png`,
      `${COB}img-151.png`,
      `${COB}img-152.png`,
      `${COB}img-153.png`,
      `${COB}img-154.png`,
    ],
    tag: "63% OFF",
    description:
      "Cobertor Manta Flannel Canelado de alta gramatura (300 g/m²) com acabamento em barra costurada, feito para enfrentar o inverno com muito conforto. O tecido flannel de microfibra passa por escovação dupla e ganha o relevo canelado 3D, que retém o calor do corpo e cria uma sensação de aconchego imediata ao deitar. Extra grosso, porém leve e maleável: aquece de verdade sem pesar sobre o corpo durante o sono. Tratamento antialérgico e antifungo, ideal para quem tem rinite, asma ou pele sensível — não solta fiapos, não embola e não desbota após as lavagens. As bordas recebem barra em veludo costurada ponto a ponto, dando caimento elegante na cama e durabilidade reforçada nas pontas. Tamanho Casal Queen/King (2,20 m x 2,40 m), com sobra generosa nas laterais para cobrir o colchão inteiro. Toque supermacio nos dois lados, secagem rápida e lavável na máquina em ciclo delicado. Perfeito também para usar no sofá, em viagens ou como manta decorativa no pé da cama.",
    colorVariants: [
      { label: "Bege", colors: ["#c3ae94"], image: `${COB}img-149.png` },
      { label: "Cinza", colors: ["#8d9295"], image: `${COB}img-154.png` },
    ],
  },
  {
    id: 26,

    id: 26,
    slug: "escova-modeladora-ions-negativos-38mm-9-ajustes-temperatura",
    name: "GOKOCO Escova modeladora de íons negativos de 38 mm – 9 ajustes de temperatura",
    price: 89.9,
    originalPrice: 249.9,
    image: `${ESC}img-134.png`,
    hoverImage: `${ESC}img-138.png`,
    images: [
      `${ESC}img-134.png`,
      `${ESC}img-135.png`,
      `${ESC}img-136.png`,
      `${ESC}img-137.png`,
      `${ESC}img-138.png`,
      `${ESC}img-139.png`,
      `${ESC}img-140.png`,
      `${ESC}img-141.png`,
    ],
    tag: "64% OFF",
    description:
      "Escova Modeladora de Íons Negativos com barril cerâmico de 38 mm e 9 ajustes de temperatura (130°C a 210°C) para cabelos finos, médios e grossos. O aquecimento PTC duplo deixa a escova pronta em apenas 30 segundos com calor uniforme, enquanto o controle NTC monitora a temperatura em tempo real para proteger os fios do superaquecimento. A liberação de 3 milhões de íons negativos neutraliza o frizz, fecha a cutícula e reduz pontas duplas, deixando o cabelo mais liso, alinhado e brilhante. As cerdas mistas antiembaraço deslizam sem puxar, o visor digital mostra a temperatura escolhida, o cabo giratório de 360° evita torções e o corpo leve de apenas 350 g reduz o cansaço nas mãos. Conta ainda com desligamento automático em 1 hora para sua segurança. Ideal para modelar cachos duradouros, ondas volumosas ou um liso escovado com aparência de salão em poucos minutos.",
    sizes: ["110V", "220V"],
    sizeLabel: "Voltagem",
  },
  {
    id: 25,
    slug: "kit-6-toalhas-de-banho-folha-macia-felpuda-100-algodao",
    name: "Kit 6 Toalhas de Banho Folha Macia Felpuda 100% Algodão",
    price: 59.9,
    originalPrice: 149.9,
    image: `${BC}toalhas/img-1.png`,
    hoverImage: `${BC}toalhas/img-2.png`,
    images: [
      `${BC}toalhas/img-1.png`,
      `${BC}toalhas/img-2.png`,
      `${BC}toalhas/img-3.png`,
    ],
    tag: "60% OFF",
    description:
      "Kit com 6 Toalhas de Banho Folha em 100% algodão felpudo, com desenho jacquard de folhas na barra. Fio penteado de alta absorção que seca o corpo rapidamente, toque macio e aveludado que não agride a pele e alta durabilidade mesmo após várias lavagens. Medidas aproximadas de 70x140 cm, gramatura reforçada, barra com acabamento em ponto duplo que evita desfiar, cores firmes que não desbotam e secagem rápida no varal. Pode ser lavada na máquina. As cores são enviadas sortidas conforme disponibilidade de estoque, garantindo um jogo variado e alegre para o seu banheiro.",
    sizes: ["70x140 cm"],
    sizeLabel: "Tamanho",
    colorVariants: [
      { label: "Sortidas", colors: ["#ec4a89", "#f4735e", "#3ec8de", "#1e2a6b", "#4b4f56", "#8b6fe0"], image: `${BC}toalhas/img-1.png` },
    ],
  },
  {
    id: 17,
    slug: "jogo-panelas-10-pecas-antiaderente-bianco-vanilla",
    name: "Jogo de Panelas 10 Peças Antiaderente com Tampa de Vidro Temperado Bianco Vanilla",
    price: 79.9,
    originalPrice: 299.9,
    image: `${BC}bianco-v1/img-1.png`,
    hoverImage: `${BC}bianco-v1/img-2.png`,
    images: [
      `${BC}bianco-v1/img-1.png`,
      `${BC}bianco-v1/img-2.png`,
      `${BC}bianco-v1/img-3.png`,
      `${BC}bianco-v1/img-4.png`,
      `${BC}bianco-v1/img-5.png`,
    ],
    tag: "73% OFF",
    description:
      "Jogo de Panelas Bianco Vanilla com 10 peças completas para equipar toda a sua cozinha. Revestimento antiaderente de alta durabilidade, tampas de vidro temperado com visor, cabos ergonômicos que não esquentam e compatibilidade com fogão a gás, elétrico e vitrocerâmico.",
    sizes: [],
  },
  {
    id: 19,
    slug: "coberdrom-casal-queen-dupla-face-sherpa-extra-macio",
    name: "Coberdrom Casal Queen Dupla Face Sherpa Extra Macio e Aconchegante",
    price: 79.9,
    originalPrice: 599.4,
    image: `${BC}kit6-coberdrom-main.png`,
    hoverImage: `${BC}kit6-coberdrom-cinza.jpg`,
    images: [
      `${BC}kit6-coberdrom-main.png`,
      `${BC}kit6-coberdrom-cinza.jpg`,
      `${BC}kit6-coberdrom-preto.jpg`,
      `${BC}kit6-coberdrom-vermelho.jpg`,
      `${BC}kit6-coberdrom-bege.jpg`,
      `${BC}kit6-coberdrom-azul.jpg`,
      `${BC}kit6-coberdrom-marrom.jpg`,
    ],
    tag: "87% OFF",
    description:
      "Coberdrom Casal/Queen Dupla Face Sherpa de altíssima qualidade: um lado em microfibra aveludada e o outro em sherpa peluciado extra macio. Retém o calor nas noites frias, não solta pelos e pode ser lavado na máquina.",
    sizes: ["Casal/Queen"],
    colorVariants: [
      { label: "Cinza", colors: ["#8a8a8a"], image: `${BC}kit6-coberdrom-cinza.jpg` },
      { label: "Preto", colors: ["#1a1a1a"], image: `${BC}kit6-coberdrom-preto.jpg` },
      { label: "Vermelho", colors: ["#c4161c"], image: `${BC}kit6-coberdrom-vermelho.jpg` },
      { label: "Bege", colors: ["#d2b48c"], image: `${BC}kit6-coberdrom-bege.jpg` },
      { label: "Azul Marinho", colors: ["#1e2a44"], image: `${BC}kit6-coberdrom-azul.jpg` },
      { label: "Marrom Chocolate", colors: ["#5a3a22"], image: `${BC}kit6-coberdrom-marrom.jpg` },
    ],
  },
  {
    id: 20,
    slug: "liquidificador-mondial-l-99-turbo-3-velocidades-550w",
    name: "Liquidificador Mondial L-99 Turbo 3 Velocidades 550W",
    price: 69.9,
    originalPrice: 249.9,
    image: `${BC}mondial-l99-preto.png`,
    hoverImage: `${BC}mondial-l99-vermelho.png`,
    images: [
      `${BC}mondial-l99-preto.png`,
      `${BC}mondial-l99-lifestyle.png`,
      `${BC}mondial-l99-potencia.png`,
      `${BC}mondial-l99-jarra.png`,
      `${BC}mondial-l99-filtro.png`,
      `${BC}mondial-l99-tapa.png`,
      `${BC}mondial-l99-laminas.png`,
      `${BC}mondial-l99-pies.png`,
      `${BC}mondial-l99-dimensoes.png`,
    ],
    tag: "72% OFF",
    description:
      "Liquidificador Mondial L-99 Turbo Power com motor de 550W, 3 velocidades + função pulsar, lâminas em aço inox de 4 pontas e jarra com filtro removível. Prepara sucos, vitaminas e massas com rapidez.",
    sizes: ["110V", "220V"],
    sizeLabel: "Voltagem",
    colorVariants: [
      { label: "Preto", colors: ["#1a1a1a"], image: `${BC}mondial-l99-preto.png` },
      { label: "Vermelho", colors: ["#c4161c"], image: `${BC}mondial-l99-vermelho.png` },
    ],
  },
  {
    id: 102,
    slug: "aparador-buffet-sala-escritorio-branco-com-prateleiras",
    name: "Aparador Buffet Sala Escritório Branco Com Prateleiras",
    price: 69.9,
    originalPrice: 99,
    image: `${CP}aparador-1.webp`,
    images: [`${CP}aparador-1.webp`],
    tag: "29% OFF",
    description:
      "Aparador buffet em MDP branco com prateleiras amplas, ideal para sala, hall de entrada ou escritório. Estrutura resistente, acabamento fosco e montagem simples.",
  },
  {
    id: 103,
    slug: "movel-moderno-de-cozinha-suporte-duplo-de-parede-preto",
    name: "Móvel Moderno De Cozinha Suporte Duplo De Parede Preto",
    price: 99,
    originalPrice: 130,
    image: `${CP}movelcozinha-1.webp`,
    hoverImage: `${CP}movelcozinha-2.webp`,
    images: [`${CP}movelcozinha-1.webp`, `${CP}movelcozinha-2.webp`],
    tag: "24% OFF",
    description:
      "Suporte duplo de parede para cozinha em acabamento preto fosco. Organiza micro-ondas, forno elétrico e utensílios liberando espaço na bancada.",
  },
  {
    id: 104,
    slug: "jogo-de-6-tacas-transparente-diamond-350ml",
    name: "Jogo De 6 Taças Transparente Diamond 350ml",
    price: 39.9,
    originalPrice: 59,
    image: `${CP}tacas-1.webp`,
    hoverImage: `${CP}tacas-2.webp`,
    images: [`${CP}tacas-1.webp`, `${CP}tacas-2.webp`],
    tag: "32% OFF",
    description:
      "Jogo com 6 taças Diamond de 350ml em vidro transparente com relevo lapidado. Deixa a mesa posta sofisticada e é indicado para água, vinho e drinks.",
  },
  {
    id: 105,
    slug: "sapateira-industrial-3-planos-resistente-sapatos-organizados-cor-marrom-claro",
    name: "Sapateira Industrial 3 Planos Resistente Sapatos Organizados Cor Marrom-claro",
    price: 129.9,
    originalPrice: 179,
    image: `${CP}sapind-1.webp`,
    hoverImage: `${CP}sapind-2.webp`,
    images: [`${CP}sapind-1.webp`, `${CP}sapind-2.webp`],
    tag: "27% OFF",
    description:
      "Sapateira estilo industrial com 3 planos, estrutura metálica reforçada e prateleiras em MDP marrom-claro. Comporta até 12 pares com organização e estilo.",
  },
  {
    id: 106,
    slug: "sapateira-simples-branca-para-quarto-sala-cor-branco",
    name: "Sapateira Simples Branca Para Quarto Sala Cor Branco",
    price: 59.9,
    originalPrice: 74,
    image: `${CP}sapsimples-1.webp`,
    hoverImage: `${CP}sapsimples-2.webp`,
    images: [`${CP}sapsimples-1.webp`, `${CP}sapsimples-2.webp`],
    tag: "19% OFF",
    description:
      "Sapateira compacta branca para quarto, sala ou hall. Design clean, ocupa pouco espaço e mantém os calçados organizados e ventilados.",
  },
  {
    id: 107,
    slug: "mesa-cabeceira-branca-mdp-nicho-prateleira-moderna-quarto-fosco-preto-ou-branco",
    name: "Mesa Cabeceira Branca Mdp Nicho Prateleira Moderna Quarto Fosco Preto ou Branco",
    price: 35.9,
    originalPrice: 53,
    image: `${CP}cabeceira-1.webp`,
    hoverImage: `${CP}cabeceira-2.webp`,
    images: [`${CP}cabeceira-1.webp`, `${CP}cabeceira-2.webp`],
    tag: "32% OFF",
    description:
      "Mesa de cabeceira moderna em MDP fosco com nicho e prateleira. Perfeita para apoiar celular, livros e abajur ao lado da cama.",
    sizes: ["Branco", "Preto"],
    sizeLabel: "Cor",
  },
  {
    id: 108,
    slug: "suporte-suspenso-cozinha-preto-modular-micro-ondas-aereo",
    name: "Suporte Suspenso Cozinha Preto Modular Micro-ondas Aereo",
    price: 99.9,
    originalPrice: 135,
    image: `${CP}suspenso-1.webp`,
    hoverImage: `${CP}suspenso-2.webp`,
    images: [`${CP}suspenso-1.webp`, `${CP}suspenso-2.webp`],
    tag: "26% OFF",
    description:
      "Suporte aéreo modular preto para micro-ondas e utensílios. Fixação na parede, alta resistência e visual moderno para a cozinha.",
  },
  {
    id: 109,
    slug: "mesa-de-centro-sala-sofa-apoio-mesinha-lateral-decoracao-cor-branco",
    name: "Mesa De Centro Sala Sofá Apoio Mesinha Lateral Decoração Cor Branco",
    price: 99.9,
    originalPrice: 140,
    image: `${CP}mesacentro-1.webp`,
    hoverImage: `${CP}mesacentro-2.webp`,
    images: [`${CP}mesacentro-1.webp`, `${CP}mesacentro-2.webp`],
    tag: "29% OFF",
    description:
      "Mesa de centro branca com design leve e contemporâneo. Serve como apoio ao lado do sofá ou como peça central da sala.",
  },
  {
    id: 110,
    slug: "armario-suspenso-branco-com-nicho-porta-e-3-prateleiras",
    name: "Armário Suspenso Branco Com Nicho Porta E 3 Prateleiras",
    price: 55.9,
    originalPrice: 80,
    image: `${CP}armario-1.webp`,
    hoverImage: `${CP}armario-2.webp`,
    images: [`${CP}armario-1.webp`, `${CP}armario-2.webp`],
    tag: "30% OFF",
    description:
      "Armário suspenso branco com porta, nicho e 3 prateleiras internas. Ideal para banheiro, lavanderia ou cozinha.",
  },
  {
    id: 111,
    slug: "suporte-monitor-ergonomico-preto-mel-para-setup-gamer-preto-e-mel",
    name: "Suporte Monitor Ergonômico Preto Mel Para Setup Gamer Preto E Mel",
    price: 59.9,
    originalPrice: 79,
    image: `${CP}monitor-1.webp`,
    images: [`${CP}monitor-1.webp`],
    tag: "24% OFF",
    description:
      "Suporte ergonômico para monitor em duas cores, eleva a tela à altura dos olhos e cria espaço extra na mesa para teclado e acessórios.",
  },
  {
    id: 112,
    slug: "rack-sapateira-2-prateleiras-em-mdp-preto-ou-branco",
    name: "Rack Sapateira 2 Prateleiras em MDP - Preto ou Branco",
    price: 59.9,
    originalPrice: 75,
    image: `${CP}racksap-1.webp`,
    hoverImage: `${CP}racksap-2.webp`,
    images: [`${CP}racksap-1.webp`, `${CP}racksap-2.webp`],
    tag: "20% OFF",
    description:
      "Rack sapateira em MDP com 2 prateleiras, acabamento fosco e montagem rápida. Disponível em preto ou branco.",
    sizes: ["Preto", "Branco"],
    sizeLabel: "Cor",
  },
  {
    id: 113,
    slug: "mesa-de-cabeceira-com-rodinhas-safira-pequena-20x20x60cm-branco-ou-preto-quarto-sala",
    name: "Mesa De Cabeceira com Rodinhas Safira Pequena 20x20x60cm Branco ou Preto Quarto Sala",
    price: 49.9,
    originalPrice: 66,
    image: `${CP}safira-1.webp`,
    images: [`${CP}safira-1.webp`],
    tag: "24% OFF",
    description:
      "Mesa de cabeceira Safira 20x20x60cm com rodinhas, prática de mover e perfeita para espaços pequenos no quarto ou na sala.",
    sizes: ["Branco", "Preto"],
    sizeLabel: "Cor",
  },
  {
    id: 114,
    slug: "esfregao-mop-spray-rodo-microfibra-reservatorio-380ml",
    name: "Esfregão Mop Spray Rodo Microfibra Reservatório 380ml",
    price: 36.4,
    originalPrice: 52,
    image: `${CP}mopspray-1.webp`,
    hoverImage: `${CP}mopspray-2.webp`,
    images: [`${CP}mopspray-1.webp`, `${CP}mopspray-2.webp`],
    tag: "30% OFF",
    description:
      "Mop spray com reservatório de 380ml e refil em microfibra. Borrifa e limpa ao mesmo tempo, sem precisar de balde.",
  },
  {
    id: 115,
    slug: "esfregao-mop-inox-balde-10-litros-e-refil-microfibra",
    name: "Esfregão Mop Inox Balde 10,5 litros e 2 Refil Microfibra Cabo 140 cm",
    price: 50,
    originalPrice: 80,
    image: `${CP}mopinox-1.webp`,
    images: [`${CP}mopinox-1.webp`],
    tag: "38% OFF",
    description:
      "Kit esfregão mop com balde de 10,5 litros, cesto centrifugador em inox, cabo de 140cm e 2 refis de microfibra.",
  },
];
