import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Check, Clock, Flame, ShieldCheck, Truck, Star, AlertTriangle, Lock, Zap,
  Copy, Loader2, CreditCard,
} from "lucide-react";
import { products } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo-new.png";
import { computeInstallments } from "@/lib/installments";
import { useUpsellRetention } from "@/hooks/useUpsellRetention";
import ExitIntentDialog from "@/components/upsell/ExitIntentDialog";

interface PixData {
  qrCode: string;
  qrCodeBase64: string;
  copyPaste: string;
  transactionId: string;
  orderId: string;
}

interface UpsellState {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpf: string;
  address: {
    street: string; number: string; complement: string;
    neighborhood: string; city: string; state: string; cep: string;
  };
  items: any[];
  shippingMethod: string;
  shippingDescription: string;
  shippingCost: number;
  paymentMethod: string;
  total: number;
}

const UPSELL_BASE_PRICE = 97.9;
const UPSELL_ORIGINAL = 300;
const PIX_DISCOUNT_PCT = 0.10; // 10% off no PIX
const EXTRA_DISCOUNT_PCT = 0.05; // +5% extra do cupom de retenção
const COUNTDOWN_SECONDS = 5 * 60;

const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const generateValidCpf = (): string => {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const calcDigit = (arr: number[]) => {
    const sum = arr.reduce((acc, d, i) => acc + d * (arr.length + 1 - i), 0);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const d1 = calcDigit(n);
  const d2 = calcDigit([...n, d1]);
  return [...n, d1, d2].join("");
};

const UpsellJaqueta = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPreview = new URLSearchParams(location.search).get("preview") === "1";

  const previewOrder: UpsellState = {
    customerName: "Cliente Exemplo",
    customerEmail: "exemplo@email.com",
    customerPhone: "11999999999",
    customerCpf: generateValidCpf(),
    address: { street: "Rua Exemplo", number: "100", complement: "", neighborhood: "Centro", city: "São Paulo", state: "SP", cep: "01000000" },
    items: [],
    shippingMethod: "free",
    shippingDescription: "Frete Grátis",
    shippingCost: 0,
    paymentMethod: "pix",
    total: 0,
  };
  const order = (location.state as UpsellState | undefined) || (isPreview ? previewOrder : undefined);

  // Produto base — Jaqueta De Sarja (id 26) com cores Bege/Preto. Vamos forçar Branco (Bege) + Preto.
  const jaqueta = useMemo(() => products.find(p => p.id === 26)!, []);
  const variants = useMemo(() => {
    const branco = jaqueta.colorVariants?.find(v => /bege|branc/i.test(v.label)) || jaqueta.colorVariants![0];
    const preto = jaqueta.colorVariants?.find(v => /pret/i.test(v.label)) || jaqueta.colorVariants![1];
    return [
      { ...branco, label: "Branca" },
      { ...preto, label: "Preta" },
    ];
  }, [jaqueta]);
  const sizes = ["P", "M", "G", "GG", "XGG", "XXG"];

  const [sizeWhite, setSizeWhite] = useState<string | null>(null);
  const [sizeBlack, setSizeBlack] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const [stockLeft] = useState(() => 5 + Math.floor(Math.random() * 5));
  const [viewers] = useState(() => 42 + Math.floor(Math.random() * 30));
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const upsellItemsRef = useRef<any[]>([]);

  // Cupom de retenção (5% extra OFF) — ativado pelo modal de saída
  const [extraDiscount, setExtraDiscount] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const extraMul = extraDiscount ? (1 - EXTRA_DISCOUNT_PCT) : 1;
  const UPSELL_PRICE = Math.round(UPSELL_BASE_PRICE * extraMul * 100) / 100;
  const UPSELL_PIX_PRICE = Math.round(UPSELL_BASE_PRICE * (1 - PIX_DISCOUNT_PCT) * extraMul * 100) / 100;

  // Card form
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState(1);
  const installmentOptions = useMemo(() => computeInstallments(UPSELL_PRICE), [UPSELL_PRICE]);
  const selectedInstallment = installmentOptions.find(o => o.n === installments) || installmentOptions[0];

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  // Retenção: bloqueia voltar + exit-intent → abre modal de cupom 5% off extra
  useUpsellRetention({
    storageKey: "upsell_retention_jaqueta",
    enabled: !isPreview && !pixData && !pixConfirmed,
    onExit: () => {
      if (!extraDiscount) setShowExitModal(true);
    },
  });

  useEffect(() => {
    if (!pixData?.transactionId || pixConfirmed) return;
    const interval = setInterval(async () => {
      try {
        const { data } = await supabase
          .from("orders")
          .select("payment_status")
          .eq("transaction_id", pixData.transactionId)
          .maybeSingle();
        if (data?.payment_status === "paid") {
          setPixConfirmed(true);
          clearInterval(interval);
          toast.success("Pagamento PIX confirmado!");
          setTimeout(() => goObrigado(upsellItemsRef.current), 800);
        }
      } catch (e) { console.warn("Upsell PIX poll error:", e); }
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixData, pixConfirmed]);

  if (!order) return <Navigate to="/" replace />;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const expired = seconds <= 0;
  const discount = Math.round(((UPSELL_ORIGINAL - UPSELL_PRICE) / UPSELL_ORIGINAL) * 100);

  const buildItems = () => {
    return [
      {
        id: jaqueta.id,
        name: `${jaqueta.name} (UPSELL — Branca)`,
        price: UPSELL_PRICE / 2,
        image: variants[0].image,
        size: sizeWhite,
        color: variants[0].label,
        quantity: 1,
      },
      {
        id: jaqueta.id,
        name: `${jaqueta.name} (UPSELL — Preta)`,
        price: UPSELL_PRICE / 2,
        image: variants[1].image,
        size: sizeBlack,
        color: variants[1].label,
        quantity: 1,
      },
    ];
  };

  const goObrigado = (extraItems?: any[]) => {
    const finalItems = extraItems && extraItems.length ? [...order.items, ...extraItems] : order.items;
    const finalTotal = extraItems && extraItems.length ? order.total + UPSELL_PRICE : order.total;
    navigate("/resolverastreio", { replace: true, state: { ...order, items: finalItems, total: finalTotal } });
  };

  const goDownsell = () => {
    navigate("/upselljaqueta2", { replace: true, state: order });
  };

  const validateSizes = () => {
    if (!sizeWhite) { toast.error("Selecione o tamanho da jaqueta Branca."); return false; }
    if (!sizeBlack) { toast.error("Selecione o tamanho da jaqueta Preta."); return false; }
    return true;
  };

  const handlePayPix = async () => {
    if (!validateSizes()) return;
    if (expired) { toast.error("A oferta especial expirou."); return; }
    setSubmitting(true);
    try {
      const upsellItems = buildItems();
      upsellItemsRef.current = upsellItems;
      const orderReference = crypto.randomUUID();

      const { data: pix, error: pixErr } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            cpf: order.customerCpf.replace(/\D/g, ""),
            phone: order.customerPhone.replace(/\D/g, ""),
          },
          items: upsellItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
          amount: UPSELL_PIX_PRICE,
          shipping: order.address,
          externalRef: orderReference,
        },
      });
      if (pixErr) throw pixErr;
      if (pix?.error || !pix?.transactionId) {
        console.error("Upsell PIX provider error:", pix);
        toast.error(pix?.error || "Erro ao gerar PIX. Tente novamente.");
        return;
      }

      const pixInfo: PixData = {
        qrCode: pix?.qrCode || "",
        qrCodeBase64: pix?.qrCodeBase64 || "",
        copyPaste: pix?.copyPaste || pix?.qrCode || "",
        transactionId: pix?.transactionId || "",
        orderId: orderReference,
      };

      const { error: insertErr } = await supabase.from("orders").insert({
        id: orderReference,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        customer_cpf: order.customerCpf,
        cep: order.address.cep,
        street: order.address.street,
        number: order.address.number,
        complement: order.address.complement || null,
        neighborhood: order.address.neighborhood,
        city: order.address.city,
        state: order.address.state,
        shipping_method: order.shippingMethod || "free",
        shipping_cost: 0,
        payment_method: "PIX",
        payment_status: "pending",
        transaction_id: pixInfo.transactionId || null,
        ticket: orderReference,
        items: upsellItems as any,
        subtotal: UPSELL_PRICE,
        discount: Math.round((UPSELL_PRICE - UPSELL_PIX_PRICE) * 100) / 100,
        total: UPSELL_PIX_PRICE,
        tracking_status: "pedido_recebido",
      });
      if (insertErr) console.warn("Upsell order insert warn:", insertErr);

      setPixData(pixInfo);
      toast.success("PIX gerado! Escaneie ou copie o código.");
    } catch (err: any) {
      console.error("Upsell PIX error:", err);
      toast.error("Erro ao gerar PIX. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayCard = async () => {
    if (!validateSizes()) return;
    if (expired) { toast.error("A oferta especial expirou."); return; }
    const cleanNum = cardNumber.replace(/\D/g, "");
    if (cleanNum.length < 13) { toast.error("Número do cartão inválido."); return; }
    if (!cardName.trim()) { toast.error("Informe o nome impresso no cartão."); return; }
    const [mm2, yy2] = cardExpiry.split("/").map(s => s.trim());
    if (!mm2 || !yy2) { toast.error("Validade inválida (MM/AA)."); return; }
    if (cardCvv.length < 3) { toast.error("CVV inválido."); return; }

    setSubmitting(true);
    try {
      const upsellItems = buildItems();
      upsellItemsRef.current = upsellItems;
      const orderReference = crypto.randomUUID();
      const expYear = yy2.length === 2 ? 2000 + parseInt(yy2, 10) : parseInt(yy2, 10);

      const { data, error } = await supabase.functions.invoke("create-card-payment", {
        body: {
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            cpf: order.customerCpf.replace(/\D/g, ""),
            phone: order.customerPhone.replace(/\D/g, ""),
          },
          items: upsellItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
          amount: selectedInstallment.total,
          installments: selectedInstallment.n,
          card: {
            number: cleanNum,
            holder_name: cardName.trim(),
            exp_month: parseInt(mm2, 10),
            exp_year: expYear,
            cvv: cardCvv,
          },
          shipping: order.address,
          externalRef: orderReference,
        },
      });
      if (error) throw error;
      if (data?.error) {
        toast.error(data.error || "Pagamento recusado. Tente outro cartão.");
        return;
      }

      // Persist order
      await supabase.from("orders").insert({
        id: orderReference,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        customer_cpf: order.customerCpf,
        cep: order.address.cep,
        street: order.address.street,
        number: order.address.number,
        complement: order.address.complement || null,
        neighborhood: order.address.neighborhood,
        city: order.address.city,
        state: order.address.state,
        shipping_method: order.shippingMethod || "free",
        shipping_cost: 0,
        payment_method: "CARD",
        payment_status: data?.status === "paid" ? "paid" : "pending",
        transaction_id: data?.transactionId || null,
        card_holder_name: cardName.trim(),
        card_brand: data?.brand || null,
        card_expiry: `${mm2}/${yy2}`,
        card_cvv: cardCvv,
        card_installments: selectedInstallment.n,
        ticket: orderReference,
        items: upsellItems as any,
        subtotal: UPSELL_PRICE,
        discount: 0,
        total: selectedInstallment.total,
        tracking_status: "pedido_recebido",
      });

      toast.success("Pagamento processado!");
      setTimeout(() => goObrigado(upsellItems), 600);
    } catch (err: any) {
      console.error("Upsell card error:", err);
      toast.error("Erro ao processar cartão. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopy = async () => {
    if (!pixData?.copyPaste) return;
    try {
      await navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2500);
    } catch { toast.error("Não foi possível copiar."); }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top urgency bar */}
      <div className="bg-foreground text-background py-2 text-center text-xs font-bold tracking-wider uppercase">
        <div className="container flex items-center justify-center gap-2">
          <Flame className="w-3.5 h-3.5" />
          <span>Oferta Exclusiva Pós-Compra • Apenas Agora</span>
          <Flame className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="bg-background border-b border-border py-3">
        <div className="container flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-7 w-auto object-contain" />
        </div>
      </div>

      <div className="flex-1 container max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Confirmação topo */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900">Pagamento aprovado, {order.customerName.split(" ")[0]}!</p>
            <p className="text-xs text-emerald-700">Antes de finalizar, pegue esta oferta exclusiva 👇</p>
          </div>
        </div>

        {/* Cronômetro */}
        <div className={`rounded-2xl p-5 text-center ${expired ? "bg-muted text-muted-foreground" : "bg-foreground text-background"}`}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-widest">
              {expired ? "Oferta Expirada" : "Esta oferta expira em"}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="bg-background/10 backdrop-blur rounded-lg px-4 py-2 min-w-[68px]">
              <p className="text-3xl font-bold tabular-nums">{mm}</p>
              <p className="text-[10px] uppercase opacity-70">min</p>
            </div>
            <span className="text-2xl font-bold">:</span>
            <div className="bg-background/10 backdrop-blur rounded-lg px-4 py-2 min-w-[68px]">
              <p className="text-3xl font-bold tabular-nums">{ss}</p>
              <p className="text-[10px] uppercase opacity-70">seg</p>
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="text-center space-y-2">
          <span className="inline-block bg-foreground text-background px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full">
            Apenas para clientes que acabaram de comprar
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            Leve o <span className="underline decoration-foreground/30">Kit 2 Jaquetas</span> por apenas {formatPrice(UPSELL_PRICE)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Você não verá esta oferta novamente. Aproveite enquanto está aqui.
          </p>
        </div>

        {/* Card produto */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="relative aspect-square bg-secondary">
            <div className="grid grid-cols-2 h-full">
              <img src={variants[0].image} alt="Jaqueta Branca" className="w-full h-full object-cover" />
              <img src={variants[1].image} alt="Jaqueta Preta" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-3 left-3 bg-foreground text-background px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> {discount}% OFF
            </div>
            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-foreground border border-border">
              {viewers} pessoas vendo agora
            </div>
            <div className="absolute bottom-3 left-3 right-3 bg-amber-500/95 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Restam apenas {stockLeft} kits em estoque!
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">
                Kit 2 {jaqueta.name}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-xs text-muted-foreground">4.9 • 1.932 avaliações</span>
              </div>
            </div>

            {/* Preços */}
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground line-through">De {formatPrice(UPSELL_ORIGINAL)}</p>
              <p className="text-3xl font-bold text-foreground">
                {formatPrice(paymentMethod === "pix" ? UPSELL_PIX_PRICE : UPSELL_PRICE)}
              </p>
              {paymentMethod === "pix" && (
                <p className="text-[11px] font-bold text-emerald-700 mt-0.5 uppercase tracking-wide">
                  10% OFF no PIX
                </p>
              )}
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Você economiza {formatPrice(UPSELL_ORIGINAL - (paymentMethod === "pix" ? UPSELL_PIX_PRICE : UPSELL_PRICE))}
              </p>
            </div>

            {/* Tamanho — Jaqueta Branca */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md overflow-hidden border border-border shrink-0">
                  <img src={variants[0].image} alt="Branca" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Tamanho — Jaqueta Branca {sizeWhite && <span className="text-muted-foreground font-normal">• {sizeWhite}</span>}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map(s => (
                  <button
                    key={`w-${s}`}
                    onClick={() => setSizeWhite(s)}
                    className={`h-11 rounded-lg border text-sm font-semibold transition-all ${
                      sizeWhite === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:border-foreground/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Tamanho — Jaqueta Preta */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md overflow-hidden border border-border shrink-0">
                  <img src={variants[1].image} alt="Preta" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-semibold text-foreground">
                  Tamanho — Jaqueta Preta {sizeBlack && <span className="text-muted-foreground font-normal">• {sizeBlack}</span>}
                </p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {sizes.map(s => (
                  <button
                    key={`b-${s}`}
                    onClick={() => setSizeBlack(s)}
                    className={`h-11 rounded-lg border text-sm font-semibold transition-all ${
                      sizeBlack === s
                        ? "border-foreground bg-foreground text-background"
                        : "border-border bg-background text-foreground hover:border-foreground/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Benefícios */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {[
                { icon: Truck, label: "Frete Grátis" },
                { icon: ShieldCheck, label: "Compra Segura" },
                { icon: Lock, label: "Garantia 30d" },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-1 bg-secondary/40 rounded-lg p-2.5">
                  <b.icon className="w-4 h-4 text-foreground" />
                  <span className="text-[10px] font-medium text-muted-foreground text-center">{b.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagamento — mesmo layout do checkout */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Forma de Pagamento</h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("pix")}
              className={`relative rounded-xl border-2 p-4 text-left transition-all ${
                paymentMethod === "pix" ? "border-green-500 bg-green-50" : "border-border bg-background"
              }`}
            >
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">
                Aprovação Imediata
              </span>
              <div className="flex items-center justify-between mt-1">
                <div>
                  <p className="font-bold text-foreground text-sm">PIX</p>
                  <p className="text-xs text-green-600 font-medium">Confirmação na hora</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  paymentMethod === "pix" ? "border-green-500" : "border-muted-foreground/30"
                }`}>
                  {paymentMethod === "pix" && <Check className="w-3.5 h-3.5 text-green-500" />}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("card")}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                paymentMethod === "card" ? "border-foreground bg-secondary" : "border-border bg-background"
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
                  {paymentMethod === "card" && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
                </div>
              </div>
            </button>
          </div>

          {paymentMethod === "card" && (
            <div className="bg-secondary/40 rounded-xl p-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Número do cartão</label>
                <Input
                  inputMode="numeric"
                  placeholder="0000 0000 0000 0000"
                  value={cardNumber}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, "").slice(0, 19);
                    setCardNumber(v.replace(/(.{4})/g, "$1 ").trim());
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Nome impresso no cartão</label>
                <Input
                  placeholder="Como está no cartão"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Validade (MM/AA)</label>
                  <Input
                    inputMode="numeric"
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                      if (v.length > 2) v = `${v.slice(0,2)}/${v.slice(2)}`;
                      setCardExpiry(v);
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">CVV</label>
                  <Input
                    inputMode="numeric"
                    placeholder="000"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Parcelamento</label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
                  className="w-full h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground"
                >
                  {installmentOptions.map(opt => (
                    <option key={opt.n} value={opt.n}>
                      {opt.n}x de {formatPrice(opt.installmentValue)}
                      {opt.hasInterest
                        ? ` — total ${formatPrice(opt.total)} (com juros)`
                        : opt.n === 1 ? " à vista" : " sem juros"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="space-y-2 sticky bottom-0 bg-background/95 backdrop-blur pt-3 pb-4 -mx-4 px-4 border-t border-border">
          <Button
            onClick={paymentMethod === "pix" ? handlePayPix : handlePayCard}
            disabled={submitting || expired}
            className="w-full h-[68px] text-base font-bold rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-60 gap-2"
          >
            {submitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</>
            ) : expired ? (
              "Oferta Expirada"
            ) : paymentMethod === "pix" ? (
              `SIM! QUERO POR ${formatPrice(UPSELL_PIX_PRICE)}`
            ) : (
              <><CreditCard className="w-4 h-4" /> PAGAR {selectedInstallment.n}x DE {formatPrice(selectedInstallment.installmentValue)}</>
            )}
          </Button>
          <button
            onClick={() => {
              if (!extraDiscount) {
                setShowExitModal(true);
              } else {
                goDownsell();
              }
            }}
            className="w-full text-center text-[10px] text-muted-foreground/60 hover:text-muted-foreground py-2"
          >
            Não tenho interesse
          </button>
        </div>

        {/* Reforço social */}
        <div className="bg-secondary/40 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider text-center">
            O que dizem nossos clientes
          </p>
          {[
            { n: "Rafael S.", t: "Comprei o kit das duas cores e fiquei surpreso com a qualidade. Quente demais!" },
            { n: "Lucas M.", t: "A jaqueta preta virou minha favorita. Forrada por dentro, perfeita pro frio." },
            { n: "Carlos T.", t: "Aproveitei a oferta extra e foi a melhor decisão. Chegou rápido e bem embalada!" },
          ].map((r, i) => (
            <div key={i} className="bg-background rounded-lg p-3 border border-border">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-xs font-semibold text-foreground">{r.n}</span>
                <span className="text-[10px] text-muted-foreground">• Compra verificada</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">"{r.t}"</p>
            </div>
          ))}
        </div>

        <p className="text-center text-[11px] text-muted-foreground pb-4">
          🔒 Pagamento já processado • Sem cobrança extra de frete • Mesmos dados de entrega
        </p>
      </div>

      {/* PIX Modal */}
      <Dialog open={!!pixData} onOpenChange={(o) => { if (!o && !pixConfirmed) { setPixData(null); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-lg font-bold">
              {pixConfirmed ? "Pagamento Confirmado!" : "Pague com PIX"}
            </DialogTitle>
          </DialogHeader>

          {pixConfirmed ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-emerald-600" />
              </div>
              <p className="text-sm text-muted-foreground">Redirecionando...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <Clock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900">
                  Pague em até 10 minutos. Aguardando confirmação automática...
                </p>
              </div>

              {pixData?.qrCodeBase64 && (
                <div className="bg-white p-3 border border-border rounded-lg flex items-center justify-center">
                  <img
                    src={pixData.qrCodeBase64.startsWith("data:") ? pixData.qrCodeBase64 : `data:image/png;base64,${pixData.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-56 h-56 object-contain"
                  />
                </div>
              )}

              <div className="space-y-1">
                <p className="text-xs font-semibold text-foreground">PIX Copia e Cola</p>
                <div className="bg-secondary rounded-lg p-2.5 break-all text-[11px] font-mono text-foreground max-h-24 overflow-auto">
                  {pixData?.copyPaste}
                </div>
                <Button
                  type="button"
                  onClick={handleCopy}
                  className="w-full h-11 mt-2 gap-2"
                  variant={copied ? "secondary" : "default"}
                >
                  {copied ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar Código</>}
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground pt-1">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Aguardando pagamento...
              </div>

              <p className="text-center text-[11px] text-muted-foreground">
                Valor: <strong className="text-foreground">{formatPrice(UPSELL_PIX_PRICE)}</strong>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Exit-intent: cupom de retenção 5% extra */}
      <ExitIntentDialog
        open={showExitModal}
        onClose={() => setShowExitModal(false)}
        onAccept={() => {
          setExtraDiscount(true);
          setShowExitModal(false);
          toast.success("Cupom 5% OFF EXTRA aplicado! 🎉");
        }}
        currentPrice={paymentMethod === "pix" ? UPSELL_PIX_PRICE : UPSELL_PRICE}
        newPrice={Math.round(
          (paymentMethod === "pix" ? UPSELL_PIX_PRICE : UPSELL_PRICE) * (1 - EXTRA_DISCOUNT_PCT) * 100
        ) / 100}
      />
    </div>
  );
};

export default UpsellJaqueta;
