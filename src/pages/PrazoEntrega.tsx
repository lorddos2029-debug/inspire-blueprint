import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

const PrazoEntrega = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container max-w-3xl mx-auto py-16 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Prazo de Entrega</h1>
      <p className="text-muted-foreground leading-relaxed">Confira os prazos de entrega disponíveis:</p>
      <div className="space-y-4">
        <div className="p-4 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground">PAC</h3>
          <p className="text-muted-foreground">2 a 6 dias úteis — Grátis</p>
        </div>
        <div className="p-4 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground">SEDEX</h3>
          <p className="text-muted-foreground">1 a 3 dias úteis — R$ 15,23</p>
        </div>
      </div>
      <p className="text-muted-foreground leading-relaxed">Os prazos são contados a partir da confirmação do pagamento. Para regiões mais remotas, o prazo pode variar.</p>
    </div>
    <Footer />
  </div>
);

export default PrazoEntrega;
