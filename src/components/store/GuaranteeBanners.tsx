import { Truck, QrCode, ShieldCheck, CreditCard } from "lucide-react";

const guarantees = [
  {
    icon: Truck,
    title: "FRETE GRÁTIS PARA TODO O BRASIL",
    description: "Receba sem pagar nada a mais pela entrega",
  },
  {
    icon: QrCode,
    title: "PAGUE COM PIX",
    description: "Pagamento rápido e seguro via Pix",
  },
  {
    icon: CreditCard,
    title: "12X SEM JUROS",
    description: "Parcele suas compras no cartão de crédito",
  },
  {
    icon: ShieldCheck,
    title: "COMPRA SEGURA",
    description: "Seus dados protegidos em todas as etapas",
  },
];

const GuaranteeBanners = () => {
  return (
    <section className="py-6 md:py-10">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {guarantees.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 bg-card rounded-xl px-5 py-4 border border-border"
            >
              <div className="flex-shrink-0 w-11 h-11 rounded-full bg-muted flex items-center justify-center">
                <item.icon className="w-5 h-5 text-foreground" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-foreground leading-tight">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuaranteeBanners;
