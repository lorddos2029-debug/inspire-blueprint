import { Lock, Package, BadgeDollarSign } from "lucide-react";

const BuyGuarantees = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-primary" />
        Compra 100% segura
      </span>
      <span className="flex items-center gap-1.5">
        <Package className="w-3.5 h-3.5 text-primary" />
        Envio com rastreio
      </span>
      <span className="flex items-center gap-1.5">
        <BadgeDollarSign className="w-3.5 h-3.5 text-primary" />
        Garantia de 7 dias
      </span>
    </div>
  );
};

export default BuyGuarantees;
