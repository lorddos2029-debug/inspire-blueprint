import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Qual o prazo de entrega dos produtos?",
    a: "Trabalhamos com PAC (frete grátis acima de R$ 199) e SEDEX. O prazo varia conforme a região, geralmente 3 a 8 dias úteis para PAC e 1 a 3 dias úteis para SEDEX após a postagem.",
  },
  {
    q: "Quais formas de pagamento vocês aceitam?",
    a: "Aceitamos PIX (com 3% de desconto e aprovação imediata) e cartão de crédito em até 12x sem juros. Todas as transações são processadas em ambiente 100% seguro e criptografado.",
  },
  {
    q: "Como funciona a troca ou devolução?",
    a: "Você tem até 7 dias após o recebimento para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor. O produto deve estar sem uso e na embalagem original.",
  },
  {
    q: "Os produtos têm garantia?",
    a: "Sim, todos os eletroportáteis e itens BellaCasa possuem garantia contra defeitos de fabricação. Cobertores, toalhas e utensílios contam com garantia de qualidade BellaCasa.",
  },
  {
    q: "Como posso rastrear meu pedido?",
    a: "Após a postagem, você receberá o código de rastreio por e-mail e WhatsApp. Acompanhe em tempo real pelo nosso site ou pelos Correios.",
  },
  {
    q: "Vocês entregam para todo o Brasil?",
    a: "Sim! Entregamos em todos os estados do Brasil com total segurança e embalagens reforçadas para proteger seus produtos.",
  },
];

const HomeFAQ = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10 md:mb-14">
          <span className="text-xs tracking-[0.4em] font-semibold text-[hsl(var(--gold))]">
            DÚVIDAS FREQUENTES
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-primary mt-3 mb-3">
            Como podemos ajudar?
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            Tire suas dúvidas sobre nossos produtos, prazos e formas de pagamento.
          </p>
        </div>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left text-sm md:text-base font-semibold text-foreground hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default HomeFAQ;
