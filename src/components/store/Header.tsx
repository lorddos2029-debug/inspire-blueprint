import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import CouponBar from "./CouponBar";

const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const titleSize = size === "lg" ? "text-3xl md:text-4xl" : size === "sm" ? "text-xl md:text-2xl" : "text-2xl md:text-3xl";
  return (
    <div className="flex flex-col items-center leading-none select-none">
      <span className={`font-display ${titleSize} font-semibold tracking-tight text-primary`}>
        Bella<span className="italic text-[hsl(var(--gold))]">Casa</span>
      </span>
      <span className="mt-0.5 text-[9px] md:text-[10px] tracking-[0.4em] font-medium text-muted-foreground uppercase">
        Casa &amp; Conforto
      </span>
    </div>
  );
};

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/produto");

  const navLinks = [
    { label: "NOVIDADES", href: "/" },
    { label: "CAMA & BANHO", href: "/" },
    { label: "MESA POSTA", href: "/" },
    { label: "ELETROPORTÁTEIS", href: "/" },
    { label: "ORGANIZAÇÃO", href: "/" },
    { label: "OFERTAS", href: "/" },
  ];

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
            <Link to="/" aria-label="BellaCasa - Início">
              <Logo size={isProductPage ? "md" : "md"} />
            </Link>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {!isProductPage && (
              <button className="hidden md:block hover:text-[hsl(var(--gold))] transition-colors" aria-label="Buscar">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}
            {!isProductPage && (
              <button className="hidden md:block hover:text-[hsl(var(--gold))] transition-colors" aria-label="Favoritos">
                <Heart className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}
            {!isProductPage && (
              <button className="hidden md:block hover:text-[hsl(var(--gold))] transition-colors" aria-label="Conta">
                <User className="w-5 h-5" strokeWidth={1.5} />
              </button>
            )}
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
                  onClick={() => setMobileMenuOpen(false)}
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
