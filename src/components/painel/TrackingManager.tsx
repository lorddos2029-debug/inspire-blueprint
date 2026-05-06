import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComp } from "@/components/ui/calendar";
import { toast } from "sonner";
import {
  Search, Mail, Package, Save, Clock, History, ChevronDown, ChevronUp,
  ExternalLink, Plus, Calendar as CalendarIcon, CheckCircle2, AlertCircle, Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ptBR } from "date-fns/locale";
import { format, startOfDay, endOfDay, subDays, isWithinInterval } from "date-fns";
import type { DateRange } from "react-day-picker";

const STATUS_OPTIONS = [
  { value: "pedido_recebido", label: "Pedido recebido", color: "bg-slate-500" },
  { value: "aguardando_pagamento", label: "Aguardando pagamento", color: "bg-amber-500" },
  { value: "pix_gerado", label: "PIX gerado", color: "bg-amber-500" },
  { value: "pagamento_aprovado", label: "Pagamento aprovado", color: "bg-emerald-500" },
  { value: "em_separacao", label: "Em separação", color: "bg-blue-500" },
  { value: "pedido_enviado", label: "Pedido enviado", color: "bg-blue-600" },
  { value: "em_transito", label: "Em trânsito", color: "bg-indigo-500" },
  { value: "saiu_para_entrega", label: "Saiu para entrega", color: "bg-violet-500" },
  { value: "entregue", label: "Entregue", color: "bg-emerald-600" },
];

