import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";

const TrocasDevolucoes = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container max-w-3xl mx-auto py-16 px-4 space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Trocas e Devoluções</h1>
      <p className="text-muted-foreground leading-relaxed">Sua satisfação é nossa prioridade. Confira nossa política de trocas e devoluções.</p>
      <h2 className="text-xl font-semibold text-foreground">Prazo</h2>
      <p className="text-muted-foreground leading-relaxed">Você tem até 7 dias corridos após o recebimento do produto para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor.</p>
      <h2 className="text-xl font-semibold text-foreground">Condições</h2>
      <p className="text-muted-foreground leading-relaxed">O produto deve estar sem uso, com etiquetas e na embalagem original. Produtos danificados pelo cliente não são elegíveis para troca.</p>
      <h2 className="text-xl font-semibold text-foreground">Como solicitar</h2>
      <p className="text-muted-foreground leading-relaxed">Envie um e-mail para contato@belacasa.com.br com o número do pedido e o motivo da troca/devolução. Nossa equipe BelaCasa responderá em até 48 horas.</p>
    </div>
    <Footer />
  </div>
);

export default TrocasDevolucoes;
