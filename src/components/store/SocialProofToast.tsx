import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";

const purchaseLog = [
  "Maria de São Paulo acabou de comprar",
  "João de Curitiba acabou de comprar",
  "Ana de Salvador acabou de comprar",
  "Carlos de Porto Alegre acabou de comprar",
  "Juliana de Belo Horizonte acabou de comprar",
  "Ricardo de Brasília acabou de comprar",
  "Fernanda de Recife acabou de comprar",
];

const productLog = [
  "um Coberdrom Sherpa",
  "uma Escova 9 em 1",
  "um Jogo de Panelas",
  "um Travesseiro Cervical",
  "uma Cadeira Presidente",
  "um Kit de Toalhas",
];

const SocialProofToast = () => {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState("");

  useEffect(() => {
    const showToast = () => {
      const user = purchaseLog[Math.floor(Math.random() * purchaseLog.length)];
      const product = productLog[Math.floor(Math.random() * productLog.length)];
      setContent(`${user} ${product}`);
      setShow(true);

      setTimeout(() => setShow(false), 5000);
    };

    // Dispara o primeiro após 8s
    const initialTimer = setTimeout(showToast, 8000);
    
    // Intervalo aleatório entre 15s e 30s
    const interval = setInterval(() => {
      if (!show) showToast();
    }, 20000 + Math.random() * 10000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed bottom-24 md:bottom-8 left-4 z-50 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="bg-card/95 backdrop-blur border border-border rounded-2xl p-4 shadow-2xl flex items-center gap-4 max-w-[280px]">
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <ShoppingBag className="w-5 h-5 text-primary" />
        </div>
        <div className="flex flex-col">
          <p className="text-[11px] font-bold text-foreground leading-tight">
            {content}
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">Há 2 minutos</p>
        </div>
      </div>
    </div>
  );
};

export default SocialProofToast;
