import { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";


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
      <DialogContent className="max-w-sm p-0 overflow-hidden border-0 bg-background rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle>Espere! Cupom exclusivo de 5%</DialogTitle>
        </DialogHeader>

        <div className="relative bg-foreground text-background px-6 pt-8 pb-6 text-center">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/10 hover:bg-background/20 flex items-center justify-center transition"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex justify-center mb-4">
            <span className="font-display text-3xl font-semibold tracking-tight text-primary">Bella<span className="italic text-[hsl(var(--gold))]">Casa</span></span>
          </div>

          <h3 className="text-2xl font-bold leading-tight">
            Espere! Não vá embora
          </h3>
          <p className="text-sm opacity-90 mt-2 leading-relaxed">
            Liberamos um <strong>cupom de 5% OFF</strong> exclusivo pra você fechar seu pedido agora.
          </p>
        </div>

        <div className="p-6 space-y-4 bg-background">
          <div className="bg-secondary/50 rounded-xl p-4 text-center">
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-semibold">Seu cupom</p>
            <p className="text-2xl font-bold text-foreground tracking-[0.2em] mt-1">BELACASA</p>
            <p className="text-[11px] text-muted-foreground mt-1">5% OFF em todo o carrinho</p>
          </div>

          <Button
            onClick={handleApply}
            disabled={applied}
            className="w-full h-[60px] text-base font-bold rounded-xl bg-foreground text-background hover:bg-foreground/90 disabled:opacity-70"
          >
            {applied ? "✓ Cupom aplicado!" : "APLICAR DESCONTO"}
          </Button>

          <button
            onClick={() => setOpen(false)}
            className="w-full text-center text-[11px] text-muted-foreground underline py-1"
          >
            Não, prefiro pagar o preço cheio
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;
