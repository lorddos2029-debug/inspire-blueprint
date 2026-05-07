import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

const PoliticaPrivacidade = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container max-w-3xl mx-auto py-16 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Política de Privacidade</h1>
      <p className="text-muted-foreground leading-relaxed">A BelaCasa valoriza a privacidade dos seus clientes. Esta política descreve como coletamos, usamos e protegemos suas informações pessoais.</p>
      <h2 className="text-xl font-semibold text-foreground">1. Coleta de Dados</h2>
      <p className="text-muted-foreground leading-relaxed">Coletamos informações fornecidas por você durante o cadastro e a compra, como nome, e-mail, CPF, telefone e endereço de entrega.</p>
      <h2 className="text-xl font-semibold text-foreground">2. Uso das Informações</h2>
      <p className="text-muted-foreground leading-relaxed">Utilizamos seus dados para processar pedidos, enviar atualizações de entrega, melhorar nossos serviços e, com seu consentimento, enviar ofertas promocionais.</p>
      <h2 className="text-xl font-semibold text-foreground">3. Proteção de Dados</h2>
      <p className="text-muted-foreground leading-relaxed">Empregamos medidas de segurança, incluindo criptografia SSL, para proteger suas informações pessoais contra acesso não autorizado.</p>
      <h2 className="text-xl font-semibold text-foreground">4. Compartilhamento</h2>
      <p className="text-muted-foreground leading-relaxed">Não vendemos nem compartilhamos seus dados com terceiros, exceto quando necessário para processamento de pagamento e entrega.</p>
      <h2 className="text-xl font-semibold text-foreground">5. Contato</h2>
      <p className="text-muted-foreground leading-relaxed">Para dúvidas sobre nossa política de privacidade, entre em contato pelo e-mail contato@belacasa.com.br.</p>
    </div>
    <Footer />
  </div>
);

export default PoliticaPrivacidade;
