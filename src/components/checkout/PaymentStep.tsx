import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, QrCode, Copy, Check, CreditCard } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

interface PixPaymentData {
  qrCode?: string;
  qrCodeBase64?: string;
  copyPaste?: string;
  transactionId?: string;
}

interface PaymentStepProps {
  shippingCost: number;
  onBack: () => void;
}

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const PaymentStep = ({ shippingCost, onBack }: PaymentStepProps) => {
  const { items, totalPrice, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [copied, setCopied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");

  const hasOnly46 = items.length > 0 && items.every(i => i.id === 46);
  const hasMixed46 = items.some(i => i.id === 46) && items.some(i => i.id !== 46);
  const pixDiscountLabel = hasOnly46 ? "5%" : hasMixed46 ? "até 10%" : "10%";

  const itemsSubtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0) || 1;
  const itemsAt5 = items.filter(i => i.id === 46).reduce((sum, it) => sum + it.price * it.quantity, 0);
  const itemsAt10 = itemsSubtotal - itemsAt5;
  const remainder = shippingCost; // frete
  const blendedRate = (itemsAt5 * 0.05 + itemsAt10 * 0.10 + Math.max(remainder, 0) * 0.10) / Math.max(totalPrice + shippingCost, 1);

  const grandTotal = totalPrice + shippingCost;
  const pixDiscount = Math.round(grandTotal * blendedRate * 100) / 100;
  const pixTotal = grandTotal - pixDiscount;

  const handleCopyPix = async () => {
    const code = pixData?.copyPaste || pixData?.qrCode || "";
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handlePayPix = async () => {
    setIsSubmitting(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    try {
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          customer: { name: "Cliente", email: "cliente@email.com", cpf: "00000000000", phone: "00000000000" },
          items: items.map((item) => ({ name: item.name, price: item.price, quantity: item.quantity })),
          amount: pixTotal,
        },
      });
      if (error) throw error;
      if (data?.error || !data?.transactionId) {
        console.error("PIX provider error:", data);
        toast.error(data?.error || "Erro ao gerar pagamento PIX. Tente novamente.");
        return;
      }

      const pixInfo: PixPaymentData = {
        qrCode: data?.pix?.qrCode || data?.qrCode || "",
        qrCodeBase64: data?.pix?.qrCodeBase64 || data?.qrCodeBase64 || "",
        copyPaste: data?.pix?.copyPaste || data?.pix?.copy_paste || data?.copyPaste || data?.pix?.qrCode || data?.qrCode || "",
        transactionId: data?.id || data?.transactionId || "",
      };
      setPixData(pixInfo);
      toast.success("PIX gerado com sucesso!");
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error("Erro ao gerar pagamento PIX. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (pixData) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pixData]);

  if (pixData) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto">
          <QrCode className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Pagamento PIX</h2>
        <p className="text-muted-foreground text-sm">Escaneie o QR Code ou copie o código para pagar</p>

        <div className="bg-secondary rounded-xl p-6 space-y-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground line-through">{formatPrice(grandTotal)}</p>
            <p className="text-2xl font-bold text-green-600">{formatPrice(pixTotal)}</p>
            <p className="text-xs font-semibold text-green-600">{pixDiscountLabel} de desconto no PIX — você economiza {formatPrice(pixDiscount)}</p>
          </div>
          {pixData.qrCodeBase64 ? (
            <img src={`data:image/png;base64,${pixData.qrCodeBase64}`} alt="QR Code PIX" className="w-48 h-48 mx-auto rounded-lg" />
          ) : (
            <div className="w-48 h-48 mx-auto rounded-lg bg-muted flex items-center justify-center">
              <QrCode className="w-20 h-20 text-muted-foreground/30" />
            </div>
          )}
          {(pixData.copyPaste || pixData.qrCode) && (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Código Copia e Cola</p>
              <div className="bg-muted rounded-lg p-3 text-xs text-foreground break-all max-h-24 overflow-y-auto">
                {pixData.copyPaste || pixData.qrCode}
              </div>
              <Button onClick={handleCopyPix} variant="outline" className="w-full gap-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copiado!" : "Copiar Código PIX"}
              </Button>
            </div>
          )}
        </div>

        <div className="bg-secondary rounded-xl p-5 text-left space-y-3">
          <p className="text-sm font-semibold text-foreground">📲 Como pagar com PIX:</p>
          <ol className="text-xs text-muted-foreground space-y-2 list-decimal list-inside">
            <li>Abra o <strong className="text-foreground">app do seu banco</strong> ou carteira digital</li>
            <li>Escolha a opção <strong className="text-foreground">Pagar com PIX</strong></li>
            <li>Escaneie o <strong className="text-foreground">QR Code acima</strong> ou toque em <strong className="text-foreground">"Copiar Código PIX"</strong> e cole na opção <strong className="text-foreground">PIX Copia e Cola</strong></li>
            <li>Confirme o valor de <strong className="text-foreground">{formatPrice(pixTotal)}</strong> e finalize</li>
            <li>Pronto! O pagamento é <strong className="text-foreground">confirmado na hora</strong> ✅</li>
          </ol>
        </div>

        <p className="text-xs text-muted-foreground">O pagamento será confirmado automaticamente após a transferência.</p>

        <Link to="/">
          <Button variant="ghost" className="w-full" onClick={() => { clearCart(); }}>
            Voltar às Compras
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Pagamento</h2>

      {/* Payment method selector */}
      <div className="grid grid-cols-2 gap-3">
        {/* PIX option */}
        <button
          type="button"
          onClick={() => setPaymentMethod("pix")}
          className={`relative rounded-xl border-2 p-4 text-left transition-all ${
            paymentMethod === "pix"
              ? "border-green-500 bg-green-50"
              : "border-border bg-background"
          }`}
        >
          <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
            Aprovação Imediata
          </span>
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="font-bold text-foreground text-sm">PIX</p>
              <p className="text-xs text-green-600 font-medium">{pixDiscountLabel} de desconto</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === "pix" ? "border-green-500" : "border-muted-foreground/30"
            }`}>
              {paymentMethod === "pix" && (
                <Check className="w-3.5 h-3.5 text-green-500" />
              )}
            </div>
          </div>
        </button>

        {/* Card option */}
        <button
          type="button"
          onClick={() => setPaymentMethod("card")}
          className={`rounded-xl border-2 p-4 text-left transition-all ${
            paymentMethod === "card"
              ? "border-foreground bg-secondary"
              : "border-border bg-background"
          }`}
        >
          <div className="flex items-center justify-between mt-1">
            <div>
              <p className="font-bold text-foreground text-sm">Cartão</p>
              <p className="text-xs text-muted-foreground">Cartão de crédito</p>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
              paymentMethod === "card" ? "border-foreground" : "border-muted-foreground/30"
            }`}>
              {paymentMethod === "card" && (
                <div className="w-2.5 h-2.5 rounded-full bg-foreground" />
              )}
            </div>
          </div>
        </button>
      </div>

      {/* Order summary */}
      <div className="bg-secondary rounded-lg p-5 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="text-foreground">{formatPrice(totalPrice)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Frete</span>
          <span className={shippingCost === 0 ? "text-green-600 font-medium" : "text-foreground"}>
            {shippingCost === 0 ? "Grátis" : formatPrice(shippingCost)}
          </span>
        </div>
        {paymentMethod === "pix" && (
          <div className="flex justify-between text-sm text-green-600 font-medium">
            <span>Desconto PIX ({pixDiscountLabel})</span>
            <span>- {formatPrice(pixDiscount)}</span>
          </div>
        )}
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
          <span className="text-foreground">Total</span>
          <span className="text-foreground">
            {formatPrice(paymentMethod === "pix" ? pixTotal : grandTotal)}
          </span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        {paymentMethod === "pix" ? (
          <Button size="lg" className="flex-1 gap-2" disabled={isSubmitting} onClick={handlePayPix}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Gerando PIX...
              </>
            ) : (
              `PAGAR COM PIX — ${formatPrice(pixTotal)}`
            )}
          </Button>
        ) : (
          <Button size="lg" className="flex-1 gap-2" disabled>
            <CreditCard className="w-4 h-4" />
            Em breve
          </Button>
        )}
      </div>
    </div>
  );
};

export default PaymentStep;
