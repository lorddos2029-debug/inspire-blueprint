import { Truck, CreditCard, RefreshCw, Shield } from "lucide-react";

const features = [
  { icon: Truck, label: "Frete Grátis", desc: "Acima de R$99" },
  { icon: CreditCard, label: "6x sem Juros", desc: "No cartão de crédito" },
  { icon: RefreshCw, label: "Troca Grátis", desc: "Primeira troca" },
  { icon: Shield, label: "Compra Segura", desc: "Site 100% protegido" },
];

const BannerStrip = () => {
  return (
    <section className="border-y border-border py-8 md:py-12">
      <div className="container grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
        {features.map((f) => (
          <div key={f.label} className="flex flex-col items-center text-center gap-2">
            <f.icon className="w-6 h-6 text-foreground" strokeWidth={1.5} />
            <span className="text-xs font-semibold tracking-wider text-foreground">{f.label}</span>
            <span className="text-xs text-muted-foreground">{f.desc}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BannerStrip;
