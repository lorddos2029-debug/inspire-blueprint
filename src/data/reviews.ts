const tomimiReview1 = "/assets/products-bc/tomimi-review-1.jpg";
const tomimiReview2 = "/assets/products-bc/tomimi-review-2.jpg";
const tomimiReview3 = "/assets/products-bc/tomimi-review-3.jpg";
const tomimiReview4 = "/assets/products-bc/tomimi-review-4.jpg";
const tomimiReview5 = "/assets/products-bc/tomimi-review-5.jpg";
const tomimiReview6 = "/assets/products-bc/tomimi-review-6.jpg";
const biancoReview1 = "/assets/products-bc/bianco-review-1.jpg";
const biancoReview2 = "/assets/products-bc/bianco-review-2.jpg";
const biancoReview3 = "/assets/products-bc/bianco-review-3.jpg";
const biancoReview4 = "/assets/products-bc/bianco-review-4.jpg";
const biancoReview5 = "/assets/products-bc/bianco-review-5.jpg";
const biancoReview6 = "/assets/products-bc/bianco-review-6.jpg";
const sherpaReview1 = "/assets/products-bc/sherpa-review-1.jpg";
const sherpaReview2 = "/assets/products-bc/sherpa-review-2.jpg";
const sherpaReview3 = "/assets/products-bc/sherpa-review-3.jpg";
const sherpaReview4 = "/assets/products-bc/sherpa-review-4.jpg";
const sherpaReview5 = "/assets/products-bc/sherpa-review-5.jpg";
const sherpaReview6 = "/assets/products-bc/sherpa-review-6.jpg";
const kit6Review1 = "/assets/products-bc/kit6-review-1.jpg";
const kit6Review2 = "/assets/products-bc/kit6-review-2.jpg";
const kit6Review3 = "/assets/products-bc/kit6-review-3.jpg";
const kit6Review4 = "/assets/products-bc/kit6-review-4.jpg";
const kit6Review5 = "/assets/products-bc/kit6-review-5.jpg";
const kit6Review6 = "/assets/products-bc/kit6-review-6.jpg";
const mondialL99Review1 = "/assets/products-bc/mondial-l99-review-1.jpg";
const mondialL99Review2 = "/assets/products-bc/mondial-l99-review-2.jpg";
const mondialL99Review3 = "/assets/products-bc/mondial-l99-review-3.jpg";
const mondialL99Review4 = "/assets/products-bc/mondial-l99-review-4.jpg";
const mondialL99Review5 = "/assets/products-bc/mondial-l99-review-5.jpg";
const idaliR85 = "/assets/products-bc/idali/review-85.png";
const idaliR86 = "/assets/products-bc/idali/review-86.png";
const idaliR87 = "/assets/products-bc/idali/review-87.png";
const idaliR88 = "/assets/products-bc/idali/review-88.png";
const idaliR89 = "/assets/products-bc/idali/review-89.png";
const idaliR90 = "/assets/products-bc/idali/review-90.png";
const idaliR91 = "/assets/products-bc/idali/review-91.png";
const idaliR92 = "/assets/products-bc/idali/review-92.png";
const ventisolReview1 = "/assets/products-bc/ventisol-review-1.png";
const ventisolReview2 = "/assets/products-bc/ventisol-review-2.png";
const ventisolReview3 = "/assets/products-bc/ventisol-review-3.png";
const ventisolReview4 = "/assets/products-bc/ventisol-review-4.png";
const ventisolReview5 = "/assets/products-bc/ventisol-review-5.png";
const ventisolReview6 = "/assets/products-bc/ventisol-review-6.png";
const escovaReview1 = "/assets/products-bc/escova/review-1.png";
const escovaReview2 = "/assets/products-bc/escova/review-2.png";
const escovaReview3 = "/assets/products-bc/escova/review-3.png";
const escovaReview4 = "/assets/products-bc/escova/review-4.png";
const escovaReview5 = "/assets/products-bc/escova/review-5.png";
const escovaReview6 = "/assets/products-bc/escova/review-6.png";
const escovaIonsReview1 = "/assets/products-bc/escova-ions/review-1.png";
const escovaIonsReview2 = "/assets/products-bc/escova-ions/review-2.png";
const escovaIonsReview3 = "/assets/products-bc/escova-ions/review-3.png";
const escovaIonsReview4 = "/assets/products-bc/escova-ions/review-4.png";
const escovaIonsReview5 = "/assets/products-bc/escova-ions/review-5.png";

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

