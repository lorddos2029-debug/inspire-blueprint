import { ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";

const STORE_LOGO = "/logo-belacasa.png";

/**
 * Header branco sticky do checkout: voltar à esquerda, logo centralizada
 * e selo de ambiente seguro à direita.
 */
export const LunaHeader = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    // navigate(-1) só funciona se houver histórico; senão volta para a home.
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="container max-w-5xl mx-auto px-4 h-16 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center gap-1 text-xs md:text-sm text-gray-500 hover:text-[#C2A063] transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Voltar</span>
        </button>

        <img
          src={STORE_LOGO}
          alt="BelaCasa"
          className="h-9 md:h-11 w-auto object-contain select-none"
          decoding="async"
        />

        <div className="flex items-center gap-1.5 text-gray-500">
          <Lock className="w-3.5 h-3.5 text-[#C2A063]" />
          <span className="text-[10px] md:text-xs font-medium leading-tight">
            Ambiente
            <br className="sm:hidden" /> Seguro
          </span>
        </div>
      </div>
    </header>
  );
};

export default LunaHeader;
