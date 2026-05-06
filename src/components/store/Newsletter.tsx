import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container max-w-xl text-center">
        <span className="text-xs tracking-[0.4em] font-semibold text-[hsl(var(--gold))]">
          NEWSLETTER BELLACASA
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-medium mt-3 mb-4">
          Inspirações para o seu lar
        </h2>
        <p className="text-sm opacity-80 mb-8">
          Cadastre-se e receba ofertas exclusivas, lançamentos e dicas de decoração em primeira mão.
        </p>
        <div className="flex gap-0">
          <Input
            placeholder="Seu melhor e-mail"
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-l-sm rounded-r-none flex-1"
          />
          <Button className="bg-[hsl(var(--gold))] text-primary hover:bg-[hsl(var(--gold))]/90 rounded-l-none rounded-r-sm px-8 text-xs tracking-[0.25em] font-semibold">
            ASSINAR
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
