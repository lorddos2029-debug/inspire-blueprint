import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

type Provider = "payout" | "pagouai";

const PROVIDERS: { id: Provider; name: string; host: string; description: string }[] = [
  { id: "payout", name: "Payout", host: "api.payoutbr.com.br", description: "Adquirente Payout" },
  { id: "pagouai", name: "Pagou.ai v2", host: "api.pagou.ai", description: "Adquirente Pagou.ai v2" },
];

const normalizeProvider = (p?: string | null): Provider => {
  if (p === "pagouai") return "pagouai";
  return "payout";
};

const CardProviderSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState<Provider>("payout");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("payment_settings").select("card_provider").eq("id", 1).maybeSingle();
      setCurrent(normalizeProvider(data?.card_provider as string));
      setLoading(false);
    })();
  }, []);

  const handleSelect = async (provider: Provider) => {
    if (saving || provider === current) return;
    setSaving(true);
    const { error } = await supabase
      .from("payment_settings")
      .upsert({ id: 1, card_provider: provider, updated_at: new Date().toISOString() }, { onConflict: "id" });
    setSaving(false);
    if (error) {
      console.error("payment_settings upsert error:", error);
      toast.error(`Erro ao salvar adquirente: ${error.message}`);
      return;
    }
    
    // Confirma lendo do banco
    const { data: check } = await supabase.from("payment_settings").select("card_provider").eq("id", 1).maybeSingle();
    const persisted = normalizeProvider(check?.card_provider as string);
    setCurrent(persisted);
    
    toast.success(`Adquirente de Cartão alterada: ${PROVIDERS.find(p => p.id === provider)?.name}`);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Adquirente Cartão</h3>
          <p className="text-xs text-muted-foreground">
            Selecione o provedor usado para processar pagamentos de cartão no checkout.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PROVIDERS.map((p) => {
            const active = current === p.id;
            return (
              <button
                key={p.id}
                type="button"
                disabled={saving}
                onClick={() => handleSelect(p.id)}
                className={`relative text-left rounded-xl border-2 p-4 transition-all disabled:opacity-60 ${
                  active ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.06)]" : "border-border hover:border-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">{p.name}</p>
                  {active && (
                    <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Em uso
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{p.description}</p>
                <p className="text-[11px] text-muted-foreground font-mono mt-1 break-all">{p.host}</p>
              </button>
            );
          })}
        </div>
      )}

      {saving && (
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" /> Salvando...
        </p>
      )}
    </div>
  );
};

export default CardProviderSettings;