import { Link } from "react-router-dom";

const heroImage = "/assets/cp/hero.webp";

/**
 * Banner principal da home.
 * A arte já contém a chamada ("Design Premium para sua cozinha"), então a
 * imagem é usada inteira e clicável — sem sobreposição de texto duplicado.
 */
const HeroBanner = () => {
  return (
    <section className="w-full bg-background">
      <Link
        to="/produto/airfryer-innovare"
        aria-label="Air Fryer Innovare - Design premium para sua cozinha"
        className="block w-full"
      >
        <img
          src={heroImage}
          alt="Air Fryer Innovare com design premium para sua cozinha"
          className="w-full h-auto object-cover"
          fetchpriority="high"
          decoding="async"
          width={1920}
          height={800}
        />
      </Link>
    </section>
  );
};

export default HeroBanner;
