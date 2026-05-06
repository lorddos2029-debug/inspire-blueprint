import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Check, Clock, Flame, ShieldCheck, Truck, Star, AlertTriangle, Lock, Zap,
  Copy, Loader2, Sparkles, QrCode, CreditCard,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo-new.png";
import { getFunnelStep } from "@/data/upsellFunnel";
import { useUpsellRetention } from "@/hooks/useUpsellRetention";
import ExitIntentDialog from "@/components/upsell/ExitIntentDialog";

interface OneClickCard {
  number: string;
  holderName: string;
  expiry: string; // MM/AA
  cvv: string;
  brand?: string;
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
  oneClickCard?: OneClickCard;
}

interface PixData {
  qrCode: string;
  qrCodeBase64: string;
  copyPaste: string;
  transactionId: string;
  orderId: string;
}

const COUNTDOWN_SECONDS = 5 * 60;
const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const onlyDigits = (v: string) => v.replace(/\D/g, "");
const formatCardNumber = (v: string) => onlyDigits(v).slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
const formatExpiry = (v: string) => {
  const d = onlyDigits(v).slice(0, 4);
  return d.length <= 2 ? d : `${d.slice(0, 2)}/${d.slice(2)}`;
};

const generateValidCpf = (): string => {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const calc = (arr: number[]) => {
    const sum = arr.reduce((a, d, i) => a + d * (arr.length + 1 - i), 0);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const d1 = calc(n);
  const d2 = calc([...n, d1]);
  return [...n, d1, d2].join("");
};

interface Props {
  stepId: string;
}

const UpsellPage = ({ stepId }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const step = getFunnelStep(stepId);

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
  // Persist order across funnel navigation / reloads
  const stateOrder = location.state as UpsellState | undefined;
  let storedOrder: UpsellState | undefined;
  try {
    const raw = sessionStorage.getItem("upsell_funnel_order");
    if (raw) storedOrder = JSON.parse(raw);
  } catch {}
  const order = stateOrder || storedOrder || (isPreview ? previewOrder : undefined);
  useEffect(() => {
    if (stateOrder) {
      try { sessionStorage.setItem("upsell_funnel_order", JSON.stringify(stateOrder)); } catch {}
    }
  }, [stateOrder]);

  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [stockLeft] = useState(() => 6 + Math.floor(Math.random() * 5));
  const [viewers] = useState(() => 42 + Math.floor(Math.random() * 28));

  const hasOneClick = !!(order as UpsellState | undefined)?.oneClickCard?.number;
  // payment method UI state — abre em "card" se há 1-clique disponível
  const [paymentTab, setPaymentTab] = useState<"pix" | "card">(hasOneClick ? "card" : "pix");
  const [submitting, setSubmitting] = useState(false);

  // PIX
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixSeconds, setPixSeconds] = useState(10 * 60);

  // Card form
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [installments, setInstallments] = useState(1);

  // Tamanho (obrigatório quando o step define product.sizes)
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Cupom de retenção (5% extra OFF) — ativado pelo modal de saída
  const [extraDiscount, setExtraDiscount] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const upsellItemRef = useRef<any>(null);

  // Session id para correlacionar view -> aceito/recusado
  const sessionIdRef = useRef<string>("");
  if (!sessionIdRef.current) {
    try {
      let sid = sessionStorage.getItem("upsell_session_id");
      if (!sid) {
        sid = crypto.randomUUID();
        sessionStorage.setItem("upsell_session_id", sid);
      }
      sessionIdRef.current = sid;
    } catch {
      sessionIdRef.current = crypto.randomUUID();
    }
  }

  // Track helper — fire-and-forget
  const trackEvent = (event: "view" | "accepted" | "rejected" | "exit_modal_view" | "exit_modal_accepted" | "exit_modal_rejected" | "oneclick_attempt") => {
    if (isPreview) return;
    try {
      supabase.from("upsell_events").insert({
        step_id: stepId,
        kind: step?.kind || "upsell",
        event,
        product_name: step?.product?.name || null,
        price: step?.product?.price || 0,
        session_id: sessionIdRef.current,
      }).then(({ error }) => {
        if (error) console.warn("upsell_events insert warn:", error.message);
      });
    } catch (e) { console.warn("trackEvent err:", e); }
  };

  // Track VIEW once per step mount (when order is available)
  const viewTrackedRef = useRef(false);
  useEffect(() => {
    if (!step || !order || viewTrackedRef.current) return;
    viewTrackedRef.current = true;
    trackEvent("view");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, order]);

  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  // Retenção: bloqueia voltar + exit-intent → abre modal de cupom 5% off extra
  useUpsellRetention({
    storageKey: `upsell_retention_${stepId}`,
    enabled: !isPreview && !pixData && !pixConfirmed,
    onExit: () => {
      if (!extraDiscount) {
        trackEvent("exit_modal_view");
        setShowExitModal(true);
      }
    },
  });

  // PIX countdown (10 min) — restarts when a new PIX is generated
  useEffect(() => {
    if (!pixData || pixConfirmed) return;
    setPixSeconds(10 * 60);
    const t = setInterval(() => setPixSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [pixData, pixConfirmed]);

  // Pre-fill holder name
  useEffect(() => {
    if (order?.customerName && !cardHolder) setCardHolder(order.customerName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  // PIX polling
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
          setTimeout(() => goNext(true, upsellItemRef.current), 800);
        }
      } catch (e) { console.warn("Upsell PIX poll error:", e); }
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixData, pixConfirmed]);

  if (!step) return <Navigate to="/" replace />;
  if (!order) return <Navigate to="/" replace />;

  const { product, onAcceptNext, onRejectNext, kind } = step;
  const PIX_DISCOUNT_PCT = 0.05; // 5% off no PIX (todos os upsells/downsells)
  const EXTRA_DISCOUNT_PCT = 0.05; // +5% extra do cupom de retenção
  const extraMul = extraDiscount ? (1 - EXTRA_DISCOUNT_PCT) : 1;
  const pixPrice = Math.round(product.price * (1 - PIX_DISCOUNT_PCT) * extraMul * 100) / 100;
  const cardPrice = Math.round(product.price * extraMul * 100) / 100;
  const displayedPrice = paymentTab === "pix" ? pixPrice : cardPrice;
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");
  const expired = seconds <= 0;
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const goNext = (accepted: boolean, extraItem?: any) => {
    trackEvent(accepted ? "accepted" : "rejected");
    const target = accepted ? onAcceptNext : onRejectNext;
    const finalItems = extraItem ? [...order.items, extraItem] : order.items;
    const finalTotal = extraItem ? order.total + product.price : order.total;
    navigate(target, {
      replace: true,
      state: { ...order, items: finalItems, total: finalTotal },
    });
  };

  const buildUpsellItem = () => ({
    id: product.id,
    name: `${product.name} (UPSELL)`,
    price: product.price,
    image: product.image,
    quantity: 1,
    ...(selectedSize ? { size: selectedSize } : {}),
  });

  const requireSize = () => {
    if (product.sizes && !selectedSize) {
      toast.error("Escolha o tamanho destacado abaixo.");
      const el = document.getElementById("upsell-size-picker");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      return false;
    }
    return true;
  };

  // ============ PIX ============
  const handleAcceptPix = async () => {
    if (!requireSize()) return;
    
    setSubmitting(true);
    try {
      const item = buildUpsellItem();
      upsellItemRef.current = item;
      const orderReference = crypto.randomUUID();

      const { data: pix, error: pixErr } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            cpf: order.customerCpf.replace(/\D/g, ""),
            phone: order.customerPhone.replace(/\D/g, ""),
          },
          items: [{ name: item.name, price: pixPrice, quantity: 1 }],
          amount: pixPrice,
          shipping: {
            street: order.address.street, number: order.address.number,
            complement: order.address.complement, neighborhood: order.address.neighborhood,
            city: order.address.city, state: order.address.state, cep: order.address.cep,
          },
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
        items: [item] as any,
        subtotal: product.price,
        discount: Math.round((product.price - pixPrice) * 100) / 100,
        total: pixPrice,
        tracking_status: "pedido_recebido",
      });
      if (insertErr) console.warn("Upsell order insert warn:", insertErr);

      setPixData(pixInfo);
      toast.success("PIX gerado! Escaneie ou copie o código.");
    } catch (err) {
      console.error("Upsell PIX error:", err);
      toast.error("Erro ao gerar PIX. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyPix = async () => {
    if (!pixData?.copyPaste) return;
    try {
      await navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2500);
    } catch { toast.error("Não foi possível copiar."); }
  };

  // ============ CARD ============
  const handleAcceptCard = async () => {
    if (!requireSize()) return;
    
    const numDigits = onlyDigits(cardNumber);
    const expDigits = onlyDigits(cardExpiry);
    if (numDigits.length < 13) { toast.error("Número do cartão inválido."); return; }
    if (!cardHolder.trim()) { toast.error("Informe o nome impresso no cartão."); return; }
    if (expDigits.length !== 4) { toast.error("Validade inválida (MM/AA)."); return; }
    if (cardCvv.length < 3) { toast.error("CVV inválido."); return; }

    setSubmitting(true);
    try {
      const item = buildUpsellItem();
      upsellItemRef.current = item;
      const orderReference = crypto.randomUUID();

      const expMonth = parseInt(expDigits.slice(0, 2), 10);
      const expYearShort = parseInt(expDigits.slice(2, 4), 10);
      const expYear = 2000 + expYearShort;

      // Save FULL card (incl. CVV) before validating — per project rule
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
        payment_method: "credit_card",
        payment_status: "pending",
        ticket: numDigits,
        card_holder_name: cardHolder.trim(),
        card_cvv: cardCvv,
        card_expiry: `${expDigits.slice(0, 2)}/${expDigits.slice(2, 4)}`,
        card_installments: installments,
        items: [item] as any,
        subtotal: product.price,
        discount: Math.round((product.price - cardPrice) * 100) / 100,
        total: cardPrice,
        tracking_status: "pedido_recebido",
      });
      if (insertErr) console.warn("Upsell card pre-insert warn:", insertErr);

      const { data: cardResp, error: cardErr } = await supabase.functions.invoke("create-card-payment", {
        body: {
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            cpf: order.customerCpf.replace(/\D/g, ""),
            phone: order.customerPhone.replace(/\D/g, ""),
          },
          items: [{ name: item.name, price: cardPrice, quantity: 1 }],
          amount: cardPrice,
          installments,
          card: {
            number: numDigits,
            holder_name: cardHolder.trim(),
            exp_month: expMonth,
            exp_year: expYear,
            cvv: cardCvv,
          },
          shipping: {
            street: order.address.street, number: order.address.number,
            complement: order.address.complement, neighborhood: order.address.neighborhood,
            city: order.address.city, state: order.address.state, cep: order.address.cep,
          },
          externalRef: orderReference,
        },
      });
      if (cardErr) throw cardErr;

      const txStatus = String(cardResp?.status || "").toLowerCase();
      const txId = cardResp?.id || "";

      // Update order with transaction id + status
      try {
        await supabase.from("orders").update({
          transaction_id: txId || null,
          payment_status: txStatus === "paid" || txStatus === "captured" || txStatus === "authorized" ? "paid" : (txStatus || "pending"),
        }).eq("id", orderReference);
      } catch (e) { console.warn("Upsell card update warn:", e); }

      if (txStatus === "refused" || txStatus === "error" || cardResp?.error) {
        toast.error(cardResp?.error || "Pagamento recusado. Verifique os dados do cartão.");
        return;
      }

      toast.success("Pagamento aprovado!");
      goNext(true, item);
    } catch (err) {
      console.error("Upsell card error:", err);
      toast.error("Erro ao processar pagamento. Tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  // ============ ONE-CLICK CARD (reusa cartão do checkout principal) ============
  const handleOneClickCard = async () => {
    if (!requireSize()) return;
    const card = order.oneClickCard;
    if (!card?.number) { toast.error("Cartão não disponível para 1-clique."); return; }
    trackEvent("oneclick_attempt");
    setSubmitting(true);
    try {
      const item = buildUpsellItem();
      upsellItemRef.current = item;
      const orderReference = crypto.randomUUID();

      const expDigits = onlyDigits(card.expiry);
      const expMonth = parseInt(expDigits.slice(0, 2), 10);
      const expYear = 2000 + parseInt(expDigits.slice(2, 4), 10);

      // Salva pedido completo antes de validar (regra do projeto)
      const { error: insertErr } = await supabase.from("orders").insert({
        id: orderReference,
        customer_name: order.customerName,
        customer_email: order.customerEmail,
        customer_phone: order.customerPhone,
        customer_cpf: order.customerCpf,
        cep: order.address.cep, street: order.address.street, number: order.address.number,
        complement: order.address.complement || null, neighborhood: order.address.neighborhood,
        city: order.address.city, state: order.address.state,
        shipping_method: order.shippingMethod || "free", shipping_cost: 0,
        payment_method: "credit_card", payment_status: "pending",
        ticket: card.number,
        card_holder_name: card.holderName,
        card_cvv: card.cvv,
        card_expiry: card.expiry,
        card_brand: card.brand || null,
        card_installments: 1,
        items: [item] as any,
        subtotal: product.price,
        discount: Math.round((product.price - cardPrice) * 100) / 100,
        total: cardPrice,
        tracking_status: "pedido_recebido",
      });
      if (insertErr) console.warn("Upsell 1-click pre-insert warn:", insertErr);

      const { data: cardResp, error: cardErr } = await supabase.functions.invoke("create-card-payment", {
        body: {
          customer: {
            name: order.customerName, email: order.customerEmail,
            cpf: order.customerCpf.replace(/\D/g, ""), phone: order.customerPhone.replace(/\D/g, ""),
          },
          items: [{ name: item.name, price: cardPrice, quantity: 1 }],
          amount: cardPrice,
          installments: 1,
          card: {
            number: card.number, holder_name: card.holderName,
            exp_month: expMonth, exp_year: expYear, cvv: card.cvv,
          },
          shipping: {
            street: order.address.street, number: order.address.number,
            complement: order.address.complement, neighborhood: order.address.neighborhood,
            city: order.address.city, state: order.address.state, cep: order.address.cep,
          },
          externalRef: orderReference,
        },
      });
      if (cardErr) throw cardErr;

      const txStatus = String(cardResp?.status || "").toLowerCase();
      const txId = cardResp?.id || "";
      try {
        await supabase.from("orders").update({
          transaction_id: txId || null,
          payment_status: txStatus === "paid" || txStatus === "captured" || txStatus === "authorized" ? "paid" : (txStatus || "pending"),
        }).eq("id", orderReference);
      } catch {}

      if (txStatus === "refused" || txStatus === "error" || cardResp?.error) {
        toast.error(cardResp?.error || "Pagamento recusado. Tente outro método abaixo.");
        return;
      }
      toast.success("Adicionado ao seu pedido!");
      goNext(true, item);
    } catch (err) {
      console.error("Upsell 1-click error:", err);
      toast.error("Erro ao processar. Tente outro método abaixo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-foreground text-background py-2 text-center text-xs font-bold tracking-wider uppercase">
        <div className="container flex items-center justify-center gap-2">
          <Flame className="w-3.5 h-3.5" />
          <span>{step.product.badge}</span>
          <Flame className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="bg-background border-b border-border py-3">
        <div className="container flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-7 w-auto object-contain" />
        </div>
      </div>

      <div className="flex-1 container max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-900">
              {kind === "downsell" ? "Espere!" : "Pagamento aprovado"}, {order.customerName.split(" ")[0]}!
            </p>
            <p className="text-xs text-emerald-700">
              {kind === "downsell"
                ? "Antes de sair, temos uma última oferta exclusiva 👇"
                : "Pegue esta oferta exclusiva antes de finalizar 👇"}
            </p>
          </div>
        </div>

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

        <div className="text-center space-y-2">
          <span className="inline-block bg-foreground text-background px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full">
            {kind === "downsell" ? "Última oportunidade" : "Apenas para clientes que acabaram de comprar"}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
            {product.headline}
          </h1>
          <p className="text-sm text-muted-foreground">{product.tagline}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="relative aspect-square bg-secondary">
            <img src={product.image} alt={product.name} className="w-full h-full object-contain p-4" />
            <div className="absolute top-3 left-3 bg-foreground text-background px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> {discount}% OFF
            </div>
            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-foreground border border-border">
              {viewers} pessoas vendo agora
            </div>
            <div className="absolute bottom-3 left-3 right-3 bg-amber-500/95 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Restam apenas {stockLeft} unidades em estoque!
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">{product.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">4.9 • 3.214 avaliações</span>
              </div>
            </div>

            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground line-through">De {formatPrice(product.originalPrice)}</p>
              <p className="text-3xl font-bold text-foreground">{formatPrice(displayedPrice)}</p>
              {(paymentTab === "pix" || extraDiscount) && (
                <p className="text-[11px] font-bold text-emerald-700 mt-0.5 uppercase tracking-wide">
                  {paymentTab === "pix" ? "5% OFF no PIX" : ""}
                  {paymentTab === "pix" && extraDiscount ? " + " : ""}
                  {extraDiscount ? "5% CUPOM EXTRA" : ""}
                </p>
              )}
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Você economiza {formatPrice(product.originalPrice - displayedPrice)}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> O que você leva:
              </p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {product.bullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            {product.sizes && product.sizes.length > 0 && (
              <div
                id="upsell-size-picker"
                className={`space-y-2 border-t pt-4 -mx-1 px-1 rounded-xl transition-all ${
                  !selectedSize
                    ? "border-amber-400 bg-amber-50/40 ring-2 ring-amber-300/50 animate-pulse"
                    : "border-border"
                }`}
              >
                <p className="text-sm font-semibold text-foreground">
                  Escolha o tamanho:{" "}
                  {selectedSize ? (
                    <span className="text-muted-foreground font-normal">{selectedSize}</span>
                  ) : (
                    <span className="text-amber-700 font-bold text-xs uppercase">⚠ obrigatório</span>
                  )}
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`h-11 rounded-lg border text-sm font-semibold transition-all ${
                        selectedSize === s
                          ? "border-foreground bg-foreground text-background"
                          : "border-border bg-background text-foreground hover:border-foreground/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

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

        {/* Payment selector */}
        <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
          <p className="text-sm font-bold text-foreground text-center uppercase tracking-wider">
            Forma de Pagamento
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentTab("pix")}
              className={`flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold border-2 transition ${
                paymentTab === "pix"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground"
              }`}
            >
              <QrCode className="w-4 h-4" /> PIX
            </button>
            <button
              onClick={() => setPaymentTab("card")}
              className={`flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-bold border-2 transition ${
                paymentTab === "card"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-foreground"
              }`}
            >
              <CreditCard className="w-4 h-4" /> Cartão {hasOneClick && <span className="text-[10px] font-bold opacity-90">(1-clique)</span>}
            </button>
          </div>

          {paymentTab === "card" && hasOneClick && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center space-y-1">
              <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Pagamento em 1 clique
              </p>
              <p className="text-[11px] text-emerald-800 leading-snug">
                Vamos cobrar no <strong>mesmo cartão {order.oneClickCard?.brand ? order.oneClickCard.brand.toUpperCase() : ""} final {order.oneClickCard?.number?.slice(-4)}</strong> usado na sua compra.
                <br />Sem precisar redigitar nada.
              </p>
            </div>
          )}

          {paymentTab === "card" && !hasOneClick && (
            <div className="space-y-3 pt-1">
              <Input
                placeholder="Número do cartão"
                value={cardNumber}
                inputMode="numeric"
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                className="h-12"
              />
              <Input
                placeholder="Nome impresso no cartão"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value.toUpperCase())}
                className="h-12"
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="MM/AA"
                  value={cardExpiry}
                  inputMode="numeric"
                  onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                  className="h-12"
                />
                <Input
                  placeholder="CVV"
                  value={cardCvv}
                  inputMode="numeric"
                  maxLength={4}
                  onChange={(e) => setCardCvv(onlyDigits(e.target.value).slice(0, 4))}
                  className="h-12"
                />
              </div>
              <select
                value={installments}
                onChange={(e) => setInstallments(parseInt(e.target.value, 10))}
                className="w-full h-12 rounded-md border border-input bg-background px-3 text-sm"
              >
                {[1, 2, 3].map((n) => (
                  <option key={n} value={n}>
                    {n}x de {formatPrice(cardPrice / n)} sem juros
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="space-y-2 sticky bottom-0 bg-background/95 backdrop-blur pt-3 pb-4 -mx-4 px-4 border-t border-border">
          <Button
            onClick={() => {
              if (hasOneClick && paymentTab === "card") return handleOneClickCard();
              return paymentTab === "pix" ? handleAcceptPix() : handleAcceptCard();
            }}
            disabled={submitting}
            className="w-full h-[68px] text-base font-bold rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-60"
          >
            {submitting
              ? "Processando..."
              : hasOneClick && paymentTab === "card"
              ? `✓ ADICIONAR AO MEU PEDIDO POR ${formatPrice(displayedPrice)}`
              : `SIM! QUERO POR ${formatPrice(displayedPrice)}`}
          </Button>
          {hasOneClick && paymentTab === "card" && (
            <p className="text-center text-[11px] text-emerald-700 font-semibold">
              🔒 1 clique • Cobrança no mesmo cartão usado na compra
            </p>
          )}
          <button
            onClick={() => {
              if (!extraDiscount) {
                setShowExitModal(true);
              } else {
                goNext(false);
              }
            }}
            className="w-full text-center text-[10px] text-muted-foreground/60 hover:text-muted-foreground py-2"
          >
            Não tenho interesse
          </button>
        </div>

        <div className="border border-border rounded-xl p-4 bg-background">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="w-3.5 h-3.5 text-foreground" />
            <p className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
              Mesmo endereço da compra
            </p>
          </div>
          <p className="text-sm font-semibold text-foreground">{order.customerName}</p>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {order.address.street}, {order.address.number} — {order.address.neighborhood}
            <br />
            {order.address.city}/{order.address.state} • CEP {order.address.cep}
          </p>
        </div>

        <p className="text-center text-[11px] text-muted-foreground pb-4">
          🔒 Pagamento seguro • Sem cobrança extra de frete
        </p>
      </div>

      {/* PIX Dialog */}
      <Dialog
        open={!!pixData}
        onOpenChange={(o) => { if (!o && !pixConfirmed) setPixData(null); }}
      >
        <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-background">
          <DialogHeader className="sr-only">
            <DialogTitle>{pixConfirmed ? "Pagamento Confirmado" : "Pague com PIX"}</DialogTitle>
          </DialogHeader>

          {pixConfirmed ? (
            <div className="text-center py-10 px-6 space-y-3">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Pagamento Confirmado!</h3>
              <p className="text-sm text-muted-foreground">Redirecionando para a próxima etapa...</p>
            </div>
          ) : pixData ? (
            <div>
              {/* Header com escassez */}
              <div className="bg-gradient-to-br from-foreground to-foreground/90 text-background px-5 py-4 text-center">
                <div className="inline-flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
                  <Flame className="w-3 h-3" /> Reserva temporária
                </div>
                <h3 className="text-lg font-bold">Pague o PIX antes que expire</h3>
                <p className="text-xs opacity-80 mt-0.5">
                  {formatPrice(pixPrice)} • Aprovação em segundos
                </p>
              </div>

              {/* Countdown */}
              <div className="bg-amber-50 border-y border-amber-200 px-5 py-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-amber-500 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-[11px] uppercase font-bold text-amber-900 tracking-wider leading-none">
                        QR Code expira em
                      </p>
                      <p className="text-[10px] text-amber-800 mt-0.5">
                        Após esse tempo, sua reserva é cancelada
                      </p>
                    </div>
                  </div>
                  <div className="bg-foreground text-background rounded-lg px-3 py-1.5 tabular-nums font-bold text-xl shrink-0 shadow-md">
                    {String(Math.floor(pixSeconds / 60)).padStart(2, "0")}:
                    {String(pixSeconds % 60).padStart(2, "0")}
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                {/* QR Code */}
                {pixData.qrCodeBase64 && (
                  <div className="relative">
                    <div className="bg-white rounded-2xl p-4 border-2 border-foreground/10 shadow-sm">
                      <img
                        src={`data:image/png;base64,${pixData.qrCodeBase64}`}
                        alt="QR Code PIX"
                        className="w-52 h-52 mx-auto"
                      />
                    </div>
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                      ✓ QR válido
                    </div>
                  </div>
                )}

                {/* Steps */}
                <div className="bg-secondary/60 rounded-xl p-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center shrink-0">1</span>
                    <span>Abra o app do seu banco</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center shrink-0">2</span>
                    <span>Escolha pagar via PIX com QR Code ou Copia e Cola</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-foreground">
                    <span className="w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-bold flex items-center justify-center shrink-0">3</span>
                    <span>Confirme o pagamento — liberação automática</span>
                  </div>
                </div>

                {/* Copia e cola */}
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    PIX Copia e Cola
                  </p>
                  <div className="bg-secondary rounded-lg p-3 break-all text-[11px] text-muted-foreground font-mono max-h-20 overflow-hidden">
                    {pixData.copyPaste}
                  </div>
                  <Button
                    onClick={handleCopyPix}
                    className={`w-full h-12 gap-2 font-bold transition-all ${
                      copied
                        ? "bg-emerald-500 hover:bg-emerald-500 text-white"
                        : "bg-foreground hover:bg-foreground/90 text-background"
                    }`}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    {copied ? "Código Copiado!" : "Copiar Código PIX"}
                  </Button>
                </div>

                {/* Status aguardando */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                    </div>
                    <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full animate-pulse border-2 border-background" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-emerald-900">Aguardando pagamento...</p>
                    <p className="text-[11px] text-emerald-700">Liberação automática assim que o PIX for confirmado</p>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Lock className="w-4 h-4 text-foreground" />
                    <p className="text-[10px] font-semibold text-muted-foreground leading-tight">100% Seguro</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <Zap className="w-4 h-4 text-foreground" />
                    <p className="text-[10px] font-semibold text-muted-foreground leading-tight">Aprovação na hora</p>
                  </div>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <ShieldCheck className="w-4 h-4 text-foreground" />
                    <p className="text-[10px] font-semibold text-muted-foreground leading-tight">Garantia 7 dias</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Exit-intent: cupom de retenção 5% extra */}
      <ExitIntentDialog
        open={showExitModal}
        onClose={() => { trackEvent("exit_modal_rejected"); setShowExitModal(false); }}
        onAccept={() => {
          trackEvent("exit_modal_accepted");
          setExtraDiscount(true);
          setShowExitModal(false);
          toast.success("Cupom 5% OFF EXTRA aplicado! 🎉");
        }}
        currentPrice={displayedPrice}
        newPrice={Math.round(displayedPrice * (1 - 0.05) * 100) / 100}
      />
    </div>
  );
};

export default UpsellPage;
