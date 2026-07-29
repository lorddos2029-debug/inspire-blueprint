import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { products, type Product } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { productCategories } from "@/data/categoryProducts";
import { standaloneProducts } from "@/data/standaloneProducts";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import Header from "@/components/store/Header";
import Footer from "@/components/store/Footer";
import ExitIntentPopup from "@/components/store/ExitIntentPopup";
import Newsletter from "@/components/store/Newsletter";
import ProductDescription from "@/components/store/ProductDescription";
import ProductDetails from "@/components/store/ProductDetails";
import ProductReviews from "@/components/store/ProductReviews";
import ProductFAQ from "@/components/store/ProductFAQ";
import ProductCard from "@/components/store/ProductCard";
import SocialProofCarousel from "@/components/store/SocialProofCarousel";
import QualityFeatures from "@/components/store/QualityFeatures";

import {
  Truck,
  RefreshCw,
  CreditCard,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const fallbackCategoryProducts: Product[] = productCategories.flatMap((category, categoryIndex) =>
  category.products.map((product, productIndex) => ({
    id: 100 + categoryIndex * 10 + productIndex,
    name: product.name,
    slug: product.slug || `${product.id}`,
    price: product.price,
    originalPrice: product.originalPrice,
    image: product.image,
    images: [product.image],
    tag: product.tag,
    description: `${product.name} com acabamento premium, visual elegante e proposta versátil para o dia a dia.`,
    sizes: [],
    colorVariants: [],
  })),
);

const fallbackStandaloneProducts: Product[] = standaloneProducts.map((product, index) => ({
  id: 200 + index,
  name: product.name,
  slug: product.slug,
  price: product.price,
  originalPrice: product.originalPrice,
  image: product.image,
  images: product.images && product.images.length > 0 ? product.images : [product.image],
  tag: product.tag,
  description: `${product.name} com design sofisticado e excelente custo-benefício para complementar o visual.`,
  sizes: [],
  colorVariants: [],
}));

const fallbackProducts: Product[] = [...fallbackCategoryProducts, ...fallbackStandaloneProducts];

const ProductPage = () => {
  const { slug } = useParams();
  const mainProduct = [...products].reverse().find((p) => p.slug === slug);
  const product: Product | undefined = mainProduct || fallbackProducts.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product?.sizes && product.sizes.length === 1 ? product.sizes[0] : null
  );
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [showSizeError, setShowSizeError] = useState(false);
  const [kitSizes, setKitSizes] = useState<Record<number, string>>({});
  const [showKitError, setShowKitError] = useState(false);

  const isKitMultiSize = false;



  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      try { sessionStorage.setItem("last_product_slug", slug); } catch {}
    }
  }, [product, slug]);

  useEffect(() => {
    if (product && typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_ids: [String(product.id)],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'BRL',
      });
    }
    // Track funnel step "produto"
    if (product) {
      try {
        let sid = sessionStorage.getItem('checkout_session_id');
        if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem('checkout_session_id', sid); }
        supabase.from('checkout_events').insert({
          session_id: sid,
          step: 'produto',
          product_id: String(product.slug || product.id),
          page: 'product',
        } as any).then(() => {}, (e) => console.error('Track produto error:', e));
      } catch (e) { console.error('Track produto error:', e); }
    }
  }, [slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produto não encontrado</h1>
          <Link to="/">
            <Button>Voltar à Loja</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const baseImages = product.images || [product.image];
  const variantImagesExtra = (product.colorVariants || [])
    .map((v) => v.image)
    .filter((img): img is string => !!img && !baseImages.includes(img));
  const images = [...baseImages, ...variantImagesExtra];
  const formatPrice = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const pixDiscountRate = product.id === 46 ? 0.05 : 0.10;
  const pixDiscountLabel = product.id === 46 ? "5%" : "10%";
  const pixPrice = product.price * (1 - pixDiscountRate);

  /**
   * Adiciona o produto à sacola.
   * @param goToCheckout quando true, leva direto ao checkout (compra em 1 clique)
   */
  const handleAddToCart = (goToCheckout = false) => {
    const needsSize = product.sizes && product.sizes.length > 0;
    const needsColor = product.colorVariants && product.colorVariants.length > 0;

    const failValidation = (setter: (v: boolean) => void) => {
      setter(true);
      const label = (product.sizeLabel || "tamanho").toLowerCase() === "voltagem" ? "a voltagem" : "o tamanho";
      toast.error(`Selecione ${label} antes de continuar`);
      document
        .getElementById("variant-selector")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    if (isKitMultiSize && product.colorVariants && product.sizes) {
      const allSelected = product.colorVariants.every((_, idx) => kitSizes[idx]);
      if (!allSelected) { failValidation(setShowKitError); return; }
    } else if (needsSize && !selectedSize) { failValidation(setShowSizeError); return; }

    const selectedColorLabel = needsColor
      ? product.colorVariants[selectedColor]?.label
      : undefined;

    // Facebook Pixel - AddToCart (InitiateCheckout é disparado ao entrar no /checkout)
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'AddToCart', {
        content_ids: [String(product.id)],
        content_name: product.name,
        content_type: 'product',
        value: product.price,
        currency: 'BRL',
        num_items: 1,
      });
    }

    // UTMIFY - AddToCart
    if (typeof window !== 'undefined' && (window as any).utmify) {
      (window as any).utmify('track', 'AddToCart', {
        value: product.price,
        currency: 'BRL',
      });
    }

    if (isKitMultiSize && product.colorVariants) {
      const sizesDescription = product.colorVariants
        .map((v, idx) => `${v.label}: ${kitSizes[idx]}`)
        .join(" | ");
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        tag: product.tag,
        size: sizesDescription,
        color: product.colorVariants.map(v => v.label).join(" + "),
      }, { silent: goToCheckout });
      if (goToCheckout) navigate("/checkout");
      return;
    }

    const selectedVariantImage = needsColor && product.colorVariants[selectedColor]?.image
      ? product.colorVariants[selectedColor].image
      : product.image;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: selectedVariantImage,
      tag: product.tag,
      size: selectedSize || undefined,
      color: selectedColorLabel,
    }, { silent: goToCheckout });

    if (goToCheckout) navigate("/checkout");
  };

  const prevImage = () => setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextImage = () => setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square overflow-hidden bg-secondary rounded-none">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain"
                style={{ imageRendering: 'auto' }}
                fetchPriority="high"
                decoding="async"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-foreground/50 hover:bg-foreground/70 text-background rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-foreground/50 hover:bg-foreground/70 text-background rounded-full flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-foreground/50 text-background text-xs font-medium px-3 py-1 rounded-full">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-colors ${
                      selectedImage === idx ? "border-foreground" : "border-border"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5">
            {/* Rating - right aligned like reference */}
            <div className="flex items-center gap-1.5 justify-start lg:justify-end">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-foreground">4.9</span>
              <span className="text-sm text-muted-foreground">(847 avaliações)</span>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl lg:text-[28px] font-bold text-foreground leading-tight">
              {product.name}
            </h1>

            {/* Price Block */}
            <div className="space-y-1">
              {product.originalPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </p>
              )}
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-[32px] font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {discount > 0 && (
                  <span className="bg-emerald-600 text-background text-xs font-bold px-2.5 py-1 rounded">
                    -{discount}%
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-emerald-600">
                  {formatPrice(pixPrice)} no PIX
                </span>
                <span className="bg-emerald-600 text-background text-[10px] font-bold px-2 py-0.5 rounded">
                  {pixDiscountLabel} OFF
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                ou 5x de {formatPrice(product.price / 5)} sem juros
              </p>
            </div>

            {/* Kit multi-tamanho: cada cor com seu próprio seletor de tamanho */}
            {isKitMultiSize && product.colorVariants && product.sizes ? (
              <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Escolha o tamanho de cada jaqueta
                  </p>
                  <span className="text-[10px] font-bold uppercase bg-emerald-600 text-white px-2 py-1 rounded">
                    3 peças
                  </span>
                </div>
                {showKitError && (
                  <p className="text-xs font-semibold text-red-500">
                    ⚠ Selecione o tamanho de todas as jaquetas
                  </p>
                )}
                <div className="space-y-3">
                  {product.colorVariants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border bg-background"
                    >
                      <div
                        className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 border-border"
                        title={variant.label}
                      >
                        <img src={variant.image} alt={variant.label} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-foreground mb-1.5 truncate">
                          {variant.label}
                          {kitSizes[idx] && (
                            <span className="text-muted-foreground font-normal"> · {kitSizes[idx]}</span>
                          )}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => {
                                setKitSizes((prev) => ({ ...prev, [idx]: size }));
                                setShowKitError(false);
                              }}
                              className={`min-w-[36px] h-8 px-2.5 rounded border text-xs font-semibold transition-all ${
                                kitSizes[idx] === size
                                  ? "border-foreground bg-foreground text-background"
                                  : "border-border text-foreground hover:border-foreground"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Tamanho (layout padrão quando não há variantes com imagem) */}
                {product.sizes && product.sizes.length > 0 && (
                  <div>
                    {showSizeError && !selectedSize && (
                      <p className="text-xs font-semibold text-red-500 mb-2">⚠ Selecione {(product.sizeLabel || "um tamanho").toLowerCase() === "voltagem" ? "uma voltagem" : "um tamanho"}</p>
                    )}
                    <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-widest">
                      {product.sizeLabel || "Tamanho"}{selectedSize && <span className="text-foreground">: {selectedSize}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => { setSelectedSize(size); setShowSizeError(false); }}
                          className={`min-w-[44px] h-10 px-4 rounded border text-sm font-medium transition-all ${
                            selectedSize === size
                              ? "border-foreground bg-foreground text-background"
                              : "border-border text-foreground hover:border-foreground"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Variants */}
                {product.colorVariants && product.colorVariants.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                      Cor: <span className="text-foreground">{product.colorVariants[selectedColor]?.label}</span>
                    </p>
                    {product.colorVariants.some(v => v.image) ? (
                      <div className="flex gap-2 flex-wrap">
                        {product.colorVariants.map((variant, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSelectedColor(idx);
                              if (variant.image) {
                                const imgIdx = images.findIndex((img) => img === variant.image);
                                if (imgIdx >= 0) setSelectedImage(imgIdx);
                              }
                            }}
                            className={`w-16 h-16 rounded-md overflow-hidden transition-all ${
                              selectedColor === idx ? "border-2 border-foreground" : "border border-transparent hover:opacity-90"
                            }`}
                            title={variant.label}
                          >
                            <img src={variant.image} alt={variant.label} className="w-full h-full object-cover" />
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {product.colorVariants.map((variant, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSelectedColor(idx)}
                            className={`border rounded-lg px-4 py-3.5 transition-all text-left ${
                              selectedColor === idx
                                ? "border-foreground bg-secondary"
                                : "border-border hover:border-muted-foreground/50"
                            }`}
                          >
                            <span className="text-sm font-semibold text-foreground">
                              {variant.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Frete grátis - selo de destaque */}
            <div className="flex items-center gap-3 rounded-lg border-2 border-emerald-500 bg-emerald-50 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-emerald-700 leading-tight">FRETE GRÁTIS para todo Brasil</p>
                <p className="text-xs text-emerald-700/80 mt-0.5">Entrega em 2 a 6 dias úteis pelo PAC</p>
              </div>
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="w-full h-14 text-base font-bold tracking-wider rounded-lg uppercase"
              onClick={handleAddToCart}
            >
              Comprar Agora
            </Button>

            {/* Trust Features */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <RefreshCw className="w-4 h-4 text-foreground shrink-0" />
                <span>Troca e devolução em até 7 dias</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <CreditCard className="w-4 h-4 text-foreground shrink-0" />
                <span>Parcele em até 12x sem juros</span>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Carousel */}
        <SocialProofCarousel />

        {/* Quality Features */}
        <QualityFeatures />

        {/* Product Details Grid */}
        <ProductDetails images={baseImages} productName={product.name} />

        {/* Product Description */}
        {mainProduct ? (
          <>
            <ProductDescription productId={product.id} />

            {/* Reviews */}
            <ProductReviews productId={product.id} />
          </>
        ) : (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Descrição do produto</h2>
            <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
              {product.description}
            </p>
          </section>
        )}

        {/* FAQ */}
        <ProductFAQ />

        {/* Related Products */}
        <section className="py-12 md:py-16">
          <h2 className="text-xl md:text-2xl font-bold text-foreground mb-8">
            Compre Também
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {products
              .filter((p) => (p.id <= 4 || p.id === 9 || p.id === 10) && p.id !== product.id)
              .slice(0, 4)
              .map((p) => (
                <ProductCard key={p.id} {...p} />
              ))}
          </div>
        </section>
      </div>

      <Newsletter />
      <Footer />
      <ExitIntentPopup />
    </div>
  );
};

export default ProductPage;