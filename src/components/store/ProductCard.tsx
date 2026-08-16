import SafeLink from "@/components/SafeLink";

interface ProductCardProps {
  id: number;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  tag?: string;
}

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Card no padrão Casa Prestige: troca de imagem no hover, preço no Pix */
const ProductCard = ({ slug, name, price, originalPrice, image, hoverImage }: ProductCardProps) => {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;
  const pixPrice = price * 0.9;
  const installments = price >= 100 ? (price >= 300 ? 5 : 2) : 0;

  return (
    <SafeLink
      to={`/produto/${slug}`}
      className="group flex h-full flex-col bg-card rounded-xl overflow-hidden border border-border/60 transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(0,0,0,0.45)]"
    >
      <div className="relative aspect-square overflow-hidden bg-card">
        {discount > 0 && (
          <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest shadow-lg">
            -{discount}%
          </div>
        )}
        <img
          src={image}
          alt={name}
          className={`absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-700 group-hover:scale-105 ${
            hoverImage ? "group-hover:opacity-0" : ""
          }`}
          loading="lazy"
          decoding="async"
          width={600}
          height={600}
        />
        {hoverImage && (
          <img
            src={hoverImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 transition-all duration-700 group-hover:opacity-100 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        )}
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3">
        <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        <div className="mt-2 flex items-center gap-2 flex-wrap">
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
          {discount > 0 && (
            <span className="text-[11px] font-bold text-primary">{discount}% OFF</span>
          )}
        </div>

        <span className="mt-0.5 text-lg font-bold text-foreground">{formatPrice(price)}</span>

        {installments > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {installments}x de {formatPrice(price / installments)} sem juros
          </p>
        )}

        <p className="text-xs font-semibold text-primary mt-1">
          {formatPrice(pixPrice)} com Pix
        </p>
      </div>
    </SafeLink>
  );
};

export default ProductCard;
