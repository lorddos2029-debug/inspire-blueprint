import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

const TermosUso = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container max-w-3xl mx-auto py-16 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Termos de Uso</h1>
      <p className="text-muted-foreground leading-relaxed">Ao acessar e utilizar o site BelaCasa, você concorda com os seguintes termos e condições.</p>
      <h2 className="text-xl font-semibold text-foreground">1. Uso do Site</h2>
      <p className="text-muted-foreground leading-relaxed">O site destina-se exclusivamente à compra de produtos oferecidos pela BelaCasa. É proibido o uso para fins ilegais ou não autorizados.</p>
      <h2 className="text-xl font-semibold text-foreground">2. Produtos e Preços</h2>
      <p className="text-muted-foreground leading-relaxed">Os preços podem ser alterados sem aviso prévio. Nos esforçamos para manter as informações atualizadas, mas não garantimos a ausência de erros.</p>
      <h2 className="text-xl font-semibold text-foreground">3. Pagamento</h2>
      <p className="text-muted-foreground leading-relaxed">Aceitamos pagamentos via PIX e cartão de crédito. Todas as transações são processadas com segurança.</p>
      <h2 className="text-xl font-semibold text-foreground">4. Propriedade Intelectual</h2>
      <p className="text-muted-foreground leading-relaxed">Todo o conteúdo do site, incluindo imagens, textos e logotipos, é propriedade da BelaCasa e protegido por leis de direitos autorais.</p>
    </div>
    <Footer />
  </div>
);

export default TermosUso;
