import { Link } from "react-router-dom";
import { Instagram, Plus, Minus } from "lucide-react";
import logo from "@/assets/logo.png";
import { useState } from "react";

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
              <li>contato@alphaofc.com.br</li>
              <li>(11) 97199-7674</li>
              <li>Seg a Sex: 9h às 18h</li>
            </ul>
          </FooterAccordion>
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-4 gap-10">
          <div>
            <img src={logo} alt="Alpha Oficial" className="h-12 w-auto mb-4" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Moda masculina com atitude. Peças exclusivas para quem busca estilo e qualidade.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://www.instagram.com/alpha_oficialbr" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-muted-foreground transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xs tracking-widest font-semibold text-foreground mb-4">INSTITUCIONAL</h4>
            <ul className="space-y-3">
              {footerLinks.institucional.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest font-semibold text-foreground mb-4">AJUDA</h4>
            <ul className="space-y-3">
              {footerLinks.ajuda.map((item) => (
                <li key={item.label}>
                  <Link to={item.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-widest font-semibold text-foreground mb-4">CONTATO</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>contato@alphaofc.com.br</li>
              <li>(11) 97199-7674</li>
              <li>Seg a Sex: 9h às 18h</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 md:mt-12 pt-6 md:pt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Alpha Oficial. Todos os direitos reservados. CNPJ: 27.672.847/0001-79
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
