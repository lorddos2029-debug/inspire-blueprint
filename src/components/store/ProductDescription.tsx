import { products } from "@/data/products";

interface ProductDescriptionProps {
  productId: number;
}

interface Spec {
  label: string;
  value: string;
}

interface ProductSheet {
  about: string;
  specs: Spec[];
}

const productSheets: Record<number, ProductSheet> = {
  117: {
    about: "Kit de dois travesseiros cervicais ABRANUV PRO2.0 com desenho anatômico em formato de borboleta. As áreas contornadas permitem experimentar diferentes posições de apoio ao dormir, de costas ou de lado. O material ilustrativo apresenta enchimento viscoelástico e capa de acabamento cinza e branco. Conforto e adaptação são individuais, e não há comprovação apresentada de que o produto trate problemas cervicais ou ronco.",
    specs: [
      { label: "Marca", value: "ABRANUV (conforme imagens)" },
      { label: "Linha", value: "PRO2.0 (conforme imagens)" },
      { label: "Quantidade", value: "2 travesseiros" },
      { label: "Tipo", value: "Travesseiro cervical anatômico" },
      { label: "Formato", value: "Borboleta, com diferentes zonas de apoio" },
      { label: "Material divulgado", value: "Espuma viscoelástica de recuperação lenta" },
      { label: "Dimensões ilustradas", value: "Aproximadamente 62 × 41 cm" },
      { label: "Alturas ilustradas", value: "Áreas com cerca de 8 e 10 cm; outra imagem indica 11–13 cm" },
      { label: "Cores", value: "Cinza e branco" },
      { label: "Uso", value: "Apoio da cabeça e do pescoço durante o descanso" },
      { label: "Verificação", value: "Confirmar medidas e materiais na etiqueta do lote" },
    ],
  },
  40: {
    about:
      "Kit completo de 6 peças para vestir a cama com um conjunto coordenado e prático para o dia a dia. O cobre leito em piquet cria um visual texturizado e decorativo, as fronhas recebem acabamento ponto palito e o lençol com elástico facilita o ajuste no colchão. O produto está disponível nos tamanhos Casal, Queen e King e em nove combinações de estampas e cores para escolher diretamente na página.",
    specs: [
      { label: "Categoria", value: "Jogo de cama / Kit cobre leito" },
      { label: "Conteúdo", value: "Kit com 6 peças" },
      { label: "Conjunto", value: "Cobre leito piquet, jogo de fronhas com acabamento ponto palito e lençol com elástico" },
      { label: "Tamanhos", value: "Casal, Queen ou King (escolha na compra)" },
      { label: "Acabamento", value: "Piquet estampado e detalhe ponto palito nas fronhas" },
      { label: "Lençol", value: "Com elástico para melhor ajuste ao colchão" },
      { label: "Estampas", value: "9 combinações de cores e estampas disponíveis" },
      { label: "Uso", value: "Roupa de cama para uso diário e composição de enxoval" },
      { label: "Cuidados", value: "Seguir as instruções de lavagem e conservação da etiqueta do produto" },
      { label: "Garantia", value: "30 dias para troca ou devolução" },
    ],
  },
  39: {
    about:
      "Micro-ondas Mondial MO-01-21-B com 21 litros de capacidade e 1.200W de potência: espaço suficiente para as receitas do dia a dia e aquecimento rápido e uniforme. Design preto espelhado com painel digital, puxador cromado e acabamento que combina com qualquer cozinha.",
    specs: [
      { label: "Categoria", value: "Eletrodoméstico / Micro-ondas" },
      { label: "Modelo", value: "Mondial MO-01-21-B" },
      { label: "Capacidade", value: "21 litros" },
      { label: "Potência", value: "1.200 W" },
      { label: "Voltagem", value: "110V ou 220V (escolha na compra)" },
      { label: "Eficiência energética", value: "Selo classificação A" },
      { label: "Cor", value: "Preto espelhado" },
      { label: "Dimensões", value: "45 cm (largura) x 33 cm (profundidade) x 26 cm (altura)" },
      { label: "Peso", value: "10,5 kg" },
      { label: "Display", value: "Digital verde de fácil leitura" },
      { label: "Prato giratório", value: "Removível para limpeza" },
      { label: "Menus", value: "Dia a Dia (arroz, bebidas, manter aquecido) e Kids (pipoca, brigadeiro, bolo de caneca)" },
      { label: "Funções", value: "Descongelar, Manter Aquecido, Tira Odor, Iniciar +30 seg" },
      { label: "Segurança", value: "Trava de segurança para crianças" },
      { label: "Extras", value: "QR Code de receitas Mondial" },
      { label: "Garantia", value: "30 dias para troca ou devolução" },
    ],
  },
  38: {
    about:
      "Limpador a vapor pressurizado IRISOY de 2500W que higieniza com vapor seco a até 105 °C, eliminando 99,9% das bactérias, ácaros, mofo e gordura encostrada sem usar nenhum produto químico. Aquecimento rápido em cerca de 5 a 15 segundos, pressão de saída de 3 bar e 6 velocidades ajustáveis para cada tipo de sujeira.",
    specs: [
      { label: "Categoria", value: "Utilidades / Limpeza a vapor" },
      { label: "Modelo", value: "IRISOY Limpador a Vapor 2500W" },
      { label: "Potência", value: "2.500 W" },
      { label: "Voltagem", value: "110V ou 220V (escolha na compra)" },
      { label: "Temperatura do vapor", value: "Até 105 °C / 229 °F" },
      { label: "Pressão de saída", value: "3 bar" },
      { label: "Reservatório", value: "1,2 L (1.200 ml) — uso contínuo com reabastecimento a qualquer momento" },
      { label: "Aquecimento", value: "5 a 15 segundos" },
      { label: "Velocidades", value: "6 níveis de vapor ajustáveis" },
      { label: "Dimensões", value: "19 x 15 x 13 cm" },
      { label: "Mangueira", value: "1,5 m" },
      { label: "Cabo de energia", value: "2 m" },
      { label: "Cor", value: "Vermelho e preto" },
      { label: "Kit incluso", value: "Bico curvo, raspador de vidros, raspador de tecido/couro, escova de metal, raspadores pequenos, escovas de nylon, pano de microfibra, anéis de vedação, agulha de limpeza e cabo de alimentação" },
      { label: "Indicação", value: "Fogão, coifa, rejunte, vaso sanitário, vidros, sofá, colchão, tapete e detalhamento automotivo" },
      { label: "Garantia", value: "30 dias para troca ou devolução" },
    ],
  },
  37: {
    about:
      "O Coberdrom Queen com Sherpa Lã de Carneiro é dupla face: de um lado o sherpa peluciado que imita lã de carneiro e segura o calor do corpo, do outro a microfibra aveludada de toque macio. Entre as duas camadas há enchimento em manta siliconada com costura matelassê em quadrados, que distribui o volume de forma uniforme e impede que o enchimento migre com o uso e as lavagens. Resultado: uma peça encorpada e muito quente para o inverno, mas leve o suficiente para não sufocar durante o sono. Dispensa o uso de edredom e cobertor separados — o coberdrom faz os dois papéis em uma peça só. Tamanho Queen com sobra generosa nas laterais, tratamento antialérgico, não solta pelos e pode ser lavado em máquina. Disponível em 9 cores para combinar com qualquer quarto.",
    specs: [
      { label: "Categoria", value: "Jogo de cama / Coberdrons" },
      { label: "Tamanho", value: "Queen — cobre a cama com sobra nas laterais" },
      { label: "Face 1", value: "Sherpa peluciado estilo lã de carneiro" },
      { label: "Face 2", value: "Microfibra aveludada de toque macio" },
      { label: "Enchimento", value: "Manta siliconada de alta gramatura" },
      { label: "Acabamento", value: "Costura matelassê em quadrados, bordas reforçadas" },
      { label: "Tratamento", value: "Antialérgico e antifungo, não solta pelos" },
      { label: "Cores", value: "Cinza, Bege, Azul Marinho, Pink, Preto, Rosé, Marrom, Tiffany e Vermelho" },
      { label: "Lavagem", value: "Máquina em ciclo delicado, sem alvejante" },
      { label: "Indicação", value: "Inverno, quartos frios e regiões de serra" },
      { label: "Garantia", value: "30 dias para troca ou devolução" },
    ],
  },
  36: {

    about:
      "O Liquidificador Electrolux Efficient EBL1000 entrega 1000W de potência para triturar de tudo: gelo, frutas congeladas, folhas e massas. As lâminas TriForce em aço inoxidável trabalham em três direções dentro do copo, evitando que sobrem pedaços no fundo. O copo de 2,7 litros com marcação em ml atende a família inteira em um único ciclo e a tampa com dosador removível permite adicionar ingredientes sem parar o preparo. São 5 velocidades mais as funções Pulsar, Gelo e Limpa Fácil — nesta última, basta colocar água com detergente e ligar que o próprio aparelho se lava. Base larga com pés antiderrapantes, acabamento cinza e peças removíveis que facilitam a limpeza no dia a dia.",
    specs: [
      { label: "Categoria", value: "Eletroportátil / Cozinha" },
      { label: "Modelo", value: "Electrolux Efficient EBL1000" },
      { label: "Potência", value: "1000 W" },
      { label: "Capacidade", value: "Copo de 2,7 litros com marcação em ml" },
      { label: "Lâminas", value: "TriForce em aço inoxidável" },
      { label: "Velocidades", value: "5 velocidades + Pulsar, Gelo e Limpa Fácil" },
      { label: "Tampa", value: "Com dosador removível" },
      { label: "Voltagem", value: "127V ou 220V (selecione na compra)" },
      { label: "Medidas", value: "40,3 cm (altura) x 19,5 cm (largura) x 19,8 cm (profundidade)" },
      { label: "Peso", value: "1,6 kg" },
      { label: "Base", value: "Antiderrapante, mantém o aparelho firme" },
      { label: "Cor", value: "Cinza" },
      { label: "Garantia", value: "30 dias para troca ou devolução" },
    ],
  },
  35: {

    about:
      "O Gaabor Processador Multislice reúne potência e praticidade em um aparelho compacto. O motor de 300W aciona lâminas duplas em formato \"S\" com 4 cortes em aço inoxidável japonês, que trituram os alimentos por completo — inclusive o que fica nas laterais do copo. O recipiente é de vidro reforçado de 6 mm com qualidade alimentar e 2 litros de capacidade, processando até 550 g de carne por vez. Com 2 velocidades, você controla a textura: a velocidade I (média) é ideal para folhas, ervas, cebola, alho e gengibre; a velocidade II (alta) dá conta de carnes, castanhas, legumes e raízes. A base antiderrapante mantém o aparelho firme na bancada e todas as peças removíveis são fáceis de lavar apenas com água corrente.",
    specs: [
      { label: "Categoria", value: "Eletroportátil / Cozinha" },
      { label: "Potência", value: "300 W" },
      { label: "Capacidade", value: "2 litros (até 550 g de carne por ciclo)" },
      { label: "Recipiente", value: "Vidro reforçado de 6 mm, qualidade alimentar" },
      { label: "Lâminas", value: "Duplas em formato \"S\", 4 cortes, aço inoxidável" },
      { label: "Velocidades", value: "2 (I média e II alta) com acionamento por pulso" },
      { label: "Voltagem", value: "127V ou 220V (selecione na compra)" },
      { label: "Acessórios", value: "Copo de vidro, tampa, lâmina, cesto e espátula" },
      { label: "Base", value: "Antiderrapante, mantém o aparelho firme" },
      { label: "Limpeza", value: "Peças removíveis, laváveis em água corrente" },
      { label: "Cor", value: "Preto" },
      { label: "Garantia", value: "30 dias para troca ou devolução" },
    ],
  },
  34: {
    about:
      "A Bicicleta Ergométrica Spinning Profissional traz a experiência da academia para dentro de casa. A estrutura em aço carbono com base larga e pés antiderrapantes suporta até 120 kg sem oscilar, mesmo no pedal em pé. A transmissão por correia com roda de inércia entrega giro contínuo e silencioso, e o ajuste de resistência por atrito permite simular desde a pedalada leve até a subida pesada. Guidão e banco regulam em altura e profundidade, adaptando-se a diferentes alturas, e o painel digital acompanha tempo, velocidade, distância, calorias e pulsação.",
    specs: [
      { label: "Categoria", value: "Fitness / Bicicleta ergométrica" },
      { label: "Estrutura", value: "Aço carbono reforçado com pintura eletrostática" },
      { label: "Capacidade", value: "Suporta até 120 kg" },
      { label: "Transmissão", value: "Correia silenciosa com roda de inércia" },
      { label: "Resistência", value: "Ajuste progressivo por atrito + freio de emergência" },
      { label: "Guidão", value: "Altura regulável de 96 cm a 110 cm" },
      { label: "Banco", value: "Altura de 78 cm a 92 cm e ajuste dianteiro/traseiro de 40 cm" },
      { label: "Pedais", value: "Antiderrapantes com cinta de fixação ajustável" },
      { label: "Painel", value: "Digital: tempo, velocidade, distância, calorias e pulsação" },
      { label: "Medidas", value: "80 cm (comprimento) x 46 cm (largura)" },
      { label: "Extras", value: "Rodinhas de transporte, suporte para garrafa e celular" },
      { label: "Montagem", value: "Simples, ferramentas e manual inclusos" },
    ],
  },
  33: {
    about:
      "A Escova de Limpeza Elétrica Multifuncional 9 em 1 é retrátil e foi feita para eliminar o esforço da limpeza pesada. O cabo extensível em aço inoxidável alcança teto, azulejos, janelas altas e cantos sem escada, enquanto a alta rotação remove limo e manchas difíceis sem esfregar. Com 9 acessórios entre cerdas e esponjas, atende banheiro, cozinha, área externa e até o carro.",
    specs: [
      { label: "Categoria", value: "Utilidades / Limpeza" },
      { label: "Acessórios", value: "9 cabeças (cerdas e esponjas)" },
      { label: "Cabo", value: "Retrátil em aço inox, alcance até 1,5 m" },
      { label: "Bateria", value: "3000 mAh, até 90 min, carga USB-C" },
      { label: "Proteção", value: "À prova d'água IPX7" },
      { label: "Indicação", value: "Azulejo, box, vidro, piso, fogão e carro" },
    ],
  },
  32: {
    about:
      "A Cadeira Presidente Premium foi projetada para quem passa horas sentado e não abre mão de saúde postural. O suporte lombar 3D acompanha o movimento das costas, a malha mesh de alta densidade mantém o encosto ventilado e o apoio de cabeça ajustável alivia a tensão cervical. Estrutura reforçada, pistão a gás classe 4 e sistema relax com trava garantem segurança e conforto ao longo do dia.",
    specs: [
      { label: "Categoria", value: "Escritório / Home office" },
      { label: "Encosto", value: "Malha mesh respirável de alta densidade" },
      { label: "Apoio lombar", value: "Suporte 3D dinâmico" },
      { label: "Apoio de cabeça", value: "Ajuste de altura e ângulo (2D)" },
      { label: "Braços", value: "Articulados, recolhíveis sob a mesa" },
      { label: "Regulagem", value: "Pistão a gás classe 4 + relax com trava" },
      { label: "Cor", value: "Cinza e branco" },
    ],
  },
  30: {
    about:
      "O Travesseiro Ortopédico Cervical em formato borboleta é feito em espuma viscoelástica de recuperação lenta e acompanha a curva natural da coluna cervical. As zonas de apoio independentes e os recortes laterais em asa acomodam os ombros, aliviam a pressão no pescoço, favorecem a respiração e reduzem o ronco. Com alturas diferentes em cada lado, adapta-se a quem dorme de lado, de costas ou de bruços — suporte firme, sem odor e sem deformar com o uso.",
    specs: [
      { label: "Categoria", value: "Travesseiros" },
      { label: "Material", value: "Espuma viscoelástica (memory foam) de recuperação lenta" },
      { label: "Medidas", value: "60 cm x 35 cm" },
      { label: "Alturas", value: "Lado baixo 8 cm / lado alto 11 cm" },
      { label: "Capa", value: "Tecido matelassê respirável, removível e lavável" },
      { label: "Tratamento", value: "Antiácaro, antifungo e hipoalergênico" },
      { label: "Indicação", value: "Cervicalgia, dores de cabeça tensionais e má postura ao dormir" },
    ],
  },
  29: {
    about:
      "O Kit 2 Cobre Leito Colcha Dupla Face traz duas peças reversíveis em tecido 150 fios com matelassê Boutis: de um lado a estampa, do outro um tom liso trabalhado — dois visuais para o mesmo quarto. O enchimento em manta siliconada dá caimento bonito sem pesar e o pesponto mantém o volume distribuído mesmo após várias lavagens.",
    specs: [
      { label: "Categoria", value: "Jogo de cama / Colchas" },
      { label: "Composição", value: "Microfibra 150 fios com manta siliconada" },
      { label: "Acabamento", value: "Matelassê Boutis dupla face" },
      { label: "Peças", value: "2 cobre leitos (estampa e tamanho à escolha)" },
      { label: "Tamanhos", value: "Solteiro, Casal, Queen ou King" },
      { label: "Tratamento", value: "Antialérgico e antifungo, não solta fiapos" },
      { label: "Lavagem", value: "Máquina em ciclo delicado, secagem rápida" },
    ],
  },
  27: {
    about:
      "O Cobertor Manta Flannel Canelado tem 300 g/m² de gramatura e relevo 3D que retém o calor do corpo, aquecendo de verdade sem pesar. A microfibra escovada dupla deixa os dois lados supermacios e a barra em veludo costurada dá caimento elegante e durabilidade nas pontas.",
    specs: [
      { label: "Categoria", value: "Casa & Banho / Cobertores" },
      { label: "Material", value: "Flannel de microfibra canelado, escovação dupla" },
      { label: "Gramatura", value: "300 g/m²" },
      { label: "Medidas", value: "2,20 m x 2,40 m (Casal Queen/King)" },
      { label: "Acabamento", value: "Barra em veludo costurada" },
      { label: "Tratamento", value: "Antialérgico e antifungo, não solta fiapos" },
      { label: "Cores", value: "Bege e Cinza" },
    ],
  },
  26: {
    about:
      "A Escova Modeladora de Íons Negativos alisa, modela e dá volume em uma única passada. O barril cerâmico de 38 mm com aquecimento PTC duplo fica pronto em 30 segundos e o controle NTC monitora a temperatura em tempo real para proteger os fios. Os 3 milhões de íons negativos selam a cutícula, reduzem o frizz e deixam o cabelo visivelmente mais liso e brilhante.",
    specs: [
      { label: "Categoria", value: "Eletro / Beleza" },
      { label: "Barril", value: "Cerâmico de 38 mm com cerdas mistas antiembaraço" },
      { label: "Temperatura", value: "9 níveis, de 130°C a 210°C" },
      { label: "Aquecimento", value: "PTC duplo, pronta em 30 segundos" },
      { label: "Tecnologia", value: "3 milhões de íons negativos + controle NTC" },
      { label: "Peso", value: "350 g, cabo giratório 360°" },
      { label: "Segurança", value: "Desligamento automático em 1 hora" },
      { label: "Voltagem", value: "110V ou 220V (à escolha)" },
    ],
  },
  25: {
    about:
      "O Kit 6 Toalhas de Banho Folha é 100% algodão felpudo com jacquard de folhas na barra. O fio penteado garante alta absorção e secagem rápida, com toque macio que não agride a pele e mantém a felpa firme após muitas lavagens.",
    specs: [
      { label: "Categoria", value: "Casa & Banho / Toalhas" },
      { label: "Composição", value: "100% algodão, fio penteado" },
      { label: "Peças", value: "6 toalhas de banho" },
      { label: "Medidas", value: "70 cm x 140 cm" },
      { label: "Acabamento", value: "Barra jacquard com ponto duplo antidesfiar" },
      { label: "Cores", value: "Sortidas conforme disponibilidade" },
    ],
  },
  17: {
    about:
      "O Jogo de Panelas Bianco Vanilla equipa a cozinha inteira com 10 peças de revestimento antiaderente de alta durabilidade. As tampas de vidro temperado com visor permitem acompanhar o cozimento sem perder calor, e os cabos ergonômicos não esquentam durante o preparo.",
    specs: [
      { label: "Categoria", value: "Cozinha / Panelas" },
      { label: "Peças", value: "10 peças completas" },
      { label: "Revestimento", value: "Antiaderente de alta durabilidade" },
      { label: "Tampas", value: "Vidro temperado com visor" },
      { label: "Cabos", value: "Ergonômicos, não esquentam" },
      { label: "Compatibilidade", value: "Gás, elétrico e vitrocerâmico" },
      { label: "Cores", value: "8 opções à escolha" },
    ],
  },
  19: {
    about:
      "O Coberdrom Casal/Queen Dupla Face une microfibra aveludada de um lado e sherpa peluciado do outro, para variar o uso conforme a temperatura. Retém o calor nas noites frias, é encorpado sem sufocar, não solta pelos e pode ir à máquina de lavar.",
    specs: [
      { label: "Categoria", value: "Jogo de cama / Coberdrons" },
      { label: "Material", value: "Sherpa peluciado + microfibra aveludada" },
      { label: "Tamanho", value: "Casal/Queen — 2,20 m x 2,40 m" },
      { label: "Acabamento", value: "Costura matelassê reforçada" },
      { label: "Tratamento", value: "Antialérgico, não solta pelos" },
      { label: "Cores", value: "6 opções à escolha" },
    ],
  },
  20: {
    about:
      "O Liquidificador Mondial L-99 Turbo Power tem motor de 550W, 3 velocidades e função pulsar para triturar frutas, gelo e preparar massas com rapidez. As lâminas de aço inox de 4 pontas e o filtro removível na jarra garantem sucos mais lisos e limpeza fácil.",
    specs: [
      { label: "Categoria", value: "Eletro / Cozinha" },
      { label: "Potência", value: "550W" },
      { label: "Velocidades", value: "3 + função pulsar" },
      { label: "Lâminas", value: "Aço inox de 4 pontas" },
      { label: "Jarra", value: "Com filtro removível e tampa dosadora" },
      { label: "Voltagem", value: "110V ou 220V (à escolha)" },
      { label: "Cores", value: "Preto ou Vermelho" },
    ],
  },
  102: {
    about:
      "Aparador buffet em MDP branco com prateleiras amplas, indicado para sala, hall de entrada ou escritório. Estrutura resistente, acabamento fosco e montagem simples com gabarito.",
    specs: [
      { label: "Categoria", value: "Móveis / Sala" },
      { label: "Material", value: "MDP com acabamento fosco" },
      { label: "Cor", value: "Branco" },
      { label: "Estrutura", value: "Prateleiras amplas internas" },
      { label: "Montagem", value: "Simples, manual incluso" },
    ],
  },
  103: {
    about:
      "Suporte duplo de parede para cozinha em preto fosco. Acomoda micro-ondas, forno elétrico e utensílios, liberando espaço na bancada com visual moderno.",
    specs: [
      { label: "Categoria", value: "Cozinha / Organização" },
      { label: "Material", value: "MDP e estrutura metálica" },
      { label: "Cor", value: "Preto fosco" },
      { label: "Fixação", value: "Parede, com buchas e parafusos" },
      { label: "Uso", value: "Micro-ondas, forno elétrico e utensílios" },
    ],
  },
  104: {
    about:
      "Jogo com 6 taças Diamond em vidro transparente com relevo lapidado. Elegantes para água, vinho e drinks, deixam a mesa posta sofisticada no dia a dia e em ocasiões especiais.",
    specs: [
      { label: "Categoria", value: "Utilidades / Mesa posta" },
      { label: "Material", value: "Vidro transparente lapidado" },
      { label: "Capacidade", value: "350 ml por taça" },
      { label: "Peças", value: "6 unidades" },
      { label: "Uso", value: "Água, vinho, sucos e drinks" },
    ],
  },
  105: {
    about:
      "Sapateira estilo industrial com 3 planos, estrutura metálica reforçada e prateleiras em MDP marrom-claro. Organiza até 12 pares mantendo os calçados ventilados.",
    specs: [
      { label: "Categoria", value: "Organização / Quarto" },
      { label: "Material", value: "Metal e MDP marrom-claro" },
      { label: "Planos", value: "3 prateleiras" },
      { label: "Capacidade", value: "Até 12 pares" },
      { label: "Estilo", value: "Industrial" },
    ],
  },
  106: {
    about:
      "Sapateira compacta branca para quarto, sala ou hall. Design clean, ocupa pouco espaço e mantém os calçados organizados e ventilados.",
    specs: [
      { label: "Categoria", value: "Organização / Quarto" },
      { label: "Material", value: "MDP fosco" },
      { label: "Cor", value: "Branco" },
      { label: "Design", value: "Compacto, ideal para espaços pequenos" },
      { label: "Montagem", value: "Rápida, manual incluso" },
    ],
  },
  107: {
    about:
      "Mesa de cabeceira moderna em MDP fosco com nicho e prateleira. Apoia celular, livros e abajur ao lado da cama, com acabamento que combina com quartos claros ou escuros.",
    specs: [
      { label: "Categoria", value: "Móveis / Quarto" },
      { label: "Material", value: "MDP fosco" },
      { label: "Cores", value: "Branco ou Preto" },
      { label: "Estrutura", value: "Nicho + prateleira" },
      { label: "Montagem", value: "Simples, ferragens inclusas" },
    ],
  },
  108: {
    about:
      "Suporte aéreo modular preto para micro-ondas e utensílios de cozinha. Fixação na parede com alta resistência e visual moderno, liberando toda a bancada.",
    specs: [
      { label: "Categoria", value: "Cozinha / Organização" },
      { label: "Material", value: "MDP e metal" },
      { label: "Cor", value: "Preto" },
      { label: "Sistema", value: "Modular suspenso" },
      { label: "Fixação", value: "Parede, kit de instalação incluso" },
    ],
  },
  109: {
    about:
      "Mesa de centro branca com design leve e contemporâneo. Funciona como peça central da sala ou apoio lateral ao lado do sofá.",
    specs: [
      { label: "Categoria", value: "Móveis / Sala" },
      { label: "Material", value: "MDP com acabamento fosco" },
      { label: "Cor", value: "Branco" },
      { label: "Uso", value: "Mesa de centro ou apoio lateral" },
      { label: "Montagem", value: "Simples, manual incluso" },
    ],
  },
  110: {
    about:
      "Armário suspenso branco com porta, nicho e 3 prateleiras internas. Ideal para banheiro, lavanderia ou cozinha, aproveitando o espaço vertical da parede.",
    specs: [
      { label: "Categoria", value: "Organização / Banheiro" },
      { label: "Material", value: "MDP resistente à umidade" },
      { label: "Cor", value: "Branco" },
      { label: "Estrutura", value: "1 porta, 1 nicho e 3 prateleiras" },
      { label: "Fixação", value: "Suspensa, buchas e parafusos inclusos" },
    ],
  },
  111: {
    about:
      "Suporte ergonômico para monitor que eleva a tela à altura dos olhos, aliviando a tensão no pescoço e criando espaço extra na mesa para teclado e acessórios.",
    specs: [
      { label: "Categoria", value: "Escritório / Setup" },
      { label: "Material", value: "MDP com acabamento preto e mel" },
      { label: "Função", value: "Elevação ergonômica do monitor" },
      { label: "Extra", value: "Vão inferior para teclado e acessórios" },
    ],
  },
  112: {
    about:
      "Rack sapateira em MDP com 2 prateleiras, acabamento fosco e montagem rápida. Solução simples para manter a entrada de casa organizada.",
    specs: [
      { label: "Categoria", value: "Organização / Entrada" },
      { label: "Material", value: "MDP fosco" },
      { label: "Cores", value: "Preto ou Branco" },
      { label: "Prateleiras", value: "2 planos" },
      { label: "Montagem", value: "Rápida, ferragens inclusas" },
    ],
  },
  113: {
    about:
      "Mesa de cabeceira Safira com rodinhas, prática de mover e perfeita para espaços pequenos no quarto ou na sala. Estrutura estreita que cabe em qualquer canto.",
    specs: [
      { label: "Categoria", value: "Móveis / Quarto" },
      { label: "Material", value: "MDP fosco" },
      { label: "Medidas", value: "20 x 20 x 60 cm" },
      { label: "Cores", value: "Branco ou Preto" },
      { label: "Mobilidade", value: "Rodízios inclusos" },
    ],
  },
  114: {
    about:
      "Mop spray com reservatório de 380 ml e refil em microfibra: borrifa e limpa ao mesmo tempo, sem precisar de balde. Ideal para limpezas rápidas do dia a dia.",
    specs: [
      { label: "Categoria", value: "Utilidades / Limpeza" },
      { label: "Reservatório", value: "380 ml acoplado" },
      { label: "Refil", value: "Microfibra lavável" },
      { label: "Cabo", value: "Alumínio leve com gatilho" },
      { label: "Uso", value: "Piso frio, laminado e porcelanato" },
    ],
  },
  115: {
    about:
      "Kit esfregão mop com balde de 10,5 litros, cesto centrifugador em inox, cabo de 140 cm e 2 refis de microfibra. Centrifuga sem encostar as mãos na água suja.",
    specs: [
      { label: "Categoria", value: "Utilidades / Limpeza" },
      { label: "Balde", value: "10,5 litros com cesto centrifugador em inox" },
      { label: "Cabo", value: "140 cm, giratório" },
      { label: "Refis", value: "2 unidades em microfibra" },
      { label: "Uso", value: "Todos os tipos de piso" },
    ],
  },
};

