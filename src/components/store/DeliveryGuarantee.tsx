import { Truck, MapPin, Package, BadgeDollarSign } from "lucide-react";

const DeliveryGuarantee = () => {
  return (
    <div className="mt-16 max-w-3xl mx-auto">
      <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-8">
        Entrega e Garantia
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            icon: Truck,
            title: "Envio para todo Brasil",
            desc: "Frete grátis em todos os pedidos desta promoção",
          },
          {
            icon: MapPin,
            title: "Prazo de 5 a 10 dias",
            desc: "Entrega rápida direto na sua porta",
          },
          {
            icon: Package,
            title: "Código de rastreio",
            desc: "Acompanhe cada etapa do seu pedido",
          },
          {
            icon: BadgeDollarSign,
            title: "Garantia de devolução",
            desc: "Se não gostar, devolvemos seu dinheiro em até 7 dias",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-start gap-4 border border-border rounded-lg p-5"
          >
            <item.icon className="w-6 h-6 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeliveryGuarantee;
