const VAPOR_ASSET = "/assets/products-bc/vapor/irisoy-vapor-2500w-";
const VAPOR_1 = `${VAPOR_ASSET}1.png`;
const VAPOR_2 = `${VAPOR_ASSET}2.png`;
const VAPOR_3 = `${VAPOR_ASSET}3.png`;
const VAPOR_4 = `${VAPOR_ASSET}4.png`;
const VAPOR_5 = `${VAPOR_ASSET}5.png`;
const VAPOR_6 = `${VAPOR_ASSET}6.png`;
const VAPOR_7 = `${VAPOR_ASSET}7.png`;
const VAPOR_8 = `${VAPOR_ASSET}8.png`;
const VAPOR_9 = `${VAPOR_ASSET}9.png`;
const MICRO_ASSET = "/assets/products-bc/microondas/mondial-mo-01-21b-";
const MICRO_1 = `${MICRO_ASSET}1.png`;
const MICRO_2 = `${MICRO_ASSET}2.png`;
const MICRO_3 = `${MICRO_ASSET}3.png`;
const MICRO_4 = `${MICRO_ASSET}4.png`;
const MICRO_5 = `${MICRO_ASSET}5.png`;
const MICRO_6 = `${MICRO_ASSET}6.png`;
const MICRO_7 = `${MICRO_ASSET}7.png`;
const MICRO_8 = `${MICRO_ASSET}8.png`;

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
  /** Preço por tamanho/quantidade quando o valor deve variar (ex.: 1 ou 2 unidades) */
  sizePrices?: Record<string, number>;
  /** Quantidade de peças que o cliente escolhe (cor + tamanho por peça) */
  kitPicks?: number;
  colorVariants?: { label: string; colors: string[]; image?: string }[];
  /** Quando true, o produto não aparece na vitrine da home nem na busca */
  hidden?: boolean;
}


const BC = "/assets/products-bc/";
const ESC = "/assets/products-bc/escova-ions/";
const COB = "/assets/products-bc/cobertor-flannel/";
const YPE = "/assets/products-bc/ype/";
const CL = "/assets/products-bc/cobre-leito/";
const TRV = "/assets/products-bc/travesseiro/";
const CAD = "/assets/products-bc/cadeira-ergonomica/";
const BIKE = "/assets/products-bc/bicicleta-spinning/";





