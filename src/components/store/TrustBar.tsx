import { useState, useEffect } from "react";
import { Lock, Truck, CreditCard, Flame } from "lucide-react";

const TrustBar = () => {
  const [orderCount, setOrderCount] = useState(327);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrderCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-foreground text-background">
      <div className="container">
        {/* Trust seals */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 py-3 text-xs md:text-sm font-medium">
          <span className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            Compra Segura
          </span>
          <span className="hidden md:inline text-background/30">|</span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5" />
            Envio para todo Brasil
          </span>
          <span className="hidden md:inline text-background/30">|</span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            Pagamento Protegido
          </span>
        </div>
        {/* Urgency line */}
        <div className="flex items-center justify-center gap-2 py-2 border-t border-background/10 text-xs md:text-sm">
          <Flame className="w-3.5 h-3.5 animate-pulse text-orange-400" />
          <span>
            Mais de{" "}
            <strong
              key={orderCount}
              className="inline-block animate-fade-in"
            >
              {orderCount} pedidos
            </strong>{" "}
            realizados hoje
          </span>
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
