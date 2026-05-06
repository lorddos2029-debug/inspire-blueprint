const AboutUs = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container max-w-3xl mx-auto text-center">
        <h2 className="text-xs tracking-[0.3em] font-semibold text-muted-foreground mb-2">
          CONHEÇA
        </h2>
        <p className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
          Sobre Nós
        </p>
        <div className="space-y-6">
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            Na <strong>Alpha Oficial</strong>, acreditamos que estilo vai além da roupa: é presença, postura e personalidade.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Nossa missão é entregar ao homem contemporâneo peças que combinam sofisticação, conforto e autoridade, elevando sua imagem em qualquer ambiente. Cada detalhe é desenvolvido para quem busca mais do que vestir-se bem — busca respeito, exclusividade e impacto.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
