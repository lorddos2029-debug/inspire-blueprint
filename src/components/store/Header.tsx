import { useState } from "react";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useCart } from "@/contexts/CartContext";
import CouponBar from "./CouponBar";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const location = useLocation();
  const isProductPage = location.pathname.startsWith("/produto");

  const navLinks = [
    { label: "NOVIDADES", href: "/" },
    { label: "CAMISETAS", href: "/" },
    { label: "CALÇAS", href: "/" },
    { label: "BERMUDAS", href: "/" },
    { label: "ACESSÓRIOS", href: "/" },
    { label: "SALE", href: "/" },
  ];

  return (
    <>
      <CouponBar />

      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container flex items-center h-16 md:h-20">
          {/* Left: Hamburger menu (mobile) */}
          <div className="flex items-center w-10 md:w-auto shrink-0">
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Center: Logo - always centered */}
          <div className="flex-1 flex justify-center">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="Alpha Oficial"
                className={`w-auto object-contain ${
                  isProductPage
                    ? "h-20 sm:h-28 md:h-32 max-w-[280px] sm:max-w-none"
                    : "h-20 sm:h-24 md:h-28 max-w-[240px] sm:max-w-none"
                }`}
              />
            </Link>
          </div>

          {/* Desktop nav - hidden on mobile */}
          {!isProductPage && (
            <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2" style={{ display: 'none' }}>
              {/* Nav links hidden - using hamburger menu instead */}
            </nav>
          )}

          {/* Right: Icons */}
          <div className="flex items-center gap-3 shrink-0">
            {!isProductPage && (
              <button className="hidden md:block hover:text-muted-foreground transition-colors">
                <Search className="w-5 h-5" />
              </button>
            )}
            {!isProductPage && (
              <button className="hidden md:block hover:text-muted-foreground transition-colors">
                <User className="w-5 h-5" />
              </button>
            )}
            <button
              className="relative hover:text-muted-foreground transition-colors"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation drawer */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border bg-background">
            <div className="container py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="text-sm tracking-widest font-medium text-foreground py-2"
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
