import tomimiReview1 from "@/assets/products-bc/tomimi-review-1.jpg";
import tomimiReview2 from "@/assets/products-bc/tomimi-review-2.jpg";
import tomimiReview3 from "@/assets/products-bc/tomimi-review-3.jpg";
import tomimiReview4 from "@/assets/products-bc/tomimi-review-4.jpg";
import tomimiReview5 from "@/assets/products-bc/tomimi-review-5.jpg";
import tomimiReview6 from "@/assets/products-bc/tomimi-review-6.jpg";
import biancoReview1 from "@/assets/products-bc/bianco-review-1.jpg";
import biancoReview2 from "@/assets/products-bc/bianco-review-2.jpg";
import biancoReview3 from "@/assets/products-bc/bianco-review-3.jpg";
import biancoReview4 from "@/assets/products-bc/bianco-review-4.jpg";
import biancoReview5 from "@/assets/products-bc/bianco-review-5.jpg";
import biancoReview6 from "@/assets/products-bc/bianco-review-6.jpg";
import sherpaReview1 from "@/assets/products-bc/sherpa-review-1.jpg";
import sherpaReview2 from "@/assets/products-bc/sherpa-review-2.jpg";
import sherpaReview3 from "@/assets/products-bc/sherpa-review-3.jpg";
import sherpaReview4 from "@/assets/products-bc/sherpa-review-4.jpg";
import sherpaReview5 from "@/assets/products-bc/sherpa-review-5.jpg";
import sherpaReview6 from "@/assets/products-bc/sherpa-review-6.jpg";
import kit6Review1 from "@/assets/products-bc/kit6-review-1.jpg";
import kit6Review2 from "@/assets/products-bc/kit6-review-2.jpg";
import kit6Review3 from "@/assets/products-bc/kit6-review-3.jpg";
import kit6Review4 from "@/assets/products-bc/kit6-review-4.jpg";
import kit6Review5 from "@/assets/products-bc/kit6-review-5.jpg";
import kit6Review6 from "@/assets/products-bc/kit6-review-6.jpg";
import mondialL99Review1 from "@/assets/products-bc/mondial-l99-review-1.jpg";
import mondialL99Review2 from "@/assets/products-bc/mondial-l99-review-2.jpg";
import mondialL99Review3 from "@/assets/products-bc/mondial-l99-review-3.jpg";
import mondialL99Review4 from "@/assets/products-bc/mondial-l99-review-4.jpg";
import mondialL99Review5 from "@/assets/products-bc/mondial-l99-review-5.jpg";
import idaliR85 from "@/assets/products-bc/idali/review-85.png";
import idaliR86 from "@/assets/products-bc/idali/review-86.png";
import idaliR87 from "@/assets/products-bc/idali/review-87.png";
import idaliR88 from "@/assets/products-bc/idali/review-88.png";
import idaliR89 from "@/assets/products-bc/idali/review-89.png";
import idaliR90 from "@/assets/products-bc/idali/review-90.png";
import idaliR91 from "@/assets/products-bc/idali/review-91.png";
import idaliR92 from "@/assets/products-bc/idali/review-92.png";

export interface Review {
  name: string;
  date: string;
  rating: number;
  text: string;
  image?: string;
}

interface ProductReviewSet {
  reviews: Review[];
  total: number;
  avg: number;
  breakdown: { stars: number; count: number }[];
}

const makeBreakdown = (total: number): { stars: number; count: number }[] => {
  const five = Math.round(total * 0.92);
  const four = Math.round(total * 0.06);
  const three = Math.max(0, Math.round(total * 0.015));
  const two = Math.max(0, Math.round(total * 0.003));
  const one = Math.max(0, total - five - four - three - two);
  return [
    { stars: 5, count: five },
    { stars: 4, count: four },
    { stars: 3, count: three },
    { stars: 2, count: two },
    { stars: 1, count: one },
  ];
};

