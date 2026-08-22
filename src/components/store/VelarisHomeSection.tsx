import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const VelarisHomeSection = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <span className="text-[11px] font-bold text-accent uppercase tracking-[0.3em] block">
              BEM-VINDO À
            </span>
            <h2 className="text-4xl md:text-6xl font-bold text-primary tracking-tight">
              Velaris Home
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Produtos inteligentes para a rotina real da sua casa. Cozinha, organização, eletro, casa e banho — com entrega para todo o Brasil.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
              className="w-full sm:w-auto px-10 h-14 text-[11px] font-bold uppercase tracking-widest rounded-none bg-primary hover:bg-primary/90 transition-all"
              asChild
            >
              <Link to="/#tudo-para-sua-casa">Ver Catálogo</Link>
            </Button>
            <Button 
              variant="outline"
              className="w-full sm:w-auto px-10 h-14 text-[11px] font-bold uppercase tracking-widest rounded-none border-border hover:bg-secondary transition-all"
              asChild
            >
              <Link to="/#tudo-para-sua-casa">Mais Vendidos</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-20 border-t border-border mt-20 max-w-4xl mx-auto text-center">
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Entrega</span>
            <span className="block text-sm font-bold text-primary">Todo o Brasil</span>
          </div>
          <div className="space-y-1 border-y sm:border-y-0 sm:border-x border-border py-4 sm:py-0">
            <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Parcelas</span>
            <span className="block text-sm font-bold text-primary">Até 12x</span>
          </div>
          <div className="space-y-1">
            <span className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Trocas</span>
            <span className="block text-sm font-bold text-primary">Em 7 dias</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VelarisHomeSection;
