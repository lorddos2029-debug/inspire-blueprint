import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "valid" | "already" | "invalid" | "success" | "error">("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Cancelar inscrição • BelaCasa";
    if (!token) { setState("invalid"); return; }
    (async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`, {
          headers: { apikey: SUPABASE_ANON },
        });
        const data = await res.json();
        if (!res.ok) { setState("invalid"); return; }
        if (data.valid === false && data.reason === "already_unsubscribed") setState("already");
        else if (data.valid) setState("valid");
        else setState("invalid");
      } catch { setState("invalid"); }
    })();
  }, [token]);

  const confirm = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
      if (error) throw error;
      if (data?.success) setState("success");
      else if (data?.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } catch { setState("error"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="p-8 max-w-md w-full text-center">
        {state === "loading" && (<><Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-muted-foreground" /><p>Validando...</p></>)}
        {state === "invalid" && (<><XCircle className="w-12 h-12 mx-auto mb-4 text-destructive" /><h1 className="text-xl font-bold mb-2">Link inválido</h1><p className="text-sm text-muted-foreground">Este link de cancelamento expirou ou é inválido.</p></>)}
        {state === "already" && (<><CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-foreground" /><h1 className="text-xl font-bold mb-2">Já cancelado</h1><p className="text-sm text-muted-foreground">Você já cancelou sua inscrição anteriormente.</p></>)}
        {state === "valid" && (
          <>
            <h1 className="text-2xl font-bold mb-3">Cancelar inscrição</h1>
            <p className="text-sm text-muted-foreground mb-6">Tem certeza que deseja parar de receber e-mails da BelaCasa?</p>
            <Button onClick={confirm} disabled={submitting} className="w-full h-12">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar cancelamento"}
            </Button>
          </>
        )}
        {state === "success" && (<><CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-foreground" /><h1 className="text-xl font-bold mb-2">Inscrição cancelada</h1><p className="text-sm text-muted-foreground">Você não receberá mais nossos e-mails.</p></>)}
        {state === "error" && (<><XCircle className="w-12 h-12 mx-auto mb-4 text-destructive" /><h1 className="text-xl font-bold mb-2">Erro</h1><p className="text-sm text-muted-foreground">Não foi possível processar. Tente novamente.</p></>)}
      </Card>
    </div>
  );
}
