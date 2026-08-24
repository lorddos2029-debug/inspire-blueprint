import { useState } from "react";
import { ChevronDown, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/contexts/CartContext";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export interface LunaCartSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  couponDiscount?: number;
  pixDiscount?: number;
  total: number;
}

/**
 * Resumo do pedido. No desktop fica sempre visível (sticky);
 * no mobile vira um accordion com o total ao lado do botão.
 */
export const LunaCartSummary = ({
  items,
  subtotal,
  shippingCost,
  couponDiscount = 0,
  pixDiscount = 0,
  total,
}: LunaCartSummaryProps) => {
  const [open, setOpen] = useState(false);

  const body = (
    <div className="space-y-4">
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={`${item.id}-${item.size || ""}-${item.color || ""}-${idx}`} className="flex items-center gap-3">
            <div className="relative shrink-0">
              {item.images && item.images.length > 1 ? (
                <div className="relative w-16 h-16">
                  {item.images.slice(0, 2).map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt={`${item.name} - cor ${i + 1}`}
                      className={`absolute top-0 h-16 w-11 object-cover border border-gray-200 bg-gray-50 ${
                        i === 0 ? "left-0 rounded-l-lg z-10" : "right-0 rounded-r-lg border-l-2 border-l-white"
                      }`}
                      loading="lazy"
                      decoding="async"
                    />
                  ))}
                </div>
              ) : (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200 bg-gray-50"
                  loading="lazy"
                  decoding="async"
                />
              )}

              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-[#C2A063] text-white text-[10px] font-bold flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-800 line-clamp-2">{item.name}</p>
              {(item.size || item.color) && (
                <p className="text-[10px] text-gray-500 mt-0.5">
                  {[item.size && (item.name.toLowerCase().includes("escova") ? `Voltagem: ${item.size}` : `Tam: ${item.size}`), item.color].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            <p className="text-xs font-bold text-gray-900 shrink-0">{formatPrice(item.price * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="h-px bg-gray-200" />

      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium text-gray-900">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span>Frete</span>
          <span className={cn("font-medium", shippingCost === 0 ? "text-green-600" : "text-gray-900")}>
            {shippingCost === 0 ? "Grátis" : formatPrice(shippingCost)}
          </span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span>Cupom de desconto</span>
            <span className="font-medium">- {formatPrice(couponDiscount)}</span>
          </div>
        )}
        {pixDiscount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span>Desconto PIX</span>
            <span className="font-medium">- {formatPrice(pixDiscount)}</span>
          </div>
        )}
      </div>

      <div className="h-px bg-gray-200" />

      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-800">Total</span>
        <span className="text-xl font-bold text-[#C2A063]">{formatPrice(total)}</span>
      </div>
    </div>
  );

  return (
    <div className="w-full md:w-[380px] shrink-0">
      {/* Mobile: accordion */}
      <div className="md:hidden bg-white rounded-xl border border-gray-200 shadow-sm">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-between gap-2 px-4 py-3"
          aria-expanded={open}
        >
          <span className="flex items-center gap-2 text-xs font-semibold text-gray-700">
            <ShoppingBag className="w-4 h-4 text-[#C2A063]" />
            {open ? "Ocultar resumo do pedido" : "Exibir resumo do pedido"}
            <ChevronDown className={cn("w-4 h-4 transition-transform", open && "rotate-180")} />
          </span>
          <span className="text-sm font-bold text-[#C2A063]">{formatPrice(total)}</span>
        </button>
        {open && <div className="px-4 pb-4">{body}</div>}
      </div>

      {/* Desktop: card sticky */}
      <div className="hidden md:block sticky top-24 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <p className="text-sm font-bold text-gray-900 mb-4">Resumo do pedido</p>
        {body}
      </div>
    </div>
  );
};

export default LunaCartSummary;
