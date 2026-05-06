import { ChevronRight } from "lucide-react";
import SafeLink from "@/components/SafeLink";
import { productCategories } from "@/data/categoryProducts";

const CategorySections = () => {
  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-10 py-6 md:py-10">
      {productCategories.map((category) => (
        <section key={category.title} className="container">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg md:text-xl font-bold text-foreground">
              {category.title}
            </h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
              VER MAIS <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {category.products.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <SafeLink key={product.id} to={`/produto/${product.slug}`} className="group block cursor-pointer">
                  <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-3 rounded-lg">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      width={600}
                      height={800}
                    />
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[11px] font-bold px-2.5 py-1 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-tight line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {product.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-sm font-bold text-foreground">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    ou 12x de {formatPrice(product.price / 12)}
                  </p>
                </SafeLink>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
};

export default CategorySections;