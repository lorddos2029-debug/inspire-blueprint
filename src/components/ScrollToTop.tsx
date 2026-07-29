import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Rola para o topo a cada mudança de rota.
 * Quando a URL tem hash (ex: /#cama-banho), rola para a seção correspondente.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      // Aguarda o render da seção antes de rolar
      const timer = window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 120);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
