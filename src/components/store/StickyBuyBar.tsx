import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface StickyBuyBarProps {
  productName: string;
  price: number;
  pixPrice: number;
  onBuy: () => void;
}

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Barra fixa de compra no mobile — mantém o CTA sempre visível. */
const StickyBuyBar = ({ productName, price, pixPrice, onBuy }: StickyBuyBarProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 320);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 backdrop-blur px-4 py-3 transition-transform duration-300",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[11px] text-muted-foreground">{productName}</p>
          <p className="text-base font-bold leading-tight text-foreground">
            {formatPrice(price)}
          </p>
          <p className="text-[11px] font-semibold text-primary">
            {formatPrice(pixPrice)} no Pix
          </p>
        </div>
        <Button
          className="h-12 shrink-0 px-7 text-sm font-bold uppercase tracking-wider"
          onClick={onBuy}
        >
          Comprar
        </Button>
      </div>
    </div>
  );
};

export default StickyBuyBar;
