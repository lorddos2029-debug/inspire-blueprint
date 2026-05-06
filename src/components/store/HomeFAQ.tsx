import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Qual o prazo de entrega?",
    a: "Trabalhamos com PAC (frete grátis) e SEDEX (R$ 15,23). O prazo varia conforme a região, geralmente 2 a 6 dias úteis para PAC e 1 a 3 dias úteis para SEDEX após a postagem.",
  },
  {
    q: "Quais formas de pagamento vocês aceitam?",
    a: "Aceitamos PIX (com 10% de desconto e aprovação imediata) e cartão de crédito em até 12x. Todas as transações são processadas em ambiente 100% seguro.",
  },
  {
    q: "Como funciona a troca ou devolução?",
    a: "Você tem até 7 dias após o recebimento para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor. A peça deve estar sem uso, com etiqueta e na embalagem original.",
  },
  {
    q: "O frete é realmente grátis?",
    a: "Sim! Oferecemos frete grátis via PAC para compras acima de R$ 59 para todo o Brasil.",
  },
  {
    q: "Como posso rastrear meu pedido?",
    a: "Após a postagem, você receberá o código de rastreio por e-mail. Basta acompanhar pelo site dos Correios ou da transportadora responsável.",
  },
  {
    q: "Os produtos têm garantia?",
    a: "Sim, todos os nossos produtos possuem garantia contra defeitos de fabricação. Caso identifique qualquer problema, entre em contato com o nosso suporte.",
  },
];

const HomeFAQ = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-foreground mb-3">
            Perguntas Frequentes
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
