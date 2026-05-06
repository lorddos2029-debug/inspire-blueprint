import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, Search, RefreshCw, ChevronDown, ChevronUp, CheckCircle2, XCircle, Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const TEMPLATE_LABELS: Record<string, string> = {
  "order-created": "Pedido criado",
  "pix-generated": "PIX gerado",
  "pix-reminder": "Lembrete PIX (5min)",
  "payment-approved": "Pagamento aprovado",
  "order-shipped": "Pedido enviado",
  "order-delivered": "Pedido entregue",
};

const EXPECTED_PIX = ["order-created", "pix-generated", "payment-approved"];
const EXPECTED_CARD = ["order-created", "payment-approved"];

const fmt = (d?: string | null) =>
  d ? new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "medium" }) : "—";

interface Order {
  id: string;
  order_number: string | null;
  customer_name: string;
  customer_email: string;
  payment_method: string;
  payment_status: string;
  created_at: string | null;
}

interface EmailLog {
  id: string;
  message_id: string | null;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  created_at: string;
}

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "sent") return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
  if (status === "pending") return <Clock className="w-3.5 h-3.5 text-amber-600" />;
  if (status === "dlq" || status === "failed" || status === "bounced") return <XCircle className="w-3.5 h-3.5 text-red-600" />;
  return <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />;
};

