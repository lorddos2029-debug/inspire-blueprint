import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

const SobreNos = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container max-w-3xl mx-auto py-16 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Sobre Nós</h1>
      <p className="text-muted-foreground leading-relaxed">
        Na <strong>BelaCasa</strong>, acreditamos que estilo vai além da roupa: é presença, postura e personalidade.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Nossa missão é entregar ao homem contemporâneo peças que combinam sofisticação, conforto e autoridade, elevando sua imagem em qualquer ambiente. Cada detalhe é desenvolvido para quem busca mais do que vestir-se bem — busca respeito, exclusividade e impacto.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Trabalhamos com materiais de alta qualidade e um design pensado para o dia a dia do homem moderno, seja no trabalho, no lazer ou em ocasiões especiais.
      </p>
    </div>
    <Footer />
  </div>
);

export default SobreNos;
