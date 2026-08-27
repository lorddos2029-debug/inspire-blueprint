import { useEffect, useState } from "react";
import { Clock3 } from "lucide-react";

const RESERVATION_SECONDS = 5 * 60;

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

/**
 * Barra de escassez com contagem regressiva de 5 minutos,
 * exibida abaixo do resumo do pedido no checkout.
 */
export const LunaReservationTimer = () => {
  const [remaining, setRemaining] = useState(RESERVATION_SECONDS);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full bg-[#15202D] rounded-lg px-4 py-2.5 flex items-center justify-center gap-2"
      role="timer"
      aria-live="polite"
    >
      <Clock3 className="w-4 h-4 text-[#C2A063]" aria-hidden="true" />
      <p className="text-xs text-white">
        Seus itens estão reservados por{" "}
        <span className="font-bold text-[#C2A063] tabular-nums">{formatTime(remaining)}</span>
      </p>
    </div>
  );
};

export default LunaReservationTimer;
