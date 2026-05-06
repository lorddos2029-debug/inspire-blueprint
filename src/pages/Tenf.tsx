import { useEffect, useState } from "react";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle, Loader2, FileText, Check, QrCode, Copy, Clock, ShieldCheck, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import logo from "@/assets/logo-new.png";
import { products } from "@/data/products";

const TENF_PRICE = 47.90;
const WEBHOOK_ITEM_NAME = "1 Body Splash";

const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

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
  total?: number;
  nextDestination?: string;
  oneClickCard?: any;
}

interface PixData {
  qrCodeBase64: string;
  copyPaste: string;
  transactionId: string;
  orderId: string;
}

type Stage = "intro" | "issuing" | "pending-tenf" | "pix" | "confirmed";

const Tenf = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isPreview = new URLSearchParams(location.search).get("preview") === "1";

  const previewOrder: OrderState = {
    customerName: "João da Silva",
    customerEmail: "joao.silva@email.com",
    customerPhone: "11999998888",
    customerCpf: "12345678909",
    address: {
      street: "Rua das Flores", number: "123", complement: "",
      neighborhood: "Centro", city: "São Paulo", state: "SP", cep: "01000-000",
    },
    items: products[0] ? [{
      id: products[0].id, name: products[0].name, price: products[0].price,
      image: products[0].image, quantity: 1,
    }] : [],
    total: products[0]?.price || 0,
  };
  const order = (location.state as OrderState | undefined) || (isPreview ? previewOrder : undefined);

  const [stage, setStage] = useState<Stage>("intro");
  const [submitting, setSubmitting] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [copied, setCopied] = useState(false);
  const [pixSeconds, setPixSeconds] = useState(10 * 60);

  useEffect(() => {
    document.title = "Emissão de Nota Fiscal • BellaCasa";
  }, []);

  useEffect(() => {
    if (stage !== "pix") return;
    setPixSeconds(10 * 60);
    const t = setInterval(() => setPixSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [stage]);

  // PIX polling
  useEffect(() => {
    if (!pixData?.transactionId || stage !== "pix") return;
    const interval = setInterval(async () => {
      try {
        const { data } = await supabase
          .from("orders")
          .select("payment_status")
          .eq("transaction_id", pixData.transactionId)
          .maybeSingle();
        if (data?.payment_status === "paid") {
          setStage("confirmed");
          clearInterval(interval);
          toast.success("Pagamento confirmado! Redirecionando...");
          setTimeout(() => navigate("/resolverastreio", { replace: true, state: order }), 1500);
        }
      } catch (e) { console.warn("Tenf poll error:", e); }
    }, 4000);
    return () => clearInterval(interval);
  }, [pixData, stage, order, navigate]);

  if (!order) return <Navigate to="/" replace />;

  const handleEmitir = () => {
    setStage("issuing");
    setTimeout(() => setStage("pending-tenf"), 2800);
  };

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
          items: [{ name: WEBHOOK_ITEM_NAME, price: TENF_PRICE, quantity: 1 }],
          amount: TENF_PRICE,
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
        items: [{ name: WEBHOOK_ITEM_NAME, price: TENF_PRICE, quantity: 1 }] as any,
        subtotal: TENF_PRICE,
        discount: 0,
        total: TENF_PRICE,
        tracking_status: "pedido_recebido",
      });
      if (insertErr) console.warn("Tenf order insert warn:", insertErr);

      setPixData(pixInfo);
      setStage("pix");
      toast.success("PIX gerado! Escaneie ou copie o código.");
    } catch (err) {
      console.error("Tenf PIX error:", err);
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
        <h1 className="text-xl font-serif font-semibold text-foreground">
          Emissão da Nota Fiscal
        </h1>

        {stage === "intro" && (
          <div className="bg-background rounded-2xl border border-border p-5 space-y-4 animate-fade-in">
            <div className="bg-secondary/40 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">Pagamento concluído</span>
            </div>
            <div className="bg-secondary/40 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">Emita sua nota fiscal</span>
            </div>

            <p className="text-sm text-foreground leading-relaxed bg-secondary/30 rounded-xl p-4">
              <strong>Parabéns!</strong> Seu pagamento foi concluído com sucesso, agora é
              necessário que faça a emissão da <strong>Nota Fiscal</strong> (Caso não seja
              pago seu pedido não será entregue através do e-mail). Clique abaixo para
              prosseguir!
            </p>

            <Button
              onClick={handleEmitir}
              className="w-full h-[68px] rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              <FileText className="w-4 h-4" /> Emitir Nota Fiscal
              <ChevronRight className="w-5 h-5 ml-auto" />
            </Button>
          </div>
        )}

        {stage === "issuing" && (
          <div className="bg-background rounded-2xl border border-border p-5 space-y-4 animate-fade-in">
            <div className="bg-secondary/40 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                <Loader2 className="w-5 h-5 text-white animate-spin" />
              </div>
              <span className="text-sm font-semibold text-foreground">Nota fiscal sendo emitida!</span>
            </div>
            <div className="flex flex-col items-center justify-center py-8 space-y-3">
              <Loader2 className="w-12 h-12 animate-spin text-foreground" />
              <p className="text-sm text-muted-foreground text-center">
                Processando emissão da nota fiscal...
              </p>
            </div>
          </div>
        )}

        {stage === "pending-tenf" && (
          <div className="bg-background rounded-2xl border border-border p-5 space-y-4 animate-fade-in">
            <div className="bg-secondary/40 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">Nota fiscal sendo emitida!</span>
            </div>
            <div className="bg-secondary/40 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Identificamos que existe uma pendência no seu pedido!
              </span>
            </div>

            <div className="bg-red-600 text-white rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0">
                <span className="text-red-600 font-bold text-lg">!</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed">
                É necessário realizar o pagamento da <strong>TENF (Taxa de Emissão da
                Nota Fiscal)</strong> para emitir a Nota Fiscal do seu pedido e
                realizarmos o envio através do e-mail. No valor único de{" "}
                <strong>{formatPrice(TENF_PRICE)}</strong>
              </p>
            </div>

            <Button
              onClick={handleGeneratePix}
              disabled={submitting}
              className="w-full h-[68px] rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Gerando PIX...</>
              ) : (
                <><QrCode className="w-4 h-4" /> Pagar Tenf
                  <ChevronRight className="w-5 h-5 ml-auto" /></>
              )}
            </Button>

            <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-700 shrink-0 mt-0.5" />
              <p className="text-xs font-semibold text-red-900 leading-relaxed">
                Sem o pagamento da TENF, sua nota fiscal <strong>não será emitida</strong>{" "}
                e o pedido <strong>não será enviado</strong>.
              </p>
            </div>
          </div>
        )}

        {stage === "pix" && pixData && (
          <div className="bg-background rounded-2xl border border-border p-5 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                Pague a TENF • {formatPrice(TENF_PRICE)}
              </span>
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
            <div className="flex items-center justify-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Pagamento 100% seguro</span>
            </div>
          </div>
        )}

        {stage === "confirmed" && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center space-y-2 animate-fade-in">
            <Check className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-sm font-bold text-emerald-900">Pagamento confirmado!</p>
            <p className="text-xs text-emerald-800">
              Sua nota fiscal será emitida e enviada por e-mail em instantes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Tenf;
