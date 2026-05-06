import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Users, ArrowDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepData {
  step: string;
  count: number;
  sessions: number;
}

const STEP_LABELS: Record<string, string> = {
  dados: "Dados Pessoais",
  endereco: "Endereço",
  pagamento: "Pagamento",
};

const STEP_ORDER = ["dados", "endereco", "pagamento"];

const CheckoutFunnel = () => {
  const [data, setData] = useState<StepData[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "all">("today");

  const fetchData = async () => {
    setLoading(true);
    try {
      let query = supabase.from("checkout_events").select("*");
      
      const now = new Date();
      if (period === "today") {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        query = query.gte("created_at", start);
      } else if (period === "7d") {
        const start = new Date(now.getTime() - 7 * 86400000).toISOString();
        query = query.gte("created_at", start);
      } else if (period === "30d") {
        const start = new Date(now.getTime() - 30 * 86400000).toISOString();
        query = query.gte("created_at", start);
      }

      const { data: events, error } = await query;
      if (error) throw error;

      const stepMap: Record<string, { count: number; sessions: Set<string> }> = {};
      STEP_ORDER.forEach(s => { stepMap[s] = { count: 0, sessions: new Set() }; });

      (events || []).forEach((e: any) => {
        const step = e.step;
        if (stepMap[step]) {
          stepMap[step].count++;
          stepMap[step].sessions.add(e.session_id);
        }
      });

      setData(STEP_ORDER.map(step => ({
        step,
        count: stepMap[step].count,
        sessions: stepMap[step].sessions.size,
      })));
    } catch (err) {
      console.error("Funnel fetch error:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [period]);

  const maxSessions = Math.max(...data.map(d => d.sessions), 1);

  const STEP_COLORS = [
    "bg-blue-500",
    "bg-amber-500",
    "bg-emerald-500",
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-foreground">Funil do Checkout</h2>
        <div className="flex gap-2 flex-wrap">
          {([
            { key: "today" as const, label: "Hoje" },
            { key: "7d" as const, label: "7 dias" },
            { key: "30d" as const, label: "30 dias" },
            { key: "all" as const, label: "Todos" },
          ]).map(({ key, label }) => (
            <Button
              key={key}
              variant={period === key ? "default" : "outline"}
              size="sm"
              onClick={() => setPeriod(key)}
            >
              {label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={fetchData}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-muted-foreground py-10">Carregando...</p>
      ) : (
        <div className="space-y-3">
          {data.map((item, idx) => {
            const pct = maxSessions > 0 ? (item.sessions / maxSessions) * 100 : 0;
            const prevSessions = idx > 0 ? data[idx - 1].sessions : null;
            const dropoff = prevSessions !== null && prevSessions > 0
              ? ((prevSessions - item.sessions) / prevSessions * 100).toFixed(1)
              : null;

            return (
              <div key={item.step}>
                {idx > 0 && prevSessions !== null && (
                  <div className="flex items-center justify-center gap-2 py-1 text-xs text-muted-foreground">
                    <ArrowDown className="w-3 h-3" />
                    {prevSessions > 0 && (
                      <span className="text-destructive font-medium">
                        -{prevSessions - item.sessions} pessoas desistiram ({dropoff}%)
                      </span>
                    )}
                  </div>
                )}
                <div className="border border-border rounded-xl p-4 bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold", STEP_COLORS[idx])}>
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-foreground">{STEP_LABELS[item.step] || item.step}</span>
                    </div>
                    <div className="flex items-center gap-3 text-right">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xl font-bold text-foreground">{item.sessions}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">pessoas</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-500", STEP_COLORS[idx])}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {data.length > 0 && data[0].sessions > 0 && (
            <div className="border border-border rounded-xl p-4 bg-card/50 mt-4">
              <h3 className="text-sm font-bold text-foreground mb-2">Resumo</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total de sessões</p>
                  <p className="text-lg font-bold text-foreground">{data[0].sessions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Desistiram nos Dados</p>
                  <p className="text-lg font-bold text-destructive">
                    {data[0].sessions - (data[1]?.sessions || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Desistiram no Endereço</p>
                  <p className="text-lg font-bold text-destructive">
                    {(data[1]?.sessions || 0) - (data[2]?.sessions || 0)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Chegaram ao pagamento</p>
                  <p className="text-lg font-bold text-foreground">
                    {data[2]?.sessions || 0}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({data[0].sessions > 0 ? ((data[2]?.sessions || 0) / data[0].sessions * 100).toFixed(1) : 0}%)
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutFunnel;
