import { useState } from "react";
import { ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";

const FEATURED_IDS = [18, 17, 16, 15, 14, 49, 47, 46, 45, 44, 43, 42, 41, 38, 1, 2, 3, 11, 12, 19, 23, 24, 25, 26, 27, 29, 30, 31, 32, 33];
const INITIAL_VISIBLE = 2;

const ProductGrid = () => {
  const [expanded, setExpanded] = useState(false);

  const featuredProducts = products.filter((p) => FEATURED_IDS.includes(p.id));
  const visibleProducts = expanded
    ? featuredProducts
    : featuredProducts.slice(0, INITIAL_VISIBLE);
  const hasMore = featuredProducts.length > INITIAL_VISIBLE;

  return (
    <section className="py-12 md:py-20 bg-background">
      <div className="container">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs tracking-[0.4em] font-semibold text-[hsl(var(--gold))]">SELEÇÃO BELACASA</span>
            <h2 className="font-display text-3xl md:text-4xl font-medium text-primary mt-2">
              Mais Vendidos da Casa
            </h2>
          </div>
          {hasMore && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              VER MAIS <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        {hasMore && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setExpanded((v) => !v)}
              className="border border-foreground text-foreground text-xs font-semibold tracking-wider uppercase px-8 py-3 hover:bg-foreground hover:text-background transition-colors"
            >
              {expanded ? "Ver menos" : "Ver todos os produtos"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
