import camisaTricotInfo from "@/assets/products/camisa-tricot-3.jpg";
import camisaTricotInfo2 from "@/assets/products/camisa-tricot-5.jpg";
import camisaTricotMedidas from "@/assets/products/camisa-tricot-medidas.jpg";
import bermudaMonsterDesc1 from "@/assets/products/bermuda-monster-info-1.png";
import bermudaMonsterDesc2 from "@/assets/products/bermuda-monster-info-2.png";
import bermudaMonsterDesc3 from "@/assets/products/bermuda-monster-info-3.png";
import bermudaMonsterDesc4 from "@/assets/products/bermuda-monster-info-4.png";
import bermudaMonsterDesc5 from "@/assets/products/bermuda-monster-info-5.png";
import kitBarbariusMidtownDesc1 from "@/assets/products/kit-bodyman-barbarius-midtown-1.png";
import kitBarbariusMidtownDesc2 from "@/assets/products/kit-bodyman-barbarius-midtown-2.png";
import kitBarbariusMidtownDesc3 from "@/assets/products/kit-bodyman-barbarius-midtown-3.png";
import kitBarbariusMidtownDesc4 from "@/assets/products/kit-bodyman-barbarius-midtown-4.png";
import kitBarbariusMidtownDesc5 from "@/assets/products/kit-bodyman-barbarius-midtown-5.png";
import bodySplashBarbariusSoloDesc1 from "@/assets/products/body-splash-barbarius-solo-1.png";
import bodySplashBarbariusSoloDesc2 from "@/assets/products/body-splash-barbarius-solo-2.png";
import bodySplashBarbariusSoloDesc3 from "@/assets/products/body-splash-barbarius-solo-3.png";
import bodySplashBarbariusSoloDesc4 from "@/assets/products/body-splash-barbarius-solo-4.png";
import bodySplashBarboursTrioDesc from "@/assets/products/body-splash-barbours-trio.png";
import bodySplashBarboursSeductionCenaDesc from "@/assets/products/body-splash-barbours-seduction-cena.png";
import bodySplashBarboursSeductionNotesDesc from "@/assets/products/body-splash-barbours-seduction-notes.png";
import bodySplashBarboursBoldCenaDesc from "@/assets/products/body-splash-barbours-bold-cena.png";
import bodySplashBarboursBoldNotesDesc from "@/assets/products/body-splash-barbours-bold-notes.png";
import bodySplashBarboursOceanNotesDesc from "@/assets/products/body-splash-barbours-ocean-notes.png";
import bodySplashBarboursCrueltyFreeDesc from "@/assets/products/body-splash-barbours-cruelty-free.png";
import techDailyInfoDesc from "@/assets/products/tech-daily-info.png";
import techDailyComposicaoDesc from "@/assets/products/tech-daily-composicao.png";
import techDailyPretoDesc from "@/assets/products/tech-daily-preto-1.png";

interface ProductDescriptionProps {
  productId: number;
}

