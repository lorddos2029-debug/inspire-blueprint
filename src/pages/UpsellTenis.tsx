import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Clock, Flame, ShieldCheck, Truck, Star, AlertTriangle, Lock, Zap, QrCode, Copy, Loader2 } from "lucide-react";
import { products } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logo from "@/assets/logo-new.png";

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

const UPSELL_PRICE = 49.9;
const UPSELL_ORIGINAL = 199.9;
const COUNTDOWN_SECONDS = 5 * 60; // 5 minutos

const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

// Generates a valid CPF (passes checksum) — used only for preview testing
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

const UpsellTenis = () => {
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

  const tenis = useMemo(() => products.find(p => p.id === 25)!, []);
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(COUNTDOWN_SECONDS);
  const [submitting, setSubmitting] = useState(false);
  const [stockLeft] = useState(() => 7 + Math.floor(Math.random() * 4));
  const [viewers] = useState(() => 38 + Math.floor(Math.random() * 25));
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const upsellItemRef = useRef<any>(null);

  useEffect(() => {
    const t = setInterval(() => setSeconds(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  // Poll PIX status
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
          setTimeout(() => goObrigado(upsellItemRef.current), 800);
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

  const goObrigado = (extraItem?: any) => {
    const finalItems = extraItem ? [...order.items, extraItem] : order.items;
    const finalTotal = extraItem ? order.total + UPSELL_PRICE : order.total;
    navigate("/resolverastreio", {
      replace: true,
      state: { ...order, items: finalItems, total: finalTotal },
    });
  };

  const handleAccept = async () => {
    if (!selectedSize) { toast.error("Selecione o tamanho do tênis."); return; }
    if (expired) { toast.error("A oferta especial expirou."); return; }
    // Preview gera CPF válido automaticamente, então o PIX pode ser testado normalmente
    setSubmitting(true);
    try {
      const variant = tenis.colorVariants![selectedColor];
      const upsellItem = {
        id: tenis.id,
        name: `${tenis.name} (UPSELL)`,
        price: UPSELL_PRICE,
        image: variant.image || tenis.image,
        size: selectedSize,
        color: variant.label,
        quantity: 1,
      };
      upsellItemRef.current = upsellItem;

      const orderReference = crypto.randomUUID();

      // Gerar PIX via PrimeCash
      const { data: pix, error: pixErr } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            cpf: order.customerCpf.replace(/\D/g, ""),
            phone: order.customerPhone.replace(/\D/g, ""),
          },
          items: [{ name: upsellItem.name, price: UPSELL_PRICE, quantity: 1 }],
          amount: UPSELL_PRICE,
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

      // Criar pedido pendente para que o webhook/polling possam atualizar
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
        items: [upsellItem] as any,
        subtotal: UPSELL_PRICE,
        discount: 0,
        total: UPSELL_PRICE,
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

  const handleCopy = async () => {
    if (!pixData?.copyPaste) return;
    try {
      await navigator.clipboard.writeText(pixData.copyPaste);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 2500);
    } catch { toast.error("Não foi possível copiar."); }
  };

  const variant = tenis.colorVariants![selectedColor];
  const heroImage = variant.image || tenis.image;
  const discount = Math.round(((UPSELL_ORIGINAL - UPSELL_PRICE) / UPSELL_ORIGINAL) * 100);

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
            Adicione mais 1 par <span className="underline decoration-foreground/30">por apenas {formatPrice(UPSELL_PRICE)}</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Você não verá esta oferta novamente. Aproveite enquanto está aqui.
          </p>
        </div>

        {/* Card produto */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="relative aspect-square bg-secondary">
            <img src={heroImage} alt={variant.label} className="w-full h-full object-cover" />
            <div className="absolute top-3 left-3 bg-foreground text-background px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
              <Zap className="w-3 h-3" /> {discount}% OFF
            </div>
            <div className="absolute top-3 right-3 bg-background/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-foreground border border-border">
              {viewers} pessoas vendo agora
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-foreground leading-tight">{tenis.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <span className="text-xs text-muted-foreground">4.9 • 2.847 avaliações</span>
              </div>
            </div>

            {/* Preços */}
            <div className="bg-secondary/50 rounded-xl p-4 text-center">
              <p className="text-xs text-muted-foreground line-through">De {formatPrice(UPSELL_ORIGINAL)}</p>
              <p className="text-3xl font-bold text-foreground">{formatPrice(UPSELL_PRICE)}</p>
              <p className="text-xs text-emerald-700 font-semibold mt-1">
                Você economiza {formatPrice(UPSELL_ORIGINAL - UPSELL_PRICE)}
              </p>
            </div>

            {/* Cor */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Cor: <span className="text-muted-foreground font-normal">{variant.label}</span>
              </p>
              <div className="flex gap-2 flex-wrap">
                {tenis.colorVariants!.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(idx)}
                    className={`w-16 h-16 rounded-md overflow-hidden transition-all ${
                      selectedColor === idx
                        ? "border-2 border-foreground"
                        : "border border-transparent opacity-70 hover:opacity-100"
                    }`}
                    title={v.label}
                  >
                    <img src={v.image} alt={v.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Tamanho */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-foreground">
                Tamanho: {selectedSize && <span className="text-muted-foreground font-normal">{selectedSize}</span>}
              </p>
              <div className="grid grid-cols-4 gap-2">
                {tenis.sizes!.map(s => (
                  <button
                    key={s}
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

        {/* CTAs */}
        <div className="space-y-2 sticky bottom-0 bg-background/95 backdrop-blur pt-3 pb-4 -mx-4 px-4 border-t border-border">
          <Button
            onClick={handleAccept}
            disabled={submitting || expired}
            className="w-full h-[68px] text-base font-bold rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-60"
          >
            {submitting ? "Adicionando..." : expired ? "Oferta Expirada" : `SIM! QUERO POR ${formatPrice(UPSELL_PRICE)}`}
          </Button>
          <button
            onClick={() => goObrigado()}
            className="w-full text-center text-xs text-muted-foreground underline py-2"
          >
            Não, abrir mão dessa oferta única
          </button>
        </div>

        {/* Reforço social */}
        <div className="bg-secondary/40 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-bold text-foreground uppercase tracking-wider text-center">
            O que dizem nossos clientes
          </p>
          {[
            { n: "Marcos R.", t: "Comprei 2 pares e adorei! Confortável demais, parece que tô de meia." },
            { n: "João P.", t: "Uso todo dia pro trabalho. Vale cada centavo, recomendo." },
            { n: "Felipe A.", t: "Aproveitei a oferta extra e foi a melhor decisão. Chegou rápido!" },
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
                Valor: <strong className="text-foreground">{formatPrice(UPSELL_PRICE)}</strong>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpsellTenis;