const COBF = "/assets/products-bc/cobertor-flannel/";

const YPEF = "/assets/products-bc/ype/";

const CLF = "/assets/products-bc/cobre-leito/";

const TRVF = "/assets/products-bc/travesseiro/";

const reviewsByProductId: Record<number, { total: number; avg: number; reviews: Review[] }> = {
  // 31 — Panela de Pressão MTA 4,5 Litros
  31: {
    total: 824,
    avg: 4.9,
    reviews: [
      { name: "Sílvia Bernardes", date: "Jul 2026", rating: 5, text: "O visor de vidro é revolucionário! Consigo ver o feijão cozinhando sem ter que ficar tirando a pressão pra conferir se secou a água. A cor grafite é lindíssima e o antiaderente é excelente.", image: "/__l5e/assets-v1/68a9da9c-46b7-47eb-b441-379519a7f5c2/panela-pressao-graphite.png" },
      { name: "Mariana Costa", date: "Jul 2026", rating: 5, text: "Comprei a cor rosé e é a coisa mais linda da minha cozinha. O visor de vidro é bem resistente, lavei várias vezes e continua transparente. Muito segura com o fechamento externo.", image: "/__l5e/assets-v1/ad13c91f-52cb-4fa7-970e-b3976127fbfc/panela-pressao-rose.png" },
      { name: "Antônio Carlos", date: "Jul 2026", rating: 5, text: "Essa panela facilitou muito o dia a dia. O acabamento é premium, os cabos não esquentam e a pressão pega muito rápido. O visor ajuda a não deixar queimar a comida.", image: "/__l5e/assets-v1/252e47ce-46c8-45ea-b506-495f16447e96/panela-pressao-cream.png" },
      { name: "Patrícia Lima", date: "Jun 2026", rating: 5, text: "Estava com medo do vidro quebrar, mas é super grosso e resistente. Já fiz carne de panela e sopa, tudo muito rápido. Melhor investimento que fiz para a cozinha este ano.", image: "/__l5e/assets-v1/34fc0755-8746-4ef3-9d2a-951735162849/panela-pressao-colors.png" },
      { name: "Fernanda Souza", date: "Jun 2026", rating: 5, text: "O fechamento externo é muito mais prático e higiênico. A panela é robusta e o antiaderente é de ótima qualidade, não gruda nada no fundo." },
      { name: "Ricardo Oliveira", date: "Jun 2026", rating: 5, text: "A entrega foi super rápida. A panela vem bem embalada e com manual explicando tudo sobre o visor. Funciona perfeitamente no meu fogão a gás." },
      { name: "Carla Meirelles", date: "Mai 2026", rating: 5, text: "O visor de vidro temperado é a melhor invenção. Dá uma segurança enorme poder ver o que está acontecendo lá dentro. Comprei o kit completo de panelas e essa foi o destaque." },
      { name: "Roberto Santos", date: "Mai 2026", rating: 4, text: "Excelente panela, segura e muito bonita. Só achei um pouco pesada, mas é sinal de que o material é de qualidade e durável." },
      { name: "Beatriz Nogueira", date: "Mai 2026", rating: 5, text: "Cozinha muito mais rápido que a minha panela antiga. O visor não embaça a ponto de não ver a comida, dá pra acompanhar bem o nível da água." },
      { name: "Luciana Alves", date: "Abr 2026", rating: 5, text: "Acabamento nota 10. A cor creme é muito elegante. Recomendo pra quem quer uma panela de pressão moderna e segura." },
    ],
  },

  // 30 — Travesseiro Ortopédico Borboleta Cervical
  30: {
    total: 942,
    avg: 4.9,
    reviews: [
      { name: "Fernanda Coutinho", date: "Jul 2026", rating: 5, text: "Eu acordava todo dia com dor na base do pescoço e dor de cabeça. Na terceira noite com esse travesseiro a dor sumiu. O encaixe do pescoço é perfeito, sustenta mesmo.", image: `${TRVF}review-184.png` },
      { name: "Marcos Vinícius", date: "Jul 2026", rating: 5, text: "Durmo de lado e as 'asas' do travesseiro acomodam o ombro sem ficar aquela pressão. Parei de acordar com o braço dormente.", image: `${TRVF}review-185.png` },
      { name: "Regina Albuquerque", date: "Jul 2026", rating: 5, text: "Tenho hérnia de disco cervical e meu fisioterapeuta recomendou um travesseiro assim. A espuma volta devagar e não afunda igual travesseiro comum.", image: `${TRVF}review-186.png` },
      { name: "Tatiane Moura", date: "Jun 2026", rating: 5, text: "O furinho no meio faz diferença de verdade, a nuca não fica esmagada. Acordo sem aquela sensação de peso na cabeça.", image: `${TRVF}review-187.png` },
      { name: "Cláudia Bernardes", date: "Jun 2026", rating: 5, text: "A capa sai com zíper e lavei na máquina, voltou como nova. O tecido matelassê é fresquinho, não esquenta a cabeça na madrugada." },

      { name: "Rodrigo Sanches", date: "Jun 2026", rating: 5, text: "Trabalho o dia inteiro no computador e vivia com torcicolo. Com um mês de uso a rigidez da manhã praticamente acabou." },
      { name: "Simone Vasques", date: "Mai 2026", rating: 4, text: "Excelente suporte, só leva uns 3 ou 4 dias pra acostumar porque é bem mais firme que o travesseiro comum. Depois disso você não troca mais." },
      { name: "Eduardo Prates", date: "Mai 2026", rating: 5, text: "Minha esposa reclamava do meu ronco e diminuiu bastante, acho que por causa do alinhamento do pescoço. Valeu cada centavo." },
      { name: "Larissa Fontes", date: "Mai 2026", rating: 5, text: "Um lado é mais alto e o outro mais baixo, então dá pra virar conforme a posição que você dorme. Detalhe simples que ajuda muito." },
      { name: "Beatriz Andrade", date: "Abr 2026", rating: 5, text: "Sou alérgica e não tive nenhuma crise, não solta pó nem tem cheiro forte de espuma. Chegou embalado a vácuo e em 2 horas já estava no formato." },
    ],
  },


  // 29 — Kit 2 Cobre Leito Colcha Dupla Face Matelado Boutis
  29: {
    total: 1187,
    avg: 4.9,
    reviews: [
      { name: "Rosângela Martins", date: "Jul 2026", rating: 5, text: "Vieram os 2 cobre leitos certinhos, cada um com suas fronhas. Escolhi o floral verde e o lilás do outro lado é um charme — dupla face de verdade, dá pra virar e parecer outra colcha.", image: `${CLF}review-1.png` },
      { name: "Elaine Cardoso", date: "Jul 2026", rating: 5, text: "Peguei o queen e cobriu a cama inteira com sobra nas laterais. O matelado é bem firme, não enruga e o tecido 150 fios é fresquinho pra dormir.", image: `${CLF}review-2.png` },
      { name: "Patrícia Nogueira", date: "Jul 2026", rating: 5, text: "O acabamento boutis é lindo ao vivo, tem todo aquele relevo trabalhado. Combinei com almofadas e meu quarto ficou com cara de hotel.", image: `${CLF}review-3.png` },
      { name: "Marlene Souza", date: "Jun 2026", rating: 5, text: "Chegou embalado numa bolsa com zíper, super bem cuidado. O tecido é macio ao toque e não tem cheiro forte de fábrica.", image: `${CLF}review-4.png` },
      { name: "Cristiane Alves", date: "Jun 2026", rating: 5, text: "Comprei 2 estampas diferentes pra revezar: uma folhagem bege e uma floral. Lavei na máquina e nenhuma das duas desbotou nem soltou fiapo.", image: `${CLF}review-5.png` },
      { name: "Vanessa Lima", date: "Jun 2026", rating: 5, text: "Sou alérgica e esse antialérgico ajudou muito, acordo sem espirrar. Leve pro verão mas ainda dá um conforto gostoso à noite.", image: `${CLF}review-6.png` },
      { name: "Simone Batista", date: "Mai 2026", rating: 5, text: "Levar 2 por esse preço foi o que me convenceu, e não me arrependi. Um fica na cama e o outro lavando, nunca fico sem." },
      { name: "Aline Prado", date: "Mai 2026", rating: 4, text: "Produto ótimo, matelado bonito e bem costurado. Só achei que a entrega demorou uns dias a mais do que o previsto." },
      { name: "Débora Ferraz", date: "Mai 2026", rating: 5, text: "Pedi o solteiro pro quarto da minha filha e o casal pro meu. Deu pra escolher tamanho diferente em cada peça, isso foi ótimo." },
      { name: "Luciana Reis", date: "Abr 2026", rating: 5, text: "Seca rápido no varal e sai fácil o amassado, quase não precisa passar. Custo-benefício excelente por serem 2 peças." },
    ],
  },


  // 28 — Kit 2 Detergente Lava Louças em Pó Ypê 1Kg
  28: {
    total: 763,
    avg: 4.9,
    reviews: [
      { name: "Marcela Tavares", date: "Jul 2026", rating: 5, text: "Chegou certinho, vieram MESMO os 2 potes de 1kg cada, bem lacrados e sem vazar nada na caixa. Já usei nas duas primeiras semanas e a louça sai impecável.", image: `${YPEF}review-1.png` },
      { name: "Rodrigo Salgado", date: "Jul 2026", rating: 5, text: "Kit com 2 unidades pelo preço que eu pagava em 1 no mercado. Vale muito. O pó dissolve rápido e não fica aquele fundo branco no copo.", image: `${YPEF}review-2.png` },

      { name: "Elaine Ferraz", date: "Jul 2026", rating: 5, text: "Confesso que fiquei com medo de vir só 1, mas vieram os 2 potes direitinho. Como é 3 em 1 parei de comprar abrilhantador separado, economizei duas vezes." },
      { name: "Patrícia Gomes", date: "Jun 2026", rating: 5, text: "Tira gordura pesada de panela e forma de assado sem eu precisar pré-lavar. Os talheres saem brilhando de verdade." },
      { name: "Cláudio Ramos", date: "Jun 2026", rating: 5, text: "Uso 25g por ciclo como diz na embalagem e o pote está rendendo bastante. Com os 2 potes acho que passo o ano inteiro tranquilo." },
      { name: "Silvana Duarte", date: "Jun 2026", rating: 5, text: "O que mais gostei foi o controle de odor. Antes minha máquina ficava com cheiro azedo entre as lavagens, agora não fica mais." },
      { name: "Juliana Prado", date: "Mai 2026", rating: 4, text: "Produto ótimo, os 2 potes vieram perfeitos. Só tirei uma estrela porque a entrega demorou um pouquinho mais do que o previsto." },
      { name: "Anderson Melo", date: "Mai 2026", rating: 5, text: "Tenho lava-louças Electrolux e funcionou perfeitamente. As taças de vidro saem sem mancha de água por causa do secante." },
      { name: "Rosana Amaral", date: "Mai 2026", rating: 5, text: "Comprei o kit de 2 pra dividir com minha irmã, cada uma ficou com um pote. Saiu barato pra nós duas e o resultado é o mesmo do original do mercado." },
      { name: "Beatriz Lacerda", date: "Abr 2026", rating: 5, text: "Ypê é marca que eu já confiava, mas em pó pra máquina superou. A tampa rosqueável protege bem da umidade, o pó não empedra." },
    ],
  },

  // 27 — Cobertor Manta Flannel Canelado

  27: {
    total: 1042,
    avg: 4.9,
    reviews: [
      { name: "Simone Barreto", date: "Jul 2026", rating: 5, text: "Muito melhor do que eu esperava por esse preço. É bem grosso mesmo, os 300g fazem diferença: cobri e em 5 minutos já estava quentinha. O canelado é lindo na cama.", image: `${COBF}img-149.png` },
      { name: "Renata Cavalcanti", date: "Jul 2026", rating: 5, text: "Comprei o bege e ficou perfeito no meu quarto. Cobre o colchão queen inteiro com sobra nas laterais. A barra de veludo dá um acabamento de loja cara.", image: `${COBF}img-150.png` },
      { name: "Tatiane Moura", date: "Jun 2026", rating: 5, text: "Sou alérgica e não tive nenhuma crise de rinite dormindo com ele. Não solta fiapo nenhum, nem na primeira lavagem. Recomendo demais.", image: `${COBF}img-151.png` },
      { name: "Aline Prado", date: "Jun 2026", rating: 5, text: "O toque é absurdo de macio, parece pelúcia dos dois lados. Meu marido reclamava de frio e agora dorme sem edredom por cima.", image: `${COBF}img-152.png` },
      { name: "Débora Nunes", date: "Jun 2026", rating: 5, text: "Uso no sofá pra assistir série e virou o item favorito da casa. Leve, não pesa no corpo, mas segura o calor de verdade.", image: `${COBF}img-153.png` },
      { name: "Priscila Andrade", date: "Mai 2026", rating: 5, text: "Peguei o cinza e a cor é exatamente igual à foto. Lavei na máquina em ciclo delicado 3 vezes e não desbotou nem embolou.", image: `${COBF}img-154.png` },
      { name: "Fernanda Bastos", date: "Mai 2026", rating: 5, text: "Tamanho generoso, serve na minha king sem ficar curto. Seca rápido no varal mesmo em dia nublado." },
      { name: "Luciana Reis", date: "Mai 2026", rating: 4, text: "Excelente cobertor, quentinho e macio. Só achei que demorou 2 dias a mais na entrega, mas o produto compensou." },
      { name: "Camila Duarte", date: "Abr 2026", rating: 5, text: "Comprei um pra mim e um pra minha mãe. Ela amou, disse que é o cobertor mais confortável que já teve. Custo-benefício absurdo." },
      { name: "Vanessa Lopes", date: "Abr 2026", rating: 5, text: "Aqui no sul o inverno é pesado e esse cobertor deu conta sozinho. Aquece muito e não faz aquele barulho de tecido sintético." },
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
      { name: "Letícia Bernardes", date: "Mai 2026", rating: 5, text: "Aquecedor maravilhoso! Comprei pro quarto e em 5 minutos o ambiente já tava quentinho. Adorei ter as 3 funções, no verão uso só a ventilação. Ventisol é marca de confiança, e por R$ 79,90 é um achado.", image: ventisolReview1 },
      { name: "Rodrigo Salgado", date: "Mai 2026", rating: 5, text: "Comprei dois, um pra cada quarto. Esquenta muito rápido na potência máxima de 2000W e o termostato funciona certinho — liga e desliga sozinho mantendo a temperatura. Conta de luz não disparou como eu temia.", image: ventisolReview2 },
      { name: "Camila Ferraz", date: "Mai 2026", rating: 5, text: "Aqui no Sul o frio é forte e esse aquecedor salvou meu inverno. Coloco na função suave 1000W durante a noite e o quarto fica perfeito. Silencioso, dá pra dormir tranquilo. Recomendadíssimo!", image: ventisolReview3 },
      { name: "Anderson Vilaça", date: "Abr 2026", rating: 5, text: "Chegou em 4 dias, super bem embalado, original Ventisol com nota fiscal. A alça em cima é ótima pra levar de um cômodo pro outro. Já uso no banheiro de manhã (longe da água) e no quarto à noite.", image: ventisolReview4 },
      { name: "Patrícia Monteiro", date: "Abr 2026", rating: 5, text: "Tenho uma bebê de 8 meses e fiquei tranquila com a grade frontal reforçada e o desligamento automático se tombar. O ar não fica seco como em outros aquecedores. Vale cada centavo!", image: ventisolReview5 },
      { name: "Fernando Quintela", date: "Abr 2026", rating: 5, text: "Compacto, leve e potente. Coube perfeito na escrivaninha do meu escritório. Em poucos minutos a sala fica quentinha, não precisa ficar ligado o tempo todo. Excelente custo-benefício.", image: ventisolReview6 },
      { name: "Juliana Cordeiro", date: "Abr 2026", rating: 5, text: "Por menos de R$ 80 é coisa de outro mundo. Em loja física mais barata vi por R$ 199. As 3 funções (vento, calor leve e calor forte) são bem práticas, dá pra usar o ano todo." },
      { name: "Marcos Andrade", date: "Mar 2026", rating: 5, text: "Resistência cerâmica esquenta de verdade, em 2 minutos já sente o ar quente. Botão giratório bem firme e o termostato é preciso. Ventisol nunca decepciona, terceiro produto da marca aqui em casa." },
      { name: "Bianca Pacheco", date: "Mar 2026", rating: 5, text: "Comprei pra minha mãe idosa que sente muito frio. Ela amou, disse que esquenta o quarto inteiro em poucos minutos. Atendimento da BelaCasa foi excelente, entrega antes do prazo." },
      { name: "Thiago Linhares", date: "Fev 2026", rating: 5, text: "Aparelho top, design bonito e bem acabado. Faz pouquíssimo barulho mesmo na potência máxima. Já comprei outro pra dar de presente pra minha sogra, super recomendo!" },
    ],
  },
  // 23 — Kit 2 Escovas Elétricas Multifuncionais 9 em 1
  23: {
    total: 1962,
    avg: 4.9,
    reviews: [
      { name: "Vanessa Carvalho", date: "Mai 2026", rating: 5, text: "Comprei o kit com 2 escovas e foi a melhor decisão! Dei uma de presente pra minha mãe e fiquei com a outra. As 9 cabeças cobrem absolutamente tudo: box, fogão, panela queimada, rejunte do banheiro. Por R$ 69,90 as duas é absurdo de bom!", image: escovaReview1 },
      { name: "Bruno Tavares", date: "Mai 2026", rating: 5, text: "Cabo retrátil estende até quase 1 metro, alcanço o teto do box sem subir em banquinho. Bateria dura uma faxina inteira. Veio em embalagem caprichada com tudo organizado.", image: escovaReview2 },
      { name: "Renata Macedo", date: "Mai 2026", rating: 5, text: "Vale cada centavo! O rejunte do banheiro tava amarelado, passei a escova de cerdas duras com sabão e voltou ao branco original. Não preciso mais ficar de joelhos esfregando. Salvou minhas costas.", image: escovaReview3 },
      { name: "Anderson Bastos", date: "Abr 2026", rating: 5, text: "Usei no carro: nos bancos, nas calotas, no painel — ficou impecável. Em casa uso no fogão, churrasqueira e box. A potência é real, não é brinquedo. À prova d'água funciona perfeitamente, lavo embaixo da torneira.", image: escovaReview4 },
      { name: "Camila Pacheco", date: "Abr 2026", rating: 5, text: "Tô com problema na coluna e não conseguia limpar o chão do banheiro direito. Com o cabo estendido, limpo em pé sem dor. Esposa também adorou pra usar na pia da cozinha. Top demais!", image: escovaReview5 },
      { name: "Fernando Cordeiro", date: "Abr 2026", rating: 5, text: "Type-C é uma mão na roda, carrego com o cabo do celular. 3000mAh dura muito, faço a limpeza toda da casa sem precisar carregar no meio. Comprei o kit pra dar de presente e revendi 1 com lucro.", image: escovaReview6 },
      { name: "Tatiane Linhares", date: "Abr 2026", rating: 5, text: "9 cabeças diferentes pra cada tipo de superfície! A boina de polimento deu um brilho no carro que eu não esperava. A esponja amarela tira gordura da pia em segundos. Recomendo MUITO." },
      { name: "Eduardo Quintela", date: "Mar 2026", rating: 5, text: "A troca das cabeças é magnética, super rápida. Encaixa e desencaixa com um clique, sem rosquear nada. Motor é forte mesmo, tira sujeira pesada do azulejo do banheiro. Excelente!" },
      { name: "Mariana Salles", date: "Mar 2026", rating: 5, text: "Display de LED mostra a bateria certinho, dá pra planejar a faxina. Silenciosa, posso usar de manhã sem acordar a casa. Veio com nota fiscal e manual em português. Loja confiável." },
      { name: "Patrícia Andrade", date: "Fev 2026", rating: 5, text: "Pague 1 leve 2 — perfeito! Uma fica no banheiro, outra na cozinha. Minha sogra viu e quer também. Por menos de R$ 70 o kit é o melhor custo-benefício da BelaCasa. Já é minha segunda compra aqui." },
    ],
  },
  // 24 — Jogo de Panelas 10 Peças Bianco Vanilla
  24: {
    total: 856,
    avg: 4.9,
    reviews: [
      { name: "Mônica Silveira", date: "Jun 2026", rating: 5, text: "O jogo de panelas é simplesmente divino! A cor Vanilla é muito elegante. Não gruda nada, faço ovo frito sem uma gota de óleo. As 10 peças atendem todas as necessidades da minha cozinha." },
      { name: "Ricardo Mendes", date: "Mai 2026", rating: 5, text: "Comprei de presente para minha esposa e ela amou. O material é resistente, as tampas de vidro temperado são ótimas e os cabos não esquentam de jeito nenhum. Ótimo custo-benefício." },
      { name: "Patrícia Barbosa", date: "Mai 2026", rating: 5, text: "Fiquei surpresa com a qualidade pelo preço de R$ 89,90. O antiaderente é muito superior ao que eu esperava. A cozinha fica linda com esse conjunto completo." },
      { name: "Luciana Guedes", date: "Abr 2026", rating: 5, text: "Chegou super rápido e muito bem embalado. O kit é completo mesmo, vem até utensílios. A cor Sahara que escolhi é maravilhosa e combina com tudo." },
      { name: "Andréia Santos", date: "Abr 2026", rating: 5, text: "Excelente compra. As panelas distribuem o calor uniformemente e limpam num piscar de olhos. O Teflon D'italia é nota 10." },
      { name: "Sônia Aparecida", date: "Mar 2026", rating: 5, text: "Recomendo a todos da BelaCasa. É o segundo kit que compro, um pra mim e um pra minha filha. Qualidade impecável e design sofisticado." },
    ],
  },
  // 25 — Kit 6 Toalhas de Banho Folha
  25: {
    total: 742,
    avg: 4.9,
    reviews: [
      { name: "Vanessa Coutinho", date: "Jul 2026", rating: 5, text: "Toalhas maravilhosas! São felpudas de verdade, secam o corpo todo sem ficar passando várias vezes. As cores sortidas chegaram lindas: rosa, coral, azul, marinho, cinza e lilás." },
      { name: "Rafaela Duarte", date: "Jul 2026", rating: 5, text: "Por R$ 59,90 vir 6 toalhas de banho 100% algodão é impressionante. Lavei na máquina duas vezes e não soltou fiapo nem desbotou. O desenho de folhinhas na barra é um charme." },
      { name: "Juliana Prado", date: "Jun 2026", rating: 5, text: "Comprei pra trocar todas as toalhas velhas de casa e resolveu. Tamanho bom, cobre bem o corpo, e o algodão é macio de verdade, não arranha a pele." },
      { name: "Simone Barreto", date: "Jun 2026", rating: 5, text: "Alta absorção mesmo. Meu marido é grandão e reclamava das toalhas finas, agora aprovou. Secam rápido no varal e não ficam com cheiro de guardado." },
      { name: "Camila Nogueira", date: "Mai 2026", rating: 5, text: "Chegou bem embalado e antes do prazo. As cores sortidas ficaram ótimas, cada um da família tem a sua e ninguém troca mais de toalha por engano." },
      { name: "Denise Alcântara", date: "Mai 2026", rating: 5, text: "Já é o segundo kit que compro na BelaCasa. A barra jacquard dá um acabamento bonito e a costura é reforçada, não desfiou nada." },
      { name: "Priscila Amorim", date: "Abr 2026", rating: 5, text: "Perfeitas pra enxoval e pra presentear. Separei duas pra dar de presente e minha irmã amou. Custo-benefício excelente." },
      { name: "Larissa Fontes", date: "Abr 2026", rating: 5, text: "Toalha felpuda gostosa de usar depois do banho. Depois de várias lavagens continua macia e as cores firmes. Recomendo demais." },
    ],
  },
  // 26 — Escova Modeladora de Íons Negativos 38 mm
  26: {
    total: 1128,
    avg: 4.9,
    reviews: [
      { name: "Amanda Ferrari", date: "Jul 2026", rating: 5, text: "Essa GOKOCO de 38mm é sensacional! Esquenta em 30 segundos de verdade, não precisa ficar esperando. Faço escova em casa e fica igual a de salão, com raiz levantada e pontas viradas.", image: escovaIonsReview1 },
      { name: "Beatriz Toledo", date: "Jul 2026", rating: 5, text: "Meu cabelo é fino e sempre tive medo de danificar. Uso a GOKOCO no 140°C e funciona perfeitamente, os 9 níveis fazem toda diferença. O frizz sumiu, os íons negativos realmente funcionam.", image: escovaIonsReview2 },
      { name: "Carolina Estevam", date: "Jul 2026", rating: 5, text: "Por R$ 89,90 não esperava tanta qualidade da GOKOCO. O visor digital é claro, o cabo gira 360° e não enrola. Modelo ondas que duram o dia inteiro, do trabalho até a balada.", image: escovaIonsReview3 },
      { name: "Daniela Prado", date: "Jun 2026", rating: 5, text: "As cerdas da GOKOCO não embaraçam nada, deslizam pelo cabelo sem puxar. O barril de 38 mm é do tamanho ideal para o meu cabelo médio, faz cacho e alisa na mesma passada.", image: escovaIonsReview4 },
      { name: "Elisa Marchetti", date: "Jun 2026", rating: 5, text: "Essa GOKOCO é leve demais, 350 g mesmo. Antes meu braço cansava com a escova antiga, agora finalizo o cabelo todo sem dor. O desligamento automático de 1h me deu tranquilidade.", image: escovaIonsReview5 },
      { name: "Fernanda Quintela", date: "Jun 2026", rating: 5, text: "Cabelo grosso e volumoso aqui. Uso a GOKOCO no 200°C e domina os fios em minutos. Antes gastava R$ 60 por escova no salão toda semana, se pagou na primeira semana." },
      { name: "Gabriela Sanchez", date: "Mai 2026", rating: 5, text: "A GOKOCO com controle NTC é o diferencial: mantém a temperatura estável, não fica esquentando demais e queimando o cabelo. Já usei outras que passavam do ponto." },
      { name: "Helena Vasques", date: "Mai 2026", rating: 5, text: "Brilho absurdo depois de usar a GOKOCO. Minha cutícula estava toda arrepiada e agora o cabelo reflete a luz. Comprei a 220V e chegou certinho, bem embalada." },
      { name: "Isabela Moraes", date: "Abr 2026", rating: 5, text: "Comprei a GOKOCO pra minha filha adolescente e ela usa todo dia. Prático, seguro e o resultado é lindo. Já vou comprar outra pra mim." },
      { name: "Juliana Castilho", date: "Abr 2026", rating: 5, text: "Entrega rápida e a GOKOCO é igualzinho às fotos. Rosé com preto é lindo, fica bonito até na bancada do banheiro. Recomendo de olhos fechados." },
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
