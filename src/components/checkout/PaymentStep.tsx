import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CreditCard, Loader2, QrCode } from "lucide-react";
import type { InstallmentOption } from "@/lib/installments";
import SslNote from "./luna/SslNote";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export interface PaymentStepProps {
  paymentMethod: string;
  onSelectMethod: (method: string) => void;
  subtotal: number;
  shippingCost: number;
  couponDiscount: number;
  pixDiscount: number;
  pixDiscountLabel: string;
  total: number;
  cardTotal: number;
  installments: string;
  onInstallmentsChange: (value: string) => void;
  installmentOptions: InstallmentOption[];
  cardHolderName: string;
  cardNumber: string;
  cardExpiry: string;
  cardCvv: string;
  cardBrand: string | null;
  onCardChange: (field: "holder" | "number" | "expiry" | "cvv", value: string) => void;
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
  children?: ReactNode;
}

const labelClass = "text-[10px] font-semibold uppercase tracking-wide text-gray-500";
const fieldClass =
  "h-11 rounded-md border-gray-300 bg-white text-sm focus-visible:ring-[#be7e5b] focus-visible:border-[#be7e5b]";

export const PaymentStep = ({
  paymentMethod,
  onSelectMethod,
  subtotal,
  shippingCost,
  couponDiscount,
  pixDiscount,
  pixDiscountLabel,
  total,
  cardTotal,
  installments,
  onInstallmentsChange,
  installmentOptions,
  cardHolderName,
  cardNumber,
  cardExpiry,
  cardCvv,
  cardBrand,
  onCardChange,
  isSubmitting,
  onSubmit,
  onBack,
  children,
}: PaymentStepProps) => {
  const isPix = paymentMethod === "pix";
  const displayTotal = isPix ? total : cardTotal;

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-bold text-gray-900">Forma de pagamento</h2>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onSelectMethod("pix")}
          className={cn(
            "relative rounded-xl border p-4 text-left transition-colors",
            isPix ? "border-[#be7e5b] bg-[#be7e5b]/5" : "border-gray-200 bg-white hover:border-gray-300",
          )}
        >
          <span className="absolute -top-2 left-3 rounded-full bg-[#be7e5b] px-2 py-0.5 text-[9px] font-bold uppercase text-white">
            Aprovação imediata
          </span>
          <QrCode className={cn("w-5 h-5 mb-2", isPix ? "text-[#be7e5b]" : "text-gray-400")} />
          <span className="block text-xs font-bold text-gray-900">PIX</span>
          <span className="block text-[10px] font-semibold text-green-600">{pixDiscountLabel} de desconto</span>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod("credit")}
          className={cn(
            "rounded-xl border p-4 text-left transition-colors",
            !isPix ? "border-[#be7e5b] bg-[#be7e5b]/5" : "border-gray-200 bg-white hover:border-gray-300",
          )}
        >
          <CreditCard className={cn("w-5 h-5 mb-2", !isPix ? "text-[#be7e5b]" : "text-gray-400")} />
          <span className="block text-xs font-bold text-gray-900">Cartão de crédito</span>
          <span className="block text-[10px] text-gray-500">Em até 12x</span>
        </button>
      </div>

      {!isPix && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="space-y-1">
            <label className={labelClass}>Nome do titular</label>
            <Input autoComplete="off" value={cardHolderName} onChange={(e) => onCardChange("holder", e.target.value)} className={fieldClass} />
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Número do cartão</label>
            <div className="relative">
              <Input
                autoComplete="off"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => onCardChange("number", e.target.value)}
                className={fieldClass}
              />
              {cardBrand && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-[#be7e5b]">
                  {cardBrand}
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className={labelClass}>Validade</label>
              <Input autoComplete="off" inputMode="numeric" placeholder="MM/AA" value={cardExpiry} onChange={(e) => onCardChange("expiry", e.target.value)} className={fieldClass} />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>CVV</label>
              <Input autoComplete="off" inputMode="numeric" placeholder="000" value={cardCvv} onChange={(e) => onCardChange("cvv", e.target.value)} className={fieldClass} />
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClass}>Parcelas</label>
            <select
              value={installments}
              onChange={(e) => onInstallmentsChange(e.target.value)}
              className="w-full h-11 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#be7e5b]"
            >
              {installmentOptions.map((opt) => (
                <option key={opt.n} value={String(opt.n)}>
                  {opt.n}x de {formatPrice(opt.installmentValue)} {opt.hasInterest ? "" : "sem juros"}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {children}

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2 text-xs">
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
            <span>Cupom</span>
            <span className="font-medium">- {formatPrice(couponDiscount)}</span>
          </div>
        )}
        {isPix && pixDiscount > 0 && (
          <div className="flex items-center justify-between text-green-600">
            <span>Desconto PIX</span>
            <span className="font-medium">- {formatPrice(pixDiscount)}</span>
          </div>
        )}
        <div className="h-px bg-gray-200" />
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800">Total</span>
          <span className="text-lg font-bold text-[#be7e5b]">{formatPrice(displayTotal)}</span>
        </div>
      </div>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={isSubmitting}
        className="w-full bg-[#be7e5b] hover:bg-[#a66b48] text-white font-bold h-[58px] md:h-[68px] text-base md:text-lg rounded-md uppercase disabled:opacity-70"
      >
        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finalizar compra"}
      </Button>

      <SslNote />


      <button type="button" onClick={onBack} className="w-full text-xs text-gray-500 hover:text-[#be7e5b] transition-colors">
        Voltar
      </button>
    </div>
  );
};

export default PaymentStep;