export const products: Product[] = [
  {
    id: 117,
    slug: "kit-2-travesseiros-cervicais-abranuv-sono-confortavel",
    name: "Kit 2 Travesseiros Cervicais ABRANUV, sono confortável",
    price: 89.9,
    image: "/assets/products-bc/abranuv-kit2/kit-1.png",
    hoverImage: "/assets/products-bc/abranuv-kit2/kit-6.png",
    images: ["/assets/products-bc/abranuv-kit2/kit-1.png", "/assets/products-bc/abranuv-kit2/kit-2.png", "/assets/products-bc/abranuv-kit2/kit-3.png", "/assets/products-bc/abranuv-kit2/kit-4.png", "/assets/products-bc/abranuv-kit2/kit-5.png", "/assets/products-bc/abranuv-kit2/kit-6.png", "/assets/products-bc/abranuv-kit2/kit-7.png", "/assets/products-bc/abranuv-kit2/kit-8.png", "/assets/products-bc/abranuv-kit2/kit-9.png", "/assets/products-bc/abranuv-kit2/kit-10.png"],
    description: "Kit com 2 travesseiros cervicais ABRANUV PRO2.0, com formato anatômico em borboleta, pensado para oferecer apoio à cabeça e ao pescoço durante o descanso. A superfície apresenta contornos para diferentes posições de dormir, com regiões de apoio mais altas e mais baixas. Revestimento em tons de cinza e branco e núcleo descrito no material ilustrativo como espuma viscoelástica de recuperação lenta.\n\nCARACTERÍSTICAS\n• Kit com 2 unidades\n• Formato ergonômico tipo borboleta\n• Áreas de apoio para quem dorme de costas ou de lado\n• Lados de diferentes alturas, conforme orientação ilustrada\n• Superfície macia e contornada\n\nMEDIDAS INFORMADAS NAS IMAGENS\n• Comprimento: aproximadamente 62 cm\n• Largura: aproximadamente 41 cm\n• Alturas ilustradas: 8 cm e 10 cm em diferentes áreas (há indicação adicional de 11–13 cm em outro esquema)\n\nObservação: o conforto varia conforme o usuário; o travesseiro não substitui avaliação ou tratamento médico. Dimensões e materiais devem ser conferidos com a embalagem do lote entregue.",
  },

  {
    id: 116,
    slug: "smart-tv-aoc-43-43s5155-78g-full-hd-led-wifi-roku-usb-hdmi",
    name: 'Smart TV AOC 43" 43S5155/78G Full HD LED Wifi Roku USB HDMI',
    price: 197.9,
    image: "/assets/products-bc/aoc-roku-43/tv-1.png",
    hoverImage: "/assets/products-bc/aoc-roku-43/tv-3.png",
    images: ["/assets/products-bc/aoc-roku-43/tv-1.png", "/assets/products-bc/aoc-roku-43/tv-2.png", "/assets/products-bc/aoc-roku-43/tv-3.png", "/assets/products-bc/aoc-roku-43/tv-4.png", "/assets/products-bc/aoc-roku-43/tv-5.png", "/assets/products-bc/aoc-roku-43/tv-6.png", "/assets/products-bc/aoc-roku-43/tv-7.png"],
    description: "Smart TV AOC de 43 polegadas com tela LED Full HD e sistema Roku TV. Navegue pelos aplicativos de streaming em uma interface prática, com conexão Wi-Fi e entradas HDMI e USB para seus dispositivos.\n\nDESTAQUES\n• Tela LED de 43 polegadas\n• Resolução Full HD para imagens nítidas\n• Plataforma inteligente Roku TV\n• Conectividade Wi-Fi\n• Entradas HDMI e USB\n• Compatibilidade com assistentes de voz, conforme disponibilidade e configuração do sistema\n• Tecnologia de áudio Dolby Audio, conforme material ilustrativo do produto\n\nINFORMAÇÕES TÉCNICAS\n• Marca: AOC\n• Modelo informado: 43S5155/78G\n• Tipo: Smart TV LED\n• Tamanho da tela: 43 polegadas\n• Resolução: Full HD (1920 × 1080 pixels)\n• Sistema operacional: Roku TV\n• Conexão sem fio: Wi-Fi\n• Conexões: HDMI e USB\n• Cor: preta\n• Base: dois pés de apoio\n\nObservação: confira a quantidade exata de entradas, a voltagem, as dimensões e os itens inclusos na etiqueta ou ficha técnica do fabricante para esta versão do modelo.",
  },

  {
    id: 40,
    slug: "kit-6-pecas-cobre-leito-piquet-jogo-fronhas-ponto-palito-lencol-elastico",
    name: "Kit 6 Peças Cobre Leito Piquet com Jogo de Fronhas Ponto Palito e Lençol de Elástico para Cama Confortável",
    price: 69.9,
    image: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-1.webp",
    hoverImage: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-2.webp",
    images: [
      "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-1.webp",
      "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-2.webp",
      "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-3.webp",
      "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-4.webp",
      "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-5.webp",
      "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-6.webp",
      "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-7.webp",
      "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-8.webp",
      "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-9.webp",
    ],
    sizes: ["Casal", "Queen", "King"],
    sizeLabel: "Tamanho",
    tag: "KIT 6 PEÇAS",
    colorVariants: [
      { label: "Laços Pink", colors: ["#d10062", "#ffffff"], image: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-1.webp" },
      { label: "Cerejas + Vermelho", colors: ["#d40000", "#ffffff"], image: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-2.webp" },
      { label: "Cerejas + Branco", colors: ["#ffffff", "#d40000"], image: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-3.webp" },
      { label: "Folhagem Verde", colors: ["#556b2f", "#ffffff"], image: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-4.webp" },
      { label: "Borboletas + Pink", colors: ["#d10062", "#f5c6df"], image: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-5.webp" },
      { label: "Corações Bege", colors: ["#c8a27a", "#ffffff"], image: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-6.webp" },
      { label: "Corações Bege + Branco", colors: ["#ffffff", "#c8a27a"], image: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-7.webp" },
      { label: "Corações Vermelho", colors: ["#e00000", "#ffffff"], image: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-8.webp" },
      { label: "Corações Vermelho + Branco", colors: ["#ffffff", "#e00000"], image: "/assets/products-bc/kit-cobre-leito-piquet/cobre-leito-9.webp" },
    ],
    description:
      "Kit completo com 6 peças para renovar a cama com praticidade e um visual coordenado. O conjunto reúne cobre leito em piquet, jogo de fronhas com acabamento ponto palito e lençol com elástico, facilitando a montagem da cama no dia a dia. Escolha entre os tamanhos Casal, Queen e King e selecione a combinação de cor e estampa que mais combina com o quarto. O lençol com elástico ajuda a manter o colchão bem ajustado, enquanto o acabamento ponto palito das fronhas traz um detalhe delicado ao conjunto.",
  },
  {
    id: 39,
    slug: "micro-ondas-mondial-mo-01-21-b-21-litros",
    name: "Micro-ondas Mondial Mo-01-21-b 21 Litros",
    price: 89.9,
    originalPrice: 499.9,
    image: MICRO_1,
    hoverImage: MICRO_2,
    images: [
      MICRO_1,
      MICRO_2,
      MICRO_3,
      MICRO_4,
      MICRO_5,
      MICRO_6,
      MICRO_7,
      MICRO_8,
    ],
    sizes: ["110V", "220V"],
    sizeLabel: "Voltagem",
    tag: "82% OFF",
    description:
      "Micro-ondas Mondial MO-01-21-B com 21 litros de capacidade e 1.200W de potência: espaço suficiente para as receitas do dia a dia e aquecimento rápido e uniforme. Design preto espelhado com painel digital, puxador cromado e acabamento que combina com qualquer cozinha.\n\nFUNÇÕES E DETALHES\n• Menu Dia a Dia: arroz, bebidas e manter aquecido com um só toque\n• Menu Kids: pipoca, brigadeiro e bolo de caneca de forma prática\n• Descongelar: feijão, carnes e aves\n• Função Manter Aquecido: mantém o prato quente até a hora de servir\n• Função Tira Odor: evita odores internos após o preparo\n• Trava de segurança para crianças\n• Botão Iniciar +30 seg. e relógio/temporizador digital\n• Display digital verde de fácil leitura\n• QR Code de receitas Mondial\n\nESPECIFICAÇÕES\n• Capacidade: 21 litros\n• Potência: 1.200W\n• Voltagem: 110V ou 220V (escolha na compra)\n• Eficiência energética: selo classificação A\n• Dimensões: 45 cm (largura) x 33 cm (profundidade) x 26 cm (altura)\n• Peso: 10,5 kg\n• Cor: preto\n• Prato giratório removível e níveis de potência ajustáveis",
  },
  {
    id: 38,
    slug: "irisoy-limpador-a-vapor-2500w-220v-profissional-vapor-seco-kit-6-em-1",
    name: "IRISOY Limpador a Vapor 2500W Profissional - Vapor Seco Elimina 99,9% das Bactérias",
    price: 79.9,
    originalPrice: 299.9,
    image: VAPOR_1,
    hoverImage: VAPOR_3,
    images: [
      VAPOR_1,
      VAPOR_3,
      VAPOR_4,
      VAPOR_5,
      VAPOR_6,
      VAPOR_7,
      VAPOR_8,
      VAPOR_9,
      VAPOR_2,
    ],
    sizes: ["110V", "220V"],
    sizeLabel: "Voltagem",
    tag: "73% OFF",
    description:
      "Ácaros e Gordura sem Produtos Químicos, Acaba com Mofo, Ideal para Cozinha, Banheiro, Carro, Sofá, Colchão e Azulejos, Kit Completo 6 em 1.\n\nLimpador a vapor pressurizado IRISOY de 2500W que higieniza com vapor seco a até 105 °C, eliminando 99,9% das bactérias, ácaros, mofo e gordura encostrada sem usar nenhum produto químico. Aquecimento rápido em cerca de 5 a 15 segundos, pressão de saída de 3 bar e 6 velocidades ajustáveis para cada tipo de sujeira: fogão, coifa, rejunte de azulejo, vaso sanitário, vidros, sofá, colchão, tapete e detalhamento automotivo (bancos, rodas, motor e parabrisa).\n\nESPECIFICAÇÕES\n• Potência: 2500W\n• Voltagem: 110V ou 220V (escolha na compra)\n• Temperatura do vapor: até 105 °C / 229 °F\n• Pressão de saída: 3 bar\n• Reservatório: 1,2 L (1200 ml) — até 1 hora de uso, com reabastecimento a qualquer momento\n• Aquecimento: 5 a 15 segundos\n• 6 velocidades de vapor ajustáveis\n• Dimensões compactas: 19 x 15 x 13 cm\n• Mangueira de 1,5 m e cabo de energia de 2 m\n• Corpo portátil com alça de transporte e tanque transparente\n\nKIT COMPLETO 6 EM 1\n• Bico curvo para cantos e vaso sanitário\n• Raspador de janelas/vidros\n• Raspador de couro e tecido\n• Escova de metal para gordura pesada\n• Raspadores pequenos\n• Escovas de nylon\nAcompanha ainda pano de microfibra, anéis de vedação, agulha de limpeza e cabo de alimentação.",
  },
  {
    id: 37,
    slug: "coberdrom-queen-sherpa-la-de-carneiro-macio-quente-inverno",
    name: "Coberdrom Queen Com Sherpa Lã de Carneiro Promoção Atacado Leve Macio e Muito Quente para Inverno",
    price: 69.9,
    originalPrice: 259.9,
    image: "/assets/products-bc/coberdrom-sherpa/cs-1.png",
    hoverImage: "/assets/products-bc/coberdrom-sherpa/cs-2.png",
    images: [
      "/assets/products-bc/coberdrom-sherpa/cs-1.png",
      "/assets/products-bc/coberdrom-sherpa/cs-2.png",
      "/assets/products-bc/coberdrom-sherpa/cs-3.png",
      "/assets/products-bc/coberdrom-sherpa/cs-9.png",
      "/assets/products-bc/coberdrom-sherpa/cs-8.png",
    ],
    tag: "73% OFF",
    colorVariants: [
      { label: "Cinza", colors: ["#9a9c9e"], image: "/assets/products-bc/coberdrom-sherpa/cs-1.png" },
      { label: "Bege", colors: ["#b99a7c"], image: "/assets/products-bc/coberdrom-sherpa/cs-2.png" },
      { label: "Azul Marinho", colors: ["#1e3164"], image: "/assets/products-bc/coberdrom-sherpa/cs-3.png" },
      { label: "Pink", colors: ["#d62a7e"], image: "/assets/products-bc/coberdrom-sherpa/cs-4.png" },
      { label: "Preto", colors: ["#1b1b1b"], image: "/assets/products-bc/coberdrom-sherpa/cs-5.png" },
      { label: "Rosé", colors: ["#c9808a"], image: "/assets/products-bc/coberdrom-sherpa/cs-6.png" },
      { label: "Marrom", colors: ["#7a5236"], image: "/assets/products-bc/coberdrom-sherpa/cs-7.png" },
      { label: "Tiffany", colors: ["#8fd3d2"], image: "/assets/products-bc/coberdrom-sherpa/cs-8.png" },
      { label: "Vermelho", colors: ["#9e1f22"], image: "/assets/products-bc/coberdrom-sherpa/cs-9.png" },
    ],
    description:
      "Coberdrom Queen dupla face com sherpa lã de carneiro de um lado e microfibra aveludada do outro. Enchimento em manta siliconada matelassê que retém o calor sem pesar, ideal para as noites mais frias do inverno.",
  },
  {

    id: 36,
    slug: "liquidificador-electrolux-1000w-2-7l-efficient-triforce-5-velocidades-cinza-ebl1000",
    name: "Liquidificador Electrolux 1000W 2.7L Efficient TriForce 5 Velocidades Cinza (EBL1000)",
    price: 69.9,
    originalPrice: 279.9,
    image: "/assets/products-bc/liquidificador-electrolux/liq-1.png",
    hoverImage: "/assets/products-bc/liquidificador-electrolux/liq-4.png",
    images: [
      "/assets/products-bc/liquidificador-electrolux/liq-1.png",
      "/assets/products-bc/liquidificador-electrolux/liq-4.png",
      "/assets/products-bc/liquidificador-electrolux/liq-3.png",
      "/assets/products-bc/liquidificador-electrolux/liq-5.png",
      "/assets/products-bc/liquidificador-electrolux/liq-6.png",
      "/assets/products-bc/liquidificador-electrolux/liq-7.png",
      "/assets/products-bc/liquidificador-electrolux/liq-8.png",
      "/assets/products-bc/liquidificador-electrolux/liq-2.png",
    ],
    sizes: ["127V", "220V"],
    sizeLabel: "Voltagem",
    tag: "75% OFF",
    description:
      "Liquidificador Electrolux Efficient EBL1000 com motor de 1000W, 5 velocidades mais função Pulsar, Gelo e Limpa Fácil. Copo de 2,7 litros com lâminas TriForce em aço inox para triturar gelo, preparar sucos, vitaminas e massas com rapidez.",
  },
  {

    id: 35,
    slug: "gaabor-processador-multislice-300w-4-laminas-vidro-2l",
    name: "Gaabor Processador Multislice 300w, 4 lâminas, Recipiente de vidro (6mm) e capacidade 2L",
    price: 69.9,
    originalPrice: 229.9,
    image: "/assets/products-bc/gaabor-processador/proc-1.png",
    hoverImage: "/assets/products-bc/gaabor-processador/proc-2.png",
    images: [
      "/assets/products-bc/gaabor-processador/proc-1.png",
      "/assets/products-bc/gaabor-processador/proc-2.png",
      "/assets/products-bc/gaabor-processador/proc-3.png",
      "/assets/products-bc/gaabor-processador/proc-4.png",
      "/assets/products-bc/gaabor-processador/proc-5.png",
      "/assets/products-bc/gaabor-processador/proc-6.png",
      "/assets/products-bc/gaabor-processador/proc-7.png",
    ],
    sizes: ["127V", "220V"],
    sizeLabel: "Voltagem",
    tag: "70% OFF",
    description:
      "Processador de alimentos Gaabor Multislice com motor de 300W, lâminas duplas em formato \"S\" (4 cortes) em aço inoxidável e recipiente de vidro reforçado de 6mm com 2 litros de capacidade. Processa até 550g de carne por vez e conta com 2 velocidades para controlar a textura dos alimentos.",
  },
  {
    id: 33,
    slug: "escova-de-limpeza-eletrica-multifuncional-9-em-1-retratil",
    name: "Escova de limpeza elétrica multifuncional 9 em 1",
    price: 59.9,
    originalPrice: 129,
    image: "/assets/products-bc/escova-limpeza-9em1/escova-1.png",
    images: [
      "/assets/products-bc/escova-limpeza-9em1/escova-1.png",
      "/assets/products-bc/escova-limpeza-9em1/escova-2.png",
      "/assets/products-bc/escova-limpeza-9em1/escova-3.png",
      "/assets/products-bc/escova-limpeza-9em1/escova-4.png",
      "/assets/products-bc/escova-limpeza-9em1/escova-7.png",
    ],
    tag: "54% OFF",
    description:
      "A solução definitiva para limpezas pesadas e delicadas. Esta escova elétrica 9 em 1 é totalmente retrátil, com cabo extensível de aço inoxidável que permite alcançar cantos altos, teto e azulejos sem esforço. Equipada com bateria de 3000mAh e carregamento USB-C, oferece autonomia para limpar banheiro, cozinha, janelas e até o carro. Acompanha 9 tipos de cerdas e esponjas para diferentes superfícies.",
  },
  {
    id: 32,
    slug: "cadeira-escritorio-suporte-lombar-ergonomico-mesh-presidente-premium",
    name: "Cadeira de Escritório Suporte Lombar Ergonômico Malha Respirável Mesh Apoio Cabeça Confortável Art Cadeiras Presidente Premium (Cinza e Branco)",
    price: 127.9,
    originalPrice: 899.9,
    image: `${CAD}cadeira-main.png`,
    hoverImage: `${CAD}cadeira-angle-front.png`,
    images: [
      `${CAD}cadeira-main.png`,
      `${CAD}cadeira-front.png`,
      `${CAD}cadeira-angle-front.png`,
      `${CAD}cadeira-side.png`,
      `${CAD}cadeira-back.png`,
      `${CAD}cadeira-angle-back.png`,
      `${CAD}cadeira-seat-detail.png`,
      `${CAD}cadeira-dims.png`,
    ],


    tag: "85% OFF",
    description:
      "Cadeira de Escritório Presidente Premium com foco total em ergonomia e saúde postural. Projetada com Suporte Lombar 3D dinâmico que se ajusta automaticamente ao movimento das suas costas, aliviando a pressão na coluna durante longas horas de trabalho ou estudo. O revestimento em Malha Mesh Respirável de alta densidade promove a circulação de ar, evitando o acúmulo de calor e suor. Possui Apoio de Cabeça com ajuste de altura e ângulo, braços articulados que permitem aproximar a cadeira da mesa com facilidade, e assento com espuma de memória revestida em tecido tecnológico que não deforma. A base reforçada em nylon branco com rodízios anti-ruído garante estabilidade e suavidade no deslocamento. O design minimalista em Cinza e Branco traz sofisticação moderna para qualquer ambiente de home office ou escritório corporativo. Funções completas de ajuste de altura por pistão a gás classe 4 e sistema relax com trava.",
  },

  


  {
    id: 30,
    slug: "travesseiro-ortopedico-borboleta-cervical-dores-coluna-cabeca",
    name: "Travesseiro ortopédico borboleta cervical para combate a dores na coluna, dores de cabeça",
    price: 69.9,
    originalPrice: 199.9,
    image: `${TRV}img-180.png`,
    hoverImage: `${TRV}img-181.png`,
    images: [
      `${TRV}img-180.png`,
      `${TRV}img-181.png`,
      `${TRV}img-182.png`,
      `${TRV}img-183.png`,
    ],
    tag: "65% OFF",
    description:
      "Travesseiro Ortopédico Cervical em formato borboleta, desenvolvido com viscoelástico de memória de alta densidade para aliviar dores na coluna cervical, tensão nos ombros e dores de cabeça causadas por má postura ao dormir. O desenho anatômico com recortes laterais em asa acomoda os ombros e os braços, mantendo a cabeça, o pescoço e a coluna alinhados em uma única linha reta — o que reduz a compressão dos nervos cervicais e a rigidez matinal. A concavidade central com furo de descompressão distribui o peso da cabeça, elimina pontos de pressão na nuca e favorece a circulação, enquanto as curvas ergonômicas dão apoio firme ao pescoço para quem dorme de barriga para cima, de lado ou alternando de posição. A espuma viscoelástica reage ao calor do corpo e se molda em segundos, voltando lentamente ao formato original sem afundar nem perder o suporte com o tempo. A capa externa é em tecido matelassê respirável, removível e lavável na máquina através de zíper, com estrutura de células abertas que dissipa o calor e mantém o travesseiro fresco a noite inteira. Material antiácaro, antifungo e hipoalergênico, indicado para quem tem rinite ou pele sensível. Também é muito utilizado por quem sofre com bruxismo, torcicolo frequente, ronco e apneia leve, já que a elevação correta do pescoço mantém as vias aéreas abertas. Medidas aproximadas de 60 x 35 x 11/8 cm (altura dupla nas laterais), atendendo tanto quem prefere travesseiro mais alto quanto mais baixo — basta virar. Recomendado por fisioterapeutas como apoio no tratamento de cervicalgia, hérnia de disco cervical e dores de cabeça tensionais.",
  },
  {

    id: 29,
    slug: "kit-2-cobre-leito-colcha-dupla-face-150-fios-matelado-boutis",
    name: "Kit 2 Cobre Leito Colcha Dupla Face 150 Fios Matelado Boutis Estampado Toque Macio Antialérgico Hotel Premium",
    price: 79.9,
    originalPrice: 219.9,
    image: `${CL}c1.png`,
    hoverImage: `${CL}c4.png`,
    images: [
      `${CL}c1.png`,
      `${CL}c2.png`,
      `${CL}c3.png`,
      `${CL}c4.png`,
      `${CL}c5.png`,
      `${CL}c6.png`,
      `${CL}c7.png`,
    ],
    tag: "64% OFF",
    kitPicks: 2,
    sizes: ["Solteiro", "Casal", "Queen", "King"],
    sizeLabel: "Tamanho",
    description:
      "Kit com 2 Cobre Leitos Colcha Dupla Face em tecido 150 fios com matelassê Boutis estampado, padrão Hotel Premium. Cada peça é reversível: de um lado a estampa floral/folhagem e do outro um tom liso trabalhado, dando dois visuais diferentes para o mesmo quarto. O enchimento em manta siliconada leve garante caimento bonito sobre a cama sem pesar, e o pesponto ultrassônico/matelado mantém a manta no lugar mesmo após várias lavagens. Toque macio e sedoso, tratamento antialérgico e antifungo — não solta fiapos e é indicado para quem tem rinite ou pele sensível. Secagem rápida, lavável na máquina em ciclo delicado e cores firmes que não desbotam. Você escolhe a estampa e o tamanho de cada uma das 2 peças (Solteiro, Casal, Queen ou King). Perfeito para trocar a cara do quarto, usar como colcha no verão ou sobreposto ao edredom no inverno.",
    colorVariants: [
      { label: "Floral Rosé Marfim", colors: ["#e8d9cd"], image: `${CL}c1.png` },
      { label: "Floral Cinza Perolado", colors: ["#c3c5c2"], image: `${CL}c2.png` },
      { label: "Folhagem Bege", colors: ["#d8d5c6"], image: `${CL}c3.png` },
      { label: "Floral Vintage Bege", colors: ["#e2cfc3"], image: `${CL}c4.png` },
      { label: "Floral Cinza Rosé", colors: ["#a8aca4"], image: `${CL}c5.png` },
      { label: "Outono Terracota", colors: ["#b5583f"], image: `${CL}c6.png` },
      { label: "Floral Lilás Taupe", colors: ["#a89a8e"], image: `${CL}c7.png` },
    ],
  },
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
    slug: "escova-modeladora-ions-negativos-38mm-9-ajustes-temperatura",
    name: "GOKOCO Escova modeladora de íons negativos de 38 mm – 9 ajustes de temperatura",
    price: 69.9,
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
    tag: "72% OFF",
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
    price: 127.9,
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
    tag: "57% OFF",
    description:
      "Jogo de Panelas Bianco Vanilla com 10 peças completas para equipar toda a sua cozinha. Revestimento antiaderente de alta durabilidade, tampas de vidro temperado com visor, cabos ergonômicos que não esquentam e compatibilidade com fogão a gás, elétrico e vitrocerâmico.",
    sizes: [],
    colorVariants: [
      { label: "Vanilla", colors: ["#F5F5DC"], image: `${BC}bianco-v1/img-1.png` },
      { label: "Chococcino", colors: ["#5C4033"], image: `${BC}bianco-v1/cor-chococcino.png` },
      { label: "Vermelho", colors: ["#B22222"], image: `${BC}bianco-v1/cor-red.png` },
      { label: "Stone", colors: ["#A9A9A9"], image: `${BC}bianco-v1/cor-stone.png` },
      { label: "Preto com Prata", colors: ["#2F4F4F"], image: `${BC}bianco-v1/cor-black-silver.png` },
      { label: "Rose", colors: ["#E6E6FA"], image: `${BC}bianco-v1/cor-rose.png` },
      { label: "Prestigio", colors: ["#4B3621"], image: `${BC}bianco-v1/cor-prestigio.png` },
      { label: "Preto com Vermelho", colors: ["#000000", "#FF0000"], image: `${BC}bianco-v1/cor-black-red.png` },
    ],
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
    price: 99.9,
    originalPrice: 149,
    image: `${CP}aparador-1.webp`,
    images: [`${CP}aparador-1.webp`],
    tag: "33% OFF",
    description:
      "Aparador buffet em MDP branco com prateleiras amplas, ideal para sala, hall de entrada ou escritório. Estrutura resistente, acabamento fosco e montagem simples.",
  },
  {
    id: 103,
    slug: "movel-moderno-de-cozinha-suporte-duplo-de-parede-preto",
    name: "Móvel Moderno De Cozinha Suporte Duplo De Parede Preto",
    price: 139.9,
    originalPrice: 199,
    image: `${CP}movelcozinha-1.webp`,
    hoverImage: `${CP}movelcozinha-2.webp`,
    images: [`${CP}movelcozinha-1.webp`, `${CP}movelcozinha-2.webp`],
    tag: "30% OFF",
    description:
      "Suporte duplo de parede para cozinha em acabamento preto fosco. Organiza micro-ondas, forno elétrico e utensílios liberando espaço na bancada.",
  },
  {
    id: 104,
    slug: "jogo-de-6-tacas-transparente-diamond-350ml",
    name: "Jogo De 6 Taças Transparente Diamond 350ml",
    price: 69.9,
    originalPrice: 99,
    image: `${CP}tacas-1.webp`,
    hoverImage: `${CP}tacas-2.webp`,
    images: [`${CP}tacas-1.webp`, `${CP}tacas-2.webp`],
    tag: "29% OFF",
    description:
      "Jogo com 6 taças Diamond de 350ml em vidro transparente com relevo lapidado. Deixa a mesa posta sofisticada e é indicado para água, vinho e drinks.",
  },
  {
    id: 105,
    slug: "sapateira-industrial-3-planos-resistente-sapatos-organizados-cor-marrom-claro",
    name: "Sapateira Industrial 3 Planos Resistente Sapatos Organizados Cor Marrom-claro",
    price: 159.9,
    originalPrice: 229,
    image: `${CP}sapind-1.webp`,
    hoverImage: `${CP}sapind-2.webp`,
    images: [`${CP}sapind-1.webp`, `${CP}sapind-2.webp`],
    tag: "30% OFF",
    description:
      "Sapateira estilo industrial com 3 planos, estrutura metálica reforçada e prateleiras em MDP marrom-claro. Comporta até 12 pares com organização e estilo.",
  },
  {
    id: 106,
    slug: "sapateira-simples-branca-para-quarto-sala-cor-branco",
    name: "Sapateira Simples Branca Para Quarto Sala Cor Branco",
    price: 89.9,
    originalPrice: 129,
    image: `${CP}sapsimples-1.webp`,
    hoverImage: `${CP}sapsimples-2.webp`,
    images: [`${CP}sapsimples-1.webp`, `${CP}sapsimples-2.webp`],
    tag: "30% OFF",
    description:
      "Sapateira compacta branca para quarto, sala ou hall. Design clean, ocupa pouco espaço e mantém os calçados organizados e ventilados.",
  },
  {
    id: 107,
    slug: "mesa-cabeceira-branca-mdp-nicho-prateleira-moderna-quarto-fosco-preto-ou-branco",
    name: "Mesa Cabeceira Branca Mdp Nicho Prateleira Moderna Quarto Fosco Preto ou Branco",
    price: 59.9,
    originalPrice: 89,
    image: `${CP}cabeceira-1.webp`,
    hoverImage: `${CP}cabeceira-2.webp`,
    images: [`${CP}cabeceira-1.webp`, `${CP}cabeceira-2.webp`],
    tag: "33% OFF",
    description:
      "Mesa de cabeceira moderna em MDP fosco com nicho e prateleira. Perfeita para apoiar celular, livros e abajur ao lado da cama.",
    sizes: ["Branco", "Preto"],
    sizeLabel: "Cor",
  },
  {
    id: 108,
    slug: "suporte-suspenso-cozinha-preto-modular-micro-ondas-aereo",
    name: "Suporte Suspenso Cozinha Preto Modular Micro-ondas Aereo",
    price: 149.9,
    originalPrice: 215,
    image: `${CP}suspenso-1.webp`,
    hoverImage: `${CP}suspenso-2.webp`,
    images: [`${CP}suspenso-1.webp`, `${CP}suspenso-2.webp`],
    tag: "30% OFF",
    description:
      "Suporte aéreo modular preto para micro-ondas e utensílios. Fixação na parede, alta resistência e visual moderno para a cozinha.",
  },
  {
    id: 109,
    slug: "mesa-de-centro-sala-sofa-apoio-mesinha-lateral-decoracao-cor-branco",
    name: "Mesa De Centro Sala Sofá Apoio Mesinha Lateral Decoração Cor Branco",
    price: 139.9,
    originalPrice: 199,
    image: `${CP}mesacentro-1.webp`,
    hoverImage: `${CP}mesacentro-2.webp`,
    images: [`${CP}mesacentro-1.webp`, `${CP}mesacentro-2.webp`],
    tag: "30% OFF",
    description:
      "Mesa de centro branca com design leve e contemporâneo. Serve como apoio ao lado do sofá ou como peça central da sala.",
  },
  {
    id: 110,
    slug: "armario-suspenso-branco-com-nicho-porta-e-3-prateleiras",
    name: "Armário Suspenso Branco Com Nicho Porta E 3 Prateleiras",
    price: 89.9,
    originalPrice: 129,
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
    price: 89.9,
    originalPrice: 129,
    image: `${CP}monitor-1.webp`,
    images: [`${CP}monitor-1.webp`],
    tag: "30% OFF",
    description:
      "Suporte ergonômico para monitor em duas cores, eleva a tela à altura dos olhos e cria espaço extra na mesa para teclado e acessórios.",
  },
  {
    id: 112,
    slug: "rack-sapateira-2-prateleiras-em-mdp-preto-ou-branco",
    name: "Rack Sapateira 2 Prateleiras em MDP - Preto ou Branco",
    price: 89.9,
    originalPrice: 129,
    image: `${CP}racksap-1.webp`,
    hoverImage: `${CP}racksap-2.webp`,
    images: [`${CP}racksap-1.webp`, `${CP}racksap-2.webp`],
    tag: "30% OFF",
    description:
      "Rack sapateira em MDP com 2 prateleiras, acabamento fosco e montagem rápida. Disponível em preto ou branco.",
    sizes: ["Preto", "Branco"],
    sizeLabel: "Cor",
  },
  {
    id: 113,
    slug: "mesa-de-cabeceira-com-rodinhas-safira-pequena-20x20x60cm-branco-ou-preto-quarto-sala",
    name: "Mesa De Cabeceira com Rodinhas Safira Pequena 20x20x60cm Branco ou Preto Quarto Sala",
    price: 69.9,
    originalPrice: 99,
    image: `${CP}safira-1.webp`,
    images: [`${CP}safira-1.webp`],
    tag: "30% OFF",
    description:
      "Mesa de cabeceira Safira 20x20x60cm com rodinhas, prática de mover e perfeita para espaços pequenos no quarto ou na sala.",
    sizes: ["Branco", "Preto"],
    sizeLabel: "Cor",
  },
  {
    id: 114,
    slug: "esfregao-mop-spray-rodo-microfibra-reservatorio-380ml",
    name: "Esfregão Mop Spray Rodo Microfibra Reservatório 380ml",
    price: 64.9,
    originalPrice: 92,
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
    price: 89.9,
    originalPrice: 139,
    image: `${CP}mopinox-1.webp`,
    images: [`${CP}mopinox-1.webp`],
    tag: "35% OFF",
    description:
      "Kit esfregão mop com balde de 10,5 litros, cesto centrifugador em inox, cabo de 140cm e 2 refis de microfibra.",
  },
  {
    id: 34,
    slug: "bicicleta-bike-ergometrica-spinning-academia-fitness-profissional-120kg",
    name: "Bicicleta Bike Ergometrica Spinning Academia Fitness Profissional 120kg",
    price: 127.9,
    originalPrice: 899.9,
    hidden: true,
    image: `${BIKE}bike-250.png`,
    hoverImage: `${BIKE}bike-254.png`,
    images: [
      `${BIKE}bike-250.png`,
      `${BIKE}bike-254.png`,
      `${BIKE}bike-255.png`,
      `${BIKE}bike-249.png`,
      `${BIKE}bike-251.png`,
      `${BIKE}bike-253.png`,
      `${BIKE}bike-252.png`,
    ],
    tag: "85% OFF",
    description:
      "Bicicleta ergométrica de spinning profissional com estrutura reforçada em aço carbono e suporte para até 120 kg. Roda de inércia com transmissão por correia silenciosa, resistência ajustável por atrito e freio de emergência.",
  },
];
