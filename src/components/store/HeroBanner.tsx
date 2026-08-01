import { Link } from "react-router-dom";
import heroAsset from "@/assets/hero-banner-belacasa.png.asset.json";

const heroImage = heroAsset.url;

/**
 * Banner principal da home.
 * Arte atualizada com a identidade BelaCasa ("Tudo para transformar seu lar").
 * Imagem usada inteira e clicável — sem sobreposição de texto duplicado.
 */
const HeroBanner = () => {
  return (
    <section className="w-full bg-background">
      <Link
        to="/#tudo-para-sua-casa"
        aria-label="Ver todos os produtos BelaCasa"
        className="block w-full"
      >
        <img
          src={heroImage}
          alt="Tudo para transformar seu lar - BelaCasa"
          className="w-full h-auto object-cover"
          fetchPriority="high"
          decoding="async"
          width={1920}
          height={800}
        />
      </Link>
    </section>
  );
};

export default HeroBanner;
