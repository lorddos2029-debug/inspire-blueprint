import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Newsletter = () => {
  return (
    <section className="py-16 md:py-24 bg-primary text-primary-foreground">
      <div className="container max-w-xl text-center">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
          Fique por dentro
        </h2>
        <p className="text-sm opacity-80 mb-8">
          Cadastre-se e receba ofertas exclusivas e lançamentos em primeira mão.
        </p>
        <div className="flex gap-0">
          <Input
            placeholder="Seu melhor e-mail"
            className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/50 rounded-none flex-1"
          />
          <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-none px-8 text-xs tracking-widest font-semibold">
            ENVIAR
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
