import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

const FormasPagamento = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container max-w-3xl mx-auto py-16 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Formas de Pagamento</h1>
      <p className="text-muted-foreground leading-relaxed">Aceitamos as seguintes formas de pagamento:</p>
      <div className="space-y-4">
        <div className="p-4 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground">PIX</h3>
          <p className="text-muted-foreground">Pagamento instantâneo com 5% de desconto. O QR Code é gerado automaticamente após finalizar o pedido.</p>
        </div>
        <div className="p-4 border border-border rounded-lg">
          <h3 className="font-semibold text-foreground">Cartão de Crédito</h3>
          <p className="text-muted-foreground">Parcelamento em até 12x sem juros. Aceitamos Visa, Mastercard, Elo e Amex.</p>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default FormasPagamento;
