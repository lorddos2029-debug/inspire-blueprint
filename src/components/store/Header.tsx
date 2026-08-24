import { useState } from "react";
import { ShoppingCart, Menu, X, Search, User, ChevronRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import CouponBar from "./CouponBar";

const belacasaLogo = "/logo-belacasa.png";

const navLinks = [
  { label: "COZINHA", href: "/?q=cozinha#tudo-para-sua-casa" },
  { label: "ORGANIZAÇÃO", href: "/?q=organizacao#tudo-para-sua-casa" },
  { label: "ELETRO", href: "/?q=eletro#tudo-para-sua-casa" },
  { label: "CASA & BANHO", href: "/?q=banho#tudo-para-sua-casa" },
  { label: "JOGO DE CAMA", href: "/?q=cama#tudo-para-sua-casa" },
  { label: "TRAVESSEIROS", href: "/?q=travesseiro#tudo-para-sua-casa" },
  { label: "UTILIDADES", href: "/?q=utilidades#tudo-para-sua-casa" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { totalItems, totalPrice, setIsCartOpen } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const hash = href.split("#")[1];
    if (hash && location.pathname === "/") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const term = query.trim();
    navigate(term ? `/?q=${encodeURIComponent(term)}#tudo-para-sua-casa` : "/#tudo-para-sua-casa");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50">
      <CouponBar />

      <div className="bg-card">
        <div className="container relative grid grid-cols-[auto_1fr_auto] md:grid-cols-3 items-center gap-3 h-20 md:h-28">

          {/* Busca (desktop) / menu (mobile) */}
          <div className="flex items-center">
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <form onSubmit={handleSearch} className="hidden md:flex items-center w-full max-w-[320px]">
              <div className="relative w-full">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="O que você está buscando?"
                  aria-label="Buscar produtos"
                  className="w-full h-11 rounded-full bg-topbar/70 text-foreground placeholder:text-foreground/60 pl-5 pr-11 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="submit"
                  aria-label="Buscar"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-foreground/70 hover:text-foreground"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex justify-center items-center">

            <Link to="/" aria-label="BelaCasa - Início" className="flex items-center justify-center">
              <img
                src={belacasaLogo}
                alt="BelaCasa"
                className="h-16 md:h-28 w-auto object-contain select-none"
                width={500}
                height={500}
                fetchPriority="high"
                decoding="async"
              />
            </Link>
          </div>


          {/* Conta + carrinho */}
          <div className="flex items-center justify-end gap-3 md:gap-5">
            <Link
              to="/central-de-ajuda"
              className="hidden md:flex items-center gap-2 group"
              aria-label="Central de ajuda"
            >
              <span className="w-10 h-10 rounded-full bg-topbar/70 flex items-center justify-center text-foreground">
                <User className="w-5 h-5" strokeWidth={1.6} />
              </span>
              <span className="text-[11px] leading-tight font-semibold text-foreground">
                Ajuda /<br />Como comprar
              </span>
            </Link>

            <button
              onClick={() => setIsCartOpen(true)}
              className="flex items-center gap-2 group"
              aria-label="Abrir carrinho"
            >
              <span className="relative w-10 h-10 rounded-full bg-topbar/70 flex items-center justify-center text-foreground">
                <ShoppingCart className="w-5 h-5" strokeWidth={1.6} />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </span>
              <span className="hidden md:block text-[11px] leading-tight font-semibold text-foreground text-left">
                Carrinho ({totalItems})<br />
                <span className="text-muted-foreground font-medium">{formatPrice(totalPrice)}</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Barra de navegação flutuante */}
      <nav className="hidden md:block bg-transparent">
        <div className="container px-0">
          <div className="bg-card flex items-center justify-center gap-6 lg:gap-8 h-12 border-b border-border shadow-sm">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => handleNavClick(link.href)}
                className="text-[11px] font-bold text-foreground hover:text-accent transition-colors tracking-widest"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card border-t border-border">
          <div className="container py-4 flex flex-col gap-2">
            <form onSubmit={handleSearch} className="relative mb-2">
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="O que você está buscando?"
                aria-label="Buscar produtos"
                className="w-full h-11 rounded-full bg-topbar/70 text-foreground placeholder:text-foreground/60 pl-5 pr-11 text-sm outline-none"
              />
              <button
                type="submit"
                aria-label="Buscar"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/70"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="flex flex-col gap-2 mt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center justify-between p-4 bg-secondary/40 rounded-xl border border-border group active:scale-95 transition-all"
                >
                  <span className="text-[11px] font-bold text-foreground uppercase tracking-widest">
                    {link.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
