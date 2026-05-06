import { Truck, ShieldCheck, RefreshCw, Lock, CreditCard, Headphones } from "lucide-react";

const items = [
  { icon: Truck, label: "FRETE GRÁTIS ACIMA DE R$ 199" },
  { icon: CreditCard, label: "ATÉ 12X SEM JUROS" },
  { icon: ShieldCheck, label: "COMPRA 100% SEGURA" },
  { icon: RefreshCw, label: "TROCA EM 7 DIAS" },
  { icon: Lock, label: "AMBIENTE CRIPTOGRAFADO" },
  { icon: Headphones, label: "ATENDIMENTO PREMIUM" },
];

const TrustMarquee = () => {
  return (
    <div className="bg-secondary border-y border-border overflow-hidden py-3.5">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-2.5 mx-10 text-[11px] font-semibold tracking-[0.18em] text-foreground/80"
          >
            <item.icon className="w-4 h-4 text-[hsl(var(--gold))]" strokeWidth={1.5} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrustMarquee;