const ProductDescription = ({ productId }: ProductDescriptionProps) => {
  if (productId === 34) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ESTILO E CONFORTO EM UMA ÚNICA PEÇA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">A camisa tricot texturizada</strong> que está dominando o guarda-roupa masculino. Listras verticais que <strong className="text-foreground">valorizam o peitoral</strong>, malha premium fresca e o caimento perfeito que <strong className="text-foreground">se molda no corpo sem apertar</strong>. Uma peça versátil que serve do trabalho ao happy hour.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={camisaTricotInfo} alt="Detalhes da camisa tricot" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            5 DETALHES QUE FAZEM A DIFERENÇA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Gola Canelada", desc: "Firme, não cede com o uso e mantém o caimento" },
              { title: "Detalhes que valorizam o peitoral", desc: "Listras verticais texturizadas dão volume e estilo" },
              { title: "Malha fresca e confortável", desc: "Tecido respirável ideal para qualquer estação" },
              { title: "Manga e barra com elástico", desc: "Ajuste perfeito que não enrola nem cede" },
              { title: "Excelente caimento", desc: "Modelagem que se molda no corpo sem apertar" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img src={camisaTricotInfo2} alt="Caimento da camisa tricot" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            VERSÁTIL, ESTILOSA E SUPER CONFORTÁVEL
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Combina com tudo:</strong> jeans, calça social, bermuda ou alfaiataria. Use no trabalho, em encontros ou no dia a dia — a camisa tricot é a peça curinga que faltava no seu armário, com <strong className="text-foreground">malha premium</strong> que mantém o formato lavagem após lavagem.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={camisaTricotMedidas} alt="Tabela de medidas" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>
      </div>
    );
  }

  if (productId === 1) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ESSE É O TIPO DE CAMISA QUE VAI TE LEVAR AO LIMITE
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Essa camisa não é só peças, é um investimento certo.</strong> Feita com{" "}
            <strong className="text-foreground">95% algodão</strong> e{" "}
            <strong className="text-foreground">5% elastano</strong>, ela{" "}
            <strong className="text-foreground">suporta o calor, o suor e os dias longos sem perder forma</strong>. A microtextura geométrica{" "}
            <strong className="text-foreground">evita riscos com uso diário</strong>. O design com botões frontais{" "}
            <strong className="text-foreground">garante segurança e durabilidade</strong>. É a camisa de quem sabe que o tempo é dinheiro e não quer ser enganado pelo barato.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0953/8774/6599/files/GIF1-ezgif.com-video-to-webp-converter_3.webp?v=1762671199"
            alt="Demonstração da camisa polo"
            className="w-full max-w-lg rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            QUALIDADE SEM MÁSCARA – 5 DETALHES QUE VÃO TE SURPREENDER
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "95% Algodão + 5% Elastano", desc: "Resistência sem perder conforto" },
              { title: "Microtextura geométrica", desc: "Proteção contra riscos e desgaste" },
              { title: "Botões frontais duradouros", desc: "Ideal para uso intensivo sem falhas" },
              { title: "Fecho firme e ajustável", desc: "Perfeito para todos os tipos de corpo" },
              { title: "Estrutura resistente ao calor e suor", desc: "Vai além do dia a dia" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0953/8774/6599/files/GIF2-ezgif.com-video-to-webp-converter_31.webp?v=1762671199"
            alt="Detalhes da qualidade da camisa"
            className="w-full max-w-lg rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            REGULAÇÃO TÉRMICA QUE NÃO FAZ VOCÊ SUAR
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">O algodão natural</strong>{" "}
            <strong className="text-foreground">permite o fluxo de ar que mantém você fresco sem precisar esconder o calor</strong>. Isso é essencial para quem enfrenta o sol, o calor e o esforço intenso do dia a dia. A camisa também tem a habilidade de{" "}
            <strong className="text-foreground">controlar o odor</strong> com a fibra que libera menos suor. Tudo isso sem o uso de produtos químicos – só a essência do material.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            MUITO MAIS QUE UMA CAMISA, É UMA PRESENÇA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Quem usa é quem entende:</strong> essa camisa é feita para quem{" "}
            <strong className="text-foreground">vive com autoridade</strong>, para quem está sempre no lugar certo e com o visual que dá conta de tudo. É o tipo de peça que ninguém mais vai querer comparar – porque ela só tem uma. Aquele produto que{" "}
            <strong className="text-foreground">faz você se sentir melhor só de colocar</strong>. Não é só uma peça, é uma{" "}
            <strong className="text-foreground">declaração de estilo</strong> que não se deixa levar pelo tempo.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ESTOQUE LIMITADO – QUANDO ACABAR, NÃO VOLTA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Este produto está em produção, e os primeiros lotes já estão se esgotando.</strong> Se você quer{" "}
            <strong className="text-foreground">uma camisa com qualidade real</strong>, com estrutura que{" "}
            <strong className="text-foreground">vai além da moda</strong>, é o momento de agir. Não é só peça, é{" "}
            <strong className="text-foreground">uma escolha certeira</strong> para quem entende do que é durável. Com isso,{" "}
            <strong className="text-foreground">você não é apenas comprador – é um membro de um grupo especial</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 2) {
    return (
      <div className="mt-16 space-y-12">
        {/* Description images from Montarezzi */}
        <div className="flex flex-col items-center gap-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Kit com 4 Calças Masculinas Jeans com Elastano
            </h2>
            <p className="text-lg md:text-xl font-semibold text-foreground italic">
              4 calças que vestem bem, duram mais e combinam com tudo.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Do toque ao caimento, você sente que essa calça foi feita com mais cuidado, mais qualidade e mais presença. Aqui, você encontra calças que entregam{" "}
              <strong className="text-foreground">elegância, conforto e durabilidade</strong> de verdade.
            </p>
          </div>

          <img
            src="/lovable-uploads/fc6e8747-79ae-4fe2-882d-be19eecfe2ec.png"
            alt="Kit 4 Calças Jeans - Detalhes do tecido"
            className="w-full max-w-2xl rounded-lg"
            loading="lazy"
          />

          <div className="text-center max-w-3xl mx-auto space-y-4">
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              Confeccionadas com tecido de algodão (<strong className="text-foreground">tecido denim</strong>) de alta qualidade (<strong className="text-foreground">96% algodão + 4% elastano</strong>), essas calças têm toque macio, leve elasticidade e acabamento premium. A modelagem reta com pernas soltas valoriza o corpo sem apertar e permite liberdade total nos movimentos.
            </p>
          </div>

          <img
            src="/lovable-uploads/2feea69e-56fe-4cb5-a103-b2ebdb866885.jpg"
            alt="Kit 4 Calças Jeans - Caimento"
            className="w-full max-w-2xl rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Section 2 - Quality Details */}
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POR QUE ESSE KIT É UM INVESTIMENTO NO SEU ESTILO E CONFORTO?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Tecido denim premium", desc: "Toque suave, estrutura elegante e resistência ao uso diário" },
              { title: "96% algodão, 4% elastano", desc: "Respirável, confortável e com flexibilidade na medida" },
              { title: "Modelagem reta moderna", desc: "Caimento limpo, sem sobras, sem apertos — visual alinhado" },
              { title: "Costura reforçada", desc: "Pensadas para durar, sem desgaste visual ou deformação" },
              { title: "Detalhes que fazem diferença", desc: "Bolsos funcionais, cós com passantes — prontos pro cinto ou look clean" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="/lovable-uploads/d7fb7a93-d43b-4d84-8bbf-7bbdef563ebb.jpg"
            alt="Kit 4 Calças Jeans - Acabamento"
            className="w-full max-w-2xl rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Section 3 */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Vista-se bem, com praticidade, sem precisar pensar muito. Essas calças te deixam pronto pro trabalho, pro encontro, pro evento — ou pra qualquer situação onde{" "}
            <strong className="text-foreground">aparência e conforto contam</strong>.
          </p>
          <p className="text-sm md:text-base text-foreground font-semibold">
            Com esse kit, você tem peças de verdade. Feitas pra durar.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0854/1808/2338/files/br-11134207-81z1k-mfnvw67n0yyo6b_resize_w450_nl.webp?v=1768354170"
            alt="Kit 4 Calças Jeans - Modelo vestindo"
            className="w-full max-w-md rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Guarantee */}
        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Garantia de 30 dias – Compra segura, sem risco.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Se não servir ou não for o que esperava, você tem até <strong className="text-foreground">30 dias para trocar ou devolver sem burocracia</strong>. A gente confia na qualidade e entrega o que promete.
          </p>
        </div>

        {/* Shipping */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Envio rápido - Entrega Garantida.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Seu pedido é processado em até <strong className="text-foreground">24h úteis</strong> com rastreamento completo e emissão de <strong className="text-foreground">nota fiscal eletrônica</strong>. Transparência e confiança do início ao fim.
          </p>
          <p className="text-base md:text-lg font-bold text-foreground mt-4">
            Garanta agora seu Kit com 4 Calças Jeans com Elastano e descubra como é fácil se vestir bem, com elegância e conforto real.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 3) {
    return (
      <div className="mt-16 space-y-16">
        {/* Description image from the reference site */}
        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0714/2191/9404/files/b1404f0c43ee6e174c47b6106ed07e6a.png?v=1765502408"
            alt="Camisa Nautilus - Descrição"
            className="w-full max-w-2xl rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            CLASSE E SOFISTICAÇÃO EM CADA DETALHE
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">A Camisa Nautilus não é apenas uma peça de roupa, é uma declaração de estilo.</strong> Feita com{" "}
            <strong className="text-foreground">algodão e poliéster de alta qualidade</strong>, ela oferece{" "}
            <strong className="text-foreground">conforto térmico e durabilidade incomparável</strong>. O tecido macio e respirável garante que você se sinta bem o dia inteiro, seja no trabalho, em um encontro casual ou em uma ocasião especial.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            5 MOTIVOS PARA ESCOLHER A NAUTILUS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Algodão + Poliéster Premium", desc: "Combinação perfeita de conforto e resistência" },
              { title: "Design Sofisticado", desc: "Visual elegante que se adapta a qualquer ocasião" },
              { title: "Leve 5 Pague 3", desc: "Economia real sem abrir mão da qualidade" },
              { title: "Tecido Respirável", desc: "Conforto térmico para o dia inteiro" },
              { title: "Acabamento Impecável", desc: "Costuras reforçadas e detalhes refinados" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            CONFORTO QUE VAI ALÉM DO VISUAL
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">O algodão garante a maciez</strong> enquanto o{" "}
            <strong className="text-foreground">poliéster adiciona durabilidade e resistência</strong>. A camisa não amassa facilmente, mantém sua forma após lavagens e{" "}
            <strong className="text-foreground">seca rapidamente</strong>. Ideal para quem tem um dia a dia corrido e precisa estar sempre impecável.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            VERSATILIDADE PARA TODAS AS OCASIÕES
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Do escritório ao happy hour</strong>, a Nautilus acompanha você em todos os momentos. Seu{" "}
            <strong className="text-foreground">design clássico e atemporal</strong> combina com calças sociais, jeans e bermudas. É a camisa que{" "}
            <strong className="text-foreground">todo homem precisa ter no guarda-roupa</strong>.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            PROMOÇÃO LEVE 5 PAGUE 3 – POR TEMPO LIMITADO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Essa oferta é exclusiva e por tempo limitado.</strong> São{" "}
            <strong className="text-foreground">5 camisas pelo preço de 3</strong>, com{" "}
            <strong className="text-foreground">frete grátis</strong> e entrega rápida. Renove seu guarda-roupa com{" "}
            <strong className="text-foreground">qualidade premium</strong> pagando muito menos. Quando o estoque acabar,{" "}
            <strong className="text-foreground">não sabemos quando volta</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 4) {
    return (
      <div className="mt-16 space-y-16">
        {/* Section 1 */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ARMADURA EM SARJA PESADA DE RESPEITO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Essa Vulcan é bruta demais, feita com sarja pesada de 320g/m² que não rasga nem no dente.</strong> Com{" "}
            <strong className="text-foreground">80% de algodão puro e 20% de poliéster de alta tenacidade</strong>, ela aguenta o tranco{" "}
            <strong className="text-foreground">do trabalho pesado até o churrasco de domingo.</strong> O tecido{" "}
            <strong className="text-foreground">é invencível contra furos</strong> e{" "}
            <strong className="text-foreground">honra o macho.</strong>
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0697/5098/0710/files/Whisk_cc7e2c7f7e845f68ed944551eee3c4b3dr.jpg?v=1770555724"
            alt="Calça Tática Vulcan - Demonstração"
            className="w-full max-w-lg rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Section 2 - Features */}
        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            QUALIDADES DE QUEM NÃO ACEITA PORCARIA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Sistema de 8 bolsos táticos", desc: "Blindados e extremamente reforçados" },
              { title: "Botões de pressão em níquel", desc: "Envelhecido que não quebram nunca" },
              { title: "Sarja de alta densidade", desc: "80% algodão puro e 20% de poliéster" },
              { title: "Cintura mista elástica", desc: "Conforto total e ajuste de patrão" },
              { title: "Costura dupla reforçada", desc: "Poliéster 40 de alta tenacidade indestrutível" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0697/5098/0710/files/Gemini_Generated_Image_edju2qedju2qedju.webp?v=1770555905"
            alt="Calça Tática Vulcan - Detalhes"
            className="w-full max-w-lg rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Section 3 */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            LIBERDADE TOTAL PRA QUEM MANDA NO JOGO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Chega de usar calça apertada que incomoda o dia todo.</strong> A Vulcan tem{" "}
            <strong className="text-foreground">modelagem Tapered</strong>, garantindo{" "}
            <strong className="text-foreground">liberdade total nas coxas.</strong> O{" "}
            <strong className="text-foreground">cordão selado e o elástico lateral</strong> garantem que ela{" "}
            <strong className="text-foreground">fique firme no lugar</strong>, não importa o movimento.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0697/5098/0710/files/Whisk_2165047b51542259aee440d1ae307361dr.jpg?v=1770555724"
            alt="Calça Tática Vulcan - Liberdade de movimento"
            className="w-full max-w-lg rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Section 4 */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ARMAZENAMENTO TÁTICO SEM FRESCURA NENHUMA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Você terá 8 bolsos à disposição pra sumir com qualquer coisa.</strong> Os{" "}
            <strong className="text-foreground">bolsos cargo laterais com botões metálicos</strong> protegem seu celular e carteira{" "}
            <strong className="text-foreground">contra qualquer queda ou espertinho.</strong> Tem até{" "}
            <strong className="text-foreground">bolso pra canivete com reforço na borda.</strong> É utilidade{" "}
            <strong className="text-foreground">bruta real pra quem manda de verdade.</strong>
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0697/5098/0710/files/Whisk_2853385f7297553a8274b782c493eb90dr.jpg?v=1770555724"
            alt="Calça Tática Vulcan - Bolsos táticos"
            className="w-full max-w-lg rounded-lg"
            loading="lazy"
          />
        </div>

        {/* Section 5 */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            O IMPACTO BRUTO QUE DEIXA ELAS LOUCAS
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Essa calça impõe respeito imediato onde você pisa.</strong> Quando você chega{" "}
            <strong className="text-foreground">bem vestido e com essa pegada tática</strong>, sua{" "}
            <strong className="text-foreground">mulher vai ficar louca com a sua postura de macho.</strong> Ela{" "}
            <strong className="text-foreground">valoriza o corpo sem frescura</strong>, deixando você com cara de{" "}
            <strong className="text-foreground">homem de alto valor e pegada bruta agora mesmo.</strong>
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0697/5098/0710/files/Copia_de_Garantia_Masculino_22.webp?v=1770556147"
            alt="Calça Tática Vulcan - Garantia"
            className="w-full max-w-lg rounded-lg"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  if (productId === 10) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Conheça o Kit 2 Tênis Slip-On Masculino Casual em Material de Couro Resistente
          </h2>
        </div>

        <div className="flex justify-center">
          <img
            src="https://www.usevyron.com/assets/tabela-medidas-tenis-CLLic2YF.jpeg"
            alt="Tabela de Medidas - Kit 2 Tênis Slip-On"
            className="w-full max-w-2xl rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            CONFORTO E ESTILO QUE IMPRESSIONAM
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">O Kit 2 Tênis Slip-On é a escolha perfeita para quem busca praticidade sem abrir mão do estilo.</strong> Feito com{" "}
            <strong className="text-foreground">material de couro resistente</strong>, oferece{" "}
            <strong className="text-foreground">durabilidade e conforto</strong> para o uso diário. O design slip-on facilita o calçar e descalçar, ideal para o dia a dia corrido.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POR QUE ESCOLHER O KIT 2 TÊNIS SLIP-ON?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Material de Couro Resistente", desc: "Durabilidade e elegância em cada passo" },
              { title: "Design Slip-On Prático", desc: "Fácil de calçar, sem complicação" },
              { title: "Solado Firme e Antiderrapante", desc: "Segurança e estabilidade no dia a dia" },
              { title: "Kit com 2 Pares", desc: "Economia real com variedade de cores" },
              { title: "Leve e Confortável", desc: "Perfeito para longas jornadas sem cansar" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            VERSATILIDADE PARA TODAS AS OCASIÕES
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Do trabalho ao lazer</strong>, o Tênis Slip-On combina com{" "}
            <strong className="text-foreground">calças jeans, chinos, bermudas e até looks sociais</strong>. Seu design{" "}
            <strong className="text-foreground">clean e moderno</strong> garante que você esteja sempre bem vestido, sem esforço.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            OFERTA ESPECIAL – KIT COM 2 PARES
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Leve 2 pares pelo preço de 1!</strong> Com{" "}
            <strong className="text-foreground">48% de desconto</strong> e{" "}
            <strong className="text-foreground">frete grátis</strong> para todo o Brasil. Essa oferta é{" "}
            <strong className="text-foreground">por tempo limitado</strong> e quando o estoque acabar,{" "}
            <strong className="text-foreground">não sabemos quando volta</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 13) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Conheça o Kit 4 Short Masculino Linho Bermuda Confortavél Verão Praia Festa
          </h2>
        </div>

        <div className="text-center max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Qualidade Premium", desc: "Materiais selecionados para garantir conforto e durabilidade no dia a dia." },
              { title: "Conforto Garantido", desc: "Design pensado para proporcionar o máximo de conforto em qualquer ocasião." },
              { title: "Acabamento Impecável", desc: "Costuras reforçadas e acabamento de alta qualidade em cada detalhe." },
              { title: "Excelente Custo-Benefício", desc: "Produto premium com preço justo e entrega para todo o Brasil." },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h3 className="text-xl md:text-2xl font-bold text-foreground">Detalhes do Produto</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "https://cxnhzuxnbgirpmhjzoxi.supabase.co/storage/v1/object/public/product-images/18567334-fef3-4d51-a427-a06c81e59baf/1771551015849-0.png?width=400&quality=75",
              "https://cxnhzuxnbgirpmhjzoxi.supabase.co/storage/v1/object/public/product-images/18567334-fef3-4d51-a427-a06c81e59baf/1771551017467-1.webp?width=400&quality=75",
              "https://cxnhzuxnbgirpmhjzoxi.supabase.co/storage/v1/object/public/product-images/18567334-fef3-4d51-a427-a06c81e59baf/1771551017958-2.png?width=400&quality=75",
              "https://cxnhzuxnbgirpmhjzoxi.supabase.co/storage/v1/object/public/product-images/18567334-fef3-4d51-a427-a06c81e59baf/1771551019016-3.webp?width=400&quality=75",
              "https://cxnhzuxnbgirpmhjzoxi.supabase.co/storage/v1/object/public/product-images/18567334-fef3-4d51-a427-a06c81e59baf/1771551019490-4.png?width=400&quality=75",
              "https://cxnhzuxnbgirpmhjzoxi.supabase.co/storage/v1/object/public/product-images/18567334-fef3-4d51-a427-a06c81e59baf/1771551020493-5.webp?width=400&quality=75",
            ].map((src, idx) => (
              <img key={idx} src={src} alt={`Short Linho - detalhe ${idx + 1}`} className="w-full rounded-lg" loading="lazy" />
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Por que escolher o Kit 4 Short Masculino Linho?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Qualidade Superior", desc: "Feito com materiais de primeira linha." },
              { title: "Durabilidade", desc: "Resistente ao uso diário e lavagens." },
              { title: "Satisfação Garantida", desc: "Milhares de clientes satisfeitos." },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            OFERTA ESPECIAL – 56% DE DESCONTO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Kit com 4 shorts de linho pelo preço de 1!</strong> Com{" "}
            <strong className="text-foreground">frete grátis</strong> para todo o Brasil e{" "}
            <strong className="text-foreground">5% de desconto extra no PIX</strong>. Parcele em até{" "}
            <strong className="text-foreground">5x sem juros</strong>. Essa oferta é{" "}
            <strong className="text-foreground">por tempo limitado</strong> – quando o estoque acabar,{" "}
            <strong className="text-foreground">não sabemos quando volta</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 15) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            CONFORTO QUE EMPODERA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">A calça que você coloca e instantaneamente se sente melhor.</strong>{" "}
            Abraça seu corpo, <strong className="text-foreground">valoriza sem marcar</strong> e transforma seu dia em{" "}
            <strong className="text-foreground">elegância descomplicada</strong>. Feita em Malha Seda Gelo com toque macio e gelado que{" "}
            <strong className="text-foreground">se ajusta ao corpo sem apertar</strong>.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://img.lpqvstatic.com/5ZdPu80Jtyk4NywZsliUnNItUsw=/filters:upscale()/https://app.lpqv.com.br/uploads/shoppreemium/editor/db840e71a6dfe98c3cf84bcca4a2fb73.webp"
            alt="Calça Ariel - Design Atemporal"
            className="w-full max-w-2xl rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            TRANSFORMAÇÃO QUE VOCÊ MERECE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Tecido Malha Seda Gelada", desc: "Toque macio e gelado, se ajusta ao corpo sem apertar e não marca" },
              { title: "Alta Elasticidade e Conforto", desc: "Se adapta aos movimentos, não limita e não aperta" },
              { title: "Cós Alto Modelador", desc: "Valoriza a silhueta, ajusta na cintura e proporciona segurança" },
              { title: "Durabilidade Premium", desc: "Não desbota, não cria bolinhas e mantém a aparência nova" },
              { title: "Versatilidade Inteligente", desc: "Combina com tudo — do casual ao sofisticado" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="https://img.lpqvstatic.com/q_m77XZoAAFzfJTaqWiW9TM7E0I=/filters:upscale()/https://app.lpqv.com.br/uploads/shoppreemium/editor/fa4ff582aed000116ca9ff8ca02bb1aa.png"
            alt="Calça Ariel - Detalhes do tecido"
            className="w-full max-w-2xl rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            TABELA DE MEDIDAS
          </h2>
          <div className="flex justify-center">
            <img
              src="https://img.lpqvstatic.com/UcGVywDXf3fN_iFWcYrrie5G4C0=/filters:upscale()/https://app.lpqv.com.br/uploads/shoppreemium/editor/86fe0f59ceee40c4a54ec67f324f6cba.png"
              alt="Tabela de Medidas - Calça Ariel"
              className="w-full max-w-2xl rounded-lg"
              loading="lazy"
            />
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            LEVE 3 PAGUE 2 – OFERTA POR TEMPO LIMITADO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Essa oferta é exclusiva e por tempo limitado.</strong> São{" "}
            <strong className="text-foreground">3 calças pelo preço de 2</strong>, com{" "}
            <strong className="text-foreground">frete grátis</strong> e entrega rápida para todo o Brasil.{" "}
            <strong className="text-foreground">Quando o estoque acabar, não sabemos quando volta.</strong>
          </p>
        </div>
      </div>
    );
  }


  if (productId === 18) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Kit com 4 Calças Masculinas Reta em Sarja
          </h2>
          <p className="text-lg md:text-xl font-semibold text-foreground italic">
            4 calças que vestem bem, duram mais e combinam com tudo.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Do toque ao caimento, você sente que essa calça foi feita com mais cuidado, mais qualidade e mais presença. Aqui, você encontra calças que entregam{" "}
            <strong className="text-foreground">elegância, conforto e durabilidade</strong> de verdade.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0628/7363/2877/files/2_2e1b843a-df6c-4c1a-8d68-b8f372dd630a.png?v=1748263769"
            alt="Kit 4 Calças Sarja - Detalhes do tecido"
            className="w-full max-w-2xl rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Confeccionadas com <strong className="text-foreground">sarja texturizada de alta qualidade</strong> (<strong className="text-foreground">96% algodão + 4% elastano</strong>), essas calças têm toque macio, leve elasticidade e acabamento premium. A modelagem reta com pernas soltas valoriza o corpo sem apertar e permite liberdade total nos movimentos.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POR QUE ESSE KIT É UM INVESTIMENTO NO SEU ESTILO E CONFORTO?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Tecido sarja texturizada premium", desc: "Toque suave, estrutura elegante e resistência ao uso diário" },
              { title: "96% algodão, 4% elastano", desc: "Respirável, confortável e com flexibilidade na medida" },
              { title: "Modelagem reta moderna", desc: "Caimento limpo, sem sobras, sem apertos — visual alinhado" },
              { title: "Cores versáteis e masculinas", desc: "Caqui, verde, preto e cinza escuro — combinações que funcionam em qualquer ocasião" },
              { title: "Costura reforçada", desc: "Pensadas para durar, sem desgaste visual ou deformação com o tempo" },
              { title: "Detalhes que fazem diferença", desc: "Bolsos laterais funcionais, bolsos embutidos atrás e cós com passantes" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Vista-se bem, com praticidade, sem precisar pensar muito. Essas calças te deixam pronto pro trabalho, pro encontro, pro evento — ou pra qualquer situação onde{" "}
            <strong className="text-foreground">aparência e conforto contam</strong>.
          </p>
          <p className="text-sm md:text-base text-foreground font-semibold">
            Com esse kit, você tem peças de verdade. Feitas pra durar.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Garantia de 30 dias – Compra segura, sem risco.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Se não servir ou não for o que esperava, você tem até <strong className="text-foreground">30 dias para trocar ou devolver sem burocracia</strong>. A gente confia na qualidade e entrega o que promete.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Envio rápido - Entrega Garantida.
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Seu pedido é processado em até <strong className="text-foreground">24h úteis</strong> com rastreamento completo e emissão de <strong className="text-foreground">nota fiscal eletrônica</strong>. Transparência e confiança do início ao fim.
          </p>
          <p className="text-base md:text-lg font-bold text-foreground mt-4">
            Garanta agora seu Kit com 4 Calças em Sarja e descubra como é fácil se vestir bem, com elegância e conforto real.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 17) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            TREINE COM MAIS CONFORTO, SEGURANÇA E DESEMPENHO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            O <strong className="text-foreground">KongFit Pro</strong> combina{" "}
            <strong className="text-foreground">compressão interna</strong>, bolso anti-queda para celular e suporte para toalha em uma única peça. Shorts pensado para quem leva treino a sério.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="https://cdn.shopify.com/s/files/1/0733/8216/6760/files/2_gif_no_hack.gif?v=1771125681"
            alt="KongFit Pro em ação"
            className="w-full max-w-lg rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <img
              src="https://cdn.shopify.com/s/files/1/0733/8216/6760/files/2_GIF_BOLSO_INTERNO.gif?v=1771125878"
              alt="Bolso interno anti-queda"
              className="w-full rounded-lg"
              loading="lazy"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-xl font-bold text-foreground">Bolso Interno Anti-Queda</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O celular fica firme, junto ao corpo e sem balançar mesmo em treinos intensos.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Não marca</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Não incomoda</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Não corre risco de cair</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center space-y-4">
            <h3 className="text-xl font-bold text-foreground">Camada Interna de Compressão</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Mais conforto durante o treino e ZERO desconforto depois do treino.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Dispensa o uso de cueca</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Mais firmeza e suporte muscular</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Reduz atrito entre as pernas</li>
              <li className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Evita assaduras no pós-treino</li>
            </ul>
          </div>
          <div className="space-y-4">
            <img
              src="https://cdn.shopify.com/s/files/1/0733/8216/6760/files/bolso_1.gif?v=1771125852"
              alt="Camada interna de compressão"
              className="w-full rounded-lg"
              loading="lazy"
            />
          </div>
        </div>

        <div className="bg-secondary/50 rounded-xl p-6 md:p-10">
          <h3 className="text-xl font-bold text-foreground text-center mb-6">KongFit Pro vs. Short Tradicional</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-foreground font-semibold">Recurso</th>
                  <th className="text-center py-3 px-4 text-foreground font-semibold">KongFit Pro</th>
                  <th className="text-center py-3 px-4 text-muted-foreground font-semibold">Short Tradicional</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border/50"><td className="py-3 px-4">Substitui a cueca</td><td className="text-center text-emerald-500">✓</td><td className="text-center text-destructive">✕</td></tr>
                <tr className="border-b border-border/50"><td className="py-3 px-4">Anti-assaduras</td><td className="text-center text-emerald-500">✓</td><td className="text-center text-destructive">✕</td></tr>
                <tr className="border-b border-border/50"><td className="py-3 px-4">Bolso para celular</td><td className="text-center text-emerald-500">✓</td><td className="text-center text-destructive">✕</td></tr>
                <tr className="border-b border-border/50"><td className="py-3 px-4">Suporte para toalha</td><td className="text-center text-emerald-500">✓</td><td className="text-center text-destructive">✕</td></tr>
                <tr className="border-b border-border/50"><td className="py-3 px-4">Firmeza no treino</td><td className="text-center text-emerald-500">✓</td><td className="text-center text-destructive">✕</td></tr>
                <tr><td className="py-3 px-4">Durabilidade</td><td className="text-center text-emerald-500">✓</td><td className="text-center text-destructive">✕</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  if (productId === 19) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            TECNOLOGIA DRYFIT QUE ACOMPANHA SEU RITMO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Esqueça calças que esquentam, pesam e incomodam.</strong> Essas joggers são feitas com{" "}
            <strong className="text-foreground">tactel premium com tecnologia DryFit e elastano</strong>, proporcionando um{" "}
            <strong className="text-foreground">toque ultra-leve, ventilação constante e secagem até 3x mais rápida</strong> que tecidos convencionais. Do treino pesado ao sofá de casa, elas se adaptam ao seu corpo e ao seu momento.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POR QUE ESSE KIT VAI MUDAR SEU GUARDA-ROUPA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Tactel DryFit Premium", desc: "Tecido tecnológico que evapora o suor e mantém o corpo fresco" },
              { title: "Elastano integrado", desc: "Flexibilidade total nos movimentos, sem apertar e sem deformar" },
              { title: "Secagem ultra-rápida", desc: "Ideal pra treino, corrida ou dias chuvosos — seca em minutos" },
              { title: "Punho elástico na barra", desc: "Visual jogger moderno com ajuste perfeito no tornozelo" },
              { title: "Cós com cordão ajustável", desc: "Conforto personalizado para qualquer tipo de corpo" },
              { title: "4 cores versáteis", desc: "Preto, cinza, azul marinho e caqui — combinam com tudo" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            LEVEZA QUE VOCÊ SENTE NA PELE
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">O tactel DryFit é o tecido preferido de quem treina e de quem busca conforto real.</strong> Ele{" "}
            <strong className="text-foreground">não retém umidade</strong>, não gruda no corpo e{" "}
            <strong className="text-foreground">regula a temperatura naturalmente</strong>. Resultado: você fica seco, fresco e confortável do início ao fim do dia — sem aquela sensação pesada de calças tradicionais.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            DO TREINO AO ROLÊ — VERSATILIDADE TOTAL
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Academia, corrida, home office, viagem ou lazer</strong> — essas calças jogger servem pra tudo. O{" "}
            <strong className="text-foreground">design slim moderno com punho na barra</strong> dá um visual estiloso que funciona tanto no treino quanto no dia a dia. Com{" "}
            <strong className="text-foreground">bolsos laterais funcionais</strong> e{" "}
            <strong className="text-foreground">cós ajustável com cordão</strong>, você tem praticidade e conforto em uma única peça.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            KIT COM 4 CALÇAS — OFERTA QUE NÃO VOLTA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">4 calças jogger DryFit por menos de R$ 80.</strong> Isso é menos de{" "}
            <strong className="text-foreground">R$ 20 por calça</strong>. Com{" "}
            <strong className="text-foreground">frete grátis</strong> e entrega rápida, essa é a oportunidade perfeita pra renovar seu guarda-roupa com{" "}
            <strong className="text-foreground">peças tecnológicas de alta performance</strong>. Estoque limitado — quando acabar,{" "}
            <strong className="text-foreground">não sabemos quando volta</strong>.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Garantia de 30 dias – Compra 100% segura
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Se não servir ou não gostar, você tem até <strong className="text-foreground">30 dias para trocar ou devolver sem complicação</strong>. Pedido processado em até <strong className="text-foreground">24h úteis</strong> com rastreamento completo e <strong className="text-foreground">nota fiscal eletrônica</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 20) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            CONFORTO DE VERDADE — SEM PUNHO, SEM APERTO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Chega de calças que apertam, esquentam e incomodam.</strong> As Calças Jogger Sem Punho em Poliamida foram feitas com{" "}
            <strong className="text-foreground">75% poliamida + 25% elastano</strong> — um tecido que{" "}
            <strong className="text-foreground">não esquenta, não retém suor e acompanha seus movimentos sem deformar</strong>. A barra sem punho garante um caimento solto e elegante que funciona tanto no treino quanto no dia a dia.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            DETALHES QUE FAZEM A DIFERENÇA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Bolsos laterais com zíper</strong> para guardar celular, chaves e carteira com segurança.{" "}
            <strong className="text-foreground">Cós com elástico e cordão ajustável</strong> que se adapta perfeitamente ao seu corpo.{" "}
            <strong className="text-foreground">Secagem rápida</strong> — ideal para quem treina e precisa de praticidade. Tudo isso com um{" "}
            <strong className="text-foreground">visual slim fitness premium</strong> que valoriza o corpo sem apertar.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ACADEMIA, CORRIDA OU LAZER — ELA SERVE PRA TUDO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Versátil de verdade.</strong> Use na academia, na corrida, no trabalho ou no rolê. O{" "}
            <strong className="text-foreground">design esportivo slim</strong> combina com tênis, chinelo ou sapatênis. Com{" "}
            <strong className="text-foreground">3 cores versáteis</strong> (azul marinho, preto e cinza), você monta looks completos pra semana inteira sem repetir.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            KIT COM 5 CALÇAS — OFERTA POR TEMPO LIMITADO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">5 calças jogger premium na promoção Pague 3 Leve 5.</strong> Um custo por peça{" "}
            <strong className="text-foreground">imbatível</strong>. Com{" "}
            <strong className="text-foreground">frete grátis</strong> e entrega rápida, essa é a oportunidade perfeita pra renovar seu guarda-roupa com{" "}
            <strong className="text-foreground">peças de alta performance em poliamida</strong>. Estoque limitado — quando acabar,{" "}
            <strong className="text-foreground">não sabemos quando volta</strong>.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Garantia de 30 dias – Compra 100% segura
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Se não servir ou não gostar, você tem até <strong className="text-foreground">30 dias para trocar ou devolver sem complicação</strong>. Pedido processado em até <strong className="text-foreground">24h úteis</strong> com rastreamento completo e <strong className="text-foreground">nota fiscal eletrônica</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 21) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            A EVOLUÇÃO DO BÁSICO MASCULINO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Essa não é mais uma camiseta básica.</strong> É a versão que você sempre quis: com{" "}
            <strong className="text-foreground">tecido InGame® exclusivo</strong> que combina{" "}
            <strong className="text-foreground">conforto térmico, tecnologia anti odor e toque encorpado sem pesar</strong>. Levemente texturizada, ela entrega sofisticação mesmo no look mais simples.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            TECNOLOGIA INGAME® — O TECIDO QUE FAZ DIFERENÇA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Tecido Respirável", desc: "Permite fluxo de ar constante, mantém você fresco o dia inteiro" },
              { title: "Anti Odor", desc: "Tecnologia que impede a proliferação de bactérias causadoras de mau cheiro" },
              { title: "Encorpado sem Pesar", desc: "Estrutura firme com toque leve — não é molenga, não é pesada" },
              { title: "Conforto Térmico", desc: "Regula a temperatura corporal em qualquer clima" },
              { title: "Não Precisa Passar", desc: "Tire da máquina e vista — sem ferro, sem stress" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            CONFORTO VICIANTE — SUOR NÃO É UM PROBLEMA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Quem veste não quer tirar.</strong> O tecido InGame® foi desenvolvido para quem precisa de{" "}
            <strong className="text-foreground">performance no dia a dia</strong> — seja no trabalho, no treino ou no rolê. A{" "}
            <strong className="text-foreground">tecnologia anti odor</strong> garante que você se sinta fresco mesmo após horas de uso. E a{" "}
            <strong className="text-foreground">textura levemente granulada</strong> dá um toque premium que diferencia do básico comum.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            5 CORES VERSÁTEIS — MONTE SEU LOOK DA SEMANA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            O kit vem com <strong className="text-foreground">5 cores essenciais</strong>:{" "}
            <strong className="text-foreground">Preto, Branco, Cinza, Verde Escuro e Azul Marinho</strong>. Combinam com tudo — calça jeans, bermuda, jogger ou alfaiataria. São as cores que{" "}
            <strong className="text-foreground">todo homem precisa no guarda-roupa</strong> para estar sempre bem vestido sem esforço.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            KIT COM 5 CAMISETAS — PAGUE 3, LEVE 5
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">5 camisetas Tech Daily por apenas R$ 79,90.</strong> Isso dá menos de{" "}
            <strong className="text-foreground">R$ 16 por camiseta</strong> com tecnologia InGame®. Com{" "}
            <strong className="text-foreground">frete grátis</strong> e entrega rápida, essa é a chance de elevar seu básico com{" "}
            <strong className="text-foreground">qualidade premium</strong>. Estoque limitado — quando acabar,{" "}
            <strong className="text-foreground">não sabemos quando volta</strong>.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Garantia de 30 dias – Compra 100% segura
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Se não servir ou não gostar, você tem até <strong className="text-foreground">30 dias para trocar ou devolver sem complicação</strong>. Pedido processado em até <strong className="text-foreground">24h úteis</strong> com rastreamento completo e <strong className="text-foreground">nota fiscal eletrônica</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 24) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POLO POLIAMIDA — A SOFISTICAÇÃO QUE VOCÊ MERECE
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Não é uma polo comum.</strong> É a versão premium feita com{" "}
            <strong className="text-foreground">88% poliamida e 12% elastano</strong>, com toque{" "}
            <strong className="text-foreground">seda gelada</strong> que refresca, não amassa e não desbota. Caimento elegante que valoriza o corpo do trabalho ao rolê.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            TECNOLOGIA QUE FAZ A DIFERENÇA — 5 BENEFÍCIOS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Tecido Seda Gelada", desc: "Toque sedoso e fresco que refresca o corpo o dia todo" },
              { title: "Antitranspirante", desc: "Não marca suor e mantém o corpo seco mesmo no calor" },
              { title: "Não Amassa", desc: "Sai da máquina pronta para usar — sem ferro, sem stress" },
              { title: "Secagem Ultrarrápida", desc: "Lava à noite, está seca pela manhã" },
              { title: "Modelagem Slim", desc: "Caimento elegante que valoriza o corpo sem apertar" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            3 CORES VERSÁTEIS — DO TRABALHO AO ROLÊ
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            O kit vem com <strong className="text-foreground">3 cores essenciais</strong>:{" "}
            <strong className="text-foreground">Preto, Azul Marinho e Bege</strong>. Combinam com calça jeans, alfaiataria, bermuda ou jogger. São as cores certas para você{" "}
            <strong className="text-foreground">estar bem vestido em qualquer ocasião</strong>, sem precisar pensar muito.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            KIT COM 3 POLOS — PAGUE 1, LEVE 3
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">3 polos premium por apenas R$ 69,90.</strong> Isso é menos de{" "}
            <strong className="text-foreground">R$ 24 por polo</strong> com tecido tecnológico de poliamida. Com{" "}
            <strong className="text-foreground">frete grátis</strong> e entrega rápida pra todo Brasil. Estoque limitado — quando acabar,{" "}
            <strong className="text-foreground">não sabemos quando volta</strong>.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Garantia de 30 dias – Compra 100% segura
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Se não servir ou não gostar, você tem até <strong className="text-foreground">30 dias para trocar ou devolver sem complicação</strong>. Pedido processado em até <strong className="text-foreground">24h úteis</strong> com rastreamento completo e <strong className="text-foreground">nota fiscal eletrônica</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 25) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            CONFORTO DE NUVEM EM CADA PASSO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">O Tênis Slip On foi desenhado para o homem que valoriza praticidade, leveza e estilo.</strong> Com tecido{" "}
            <strong className="text-foreground">knit respirável de alta densidade</strong> e solado em{" "}
            <strong className="text-foreground">EVA ultraleve com absorção de impacto</strong>, ele entrega conforto do primeiro ao último passo —{" "}
            <strong className="text-foreground">sem apertar, sem suar, sem cansar</strong>.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            5 MOTIVOS PRA ESSE SER O SEU NOVO TÊNIS FAVORITO
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Tecido knit respirável", desc: "Pé seco e fresco mesmo nos dias mais quentes" },
              { title: "Solado EVA ultraleve", desc: "Pesa menos, amortece mais — você esquece que está usando" },
              { title: "Palmilha anatômica acolchoada", desc: "Suporte ergonômico para o arco do pé o dia inteiro" },
              { title: "Detalhes em couro premium", desc: "Reforço nas pontas e laterais com acabamento sofisticado" },
              { title: "Visual versátil", desc: "Combina com jeans, social, jogger ou bermuda — vai com tudo" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            LEVE COMO UMA PLUMA, FIRME COMO UM TANQUE
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            A combinação de <strong className="text-foreground">tecido knit elástico</strong> com{" "}
            <strong className="text-foreground">solado EVA injetado</strong> resulta em um tênis que abraça o pé sem apertar e absorve o impacto a cada passo. Ideal para{" "}
            <strong className="text-foreground">caminhar o dia inteiro, ir ao trabalho, passear ou viajar</strong> — sem dor, sem peso, sem desconforto.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            6 CORES PRA COMBINAR COM TUDO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Preto, Azul Marinho, Cinza, Marrom, Bege e Caramelo.</strong> Escolha a cor que mais combina com o seu estilo — ou pegue mais de uma e tenha um par certo para cada ocasião.{" "}
            <strong className="text-foreground">Do casual ao semi-formal</strong>, esse tênis vai com qualquer look.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            ESTOQUE LIMITADO – APROVEITE A PROMOÇÃO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">De R$ 199,90 por apenas R$ 69,90</strong> — economia real de mais de 70% em um tênis premium com{" "}
            <strong className="text-foreground">frete grátis</strong> e entrega rápida pra todo Brasil. Os primeiros lotes já estão se esgotando.{" "}
            <strong className="text-foreground">Quando acabar, não sabemos quando volta.</strong>
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Garantia de 30 dias – Compra 100% segura
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Se não servir ou não gostar, você tem até <strong className="text-foreground">30 dias para trocar ou devolver sem complicação</strong>. Pedido processado em até <strong className="text-foreground">24h úteis</strong> com rastreamento completo e <strong className="text-foreground">nota fiscal eletrônica</strong>.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 29) {
    return (
      <div className="mt-16 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            CONJUNTO MOLETOM PARIS — ESTILO E CONFORTO PREMIUM
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Algodão grosso 330gsm</strong>, super macio por dentro,{" "}
            <strong className="text-foreground">não desbota e não encolhe</strong>. Composto por algodão e poliéster
            com tecido <strong className="text-foreground">antibolas</strong> e cordões reforçados com passadores de metal.
            Conjunto completo: blusa com capuz e calça jogger combinando — perfeito para o dia a dia, esporte ou para sair.
          </p>
        </div>

        <div className="flex justify-center">
          <img
            src="/src/assets/moletom-paris-detalhes.jpg"
            alt="Detalhes do moletom Paris"
            className="w-full max-w-lg rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            QUALIDADE EM CADA DETALHE
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Tecido Premium 330gsm", desc: "Algodão grosso, alta qualidade, resistente e durável" },
              { title: "Conforto Excepcional", desc: "Super macio por dentro, confortável e respirável" },
              { title: "Tecido Antibolas", desc: "Composto por algodão e poliéster, não forma bolinhas" },
              { title: "Cordões Reforçados", desc: "Cordões grossos com passadores de metal resistentes" },
              { title: "Bolsos Funcionais", desc: "Canguru profundo na blusa e bolso lateral na calça" },
              { title: "Acabamento Reforçado", desc: "Cós, barra e punhos canelados com costuras reforçadas" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src="/src/assets/moletom-paris-medidas.jpg"
            alt="Tabela de medidas do conjunto Paris"
            className="w-full max-w-lg rounded-lg"
            loading="lazy"
          />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-foreground">
            Garantia de 30 dias – Compra 100% segura
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Se não servir ou não gostar, você tem até <strong className="text-foreground">30 dias para trocar ou devolver sem complicação</strong>. Pedido processado em até <strong className="text-foreground">24h úteis</strong> com rastreamento completo.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 32) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            LEVEZA, CONFORTO E PERFORMANCE EM CADA PASSADA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">O Tênis Esportivo DAMANDO</strong> foi desenvolvido para quem busca <strong className="text-foreground">conforto absoluto e performance no dia a dia</strong>. Ideal para academia, caminhada, corrida leve e uso casual. Apenas <strong className="text-foreground">280g de peso</strong>, você esquece que está com ele no pé.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            6 MOTIVOS PARA ESCOLHER ESSE TÊNIS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Cabedal em Mesh Respirável", desc: "Ventilação superior, mantém o pé fresco e seco" },
              { title: "Entressola em EVA Premium", desc: "Absorção de impacto e retorno de energia" },
              { title: "Solado Antiderrapante", desc: "Aderência segura em diversos tipos de piso" },
              { title: "Palmilha Anatômica Macia", desc: "Conforto durante o dia inteiro, sem cansar o pé" },
              { title: "Apenas 280g de Peso", desc: "Extremamente leve, ideal para treinos intensos" },
              { title: "Design Esportivo Moderno", desc: "Visual versátil que combina com qualquer look" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            PERFEITO PARA QUALQUER TREINO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Seja na <strong className="text-foreground">esteira, no levantamento de peso, nas caminhadas longas ou nas corridas no parque</strong>, esse tênis acompanha o seu ritmo. A combinação de <strong className="text-foreground">amortecimento, flexibilidade e estabilidade</strong> oferece o suporte que você precisa para extrair o máximo dos seus treinos.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            3 CORES CLÁSSICAS PARA COMBINAR COM TUDO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Disponível em <strong className="text-foreground">Cinza, Azul Marinho e Preto</strong>. Tons versáteis que combinam com seus shorts de treino, joggers, jeans e calças do dia a dia. Estilo esportivo com toque urbano.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            OFERTA RELÂMPAGO – 73% OFF
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Por tempo limitado, leve esse tênis por apenas <strong className="text-foreground">R$ 54,90</strong>. Frete grátis e entrega rápida pra todo Brasil. <strong className="text-foreground">Garantia de 30 dias</strong> – se não servir ou não gostar, devolvemos seu dinheiro sem complicação.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 44) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            BERMUDA SHORT 2 EM 1 DRY FIT — MODELO MONSTER
          </h2>
          <p className="text-lg md:text-xl font-semibold text-foreground italic">
            Pague 1 e Leve 5 — promoção exclusiva por tempo limitado.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            A bermuda <strong className="text-foreground">2 em 1</strong> mais desejada por atletas e fitness lovers. <strong className="text-foreground">Short externo + forro de compressão interno integrado</strong>, garantindo suporte muscular, conforto absoluto e estilo em qualquer treino ou rotina do dia a dia.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={bermudaMonsterDesc1} alt="Bermuda Monster 2 em 1 - Tecnologia Dry Fit" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            TECNOLOGIA 2 EM 1 — SHORT + COMPRESSÃO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Por fora, <strong className="text-foreground">tecido Dry Fit leve e respirável</strong> em modelagem Slim Fit moderna. Por dentro, <strong className="text-foreground">forro de compressão em poliamida + elastano</strong> que abraça a musculatura, reduz fadiga, vibração e ainda elimina o famoso atrito durante o movimento.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={bermudaMonsterDesc2} alt="Bermuda Monster - Forro de compressão" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            5 DETALHES QUE FAZEM A DIFERENÇA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Tecido Dry Fit Premium", desc: "Dispersão acelerada do suor com secagem ultrarrápida" },
              { title: "Forro de Compressão Integrado", desc: "Suporte muscular que reduz fadiga e vibração" },
              { title: "Bolso Lateral Oculto", desc: "Comporta celular até 6.7'' com segurança" },
              { title: "Cordão Regulável", desc: "Ponteiras metálicas premium e ajuste perfeito" },
              { title: "Aberturas Laterais", desc: "Liberdade total de movimento em qualquer treino" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img src={bermudaMonsterDesc3} alt="Bermuda Monster - Detalhes premium" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            IDEAL PARA TODOS OS TREINOS — E PARA O DIA A DIA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Perfeita para <strong className="text-foreground">musculação, corrida, crossfit, futebol, ciclismo, caminhada</strong> e até para o uso casual. A versatilidade que faltava no seu guarda-roupa: estilo esportivo, caimento moderno e conforto que dura o dia inteiro.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={bermudaMonsterDesc4} alt="Bermuda Monster - Uso esportivo" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            VOCÊ RECEBE 5 BERMUDAS — CORES VARIADAS
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Kit completo com <strong className="text-foreground">5 unidades nas cores Preto, Cinza, Verde Militar, Azul Marinho e Azul Royal</strong>, todas com a estampa exclusiva Modelo Monster, forro interno preto de compressão e bolso lateral integrado.
          </p>
          <div className="bg-secondary/50 border border-border rounded-lg p-5 text-left max-w-md mx-auto">
            <p className="font-bold text-foreground text-sm mb-2">📏 Tabela de Medidas (cm)</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li><strong className="text-foreground">P</strong> — Cintura 37/45 | Comprimento 44</li>
              <li><strong className="text-foreground">M</strong> — Cintura 39/50 | Comprimento 46</li>
              <li><strong className="text-foreground">G</strong> — Cintura 41/55 | Comprimento 48</li>
              <li><strong className="text-foreground">GG</strong> — Cintura 43/60 | Comprimento 50</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-center">
          <img src={bermudaMonsterDesc5} alt="Bermuda Monster - Cores disponíveis" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            OFERTA EXCLUSIVA — PAGUE 1, LEVE 5 POR R$ 69,90
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            De <span className="line-through">R$ 349,50</span> por apenas <strong className="text-foreground">R$ 69,90</strong> no kit completo com 5 bermudas. <strong className="text-foreground">Frete grátis</strong> para todo o Brasil e <strong className="text-foreground">garantia de 30 dias</strong> — se não servir ou não gostar, devolvemos seu dinheiro sem complicação. Estoque limitado.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 45) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            KIT BODY SPLASH BARBARIUS + MIDTOWN — BY PRIMACIAL
          </h2>
          <p className="text-lg md:text-xl font-semibold text-foreground italic">
            2 fragrâncias premium de 200ml por apenas R$ 69,90.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Duas <strong className="text-foreground">fragrâncias masculinas autênticas</strong> assinadas pela Primacial, marca brasileira referência em perfumaria. <strong className="text-foreground">Barbarius</strong> traz a personalidade marcante do homem moderno, e <strong className="text-foreground">Midtown</strong> entrega a sofisticação amadeirada para quem busca elegância no dia a dia.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={kitBarbariusMidtownDesc2} alt="Kit Body Splash Barbarius e Midtown" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            BARBARIUS — AROMÁTICO FOUGÈRE
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Para o homem moderno, com um espírito indomável.</strong> Abertura cítrica de bergamota e limão siciliano, coração com lavanda e gerânio, e fundo profundo de madeiras nobres com almíscar. Fixação real de até <strong className="text-foreground">8 horas</strong> e rastro marcante.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={kitBarbariusMidtownDesc1} alt="Body Splash Barbarius Primacial" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            MIDTOWN — AMADEIRADO FLORAL ALMISCARADO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Criado para homens atemporais e autoconfiantes.</strong> Saída de pera e cardamomo, coração floral com íris e jasmim, fundo amadeirado de sândalo e almíscar branco. Aroma <strong className="text-foreground">refinado, limpo e elegante</strong> — perfeito para o trabalho, encontros e ocasiões importantes.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={kitBarbariusMidtownDesc3} alt="Body Splash Midtown Primacial" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POR QUE ESCOLHER ESSE KIT?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "200ml em cada frasco", desc: "Mais que o dobro de um perfume comum — dura até 4 meses" },
              { title: "Válvula spray premium", desc: "Pulverização uniforme sem desperdício de produto" },
              { title: "Fixação prolongada", desc: "Fórmula com alta concentração de essência olfativa" },
              { title: "100% original Primacial", desc: "Marca brasileira reconhecida em perfumaria masculina" },
              { title: "Frascos lacrados", desc: "Garantia de procedência e qualidade do produto" },
              { title: "Ideal para presente", desc: "Embalagem elegante, perfeita para presentear" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img src={kitBarbariusMidtownDesc4} alt="Kit Primacial Barbarius e Midtown - Detalhes" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            COMO USAR PARA MÁXIMA FIXAÇÃO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Aplique nos <strong className="text-foreground">pontos de pulsação</strong> (pescoço, pulsos e atrás das orelhas) logo após o banho com a pele ainda úmida. Para um rastro ainda mais duradouro, borrife também na <strong className="text-foreground">roupa</strong> — o tecido segura a fragrância por horas.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={kitBarbariusMidtownDesc5} alt="Kit completo Barbarius e Midtown" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            OFERTA EXCLUSIVA — KIT COMPLETO POR R$ 69,90
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            De <span className="line-through">R$ 219,80</span> por apenas <strong className="text-foreground">R$ 69,90</strong> nos 2 frascos de 200ml. <strong className="text-foreground">68% OFF</strong>, <strong className="text-foreground">frete grátis</strong> para todo o Brasil e <strong className="text-foreground">garantia de 7 dias</strong> — se não amar as fragrâncias, devolvemos seu dinheiro. Estoque limitado.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 46) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            BODY SPLASH BARBARIUS 200ML — BY PRIMACIAL
          </h2>
          <p className="text-lg md:text-xl font-semibold text-foreground italic">
            Aromático Fougère com bergamota e sálvia. 200ml por apenas R$ 39,90.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Para o homem moderno, com um espírito indomável.</strong> Uma fragrância intensa e magnética assinada pela <strong className="text-foreground">Primacial</strong>, marca brasileira referência em perfumaria masculina. Frasco generoso de 200ml com fixação real de até <strong className="text-foreground">8 horas</strong>.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-5 py-2">
            <span className="text-sm font-bold text-emerald-700">5% OFF EXCLUSIVO no PIX</span>
          </div>
        </div>

        <div className="flex justify-center">
          <img src={bodySplashBarbariusSoloDesc3} alt="Body Splash Barbarius Primacial 200ml" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            UMA FRAGRÂNCIA AROMÁTICA FOUGÈRE
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Abre com um <strong className="text-foreground">frescor explosivo de bergamota</strong>, contrastando com notas verdes de <strong className="text-foreground">sálvia e lavanda</strong>, e fechando com um fundo amadeirado magnético de <strong className="text-foreground">cedro, vetiver e almíscar branco</strong>. Um aroma marcante, sofisticado e inconfundível — feito para deixar rastro.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={bodySplashBarbariusSoloDesc2} alt="Notas olfativas Barbarius - bergamota e sálvia" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            PIRÂMIDE OLFATIVA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Saída", desc: "Bergamota, Limão Siciliano e Pimenta Rosa — frescor cítrico imediato" },
              { title: "Coração", desc: "Sálvia, Lavanda e Gerânio — notas verdes aromáticas e elegantes" },
              { title: "Fundo", desc: "Cedro, Vetiver e Almíscar Branco — rastro amadeirado e magnético" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm uppercase tracking-wider">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img src={bodySplashBarbariusSoloDesc4} alt="Body Splash Barbarius Primacial - Lifestyle" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POR QUE ESCOLHER O BARBARIUS?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Frasco premium 200ml", desc: "Mais que o dobro de um perfume comum — dura até 4 meses" },
              { title: "Válvula spray de precisão", desc: "Pulverização uniforme sem desperdício de produto" },
              { title: "Fixação real de 8 horas", desc: "Fórmula com alta concentração de essência olfativa" },
              { title: "100% original Primacial", desc: "Marca brasileira referência em perfumaria masculina" },
              { title: "Dermatologicamente testado", desc: "Fórmula leve, refrescante e segura para todo tipo de pele" },
              { title: "5% OFF no PIX", desc: "Desconto exclusivo deste produto no pagamento via PIX" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img src={bodySplashBarbariusSoloDesc1} alt="Body Splash Barbarius Primacial 200ml frasco" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            COMO USAR PARA MÁXIMA FIXAÇÃO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Aplique nos <strong className="text-foreground">pontos de pulsação</strong> (pescoço, pulsos e atrás das orelhas) logo após o banho com a pele ainda úmida. Para um rastro ainda mais duradouro, borrife também na <strong className="text-foreground">roupa</strong> — o tecido segura a fragrância por horas.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            OFERTA EXCLUSIVA — BARBARIUS 200ML POR R$ 39,90
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            De <span className="line-through">R$ 89,90</span> por apenas <strong className="text-foreground">R$ 39,90</strong> no frasco premium de 200ml. Pague no <strong className="text-emerald-600">PIX e ganhe 5% OFF adicional</strong> — desconto exclusivo deste produto. <strong className="text-foreground">Frete grátis</strong> para todo o Brasil e <strong className="text-foreground">garantia de 7 dias</strong> — se não amar a fragrância, devolvemos seu dinheiro. Estoque limitado.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 42) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            KIT 3 BODY SPLASH HOMME — BARBOUR'S BEAUTY 200ML
          </h2>
          <p className="text-lg md:text-xl font-semibold text-foreground italic">
            Trio premium de fragrâncias masculinas por apenas R$ 69,90.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Três <strong className="text-foreground">assinaturas olfativas exclusivas</strong> da Barbour's Beauty em frascos de 200ml cada. <strong className="text-foreground">Seduction Homme</strong>, <strong className="text-foreground">Bold Homme</strong> e <strong className="text-foreground">Ocean Homme</strong> — uma fragrância para cada momento da sua rotina, do dia a dia urbano às noites mais marcantes.
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-5 py-2">
            <span className="text-sm font-bold text-emerald-700">74% OFF — De R$ 269,70 por R$ 69,90</span>
          </div>
        </div>

        <div className="flex justify-center">
          <img src={bodySplashBarboursTrioDesc} alt="Kit 3 Body Splash Barbour's Homme" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            🖤 SEDUCTION HOMME — AMADEIRADO ESPECIADO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Magnético, envolvente e cheio de personalidade.</strong> Topo de toranja, gengibre e noz-moscada. Coração de menta, vetiver, jasmim e pimenta rosa. Base profunda de cedro, sândalo e lábdano. Feito para conquistar.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={bodySplashBarboursSeductionCenaDesc} alt="Body Splash Seduction Homme" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>
        <div className="flex justify-center">
          <img src={bodySplashBarboursSeductionNotesDesc} alt="Notas olfativas Seduction Homme" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            🤎 BOLD HOMME — AMADEIRADO AROMÁTICO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Intenso, ousado e marcante para o homem confiante.</strong> Topo de maçã, toranja e bergamota. Coração com elemi, cedro, vetiver, lavanda e pimenta rosa. Base de musk, patchouli, labdanum e musgo de carvalho.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={bodySplashBarboursBoldCenaDesc} alt="Body Splash Bold Homme" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>
        <div className="flex justify-center">
          <img src={bodySplashBarboursBoldNotesDesc} alt="Notas olfativas Bold Homme" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            💙 OCEAN HOMME — AROMÁTICO AQUÁTICO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Fresco, limpo e revigorante — perfeito para o dia a dia urbano.</strong> Topo de bergamota, mandarina e noz-moscada. Coração de folhas de violeta e notas aquáticas. Base de couro, patchouli, vetiver e ládano.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={bodySplashBarboursOceanNotesDesc} alt="Notas olfativas Ocean Homme" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POR QUE ESCOLHER ESSE KIT?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "3 frascos premium 200ml", desc: "600ml no total — fragrância para meses de uso diário" },
              { title: "Válvula spray de precisão", desc: "Pulverização uniforme sem desperdício de produto" },
              { title: "Fixação prolongada", desc: "Aroma marcante que dura o dia inteiro no corpo e roupa" },
              { title: "Cruelty Free", desc: "Não testado em animais — fórmula consciente e ética" },
              { title: "Dermatologicamente testado", desc: "Seguro para todo tipo de pele, inclusive sensível" },
              { title: "Embalagem original lacrada", desc: "Garantia de procedência Barbour's Beauty" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img src={bodySplashBarboursCrueltyFreeDesc} alt="Barbour's Cruelty Free" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            COMO USAR PARA MÁXIMA FIXAÇÃO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Aplique nos <strong className="text-foreground">pontos de pulsação</strong> (pescoço, pulsos e atrás das orelhas) logo após o banho com a pele ainda úmida. Para um rastro ainda mais duradouro, borrife também na <strong className="text-foreground">roupa</strong> — o tecido segura a fragrância por horas.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            OFERTA EXCLUSIVA — KIT COMPLETO POR R$ 69,90
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            De <span className="line-through">R$ 269,70</span> por apenas <strong className="text-foreground">R$ 69,90</strong> nos 3 frascos premium de 200ml. <strong className="text-foreground">74% OFF</strong>, <strong className="text-foreground">frete grátis</strong> para todo o Brasil e <strong className="text-foreground">garantia de 7 dias</strong> — se não amar as fragrâncias, devolvemos seu dinheiro. Estoque limitado.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 47) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            KIT 2 CONJUNTOS STREETWEAR PARIS — CAMISETA + SHORT TACTEL
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Você leva <strong className="text-foreground">2 conjuntos completos</strong> (camiseta + short) nas cores{" "}
            <strong className="text-foreground">Preto e Branco</strong>, com a icônica estampa{" "}
            <strong className="text-foreground">PARIS</strong> em alto padrão de impressão. Estilo streetwear urbano,
            tecidos premium e versatilidade para usar no dia a dia, na academia, na praia ou pra sair.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POR QUE ESCOLHER ESSE KIT?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Algodão Premium 30.1", desc: "Camisetas em fio penteado, toque macio e respirável" },
              { title: "Short Tactel com Elastano", desc: "Ultra leve, secagem rápida, ideal pra treino e calor" },
              { title: "Estampa PARIS Exclusiva", desc: "Alto padrão de impressão — não racha e não desbota" },
              { title: "Bolsos com Zíper", desc: "Bolsos laterais funcionais e seguros nos shorts" },
              { title: "Modelagem Reta Clássica", desc: "Caimento perfeito no corpo, combina com qualquer look" },
              { title: "2 Conjuntos por R$ 69,90", desc: "Preto e Branco — leve dois e economize 65%" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            VERSATILIDADE TOTAL PARA O HOMEM MODERNO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Use com <strong className="text-foreground">tênis branco</strong> pra um visual urbano, com{" "}
            <strong className="text-foreground">chinelo slide</strong> num look praiano, ou com{" "}
            <strong className="text-foreground">tênis esportivo</strong> na academia. O conjunto se adapta ao seu estilo —
            do treino ao rolê, sem perder o conforto.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            QUALIDADE QUE DURA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Costuras duplas reforçadas, ribana antitorção na gola, cordão ajustável no short e tecidos que{" "}
            <strong className="text-foreground">não encolhem nem desbotam</strong> mesmo após várias lavagens. Cada peça é
            inspecionada antes do envio para garantir o padrão BellaCasa.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 bg-secondary/30 border border-border rounded-xl p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            OFERTA EXCLUSIVA — 2 CONJUNTOS POR R$ 69,90
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            De <span className="line-through">R$ 199,90</span> por apenas <strong className="text-foreground">R$ 69,90</strong>{" "}
            no kit completo. <strong className="text-foreground">65% OFF</strong>,{" "}
            <strong className="text-foreground">frete grátis</strong> para todo o Brasil e{" "}
            <strong className="text-foreground">garantia de 30 dias</strong> — se não servir ou não gostar, devolvemos seu
            dinheiro sem complicação. Estoque limitado.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 48) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            CAMISETA BÁSICA TECH DAILY INSIDER
          </h2>
          <p className="text-lg md:text-xl font-semibold text-foreground italic">
            Tecido inteligente que NÃO amassa, NÃO retém odor e NÃO desbota.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">A camiseta que vai mudar sua percepção de "básico".</strong> Confeccionada em <strong className="text-foreground">92% Modal e 8% Elastano</strong>, com toque sedoso <strong className="text-foreground">2x mais macio que o algodão</strong>, caimento slim que valoriza o corpo e tecnologia que regula a temperatura do seu corpo durante o dia inteiro.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={techDailyInfoDesc} alt="Tecnologia da camiseta Tech Daily Insider" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            5 TECNOLOGIAS EM UMA ÚNICA PEÇA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "2x mais macia que o algodão", desc: "Modal premium com toque sedoso, conforto incomparável na pele" },
              { title: "Ação Anti Odor", desc: "Tecnologia que neutraliza o cheiro de suor, mesmo em dias longos" },
              { title: "Não amassa no corpo", desc: "Desamassa naturalmente com o uso, dispensa passar a ferro" },
              { title: "Regula a temperatura", desc: "Mantém você fresco no calor e aquecido no frio" },
              { title: "Não desbota com lavagens", desc: "Cores intensas que duram lavagem após lavagem" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img src={techDailyComposicaoDesc} alt="Composição 92% Modal 8% Elastano" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            7 CORES ESSENCIAIS PARA O HOMEM MODERNO
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Preto, Marrom, Azul Mescla, Verde Militar, Vinho, Azul Marinho e Cru.</strong> Uma paleta sofisticada criada para combinar com qualquer peça do seu guarda-roupa — do jeans à alfaiataria, do trabalho ao happy hour.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={techDailyPretoDesc} alt="Camiseta Tech Daily Insider Preta" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 pb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POR APENAS R$ 59,90
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            De <span className="line-through">R$ 129,90</span> por apenas <strong className="text-foreground">R$ 59,90</strong>.{" "}
            <strong className="text-foreground">54% OFF</strong>,{" "}
            <strong className="text-foreground">frete grátis</strong> para todo o Brasil e{" "}
            <strong className="text-foreground">garantia de 7 dias</strong> para troca ou devolução.
          </p>
        </div>
      </div>
    );
  }

  if (productId === 49) {
    return (
      <div className="mt-16 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            CAMISETA BÁSICA TECH DAILY INSIDER PREMIUM
          </h2>
          <p className="text-lg md:text-xl font-semibold text-foreground italic">
            A evolução do básico masculino — toque sedoso, anti odor e caimento slim moderno.
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">A peça-curinga do guarda-roupa moderno.</strong> Confeccionada em <strong className="text-foreground">92% Modal e 8% Elastano</strong>, oferece um toque <strong className="text-foreground">2x mais macio que o algodão</strong>, regula a temperatura do corpo e mantém a cor firme mesmo após dezenas de lavagens. Combina do jogger ao alfaiataria, do tênis branco ao mocassim.
          </p>
        </div>

        <div className="flex justify-center">
          <img src={techDailyInfoDesc} alt="Tecnologia da camiseta Tech Daily Insider Premium" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            TECNOLOGIA TÊXTIL DE PONTA
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: "Toque sedoso premium", desc: "Modal de longa fibra, 2x mais macio que o algodão tradicional" },
              { title: "Ação Anti Odor", desc: "Controla o suor e neutraliza o cheiro durante o dia inteiro" },
              { title: "Não amassa no corpo", desc: "Desamassa naturalmente com o calor — dispensa passar a ferro" },
              { title: "Regula a temperatura", desc: "Tecido respirável que se adapta ao calor e ao frio" },
              { title: "Cor firme e durável", desc: "Não desbota mesmo após mais de 50 lavagens" },
              { title: "Resistente ao pilling", desc: "Fios de longa fibra que não formam bolinhas" },
            ].map((item, idx) => (
              <div key={idx} className="bg-secondary/50 border border-border rounded-lg p-5 text-left">
                <p className="font-bold text-foreground text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <img src={techDailyComposicaoDesc} alt="Composição 92% Modal 8% Elastano" className="w-full max-w-lg rounded-lg" loading="lazy" />
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            MODELAGEM SLIM MODERNA
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            <strong className="text-foreground">Caimento que valoriza o corpo sem apertar.</strong> Gola careca reforçada que não deforma, comprimento equilibrado para usar por dentro ou por fora da calça e mangas no ponto certo. Disponível nos tamanhos <strong className="text-foreground">PP, P, M, G, GG e XGG</strong> em uma paleta sofisticada de cores essenciais.
          </p>
        </div>

        <div className="text-center max-w-3xl mx-auto space-y-6 pb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            POR APENAS R$ 69,90
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            De <span className="line-through">R$ 149,90</span> por apenas <strong className="text-foreground">R$ 69,90</strong>.{" "}
            <strong className="text-foreground">53% OFF</strong>,{" "}
            <strong className="text-foreground">frete grátis</strong> para todo o Brasil e{" "}
            <strong className="text-foreground">garantia de 7 dias</strong> para troca ou devolução.
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default ProductDescription;