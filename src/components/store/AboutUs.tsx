const AboutUs = () => {
  return (
    <section className="py-16 md:py-24 bg-secondary/40">
      <div className="container max-w-3xl mx-auto text-center">
        <h2 className="text-xs tracking-[0.4em] font-semibold text-[hsl(var(--gold))] mb-3">
          NOSSA HISTÓRIA
        </h2>
        <p className="font-display text-4xl md:text-5xl font-medium text-primary mb-8">
          Sobre a BellaCasa
        </p>
        <div className="space-y-6">
          <p className="text-lg md:text-xl text-foreground leading-relaxed">
            Na <strong className="font-semibold text-primary">BellaCasa</strong>, acreditamos que cada lar merece momentos de conforto, beleza e funcionalidade.
          </p>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Selecionamos cuidadosamente cobertores, toalhas, utensílios de mesa, organizadores e eletroportáteis das melhores marcas para transformar a sua casa em um refúgio sofisticado. Qualidade premium, design atemporal e a confiança de quem já é referência no universo de utilidades para o lar.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
