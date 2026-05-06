import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

const CentralAjuda = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container max-w-3xl mx-auto py-16 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Central de Ajuda</h1>
      <p className="text-muted-foreground leading-relaxed">Estamos aqui para ajudar! Confira as perguntas mais frequentes ou entre em contato conosco.</p>
      <h2 className="text-xl font-semibold text-foreground">Como faço um pedido?</h2>
      <p className="text-muted-foreground leading-relaxed">Basta escolher os produtos desejados, adicionar ao carrinho e finalizar a compra seguindo as instruções de pagamento.</p>
      <h2 className="text-xl font-semibold text-foreground">Como rastreio meu pedido?</h2>
      <p className="text-muted-foreground leading-relaxed">Após o envio, você receberá o código de rastreio por e-mail. Utilize-o no site dos Correios ou transportadora.</p>
      <h2 className="text-xl font-semibold text-foreground">Preciso de mais ajuda</h2>
      <p className="text-muted-foreground leading-relaxed">Entre em contato pelo e-mail contato@alphaofc.com.br ou pelo telefone (11) 97199-7674, de segunda a sexta, das 9h às 18h.</p>
    </div>
    <Footer />
  </div>
);

export default CentralAjuda;