const STATUS_TO_EMAIL: Record<string, string> = {
  pedido_enviado: "order-shipped",
  entregue: "order-delivered",
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

type DatePreset = "today" | "yesterday" | "7d" | "30d" | "all" | "custom";

export default function TrackingManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [historyMap, setHistoryMap] = useState<Record<string, any[]>>({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [emailFilter, setEmailFilter] = useState<"all" | "sent" | "pending" | "none">("all");
  const [editing, setEditing] = useState<Record<string, { status: string; tracking: string; note: string }>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [datePreset, setDatePreset] = useState<DatePreset>("all");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();

  const load = async () => {
    const [{ data: o }, { data: l }] = await Promise.all([
      supabase.from("orders")
        .select("id, order_number, tracking_code, tracking_status, customer_name, customer_email, customer_phone, city, state, shipping_method, created_at, payment_status, auto_next_status, auto_next_at, auto_advance_enabled")
        .order("created_at", { ascending: false }).limit(1000),
      supabase.from("email_send_log")
        .select("id, message_id, template_name, recipient_email, status, error_message, created_at")
        .in("template_name", ["order-shipped", "order-delivered"])
        .order("created_at", { ascending: false }).limit(500),
    ]);
    setOrders(o || []);
    setLogs(l || []);
  };

  const loadHistory = async (orderId: string) => {
    const { data } = await supabase.from("order_status_history")
      .select("*").eq("order_id", orderId).order("created_at", { ascending: true });
    setHistoryMap((p) => ({ ...p, [orderId]: data || [] }));
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 15000);
    const ch = supabase.channel("admin-tracking")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, load)
      .on("postgres_changes", { event: "*", schema: "public", table: "email_send_log" }, load)
      .subscribe();
    return () => { clearInterval(interval); supabase.removeChannel(ch); };
  }, []);

  // Map: email -> latest tracking email status (per template)
  const emailStatusByOrder = useMemo(() => {
    // latest per (recipient_email + template_name)
    const latest: Record<string, { status: string; created_at: string; template: string; error?: string }> = {};
    for (const l of logs) {
      const key = `${l.recipient_email?.toLowerCase()}::${l.template_name}`;
      if (!latest[key] || new Date(l.created_at) > new Date(latest[key].created_at)) {
        latest[key] = { status: l.status, created_at: l.created_at, template: l.template_name, error: l.error_message };
      }
    }
    // For each order produce the entry for the relevant template
    const map: Record<string, { status: string; template: string; created_at: string; error?: string } | null> = {};
    for (const o of orders) {
      const tpl = STATUS_TO_EMAIL[o.tracking_status];
      if (!tpl || !o.customer_email) { map[o.id] = null; continue; }
      const key = `${o.customer_email.toLowerCase()}::${tpl}`;
      map[o.id] = latest[key] || null;
    }
    return map;
  }, [logs, orders]);

  const dateRange = useMemo<{ from: Date; to: Date } | null>(() => {
    const now = new Date();
    if (datePreset === "all") return null;
    if (datePreset === "today") return { from: startOfDay(now), to: endOfDay(now) };
    if (datePreset === "yesterday") {
      const y = subDays(now, 1);
      return { from: startOfDay(y), to: endOfDay(y) };
    }
    if (datePreset === "7d") return { from: startOfDay(subDays(now, 6)), to: endOfDay(now) };
    if (datePreset === "30d") return { from: startOfDay(subDays(now, 29)), to: endOfDay(now) };
    if (datePreset === "custom" && customRange?.from) {
      return { from: startOfDay(customRange.from), to: endOfDay(customRange.to ?? customRange.from) };
    }
    return null;
  }, [datePreset, customRange]);

  const filtered = useMemo(() => orders.filter((o) => {
    if (dateRange) {
      const created = new Date(o.created_at);
      if (!isWithinInterval(created, { start: dateRange.from, end: dateRange.to })) return false;
    }
    if (statusFilter !== "all" && o.tracking_status !== statusFilter) return false;
    if (emailFilter !== "all") {
      const tpl = STATUS_TO_EMAIL[o.tracking_status];
      const e = emailStatusByOrder[o.id];
      if (emailFilter === "none") {
        if (tpl && !e) {
          // ok - no email yet for an order that should have one
        } else if (!tpl) {
          // status doesn't trigger email - exclude
          return false;
        } else {
          return false;
        }
      } else if (emailFilter === "sent") {
        if (!e || e.status !== "sent") return false;
      } else if (emailFilter === "pending") {
        if (!e || (e.status !== "pending" && e.status !== "dlq" && e.status !== "failed")) return false;
      }
    }
    if (!search) return true;
    const t = search.toLowerCase();
    return (
      o.customer_name?.toLowerCase().includes(t) ||
      o.customer_email?.toLowerCase().includes(t) ||
      o.order_number?.toLowerCase().includes(t) ||
      o.tracking_code?.toLowerCase().includes(t) ||
      o.city?.toLowerCase().includes(t)
    );
  }), [orders, search, statusFilter, dateRange, emailFilter, emailStatusByOrder]);

  // Stat counts based on date filter (ignores status/search for top cards)
  const dateScoped = useMemo(() => {
    if (!dateRange) return orders;
    return orders.filter((o) => isWithinInterval(new Date(o.created_at), { start: dateRange.from, end: dateRange.to }));
  }, [orders, dateRange]);

  const statusCounts = useMemo(() => {
    const m: Record<string, number> = {};
    dateScoped.forEach((o) => { m[o.tracking_status] = (m[o.tracking_status] || 0) + 1; });
    return m;
  }, [dateScoped]);

  const emailStats = useMemo(() => {
    let sent = 0, pending = 0, failed = 0, eligible = 0;
    for (const o of dateScoped) {
      const tpl = STATUS_TO_EMAIL[o.tracking_status];
      if (!tpl) continue;
      eligible++;
      const e = emailStatusByOrder[o.id];
      if (!e) { pending++; continue; }
      if (e.status === "sent") sent++;
      else if (e.status === "dlq" || e.status === "failed") failed++;
      else pending++;
    }
    return { sent, pending, failed, eligible };
  }, [dateScoped, emailStatusByOrder]);

  const getEdit = (o: any) => editing[o.id] || { status: o.tracking_status, tracking: o.tracking_code || "", note: "" };

  const saveOrder = async (order: any) => {
    const edit = getEdit(order);
    const newStatus = edit.status || order.tracking_status;
    const newTracking = edit.tracking ?? order.tracking_code;
    const statusChanged = newStatus !== order.tracking_status;

    const { error } = await supabase
      .from("orders")
      .update({ tracking_status: newStatus, tracking_code: newTracking })
      .eq("id", order.id);
    if (error) { toast.error("Erro ao salvar"); return; }

    if (edit.note?.trim()) {
      await supabase.from("order_status_history").insert({
        order_id: order.id, status: newStatus, note: edit.note.trim(),
      });
    }

    const tplName = STATUS_TO_EMAIL[newStatus];
    if (tplName && order.customer_email && statusChanged) {
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: tplName,
            recipientEmail: order.customer_email,
            idempotencyKey: `${tplName}-${order.id}`,
            templateData: {
              customerName: order.customer_name,
              orderNumber: order.order_number,
              trackingCode: newTracking,
            },
          },
        });
        toast.success("Atualizado e e-mail enviado ao cliente");
      } catch { toast.success("Atualizado (e-mail falhou)"); }
    } else {
      toast.success("Pedido atualizado");
    }
    setEditing((p) => { const n = { ...p }; delete n[order.id]; return n; });
    load();
    if (expanded === order.id) loadHistory(order.id);
  };

  const resendTrackingEmail = async (order: any) => {
    const tpl = STATUS_TO_EMAIL[order.tracking_status];
    if (!tpl || !order.customer_email) { toast.error("Status não envia e-mail"); return; }
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: tpl,
          recipientEmail: order.customer_email,
          idempotencyKey: `${tpl}-${order.id}-resend-${Date.now()}`,
          templateData: {
            customerName: order.customer_name,
            orderNumber: order.order_number,
            trackingCode: order.tracking_code,
          },
        },
      });
      toast.success("E-mail reenviado");
      setTimeout(load, 800);
    } catch (e: any) { toast.error("Falhou: " + (e?.message || "")); }
  };

  const addNote = async (order: any, note: string) => {
    if (!note.trim()) return;
    const { error } = await supabase.from("order_status_history").insert({
      order_id: order.id, status: order.tracking_status, note: note.trim(),
    });
    if (error) { toast.error("Erro ao adicionar nota"); return; }
    toast.success("Nota adicionada ao histórico");
    loadHistory(order.id);
  };

  const toggleExpand = (id: string) => {
    if (expanded === id) { setExpanded(null); return; }
    setExpanded(id);
    if (!historyMap[id]) loadHistory(id);
  };

  const dateLabel = (() => {
    if (datePreset === "all") return "Todas as datas";
    if (datePreset === "today") return "Hoje";
    if (datePreset === "yesterday") return "Ontem";
    if (datePreset === "7d") return "Últimos 7 dias";
    if (datePreset === "30d") return "Últimos 30 dias";
    if (datePreset === "custom" && customRange?.from) {
      const f = format(customRange.from, "dd/MM/yy", { locale: ptBR });
      const t = customRange.to ? format(customRange.to, "dd/MM/yy", { locale: ptBR }) : f;
      return f === t ? f : `${f} → ${t}`;
    }
    return "Personalizado";
  })();

  const presets: { id: DatePreset; label: string }[] = [
    { id: "today", label: "Hoje" },
    { id: "yesterday", label: "Ontem" },
    { id: "7d", label: "7 dias" },
    { id: "30d", label: "30 dias" },
    { id: "all", label: "Tudo" },
  ];

  return (
    <div className="space-y-4">
      {/* Filtro de data */}
      <div className="rounded-xl border border-border bg-card p-3 flex items-center gap-2 flex-wrap">
        <CalendarIcon className="w-4 h-4 text-muted-foreground" />
        <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mr-1">Período:</span>
        {presets.map((p) => (
          <Button
            key={p.id}
            size="sm"
            variant={datePreset === p.id ? "default" : "outline"}
            className="h-8"
            onClick={() => setDatePreset(p.id)}
          >
            {p.label}
          </Button>
        ))}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="sm"
              variant={datePreset === "custom" ? "default" : "outline"}
              className="h-8"
            >
              <CalendarIcon className="w-3.5 h-3.5 mr-1" />
              {datePreset === "custom" ? dateLabel : "Personalizado"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <CalendarComp
              mode="range"
              selected={customRange}
              onSelect={(r) => { setCustomRange(r); if (r?.from) setDatePreset("custom"); }}
              locale={ptBR}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <span className="ml-auto text-xs text-muted-foreground">
          {dateScoped.length} pedidos no período
        </span>
      </div>

      {/* Stats por status (escopo do filtro de data) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={cn(
            "p-3 rounded-xl border text-left transition-all",
            statusFilter === "all" ? "border-foreground bg-muted" : "border-border bg-card hover:border-foreground/50"
          )}
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Todos</p>
          <p className="text-2xl font-bold">{dateScoped.length}</p>
        </button>
        {["em_separacao", "pedido_enviado", "em_transito", "saiu_para_entrega", "entregue"].map((s) => {
          const opt = STATUS_OPTIONS.find((o) => o.value === s)!;
          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                statusFilter === s ? "border-foreground bg-muted" : "border-border bg-card hover:border-foreground/50"
              )}
            >
              <div className="flex items-center gap-1.5 mb-1">
                <div className={cn("w-2 h-2 rounded-full", opt.color)} />
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold truncate">{opt.label}</p>
              </div>
              <p className="text-2xl font-bold">{statusCounts[s] || 0}</p>
            </button>
          );
        })}
      </div>

      {/* Stats e-mails de rastreio */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-3 rounded-xl border border-border bg-card">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">E-mails elegíveis</p>
          <p className="text-2xl font-bold flex items-center gap-1.5"><Mail className="w-4 h-4 text-muted-foreground" />{emailStats.eligible}</p>
        </div>
        <button
          onClick={() => setEmailFilter(emailFilter === "sent" ? "all" : "sent")}
          className={cn("p-3 rounded-xl border text-left transition-all",
            emailFilter === "sent" ? "border-emerald-500 bg-emerald-500/5" : "border-border bg-card hover:border-emerald-500/50")}
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Enviados</p>
          <p className="text-2xl font-bold flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />{emailStats.sent}
          </p>
        </button>
        <button
          onClick={() => setEmailFilter(emailFilter === "pending" ? "all" : "pending")}
          className={cn("p-3 rounded-xl border text-left transition-all",
            emailFilter === "pending" ? "border-amber-500 bg-amber-500/5" : "border-border bg-card hover:border-amber-500/50")}
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Pendentes/Falhas</p>
          <p className="text-2xl font-bold flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
            <Clock className="w-4 h-4" />{emailStats.pending + emailStats.failed}
          </p>
        </button>
        <button
          onClick={() => setEmailFilter("all")}
          className={cn("p-3 rounded-xl border text-left transition-all",
            emailFilter === "all" ? "border-foreground bg-muted" : "border-border bg-card hover:border-foreground/50")}
        >
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Limpar filtro e-mail</p>
          <p className="text-sm font-semibold mt-2">Mostrar todos</p>
        </button>
      </div>

      {/* Busca */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar nome, e-mail, nº pedido, rastreio ou cidade..."
            className="pl-9 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-10 w-full sm:w-56"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {STATUS_OPTIONS.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de pedidos */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border bg-muted/40 flex items-center gap-2">
          <Package className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Pedidos & Rastreio ({filtered.length})</h3>
          <a
            href="/rastreio"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
          >
            Ver página pública <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
          {filtered.map((o) => {
            const edit = getEdit(o);
            const dirty = edit.status !== o.tracking_status || edit.tracking !== (o.tracking_code || "") || !!edit.note;
            const statusOpt = STATUS_OPTIONS.find((s) => s.value === o.tracking_status);
            const isOpen = expanded === o.id;
            const hist = historyMap[o.id] || [];
            const tpl = STATUS_TO_EMAIL[o.tracking_status];
            const emailInfo = emailStatusByOrder[o.id];

            return (
              <div key={o.id} className="p-3 hover:bg-muted/30 transition-colors">
                {/* Linha principal */}
                <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={cn("w-2 h-2 rounded-full shrink-0", statusOpt?.color || "bg-muted")} />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{o.customer_name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {o.customer_email} • {o.city}/{o.state} • {fmtDate(o.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {tpl && (
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] gap-1",
                          emailInfo?.status === "sent" && "border-emerald-500/40 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5",
                          (emailInfo?.status === "pending" || !emailInfo) && "border-amber-500/40 text-amber-700 dark:text-amber-400 bg-amber-500/5",
                          (emailInfo?.status === "dlq" || emailInfo?.status === "failed") && "border-destructive/40 text-destructive bg-destructive/5",
                        )}
                        title={emailInfo?.error || (emailInfo ? `${emailInfo.template} • ${fmtDate(emailInfo.created_at)}` : "Sem registro de e-mail")}
                      >
                        {emailInfo?.status === "sent" ? <CheckCircle2 className="w-3 h-3" /> :
                          (emailInfo?.status === "dlq" || emailInfo?.status === "failed") ? <AlertCircle className="w-3 h-3" /> :
                            <Clock className="w-3 h-3" />}
                        {emailInfo?.status === "sent" ? "E-mail enviado" :
                          (emailInfo?.status === "dlq" || emailInfo?.status === "failed") ? "E-mail falhou" :
                            emailInfo ? "E-mail pendente" : "Sem e-mail"}
                      </Badge>
                    )}
                    <Badge variant="outline" className="font-mono text-[10px]">{o.order_number}</Badge>
                    <button
                      onClick={() => toggleExpand(o.id)}
                      className="w-7 h-7 rounded-md hover:bg-muted flex items-center justify-center"
                      title="Expandir"
                    >
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Edição rápida */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <Input
                    value={edit.tracking}
                    placeholder="Código de rastreio"
                    className="h-9 text-xs font-mono"
                    onChange={(e) => setEditing((p) => ({ ...p, [o.id]: { ...edit, tracking: e.target.value } }))}
                  />
                  <Select
                    value={edit.status}
                    onValueChange={(v) => setEditing((p) => ({ ...p, [o.id]: { ...edit, status: v } }))}
                  >
                    <SelectTrigger className="h-9 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-2 h-2 rounded-full", s.color)} />
                            {s.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button size="sm" disabled={!dirty} onClick={() => saveOrder(o)} className="h-9">
                    <Save className="w-3.5 h-3.5 mr-1" /> Salvar alterações
                  </Button>
                </div>

                {/* Auto-avanço info */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs pt-2 mt-2 border-t border-border/60">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={o.auto_advance_enabled !== false}
                      onCheckedChange={async (v) => {
                        const { error } = await supabase.from("orders").update({ auto_advance_enabled: v }).eq("id", o.id);
                        if (error) toast.error("Erro"); else { toast.success(v ? "Auto-avanço ativado" : "Pausado"); load(); }
                      }}
                    />
                    <span className="text-muted-foreground">Auto-avanço</span>
                  </div>
                  {o.auto_advance_enabled !== false && o.auto_next_status ? (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>
                        Próximo: <strong className="text-foreground">{STATUS_OPTIONS.find(s => s.value === o.auto_next_status)?.label || o.auto_next_status}</strong> em {fmtDate(o.auto_next_at)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-muted-foreground italic">Sem próximo avanço agendado</span>
                  )}
                  {tpl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-[11px] ml-auto"
                      onClick={() => resendTrackingEmail(o)}
                    >
                      <Send className="w-3 h-3 mr-1" /> Reenviar e-mail
                    </Button>
                  )}
                </div>

                {/* Nota opcional */}
                {dirty && (
                  <div className="mt-2">
                    <Input
                      value={edit.note}
                      placeholder="Nota opcional para o histórico (ex: 'Encomenda chegou no CD de Curitiba')"
                      className="h-9 text-xs"
                      onChange={(e) => setEditing((p) => ({ ...p, [o.id]: { ...edit, note: e.target.value } }))}
                    />
                  </div>
                )}

                {/* Painel expandido: histórico + adicionar nota */}
                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-border space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2 flex items-center gap-1">
                        <History className="w-3 h-3" /> Histórico de movimentações
                      </p>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {hist.length === 0 && <p className="text-xs text-muted-foreground italic">Sem movimentações registradas.</p>}
                        {hist.map((h) => {
                          const opt = STATUS_OPTIONS.find((s) => s.value === h.status);
                          return (
                            <div key={h.id} className="flex items-start gap-2 p-2 bg-muted/40 rounded-md">
                              <div className={cn("w-2 h-2 rounded-full shrink-0 mt-1.5", opt?.color || "bg-muted")} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold">{opt?.label || h.status}</p>
                                {h.note && <p className="text-xs text-muted-foreground mt-0.5">{h.note}</p>}
                                <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{fmtDate(h.created_at)}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <QuickAddNote onAdd={(note) => addNote(o, note)} />
                  </div>
                )}
              </div>
            );
          })}
          {filtered.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Nenhum pedido encontrado nos filtros aplicados.</p>}
        </div>
      </div>

      {/* Logs de e-mail (rastreio) */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="px-4 py-2 border-b border-border bg-muted/40 flex items-center gap-2">
          <Mail className="w-4 h-4" />
          <h3 className="text-sm font-semibold">Logs de E-mail de Rastreio ({logs.length})</h3>
          <span className="ml-auto text-[10px] text-muted-foreground">apenas order-shipped & order-delivered</span>
        </div>
        <div className="divide-y divide-border max-h-[300px] overflow-y-auto">
          {logs.slice(0, 100).map((l) => (
            <div key={l.id} className="p-3 flex items-center justify-between gap-2 flex-wrap text-xs">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{l.template_name} → {l.recipient_email}</p>
                <p className="text-muted-foreground">{fmtDate(l.created_at)}{l.error_message ? ` • ${l.error_message}` : ""}</p>
              </div>
              <Badge variant={l.status === "sent" ? "default" : l.status === "pending" ? "secondary" : "destructive"}>
                {l.status}
              </Badge>
            </div>
          ))}
          {logs.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Nenhum e-mail de rastreio enviado ainda.</p>}
        </div>
      </div>
    </div>
  );
}

function QuickAddNote({ onAdd }: { onAdd: (note: string) => void }) {
  const [v, setV] = useState("");
  return (
    <div className="flex gap-2">
      <Input
        value={v}
        placeholder="Adicionar nova movimentação ao histórico..."
        className="h-9 text-xs"
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { onAdd(v); setV(""); } }}
      />
      <Button size="sm" className="h-9" disabled={!v.trim()} onClick={() => { onAdd(v); setV(""); }}>
        <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar
      </Button>
    </div>
  );
}
