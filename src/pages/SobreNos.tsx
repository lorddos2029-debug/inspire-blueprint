import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import { ShieldCheck, Truck, Heart, Star } from "lucide-react";

const SobreNos = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <div className="container py-12 md:py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 md:mb-16 space-y-4">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Nossa Essência</span>
          <h1 className="font-display text-4xl md:text-6xl font-medium text-foreground leading-tight">
            Para cada canto,<br /><span className="text-primary italic">um lar de verdade.</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Onde o conforto encontra a sofisticação.</h2>
            <p className="text-muted-foreground leading-relaxed">
              Na <strong className="text-foreground">BelaCasa</strong>, acreditamos que o seu lar é o seu refúgio mais sagrado. Por isso, nossa curadoria é focada em transformar espaços comuns em ambientes extraordinários.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Do toque macio de um cobertor Sherpa à tecnologia de uma escova de limpeza multifuncional, cada produto em nosso catálogo é escolhido sob um rigoroso critério de qualidade, design e funcionalidade.
            </p>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <img 
              src="/assets/hero-belacasa.jpg" 
              alt="Ambiente BelaCasa" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <div className="p-6 bg-secondary/50 rounded-2xl border border-border text-center space-y-3">
            <Heart className="w-8 h-8 text-primary mx-auto" />
            <h3 className="font-bold text-sm uppercase">Curadoria</h3>
            <p className="text-xs text-muted-foreground">Produtos selecionados para durar e encantar.</p>
          </div>
          <div className="p-6 bg-secondary/50 rounded-2xl border border-border text-center space-y-3">
            <ShieldCheck className="w-8 h-8 text-primary mx-auto" />
            <h3 className="font-bold text-sm uppercase">Segurança</h3>
            <p className="text-xs text-muted-foreground">Processos transparentes e ambiente 100% seguro.</p>
          </div>
          <div className="p-6 bg-secondary/50 rounded-2xl border border-border text-center space-y-3">
            <Truck className="w-8 h-8 text-primary mx-auto" />
            <h3 className="font-bold text-sm uppercase">Agilidade</h3>
            <p className="text-xs text-muted-foreground">Logística eficiente para todo o território nacional.</p>
          </div>
          <div className="p-6 bg-secondary/50 rounded-2xl border border-border text-center space-y-3">
            <Star className="w-8 h-8 text-primary mx-auto" />
            <h3 className="font-bold text-sm uppercase">Excelência</h3>
            <p className="text-xs text-muted-foreground">Atendimento humanizado focado na sua satisfação.</p>
          </div>
        </div>

        <div className="bg-primary text-primary-foreground rounded-[40px] p-8 md:p-16 text-center space-y-6">
          <h2 className="font-display text-3xl md:text-5xl">Milhares de lares transformados.</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto leading-relaxed">
            Nossa missão não é apenas vender utilidades, mas proporcionar experiências. Agradecemos a cada um dos nossos milhares de clientes que confiam na BelaCasa para fazer parte do seu dia a dia.
          </p>
          <div className="pt-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[hsl(var(--gold))] text-primary rounded-full font-bold text-sm uppercase tracking-widest shadow-lg">
              Desde 2026 inovando seu lar
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
);

export default SobreNos;

