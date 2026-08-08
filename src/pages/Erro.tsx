import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertTriangle, Truck, ShieldCheck, Lock, Clock, Copy, Check, Loader2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
const belacasaLogo = "/logo-belacasa.png";

interface PixData {
  qrCode: string;
  qrCodeBase64: string;
  copyPaste: string;
  transactionId: string;
  orderId: string;
}

const TAXA = 27.9;

const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const onlyDigits = (s: string) => s.replace(/\D/g, "");

const validateCpf = (cpf: string) => {
  const c = onlyDigits(cpf);
  if (c.length !== 11 || /^(\d)\1+$/.test(c)) return false;
  const calc = (base: number) => {
    let sum = 0;
    for (let i = 0; i < base; i++) sum += parseInt(c[i]) * (base + 1 - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(9) === parseInt(c[9]) && calc(10) === parseInt(c[10]);
};

interface OrderInfo {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_cpf: string;
  customer_phone: string;
  order_number: string | null;
  items: any;
}

const Erro = () => {
  const [form, setForm] = useState({ name: "", email: "", cpf: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderInfo, setOrderInfo] = useState<OrderInfo | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  // Busca pedido por ?pedido=AO12345678 (order_number) e pré-preenche os dados
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const locationState = (window.history.state?.usr as any);
    const pedido = params.get("pedido")?.trim() || locationState?.orderNumber;
    if (!pedido && !locationState?.items) return;
    setLoadingOrder(true);
    (async () => {
      try {
        const { data } = await supabase
          .from("orders")
          .select("id, customer_name, customer_email, customer_cpf, customer_phone, order_number, items")
          .eq("order_number", pedido)
          .maybeSingle();
        if (data) {
          setOrderInfo(data as OrderInfo);
          setForm({
            name: data.customer_name || "",
            email: data.customer_email || "",
            cpf: data.customer_cpf || "",
            phone: data.customer_phone || "",
          });
        }
      } catch (e) {
        console.warn("Erro buscando pedido:", e);
      } finally {
        setLoadingOrder(false);
      }
    })();
  }, []);

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
          toast.success("Pagamento confirmado! Seu pedido será enviado.");
        }
      } catch (e) {
        console.warn("Erro PIX poll:", e);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [pixData, pixConfirmed]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || form.name.trim().split(" ").length < 2) {
      toast.error("Informe seu nome completo.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      toast.error("E-mail inválido.");
      return;
    }
    if (!validateCpf(form.cpf)) {
      toast.error("CPF inválido.");
      return;
    }
    if (onlyDigits(form.phone).length < 10) {
      toast.error("Telefone inválido.");
      return;
    }

    setSubmitting(true);
    try {
      const orderReference = crypto.randomUUID();

      const { data: pix, error: pixErr } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          customer: {
            name: form.name.trim(),
            email: form.email.trim(),
            cpf: onlyDigits(form.cpf),
            phone: onlyDigits(form.phone),
          },
          items: orderInfo?.items || [{ name: "Taxa de Reentrega", price: TAXA, quantity: 1 }],
          amount: TAXA,
          shipping: {
            street: "N/A", number: "0", complement: "",
            neighborhood: "N/A", city: "N/A", state: "SP", cep: "00000000",
          },
          externalRef: orderReference,
          provider: "pinpay"
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

      await supabase.from("orders").insert({
        id: orderReference,
        customer_name: form.name.trim(),
        customer_email: form.email.trim(),
        customer_phone: onlyDigits(form.phone),
        customer_cpf: onlyDigits(form.cpf),
        cep: "00000000",
        street: "N/A",
        number: "0",
        complement: null,
        neighborhood: "N/A",
        city: "N/A",
        state: "SP",
        shipping_method: "taxa_reentrega",
        shipping_cost: TAXA,
        payment_method: "PIX",
        payment_status: "pending",
        transaction_id: pixInfo.transactionId,
        ticket: orderReference,
        items: orderInfo?.items || [{ id: 999, name: "Taxa de Reentrega", price: TAXA, quantity: 1 }] as any,
        subtotal: TAXA,
        discount: 0,
        total: TAXA,
        tracking_status: "pedido_recebido",
      });

      setPixData(pixInfo);
      toast.success("PIX gerado! Pague para liberar sua entrega.");
    } catch (err: any) {
      console.error("Erro PIX taxa:", err);
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
    } catch {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col font-montserrat">
      <div className="bg-[#be7e5b] text-white py-2 text-center text-[10px] font-bold tracking-wider uppercase">
        <div className="container flex items-center justify-center gap-2">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Atenção • Falha na Entrega</span>
          <AlertTriangle className="w-3.5 h-3.5" />
        </div>
      </div>

      <div className="bg-white border-b border-gray-100 py-4 shadow-sm">
        <div className="container flex items-center justify-center">
          <img src={belacasaLogo} alt="BelaCasa" className="h-10 w-auto object-contain" />
        </div>
      </div>

      <div className="flex-1 container max-w-2xl mx-auto px-4 py-6 space-y-5">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-12 h-12 bg-destructive rounded-full flex items-center justify-center shrink-0">
            <XCircle className="w-7 h-7 text-destructive-foreground" />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-red-900 leading-tight">
              {orderInfo?.customer_name
                ? `${orderInfo.customer_name.split(" ")[0]}, não foi possível entregar o seu pedido`
                : "Não foi possível entregar o seu produto"}
            </h1>
            <p className="text-sm text-red-800 mt-1">
              Por uma <strong>falha no cálculo do frete</strong>, a transportadora não conseguiu
              concluir a entrega do seu pedido no endereço informado.
            </p>
            {orderInfo?.order_number && (
              <p className="text-xs text-red-700 mt-2 font-mono">Pedido: {orderInfo.order_number}</p>
            )}
          </div>
        </div>

        {orderInfo && Array.isArray(orderInfo.items) && orderInfo.items.length > 0 && (
          <div className="bg-card border border-border rounded-2xl p-5 space-y-3">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider">Seu pedido</h2>
            <div className="space-y-3">
              {orderInfo.items.map((item: any, i: number) => (
                <div key={i} className="flex gap-3 items-center">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name || ""}
                      className="w-16 h-16 rounded-lg object-cover border border-border shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.size ? `Tam: ${item.size} ` : ""}
                      {item.color ? `• Cor: ${item.color} ` : ""}
                      {item.quantity ? `• Qtd: ${item.quantity}` : ""}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-foreground shrink-0 mt-0.5" />
            <div>
              <h2 className="text-base font-bold text-foreground">Taxa de reentrega</h2>
              <p className="text-sm text-muted-foreground">
                Para que possamos enviar o seu produto, é necessário o pagamento de uma
                taxa única no valor abaixo.
              </p>
            </div>
          </div>

          <div className="bg-secondary/60 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Valor da taxa</p>
            <p className="text-4xl font-bold text-foreground mt-1">{formatPrice(TAXA)}</p>
            <p className="text-[11px] text-muted-foreground mt-1">Pagamento exclusivamente via PIX</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900">
              <strong>Caso o pagamento não seja feito, o pedido não será enviado.</strong>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 space-y-4">
          <h3 className="text-base font-bold text-foreground">Dados do Cliente</h3>

          <div className="space-y-1.5">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="seu@email.com"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                inputMode="numeric"
                value={form.cpf}
                onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                placeholder="000.000.000-00"
                maxLength={14}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                inputMode="numeric"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="(11) 99999-9999"
                maxLength={15}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full h-[68px] text-base font-bold rounded-xl bg-[#be7e5b] text-white hover:bg-[#a66d4f] disabled:opacity-60 transition-all shadow-lg shadow-[#be7e5b]/20 uppercase tracking-wide"
          >
            {submitting ? "Gerando PIX..." : `PAGAR ${formatPrice(TAXA)} VIA PIX`}
          </Button>

          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { icon: ShieldCheck, label: "Compra Segura" },
              { icon: Lock, label: "Dados Protegidos" },
              { icon: Truck, label: "Envio Imediato" },
            ].map((b, i) => (
              <div key={i} className="flex flex-col items-center gap-1 bg-secondary/40 rounded-lg p-2.5">
                <b.icon className="w-4 h-4 text-foreground" />
                <span className="text-[10px] font-medium text-muted-foreground text-center">{b.label}</span>
              </div>
            ))}
          </div>
        </form>

        <p className="text-center text-[11px] text-muted-foreground pb-4">
          🔒 Pagamento processado com segurança • Após confirmação, seu pedido será despachado
        </p>
      </div>

      <Dialog open={!!pixData} onOpenChange={(o) => { if (!o && !pixConfirmed) setPixData(null); }}>
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
              <p className="text-sm text-foreground font-semibold">Taxa recebida com sucesso!</p>
              <p className="text-xs text-muted-foreground">Seu pedido será enviado em breve.</p>
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
                Valor: <strong className="text-foreground">{formatPrice(TAXA)}</strong>
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Erro;
