import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { products } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Users, ArrowDown, RefreshCw, Sparkles, TrendingDown, ShoppingBag,
  Eye, FileText, MapPin, CreditCard, CheckCircle2, AlertCircle, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";

type Period = "today" | "7d" | "30d" | "all";

interface FunnelCounts {
  produto: number;
  dados: number;
  endereco: number;
  pagamento: number;
  pedidos: number;
}

const STEPS = [
  { key: "produto", label: "Visitou Produto", icon: Eye, color: "from-[hsl(var(--primary))] to-[hsl(var(--gold))]", text: "text-[hsl(var(--primary))]", bg: "bg-[hsl(var(--primary)/0.08)]" },
  { key: "dados", label: "Dados Pessoais", icon: FileText, color: "from-blue-500 to-cyan-500", text: "text-blue-600", bg: "bg-blue-500/10" },
  { key: "endereco", label: "Endereço", icon: MapPin, color: "from-amber-500 to-orange-500", text: "text-amber-600", bg: "bg-amber-500/10" },
  { key: "pagamento", label: "Pagamento", icon: CreditCard, color: "from-rose-500 to-pink-500", text: "text-rose-600", bg: "bg-rose-500/10" },
  { key: "pedidos", label: "Comprou", icon: CheckCircle2, color: "from-emerald-500 to-green-500", text: "text-emerald-600", bg: "bg-emerald-500/10" },
] as const;

const PERIOD_LABEL: Record<Period, string> = {
  today: "Hoje",
  "7d": "Últimos 7 dias",
  "30d": "Últimos 30 dias",
  all: "Todos os tempos",
};

