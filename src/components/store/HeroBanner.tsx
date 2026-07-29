import { Link } from "react-router-dom";
import { Sparkles, Hand } from "lucide-react";

const heroImage = "/assets/cp/hero.webp";

const HeroBanner = () => {
  return (
    <section className="relative w-full overflow-hidden bg-background">
      <div className="relative">
        <img
          src={heroImage}
          alt="Air Fryer Innovare - design premium para sua cozinha"
          className="w-full h-[520px] md:h-[640px] object-cover object-right"
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent md:from-background/85 md:via-background/25" />

        <div className="absolute inset-0 flex items-center">
          <div className="container">
            <div className="max-w-xl">
              <p className="text-xl md:text-3xl font-semibold tracking-tight text-primary mb-1">
                AIR FRYER INNOVARE
              </p>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-extrabold leading-[0.95] tracking-tight text-foreground">
                DESIGN
                <br />
                <span className="text-primary">PREMIUM</span>
              </h1>
              <p className="text-xl md:text-3xl font-medium text-foreground/80 mt-2 mb-8">
                PARA SUA COZINHA
              </p>

              <Link
                to="/produto/airfryer-innovare"
                className="inline-flex items-center justify-center bg-ink text-background px-10 py-4 text-base md:text-lg font-semibold hover:bg-ink/90 transition-colors"
              >
                EU QUERO &gt;&gt;
              </Link>

              <div className="flex flex-wrap items-center gap-6 mt-8">
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full border-2 border-foreground/70 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-foreground/80" strokeWidth={1.6} />
                  </span>
                  <span className="text-sm md:text-lg font-semibold text-foreground">
                    CESTO EM <span className="text-primary">VIDRO</span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-full border-2 border-foreground/70 flex items-center justify-center">
                    <Hand className="w-5 h-5 text-foreground/80" strokeWidth={1.6} />
                  </span>
                  <span className="text-sm md:text-lg font-semibold text-foreground">
                    PAINEL <span className="text-primary">DIGITAL</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
