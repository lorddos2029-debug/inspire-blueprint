import { products } from "@/data/products";

interface ProductDescriptionProps {
  productId: number;
}

const productHighlights: Record<number, { headline: string; intro: string; details: { title: string; desc: string }[]; closing: string }> = {
  1: {
    headline: "CONFORTO QUE ABRAÇA O SEU CORPO",
    intro: "Cobertor plush king size com toque ultramacio e fibras térmicas que aquecem sem pesar. Ideal para noites de inverno e ambientes climatizados, antialérgico e seguro para toda a família.",
    details: [
      { title: "Toque de nuvem", desc: "Pelo plush ultramacio que envolve o corpo" },
      { title: "Antialérgico", desc: "Fibras hipoalergênicas, seguras para crianças" },
      { title: "Térmico inteligente", desc: "Mantém o calor sem sufocar nem pesar" },
      { title: "Costura reforçada", desc: "Acabamento premium duradouro" },
      { title: "Tamanho generoso", desc: "King size 2,40m x 2,60m cobre com folga" },
    ],
    closing: "Eleve o conforto do seu quarto com a maciez que só um cobertor BellaCasa pode oferecer.",
  },
  2: {
    headline: "DURMA COMO EM UM HOTEL CINCO ESTRELAS",
    intro: "Par de travesseiros com enchimento em fibra siliconada hipoalergênica e capa 100% algodão. Suporte cervical perfeito, costura quilt resistente e antiácaro de verdade.",
    details: [
      { title: "100% algodão", desc: "Capa fresca e respirável" },
      { title: "Antiácaro", desc: "Tratamento que reduz alergias respiratórias" },
      { title: "Suporte cervical", desc: "Altura média ideal para coluna alinhada" },
      { title: "Costura quilt", desc: "Mantém o enchimento uniforme após muitas lavagens" },
      { title: "Padrão 50x70", desc: "Fronha tradicional brasileira encaixa perfeitamente" },
    ],
    closing: "Sono reparador começa com travesseiros à altura da sua noite.",
  },
  3: {
    headline: "MACIEZ E ABSORÇÃO DE LINHA HOTELEIRA",
    intro: "Jogo com 5 toalhas de banho em algodão egípcio fio penteado de 500g/m². Toque aveludado, secagem rápida e cores que não desbotam mesmo após inúmeras lavagens.",
    details: [
      { title: "Algodão egípcio", desc: "Fibra longa, mais resistente e macia" },
      { title: "Fio penteado 500g/m²", desc: "Densidade premium, alta absorção" },
      { title: "Não desbota", desc: "Tingimento reativo de longa durabilidade" },
      { title: "Secagem rápida", desc: "Permanece felpuda mesmo com uso diário" },
      { title: "Tamanho banho/banhão", desc: "Cobre o corpo com sobra" },
    ],
    closing: "Transforme o ritual de sair do banho em uma experiência verdadeiramente premium.",
  },
  4: {
    headline: "REFEIÇÕES PRÁTICAS, SAUDÁVEIS E DELICIOSAS",
    intro: "Air Fryer 5L com painel digital touch e 8 funções pré-definidas. Tecnologia Rapid Air para resultados crocantes por fora e suculentos por dentro, sem o uso de óleo.",
    details: [
      { title: "Capacidade 5 litros", desc: "Refeições para a família toda" },
      { title: "Painel touch digital", desc: "Controle preciso da temperatura e tempo" },
      { title: "8 programas", desc: "Frango, batata, peixe, carne, legumes, sobremesa e mais" },
      { title: "Tecnologia Rapid Air", desc: "Frita com ar quente, sem necessidade de óleo" },
      { title: "Cesto antiaderente", desc: "Fácil de limpar, livre de resíduos" },
    ],
    closing: "Cozinhar mais saudável nunca foi tão simples e prático.",
  },
  5: {
    headline: "POTÊNCIA QUE TRANSFORMA SEU DIA A DIA",
    intro: "Liquidificador profissional 1200W com jarra de vidro reforçado de 2L, 12 velocidades e lâminas de aço inox 6 pontas. Tritura gelo, frutas congeladas e prepara receitas com facilidade.",
    details: [
      { title: "Motor 1200W", desc: "Potência profissional para qualquer receita" },
      { title: "Jarra de vidro 2L", desc: "Resistente, não absorve odor nem cor" },
      { title: "12 velocidades + pulsar", desc: "Controle total da textura" },
      { title: "Lâminas inox 6 pontas", desc: "Tritura até gelo sem esforço" },
      { title: "Base antiderrapante", desc: "Estabilidade total na bancada" },
    ],
    closing: "Vitaminas, sopas, drinks e molhos com a textura perfeita em segundos.",
  },
  6: {
    headline: "O CAFÉ DA MANHÃ QUE VOCÊ MERECE",
    intro: "Cafeteira elétrica premium para 15 xícaras com painel digital, timer programável e função manter aquecido por até 2 horas. Filtro permanente que economiza e preserva o aroma.",
    details: [
      { title: "15 xícaras", desc: "Capacidade ideal para família e escritório" },
      { title: "Timer programável", desc: "Café pronto na hora que você acorda" },
      { title: "Filtro permanente", desc: "Economia e sabor preservado" },
      { title: "Manter aquecido", desc: "Café quente por até 2 horas" },
      { title: "Jarra de vidro", desc: "Com marcador de nível e alça ergonômica" },
    ],
    closing: "O ritual matinal perfeito começa com o aroma de café fresco em casa.",
  },
  7: {
    headline: "ORGANIZAÇÃO QUE VIROU TENDÊNCIA",
    intro: "Kit modular com 6 organizadores em bambu natural e plástico transparente livre de BPA. Empilháveis, herméticos e laváveis — sua despensa, talheres e temperos sempre em ordem.",
    details: [
      { title: "Bambu natural", desc: "Material renovável e visual sofisticado" },
      { title: "Livre de BPA", desc: "Seguro para alimentos" },
      { title: "Empilháveis", desc: "Aproveitam espaço vertical do armário" },
      { title: "Tampas herméticas", desc: "Mantêm os mantimentos frescos por mais tempo" },
      { title: "Sistema modular", desc: "Combine peças conforme sua necessidade" },
    ],
    closing: "Funcionalidade e design que transformam qualquer cozinha em ambiente de revista.",
  },
  8: {
    headline: "MESA POSTA COM ELEGÂNCIA EUROPEIA",
    intro: "Aparelho de jantar em porcelana fina com fio dourado, 30 peças que servem 6 pessoas. Inclui pratos rasos, fundos, sobremesa, xícaras com pires e bowls com acabamento sofisticado.",
    details: [
      { title: "Porcelana fina", desc: "Toque suave e brilho duradouro" },
      { title: "Fio dourado", desc: "Acabamento elegante feito à mão" },
      { title: "30 peças completas", desc: "Tudo para servir 6 pessoas" },
      { title: "Microondas e lava-louças", desc: "Praticidade no dia a dia" },
      { title: "Embalagem segura", desc: "Cada peça vem protegida individualmente" },
    ],
    closing: "Eleve qualquer refeição a um momento especial digno de celebração.",
  },
  9: {
    headline: "PERCAL 400 FIOS — O CONFORTO QUE VOCÊ MERECE",
    intro: "Jogo de lençol king com 4 peças em percal 400 fios, 100% algodão egípcio. Toque suave, caimento perfeito e durabilidade incomparável. Inclui lençol com elástico, superior e 2 fronhas.",
    details: [
      { title: "400 fios", desc: "Densidade premium para máximo conforto" },
      { title: "Algodão egípcio", desc: "Fibras longas, mais maciez e resistência" },
      { title: "Elástico reforçado", desc: "Não solta do colchão durante a noite" },
      { title: "Acabamento acetinado", desc: "Visual luxuoso e toque suave" },
      { title: "4 peças completas", desc: "Lençol elástico + superior + 2 fronhas" },
    ],
    closing: "Vista sua cama com o conforto de um hotel cinco estrelas todas as noites.",
  },
  10: {
    headline: "POTÊNCIA PROFISSIONAL NA SUA COZINHA",
    intro: "Batedeira planetária 1000W com tigela de aço inox 5L, 10 velocidades e 3 batedores (globo, gancho e pá). Ideal para massas leves, pesadas, claras em neve e suspiros.",
    details: [
      { title: "Motor 1000W", desc: "Potência para encarar qualquer massa" },
      { title: "Tigela inox 5L", desc: "Capacidade para receitas grandes" },
      { title: "Movimento planetário", desc: "Mistura uniforme em todos os pontos" },
      { title: "3 batedores inclusos", desc: "Globo, gancho e pá para cada receita" },
      { title: "Base antiderrapante", desc: "Não anda na bancada com vibração" },
    ],
    closing: "Da confeitaria caseira ao pão artesanal, sua cozinha em outro nível.",
  },
  11: {
    headline: "EDREDOM PREMIUM PARA NOITES INESQUECÍVEIS",
    intro: "Edredom king com enchimento em pluma de ganso naturale 600g/m², capa 100% algodão acetinado e costura matelassê. Conforto térmico premium para todas as estações.",
    details: [
      { title: "Pluma de ganso naturale", desc: "Leve e quentíssimo, conforto premium" },
      { title: "Capa de algodão acetinado", desc: "Visual luxuoso e toque sedoso" },
      { title: "Costura matelassê", desc: "Mantém o enchimento distribuído" },
      { title: "King size", desc: "Cobre cama king com folga" },
      { title: "Térmico em qualquer estação", desc: "Aquece sem sufocar" },
    ],
    closing: "O quarto principal merece o edredom que combina luxo e conforto verdadeiro.",
  },
  12: {
    headline: "CHÁS, CAFÉS E INFUSÕES NO PONTO CERTO",
    intro: "Chaleira elétrica em inox premium 1,7L com ajuste de temperatura variável (40°C a 100°C), desligamento automático e proteção contra superaquecimento. Ideal para cafés especiais e chás.",
    details: [
      { title: "Inox premium", desc: "Resistente, não enferruja, visual sofisticado" },
      { title: "Temperatura variável", desc: "Ponto exato para cada tipo de bebida" },
      { title: "Desligamento automático", desc: "Segurança total quando atinge a temperatura" },
      { title: "1,7 litros", desc: "Capacidade ideal para uso doméstico" },
      { title: "Aquecimento rápido", desc: "Água fervente em menos de 3 minutos" },
    ],
    closing: "A diferença entre uma bebida boa e extraordinária está no controle preciso da temperatura.",
  },
  13: {
    headline: "AROMATERAPIA QUE TRANSFORMA O AMBIENTE",
    intro: "Difusor ultrassônico com reservatório de 300ml, vaporização silenciosa, luz de ambiente em 7 cores e desligamento automático. Acabamento em cerâmica branca com detalhes em madeira natural.",
    details: [
      { title: "Ultrassônico silencioso", desc: "Ideal para uso noturno no quarto" },
      { title: "300ml de capacidade", desc: "Funciona a noite toda sem precisar reabastecer" },
      { title: "7 cores de luz ambiente", desc: "Crie atmosferas relaxantes" },
      { title: "Desligamento automático", desc: "Segurança quando a água acaba" },
      { title: "Acabamento premium", desc: "Cerâmica e madeira para decoração sofisticada" },
    ],
    closing: "Combine bem-estar e decoração em um único acessório indispensável.",
  },
  14: {
    headline: "DUPLA FACE SHERPA: PELE DE CARNEIRO QUE ABRAÇA",
    intro: "Edredom Coberdrom Queen Size com um lado em sherpa (pele de carneiro sintética) ultramacia e o outro em microfibra premium aveludada. Quentíssimo, encorpado e perfeito para os dias mais frios — disponível em 7 cores elegantes.",
    details: [
      { title: "Sherpa pele de carneiro", desc: "Toque idêntico à lã natural, super fofinho" },
      { title: "Dupla face", desc: "Microfibra aveludada do outro lado para variar o uso" },
      { title: "Tamanho Casal/Queen", desc: "2,20m x 2,40m, cobre cama queen com sobra" },
      { title: "Costura matelassê reforçada", desc: "Enchimento uniforme que não junta no canto" },
      { title: "Antialérgico", desc: "Fibras hipoalergênicas seguras para toda família" },
      { title: "7 cores disponíveis", desc: "Marrom, cinza, preto, vermelho, rosé, bege e azul marinho" },
    ],
    closing: "O calor de um abraço de pele de carneiro nas noites mais frias do ano — agora com a qualidade BellaCasa.",
  },
};