const ProductDescription = ({ productId }: ProductDescriptionProps) => {
  const product = products.find((p) => p.id === productId);
  const sheet = productSheets[productId];

  if (!product && !sheet) return null;

  const about = sheet?.about ?? product?.description ?? "";
  const specs: Spec[] =
    sheet?.specs ??
    [
      { label: "Garantia", value: "30 dias para troca ou devolução" },
      { label: "Envio", value: "Processado em até 24h úteis, com rastreio" },
      { label: "Nota fiscal", value: "Emitida eletronicamente em todo pedido" },
    ];

  return (
    <div className="mt-6 w-full min-w-0 max-w-full overflow-hidden">
      <p className="max-w-full break-words [overflow-wrap:anywhere] text-[15px] text-muted-foreground whitespace-pre-line leading-relaxed">
        {about}
      </p>

      {productId === 117 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-base font-extrabold text-foreground">Imagens e detalhes do produto</h3>
          {Array.from({ length: 10 }, (_, i) => (
            <img key={i} src={`/assets/products-bc/abranuv-kit2/kit-${i + 1}.png`}
              alt={`Kit 2 Travesseiros Cervicais ABRANUV — detalhe ${i + 1}`}
              loading="lazy" className="block w-full max-w-[800px] h-auto object-contain rounded-md" />
          ))}
        </div>
      )}
      <div className="mt-8">
        <h3 className="text-base font-extrabold tracking-tight uppercase text-foreground">
          Especificações técnicas
        </h3>
        <dl className="mt-3 w-full min-w-0 max-w-full divide-y divide-border border-y border-border">
          {specs.map((spec) => (
            <div
              key={spec.label}
              className="grid min-w-0 grid-cols-1 sm:grid-cols-[10rem_minmax(0,1fr)] gap-1 sm:gap-4 py-3"
            >
              <dt className="text-sm font-bold text-foreground">{spec.label}</dt>
              <dd className="min-w-0 break-words [overflow-wrap:anywhere] text-sm text-muted-foreground leading-relaxed">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 w-full min-w-0 max-w-full rounded-lg border border-border bg-secondary/30 p-3 sm:p-4">
        <p className="text-sm text-muted-foreground leading-relaxed">
          Você tem até <strong className="text-foreground">30 dias para trocar ou devolver</strong> sem
          burocracia. Pedidos processados em até <strong className="text-foreground">24h úteis</strong>,
          com rastreio completo e nota fiscal eletrônica.
        </p>
      </div>
    </div>
  );
};

export default ProductDescription;