const FunnelAnalysis = () => {
  const [counts, setCounts] = useState<FunnelCounts>({ produto: 0, dados: 0, endereco: 0, pagamento: 0, pedidos: 0 });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<Period>("today");
  const [productFilter, setProductFilter] = useState<string>("__all__");
  const [productOptions, setProductOptions] = useState<{ slug: string; name: string; count: number }[]>([]);

  // AI state
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const periodStart = useMemo(() => {
    const now = new Date();
    if (period === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    if (period === "7d") return new Date(now.getTime() - 7 * 86400000).toISOString();
    if (period === "30d") return new Date(now.getTime() - 30 * 86400000).toISOString();
    return null;
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch checkout events (period-filtered, with high limit to avoid 1000 cap)
      let evQuery = supabase
        .from("checkout_events")
        .select("session_id, step, product_id, created_at")
        .limit(50000);
      if (periodStart) evQuery = evQuery.gte("created_at", periodStart);
      const { data: events } = await evQuery;

      // Fetch ALL product_ids ever seen (independent of period) to keep dropdown populated
      const { data: allProductEvents } = await supabase
        .from("checkout_events")
        .select("product_id")
        .not("product_id", "is", null)
        .limit(50000);

      // Fetch orders (pedidos)
      let orderQuery = supabase.from("orders").select("id, created_at, items, payment_status").limit(10000);
      if (periodStart) orderQuery = orderQuery.gte("created_at", periodStart);
      const { data: orders } = await orderQuery;

      const filteredEvents = (events || []).filter((e: any) => {
        if (productFilter === "__all__") return true;
        return e.product_id === productFilter;
      });

      // Build product options from ALL events ever (so dropdown is always populated regardless of period)
      const prodMap = new Map<string, number>();
      (allProductEvents || []).forEach((e: any) => {
        if (!e.product_id) return;
        prodMap.set(e.product_id, (prodMap.get(e.product_id) || 0) + 1);
      });
      // Also include products from the codebase so user can filter even with zero traffic yet
      products.forEach((p) => {
        if (!prodMap.has(p.slug)) prodMap.set(p.slug, 0);
      });
      const opts = Array.from(prodMap.entries())
        .map(([slug, count]) => {
          const p = products.find((x) => x.slug === slug);
          return { slug, name: p?.name?.slice(0, 60) || slug, count };
        })
        .sort((a, b) => b.count - a.count);
      setProductOptions(opts);

      // Compute step counts (unique sessions per step)
      const stepSessions: Record<string, Set<string>> = {
        produto: new Set(), dados: new Set(), endereco: new Set(), pagamento: new Set(),
      };
      filteredEvents.forEach((e: any) => {
        if (stepSessions[e.step]) stepSessions[e.step].add(e.session_id);
      });

      // Filter orders by product if needed
      const filteredOrders = (orders || []).filter((o: any) => {
        if (productFilter === "__all__") return true;
        const items = Array.isArray(o.items) ? o.items : [];
        return items.some((it: any) => String(it.slug || it.id || "") === productFilter);
      });
      const paidOrders = filteredOrders.filter((o: any) =>
        o.payment_status === "approved" || o.payment_status === "paid"
      );

      setCounts({
        produto: stepSessions.produto.size,
        dados: stepSessions.dados.size,
        endereco: stepSessions.endereco.size,
        pagamento: stepSessions.pagamento.size,
        pedidos: paidOrders.length,
      });
    } catch (e) {
      console.error("Funnel fetch error:", e);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); /* eslint-disable-next-line */ }, [period, productFilter]);

  const maxCount = Math.max(counts.produto, counts.dados, counts.endereco, counts.pagamento, counts.pedidos, 1);
  const totalEntered = counts.produto || counts.dados || 0;
  const conversionRate = totalEntered > 0 ? ((counts.pedidos / totalEntered) * 100).toFixed(2) : "0";

  const runAnalysis = async () => {
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const product = productFilter !== "__all__" ? products.find((p) => p.slug === productFilter) : null;
      const payload: any = {
        period: PERIOD_LABEL[period],
        funnel: counts,
      };
      if (product) {
        payload.productId = product.slug;
        payload.productName = product.name;
        payload.productPrice = product.price;
        payload.productOriginalPrice = product.originalPrice;
        payload.productDescription = product.description;
        payload.productSizes = product.sizes;
        payload.productColors = product.colorVariants?.map((v) => v.label);
        payload.reviewsCount = 0;
        payload.reviewsAverage = 5;
        payload.reviewsSample = [];
      }

      const { data, error } = await supabase.functions.invoke("analyze-funnel", { body: payload });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setAiResult(data.analysis);
    } catch (e: any) {
      setAiError(e.message || "Erro ao gerar análise");
    }
    setAiLoading(false);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="rounded-xl border border-border bg-card p-3 sm:p-4 space-y-3">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-muted-foreground" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filtros do Funil</h3>
          <Button variant="ghost" size="sm" className="ml-auto h-7 px-2" onClick={fetchData}>
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
          </Button>
        </div>

        <div className="flex gap-1.5 flex-wrap">
          {(["today", "7d", "30d", "all"] as Period[]).map((p) => (
            <Button
              key={p}
              variant={period === p ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => setPeriod(p)}
            >
              {PERIOD_LABEL[p]}
            </Button>
          ))}
        </div>

        <Select value={productFilter} onValueChange={setProductFilter}>
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue placeholder="Todos os produtos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">🌐 Todos os produtos</SelectItem>
            {productOptions.map((opt) => (
              <SelectItem key={opt.slug} value={opt.slug}>
                <span className="truncate inline-block max-w-[260px]">{opt.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">({opt.count})</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conversion summary */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <SummaryCard
          icon={<Eye className="w-4 h-4" />}
          label="Entraram no funil"
          value={totalEntered}
          accent="violet"
        />
        <SummaryCard
          icon={<ShoppingBag className="w-4 h-4" />}
          label="Compraram"
          value={counts.pedidos}
          accent="emerald"
        />
        <SummaryCard
          icon={<TrendingDown className="w-4 h-4" />}
          label="Conversão"
          value={`${conversionRate}%`}
          accent="amber"
        />
      </div>

      {/* Funnel steps */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-2">
          {STEPS.map((step, idx) => {
            const value = counts[step.key as keyof FunnelCounts];
            const pct = maxCount > 0 ? (value / maxCount) * 100 : 0;
            const prevValue = idx > 0 ? counts[STEPS[idx - 1].key as keyof FunnelCounts] : null;
            const dropoff = prevValue !== null && prevValue > 0
              ? { count: prevValue - value, pct: ((prevValue - value) / prevValue * 100).toFixed(1) }
              : null;
            const Icon = step.icon;

            return (
              <div key={step.key}>
                {dropoff && dropoff.count > 0 && (
                  <div className="flex items-center justify-center gap-1.5 py-1 text-[11px]">
                    <ArrowDown className="w-3 h-3 text-destructive" />
                    <span className="text-destructive font-semibold">
                      {dropoff.count} {dropoff.count === 1 ? "pessoa abandonou" : "pessoas abandonaram"}
                    </span>
                    <span className="text-muted-foreground">({dropoff.pct}%)</span>
                  </div>
                )}
                <div className="rounded-xl border border-border bg-card p-3 sm:p-4 overflow-hidden relative">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", step.bg)}>
                      <Icon className={cn("w-4 h-4", step.text)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{step.label}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Etapa {idx + 1}</p>
                    </div>
                    <div className="text-right shrink-0 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-2xl font-bold text-foreground tabular-nums">{value}</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full bg-gradient-to-r transition-all duration-700 ease-out", step.color)}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Analysis */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-card via-card to-accent/30 p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[hsl(var(--primary))] to-[hsl(var(--gold))] flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-foreground">Diagnóstico com IA</h3>
            <p className="text-xs text-muted-foreground">
              Análise inteligente do funil {productFilter !== "__all__" ? "deste produto" : "geral"} ({PERIOD_LABEL[period]})
            </p>
          </div>
        </div>

        <Button
          onClick={runAnalysis}
          disabled={aiLoading || (counts.produto === 0 && counts.dados === 0)}
          className="w-full bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--gold))] hover:from-[hsl(var(--primary)/0.9)] hover:to-[hsl(var(--gold)/0.9)] text-white border-0"
        >
          {aiLoading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analisando funil...</>
          ) : (
            <><Sparkles className="w-4 h-4 mr-2" /> Analisar por que não estão comprando</>
          )}
        </Button>

        {aiError && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
            <p className="text-xs text-destructive">{aiError}</p>
          </div>
        )}

        {aiResult && (
          <div className="rounded-lg bg-background border border-border p-4 prose prose-sm max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-headings:font-bold prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1">
            <ReactMarkdown>{aiResult}</ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

const summaryAccent: Record<string, string> = {
  violet: "from-[hsl(var(--primary))]/20 to-[hsl(var(--primary))]/5 text-[hsl(var(--primary))]",
  emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-600",
  amber: "from-amber-500/20 to-amber-500/5 text-amber-600",
};

const SummaryCard = ({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: number | string; accent: string }) => (
  <div className={cn("rounded-xl border border-border bg-gradient-to-br p-3 sm:p-4", summaryAccent[accent])}>
    <div className="flex items-center gap-1.5 mb-1.5">
      {icon}
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{label}</span>
    </div>
    <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">{value}</p>
  </div>
);

export default FunnelAnalysis;
