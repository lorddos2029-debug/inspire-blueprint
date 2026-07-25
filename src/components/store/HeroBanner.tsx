const heroImage = "/assets/hero-belacasa.jpg";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-secondary">
      <div className="relative">
        <img
          src={heroImage}
          alt="BelaCasa - Casa, Conforto e Sofisticação"
          className="w-full h-[60vh] md:h-[78vh] object-cover"
          fetchPriority="high"
          decoding="async"
          width={1728}
          height={900}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/60 to-transparent md:from-background/90 md:via-background/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-xl">
              <span className="inline-block text-[10px] md:text-xs tracking-[0.4em] font-semibold text-[hsl(var(--gold))] mb-4">
                COLEÇÃO CASA &amp; CONFORTO
              </span>
              <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium leading-[1.05] text-primary mb-5">
                A sofisticação que transforma o seu lar.
              </h1>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-8 max-w-md">
                Cama, mesa, banho, organização e eletroportáteis selecionados para criar ambientes acolhedores e elegantes.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  to="/"
                  className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3.5 text-xs tracking-[0.25em] font-semibold hover:bg-primary/90 transition-colors rounded-sm"
                >
                  COMPRAR AGORA
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center justify-center border border-primary/30 text-primary px-8 py-3.5 text-xs tracking-[0.25em] font-semibold hover:bg-primary hover:text-primary-foreground transition-colors rounded-sm"
                >
                  VER COLEÇÃO
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
