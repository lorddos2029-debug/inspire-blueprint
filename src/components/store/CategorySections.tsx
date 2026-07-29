import SafeLink from "@/components/SafeLink";
import { productCategories } from "@/data/categoryProducts";

/** Gera um id de âncora estável a partir do título da categoria */
export const categoryAnchor = (title: string): string =>
  title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const CategorySections = () => {
  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <div className="space-y-10 py-6 md:py-10">
      {productCategories.map((category) => (
        <section key={category.title} id={categoryAnchor(category.title)} className="container scroll-mt-32">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-2xl md:text-3xl font-medium text-primary">
              {category.title}
            </h2>
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