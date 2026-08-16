import { Truck, ShieldCheck, RefreshCw, CreditCard } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Frete Grátis",
    desc: "Para todo o Brasil",
  },
  {
    icon: CreditCard,
    title: "12x Sem Juros",
    desc: "No cartão de crédito",
  },
  {
    icon: ShieldCheck,
    title: "Compra Segura",
    desc: "Ambiente criptografado",
  },
  {
    icon: RefreshCw,
    title: "Troca Fácil",
    desc: "7 dias para devolução",
  },
];

const BenefitGrid = () => {
  return (
    <section className="bg-card border-b border-border">
      <div className="container py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4 group">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground shrink-0">
                <benefit.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-tight">
                  {benefit.title}
                </h3>
                <p className="text-xs text-muted-foreground whitespace-nowrap">
                  {benefit.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitGrid;
