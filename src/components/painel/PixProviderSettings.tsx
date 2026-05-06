import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Check, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Provider = "payout" | "primecash";

const providers: { id: Provider; name: string; description: string }[] = [
  { id: "payout", name: "Payout", description: "api.payoutbr.com.br" },
  { id: "primecash", name: "PrimeCash", description: "api.primecashbr.com" },
];

const PixProviderSettings = () => {
  const [current, setCurrent] = useState<Provider>("payout");
  const [selected, setSelected] = useState<Provider>("payout");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("payment_settings")
        .select("pix_provider")
        .eq("id", 1)
        .maybeSingle();
      if (!error && data?.pix_provider) {
        const p = (data.pix_provider as Provider) === "primecash" ? "primecash" : "payout";
        setCurrent(p);
        setSelected(p);
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("payment_settings")
      .update({ pix_provider: selected, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar: " + error.message);
      return;
    }
    setCurrent(selected);
    toast.success(`Provedor PIX alterado para ${selected === "payout" ? "Payout" : "PrimeCash"}`);
  };

  const dirty = current !== selected;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Adquirente PIX</h3>
          <p className="text-xs text-muted-foreground">
            Escolha qual adquirente será usado para gerar QR Codes PIX no checkout.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {providers.map((p) => {
              const active = selected === p.id;
              const isCurrent = current === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p.id)}
                  className={cn(
                    "relative text-left rounded-xl border-2 p-4 pr-12 transition-all duration-200",
                    active
                      ? "border-violet-500 bg-violet-500/5 shadow-md"
                      : "border-border bg-muted/30 hover:border-violet-500/40 hover:bg-muted/50"
                  )}
                >
                  {active && (
                    <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                    </div>
                  )}
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-foreground">{p.name}</p>
                    {isCurrent && (
                      <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                        Em uso
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground font-mono mt-1 break-all">{p.description}</p>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Atual: <span className="font-semibold text-foreground">{current === "payout" ? "Payout" : "PrimeCash"}</span>
            </p>
            <button
              onClick={save}
              disabled={!dirty || saving}
              className={cn(
                "inline-flex items-center gap-2 h-10 px-5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                dirty && !saving
                  ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 hover:scale-105"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {saving ? "Salvando" : "Salvar"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PixProviderSettings;
