import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FUNNEL_STEPS } from "@/data/upsellFunnel";
import { TrendingUp, Eye, Check, X, RefreshCw, DollarSign } from "lucide-react";

interface UpsellEvent {
  id: string;
  step_id: string;
  kind: string;
  event: string;
  product_name: string | null;
  price: number | null;
  session_id: string | null;
  created_at: string;
}

const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const UpsellAnalytics = () => {
  const [events, setEvents] = useState<UpsellEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "perfume" | "tenis">("all");

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("upsell_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (!error && data) setEvents(data as UpsellEvent[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
    const channel = supabase
      .channel("upsell-events-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "upsell_events" },
        (payload) => {
          setEvents((prev) => [payload.new as UpsellEvent, ...prev]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Aggregate by step
  const stepStats = useMemo(() => {
    const stepIds = Object.keys(FUNNEL_STEPS);
    return stepIds.map((stepId) => {
      const step = FUNNEL_STEPS[stepId];
      const stepEvents = events.filter((e) => e.step_id === stepId);
      const views = stepEvents.filter((e) => e.event === "view").length;
      const accepted = stepEvents.filter((e) => e.event === "accepted").length;
      const rejected = stepEvents.filter((e) => e.event === "rejected").length;
      const acceptanceRate = views > 0 ? (accepted / views) * 100 : 0;
      const revenue = accepted * (step.product.price || 0);
      return {
        stepId,
        kind: step.kind,
        productName: step.product.name,
        price: step.product.price,
        views,
        accepted,
        rejected,
        acceptanceRate,
        revenue,
      };
    });
  }, [events]);

  // Group by funnel (perfume / tenis)
  const groups = useMemo(() => {
    const list = stepStats.filter((s) => {
      if (filter === "all") return true;
      if (filter === "perfume") return s.stepId.includes("perfume");
      if (filter === "tenis") return s.stepId.includes("tenis");
      return true;
    });
    return list;
  }, [stepStats, filter]);

  // Totals
  const totals = useMemo(() => {
    const t = groups.reduce(
      (acc, s) => {
        acc.views += s.views;
        acc.accepted += s.accepted;
        acc.rejected += s.rejected;
        acc.revenue += s.revenue;
        return acc;
      },
      { views: 0, accepted: 0, rejected: 0, revenue: 0 },
    );
    return {
      ...t,
      acceptance: t.views > 0 ? (t.accepted / t.views) * 100 : 0,
    };
  }, [groups]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Funil de Upsell / Downsell</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Acompanhe quantas pessoas passaram, aceitaram ou recusaram cada oferta.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            {(["all", "perfume", "tenis"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-bold rounded-md transition ${
                  filter === f
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Todos" : f === "perfume" ? "Perfume" : "Tênis"}
              </button>
            ))}
          </div>
          <button
            onClick={fetchEvents}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/70 text-xs font-bold text-foreground transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Atualizar
          </button>
        </div>
      </div>

      {/* Totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Eye} label="Views totais" value={totals.views.toLocaleString("pt-BR")} color="blue" />
        <StatCard icon={Check} label="Aceitos" value={totals.accepted.toLocaleString("pt-BR")} color="emerald" />
        <StatCard icon={X} label="Recusados" value={totals.rejected.toLocaleString("pt-BR")} color="rose" />
        <StatCard icon={DollarSign} label="Receita extra" value={formatPrice(totals.revenue)} color="amber" />
      </div>

      <div className="bg-muted/30 rounded-xl p-4 flex items-center gap-3">
        <TrendingUp className="w-5 h-5 text-foreground" />
        <div className="text-sm">
          <span className="font-bold text-foreground">Taxa de aceitação geral:</span>{" "}
          <span className="text-emerald-600 font-bold">{totals.acceptance.toFixed(1)}%</span>
          <span className="text-muted-foreground ml-2">
            ({totals.accepted} aceitaram de {totals.views} visualizações)
          </span>
        </div>
      </div>

      {/* Per-step table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Detalhe por etapa
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/20 border-b border-border">
              <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3 font-semibold">Etapa</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold text-right">Views</th>
                <th className="px-4 py-3 font-semibold text-right">Aceitos</th>
                <th className="px-4 py-3 font-semibold text-right">Recusados</th>
                <th className="px-4 py-3 font-semibold text-right">Conversão</th>
                <th className="px-4 py-3 font-semibold text-right">Receita</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {groups.map((s) => (
                <tr key={s.stepId} className="hover:bg-muted/30 transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground text-xs">{s.stepId}</div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1 max-w-[260px]">
                      {s.productName}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        s.kind === "upsell"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {s.kind}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground tabular-nums">
                    {s.views}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-emerald-600 tabular-nums">
                    {s.accepted}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-rose-500 tabular-nums">
                    {s.rejected}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-16 bg-muted rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{ width: `${Math.min(100, s.acceptanceRate)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-foreground tabular-nums w-10 text-right">
                        {s.acceptanceRate.toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-foreground tabular-nums">
                    {formatPrice(s.revenue)}
                  </td>
                </tr>
              ))}
              {groups.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-muted-foreground text-sm">
                    Nenhum evento registrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const colorMap: Record<string, string> = {
  blue: "from-blue-500/10 to-blue-500/5 text-blue-600 border-blue-500/20",
  emerald: "from-emerald-500/10 to-emerald-500/5 text-emerald-600 border-emerald-500/20",
  rose: "from-rose-500/10 to-rose-500/5 text-rose-600 border-rose-500/20",
  amber: "from-amber-500/10 to-amber-500/5 text-amber-600 border-amber-500/20",
};

const StatCard = ({
  icon: Icon, label, value, color,
}: { icon: any; label: string; value: string; color: string }) => (
  <div className={`rounded-xl p-4 border bg-gradient-to-br ${colorMap[color]}`}>
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-4 h-4" />
      <p className="text-[11px] font-bold uppercase tracking-wider opacity-80">{label}</p>
    </div>
    <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
  </div>
);

export default UpsellAnalytics;