export default function EmailAudit() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: o }, { data: l, error: lErr }] = await Promise.all([
      supabase.from("orders")
        .select("id, order_number, customer_name, customer_email, payment_method, payment_status, created_at")
        .order("created_at", { ascending: false }).limit(300),
      supabase.rpc("admin_list_email_logs", { p_limit: 2000 }),
    ]);
    if (lErr) console.error("admin_list_email_logs error:", lErr);
    setOrders((o as Order[]) || []);
    setLogs((l as EmailLog[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    return () => { clearInterval(interval); };
  }, []);

  // Index logs by order id (via message_id suffix) and by recipient email
  const { logsByOrderId, logsByEmail } = useMemo(() => {
    const byId: Record<string, EmailLog[]> = {};
    const byEmail: Record<string, EmailLog[]> = {};
    for (const log of logs) {
      const mid = log.message_id || "";
      // idempotencyKey patterns: "<template>-<orderId>"
      const m = mid.match(/-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i);
      if (m) {
        const oid = m[1].toLowerCase();
        (byId[oid] ||= []).push(log);
      }
      const email = (log.recipient_email || "").toLowerCase();
      if (email) (byEmail[email] ||= []).push(log);
    }
    return { logsByOrderId: byId, logsByEmail: byEmail };
  }, [logs]);

  const getOrderLogs = (order: Order): EmailLog[] => {
    const direct = logsByOrderId[order.id.toLowerCase()] || [];
    if (direct.length) {
      // Deduplicate latest by message_id
      const map = new Map<string, EmailLog>();
      for (const l of direct) {
        const key = l.message_id || l.id;
        const cur = map.get(key);
        if (!cur || new Date(l.created_at) > new Date(cur.created_at)) map.set(key, l);
      }
      return Array.from(map.values()).sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
    }
    // Fallback: match by email near the order time (±24h)
    const email = (order.customer_email || "").toLowerCase();
    if (!email || !order.created_at) return [];
    const t = +new Date(order.created_at);
    return (logsByEmail[email] || []).filter((l) => {
      const dt = Math.abs(+new Date(l.created_at) - t);
      return dt < 24 * 60 * 60 * 1000;
    });
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const t = search.toLowerCase();
    return (
      o.customer_name?.toLowerCase().includes(t) ||
      o.customer_email?.toLowerCase().includes(t) ||
      o.order_number?.toLowerCase().includes(t) ||
      o.id?.toLowerCase().includes(t)
    );
  });

  // Global stats (deduplicated by message_id)
  const stats = useMemo(() => {
    const latest = new Map<string, EmailLog>();
    for (const l of logs) {
      const key = l.message_id || l.id;
      const cur = latest.get(key);
      if (!cur || new Date(l.created_at) > new Date(cur.created_at)) latest.set(key, l);
    }
    const arr = Array.from(latest.values());
    return {
      total: arr.length,
      sent: arr.filter((x) => x.status === "sent").length,
      pending: arr.filter((x) => x.status === "pending").length,
      failed: arr.filter((x) => x.status === "dlq" || x.status === "failed" || x.status === "bounced").length,
    };
  }, [logs]);

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Enviados" value={stats.sent} tone="emerald" />
        <StatCard label="Pendentes" value={stats.pending} tone="amber" />
        <StatCard label="Falharam" value={stats.failed} tone="red" />
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Buscar por nome, e-mail, nº pedido ou ID..." className="pl-9 h-10"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button variant="outline" size="sm" onClick={load} disabled={loading} className="h-10">
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
        </Button>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-2 border-b border-border bg-muted/40 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Auditoria por pedido ({filtered.length})</h3>
        </div>
        <div className="divide-y divide-border max-h-[700px] overflow-y-auto">
          {filtered.map((order) => {
            const orderLogs = getOrderLogs(order);
            const isExpanded = expanded === order.id;
            const method = (order.payment_method || "").toLowerCase();
            const isPix = method.includes("pix");
            const expected = isPix ? EXPECTED_PIX : EXPECTED_CARD;
            const sentTemplates = new Set(orderLogs.filter((l) => l.status === "sent").map((l) => l.template_name));
            const missing = expected.filter((t) => !sentTemplates.has(t));
            const hasFailures = orderLogs.some((l) => l.status === "dlq" || l.status === "failed" || l.status === "bounced");

            return (
              <div key={order.id}>
                <button
                  onClick={() => setExpanded(isExpanded ? null : order.id)}
                  className="w-full p-3 text-left hover:bg-accent/40 transition-colors flex items-center gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold truncate">{order.customer_name}</p>
                      <Badge variant="outline" className="font-mono text-[10px]">{order.order_number || order.id.slice(0, 8)}</Badge>
                      <Badge variant="outline" className="text-[10px]">{isPix ? "PIX" : "Cartão"}</Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">
                      {order.customer_email} • {fmt(order.created_at)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Badge variant="secondary" className="text-[10px]">
                      {orderLogs.length} e-mail(s)
                    </Badge>
                    {missing.length > 0 && (
                      <Badge variant="destructive" className="text-[10px]">
                        {missing.length} faltando
                      </Badge>
                    )}
                    {hasFailures && (
                      <Badge variant="destructive" className="text-[10px]">erro</Badge>
                    )}
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isExpanded && (
                  <div className="bg-accent/20 border-t border-border p-3 space-y-3">
                    {/* Expected vs sent */}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5">
                        Fluxo esperado ({isPix ? "PIX" : "Cartão"})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {expected.map((t) => {
                          const sent = sentTemplates.has(t);
                          return (
                            <Badge key={t} variant={sent ? "default" : "outline"}
                              className={cn("text-[10px] gap-1", !sent && "border-dashed text-muted-foreground")}>
                              {sent ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              {TEMPLATE_LABELS[t] || t}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>

                    {/* Email logs table */}
                    <div className="rounded-lg border border-border bg-card overflow-hidden">
                      <div className="grid grid-cols-12 gap-2 px-3 py-1.5 bg-muted/40 text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                        <div className="col-span-3">Template</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-3">Timestamp</div>
                        <div className="col-span-4">Idempotency Key</div>
                      </div>
                      {orderLogs.length === 0 ? (
                        <p className="text-center text-xs text-muted-foreground py-4">
                          Nenhum e-mail registrado para este pedido.
                        </p>
                      ) : (
                        orderLogs.map((log) => (
                          <div key={log.id} className="grid grid-cols-12 gap-2 px-3 py-2 text-xs border-t border-border items-center">
                            <div className="col-span-3 font-medium truncate" title={log.template_name}>
                              {TEMPLATE_LABELS[log.template_name] || log.template_name}
                            </div>
                            <div className="col-span-2 flex items-center gap-1">
                              <StatusIcon status={log.status} />
                              <span className="capitalize">{log.status}</span>
                            </div>
                            <div className="col-span-3 text-muted-foreground tabular-nums">{fmt(log.created_at)}</div>
                            <div className="col-span-4 font-mono text-[10px] truncate text-muted-foreground" title={log.message_id || ""}>
                              {log.message_id || "—"}
                            </div>
                            {log.error_message && (
                              <div className="col-span-12 text-[10px] text-red-600 bg-red-500/5 rounded px-2 py-1">
                                ⚠ {log.error_message}
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">Nenhum pedido encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, tone }: { label: string; value: number; tone?: "emerald" | "amber" | "red" }) => (
  <div className={cn(
    "rounded-xl border p-3",
    tone === "emerald" && "border-emerald-500/30 bg-emerald-500/5",
    tone === "amber" && "border-amber-500/30 bg-amber-500/5",
    tone === "red" && "border-red-500/30 bg-red-500/5",
    !tone && "border-border bg-card",
  )}>
    <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">{label}</p>
    <p className={cn(
      "text-xl font-bold tabular-nums",
      tone === "emerald" && "text-emerald-700",
      tone === "amber" && "text-amber-700",
      tone === "red" && "text-red-700",
    )}>{value}</p>
  </div>
);
