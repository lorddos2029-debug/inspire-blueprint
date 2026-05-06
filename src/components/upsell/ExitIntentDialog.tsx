import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gift, Sparkles, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  /** Preço atual exibido (sem o desconto extra) */
  currentPrice: number;
  /** Novo preço com 5% extra */
  newPrice: number;
}

const formatPrice = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ExitIntentDialog = ({ open, onClose, onAccept, currentPrice, newPrice }: Props) => {
  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-md p-0 overflow-hidden border-0 bg-background">
        <DialogHeader className="sr-only">
          <DialogTitle>Espere! Cupom exclusivo</DialogTitle>
        </DialogHeader>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white px-6 py-5 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/20 mb-2">
            <Gift className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-bold leading-tight">ESPERE! 🎁</h3>
          <p className="text-sm opacity-95 mt-1">Liberamos um cupom EXCLUSIVO pra você</p>
        </div>

        <div className="p-6 space-y-5">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" /> Cupom único — somente agora
            </span>
            <p className="text-sm text-foreground leading-relaxed">
              Antes de você ir embora, pegue <strong>5% OFF EXTRA</strong> nesta oferta.
              Não verá esse cupom de novo.
            </p>
          </div>

          <div className="bg-secondary/60 rounded-2xl p-4 text-center space-y-1">
            <p className="text-xs text-muted-foreground line-through">
              Era {formatPrice(currentPrice)}
            </p>
            <p className="text-3xl font-bold text-foreground">{formatPrice(newPrice)}</p>
            <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">
              Você economiza mais {formatPrice(currentPrice - newPrice)}
            </p>
          </div>

          <Button
            onClick={onAccept}
            className="w-full h-[60px] text-base font-bold rounded-xl bg-foreground text-background hover:bg-foreground/90"
          >
            QUERO MEU 5% OFF AGORA
          </Button>

          <button
            onClick={onClose}
            className="w-full text-center text-[11px] text-muted-foreground underline py-1"
          >
            Não, prefiro pagar mais caro
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentDialog;
