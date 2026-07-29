import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "./ProductCard";
import { products } from "@/data/products";

/** Normaliza texto para busca (remove acentos e caixa) */
const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const ProductGrid = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const visibleProducts = useMemo(() => {
    if (!query) return products;
    const term = normalize(query);
    return products.filter((product) => normalize(product.name).includes(term));
  }, [query]);

  return (
    <section id="tudo-para-sua-casa" className="py-10 md:py-16 bg-background scroll-mt-32">
      <div className="container">
        <h2 className="font-display text-2xl md:text-[28px] font-bold text-foreground mb-6 md:mb-8">
          {query ? `Resultados para "${query}"` : "Tudo para a sua Casa"}
        </h2>

        {visibleProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum produto encontrado. Tente outra busca.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visibleProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
