import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Loader2 } from "lucide-react";

const PixProviderSettings = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      await supabase
        .from("payment_settings")
        .update({ pix_provider: "vumepay", updated_at: new Date().toISOString() })
        .eq("id", 1);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Adquirente PIX</h3>
          <p className="text-xs text-muted-foreground">
            Provedor atual usado para gerar QR Codes PIX no checkout.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="rounded-xl border-2 border-violet-500 bg-violet-500/5 p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-bold text-foreground">PrimeCash</p>
            <span className="text-[9px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              Em uso
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground font-mono mt-1 break-all">api.primecashbr.com</p>
        </div>
      )}
    </div>
  );
};

export default PixProviderSettings;
