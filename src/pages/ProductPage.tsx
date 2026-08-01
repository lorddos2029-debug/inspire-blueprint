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
import StickyBuyBar from "@/components/store/StickyBuyBar";

import {
  Truck,
  RefreshCw,
  CreditCard,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
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
  /** Kit com N peças: cada peça tem cor (por imagem) + tamanho */
  const picksCount = product?.kitPicks ?? 0;
  const [picks, setPicks] = useState<{ color: number | null; size: string | null }[]>(
    () => Array.from({ length: Math.max(picksCount, 0) }, () => ({ color: 0, size: null })),
  );
  const [showPicksError, setShowPicksError] = useState(false);
  const [openColorSlot, setOpenColorSlot] = useState<number | null>(null);


  const updatePick = (idx: number, patch: Partial<{ color: number | null; size: string | null }>) => {
    setPicks((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
    setShowPicksError(false);
  };

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

  /** Estoque exibido de forma determinística por produto (escassez) */
  const stockLeft = 8 + (product.id % 12);

  /** Prova social determinística e distinta por produto */
  const hashId = (product.id * 2654435761) % 100000;
  const soldCount = 60 + (hashId % 260); // 60 a 319 vendidos
  const reviewCount = 312 + ((hashId >> 3) % 1490); // 312 a 1801 avaliações
  const ratingValue = (4.7 + ((hashId >> 5) % 3) / 10).toFixed(1); // 4.7 / 4.8 / 4.9



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

    if (picksCount > 0) {
      const incomplete = picks.some((p) => p.color === null || !p.size);
      if (incomplete) {
        setShowPicksError(true);
        toast.error("Escolha a estampa e o tamanho das 2 peças");
        document.getElementById("variant-selector")?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      const description = picks
        .map((p, i) => `Peça ${i + 1}: ${product.colorVariants?.[p.color!]?.label} · ${p.size}`)
        .join(" | ");
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.colorVariants?.[picks[0].color!]?.image || product.image,
        tag: product.tag,
        size: description,
        color: picks.map((p) => product.colorVariants?.[p.color!]?.label).join(" + "),
      }, { silent: goToCheckout });
      if (goToCheckout) navigate("/checkout");
      return;
    }

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
    <div className="min-h-screen bg-background pb-24 lg:pb-0">
      <Header />

      <div className="container py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Image Gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative h-[44vh] md:h-auto md:aspect-square overflow-hidden bg-secondary rounded-none">
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
            {/* Vendidos + avaliação */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <span className="inline-flex items-center rounded-full bg-topbar text-topbar-foreground text-xs font-semibold px-3 py-1">
                +{soldCount} vendidos
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-sm font-semibold text-foreground">{ratingValue}</span>
                <span className="text-sm text-muted-foreground">({reviewCount.toLocaleString("pt-BR")} avaliações)</span>
              </div>

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
                  <span className="bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded">
                    {discount}% OFF
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(pixPrice)} com Pix
                </span>
                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                  {pixDiscountLabel} OFF
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                ou 5x de {formatPrice(product.price / 5)} sem juros
              </p>
              <p className="text-xs text-muted-foreground pt-1">
                {pixDiscountLabel} de desconto pagando com Pix · não acumulável com outras promoções
              </p>
            </div>


            {/* Kit: personalize cada peça (cor recolhível + tamanho) */}
            {picksCount > 0 && product.colorVariants && product.sizes ? (
              <div id="variant-selector" className="rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                    Personalize seu kit
                  </p>
                  <span className="text-[10px] font-bold uppercase bg-foreground text-background px-2.5 py-1 rounded">
                    {picksCount} peças
                  </span>
                </div>

                {showPicksError && (
                  <p className="text-xs font-semibold text-destructive">
                    ⚠ Escolha a estampa e o tamanho das {picksCount} peças
                  </p>
                )}

                {picks.map((pick, slot) => {
                  const unlocked = slot === 0 || (picks[slot - 1].color !== null && !!picks[slot - 1].size);
                  if (!unlocked) return null;
                  const current = pick.color !== null ? product.colorVariants![pick.color] : null;
                  const isOpen = openColorSlot === slot;
                  return (
                    <div key={slot} className="rounded-xl border border-border p-3 sm:p-4 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="text-sm font-bold text-foreground">
                          PEÇA {slot + 1}
                          {current && (
                            <span className="font-normal text-muted-foreground"> — {current.label}</span>
                          )}
                        </p>
                        {!pick.size && (
                          <span className="text-[10px] font-semibold text-destructive bg-destructive/10 px-2 py-1 rounded">
                            Selecione a cor e o tamanho

                          </span>
                        )}
                      </div>

                      {/* Cor: linha recolhida clicável */}
                      <button
                        onClick={() => setOpenColorSlot(isOpen ? null : slot)}
                        className={`w-full flex items-center gap-3 rounded-lg border-2 p-2 text-left transition-all ${
                          isOpen ? "border-foreground" : "border-border hover:border-muted-foreground/60"
                        }`}
                      >
                        {current && (
                          <img
                            src={current.image}
                            alt={current.label}
                            className="w-11 h-11 rounded object-cover flex-shrink-0"
                          />
                        )}
                        <span className="flex-1 min-w-0">
                          <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                            Cor
                          </span>
                          <span className="block text-sm font-semibold text-foreground truncate">
                            {current ? current.label : "Selecione"}
                          </span>
                        </span>
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${
                            isOpen ? "rotate-180 bg-muted text-foreground" : "bg-foreground text-background"
                          }`}
                        >
                          {isOpen ? <ChevronDown className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="rounded-lg border border-border p-2">
                          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-1 pb-2">
                            Cores disponíveis
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {product.colorVariants!.map((variant, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  updatePick(slot, { color: idx });
                                  setOpenColorSlot(null);
                                  const imgIdx = images.findIndex((img) => img === variant.image);
                                  if (imgIdx >= 0) setSelectedImage(imgIdx);
                                }}
                                className={`flex items-center gap-2 rounded-lg border-2 p-1.5 text-left transition-all ${
                                  pick.color === idx ? "border-foreground" : "border-transparent hover:border-border"
                                }`}
                              >
                                <img
                                  src={variant.image}
                                  alt={variant.label}
                                  className="w-10 h-10 rounded object-cover flex-shrink-0"
                                />
                                <span className="flex-1 text-[11px] font-medium leading-tight text-foreground">
                                  {variant.label}
                                </span>
                                {pick.color === idx && <Check className="w-4 h-4 flex-shrink-0 text-foreground" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground mb-2 uppercase tracking-widest">
                          Tamanho{pick.size ? `: ${pick.size}` : ": selecione"}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes!.map((size) => (
                            <button
                              key={size}
                              onClick={() => updatePick(slot, { size })}
                              className={`min-w-[60px] h-10 px-4 rounded-lg border text-sm font-semibold transition-all ${
                                pick.size === size
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
                  );
                })}

                {picks[0].color === null || !picks[0].size ? (
                  <p className="text-xs text-muted-foreground">
                    Escolha a estampa e o tamanho da 1ª peça para liberar a 2ª.
                  </p>
                ) : null}
              </div>

            ) : isKitMultiSize && product.colorVariants && product.sizes ? (

              <div id="variant-selector" className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-4">
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
                  <div id="variant-selector">

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
            <div className="flex items-center gap-3 rounded-xl border border-topbar bg-topbar/40 px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground leading-tight">FRETE GRÁTIS para todo o Brasil</p>
                <p className="text-xs text-muted-foreground mt-0.5">Entrega em 2 a 6 dias úteis · não acumulável com outras promoções</p>
              </div>
            </div>

            {/* Escassez */}
            <p className="text-sm font-semibold text-primary">
              Atenção! Só restam {stockLeft} em estoque
            </p>

            {/* CTA principal: compra em 1 clique */}
            <Button
              size="lg"
              className="w-full h-14 text-base font-bold tracking-wider rounded-lg uppercase"
              onClick={() => handleAddToCart(true)}
            >
              Comprar
            </Button>


            {/* CTA secundário: continuar navegando */}
            <Button
              size="lg"
              variant="outline"
              className="w-full h-12 text-sm font-semibold tracking-wider rounded-lg uppercase border-foreground text-foreground hover:bg-secondary"
              onClick={() => handleAddToCart(false)}
            >
              Adicionar à sacola
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products
              .filter((p) => p.id !== product.id)
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
      <StickyBuyBar
        productName={product.name}
        price={product.price}
        pixPrice={pixPrice}
        onBuy={() => handleAddToCart(true)}
      />
    </div>
  );
};

export default ProductPage;