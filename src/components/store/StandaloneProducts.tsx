import SafeLink from "@/components/SafeLink";
import { standaloneProducts } from "@/data/standaloneProducts";

const StandaloneProducts = () => {
  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <section className="py-10 md:py-16 bg-background">
      <div className="container">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
            Acessórios & Complementos
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
          {standaloneProducts.map((product) => {
            const discount = product.originalPrice
              ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
              : 0;

            return (
              <SafeLink key={product.id} to={`/produto/${product.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-3 rounded-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                    width={600}
                    height={800}
                  />
                  {discount > 0 && (
                    <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[11px] font-bold px-2.5 py-1 rounded-full">
                      {discount}% off
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
      </div>
    </section>
  );
};

export default StandaloneProducts;
