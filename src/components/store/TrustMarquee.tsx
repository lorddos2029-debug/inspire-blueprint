import { Truck, CreditCard, RefreshCw, Star } from "lucide-react";

const items = [
  { icon: Truck, label: "FRETE GRÁTIS" },
  { icon: CreditCard, label: "12X SEM JUROS" },
  { icon: RefreshCw, label: "TROCA EM 7 DIAS" },
  { icon: Star, label: "+300 AVALIAÇÕES" },
];

const TrustMarquee = () => {
  return (
    <div className="bg-secondary border-y border-border overflow-hidden py-3">
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items, ...items].map((item, idx) => (
          <span
            key={idx}
            className="inline-flex items-center gap-2 mx-8 text-xs font-semibold tracking-wider text-foreground"
          >
            <item.icon className="w-4 h-4" strokeWidth={1.5} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TrustMarquee;
