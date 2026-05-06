import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Tem garantia?",
    answer:
      "Sim! Oferecemos garantia de 7 dias após o recebimento. Se não gostar ou houver algum defeito, devolvemos 100% do seu dinheiro.",
  },
  {
    question: "Como escolher o tamanho certo?",
    answer:
      "Consulte a tabela de medidas na página do produto. Na dúvida, recomendamos pedir um número acima do seu habitual. O jeans possui elastano, então se adapta bem ao corpo.",
  },
  {
    question: "O tecido é de boa qualidade?",
    answer:
      "Sim. Utilizamos jeans premium com elastano na composição, garantindo conforto, durabilidade e resistência a lavagens sem perder cor ou forma.",
  },
  {
    question: "Posso pagar no Pix?",
    answer:
      "Sim! Aceitamos Pix e cartão de crédito (em até 12x sem juros). No Pix, o pagamento é confirmado instantaneamente.",
  },
  {
    question: "Quanto tempo demora para chegar?",
    answer:
      "O prazo médio de entrega é de 5 a 10 dias úteis para todo o Brasil. Após o envio, você recebe o código de rastreio por e-mail.",
  },
  {
    question: "O frete é realmente grátis?",
    answer:
      "Sim, o frete é 100% grátis para todo o Brasil, sem valor mínimo de compra nesta promoção.",
  },
];

const ProductFAQ = () => {
  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">
        Perguntas Frequentes
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, idx) => (
          <AccordionItem key={idx} value={`faq-${idx}`}>
            <AccordionTrigger className="text-left text-sm md:text-base font-semibold">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default ProductFAQ;
