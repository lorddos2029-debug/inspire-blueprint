import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { Lock, Eye, ShieldCheck, FileText } from "lucide-react";

const PoliticaPrivacidade = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar de Navegação Rápida */}
          <aside className="hidden md:block w-64 shrink-0 space-y-4 sticky top-32 h-fit">
            <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Navegação</h3>
            <nav className="flex flex-col gap-2">
              <a href="#coleta" className="text-sm font-medium hover:text-primary transition-colors py-2 border-l-2 border-transparent pl-4 hover:border-primary">1. Coleta de Dados</a>
              <a href="#uso" className="text-sm font-medium hover:text-primary transition-colors py-2 border-l-2 border-transparent pl-4 hover:border-primary">2. Uso de Informações</a>
              <a href="#seguranca" className="text-sm font-medium hover:text-primary transition-colors py-2 border-l-2 border-transparent pl-4 hover:border-primary">3. Segurança</a>
              <a href="#compartilhamento" className="text-sm font-medium hover:text-primary transition-colors py-2 border-l-2 border-transparent pl-4 hover:border-primary">4. Compartilhamento</a>
              <a href="#contato" className="text-sm font-medium hover:text-primary transition-colors py-2 border-l-2 border-transparent pl-4 hover:border-primary">5. Contato</a>
            </nav>
            <div className="mt-8 p-4 bg-secondary/50 rounded-2xl border border-border space-y-3">
              <Lock className="w-5 h-5 text-primary" />
              <p className="text-[10px] text-muted-foreground leading-relaxed uppercase font-bold">Privacidade 100% Garantida</p>
            </div>
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1 space-y-12">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] font-bold uppercase tracking-widest">
                <ShieldCheck className="w-3 h-3" /> Atualizado em 2026
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-medium text-foreground">Política de Privacidade</h1>
              <p className="text-muted-foreground leading-relaxed">
                A BelaCasa valoriza a confiança depositada por nossos clientes. Esta política descreve, de forma transparente, como tratamos seus dados pessoais.
              </p>
            </header>

            <section id="coleta" className="space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">1. Coleta de Dados</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Coletamos informações fornecidas por você durante o cadastro e a compra, como nome completo, e-mail, CPF, telefone de contato e endereço completo para entrega. Estes dados são essenciais para a emissão de nota fiscal e logística.
              </p>
            </section>

            <section id="uso" className="space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">2. Uso das Informações</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Utilizamos seus dados exclusivamente para processar pedidos, enviar atualizações de entrega via e-mail/WhatsApp, e melhorar sua experiência de compra. Jamais utilizamos seus dados para finalidades não informadas anteriormente.
              </p>
            </section>

            <section id="seguranca" className="space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">3. Proteção de Dados</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Empregamos as medidas de segurança mais avançadas do mercado, incluindo criptografia SSL de 256 bits, para proteger suas informações pessoais contra qualquer acesso não autorizado. Seus dados de pagamento são processados de forma segura e não ficam armazenados em nossos servidores.
              </p>
            </section>

            <section id="compartilhamento" className="space-y-4 scroll-mt-32">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">4. Compartilhamento</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing. O compartilhamento ocorre estritamente com parceiros logísticos (Correios/Jadlog) e processadores de pagamento (Pagou.ai/PinPay) necessários para concluir sua compra.
              </p>
            </section>

            <section id="contato" className="p-8 bg-secondary/30 rounded-3xl border border-border space-y-4 scroll-mt-32">
              <h2 className="text-xl font-bold text-foreground">5. Contato</h2>
              <p className="text-muted-foreground leading-relaxed">
                Para qualquer dúvida, solicitação de exclusão ou alteração de dados, nossa equipe de privacidade está à disposição:
              </p>
              <div className="text-sm font-bold text-primary">
                contato@belacasa.com.br
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default PoliticaPrivacidade;

