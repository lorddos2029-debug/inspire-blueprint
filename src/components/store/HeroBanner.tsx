import { Link } from "react-router-dom";


/**
 * Banner principal da home.
 * Arte atualizada com a nova imagem fornecida pelo usuário.
 */
const HeroBanner = () => {
  return (
    <section className="w-full bg-background overflow-hidden">
      <Link
        to="/#tudo-para-sua-casa"
        aria-label="Ver todos os produtos BelaCasa"
        className="block w-full hover:opacity-95 transition-opacity"
      >
        <img
          src={heroAsset.url}
          alt="Tudo para transformar seu lar - BelaCasa"
          className="w-full h-auto object-cover md:max-h-[600px] lg:max-h-[650px]"
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

