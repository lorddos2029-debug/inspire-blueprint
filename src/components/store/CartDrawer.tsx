import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";

const CartDrawer = () => {
  const { items, updateQuantity, removeItem, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const navigate = useNavigate();

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const hasOnly46 = items.length > 0 && items.every(i => i.id === 46);
  const hasMixed46 = items.some(i => i.id === 46) && items.some(i => i.id !== 46);
  const pixDiscountLabel = hasOnly46 ? "5%" : hasMixed46 ? "até 10%" : "10%";
  
  // Calculate blended rate for total preview
  const itemsSubtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0) || 1;
  const itemsAt5 = items.filter(i => i.id === 46).reduce((sum, it) => sum + it.price * it.quantity, 0);
  const itemsAt10 = itemsSubtotal - itemsAt5;
  const blendedRate = (itemsAt5 * 0.05 + itemsAt10 * 0.10) / itemsSubtotal;
  const pixTotalPrice = totalPrice * (1 - blendedRate);

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0 gap-0 [&>button]:hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="text-sm font-bold text-foreground tracking-wide">
            SACOLA ({items.reduce((acc, item) => acc + item.quantity, 0)})
          </span>
          <button onClick={() => setIsCartOpen(false)} className="text-foreground hover:text-muted-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-5">
            <p className="text-muted-foreground text-sm">Seu carrinho está vazio</p>
            <Button variant="outline" onClick={() => setIsCartOpen(false)} className="rounded-full">
              Continuar Comprando
            </Button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.map((item) => (
                <div
                  key={`${item.id}-${item.size || ''}-${item.color || ''}`}
                  className="flex gap-4 px-5 py-4 border-b border-border"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-[72px] h-[88px] object-cover bg-secondary rounded-md flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col min-w-0">
                    <h4 className="text-sm font-medium text-foreground leading-snug line-clamp-2">
                      {item.name}
                    </h4>
                    {item.size && (
                      <p className="text-xs text-muted-foreground mt-0.5">Tamanho: {item.size}</p>
                    )}
                    {item.color && (
                      <p className="text-xs text-muted-foreground mt-0.5">Cor: {item.color}</p>
                    )}
                    <p className="text-sm font-bold text-[hsl(var(--gold))] mt-1">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border rounded-md overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-sm font-medium text-foreground border-x border-border">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors text-foreground"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
                      >
                        remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="border-t border-border mt-auto">
              <div className="px-5 pt-4 pb-2 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">subtotal</span>
                  <span className="text-sm text-muted-foreground">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-foreground">TOTAL</span>
                  <span className="text-lg font-bold text-[hsl(var(--gold))]">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/25 px-3 py-2 rounded-md">
                  <span className="text-sm font-medium text-[hsl(var(--gold))]">{pixDiscountLabel} OFF no PIX</span>
                  <span className="text-sm font-bold text-[hsl(var(--gold))]">{formatPrice(pixTotalPrice)}</span>
                </div>
              </div>
              <div className="px-5 pb-5 pt-3 space-y-2">
                <Button
                  className="w-full h-12 text-sm font-bold tracking-wider rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate("/checkout");
                  }}
                >
                  FINALIZAR COMPRA
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 text-sm font-bold tracking-wider rounded-full border-foreground text-foreground hover:bg-secondary"
                  onClick={() => setIsCartOpen(false)}
                >
                  CONTINUAR COMPRANDO
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;