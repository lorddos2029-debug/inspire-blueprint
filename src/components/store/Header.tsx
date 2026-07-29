import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import CouponBar from "./CouponBar";
const belacasaLogo = "/logo-belacasa.png";

const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const h = size === "lg" ? "h-16 md:h-20" : size === "sm" ? "h-10 md:h-12" : "h-14 md:h-16";
  return (
    <img
      src={belacasaLogo}
      alt="BelaCasa - Para cada canto, um lar"
      className={`${h} w-auto object-contain select-none`}
      width={500}
      height={500}
      fetchPriority="high"
      decoding="async"
    />
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/produto");

  // Cada link aponta para uma seção real da home (evita cliques que não levam a lugar nenhum)
  const navLinks = [
    { label: "NOVIDADES", href: "/#mais-vendidos" },
    { label: "CAMA & BANHO", href: "/#cama-banho" },
    { label: "ELETROPORTÁTEIS", href: "/#eletroportateis" },
    { label: "ORGANIZAÇÃO", href: "/#organizacao" },
    { label: "CONFORTO & SONO", href: "/#conforto-sono" },
    { label: "OFERTAS", href: "/#mais-vendidos" },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const hash = href.split("#")[1];
    if (!hash) return;
    if (location.pathname === "/") {
      document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };


  return (
    <>
      <CouponBar />

      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container flex items-center h-20 md:h-24">
          <div className="flex items-center w-10 md:w-auto shrink-0">
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Abrir menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="flex-1 flex justify-center">
            <Link to="/" aria-label="BelaCasa - Início">
              <Logo size={isProductPage ? "md" : "md"} />
            </Link>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              className="relative hover:text-[hsl(var(--gold))] transition-colors"
              onClick={() => setIsCartOpen(true)}
              aria-label="Sacola"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-[hsl(var(--gold))] text-primary text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        {!isProductPage && (
          <nav className="hidden md:block border-t border-border bg-background">
            <div className="container flex items-center justify-center gap-10 h-12">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="text-[11px] tracking-[0.25em] font-medium text-foreground/80 hover:text-[hsl(var(--gold))] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}

        {/* Mobile drawer */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border bg-background">
            <div className="container py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm tracking-widest font-medium text-foreground py-3 border-b border-border last:border-0"
                  onClick={() => handleNavClick(link.href)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
