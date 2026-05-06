const HeroBanner = () => {
  return (
    <section className="relative w-full overflow-hidden">
      <picture>
        <source
          media="(max-width: 767px)"
          srcSet="/lovable-uploads/hero-banner-alpha-mobile.jpg"
        />
        <img
          src="/lovable-uploads/hero-banner-alpha-desktop.jpg"
          alt="Alpha Oficial - Moda Masculina Premium"
          className="w-full h-auto object-cover"
          fetchPriority="high"
          decoding="async"
          width={1728}
          height={600}
        />
      </picture>
    </section>
  );
};

export default HeroBanner;