const reviewsByProductId: Record<number, { total: number; avg: number; reviews: Review[] }> = {
  // 1 — Cobertor Plush King
  1: {
    total: 612,
    avg: 4.9,
    reviews: [
      { name: "Mariana Castro", date: "Mar 2026", rating: 5, text: "Cobertor maravilhoso! O toque é realmente macio como nuvem, esquentou as noites frias sem pesar. Lavei na máquina e continuou impecável." },
      { name: "Patrícia Lopes", date: "Fev 2026", rating: 5, text: "Comprei o tamanho King e cobre minha cama queen com sobra. Antialérgico mesmo, meu filho não teve nenhuma reação. Recomendo demais!" },
      { name: "Roberta Almeida", date: "Fev 2026", rating: 5, text: "Veio super bem embalado, a costura é reforçada e o caimento na cama é lindo. A cor bege areia combina com toda a decoração do quarto." },
      { name: "Camila Ferreira", date: "Jan 2026", rating: 5, text: "Quentinho na medida certa para o inverno do sul. Não solta pelos e o tecido é grosso mesmo. Melhor cobertor que já comprei online." },
      { name: "Juliana Barros", date: "Jan 2026", rating: 5, text: "Chegou em 4 dias, qualidade premium. Já estou pensando em comprar outro na cor off white para alternar." },
      { name: "Fernanda Dias", date: "Dez 2025", rating: 5, text: "Vale cada centavo. O acabamento é de loja física cara. Super confortável, dorme com ele te abraçando." },
    ],
  },
  // 2 — Travesseiros
  2: {
    total: 487,
    avg: 4.9,
    reviews: [
      { name: "Aline Souza", date: "Mar 2026", rating: 5, text: "Travesseiros perfeitos para quem dorme de lado. Suporte ótimo na cervical, acordei sem dor no pescoço pela primeira vez em anos." },
      { name: "Daniela Ramos", date: "Fev 2026", rating: 5, text: "A capa de algodão é fresquinha e o enchimento não murcha. Lavei e voltou ao formato original. Comprei outro par para os hóspedes." },
      { name: "Vanessa Cardoso", date: "Fev 2026", rating: 5, text: "Antiácaro funciona mesmo, sou alérgica e não tive crise alguma. Altura média perfeita, nem alto nem baixo demais." },
      { name: "Luciana Pires", date: "Jan 2026", rating: 5, text: "Conforto de hotel cinco estrelas. O par veio bem embalado e a costura quilt é caprichada." },
      { name: "Beatriz Santos", date: "Jan 2026", rating: 5, text: "Meu marido reclamava de qualquer travesseiro, agora dorme a noite inteira. Aprovado por toda a família." },
    ],
  },
  // 3 — Toalhas
  3: {
    total: 542,
    avg: 4.9,
    reviews: [
      { name: "Renata Oliveira", date: "Mar 2026", rating: 5, text: "Toalhas felpudas, absorventes e enxugam super rápido. Parecem aquelas de spa de hotel chique. Vale muito o preço!" },
      { name: "Sandra Mendes", date: "Fev 2026", rating: 5, text: "Linhas egípcias de verdade, dá pra sentir a diferença na maciez. Já lavei várias vezes e continuam felpudas, sem soltar fiapos." },
      { name: "Cristiane Vieira", date: "Fev 2026", rating: 5, text: "Comprei o conjunto bege e marfim, a cor é exatamente como a foto. Tamanho generoso, cobre o corpo todo." },
      { name: "Adriana Lima", date: "Jan 2026", rating: 5, text: "500g/m² é coisa séria, são pesadas e gostosas. Presentei minha mãe e ela amou demais." },
      { name: "Tatiane Borges", date: "Dez 2025", rating: 5, text: "Qualidade impressionante. Não desbotaram nem com o cloro do sabão em pó. Recomendo a todos." },
    ],
  },
  // 4 — Air Fryer
  4: {
    total: 1247,
    avg: 4.9,
    reviews: [
      { name: "Gabriela Rocha", date: "Mar 2026", rating: 5, text: "Air fryer dos sonhos! Painel touch fácil de usar, batata frita fica crocante e dourada como na lanchonete. 5L cabe muita coisa." },
      { name: "Larissa Tavares", date: "Mar 2026", rating: 5, text: "Os 8 programas funcionam perfeitamente. Já fiz frango assado, bolo, pão de queijo, salmão, tudo no ponto. Mudou minha cozinha." },
      { name: "Priscila Andrade", date: "Fev 2026", rating: 5, text: "Aquece super rápido, economiza energia e o cesto antiaderente é fácil de lavar. Comprei a 220V e funciona perfeito." },
      { name: "Sabrina Costa", date: "Fev 2026", rating: 5, text: "Veio com manual em português e até receitas. O acabamento preto fosco fica lindo na bancada da cozinha." },
      { name: "Eliane Moraes", date: "Jan 2026", rating: 5, text: "Faço refeições saudáveis sem óleo, perdi peso e ainda economizo. Vale cada centavo, super profissional." },
      { name: "Vivian Carneiro", date: "Jan 2026", rating: 5, text: "Entrega rápida e produto exatamente como descrito. A potência é forte, frita rápido sem ressecar." },
    ],
  },
  // 5 — Liquidificador
  5: {
    total: 478,
    avg: 4.9,
    reviews: [
      { name: "Mônica Pereira", date: "Mar 2026", rating: 5, text: "1200W é potência de verdade! Tritura gelo, faz vitamina sem grumos, e a jarra de vidro não risca. Lindo na cozinha." },
      { name: "Karina Gomes", date: "Fev 2026", rating: 5, text: "12 velocidades fazem diferença, dá pra controlar tudo. Já bati massa de panqueca, sopa quente, frutas congeladas. Show!" },
      { name: "Bianca Martins", date: "Fev 2026", rating: 5, text: "As lâminas de inox 6 pontas são impressionantes. Tritura tudo em segundos. Fácil de desmontar e lavar." },
      { name: "Simone Araújo", date: "Jan 2026", rating: 5, text: "Veio bem embalado, sem nenhum arranhão. O design inox combinou com meus outros eletro. Aprovadíssimo." },
      { name: "Helena Castro", date: "Dez 2025", rating: 5, text: "Faz suco verde igual o de loja de produtos naturais. Vale o investimento, é super silencioso pra potência que tem." },
    ],
  },
  // 6 — Cafeteira
  6: {
    total: 386,
    avg: 4.9,
    reviews: [
      { name: "Cláudia Ribeiro", date: "Mar 2026", rating: 5, text: "Cafeteira maravilhosa! 15 xícaras dá pra família toda, o timer programado deixa o café pronto na hora que acordo. Aroma incrível." },
      { name: "Patrícia Mello", date: "Fev 2026", rating: 5, text: "Filtro permanente economiza muito. O café sai forte e quente, e a função manter aquecido funciona super bem por horas." },
      { name: "Andreia Sousa", date: "Fev 2026", rating: 5, text: "Painel digital fácil de programar. Acabamento preto fosco bonito, parece de cafeteria. Recomendo demais." },
      { name: "Rosana Vieira", date: "Jan 2026", rating: 5, text: "Comprei a 220V e veio perfeita. Marcador de nível na jarra é uma mão na roda. Super satisfeita." },
      { name: "Marcia Ferreira", date: "Dez 2025", rating: 5, text: "Faço café pra escritório e ela aguenta firme. Limpa fácil, e a jarra de vidro é resistente." },
    ],
  },
  // 7 — Organizadores
  7: {
    total: 524,
    avg: 4.9,
    reviews: [
      { name: "Letícia Cardoso", date: "Mar 2026", rating: 5, text: "Organizou minha cozinha completamente! Os potes empilháveis são lindos, o bambu dá um charme natural. Hermético de verdade." },
      { name: "Carolina Brito", date: "Fev 2026", rating: 5, text: "Plástico transparente sem cheiro, livre de BPA mesmo. As tampas vedam super bem, mantimentos duram muito mais." },
      { name: "Natália Silva", date: "Fev 2026", rating: 5, text: "Kit completo, vieram 6 peças todas perfeitas. Modular, então cabe em qualquer armário. Visual minimalista lindo." },
      { name: "Isadora Lima", date: "Jan 2026", rating: 5, text: "Lavou na máquina sem problema. O bambu não escureceu nem rachou. Vou comprar outro kit pro banheiro." },
      { name: "Talita Moraes", date: "Dez 2025", rating: 5, text: "Resolvi a bagunça da despensa. Visual de revista de decoração. Recomendo pra todo mundo!" },
    ],
  },
  // 8 — Aparelho de Jantar
  8: {
    total: 297,
    avg: 4.9,
    reviews: [
      { name: "Eduarda Pinto", date: "Mar 2026", rating: 5, text: "Aparelho de jantar lindíssimo! O fio dourado dá um ar sofisticado, a porcelana é fina mas resistente. Servi a família e todos elogiaram." },
      { name: "Verônica Araújo", date: "Fev 2026", rating: 5, text: "Veio bem embalado, com proteção em cada peça. Nenhum item quebrado. 30 peças completas, serve 6 pessoas com folga." },
      { name: "Sílvia Barreto", date: "Fev 2026", rating: 5, text: "Pode ir no microondas e na lava-louças, isso me ganhou. Bonito e prático, a melhor combinação." },
      { name: "Débora Cunha", date: "Jan 2026", rating: 5, text: "Substitui meu antigo aparelho que era opaco. Esse brilha como porcelana de luxo. Vale cada centavo." },
      { name: "Marcela Duarte", date: "Dez 2025", rating: 5, text: "Presente de casamento que acertei em cheio. A noiva amou. Acabamento de marca cara." },
    ],
  },
  // 9 — Lençol King
  9: {
    total: 689,
    avg: 4.9,
    reviews: [
      { name: "Raquel Pacheco", date: "Mar 2026", rating: 5, text: "Lençol percal 400 fios é outra vida! Fresquinho, macio e bonito. Parece de hotel cinco estrelas. Cor off white linda." },
      { name: "Tatiana Reis", date: "Fev 2026", rating: 5, text: "Algodão egípcio de verdade, dá pra sentir. O elástico abraça bem o colchão, não sai do lugar. Lavei várias vezes e continua igual." },
      { name: "Paola Cunha", date: "Fev 2026", rating: 5, text: "Caimento perfeito no king size, sobra tecido nas laterais. As fronhas são generosas. Acabamento impecável." },
      { name: "Larissa Vieira", date: "Jan 2026", rating: 5, text: "Comprei na cor cinza claro e ficou um charme no quarto. Não amassa muito, basta esticar. Recomendo!" },
      { name: "Camila Brito", date: "Jan 2026", rating: 5, text: "Melhor compra do ano. Durmo melhor desde que troquei pelo percal. Vou comprar outro jogo na cor bege." },
      { name: "Mariana Lopes", date: "Dez 2025", rating: 5, text: "Qualidade hoteleira por preço justo. Entrega super rápida, vou indicar pra todas as amigas." },
    ],
  },
  // 10 — Batedeira
  10: {
    total: 348,
    avg: 4.9,
    reviews: [
      { name: "Fernanda Camargo", date: "Mar 2026", rating: 5, text: "Batedeira planetária dos sonhos! 1000W bate massa pesada de pão sem reclamar. A tigela de inox 5L é enorme, faço bolo grande." },
      { name: "Rosa Marinho", date: "Fev 2026", rating: 5, text: "Os 3 batedores cobrem tudo: globo pra claras, gancho pra pão, pá pra massa de bolo. Comprei pra confeitaria caseira e amei." },
      { name: "Joana Salles", date: "Fev 2026", rating: 5, text: "Estável, não anda na bancada. As 10 velocidades funcionam perfeito. Visual branco pérola é maravilhoso." },
      { name: "Cibele Mota", date: "Jan 2026", rating: 5, text: "Substitui minha antiga e foi como sair da era da pedra. Bate suspiro firme em minutos. Vale o investimento." },
      { name: "Valéria Cunha", date: "Dez 2025", rating: 5, text: "Profissional de verdade. Faço bolos por encomenda e ela aguenta produção alta sem esquentar." },
    ],
  },
  // 11 — Edredom King
  11: {
    total: 412,
    avg: 4.9,
    reviews: [
      { name: "Tânia Coelho", date: "Mar 2026", rating: 5, text: "Edredom maravilhoso! Pluma de ganso de verdade, leve e quentíssimo. Nem precisa de cobertor extra no inverno." },
      { name: "Sueli Magalhães", date: "Fev 2026", rating: 5, text: "Capa de algodão acetinado é luxuosa. A costura matelassê deixa o edredom uniforme, a pluma não junta no canto." },
      { name: "Patrícia Veloso", date: "Fev 2026", rating: 5, text: "King size cobre minha cama com sobra. Off white lindo, combina com qualquer roupa de cama." },
      { name: "Gisele Brandão", date: "Jan 2026", rating: 5, text: "Térmico mesmo, e mesmo assim leve. Não sufoca como outros edredons mais pesados. Conforto premium." },
      { name: "Carla Moreira", date: "Dez 2025", rating: 5, text: "Investimento que vale muito. Dou um banho de loja no quarto sem gastar uma fortuna." },
    ],
  },
  // 12 — Chaleira Elétrica
  12: {
    total: 263,
    avg: 4.9,
    reviews: [
      { name: "Bruna Mascarenhas", date: "Mar 2026", rating: 5, text: "Chaleira excelente! Temperatura variável é tudo pra quem ama chá especial e café coado. Desliga sozinha quando atinge o ponto." },
      { name: "Andressa Goulart", date: "Fev 2026", rating: 5, text: "Inox premium, parece de loja gourmet. 1,7L cabe bastante água, esquenta em menos de 3 minutos." },
      { name: "Larissa Pádua", date: "Fev 2026", rating: 5, text: "Silenciosa, segura, e o desligamento automático dá tranquilidade. Acabamento preto fosco super sofisticado." },
      { name: "Iara Souto", date: "Jan 2026", rating: 5, text: "Comprei pra fazer café em V60 e ficou perfeito. Controlo a temperatura exata. Adorei!" },
      { name: "Renata Galvão", date: "Dez 2025", rating: 5, text: "Substitui minha chaleira de fogão e nunca mais volto. Muito mais prático e bonito." },
    ],
  },
  // 13 — Difusor
  13: {
    total: 318,
    avg: 4.9,
    reviews: [
      { name: "Helena Vasconcelos", date: "Mar 2026", rating: 5, text: "Difusor perfeito! Vaporização silenciosa, ambiente fica perfumado e a luz colorida cria um clima incrível. Adorei o acabamento de cerâmica." },
      { name: "Marina Cabral", date: "Fev 2026", rating: 5, text: "300ml dura a noite toda. As 7 cores dão um ambiente lindo no quarto. Detalhes em madeira são charmosos." },
      { name: "Stela Fonseca", date: "Fev 2026", rating: 5, text: "Funciona perfeitamente com qualquer óleo essencial. Desliga sozinho quando acaba a água, super seguro pra deixar a noite toda." },
      { name: "Carolina Penna", date: "Jan 2026", rating: 5, text: "Comprei pra meditação e melhorou meu sono. Visual delicado, fica lindo na mesa de cabeceira." },
      { name: "Yasmin Teles", date: "Dez 2025", rating: 5, text: "Chegou rapidinho, embalagem caprichada. Funciona como prometido. Recomendo demais!" },
    ],
  },
  // 14 — Edredom Sherpa Dupla Face Queen
  14: {
    total: 1583,
    avg: 4.9,
    reviews: [
      { name: "Tatiane Rodrigues", date: "Mai 2026", rating: 5, text: "Edredom maravilhoso! O lado de sherpa parece pele de carneiro mesmo, super fofinho. Quentíssimo, dormi sem precisar de manta extra. Na cor cinza ficou um luxo no quarto.", image: sherpaReview1 },
      { name: "Camila Bezerra", date: "Mai 2026", rating: 5, text: "Comprei o cinza pérola e amei! Cobre minha cama queen com sobra, é grosso e pesadinho na medida certa. A microfibra do outro lado também é macia. Vale demais o preço!", image: sherpaReview2 },
      { name: "Janaína Pires", date: "Abr 2026", rating: 5, text: "Esquenta MUITO. Moro no sul e foi a melhor compra do inverno. O sherpa branco continua impecável depois da primeira lavada, não soltou pelo.", image: sherpaReview3 },
      { name: "Lúcia Fernandes", date: "Abr 2026", rating: 5, text: "Chegou em 5 dias, embalagem caprichada. O bege é exatamente como na foto, super delicado. Costura matelassê reforçada, parece de loja cara.", image: sherpaReview4 },
      { name: "Renata Souto", date: "Abr 2026", rating: 5, text: "Por R$69,90 é o melhor custo-benefício do mercado! Outras lojas vendem por mais de R$200. A qualidade é a mesma, recomendo de olhos fechados.", image: sherpaReview5 },
      { name: "Patrícia Alencar", date: "Mar 2026", rating: 5, text: "Comprei o cinza pra usar no fim de semana de campo e foi perfeito. Aquece muito mesmo, dobra fácil pra levar. Lindíssimo!", image: sherpaReview6 },
      { name: "Solange Vieira", date: "Mar 2026", rating: 5, text: "Antialérgico de verdade, sou rinítica e não tive nenhuma reação. O sherpa não solta fiapos no nariz como outros que já comprei." },
      { name: "Aline Cardoso", date: "Mar 2026", rating: 5, text: "Lavei na máquina em ciclo delicado e voltou perfeito, sem perder a maciez. O lado preto continua escuro, não desbotou. Excelente produto." },
      { name: "Marcia Tavares", date: "Fev 2026", rating: 5, text: "Comprei dois, um marrom e um azul marinho, pra trocar conforme a estação. Os dois são lindos e quentíssimos. Atendimento da BelaCasa nota 10." },
      { name: "Vanessa Lopes", date: "Fev 2026", rating: 5, text: "Caimento perfeito na cama queen, as bordas chegam quase no chão. O peso é gostoso, dá aquela sensação de abraço. Dormi como um bebê." },
    ],
  },
  // 15 — Travesseiro Cervical Tomimi
  15: {
    total: 2147,
    avg: 4.9,
    reviews: [
      { name: "Patrícia Marques", date: "Mai 2026", rating: 5, text: "Travesseiro milagroso! Sofria com dor cervical há anos e em uma semana já senti diferença. O design em borboleta encaixa perfeito no pescoço, durmo a noite toda sem acordar.", image: tomimiReview1 },
      { name: "Ricardo Almeida", date: "Mai 2026", rating: 5, text: "Espuma de memória de verdade, abraça a cabeça e volta ao formato. Não tem cheiro nenhum, livre de formaldeído como prometido. Acordei sem dor pela primeira vez em meses.", image: tomimiReview2 },
      { name: "Joana Beltrão", date: "Abr 2026", rating: 5, text: "Comprei por indicação da minha fisioterapeuta. Em 15 dias minha postura melhorou muito. Durmo de lado e o suporte do ombro é incrível, não 'enforca' o braço.", image: tomimiReview3 },
      { name: "Eduardo Santos", date: "Abr 2026", rating: 5, text: "Vale cada centavo. Já gastei muito em travesseiros caros e nenhum se compara. A espuma é firme mas confortável, não afunda demais. Recomendo demais!" },
      { name: "Cristiane Lopes", date: "Abr 2026", rating: 5, text: "Ergonômico de verdade. Tenho hérnia cervical e foi o único que aliviou a dor sem precisar de remédio. A capa é macia e respirável, não esquenta a cabeça.", image: tomimiReview4 },
      { name: "Bruno Fernandes", date: "Mar 2026", rating: 5, text: "Design biônico funciona! As 'asas' levantadas dos lados sustentam o pescoço quando viro durante o sono. Acordei descansado, sem aquela sensação de torcicolo." },
      { name: "Marina Castro", date: "Mar 2026", rating: 5, text: "Sem odor mesmo, abri e usei na hora. Outras espumas vinham com aquele cheiro químico forte. Esse não, super higiênico. Aprovadíssimo!", image: tomimiReview5 },
      { name: "Felipe Cardoso", date: "Mar 2026", rating: 5, text: "Comprei pra minha mãe que tem 70 anos e dor crônica no pescoço. Ela me ligou chorando de alegria depois de 1 semana. Voltou a dormir bem. Obrigado BelaCasa!" },
      { name: "Tatiane Oliveira", date: "Fev 2026", rating: 5, text: "Altura perfeita pra quem dorme de lado. A micro depressão central segura a cabeça no lugar. Capa removível pra lavar é uma mão na roda.", image: tomimiReview6 },
      { name: "Anderson Pires", date: "Fev 2026", rating: 5, text: "Trabalho no computador 10h por dia e tinha dor cervical constante. Em 20 dias usando o Tomimi, dor sumiu. Investimento que vale ouro pra saúde." },
      { name: "Camila Ribeiro", date: "Fev 2026", rating: 5, text: "Por R$69,90 é um roubo, vi o mesmo em outras lojas por mais de R$300. Chegou rápido, bem embalado e funciona como prometido. Já comprei outro pro meu marido." },
      { name: "Roberto Mendes", date: "Jan 2026", rating: 5, text: "Núcleo médico do sono, como dizem mesmo. Acordo com energia, sem aquela moleza. Postura melhorou e dor de cabeça matinal acabou. Recomendo a todos." },
    ],
  },
  // 16 — Kit 10 Potes de Vidro Oliver Home
  16: {
    total: 1876,
    avg: 4.9,
    reviews: [
      { name: "Renata Caldas", date: "Mai 2026", rating: 5, text: "Kit espetacular! Os 10 potes vieram perfeitos, sem nenhum arranhão. As 4 travas vedam super bem, levo sopa na bolsa sem medo de vazar. Vidro grosso e resistente." },
      { name: "Marcelo Tavares", date: "Mai 2026", rating: 5, text: "Comprei pra fazer meal prep da semana e mudou minha rotina. 640ml é a medida exata pra uma refeição fit. Vai do freezer pro microondas sem rachar." },
      { name: "Juliana Peixoto", date: "Abr 2026", rating: 5, text: "Por R$89,90 são 10 potes de altíssima qualidade. Em outras lojas vi por mais de R$200. Empilháveis, organizou minha geladeira e despensa completamente." },
      { name: "Fernanda Ribeiro", date: "Abr 2026", rating: 5, text: "Tampa com 4 travas e silicone faz toda a diferença, nada vaza. Levo salada com molho separado e chega no trabalho intacta. Recomendo demais!" },
      { name: "Luís Henrique", date: "Abr 2026", rating: 5, text: "Vidro borossilicato de verdade, aguenta variação de temperatura sem trincar. Tirei do freezer direto pro microondas e funcionou perfeito. Aprovadíssimo." },
      { name: "Camila Pacheco", date: "Mar 2026", rating: 5, text: "Visual lindo na geladeira, transparentes dá pra ver tudo. Não pegam cheiro nem mancham, mesmo guardando molho de tomate. Lavou na máquina sem problema." },
      { name: "Patrícia Nogueira", date: "Mar 2026", rating: 5, text: "Comprei 2 kits, um pra mim e um pra minha mãe. Os dois chegaram bem embalados, sem nenhum quebrado. Atendimento da BelaCasa nota 10." },
      { name: "Bruno Albuquerque", date: "Mar 2026", rating: 5, text: "Marmiteiro de carteirinha aqui. Já testei várias marcas e esses Oliver Home são os melhores. Vedação perfeita, vidro espesso e tampa não estraga com o tempo." },
      { name: "Sandra Vidal", date: "Fev 2026", rating: 5, text: "Substitui todos os meus potes plásticos por esses. Mais saudável, sem BPA, e os alimentos duram muito mais. Investimento que vale cada centavo." },
      { name: "Alessandra Maia", date: "Fev 2026", rating: 5, text: "Levo sopa quente, congelo carne moída, guardo grãos, faço de tudo. Tamanho 640ml é versátil. Já indiquei pra todas as amigas do grupo de fitness." },
    ],
  },
  // 18 — Air Fryer Gaabor Duo (definida abaixo)
  17: {
    total: 847,
    avg: 4.9,
    reviews: [
      { name: "Cristina Bevilacqua", date: "Mai 2026", rating: 5, text: "Jogo de panelas perfeito! As 10 peças vieram completíssimas, embalagem impecável. O antiaderente é de verdade, faço ovo sem óleo nenhum e sai inteiro. Cor vanilla linda demais na cozinha.", image: biancoReview1 },
      { name: "Rogério Mendonça", date: "Mai 2026", rating: 5, text: "Comprei pra minha esposa de aniversário e ela amou. Distribui o calor por igual, cozinha mais rápido e economiza gás. Os cabos não esquentam mesmo com a chama alta. Vale muito o preço.", image: biancoReview2 },
      { name: "Tatiana Brandão", date: "Abr 2026", rating: 5, text: "Por R$97,90 não achei jogo melhor em lugar nenhum. As tampas de vidro temperado são grossas, dá pra ver o cozimento sem abrir. Lavou na máquina sem perder o antiaderente.", image: biancoReview3 },
      { name: "Eduardo Sampaio", date: "Abr 2026", rating: 5, text: "Substituí todas as panelas velhas de casa por esse jogo. Qualidade absurda pelo valor, parece dessas marcas caras de loja física. Antiaderente funciona de verdade até pra panqueca.", image: biancoReview4 },
      { name: "Larissa Fontoura", date: "Abr 2026", rating: 5, text: "Estou apaixonada! O acabamento texturizado efeito pedra é maravilhoso, deixa a cozinha com cara nova. Frigideira grande tem tamanho ótimo pra refeição da família toda.", image: biancoReview5 },
      { name: "Marcio Aragão", date: "Mar 2026", rating: 5, text: "Veio tudo bem embalado, cada peça em plástico bolha individual. Uso há 2 meses todos os dias e continua como nova. As 3 utensílios em nylon são bônus excelente.", image: biancoReview6 },
      { name: "Vanessa Cordeiro", date: "Mar 2026", rating: 5, text: "Cabos ergonômicos confortáveis na mão e não soltam mesmo após muitas lavagens. Faço arroz, feijão, carne, tudo nelas. A leiteira é perfeita pro café da manhã." },
      { name: "Gustavo Penha", date: "Mar 2026", rating: 5, text: "Comprei pro meu apartamento novo e equipou a cozinha inteira de uma vez. Sem PFOA, antiaderente seguro, esquenta rápido e uniforme. Atendimento BelaCasa nota 10." },
      { name: "Helena Machado", date: "Fev 2026", rating: 5, text: "Tampa de vidro com respiro ajuda muito a não derramar. Caçarola grande cabe macarrão pra 8 pessoas sem problema. Estou recomendando pra todas as amigas." },
      { name: "Paulo Vasconcellos", date: "Fev 2026", rating: 5, text: "Excelente custo benefício. Jogo completo, bonito, funcional e durável. Chegou em 5 dias úteis. Já é minha terceira compra na BelaCasa, sempre acerto." },
    ],
  },
  // 18 — Fritadeira Air Fryer Gaabor Duo
  18: {
    total: 2341,
    avg: 4.9,
    reviews: [
      { name: "Carolina Nunes", date: "Mai 2026", rating: 5, text: "Air fryer maravilhosa! Faço batata frita sequinha sem uma gota de óleo, fica igualzinha à de lanchonete. O painel touch é super intuitivo e os 8 programas facilitam demais o dia a dia." },
      { name: "Ricardo Almendra", date: "Mai 2026", rating: 5, text: "Comprei meio desconfiado pelo preço, mas a Gaabor surpreendeu. Esquenta rápido, cozinha por igual e o visor de vidro ajuda muito a acompanhar sem abrir. Vale cada centavo." },
      { name: "Mariana Tavares", date: "Mai 2026", rating: 5, text: "4,2 litros é o tamanho perfeito pra família de 4. Faço frango inteiro, peixe, legumes assados, até bolo. Minha geladeira de gordura zerou, comida muito mais saudável." },
      { name: "Felipe Brandão", date: "Abr 2026", rating: 5, text: "Por R$97,90 você não acha em lugar nenhum. Vi a mesma na loja física por R$399. Bivolt automático foi um diferencial enorme, mudei de casa e levei sem problema." },
      { name: "Patrícia Galvão", date: "Abr 2026", rating: 5, text: "Faço pastel, coxinha congelada, nuggets, batata, tudo fica crocante por fora e macio por dentro. O cesto antiaderente lava super fácil, nada gruda. Recomendadíssima!" },
      { name: "Anderson Coutinho", date: "Abr 2026", rating: 5, text: "Painel digital touch funciona perfeito, sensível ao toque mas sem disparar sozinho. Os programas pré-definidos acertam o tempo e temperatura. Praticamente impossível errar." },
      { name: "Larissa Pimentel", date: "Abr 2026", rating: 5, text: "Design lindo, preto fosco premium combina com qualquer cozinha. Compacta, não ocupa muito espaço na bancada. Mais silenciosa do que eu esperava, mal escuto funcionando." },
      { name: "Bruno Vasconcellos", date: "Mar 2026", rating: 5, text: "Substituiu minha fritadeira convencional, meu forno elétrico e meu microondas pra muita coisa. Economia de gás e energia gigante. Em 2 meses já se pagou." },
      { name: "Vanessa Ribeiro", date: "Mar 2026", rating: 5, text: "Visor de vidro é genial, dá pra ver a comida dourando sem abrir. O desligamento automático ao remover o cesto traz muita segurança, principalmente com criança em casa." },
      { name: "Gustavo Henrique", date: "Mar 2026", rating: 5, text: "Chegou em 4 dias, super bem embalada, sem nenhum amassado. Acompanhou manual em português e algumas receitas. A Gaabor entregou um produto premium por preço justo." },
    ],
  },

  // 19 — Coberdrom Casal Queen Dupla Face Sherpa
  19: {
    total: 1873,
    avg: 4.9,
    reviews: [
      { name: "Sandra Macedo", date: "Mai 2026", rating: 5, text: "Coberdrom maravilhoso! Comprei na cor cinza e é lindo demais. Cobre toda a cama queen com sobra, o sherpa é super macio e quentinho. Qualidade impressionante pelo preço, parece de loja física cara.", image: kit6Review1 },
      { name: "Roberto Linhares", date: "Mai 2026", rating: 5, text: "O sherpa é fofinho de verdade, igual na foto! O outro lado aveludado é gostoso e quente. Tamanho Casal/Queen cobre a cama com folga, é bem generoso. Entrega rápida e embalagem caprichada.", image: kit6Review2 },
      { name: "Fernanda Quintela", date: "Mai 2026", rating: 5, text: "Comprei o bege para o quarto do casal e fiquei encantada. O tecido é grosso, bem acolchoado e o acabamento é impecável. Pelo preço, é o melhor custo-benefício que já encontrei. Já quero outro na cor azul!", image: kit6Review3 },
      { name: "Luciana Peixoto", date: "Mai 2026", rating: 5, text: "Estava precisando trocar o edredom antigo e esse superou todas as expectativas. A cor vermelha é exatamente como na foto, o tecido é grosso e quentinho. Perfeito para o inverno.", image: kit6Review4 },
      { name: "Marcelo Bastos", date: "Abr 2026", rating: 5, text: "Por menos de R$ 90 é coisa de outro mundo. Qualidade premium, chegou tudo certinho em 5 dias. Antialérgico mesmo, minha esposa tem rinite e não teve nenhum problema. Recomendo demais!", image: kit6Review5 },
      { name: "Tatiane Cordeiro", date: "Abr 2026", rating: 5, text: "Comprei o marrom chocolate e é simplesmente lindo! O tom é elegante e combina com qualquer decoração. O sherpa não solta pelo e a costura matelassê é muito bem feita. Excelente compra.", image: kit6Review6 },
      { name: "Eduardo Vilaça", date: "Abr 2026", rating: 5, text: "Coberdrom Casal/Queen com sherpa de pele de carneiro por esse preço é incrível. Lavei na máquina e ficou perfeito, não desfiou nem perdeu o caimento. Recomendo de olhos fechados." },
      { name: "Renata Salles", date: "Abr 2026", rating: 5, text: "O sherpa é fofinho como na foto, lado aveludado quentíssimo. Tamanho Casal/Queen é generoso, cobre minha cama de casal com sobra dos dois lados. Pelo preço, é simplesmente imperdível." },
      { name: "André Quesada", date: "Mar 2026", rating: 5, text: "Pensei que fosse mais fino pelo preço, mas é bem grosso e quentinho. Embalagem caprichada, cor viva, costura reforçada. A BelaCasa surpreendeu mais uma vez, virou minha loja preferida." },
      { name: "Beatriz Monteiro", date: "Mar 2026", rating: 5, text: "Usei no sofá da sala durante o frio e foi perfeito, agora voltei pro quarto. Um luxo por menos de R$ 90 reais. Aquece muito, ideal pro frio do sul. Vou comprar outro na cor preta." },
    ],
  },

  // 20 — Liquidificador Mondial L-99 Turbo
  20: {
    total: 3127,
    avg: 4.9,
    reviews: [
      { name: "Adriana Marques", date: "Mai 2026", rating: 5, text: "Liquidificador maravilhoso! Por R$ 69,90 você não encontra em lugar nenhum, na loja física estava R$ 249. Potência de 550W é ótima, tritura gelo, faz vitamina sem grumos e suco bem lisinho. A jarra de San Cristal é linda e parece bem resistente.", image: mondialL99Review1 },
      { name: "Carlos Henrique", date: "Mai 2026", rating: 5, text: "Comprei o vermelho e ficou um charme na minha cozinha. As 3 velocidades + pulsar dão controle total, e a função autolimpeza é simplesmente genial — coloco água com detergente, aciono e fica novinho em segundos." },
      { name: "Patrícia Andrade", date: "Mai 2026", rating: 5, text: "Mondial nunca decepciona! Já é meu terceiro liquidificador da marca e esse L-99 superou os anteriores. As lâminas de inox 4 pontas trituram tudo, até cenoura crua pra suco detox. Vale demais o preço.", image: mondialL99Review2 },
      { name: "Fernando Lima", date: "Mai 2026", rating: 5, text: "Chegou em 3 dias, super bem embalado. Veio o aparelho na cor preta + o filtro pra suco. O filtro é ótimo, separa toda a polpa e o suco fica igual o de loja. Recomendo demais!", image: mondialL99Review4 },
      { name: "Juliana Pacheco", date: "Abr 2026", rating: 5, text: "2,2 litros é muita coisa! Faço vitamina pra família toda de uma vez só. A tampa com vaso medidor ajuda muito a colocar ingredientes sem desligar. Mudou minha rotina da manhã." },
      { name: "Roberto Silva", date: "Abr 2026", rating: 5, text: "Comprei o preto pra minha mãe e ela amou. Os pés antiderrapantes seguram firme na bancada, não anda nem na velocidade máxima. O compartimento pro fio na base é ótimo pra organizar.", image: mondialL99Review3 },
      { name: "Camila Vasconcellos", date: "Abr 2026", rating: 5, text: "Função Turbo é potente de verdade! Quebra gelo em segundos sem travar. A jarra de San Cristal é grossa, resistente, dá uma sensação de produto premium. Livre de BPA me deixou tranquila.", image: mondialL99Review5 },
      { name: "Marcelo Tavares", date: "Abr 2026", rating: 5, text: "Custo benefício imbatível. Comparei com outros liquidificadores de 800W e esse aqui de 550W bate tão bem quanto. Mondial é tradição, sabe fazer eletrodoméstico que dura." },
      { name: "Beatriz Cordeiro", date: "Mar 2026", rating: 5, text: "Compacto, leve (1,3kg), encaixa em qualquer canto da bancada. Comprei o vermelho e ele virou objeto de decoração de tão bonito. Faço sopa quente, vitamina, suco, papinha do bebê. Versátil!" },
      { name: "Rafael Quintela", date: "Mar 2026", rating: 5, text: "Entrega rápida da BelaCasa, embalagem caprichada, produto original Mondial com nota fiscal. Funcionando perfeitamente há 2 meses, sem reclamação. Já indiquei pra família toda." },
    ],
  },
  // 21 — Aspirador IDALI LIFE
  21: {
    total: 1247,
    avg: 4.9,
    reviews: [
      { name: "Carolina Mendes", date: "Mai 2026", rating: 5, text: "Esse robô mudou minha vida! Programo ele de manhã antes de sair pro trabalho e quando chego em casa o chão tá impecável. Os sensores anti-queda funcionam perfeitamente, tenho escada e ele nunca caiu. Vale cada centavo!", image: idaliR85 },
      { name: "Eduardo Tavares", date: "Mai 2026", rating: 5, text: "Chegou rapidinho e bem embalado. Caixa lacrada original IDALI LIFE V3S Pro com WiFi e sucção potente de 2000Pa. Já tirei da caixa e instalei o app Smart Life, funcionou de primeira. Recomendo demais!", image: idaliR86 },
      { name: "Patrícia Rocha", date: "Abr 2026", rating: 5, text: "Tenho 2 gatos e um cachorro, vivia com pelo por toda a casa. Comprei o IDALI LIFE e agora passo ele 2x ao dia pelo app. Sucção forte mesmo, recolhe tudo. A função MOP é incrível, deixa o piso brilhando.", image: idaliR87 },
      { name: "Juliana Almeida", date: "Abr 2026", rating: 5, text: "Veio tudo certinho na caixa: robô, base, controle, fonte, escovas extras, filtro HEPA, pano MOP e os manuais em português. Conectei na Alexa em 5 minutos seguindo o manual de app. Tecnologia que realmente funciona!", image: idaliR88 },
      { name: "Roberto Cardoso", date: "Abr 2026", rating: 5, text: "Manual do usuário em português super claro e a instrução do app é bem explicadinha. Em 10 minutos tava tudo pareado no Smart Life e funcionando junto com a Google Home. Excelente custo-benefício.", image: idaliR89 },
      { name: "Fernanda Lima", date: "Mar 2026", rating: 5, text: "Por R$119 não tem como reclamar. Passa embaixo do sofá e da cama onde a vassoura não alcançava. Design super fino, cabe em qualquer canto.", image: idaliR90 },
      { name: "Mariana Costa", date: "Mar 2026", rating: 5, text: "Cuido da minha mãe idosa e esse robô virou meu braço direito. Enquanto fico com ela, o IDALI faz a faxina sozinho. Silencioso, ela nem reclama do barulho. Recomendadíssimo.", image: idaliR91 },
      { name: "Beatriz Andrade", date: "Fev 2026", rating: 5, text: "A função 3 em 1 é o diferencial. Ele varre, aspira e passa pano de uma vez só. Acoplei o reservatório de água com o pano de microfibra e ficou perfeito no porcelanato. Volta sozinho pra base de recarga!", image: idaliR92 },
    ],
  },
  // 22 — Aquecedor Ventisol A1 3 em 1
  22: {
    total: 2184,
    avg: 4.9,
    reviews: [
      { name: "Letícia Bernardes", date: "Mai 2026", rating: 5, text: "Aquecedor maravilhoso! Comprei pro quarto e em 5 minutos o ambiente já tava quentinho. Adorei ter as 3 funções, no verão uso só a ventilação. Ventisol é marca de confiança, e por R$ 79,90 é um achado." },
      { name: "Rodrigo Salgado", date: "Mai 2026", rating: 5, text: "Comprei dois, um pra cada quarto. Esquenta muito rápido na potência máxima de 2000W e o termostato funciona certinho — liga e desliga sozinho mantendo a temperatura. Conta de luz não disparou como eu temia." },
      { name: "Camila Ferraz", date: "Mai 2026", rating: 5, text: "Aqui no Sul o frio é forte e esse aquecedor salvou meu inverno. Coloco na função suave 1000W durante a noite e o quarto fica perfeito. Silencioso, dá pra dormir tranquilo. Recomendadíssimo!" },
      { name: "Anderson Vilaça", date: "Abr 2026", rating: 5, text: "Chegou em 4 dias, super bem embalado, original Ventisol com nota fiscal. A alça em cima é ótima pra levar de um cômodo pro outro. Já uso no banheiro de manhã (longe da água) e no quarto à noite." },
      { name: "Patrícia Monteiro", date: "Abr 2026", rating: 5, text: "Tenho uma bebê de 8 meses e fiquei tranquila com a grade frontal reforçada e o desligamento automático se tombar. O ar não fica seco como em outros aquecedores. Vale cada centavo!" },
      { name: "Fernando Quintela", date: "Abr 2026", rating: 5, text: "Compacto, leve e potente. Coube perfeito na escrivaninha do meu escritório. Em poucos minutos a sala fica quentinha, não precisa ficar ligado o tempo todo. Excelente custo-benefício." },
      { name: "Juliana Cordeiro", date: "Abr 2026", rating: 5, text: "Por menos de R$ 80 é coisa de outro mundo. Em loja física mais barata vi por R$ 199. As 3 funções (vento, calor leve e calor forte) são bem práticas, dá pra usar o ano todo." },
      { name: "Marcos Andrade", date: "Mar 2026", rating: 5, text: "Resistência cerâmica esquenta de verdade, em 2 minutos já sente o ar quente. Botão giratório bem firme e o termostato é preciso. Ventisol nunca decepciona, terceiro produto da marca aqui em casa." },
      { name: "Bianca Pacheco", date: "Mar 2026", rating: 5, text: "Comprei pra minha mãe idosa que sente muito frio. Ela amou, disse que esquenta o quarto inteiro em poucos minutos. Atendimento da BelaCasa foi excelente, entrega antes do prazo." },
      { name: "Thiago Linhares", date: "Fev 2026", rating: 5, text: "Aparelho top, design bonito e bem acabado. Faz pouquíssimo barulho mesmo na potência máxima. Já comprei outro pra dar de presente pra minha sogra, super recomendo!" },
    ],
  },
};

