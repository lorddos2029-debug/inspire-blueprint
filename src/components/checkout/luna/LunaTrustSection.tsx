import { Lock, ShieldCheck, Star, Truck } from "lucide-react";

interface TrustItem {
  icon: typeof Lock;
  title: string;
  description: string;
}

const ITEMS: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: "Garantia de Satisfação",
    description:
      "Sua satisfação em primeiro lugar. Garantimos seu direito a trocas e devoluções. Basta entrar em contato com o nosso suporte.",
  },
  {
    icon: Truck,
    title: "Entrega com Rastreio",
    description:
      "Todas as nossas encomendas vêm com um número de rastreamento exclusivo. Você poderá acompanhar todo o processo de entrega do seu pedido.",
  },
  {
    icon: Lock,
    title: "Pagamento Protegido",
    description:
      "Ambiente criptografado e antifraude em todas as compras. Seus dados estão sempre seguros do início ao fim.",
  },
];

const Stars = () => (
  <div className="flex items-center gap-0.5" aria-label="5 de 5 estrelas">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="w-3.5 h-3.5 fill-[#C2A063] text-[#C2A063]" aria-hidden="true" />
    ))}
  </div>
);

/**
 * Bloco de reforço de confiança exibido abaixo do formulário do checkout.
 * Cards verticais com selo de 5 estrelas, no padrão visual da loja.
 */
export const LunaTrustSection = () => (
  <section className="w-full border-t border-gray-200 bg-[#F9F6F1]">
    <div className="container max-w-2xl mx-auto px-4 py-8 space-y-4">
      {ITEMS.map(({ icon: Icon, title, description }) => (
        <div
          key={title}
          className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-5 flex flex-col gap-2"
        >
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-lg bg-[#F9F6F1] border border-gray-200 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-[#15202D]" aria-hidden="true" />
            </span>
            <Stars />
          </div>
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#15202D]">{title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default LunaTrustSection;
