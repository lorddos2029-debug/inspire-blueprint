import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

const TrabalheConosco = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container max-w-3xl mx-auto py-16 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Trabalhe Conosco</h1>
      <p className="text-muted-foreground leading-relaxed">
        A BellaCasa está sempre em busca de talentos apaixonados por casa, decoração e bem-estar, que compartilhem nossa busca por excelência e cuidado com cada detalhe do lar.
      </p>
      <p className="text-muted-foreground leading-relaxed">
        Se você é criativo, proativo e quer fazer parte de um time em crescimento no universo de utilidades para o lar, envie seu currículo para:
      </p>
      <p className="text-lg font-semibold text-foreground">contato@bellacasa.com.br</p>
      <p className="text-muted-foreground leading-relaxed">
        Coloque no assunto do e-mail: "Trabalhe Conosco - [Área de interesse]".
      </p>
    </div>
    <Footer />
  </div>
);

export default TrabalheConosco;
