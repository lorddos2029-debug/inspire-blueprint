import { Link } from "react-router-dom";
import { Instagram, Plus, Minus, Facebook } from "lucide-react";
import { useState } from "react";
const belacasaLogo = "/logo-belacasa.png";

const FooterLogo = () => (
  <img
    src={belacasaLogo}
    alt="BelaCasa - Para cada canto, um lar"
    className="h-24 md:h-28 w-auto object-contain select-none mx-auto"
    loading="lazy"
    decoding="async"
  />
);



const footerLinks = {
  ajuda: [
    { label: "Central de Ajuda", href: "/central-de-ajuda" },
    { label: "Trocas e Devoluções", href: "/trocas-e-devolucoes" },
    { label: "Prazo de Entrega", href: "/prazo-de-entrega" },
    { label: "Formas de Pagamento", href: "/formas-de-pagamento" },
  ],
  institucional: [
    { label: "Sobre Nós", href: "/sobre-nos" },
    { label: "Política de Privacidade", href: "/politica-de-privacidade" },
    { label: "Termos de Uso", href: "/termos-de-uso" },
    { label: "Trabalhe Conosco", href: "/trabalhe-conosco" },
  ],
};

const FooterAccordion = ({ title, children }: { title: string; children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border md:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full py-4 md:py-0 md:mb-4 md:cursor-default"
      >
        <h4 className="text-sm font-semibold text-foreground">{title}</h4>
        <span className="md:hidden">
          {open ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </span>
      </button>
      <div className={`overflow-hidden transition-all duration-200 ${open ? "max-h-60 pb-4" : "max-h-0"} md:max-h-none md:pb-0`}>
        {children}
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-secondary border-t border-border">
      <div className="container py-8 md:py-16">
        {/* Mobile: accordion style / Desktop: grid */}
        <div className="md:hidden space-y-0">
          <FooterAccordion title="Ajuda">
            <ul className="space-y-3">
              {footerLinks.ajuda.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          <FooterAccordion title="Institucional">
            <ul className="space-y-3">
              {footerLinks.institucional.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordion>

          <FooterAccordion title="Fale Conosco">
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>contato@belacasa.com.br</li>
              <li>(11) 97199-7674</li>
              <li>Seg a Sex: 9h às 18h</li>
            </ul>
          </FooterAccordion>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-10">
          <div>
            <FooterLogo />
            <p className="text-sm text-muted-foreground leading-relaxed mt-5">
              Casa, decoração, cama, mesa, banho e eletroportáteis selecionados com curadoria para o seu lar.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-[hsl(var(--gold))] transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-[hsl(var(--gold))] transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.25em] font-semibold text-primary mb-5">INSTITUCIONAL</h4>
            <ul className="space-y-3">
              {footerLinks.institucional.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-[hsl(var(--gold))] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.25em] font-semibold text-primary mb-5">AJUDA</h4>
            <ul className="space-y-3">
              {footerLinks.ajuda.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-[hsl(var(--gold))] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.25em] font-semibold text-primary mb-5">CONTATO</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>contato@belacasa.com.br</li>
              <li>(11) 97199-7674</li>
              <li>Seg a Sex: 9h às 18h</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 md:mt-12 pt-8 md:pt-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Logística e Segurança</p>
              <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all">
                <img src="/assets/security-google.svg" alt="Google Safe Browsing" className="h-8 w-auto" />
                <img src="/assets/security-100.svg" alt="Site 100% Seguro" className="h-8 w-auto" />
                <div className="flex items-center gap-2 border border-border px-3 py-1 rounded text-[10px] font-bold text-muted-foreground">
                  CORREIOS
                </div>
                <div className="flex items-center gap-2 border border-border px-3 py-1 rounded text-[10px] font-bold text-muted-foreground">
                  JADLOG
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end gap-3">
              <p className="text-xs text-muted-foreground">
                © 2026 BelaCasa. Todos os direitos reservados.
              </p>
              <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-medium">
                CNPJ: 27.672.847/0001-79
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
