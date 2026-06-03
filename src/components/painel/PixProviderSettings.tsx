import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Loader2, Check } from "lucide-react";
import { toast } from "sonner";

type Provider = "primecash" | "vumepay";

const PROVIDERS: { id: Provider; name: string; host: string; description: string }[] = [
  { id: "primecash", name: "PrimeCash / Payout", host: "api.primecashbrasil.com", description: "Adquirente padrão com antifraude" },
  { id: "vumepay", name: "VumePay", host: "api.vumepay.com.br", description: "Adquirente alternativa" },
];

const PixProviderSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState<Provider>("vumepay");

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("payment_settings").select("pix_provider").eq("id", 1).maybeSingle();
      const p = (data?.pix_provider as string) || "vumepay";
      setCurrent((p === "primecash" || p === "payout") ? "primecash" : "vumepay");
      setLoading(false);
    })();
  }, []);

  const handleSelect = async (provider: Provider) => {
    if (saving || provider === current) return;
    setSaving(true);
    const { error } = await supabase
      .from("payment_settings")
      .update({ pix_provider: provider, updated_at: new Date().toISOString() })
      .eq("id", 1);
    setSaving(false);
    if (error) {
      toast.error("Erro ao salvar adquirente");
      return;
    }
    setCurrent(provider);
    toast.success(`Adquirente alterada: ${PROVIDERS.find(p => p.id === provider)?.name}`);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Adquirente PIX</h3>
          <p className="text-xs text-muted-foreground">
            Selecione o provedor usado para gerar QR Codes PIX no checkout.
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
                  active ? "border-violet-500 bg-violet-500/5" : "border-border hover:border-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">{p.name}</p>
                  {active && (
                    <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
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

export default PixProviderSettings;
