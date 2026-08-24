import { ShieldCheck } from "lucide-react";

export interface LunaAdviceBarProps {
  storeName?: string;
}

/**
 * Faixa fina superior de segurança do checkout.
 * Usa a cor de destaque da loja (#C2A063) com texto branco.
 */
export const LunaAdviceBar = ({ storeName = "BelaCasa" }: LunaAdviceBarProps) => {
  return (
    <div className="w-full bg-[#15202D] text-white">
      <div className="container max-w-5xl mx-auto px-4 py-2 flex items-center justify-center gap-2 text-center">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        <p className="text-[11px] md:text-xs font-medium leading-tight">
          Compra 100% protegida. Sua compra na {storeName} é processada com total segurança.
        </p>
      </div>
    </div>
  );
};

export default LunaAdviceBar;