const ProductDescription = ({ productId }: ProductDescriptionProps) => {
  const product = products.find((p) => p.id === productId);
  const data = productHighlights[productId];

  if (!data) {
    if (!product) return null;
    return (
      <div className="mt-16 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            QUALIDADE PREMIUM PARA O SEU LAR
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {product.description}
          </p>
        </div>
        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Garantia BellaCasa de 30 dias
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Se o produto não corresponder ao esperado, você tem até <strong className="text-foreground">30 dias para trocar ou devolver sem burocracia</strong>. Confiamos na qualidade do que entregamos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{data.headline}</h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">{data.intro}</p>
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-8">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          5 DETALHES QUE FAZEM A DIFERENÇA
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.details.map((item, idx) => (
            <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
              <p className="font-bold text-foreground text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-6">
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          {data.closing}
        </p>
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">
          Garantia BellaCasa de 30 dias
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Se o produto não corresponder ao esperado, você tem até <strong className="text-foreground">30 dias para trocar ou devolver sem burocracia</strong>. Confiamos na qualidade do que entregamos.
        </p>
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h2 className="text-xl md:text-2xl font-bold text-foreground">Envio rápido com rastreio</h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
          Seu pedido é processado em até <strong className="text-foreground">24h úteis</strong> com rastreamento completo e nota fiscal eletrônica. Transparência e confiança do início ao fim.
        </p>
      </div>
    </div>
  );
};

export default ProductDescription;
