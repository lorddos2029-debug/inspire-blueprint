import { AlertTriangle } from "lucide-react";

const UrgencyBanner = () => {
  return (
    <div className="mt-16 max-w-3xl mx-auto text-center space-y-3 bg-destructive/5 border border-destructive/20 rounded-xl p-8">
      <div className="flex items-center justify-center gap-2 text-destructive">
        <AlertTriangle className="w-5 h-5" />
        <p className="text-sm md:text-base font-bold">
          Últimas unidades disponíveis hoje
        </p>
      </div>
      <p className="text-xs md:text-sm text-muted-foreground">
        Promoção pode encerrar a qualquer momento. Garanta o seu antes que acabe.
      </p>
    </div>
  );
};

export default UrgencyBanner;
