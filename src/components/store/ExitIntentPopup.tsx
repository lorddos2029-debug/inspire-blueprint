import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
const belacasaLogo = "/logo-belacasa.png";


const STORAGE_KEY = "exit_intent_shown_v1";

interface Props {
  /** Caminho atual da rota onde o popup pode ser disparado */
  enabled?: boolean;
}

const ExitIntentPopup = ({ enabled = true }: Props) => {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const firedRef = useRef(false);
  const { applyCoupon, couponApplied } = useCart();

  useEffect(() => {
    if (!enabled) return;
    // Já viu nesta sessão? não mostra de novo
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") {
        firedRef.current = true;
        return;
      }
    } catch {}
    // Se já tem cupom aplicado, não precisa
    if (couponApplied) {
      firedRef.current = true;
      return;
    }

    const isTouchDevice =
      typeof window !== "undefined" &&
      (("ontouchstart" in window) || (navigator.maxTouchPoints || 0) > 0);

    // Tempo mínimo de permanência antes de poder disparar (evita disparo imediato ao abrir)
    const ARMED_AFTER_MS = 4000;
    const mountedAt = Date.now();
    const isArmed = () => Date.now() - mountedAt >= ARMED_AFTER_MS;

    const fire = () => {
      if (firedRef.current) return;
      if (!isArmed()) return;
      firedRef.current = true;
      try { sessionStorage.setItem(STORAGE_KEY, "1"); } catch {}
      setOpen(true);
    };

    // ===================== DESKTOP =====================
    // Sinal forte: mouse sai pelo TOPO da viewport (indo pra barra de URL/abas)
    const onMouseLeave = (e: MouseEvent) => {
      if (isTouchDevice) return;
      if (e.clientY <= 0) fire();
    };

    // ===================== MOBILE ======================
    // Sinal forte: usuário aperta "voltar" do navegador.
    // Empilhamos um state extra; quando ele tenta voltar, popstate dispara
    // e re-empilhamos pra dar mais uma chance de ele continuar na página.
    let popLockActive = false;
    if (isTouchDevice) {
      try {
        window.history.pushState({ exitLock: true }, "");
        popLockActive = true;
      } catch {}
    }

    const onPopState = () => {
      if (!isTouchDevice) return;
      // Re-empilha pra travar o usuário enquanto mostramos o popup
      try { window.history.pushState({ exitLock: true }, "");  } catch {}
      fire();
    };

    // Mobile: visibilitychange — só dispara se o usuário ficou >= 1.5s fora
    // (evita falso positivo quando o teclado abre/fecha ou troca rápida de app)
    let hiddenAt = 0;
    const onVisibility = () => {
      if (!isTouchDevice) return;
      if (document.visibilityState === "hidden") {
        hiddenAt = Date.now();
      } else if (document.visibilityState === "visible" && hiddenAt > 0) {
        const away = Date.now() - hiddenAt;
        hiddenAt = 0;
        if (away >= 1500) fire();
      }
    };

    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("popstate", onPopState);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("popstate", onPopState);
      document.removeEventListener("visibilitychange", onVisibility);
      // Limpa o state extra que empilhamos
      if (popLockActive && window.history.state?.exitLock) {
        try { window.history.back(); } catch {}
      }
    };
  }, [enabled, couponApplied]);

  const handleApply = () => {
    const ok = applyCoupon("BELACASA");
    if (ok) {
      setApplied(true);
      toast.success("Cupom BELACASA aplicado! 5% de desconto extra.");
      setTimeout(() => setOpen(false), 1200);
    } else {
      toast.info("Você já tem um cupom aplicado.");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) setOpen(false); }}>
      <DialogContent className="max-w-[90vw] md:max-w-md p-0 overflow-hidden border-0 bg-background rounded-3xl shadow-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Espere! Cupom exclusivo de 5%</DialogTitle>
        </DialogHeader>

        <div className="relative bg-primary text-primary-foreground px-8 pt-12 pb-8 text-center">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-6">
            <div className="bg-white rounded-2xl px-4 py-2 inline-flex shadow-lg transform -rotate-2">
              <img src={belacasaLogo} alt="BelaCasa" className="h-16 w-auto object-contain" decoding="async" />
            </div>
          </div>

          <h3 className="font-display text-3xl md:text-4xl font-medium leading-tight mb-3">
            Não vá embora de mãos vazias!
          </h3>
          <p className="text-sm md:text-base opacity-90 leading-relaxed max-w-[280px] mx-auto">
            Ganhamos sua confiança? Aqui está um <span className="text-[hsl(var(--gold))] font-bold">cupom de 5% OFF</span> extra para você transformar seu lar hoje.
          </p>
        </div>

        <div className="p-8 space-y-6 bg-background">
          <div className="bg-secondary/80 rounded-2xl p-6 text-center border-2 border-dashed border-border relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background px-3 py-1 rounded-full text-[10px] font-bold text-primary border border-border">
              CÓDIGO EXCLUSIVO
            </div>
            <p className="text-3xl font-bold text-foreground tracking-[0.3em] font-display">BELACASA</p>
            <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
              <Sparkles className="w-3 h-3 text-[hsl(var(--gold))]" />
              <span>Válido apenas pelos próximos 15 minutos</span>
            </div>
          </div>

          <Button
            onClick={handleApply}
            disabled={applied}
            className="w-full h-[68px] text-lg font-bold rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70"
          >
            {applied ? "✓ DESCONTO ATIVADO!" : "QUERO MEU DESCONTO AGORA"}
          </Button>

          <button
            onClick={() => setOpen(false)}
            className="w-full text-center text-xs text-muted-foreground/60 hover:text-foreground transition-colors py-1"
          >
            Continuar sem o desconto
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
