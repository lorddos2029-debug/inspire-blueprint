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
          <p className="truncate text-[10px] text-muted-foreground mb-0.5">{productName}</p>
          <div className="flex items-baseline gap-1.5">
            <p className="text-lg font-bold leading-none text-foreground">
              {formatPrice(price)}
            </p>
            <p className="text-[10px] text-muted-foreground line-through opacity-70">
              {formatPrice(price * 1.4)}
            </p>
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-[10px] font-bold text-primary uppercase">
              {formatPrice(pixPrice)} no Pix
            </p>
          </div>
        </div>
        <Button
          className="h-[52px] shrink-0 px-8 text-sm font-bold uppercase tracking-[0.1em] rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-transform"
          onClick={onBuy}
        >
          Comprar Agora
        </Button>
      </div>
    </div>
  );
};

export default StickyBuyBar;
