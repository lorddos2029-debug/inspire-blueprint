import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search, Package, CheckCircle2, Clock, Truck, MapPin, CreditCard, Mail,
  ShieldCheck, HeadphonesIcon, Calendar, Box, Warehouse, Send, Navigation, Home,
  Sparkles, ArrowRight, Copy, Check, MessageCircle,
} from "lucide-react";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import BrazilRouteMap from "@/components/rastreio/BrazilRouteMap";
import { products } from "@/data/products";
import { standaloneProducts } from "@/data/standaloneProducts";
import { toast } from "sonner";

// Resolve a imagem atual de um item do pedido (caminhos antigos do Vite quebram entre builds)
function resolveItemImage(it: any): string | null {
  if (!it) return null;
  // Se for URL externa (http) o caminho original ainda funciona
  if (typeof it.image === "string" && /^https?:\/\//i.test(it.image)) return it.image;
  // Se for /lovable-uploads/... também funciona
  if (typeof it.image === "string" && it.image.startsWith("/lovable-uploads/")) return it.image;

  // Tenta achar pelo id no catálogo principal
  const p = products.find((pp) => String(pp.id) === String(it.id));
  if (p) {
    // Tenta variante por cor, se houver
    const colorName = (it.color || "").toLowerCase();
    if (colorName && (p as any).variants) {
      const v = (p as any).variants.find((vv: any) =>
        vv.label?.toLowerCase().includes(colorName) ||
        vv.label?.toLowerCase() === colorName,
      );
      if (v?.image) return v.image;
    }
    return p.image;
  }
  // Standalone
  const s = standaloneProducts.find((ss) => String(ss.id) === String(it.id));
  if (s) return s.image;

  // Último recurso: o caminho salvo (pode estar quebrado)
  return it.image || null;
}

const STATUS_FLOW = [
  { key: "pedido_recebido", label: "Pedido confirmado", description: "Recebemos seu pedido", icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
  { key: "aguardando_pagamento", label: "Aguardando pagamento", description: "Estamos confirmando o pagamento", icon: Clock, color: "from-amber-500 to-amber-600" },
  { key: "pix_gerado", label: "PIX gerado", description: "Aguardando confirmação do PIX", icon: CreditCard, color: "from-amber-500 to-amber-600" },
  { key: "pagamento_aprovado", label: "Pagamento aprovado", description: "Pagamento confirmado com sucesso", icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
  { key: "em_separacao", label: "Separando no estoque", description: "Centro logístico São Paulo/SP", icon: Box, color: "from-blue-500 to-blue-600" },
  { key: "pedido_enviado", label: "Saiu do centro logístico", description: "São Paulo/SP — A caminho do seu estado", icon: Send, color: "from-blue-500 to-blue-600" },
  { key: "em_transito", label: "Em transporte", description: "Em rota para sua cidade", icon: Truck, color: "from-indigo-500 to-indigo-600" },
  { key: "saiu_para_entrega", label: "Saiu para entrega", description: "O entregador está a caminho", icon: Navigation, color: "from-violet-500 to-violet-600" },
  { key: "entregue", label: "Entregue", description: "Encomenda entregue com sucesso", icon: Home, color: "from-emerald-500 to-emerald-600" },
];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });

const formatLongDate = (date: Date) =>
  date.toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const onlyDigits = (s: string) => (s || "").replace(/\D/g, "");

export default function Rastreio() {
  const [query, setQuery] = useState("");
  const [contact, setContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    document.title = "Rastrear Pedido • Alpha Oficial";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", "Acompanhe seu pedido em tempo real. Rastreamento profissional com mapa interativo e atualizações automáticas.");
  }, []);

  // Tick a cada 30s para "última atualização" e progresso visual
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);

  // Realtime: se o status do pedido mudar, atualiza
  useEffect(() => {
    if (!order?.id) return;
    const ch = supabase.channel(`order-${order.id}`)
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `id=eq.${order.id}` },
        (payload) => {
          setOrder((prev: any) => ({ ...prev, ...payload.new }));
          // Recarrega histórico
          supabase.from("order_status_history").select("*").eq("order_id", order.id)
            .order("created_at", { ascending: true }).then(({ data }) => setHistory(data || []));
        })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [order?.id]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOrder(null);
    setHistory([]);
    if (!query.trim() || !contact.trim()) {
      setError("Preencha os dois campos para localizar seu pedido.");
      return;
    }
    setLoading(true);
    try {
      const q = query.trim().toUpperCase();
      const c = contact.trim();
      const isEmail = c.includes("@");
      const cpfDigits = onlyDigits(c);

      let req = supabase.from("orders").select("*")
        .or(`order_number.eq.${q},tracking_code.eq.${q}`);

      if (isEmail) {
        req = req.ilike("customer_email", c.toLowerCase());
      } else if (cpfDigits.length === 11) {
        req = req.eq("customer_cpf", cpfDigits);
      } else {
        setError("Informe um e-mail válido ou CPF (11 dígitos).");
        setLoading(false);
        return;
      }

      const { data, error: dbErr } = await req.maybeSingle();
      if (dbErr) throw dbErr;
      if (!data) {
        setError("Não encontramos esse pedido. Verifique o código e o e-mail/CPF informados.");
        return;
      }
      setOrder(data);
      const { data: hist } = await supabase
        .from("order_status_history")
        .select("*")
        .eq("order_id", data.id)
        .order("created_at", { ascending: true });
      setHistory(hist || []);
    } catch (err: any) {
      setError(err.message || "Erro ao buscar pedido.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = useMemo(() => {
    if (!order) return -1;
    const idx = STATUS_FLOW.findIndex((s) => s.key === order.tracking_status);
    return idx;
  }, [order, now]);

  const progress = useMemo(() => {
    if (currentStepIndex < 0) return 0;
    return Math.min(1, currentStepIndex / (STATUS_FLOW.length - 1));
  }, [currentStepIndex]);

  const productSummary = useMemo(() => {
    if (!order?.items) return [];
    try {
      const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items);
      return items as any[];
    } catch { return []; }
  }, [order]);

  const estimatedDelivery = useMemo(() => {
    if (!order) return null;
    const base = order.created_at ? new Date(order.created_at) : new Date();
    const days = order.shipping_method?.toLowerCase().includes("sedex") ? 5 : 9;
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  }, [order]);

  const lastUpdate = useMemo(() => {
    if (!order) return null;
    const last = history.length > 0 ? history[history.length - 1].created_at : order.created_at;
    return last ? new Date(last) : null;
  }, [order, history, now]);

  const currentStep = currentStepIndex >= 0 ? STATUS_FLOW[currentStepIndex] : null;

  const copyTracking = () => {
    if (!order?.tracking_code) return;
    navigator.clipboard.writeText(order.tracking_code);
    setCopied(true);
    toast.success("Código copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* HERO de busca */}
        {!order && (
          <section className="relative overflow-hidden bg-background border-b border-border">
            <div className="absolute inset-0 pointer-events-none" style={{
              backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
              opacity: 0.025,
            }} />

            <div className="relative container mx-auto px-4 py-16 sm:py-20 max-w-3xl">
              <div className="text-center mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 leading-tight text-foreground">
                  Acompanhe seu pedido<br />
                  <span className="text-muted-foreground">em tempo real</span>
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                  Sistema oficial de rastreamento Alpha. Veja exatamente onde está sua encomenda no mapa.
                </p>
              </div>

              <form
                onSubmit={handleSearch}
                className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700"
              >
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2 block">
                    Código do pedido ou rastreio
                  </label>
                  <Input
                    placeholder="AO12345678 ou LV123456789BR"
                    value={query}
                    onChange={(e) => setQuery(e.target.value.toUpperCase())}
                    className="h-12 text-base font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2 block">
                    E-mail ou CPF do pedido
                  </label>
                  <Input
                    placeholder="seu@email.com ou 000.000.000-00"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-base font-bold bg-foreground hover:bg-foreground/90 text-background shadow-lg"
                  style={{ height: 52 }}
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin mr-2" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Rastrear meu pedido
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm text-center">
                    {error}
                  </div>
                )}
              </form>

              <div className="grid grid-cols-3 gap-4 mt-8 text-center">
                <div className="bg-card border border-border rounded-xl p-4">
                  <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-foreground" />
                  <p className="text-xs font-semibold">100% Seguro</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <Mail className="w-5 h-5 mx-auto mb-2 text-foreground" />
                  <p className="text-xs font-semibold">Alertas por e-mail</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-4">
                  <MapPin className="w-5 h-5 mx-auto mb-2 text-foreground" />
                  <p className="text-xs font-semibold">Mapa interativo</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* RESULTADO */}
        {order && (
          <section className="container mx-auto px-4 py-8 sm:py-12 max-w-6xl">
            {/* Botão para nova busca */}
            <button
              onClick={() => { setOrder(null); setHistory([]); setQuery(""); setContact(""); }}
              className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-flex items-center gap-1.5"
            >
              ← Rastrear outro pedido
            </button>

            {/* HEADER do pedido */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden animate-in fade-in slide-in-from-top-4">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/20 to-transparent rounded-full blur-3xl -translate-y-32 translate-x-32" />
              <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-1">Pedido</p>
                  <p className="text-2xl font-bold font-mono">{order.order_number}</p>
                  <p className="text-sm text-white/70 mt-1">Olá, <strong className="text-white">{order.customer_name?.split(" ")[0]}</strong>!</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-1">Código de rastreio</p>
                  <button onClick={copyTracking} className="group inline-flex items-center gap-2 hover:text-emerald-300 transition-colors">
                    <span className="text-lg font-mono font-bold">{order.tracking_code || "—"}</span>
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/50 group-hover:text-emerald-300" />}
                  </button>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-white/50 font-semibold mb-1">Previsão de entrega</p>
                  <p className="text-base font-bold">
                    {estimatedDelivery ? estimatedDelivery.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" }) : "—"}
                  </p>
                  <p className="text-xs text-white/60 capitalize">{estimatedDelivery ? estimatedDelivery.toLocaleDateString("pt-BR", { weekday: "long" }) : ""}</p>
                </div>
              </div>
            </div>

            {/* STATUS ATUAL EM DESTAQUE */}
            {currentStep && (
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 mb-6 relative overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                <div className="flex items-start gap-4 sm:gap-6 flex-wrap">
                  <div className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br ${currentStep.color} flex items-center justify-center shadow-lg shadow-black/10`}>
                    <currentStep.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold">Status atual</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{currentStep.label}</h2>
                    <p className="text-muted-foreground mt-1">{currentStep.description}</p>
                    {lastUpdate && (
                      <p className="text-xs text-muted-foreground mt-3 inline-flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        Última atualização: {formatDate(lastUpdate.toISOString())}
                      </p>
                    )}
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20 hover:bg-emerald-500/15">
                    Etapa {currentStepIndex + 1} de {STATUS_FLOW.length}
                  </Badge>
                </div>

                {/* Barra de progresso premium */}
                <div className="mt-6">
                  <div className="h-2.5 rounded-full bg-muted overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 via-blue-500 to-violet-500 transition-all duration-1000 relative"
                      style={{ width: `${Math.round(progress * 100)}%` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-muted-foreground font-mono">
                    <span>SP • Origem</span>
                    <span className="font-bold text-foreground">{Math.round(progress * 100)}%</span>
                    <span>{order.city}/{order.state}</span>
                  </div>
                </div>
              </div>
            )}

            {/* GRID PRINCIPAL: mapa + timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Coluna do mapa */}
              <div className="lg:col-span-3 space-y-6">
                <BrazilRouteMap
                  destinationState={order.state}
                  destinationCity={order.city}
                  progress={progress}
                  status={order.tracking_status}
                  statusLabel={currentStep?.label || ""}
                />

                {/* INFO DO PEDIDO */}
                <div className="bg-card border border-border rounded-2xl p-6">
                  <h3 className="font-bold text-base mb-4 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Detalhes da entrega
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Destinatário</p>
                        <p className="font-medium">{order.customer_name}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Endereço de entrega</p>
                        <p className="font-medium leading-snug">
                          {order.street}, {order.number}{order.complement ? ` • ${order.complement}` : ""}<br />
                          {order.neighborhood} • {order.city}/{order.state}<br />
                          CEP {order.cep}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Modalidade</p>
                        <p className="font-medium capitalize">{order.shipping_method}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Pagamento</p>
                        <p className="font-medium capitalize">{order.payment_method} • <span className="text-emerald-600 dark:text-emerald-400">{order.payment_status}</span></p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Pedido feito em</p>
                        <p className="font-medium">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Produtos */}
                  {productSummary.length > 0 && (
                    <div className="mt-5 pt-5 border-t border-border">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold mb-3">Produtos</p>
                      <div className="space-y-2">
                        {productSummary.map((it: any, i: number) => {
                          const imgSrc = resolveItemImage(it);
                          return (
                            <div key={i} className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl">
                              {imgSrc ? (
                                <img
                                  src={imgSrc}
                                  alt={it.name || it.title}
                                  className="w-14 h-14 rounded-lg object-cover bg-background border border-border shrink-0"
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-lg bg-muted border border-border flex items-center justify-center shrink-0">
                                  <Package className="w-5 h-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{it.name || it.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  Qtd: {it.quantity || 1}
                                  {it.size ? ` • Tam: ${it.size}` : ""}
                                  {it.color ? ` • Cor: ${it.color}` : ""}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* TIMELINE */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-2xl p-6 sticky top-4">
                  <h3 className="font-bold text-base mb-5 flex items-center gap-2">
                    <Truck className="w-4 h-4" />
                    Trajeto da entrega
                  </h3>

                  <div className="relative">
                    {STATUS_FLOW.map((step, idx) => {
                      const isComplete = idx < currentStepIndex;
                      const isCurrent = idx === currentStepIndex;
                      const isFuture = idx > currentStepIndex;
                      const Icon = step.icon;
                      const histItem = history.find((h) => h.status === step.key);
                      const isLast = idx === STATUS_FLOW.length - 1;

                      return (
                        <div key={step.key} className="relative flex gap-4 pb-5 last:pb-0">
                          {/* Linha vertical */}
                          {!isLast && (
                            <div className={`absolute left-[18px] top-9 w-0.5 h-[calc(100%-12px)] ${
                              isComplete ? "bg-gradient-to-b from-emerald-500 to-blue-500" : "bg-border"
                            }`} />
                          )}

                          {/* Ícone */}
                          <div className={`shrink-0 relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                            isComplete
                              ? `bg-gradient-to-br ${step.color} shadow-md`
                              : isCurrent
                                ? `bg-gradient-to-br ${step.color} shadow-lg ring-4 ring-blue-500/20 animate-pulse`
                                : "bg-muted"
                          }`}>
                            <Icon className={`w-4 h-4 ${isFuture ? "text-muted-foreground" : "text-white"}`} strokeWidth={2.5} />
                          </div>

                          {/* Conteúdo */}
                          <div className="flex-1 pt-1 min-w-0">
                            <p className={`text-sm font-bold ${isFuture ? "text-muted-foreground" : "text-foreground"}`}>
                              {step.label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{step.description}</p>
                            {histItem && (
                              <p className="text-[10px] text-muted-foreground mt-1.5 font-mono">
                                {formatDate(histItem.created_at)}
                              </p>
                            )}
                            {isCurrent && (
                              <Badge className="mt-2 bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20 text-[10px]">
                                Em andamento
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>

            {/* AVISO DE EMAILS */}
            <div className="mt-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-700/30 rounded-2xl p-5 flex items-start gap-3">
              <Mail className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-900 dark:text-amber-200">Atualizações automáticas por e-mail</p>
                <p className="text-amber-800 dark:text-amber-300 leading-relaxed text-xs mt-1">
                  Você recebe cada atualização do pedido em <strong>{order.customer_email}</strong>. Não esqueça de verificar Spam/Promoções.
                </p>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
