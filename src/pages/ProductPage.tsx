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
import ProductDescription from "@/components/store/ProductDescription";
import ProductDetails from "@/components/store/ProductDetails";
import ProductReviews from "@/components/store/ProductReviews";
import ProductFAQ from "@/components/store/ProductFAQ";

import {
  Truck,
  RefreshCw,
  Star,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  ShieldCheck,
  Minus,
  Plus,
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

interface ProductPageProps {
  /** Permite renderizar a página em uma rota dedicada (ex.: /bicicleta) */
  slugOverride?: string;
}

const ProductPage = ({ slugOverride }: ProductPageProps) => {
  const params = useParams();
  const slug = slugOverride ?? params.slug;
  const mainProduct = [...products].reverse().find((p) => p.slug === slug);
  const product: Product | undefined = mainProduct || fallbackProducts.find((p) => p.slug === slug);
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(
    product?.sizes && (product.sizes.length === 1 || product.sizePrices)
      ? product.sizes[0]
      : null
  );
  const [selectedColor, setSelectedColor] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
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

  const addItemWithQuantity = (
    item: Parameters<typeof addItem>[0],
    options?: { silent?: boolean },
  ) => {
    const amount = Math.max(1, quantity);
    for (let i = 0; i < amount; i += 1) {
      addItem(item, { silent: options?.silent || i < amount - 1 });
    }
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
        value: currentPrice,
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

  const currentPrice =
    selectedSize && product.sizePrices?.[selectedSize]
      ? product.sizePrices[selectedSize]
      : product.price;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - currentPrice) / product.originalPrice) * 100)
    : 0;

  const pixDiscountRate = 0.05;
  const pixDiscountLabel = "5%";
  const pixPrice = currentPrice * (1 - pixDiscountRate);

  /** Prova social determinística e distinta por produto */
  const hashId = (product.id * 2654435761) % 100000;
  const soldCount = 60 + (hashId % 260); // 60 a 319 vendidos
  const reviewCount = product.id === 32 ? 1245 : 312 + ((hashId >> 3) % 1490); // 312 a 1801 avaliações
  const ratingValue = product.id === 32 ? "4.9" : (4.7 + ((hashId >> 5) % 3) / 10).toFixed(1); // 4.7 / 4.8 / 4.9




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
      addItemWithQuantity({
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.colorVariants?.[picks[0].color!]?.image || product.image,
        images: picks.map((p) => product.colorVariants?.[p.color!]?.image || product.image),
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
        value: currentPrice,
        currency: 'BRL',
        num_items: 1,
      });
    }

    // UTMIFY - AddToCart
    if (typeof window !== 'undefined' && (window as any).utmify) {
      (window as any).utmify('track', 'AddToCart', {
        value: currentPrice,
        currency: 'BRL',
      });
    }

    if (isKitMultiSize && product.colorVariants) {
      const sizesDescription = product.colorVariants
        .map((v, idx) => `${v.label}: ${kitSizes[idx]}`)
        .join(" | ");
      addItemWithQuantity({
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

    addItemWithQuantity({
      id: product.id,
      name: product.name,
      price: currentPrice,
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
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground">
      <Header />

      <main className="mx-auto w-full max-w-[1240px] min-w-0 overflow-x-hidden px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid w-full min-w-0 grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Galeria no mesmo formato visual do HTML de referência */}
          <div className="w-full min-w-0 max-w-full">
            <div className="relative w-full max-w-full rounded-xl border border-border bg-secondary/30 overflow-hidden">
              <div className="aspect-square w-full max-w-full">
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  style={{ imageRendering: "auto" }}
                  fetchPriority="high"
                  decoding="async"
                />
              </div>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    aria-label="Imagem anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 size-10 rounded-full border border-border bg-background/90 text-foreground shadow-sm grid place-items-center hover:bg-background transition"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Próxima imagem"
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-10 rounded-full border border-border bg-background/90 text-foreground shadow-sm grid place-items-center hover:bg-background transition"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex w-full max-w-full gap-2 overflow-x-auto overscroll-x-contain pb-1 pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {images.map((img, idx) => (
                  <button
                    type="button"
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`flex-shrink-0 size-14 sm:size-16 rounded-md overflow-hidden border transition ${
                      selectedImage === idx
                        ? "border-foreground"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    aria-label={`Ver imagem ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informações no fluxo do layout de referência */}
          <div className="w-full min-w-0 max-w-full">
            <div className="text-[13px] text-muted-foreground">
              {product.id === 40 ? "Novo produto" : `Novo | +${soldCount} vendidos`}
            </div>

            <div className="mt-1">
              <h1 className="max-w-full break-words [overflow-wrap:anywhere] text-[22px] sm:text-3xl font-extrabold tracking-tight leading-tight text-foreground">
                {product.name}
              </h1>
            </div>

            {product.id === 40 ? (
              <div className="mt-3 text-sm text-muted-foreground">
                Confira tamanhos, estampas e avaliações abaixo
              </div>
            ) : (
              <div className="mt-3 flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
                <div className="flex text-primary">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="size-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-sm text-foreground">{ratingValue}</span>
                <span className="min-w-0 break-words text-sm text-muted-foreground">
                  ({reviewCount.toLocaleString("pt-BR")} avaliações)
                </span>
              </div>
            )}

            {/* Seletores */}
            <div className="mt-6 w-full min-w-0 max-w-full">
              {picksCount > 0 && product.colorVariants && product.sizes ? (
                <div id="variant-selector" className="w-full min-w-0 max-w-full space-y-4">
                  <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-foreground">
                      Personalize seu kit
                    </p>
                    <span className="text-[11px] font-bold text-muted-foreground">
                      {picksCount} peças
                    </span>
                  </div>

                  {showPicksError && (
                    <p className="text-xs font-semibold text-destructive">
                      ⚠ Escolha a estampa e o tamanho das {picksCount} peças
                    </p>
                  )}

                  {picks.map((pick, slot) => {
                    const unlocked =
                      slot === 0 ||
                      (picks[slot - 1].color !== null && !!picks[slot - 1].size);
                    if (!unlocked) return null;

                    const current =
                      pick.color !== null ? product.colorVariants![pick.color] : null;
                    const isOpen = openColorSlot === slot;

                    return (
                      <div
                        key={slot}
                        className="w-full min-w-0 max-w-full rounded-lg border border-border bg-background p-3 sm:p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="min-w-0 break-words [overflow-wrap:anywhere] text-[13px] font-bold text-foreground">
                            Peça {slot + 1}
                            {current && (
                              <span className="font-normal text-muted-foreground">
                                {" "}· {current.label}
                              </span>
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => setOpenColorSlot(isOpen ? null : slot)}
                          className={`w-full min-w-0 max-w-full flex items-center gap-3 rounded-md border p-2 text-left transition ${
                            isOpen
                              ? "border-foreground"
                              : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          {current?.image && (
                            <img
                              src={current.image}
                              alt={current.label}
                              className="size-11 rounded object-cover flex-shrink-0"
                            />
                          )}
                          <span className="flex-1 min-w-0">
                            <span className="block text-[12px] text-muted-foreground">
                              Cor:
                            </span>
                            <span className="block min-w-0 truncate text-sm font-bold text-foreground">
                              {current ? current.label : "Selecione"}
                            </span>
                          </span>
                          <ChevronDown
                            className={`size-4 transition-transform ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="grid w-full min-w-0 grid-cols-1 min-[380px]:grid-cols-2 gap-2">
                            {product.colorVariants!.map((variant, idx) => (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => {
                                  updatePick(slot, { color: idx });
                                  setOpenColorSlot(null);
                                  const imgIdx = images.findIndex(
                                    (img) => img === variant.image,
                                  );
                                  if (imgIdx >= 0) setSelectedImage(imgIdx);
                                }}
                                className={`min-w-0 flex items-center gap-2 rounded-md border p-1.5 text-left transition ${
                                  pick.color === idx
                                    ? "border-foreground"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                              >
                                {variant.image && (
                                  <img
                                    src={variant.image}
                                    alt={variant.label}
                                    className="size-10 rounded object-cover flex-shrink-0"
                                  />
                                )}
                                <span className="min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-[11px] font-medium leading-tight">
                                  {variant.label}
                                </span>
                                {pick.color === idx && <Check className="size-4" />}
                              </button>
                            ))}
                          </div>
                        )}

                        <div>
                          <p className="max-w-full break-words [overflow-wrap:anywhere] text-[13px] text-foreground">
                            Tamanho:
                            <span className="font-bold">
                              {" "}{pick.size || "Selecione"}
                            </span>
                          </p>
                          <div className="mt-2 flex w-full max-w-full flex-wrap gap-2">
                            {product.sizes!.map((size) => (
                              <button
                                type="button"
                                key={size}
                                onClick={() => updatePick(slot, { size })}
                                className={`min-w-[52px] h-11 px-4 rounded-md border text-sm font-bold transition ${
                                  pick.size === size
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-background text-foreground border-border hover:border-foreground"
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
                </div>
              ) : isKitMultiSize && product.colorVariants && product.sizes ? (
                <div id="variant-selector" className="w-full min-w-0 max-w-full space-y-4">
                  <p className="text-[13px] font-semibold text-foreground">
                    Escolha o tamanho de cada peça
                  </p>
                  {showKitError && (
                    <p className="text-xs font-semibold text-destructive">
                      ⚠ Selecione o tamanho de todas as peças
                    </p>
                  )}
                  {product.colorVariants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-lg border border-border"
                    >
                      {variant.image && (
                        <img
                          src={variant.image}
                          alt={variant.label}
                          className="size-16 rounded-md object-cover border border-border"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-bold mb-2">
                          {variant.label}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <button
                              type="button"
                              key={size}
                              onClick={() => {
                                setKitSizes((prev) => ({ ...prev, [idx]: size }));
                                setShowKitError(false);
                              }}
                              className={`min-w-[52px] h-10 px-3 rounded-md border text-sm font-bold transition ${
                                kitSizes[idx] === size
                                  ? "bg-foreground text-background border-foreground"
                                  : "bg-background text-foreground border-border hover:border-foreground"
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
              ) : (
                <div id="variant-selector" className="space-y-6">
                  {product.sizes && product.sizes.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between gap-3">
                        <p className="max-w-full break-words [overflow-wrap:anywhere] text-[13px] text-foreground">
                          {product.sizeLabel || "Tamanho"}:
                          <span className="font-bold">
                            {" "}{selectedSize || "Selecione"}
                          </span>
                        </p>
                      </div>

                      {showSizeError && !selectedSize && (
                        <p className="mt-2 text-xs font-semibold text-destructive">
                          ⚠ Selecione{" "}
                          {(product.sizeLabel || "tamanho").toLowerCase() ===
                          "voltagem"
                            ? "uma voltagem"
                            : "um tamanho"}
                        </p>
                      )}

                      <div className="mt-2 flex w-full max-w-full flex-wrap gap-2">
                        {product.sizes.map((size) => (
                          <button
                            type="button"
                            key={size}
                            onClick={() => {
                              setSelectedSize(size);
                              setShowSizeError(false);
                            }}
                            className={`min-w-[52px] h-11 px-4 rounded-md border text-sm font-bold transition ${
                              selectedSize === size
                                ? "bg-foreground text-background border-foreground"
                                : "bg-background text-foreground border-border hover:border-foreground"
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.colorVariants &&
                    product.colorVariants.length > 0 && (
                      <div>
                        <p className="max-w-full break-words [overflow-wrap:anywhere] text-[13px] text-foreground">
                          Cor:
                          <span className="font-bold">
                            {" "}{product.colorVariants[selectedColor]?.label}
                          </span>
                        </p>

                        {product.colorVariants.some((v) => v.image) ? (
                          <div className="mt-2 flex w-full max-w-full flex-wrap gap-2">
                            {product.colorVariants.map((variant, idx) => (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => {
                                  setSelectedColor(idx);
                                  if (variant.image) {
                                    const imgIdx = images.findIndex(
                                      (img) => img === variant.image,
                                    );
                                    if (imgIdx >= 0) setSelectedImage(imgIdx);
                                  }
                                }}
                                className={`size-16 rounded-md overflow-hidden border transition ${
                                  selectedColor === idx
                                    ? "border-foreground ring-1 ring-foreground"
                                    : "border-border hover:border-muted-foreground"
                                }`}
                                title={variant.label}
                              >
                                {variant.image ? (
                                  <img
                                    src={variant.image}
                                    alt={variant.label}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs">{variant.label}</span>
                                )}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="mt-2 flex w-full max-w-full flex-wrap gap-2">
                            {product.colorVariants.map((variant, idx) => (
                              <button
                                type="button"
                                key={idx}
                                onClick={() => setSelectedColor(idx)}
                                className={`h-11 px-4 rounded-md border text-sm font-bold transition ${
                                  selectedColor === idx
                                    ? "bg-foreground text-background border-foreground"
                                    : "bg-background text-foreground border-border hover:border-foreground"
                                }`}
                              >
                                {variant.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* Preço no mesmo bloco/ordem da referência */}
            <div className="mt-6 w-full min-w-0 max-w-full">
              <p className="max-w-full break-words [overflow-wrap:anywhere] text-[13px] text-foreground">Preço:</p>
              {product.originalPrice && (
                <p className="text-[13px] text-muted-foreground line-through mt-1">
                  DE {formatPrice(product.originalPrice)}
                </p>
              )}
              <div className="mt-1 flex max-w-full flex-wrap items-center gap-x-3 gap-y-1">
                <span className="max-w-full break-words text-[30px] sm:text-[34px] font-black leading-none text-foreground">
                  {formatPrice(currentPrice)}
                </span>
                {discount > 0 && (
                  <span className="text-sm font-bold text-primary">
                    ↓ {discount}%
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                em até 12x de{" "}
                <strong className="text-foreground">
                  {formatPrice(currentPrice / 12)}
                </strong>
              </p>
              <p className="text-sm font-semibold text-primary mt-1">
                {formatPrice(pixPrice)} com Pix · {pixDiscountLabel} OFF
              </p>
            </div>

            {/* Quantidade */}
            <div className="mt-6 flex max-w-full flex-wrap items-center gap-3 sm:gap-4">
              <span className="text-[13px] text-foreground">Quantidade:</span>
              <div className="flex items-center border border-border rounded-md overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="size-10 grid place-items-center hover:bg-secondary transition"
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-10 text-center font-bold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="size-10 grid place-items-center hover:bg-secondary transition"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            {/* Benefícios em caixa, mantendo as cores da loja */}
            <div className="mt-6 w-full max-w-full rounded-lg border border-border bg-secondary/30 p-3 sm:p-4 space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <Truck className="size-5 text-primary shrink-0 mt-0.5" />
                <p>
                  <strong>Frete Grátis</strong> · Disponível
                </p>
              </div>
              <div className="flex items-start gap-3">
                <RefreshCw className="size-5 text-primary shrink-0 mt-0.5" />
                <p>
                  <strong>Devolução grátis.</strong> Até 7 dias a partir do
                  recebimento
                </p>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="size-5 text-primary shrink-0 mt-0.5" />
                <p>
                  <strong>Compra Garantida.</strong> Compra protegida durante o
                  processo de pagamento
                </p>
              </div>
            </div>

            {/* CTA continua usando o fluxo real do checkout da loja */}
            <button
              type="button"
              onClick={() => handleAddToCart(true)}
              className="mt-6 w-full max-w-full h-14 rounded-full bg-primary hover:opacity-90 text-primary-foreground text-lg font-extrabold inline-flex items-center justify-center shadow-lg shadow-primary/20 transition"
            >
              COMPRAR AGORA
            </button>
          </div>
        </div>

        {/* Descrição no formato empilhado do HTML de referência */}
        <section className="mt-12 sm:mt-14 mx-auto w-full min-w-0 max-w-3xl text-left">
          <h2 className="text-lg font-extrabold tracking-tight">
            DESCRIÇÃO DO PRODUTO
          </h2>
          <ProductDetails images={baseImages} productName={product.name} />
          <ProductDescription productId={product.id} />
        </section>

        <ProductFAQ />

        {mainProduct && <ProductReviews productId={product.id} />}
      </main>

      <Footer />
      <ExitIntentPopup />
    </div>
  );
};

export default ProductPage;