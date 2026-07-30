import { Lock, ShieldCheck, Truck } from "lucide-react";

interface TrustItem {
  icon: typeof Lock;
  title: string;
  description: string;
}

const ITEMS: TrustItem[] = [
  {
    icon: ShieldCheck,
    title: "Garantia de satisfação",
    description: "7 dias para troca ou devolução sem burocracia.",
  },
  {
    icon: Truck,
    title: "Entrega rastreada",
    description: "Código de rastreio enviado por e-mail e WhatsApp.",
  },
  {
    icon: Lock,
    title: "Pagamento protegido",
    description: "Ambiente criptografado e antifraude em todas as compras.",
  },
];

/**
 * Bloco de reforço de confiança exibido abaixo do formulário do checkout.
 */
export const LunaTrustSection = () => (
  <section className="w-full border-t border-gray-200 bg-[#F5F5F5]">
    <div className="container max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {ITEMS.map(({ icon: Icon, title, description }) => (
        <div key={title} className="flex flex-col items-center text-center gap-2">
          <span className="w-11 h-11 rounded-full bg-gray-200/70 flex items-center justify-center">
            <Icon className="w-5 h-5 text-gray-700" aria-hidden="true" />
          </span>
          <h3 className="text-[11px] font-bold uppercase tracking-wide text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 leading-relaxed max-w-[260px]">{description}</p>
        </div>
      ))}
    </div>
  </section>
);

export default LunaTrustSection;
