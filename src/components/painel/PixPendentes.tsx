import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { Search, Mail, Send, Clock, CheckCircle2, RefreshCw, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface PendingOrder {
  id: string;
  order_number: string | null;
  customer_name: string;
  customer_email: string;
  total: number;
  items: any;
  created_at: string | null;
  pix_reminder_sent_at: string | null;
}

type DayPreset = "all" | "today" | "yesterday" | "7d" | "custom";

const fmtPrice = (v: number) =>
  Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

const timeAgo = (d?: string | null) => {
  if (!d) return "—";
  const ms = Date.now() - new Date(d).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 60) return `${min}min atrás`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h atrás`;
  return `${Math.floor(h / 24)}d atrás`;
};

const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const endOfDay = (d: Date) => { const x = new Date(d); x.setHours(23, 59, 59, 999); return x; };

export default function PixPendentes() {
  const [orders, setOrders] = useState<PendingOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sendingAll, setSendingAll] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  // Filtro de data por dia de criação do pedido
  const [dayPreset, setDayPreset] = useState<DayPreset>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, customer_name, customer_email, total, items, created_at, pix_reminder_sent_at, payment_method, payment_status")
      .ilike("payment_method", "%pix%")
      .eq("payment_status", "pending")
      .order("created_at", { ascending: false })
      .limit(500);
    if (!error && data) setOrders(data as PendingOrder[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const ch = supabase
      .channel("pix-pendentes")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .subscribe();
    const interval = setInterval(load, 20000);
    return () => { clearInterval(interval); supabase.removeChannel(ch); };
  }, []);

  // Calcula janela [start, end] de acordo com o preset / range customizado
  const dateWindow = useMemo<{ start: Date | null; end: Date | null }>(() => {
    const now = new Date();
    if (dayPreset === "today") {
      return { start: startOfDay(now), end: endOfDay(now) };
    }
    if (dayPreset === "yesterday") {
      const y = new Date(now); y.setDate(y.getDate() - 1);
      return { start: startOfDay(y), end: endOfDay(y) };
    }
    if (dayPreset === "7d") {
      const s = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { start: startOfDay(s), end: endOfDay(now) };
    }
    if (dayPreset === "custom" && dateRange?.from) {
      const s = startOfDay(dateRange.from);
      const e = endOfDay(dateRange.to ?? dateRange.from);
      return { start: s, end: e };
    }
    return { start: null, end: null };
  }, [dayPreset, dateRange]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      // Filtro por dia de criação
      if (dateWindow.start && dateWindow.end) {
        if (!o.created_at) return false;
        const created = new Date(o.created_at);
        if (created < dateWindow.start || created > dateWindow.end) return false;
      }
      // Filtro por busca
      if (search) {
        const t = search.toLowerCase();
        const match =
          o.customer_name?.toLowerCase().includes(t) ||
          o.customer_email?.toLowerCase().includes(t) ||
          o.order_number?.toLowerCase().includes(t);
        if (!match) return false;
      }
      return true;
    });
  }, [orders, dateWindow, search]);

  const sendReminder = async (order: PendingOrder): Promise<boolean> => {
    if (!order.customer_email) return false;
    const items = (order.items as any[]) || [];
    const productSummary = items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ");
    const rawImage = items[0]?.image || "";
    const productImage = rawImage
      ? (rawImage.startsWith("http") ? rawImage : `https://alphaoficial.online${rawImage.startsWith("/") ? "" : "/"}${rawImage}`)
      : "";
    const totalFmt = fmtPrice(Number(order.total));
    const stamp = Date.now();
    try {
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "pix-reminder",
          recipientEmail: order.customer_email,
          idempotencyKey: `pix-reminder-manual-${order.id}-${stamp}`,
          templateData: {
            customerName: order.customer_name,
            orderNumber: order.order_number || String(order.id).slice(0, 8),
            total: totalFmt,
            productSummary,
            productImage,
          },
        },
      });
      if (error) throw error;
      await supabase
        .from("orders")
        .update({ pix_reminder_sent_at: new Date().toISOString() })
        .eq("id", order.id);
      return true;
    } catch (err) {
      console.error("Falha ao enviar lembrete:", err);
      return false;
    }
  };

  const handleSendOne = async (order: PendingOrder) => {
    setSendingId(order.id);
    const ok = await sendReminder(order);
    setSendingId(null);
    if (ok) { toast.success(`Lembrete enviado para ${order.customer_email}`); load(); }
    else toast.error("Falha ao enviar lembrete");
  };

  const handleSendAll = async () => {
    if (filtered.length === 0) return;
    if (!confirm(`Enviar lembrete para ${filtered.length} cliente(s) com PIX pendente${periodLabel ? ` (${periodLabel})` : ""}?`)) return;
    setSendingAll(true);
    setProgress({ done: 0, total: filtered.length });
    let sent = 0, failed = 0;
    for (let i = 0; i < filtered.length; i++) {
      const ok = await sendReminder(filtered[i]);
      if (ok) sent++; else failed++;
      setProgress({ done: i + 1, total: filtered.length });
      await new Promise((r) => setTimeout(r, 300));
    }
    setSendingAll(false);
    setProgress({ done: 0, total: 0 });
    toast.success(`Concluído: ${sent} enviado(s), ${failed} falharam`);
    load();
  };

  const exportCsv = () => {
    const header = "order_number,customer_name,customer_email,total,created_at,reminder_sent_at\n";
    const rows = filtered.map((o) =>
      [o.order_number || "", o.customer_name, o.customer_email, o.total, o.created_at || "", o.pix_reminder_sent_at || ""]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
    ).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `pix-pendentes-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const totalPending = filtered.reduce((s, o) => s + Number(o.total || 0), 0);
  const alreadyReminded = filtered.filter((o) => o.pix_reminder_sent_at).length;

  const periodLabel = useMemo(() => {
    if (dayPreset === "today") return "Hoje";
    if (dayPreset === "yesterday") return "Ontem";
    if (dayPreset === "7d") return "Últimos 7 dias";
    if (dayPreset === "custom" && dateRange?.from) {
      const f = format(dateRange.from, "dd/MM/yy", { locale: ptBR });
      if (dateRange.to && dateRange.to.getTime() !== dateRange.from.getTime()) {
        return `${f} – ${format(dateRange.to, "dd/MM/yy", { locale: ptBR })}`;
      }
      return f;
    }
    return "";
  }, [dayPreset, dateRange]);

  const presetBtn = (key: DayPreset, label: string) => (
    <button
      type="button"
      onClick={() => { setDayPreset(key); if (key !== "custom") setDateRange(undefined); }}
      className={cn(
        "h-9 px-3 rounded-lg text-xs font-semibold border transition-colors",
        dayPreset === key
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-card text-foreground border-border hover:bg-muted"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label={`PIX pendentes${periodLabel ? ` (${periodLabel})` : ""}`} value={String(filtered.length)} />
        <StatCard label="Valor total" value={fmtPrice(totalPending)} />
        <StatCard label="Já lembrados" value={`${alreadyReminded}/${filtered.length}`} />
        <StatCard label="Aguardando lembrete" value={String(filtered.length - alreadyReminded)} accent />
      </div>

      {/* Filtro por dia de criação do pedido */}
      <div className="rounded-xl border border-border bg-card p-3 space-y-2">
        <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
          Filtrar por dia em que o PIX foi gerado
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {presetBtn("all", "Tudo")}
          {presetBtn("today", "Hoje")}
          {presetBtn("yesterday", "Ontem")}
          {presetBtn("7d", "Últimos 7 dias")}

          <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                onClick={() => setDayPreset("custom")}
                className={cn(
                  "h-9 px-3 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-2",
                  dayPreset === "custom"
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-foreground border-border hover:bg-muted"
                )}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                {dayPreset === "custom" && dateRange?.from ? periodLabel : "Escolher dia / período"}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => {
                  setDateRange(range);
                  setDayPreset("custom");
                }}
                numberOfMonths={1}
                locale={ptBR}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
              <div className="p-2 border-t border-border flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setDateRange(undefined); setDayPreset("all"); setDatePickerOpen(false); }}
                >
                  Limpar
                </Button>
                <Button size="sm" onClick={() => setDatePickerOpen(false)}>
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {periodLabel && (
            <Badge variant="secondary" className="text-[11px]">
              Mostrando: {periodLabel} • {filtered.length} pedido(s)
            </Badge>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, e-mail ou nº pedido..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={load} disabled={loading} className="h-10">
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Atualizar
        </Button>
        <Button variant="outline" onClick={exportCsv} disabled={filtered.length === 0} className="h-10">
          Exportar CSV
        </Button>
        <Button onClick={handleSendAll} disabled={sendingAll || filtered.length === 0} className="h-10">
          <Send className="w-4 h-4 mr-2" />
          {sendingAll ? `Enviando ${progress.done}/${progress.total}...` : `Enviar para ${filtered.length}${periodLabel ? ` de ${periodLabel}` : ""}`}
        </Button>
      </div>

      {/* List */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-2 border-b border-border bg-muted/40 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <h3 className="text-sm font-semibold">
            Clientes com PIX pendente{periodLabel ? ` — ${periodLabel}` : ""}
          </h3>
        </div>
        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
          {filtered.map((o) => {
            const reminded = !!o.pix_reminder_sent_at;
            return (
              <div key={o.id} className="p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold truncate">{o.customer_name}</p>
                    <Badge variant="outline" className="font-mono text-[10px]">{o.order_number || o.id.slice(0, 8)}</Badge>
                    {reminded && (
                      <Badge variant="secondary" className="text-[10px]">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Lembrado {timeAgo(o.pix_reminder_sent_at)}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{o.customer_email}</p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3" /> Pedido criado {timeAgo(o.created_at)} • {fmtDate(o.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <p className="text-sm font-bold tabular-nums">{fmtPrice(o.total)}</p>
                  <Button
                    size="sm"
                    variant={reminded ? "outline" : "default"}
                    disabled={sendingId === o.id || sendingAll}
                    onClick={() => handleSendOne(o)}
                    className="h-8"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    {sendingId === o.id ? "Enviando..." : reminded ? "Reenviar" : "Enviar lembrete"}
                  </Button>
                </div>
              </div>
            );
          })}
          {!loading && filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-12">
              {periodLabel
                ? `Nenhum PIX pendente em ${periodLabel}.`
                : "Nenhum PIX pendente no momento. 🎉"}
            </p>
          )}
        </div>
      </div>

      <p className="text-[11px] text-muted-foreground italic px-1">
        Use o filtro de data para escolher exatamente quais clientes vão receber o lembrete (ex.: só os PIX gerados ontem). O envio em massa respeita o período selecionado.
      </p>
    </div>
  );
}

const StatCard = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div className={`rounded-xl border p-3 ${accent ? "border-amber-500/40 bg-amber-500/5" : "border-border bg-card"}`}>
    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">{label}</p>
    <p className="text-lg font-bold tabular-nums mt-0.5">{value}</p>
  </div>
);