const defaultReviews: Review[] = [
  { name: "Cliente BelaCasa", date: "Mar 2026", rating: 5, text: "Produto de excelente qualidade, exatamente como descrito no site. Acabamento premium e entrega rápida. Recomendo!" },
  { name: "Cliente BelaCasa", date: "Fev 2026", rating: 5, text: "Comprei e amei. Veio bem embalado, sem nenhum defeito. Atendimento da loja foi atencioso, super recomendo." },
  { name: "Cliente BelaCasa", date: "Fev 2026", rating: 5, text: "Qualidade muito acima do que esperava pelo preço. Já é a segunda compra na BelaCasa e continuo satisfeito." },
  { name: "Cliente BelaCasa", date: "Jan 2026", rating: 5, text: "Produto lindo, deixou minha casa com cara de revista de decoração. Vale cada centavo." },
  { name: "Cliente BelaCasa", date: "Jan 2026", rating: 5, text: "Entrega super rápida e produto impecável. Já indiquei a loja para várias amigas." },
];

export const getReviewsForProduct = (productId: number): ProductReviewSet => {
  const data = reviewsByProductId[productId];
  if (data) {
    return {
      reviews: data.reviews,
      total: data.total,
      avg: data.avg,
      breakdown: makeBreakdown(data.total),
    };
  }
  // Fallback: deterministic total based on id so different products show different counts
  const total = 120 + ((productId * 37) % 380);
  return {
    reviews: defaultReviews,
    total,
    avg: 4.9,
    breakdown: makeBreakdown(total),
  };
};
