import SafeLink from "@/components/SafeLink";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  tag?: string;
}

const ProductCard = ({ slug, name, price, originalPrice, image }: ProductCardProps) => {
  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <SafeLink to={`/produto/${slug}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-secondary mb-3 rounded-lg cursor-pointer">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          width={600}
          height={600}
        />
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-[11px] font-bold px-2.5 py-1 rounded-full">
            {discount}% off
          </span>
        )}
      </div>
      <h3 className="text-sm font-semibold text-foreground mb-1.5 leading-tight line-clamp-2">{name}</h3>
      <div className="flex items-center gap-2 flex-wrap">
        {originalPrice && (
          <span className="text-xs text-muted-foreground line-through">
            {formatPrice(originalPrice)}
          </span>
        )}
        <span className="text-sm font-bold text-foreground">{formatPrice(price)}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        ou 12x de {formatPrice(price / 12)}
      </p>
    </SafeLink>
  );
};

export default ProductCard;
