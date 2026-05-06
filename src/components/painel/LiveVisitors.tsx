import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Eye, ShoppingCart, Wifi } from "lucide-react";

interface PageBreakdown {
  page: string;
  count: number;
}

const labelForPage = (page: string) => {
  if (!page || page === "/") return "🏠 Home";
  if (page.startsWith("/produto/")) return "🛍️ " + page.replace("/produto/", "").replace(/-/g, " ").slice(0, 32);
  if (page === "/checkout") return "💳 Checkout";
  if (page === "/obrigado") return "✅ Obrigado";
  return page;
};

const LiveVisitors = () => {
  const [total, setTotal] = useState(0);
  const [breakdown, setBreakdown] = useState<PageBreakdown[]>([]);
  const [inCheckout, setInCheckout] = useState(0);
  const [onProduct, setOnProduct] = useState(0);

  const fetchPresence = async () => {
    const cutoff = new Date(Date.now() - 60 * 1000).toISOString();
    const { data } = await supabase
      .from("live_sessions")
      .select("session_id, page")
      .gte("last_seen", cutoff);
    const sessions = data || [];
    setTotal(sessions.length);
    setInCheckout(sessions.filter((s: any) => s.page === "/checkout").length);
    setOnProduct(sessions.filter((s: any) => s.page?.startsWith("/produto/")).length);

    const map = new Map<string, number>();
    sessions.forEach((s: any) => {
      const key = s.page || "/";
      map.set(key, (map.get(key) || 0) + 1);
    });
    const sorted = Array.from(map.entries())
      .map(([page, count]) => ({ page, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    setBreakdown(sorted);
  };

  useEffect(() => {
    fetchPresence();
    const id = setInterval(fetchPresence, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <StatCard
          icon={<Wifi className="w-4 h-4" />}
          label="Online agora"
          value={total}
          accent="emerald"
          pulse
        />
        <StatCard
          icon={<Eye className="w-4 h-4" />}
          label="Em produtos"
          value={onProduct}
          accent="blue"
        />
        <StatCard
          icon={<ShoppingCart className="w-4 h-4" />}
          label="No checkout"
          value={inCheckout}
          accent="amber"
        />
      </div>

      {breakdown.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Páginas mais visitadas agora</h3>
          </div>
          <div className="space-y-1.5">
            {breakdown.map((b) => (
              <div key={b.page} className="flex items-center justify-between text-sm">
                <span className="text-foreground truncate flex-1">{labelForPage(b.page)}</span>
                <span className="ml-2 text-xs font-mono font-bold tabular-nums px-2 py-0.5 rounded bg-muted text-foreground">
                  {b.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const accentMap: Record<string, { bg: string; text: string; ring: string }> = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-600", ring: "ring-emerald-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-600", ring: "ring-blue-500/20" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-600", ring: "ring-amber-500/20" },
};

const StatCard = ({
  icon, label, value, accent, pulse,
}: {
  icon: React.ReactNode; label: string; value: number; accent: string; pulse?: boolean;
}) => {
  const a = accentMap[accent] || accentMap.blue;
  return (
    <div className={`relative rounded-xl border border-border bg-card p-3 sm:p-4 ring-1 ${a.ring}`}>
      <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg ${a.bg} ${a.text} mb-2`}>
        {icon}
      </div>
      <p className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</p>
      <div className="flex items-baseline gap-1.5">
        <p className="text-xl sm:text-2xl font-bold text-foreground tabular-nums">{value}</p>
        {pulse && value > 0 && (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
        )}
      </div>
    </div>
  );
};

export default LiveVisitors;
