import { useState, useEffect, useRef } from "react";

import { QRCodeSVG } from "qrcode.react";
import kitMeiasSoquete from "@/assets/kit-12-meias-soquete.png";
import bodySplashBarboursTrio from "@/assets/products/body-splash-barbours-trio.png";
import security100 from "@/assets/security-100.svg";
import paymentMethods from "@/assets/payment-methods.png";
import pixIcon from "@/assets/pix-icon.png";
import securityGoogle from "@/assets/security-google.svg";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CheckoutLogo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const titleSize = size === "lg" ? "text-3xl md:text-4xl" : size === "sm" ? "text-xl md:text-2xl" : "text-2xl md:text-3xl";
  return (
    <div className="flex flex-col items-center leading-none select-none">
      <span className={`font-display ${titleSize} font-semibold tracking-tight text-white`}>
        Bela<span className="italic text-[hsl(var(--gold))]">Casa</span>
      </span>
      <span className="mt-0.5 text-[9px] md:text-[10px] tracking-[0.4em] font-medium text-white/70 uppercase">
        Casa &amp; Conforto
      </span>
    </div>
  );
};
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  ShoppingBag, ArrowLeft, ArrowRight, Loader2, Truck, Package, QrCode, Copy, Check, Zap,
  ShieldCheck, Heart, Lock, ChevronDown, User, Wallet, Minus, Plus, Trash2, CreditCard
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getStoredUtmParams } from "@/hooks/useUtmCapture";
import { computeInstallments } from "@/lib/installments";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const toNullableString = (value: unknown): string | null => {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }

  if (typeof value === "number" && Number.isFinite(value)) {
    return String(value);
  }

  return null;
};

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const formatCardNumber = (value: string) => {
  const digits = onlyDigits(value).slice(0, 19);
  return digits.replace(/(.{4})/g, "$1 ").trim();
};

const formatCardExpiry = (value: string) => {
  const digits = onlyDigits(value).slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const detectCardBrand = (value: string): string | null => {
  const digits = onlyDigits(value);

  if (!digits) return null;
  if (/^4/.test(digits)) return "Visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]\d|720))/.test(digits)) return "Mastercard";
  if (/^3[47]/.test(digits)) return "Amex";
  if (/^(401178|401179|431274|438935|451416|457393|457631|457632|504175|50669[0-9]|5067[0-6][0-9]|509[0-9]{3}|627780|636297|636368|650[0-9]{3}|6516[0-9]{2}|6550[0-9]{2})/.test(digits)) return "Elo";
  if (/^(606282|3841)/.test(digits)) return "Hipercard";
  if (/^3(0[0-5]|[68])/.test(digits)) return "Diners";

  return null;
};

const shippingOptions = [
  { id: "pac", label: "PAC", description: "2 a 6 dias úteis", price: 0, icon: Package },
  { id: "sedex", label: "SEDEX", description: "1 a 3 dias úteis", price: 15.23, icon: Zap },
];

interface PixPaymentData {
  qrCode?: string;
  qrCodeBase64?: string;
  copyPaste?: string;
  transactionId?: string;
  orderId?: string;
}

const getSessionId = () => {
  let sid = sessionStorage.getItem('checkout_session_id');
  if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem('checkout_session_id', sid); }
  return sid;
};

const trackCheckoutStep = async (step: string, productId: string | null) => {
  try {
    await supabase.from("checkout_events").insert({
      session_id: getSessionId(),
      step,
      product_id: productId,
      page: "checkout",
    } as any);
  } catch (e) { console.error("Track step error:", e); }
};

const Checkout = () => {
  const { items, totalPrice, updateQuantity, removeItem, addItem, replaceCart, clearCart, couponApplied: cartCouponApplied, couponCode: cartCouponCode } = useCart();

  // Order bump - Kit 12 Meias Soquete (id 9912) só aparece quando o tênis slip-on (id 25) está no carrinho
  const ORDER_BUMP_ID = 9912;
  const hasSlipOn = items.some((i) => i.id === 25);
  const orderBumpAdded = items.some((i) => i.id === ORDER_BUMP_ID);
  const handleAddOrderBump = () => {
    if (orderBumpAdded) {
      removeItem(ORDER_BUMP_ID);
      toast.info("Oferta removida");
    } else {
      addItem({
        id: ORDER_BUMP_ID,
        name: "Kit 12 Pares Meia Soquete Sortido",
        price: 19.9,
        originalPrice: 59.9,
        image: kitMeiasSoquete,
      }, { silent: true });
      toast.success("Oferta adicionada ao seu pedido!");
    }
  };

  // Order bump - Kit 3 Body Splash Barbours (id 9942) aparece quando o Kit Pague 1 Leve 3 (id 41) ou o Body Splash Barbarius (id 46) está no carrinho
  const ORDER_BUMP_BARBOURS_ID = 9942;
  const hasBarbariusKit = items.some((i) => i.id === 41 || i.id === 46);
  const orderBumpBarboursAdded = items.some((i) => i.id === ORDER_BUMP_BARBOURS_ID);
  const handleAddOrderBumpBarbours = () => {
    if (orderBumpBarboursAdded) {
      removeItem(ORDER_BUMP_BARBOURS_ID);
      toast.info("Oferta removida");
    } else {
      addItem({
        id: ORDER_BUMP_BARBOURS_ID,
        name: "Kit 3 Body Splash Masculino Homme Desodorante Barbours 200ml",
        price: 49.9,
        originalPrice: 269.7,
        image: bodySplashBarboursTrio,
      }, { silent: true });
      toast.success("Oferta adicionada ao seu pedido!");
    }
  };
  const navigate = useNavigate();

  // Step management: 1=Dados, 2=Entrega, 3=Pagamento
  const [currentStep, setCurrentStep] = useState(1);
  // Resumo colapsado por padrão (reduz scroll inicial no mobile)
  const [summaryOpen, setSummaryOpen] = useState(false);

  // Contador de visitantes simulado (prova social)
  const [viewersCount] = useState(() => Math.floor(Math.random() * 18) + 12);

  // Modal de pagamento recusado
  const [refusalReason, setRefusalReason] = useState<string | null>(null);

  // Track checkout step views
  const trackedSteps = useRef(new Set<string>());
  const submitLockRef = useRef(false);
  useEffect(() => {
    const stepNames = ["dados", "endereco", "pagamento"];
    const stepName = stepNames[currentStep - 1];
    if (stepName && !trackedSteps.current.has(stepName)) {
      trackedSteps.current.add(stepName);
      const firstItem: any = items[0];
      const productId = firstItem ? String(firstItem.slug || firstItem.id || "") : null;
      trackCheckoutStep(stepName, productId);
    }
  }, [currentStep, items]);

  // Restore order from PIX reminder email (?restore=ORDER_ID)
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current) return;
    const params = new URLSearchParams(window.location.search);
    const restoreId = params.get("restore");
    if (!restoreId) return;
    restoredRef.current = true;
    (async () => {
      try {
        const { data: order, error } = await supabase
          .from("orders")
          .select("customer_name, customer_email, customer_phone, customer_cpf, cep, street, number, complement, neighborhood, city, state, items, shipping_method, payment_method")
          .eq("id", restoreId)
          .maybeSingle();
        if (error || !order) {
          toast.error("Não foi possível recuperar seu pedido");
          return;
        }
        const restoredItems = Array.isArray(order.items) ? (order.items as any[]).map((it) => ({
          id: Number(it.id),
          name: String(it.name || "Produto"),
          price: Number(it.price) || 0,
          originalPrice: it.originalPrice ? Number(it.originalPrice) : undefined,
          image: String(it.image || ""),
          tag: it.tag,
          size: it.size,
          color: it.color,
          quantity: Math.max(1, Number(it.quantity) || 1),
        })) : [];
        if (restoredItems.length > 0) replaceCart(restoredItems);
        if (order.customer_name) setName(order.customer_name);
        if (order.customer_email) setEmail(order.customer_email);
        if (order.customer_phone) setPhone(order.customer_phone);
        if (order.customer_cpf) setCpf(order.customer_cpf);
        if (order.cep) setCep(order.cep);
        if (order.street) setStreet(order.street);
        if (order.number) setNumber(order.number);
        if (order.complement) setComplement(order.complement);
        if (order.neighborhood) setNeighborhood(order.neighborhood);
        if (order.city) setCity(order.city);
        if (order.state) setState(order.state);
        if (order.shipping_method) setSelectedShipping(order.shipping_method);
        if (order.payment_method) setPaymentMethod(order.payment_method);
        setCurrentStep(3);
        toast.success("Carrinho restaurado! Finalize seu pagamento.");
        // Limpa o parâmetro da URL
        const url = new URL(window.location.href);
        url.searchParams.delete("restore");
        window.history.replaceState({}, "", url.toString());
      } catch (err) {
        console.error("Restore order failed:", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Personal data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Address
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepSearching, setCepSearching] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);

  // Shipping
  const [selectedShipping, setSelectedShipping] = useState("pac");

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pixData, setPixData] = useState<PixPaymentData | null>(null);
  const [pixConfirmed, setPixConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardHolderName, setCardHolderName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");



  const [installments, setInstallments] = useState("1");

  // Coupon - auto-apply from cart context
  const [coupon, setCoupon] = useState(cartCouponApplied ? (cartCouponCode || "ALPHA") : "");
  const [couponApplied, setCouponApplied] = useState(cartCouponApplied);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // Success state
  const [purchasedItems, setPurchasedItems] = useState<typeof items>([]);

  // Reservation timer (10 minutes)
  const [timeLeft, setTimeLeft] = useState(600);
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(t => Math.max(0, t - 1)), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const shippingCost = shippingOptions.find(o => o.id === selectedShipping)?.price ?? 0;
  const subtotalWithShipping = totalPrice + shippingCost - couponDiscount;
  // PIX discount per-product: produto 46 (Body Splash Barbarius solo) tem 5% off; demais itens 10%.
  // Frete e cupom seguem a alíquota majoritária dos itens (10% por padrão).
  const itemsSubtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0) || 1;
  const itemsAt5 = items.filter(i => i.id === 46).reduce((sum, it) => sum + it.price * it.quantity, 0);
  const itemsAt10 = itemsSubtotal - itemsAt5;
  const remainder = shippingCost - couponDiscount; // aplicar 10% no restante
  const blendedRate = (itemsAt5 * 0.05 + itemsAt10 * 0.10 + Math.max(remainder, 0) * 0.10) / Math.max(subtotalWithShipping, 1);
  const pixDiscount = paymentMethod === "pix" ? Math.round(subtotalWithShipping * blendedRate * 100) / 100 : 0;
  const grandTotal = subtotalWithShipping - pixDiscount;
  // Parcelamento com juros repassados ao cliente (1-3x sem juros, 4-12x com juros compostos)
  const cardBaseAmount = subtotalWithShipping; // sem desconto PIX
  const installmentOptions = computeInstallments(cardBaseAmount);
  const selectedInstallmentOption = installmentOptions.find(o => o.n === parseInt(installments)) || installmentOptions[0];
  const cardTotal = paymentMethod === "credit" ? selectedInstallmentOption.total : grandTotal;
  const cardInterestFee = paymentMethod === "credit" ? Math.max(0, cardTotal - cardBaseAmount) : 0;
  // Rótulo dinâmico do desconto PIX: produto 46 tem 5%, demais 10%.
  const hasOnly46 = items.length > 0 && items.every(i => i.id === 46);
  const hasMixed46 = items.some(i => i.id === 46) && items.some(i => i.id !== 46);
  const pixDiscountLabel = hasOnly46 ? "5%" : hasMixed46 ? "até 10%" : "10%";
  const detectedCardBrand = detectCardBrand(cardNumber);

  const cardHolderInitialized = useRef(false);
  useEffect(() => {
    if (!cardHolderInitialized.current && !cardHolderName.trim() && name.trim()) {
      setCardHolderName(name);
      cardHolderInitialized.current = true;
    }
  }, [name]);

  const handleApplyCoupon = () => {
    if (couponApplied) { toast.info("Cupom já aplicado"); return; }
    const code = coupon.trim().toUpperCase();
    if (code === "ALPHA") {
      const discount = totalPrice * 0.10;
      setCouponDiscount(discount);
      setCouponApplied(true);
      toast.success("Cupom ALPHA aplicado! 10% de desconto.");
    } else if (code === "ALPHA5%" || code === "BELACASA") {
      const discount = totalPrice * 0.05;
      setCouponDiscount(discount);
      setCouponApplied(true);
      toast.success(`Cupom ${code} aplicado! 5% de desconto.`);
    } else {
      toast.error("Cupom inválido");
    }
  };

  // Auto-apply coupon discount from cart context
  useEffect(() => {
    if (cartCouponApplied && !couponDiscount && totalPrice > 0) {
      const rate = (cartCouponCode || "ALPHA").toUpperCase() === "ALPHA5%" ? 0.05 : 0.10;
      setCouponDiscount(totalPrice * rate);
      setCouponApplied(true);
      setCoupon((cartCouponCode || "ALPHA").toUpperCase());
    }
  }, [cartCouponApplied, cartCouponCode, totalPrice, couponDiscount]);

  useEffect(() => { window.scrollTo(0, 0); }, [currentStep]);

  // Poll PIX payment status and fire Purchase events when confirmed
  useEffect(() => {
    if (!pixData?.transactionId || pixConfirmed) return;
    const interval = setInterval(async () => {
      try {
        const { data: order } = await supabase
          .from("orders")
          .select("payment_status, order_number, tracking_code, customer_name, customer_email, total")
          .eq("transaction_id", pixData.transactionId!)
          .single();
        if (order && order.payment_status === "paid") {
          setPixConfirmed(true);
          clearInterval(interval);
          const purchaseData = { value: grandTotal, currency: 'BRL', content_ids: purchasedItems.map(i => String(i.id)), content_type: 'product', num_items: purchasedItems.length };
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Purchase', purchaseData);
          }
          fireServerEvent('Purchase', purchaseData, { orderId: pixData.orderId, transactionId: pixData.transactionId });

          // Fallback: ensure payment-approved email is sent (idempotencyKey prevents duplicates if webhook also sent it)
          try {
            await supabase.functions.invoke("send-transactional-email", {
              body: {
                templateName: "payment-approved",
                recipientEmail: order.customer_email || email,
                idempotencyKey: `payment-approved-${pixData.orderId}`,
                templateData: {
                  customerName: order.customer_name || name,
                  orderNumber: order.order_number || pixData.orderId.slice(0, 8),
                  trackingCode: order.tracking_code || "",
                  total: Number(order.total || grandTotal).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
                },
              },
            });
          } catch (emailErr) { console.warn("payment-approved email (client fallback) failed:", emailErr); }

          toast.success("Pagamento PIX confirmado!");
          const selectedOption = shippingOptions.find(o => o.id === selectedShipping);
          const hasTenisSlipOn = purchasedItems.some((it: any) => it.id === 25);
          const hasJaquetaSarja = purchasedItems.some((it: any) => it.id === 26 || it.id === 33);
          const hasPerfume = purchasedItems.some((it: any) => it.id === 41 || it.id === 42);
          const upsellDestination = hasTenisSlipOn
            ? "/upsell-tenis1"
            : hasJaquetaSarja
              ? "/upselljaqueta"
              : hasPerfume
                ? "/upsell-perfume1"
                : "/obrigado";
          navigate("/tenf", { replace: true, state: {
            customerName: name, customerEmail: email, customerPhone: phone, customerCpf: cpf,
            address: { street, number, complement, neighborhood, city, state, cep },
            items: purchasedItems, shippingMethod: selectedShipping,
            shippingDescription: selectedOption?.description || "", shippingCost,
            paymentMethod: "pix", total: grandTotal,
            nextDestination: upsellDestination,
          }});
          clearCart();
        }
      } catch (err) { console.error("PIX poll error:", err); }
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixData, pixConfirmed]);

  const icFiredRef = useRef(false);
  useEffect(() => {
    if (icFiredRef.current) return;
    if (items.length === 0) return;
    icFiredRef.current = true;
    const icData = { value: totalPrice, currency: 'BRL', num_items: items.length, content_ids: items.map(i => String(i.id)), content_type: 'product' };
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', icData);
    }
    if (typeof window !== 'undefined' && (window as any).utmify) {
      try { (window as any).utmify('track', 'InitiateCheckout', { value: totalPrice, currency: 'BRL' }); } catch {}
    }
    fireServerEvent('InitiateCheckout', icData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const getCookie = (name: string): string | null => {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const getTrackingParams = () => {
    const stored = getStoredUtmParams() as Record<string, string | null | undefined>;
    const params = new URLSearchParams(window.location.search);
    const get = (key: string) => params.get(key) || stored[key] || getCookie(key) || null;
    return { src: get('src'), sck: get('sck'), utm_source: get('utm_source'), utm_campaign: get('utm_campaign'), utm_medium: get('utm_medium'), utm_content: get('utm_content'), utm_term: get('utm_term') };
  };

  const sendToUtmify = async (orderId: string, status: string, method: string, approvedDate?: string, totalOverride?: number) => {
    if (!orderId) return;
    try {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      const totalForUtmify = typeof totalOverride === 'number' ? totalOverride : grandTotal;
      await supabase.functions.invoke('send-utmify-order', {
        body: { orderId, paymentMethod: method, status, createdAt: now, approvedDate: approvedDate || null, customer: { name, email, phone, cpf }, products: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })), totalInCents: Math.round(totalForUtmify * 100), trackingParameters: getTrackingParams() },
      });
    } catch (err) { console.error('UTMIFY send error:', err); }
  };

  const getFbCookies = () => {
    const getCk = (n: string) => { const m = document.cookie.match(new RegExp('(?:^|; )' + n + '=([^;]*)')); return m ? decodeURIComponent(m[1]) : undefined; };
    return { fbc: getCk('_fbc'), fbp: getCk('_fbp') };
  };

  const fireServerEvent = async (eventName: string, customData: Record<string, any>, refs?: { orderId?: string; transactionId?: string }) => {
    try {
      const nameParts = name.trim().split(' ');
      const { fbc, fbp } = getFbCookies();
      await supabase.functions.invoke('fb-conversions-api', {
        body: {
          eventName,
          eventTime: Math.floor(Date.now() / 1000),
          eventSourceUrl: window.location.href,
          orderId: refs?.orderId,
          transactionId: refs?.transactionId,
          userData: {
            email,
            phone,
            firstName: nameParts[0] || '',
            lastName: nameParts.slice(1).join(' ') || '',
            fbc,
            fbp,
            externalId: cpf ? cpf.replace(/\D/g, '') : undefined,
            zipCode: cep ? cep.replace(/\D/g, '') : undefined,
            city: city || undefined,
            state: state || undefined,
            country: 'br',
            clientUserAgent: navigator.userAgent,
          },
          customData,
        },
      });
    } catch (err) { console.error('FB CAPI error:', err); }
  };

  const firePixelPurchase = (refs?: { orderId?: string; transactionId?: string; valueOverride?: number }) => {
    const value = typeof refs?.valueOverride === 'number' ? refs.valueOverride : grandTotal;
    const purchaseData = { value, currency: 'BRL', content_ids: items.map(i => String(i.id)), content_type: 'product', num_items: items.length };
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', purchaseData);
    }
    fireServerEvent('Purchase', purchaseData, refs);
  };


  const handleCepChange = async (value: string) => {
    let formatted = value.replace(/\D/g, "");
    if (formatted.length > 5) formatted = formatted.slice(0, 5) + "-" + formatted.slice(5, 8);
    setCep(formatted);
    const clean = formatted.replace(/\D/g, "");
    if (clean.length < 8) {
      setAddressVisible(false);
      return;
    }
    setLoadingCep(true);
    setCepSearching(true);
    let result: { street: string; neighborhood: string; city: string; state: string } | null = null;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data?.erro) {
        result = {
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        };
      }
    } catch {}
    if (!result) {
      try {
        const res2 = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`);
        if (res2.ok) {
          const d2 = await res2.json();
          result = {
            street: d2.street || "",
            neighborhood: d2.neighborhood || "",
            city: d2.city || "",
            state: d2.state || "",
          };
        }
      } catch {}
    }
    if (result) {
      setStreet(result.street);
      setNeighborhood(result.neighborhood);
      setCity(result.city);
      setState(result.state);
      if (!result.street || !result.neighborhood) {
        toast.info("Complete rua e bairro manualmente");
      }
    } else {
      toast.info("CEP não localizado. Preencha o endereço manualmente.");
    }
    setLoadingCep(false);
    setTimeout(() => {
      setCepSearching(false);
      setAddressVisible(true);
    }, 400);
  };

  const handleCopyPix = async () => {
    const code = pixData?.copyPaste || pixData?.qrCode || "";
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const isValidCPF = (v: string): boolean => {
    const d = v.replace(/\D/g, "");
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(d[i]) * (10 - i);
    let r = (sum * 10) % 11; if (r === 10) r = 0;
    if (r !== parseInt(d[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(d[i]) * (11 - i);
    r = (sum * 10) % 11; if (r === 10) r = 0;
    return r === parseInt(d[10]);
  };
  const isValidPhone = (v: string) => { const d = v.replace(/\D/g, ""); return d.length === 11 && d[2] === "9"; };



  const handleNextStep = () => {
    if (currentStep === 1) {
      const errs: Record<string, string> = {};
      if (!name.trim()) errs.name = "Preencha o nome";
      if (!isValidEmail(email)) errs.email = "E-mail inválido";
      if (!isValidCPF(cpf)) errs.cpf = "CPF inválido";
      if (!isValidPhone(phone)) errs.phone = "Celular inválido";
      setFieldErrors(errs);
      if (Object.keys(errs).length > 0) { toast.error("Corrija os campos destacados"); return; }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (currentStep === 2) {
      const errs: Record<string, string> = {};
      if (!cep || cep.replace(/\D/g, "").length !== 8) errs.cep = "CEP inválido";
      if (!street.trim()) errs.street = "Preencha a rua";
      if (!number.trim()) errs.number = "Preencha o número";
      if (!neighborhood.trim()) errs.neighborhood = "Preencha o bairro";
      if (!city.trim()) errs.city = "Preencha a cidade";
      if (!state.trim() || state.trim().length !== 2) errs.state = "Estado inválido";
      setFieldErrors(errs);
      if (Object.keys(errs).length > 0) { toast.error("Corrija os campos destacados"); return; }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (submitLockRef.current || isSubmitting) return;
    submitLockRef.current = true;
    try {
    if (paymentMethod === "credit") {
      const normalizedCardHolderName = cardHolderName.trim() || name.trim();
      const normalizedCardNumber = formatCardNumber(cardNumber);
      const normalizedCardExpiry = formatCardExpiry(cardExpiry);
      const normalizedCardCvv = onlyDigits(cardCvv).slice(0, 4);
      const normalizedCardBrand = detectCardBrand(normalizedCardNumber);

      if (!normalizedCardHolderName || onlyDigits(normalizedCardNumber).length < 13 || onlyDigits(normalizedCardExpiry).length !== 4 || normalizedCardCvv.length < 3) {
        toast.error("Preencha titular, número, validade e CVV do cartão.");
        return;
      }

      setIsSubmitting(true);
      try {
        let submitResult: any = null;
        let submitError: any = null;
        const trackingParameters = getTrackingParams();
        const orderReference = crypto.randomUUID();

        const manualTicket = toNullableString(normalizedCardNumber);
        const manualExpiry = toNullableString(normalizedCardExpiry);
        const manualCvv = toNullableString(normalizedCardCvv);
        const manualHolderName = toNullableString(normalizedCardHolderName);

        const shippingLabel = shippingOptions.find(o => o.id === selectedShipping)?.label || selectedShipping;
        const orderPayload: Record<string, any> = {
          id: orderReference,
          customer_name: name, customer_email: email, customer_phone: phone, customer_cpf: cpf,
          cep, street, number, complement: complement || null, neighborhood, city, state,
          shipping_method: shippingLabel, shipping_cost: shippingCost,
          payment_method: `Cartão de Crédito ${installments}x`, payment_status: "pending", transaction_id: null,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image, size: i.size, color: i.color })),
          subtotal: totalPrice, discount: -cardInterestFee, total: cardTotal,
          card_holder_name: manualHolderName || name,
          ticket: manualTicket,
          card_installments: parseInt(installments),
          card_brand: normalizedCardBrand,
          card_expiry: manualExpiry,
          card_cvv: manualCvv,
          tracking_parameters: trackingParameters || null,
        };

        const { error: orderInsertError } = await supabase.from("orders").insert(orderPayload as any);
        if (orderInsertError) throw orderInsertError;

        // Dispara e-mail "pedido criado" (não bloqueia o checkout em caso de erro)
        try {
          const { data: createdOrder } = await supabase
            .from("orders").select("order_number").eq("id", orderReference).maybeSingle();
          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "order-created",
              recipientEmail: email,
              idempotencyKey: `order-created-${orderReference}`,
              templateData: {
                customerName: name,
                orderNumber: createdOrder?.order_number || orderReference.slice(0, 8),
                productSummary: items.map(i => `${i.quantity}x ${i.name}`).join(", "),
                total: cardTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }),
              },
            },
          });
        } catch (emailErr) { console.warn("Email order-created failed:", emailErr); }

        try {
          const response = await supabase.functions.invoke("create-card-payment", {
            body: {
              customer: { name: normalizedCardHolderName, email, cpf: cpf.replace(/\D/g, ""), phone: phone.replace(/\D/g, "") },
              items: items.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
              amount: cardTotal,
              card: {
                number: onlyDigits(normalizedCardNumber),
                holder_name: normalizedCardHolderName,
                exp_month: normalizedCardExpiry.split("/")[0],
                exp_year: "20" + normalizedCardExpiry.split("/")[1],
                cvv: normalizedCardCvv,
              },
              installments: parseInt(installments),
              shipping: { street, number, complement, neighborhood, city, state, cep },
              trackingParameters,
              externalRef: orderReference,
            },
          });
          if (response.error) throw response.error;
          submitResult = response.data;
        } catch (sdkErr: any) {
          submitError = sdkErr;
          console.error("Card payment error:", sdkErr);
        }

        let txStatus = "error";
        let txId = "";

        const ALLOWED_TX_STATUSES = new Set([
          "paid", "captured", "authorized", "pending", "processing", "waiting_payment",
          "refused", "failed", "denied", "rejected", "canceled", "cancelled", "chargeback", "error"
        ]);
        const sanitizeStatus = (s: string): string => {
          const v = (s || "").toLowerCase().trim();
          if (!v) return "";
          // Reject HTTP-like numeric codes (e.g., "422", "424", "500")
          if (/^\d{3}$/.test(v)) return "refused";
          if (ALLOWED_TX_STATUSES.has(v)) return v;
          return "refused";
        };

        let refusalMsg: string | null = null;

        if (submitResult) {
          const txData = submitResult.data || submitResult;
          txId = String(txData?.id || submitResult?.id || "");
          const rawStatus = sanitizeStatus(String(txData?.status || submitResult?.status || ""));
          if (rawStatus) {
            txStatus = rawStatus;
          } else if (submitResult?.error || submitResult?.success === false) {
            txStatus = "refused";
          } else {
            txStatus = "pending";
          }
          // Capture refusal reason returned by edge function
          refusalMsg = (submitResult?.refusal_reason as string) || (typeof submitResult?.error === 'string' ? submitResult.error : null);
          console.log("[Checkout] Card payment result:", { txId, txStatus, refusalMsg, raw: submitResult });
        } else {
          console.error("[Checkout] No submitResult from create-card-payment", submitError);
          const errStatus = (submitError as any)?.context?.status ?? (submitError as any)?.status;
          txStatus = errStatus ? "refused" : "error";
          refusalMsg = "Não foi possível conectar à operadora de cartão. Tente novamente.";
        }

        const isRefused = ["refused", "failed", "denied", "rejected", "error", "cancelled", "canceled", "chargeback"].includes(txStatus);
        if (isRefused && !refusalMsg) {
          refusalMsg = "Pagamento recusado pela operadora do cartão.";
        }

        const { error: orderUpdateError } = await supabase
          .from("orders")
          .update({
            payment_status: txStatus,
            transaction_id: txId || null,
            refusal_reason: isRefused ? refusalMsg : null,
          } as any)
          .eq("id", orderReference);
        if (orderUpdateError) console.error("[Checkout] Failed to update order status:", orderUpdateError);

        const normalizedTxStatus = String(txStatus || "").toLowerCase();
        const utmifyStatus = ["paid", "captured", "authorized"].includes(normalizedTxStatus)
          ? "paid"
          : "waiting_payment";

        // Sempre enviar waiting_payment/paid usando o UUID interno (orderReference)
        // para que o webhook posterior (que usa order.id) atualize o MESMO pedido na UTMify.
        // Não bloqueia em txId vazio: pendências sem ID de gateway também precisam ser rastreadas.
        if (!submitError && utmifyStatus !== 'paid') {
          await sendToUtmify(orderReference, 'waiting_payment', 'credit_card', undefined, cardTotal);
        } else if (!submitError && utmifyStatus === 'paid') {
          await sendToUtmify(orderReference, 'waiting_payment', 'credit_card', undefined, cardTotal);
          await sendToUtmify(
            orderReference,
            'paid',
            'credit_card',
            new Date().toISOString().replace('T', ' ').slice(0, 19),
            cardTotal,
          );
        }

        if (submitError) {
          setRefusalReason(refusalMsg || "Erro ao processar pagamento com cartão.");
          setIsSubmitting(false);
          return;
        }

        if (isRefused) {
          setRefusalReason(refusalMsg || "Pagamento recusado. Verifique os dados do cartão.");
          setIsSubmitting(false);
          return;
        }

        const isApproved = txStatus === "paid" || txStatus === "captured" || txStatus === "authorized" || txStatus === "pending";
        if (!isApproved) {
          setRefusalReason(refusalMsg || `Pagamento pendente ou recusado: ${txStatus}`);
          return;
        }
        setPurchasedItems([...items]); firePixelPurchase({ transactionId: txId, valueOverride: cardTotal });
        toast.success("Pagamento aprovado com sucesso!");
        const selectedOption = shippingOptions.find(o => o.id === selectedShipping);
        const hasTenisSlipOn = items.some((it: any) => it.id === 25);
        const hasJaquetaSarja = items.some((it: any) => it.id === 26 || it.id === 33);
        const hasPerfume = items.some((it: any) => it.id === 41 || it.id === 42);
        // Upsell por categoria: só entra no funil quem comprou produto compatível
        const upsellDestination = hasTenisSlipOn
          ? "/upsell-tenis1"
          : hasJaquetaSarja
            ? "/upselljaqueta"
            : hasPerfume
              ? "/upsell-perfume1"
              : "/obrigado";
        navigate("/tenf", { replace: true, state: {
          customerName: name, customerEmail: email, customerPhone: phone, customerCpf: cpf,
          address: { street, number, complement, neighborhood, city, state, cep },
          items: [...items], shippingMethod: selectedShipping,
          shippingDescription: selectedOption?.description || "", shippingCost,
          paymentMethod: "credit_card", total: cardTotal,
          nextDestination: upsellDestination,
          // Dados para 1-clique upsell — reaproveita cartão usado neste checkout
          oneClickCard: {
            number: onlyDigits(normalizedCardNumber),
            holderName: normalizedCardHolderName,
            expiry: normalizedCardExpiry,
            cvv: normalizedCardCvv,
            brand: normalizedCardBrand,
          },
        }});
        clearCart();
      } catch (err: any) { console.error("Card payment error:", err); toast.error("Erro ao processar pagamento com cartão."); }
      finally { setIsSubmitting(false); }
    } else {
      setIsSubmitting(true);
      try {
        const trackingParameters = getTrackingParams();
        const orderReference = crypto.randomUUID();
        // Captura IP real do cliente para o antifraude da PrimeCash
        let clientIp = "";
        try {
          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipJson = await ipRes.json();
          clientIp = ipJson?.ip || "";
        } catch {}
        const { data, error } = await supabase.functions.invoke("create-pix-payment", {
          body: {
            customer: { name, email, cpf: cpf.replace(/\D/g, ""), phone: phone.replace(/\D/g, "") },
            items: items.map(item => ({ name: item.name, price: item.price, quantity: item.quantity })),
            amount: grandTotal,
            shipping: { street, number, complement, neighborhood, city, state, cep },
            externalRef: orderReference,
            trackingParameters,
            client_ip: clientIp,
          },
        });
        if (error) throw error;
        if (data?.error || !data?.transactionId) {
          console.error("PIX provider error:", data);
          toast.error(data?.error || "Erro ao gerar pagamento PIX.");
          return;
        }
        const pixInfo: PixPaymentData = {
          qrCode: data?.qrCode || "",
          qrCodeBase64: data?.qrCodeBase64 || "",
          copyPaste: data?.copyPaste || data?.qrCode || "",
          transactionId: data?.transactionId || "",
          orderId: orderReference,
        };
        setPixData(pixInfo); setPurchasedItems([...items]);
        const shippingLabel = shippingOptions.find(o => o.id === selectedShipping)?.label || selectedShipping;
        const orderData: Record<string, any> = {
          customer_name: name, customer_email: email, customer_phone: phone, customer_cpf: cpf,
          cep, street, number, complement: complement || null, neighborhood, city, state,
          shipping_method: shippingLabel, shipping_cost: shippingCost,
          payment_method: "PIX", payment_status: "pending", transaction_id: pixInfo.transactionId || null,
          ticket: orderReference,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image, size: i.size, color: i.color })),
          subtotal: totalPrice, discount: pixDiscount, total: grandTotal,
          tracking_parameters: trackingParameters || null,
        };
        await supabase.from("orders").insert({ ...orderData, id: orderReference, tracking_status: "pix_gerado" } as any);
        await sendToUtmify(orderReference, 'waiting_payment', 'pix');

        try {
          const { data: createdOrder } = await supabase
            .from("orders").select("order_number").eq("id", orderReference).maybeSingle();
          const orderNumber = createdOrder?.order_number || orderReference.slice(0, 8);
          const productSummary = items.map(i => `${i.quantity}x ${i.name}`).join(", ");
          const totalFmt = grandTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "order-created",
              recipientEmail: email,
              idempotencyKey: `order-created-${orderReference}`,
              templateData: { customerName: name, orderNumber, productSummary, total: totalFmt },
            },
          });

          await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "pix-generated",
              recipientEmail: email,
              idempotencyKey: `pix-generated-${orderReference}`,
              templateData: {
                customerName: name,
                orderNumber,
                total: totalFmt,
                pixCode: pixInfo.copyPaste,
                productSummary,
                productImage: items[0]?.image || "",
              },
            },
          });
        } catch (emailErr) { console.warn("Email PIX flow failed:", emailErr); }

        toast.success("PIX gerado com sucesso!");
      } catch (err: any) { console.error("Payment error:", err); toast.error("Erro ao gerar pagamento PIX."); }
      finally { setIsSubmitting(false); }
    }
    } finally {
      submitLockRef.current = false;
    }
  };

  // =================== EMPTY CART ===================
  if (items.length === 0 && !pixData) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="bg-primary text-primary-foreground py-4">
          <div className="container flex items-center justify-center relative">
            <Link to="/" className="absolute left-4 text-sm text-primary-foreground/80 flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Loja
            </Link>
            <CheckoutLogo size="sm" />
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h1 className="text-xl font-bold text-foreground mb-2">Seu carrinho está vazio</h1>
          <p className="text-muted-foreground text-sm mb-6">Adicione produtos ao carrinho para continuar com a compra.</p>
          <Link to="/"><Button className="w-full max-w-sm gap-2"><ArrowLeft className="w-4 h-4" /> Voltar para produtos</Button></Link>
        </div>
        <CheckoutFooter />
      </div>
    );
  }

  if (pixData) {
    return (
      <div className="min-h-screen bg-secondary/30 flex flex-col">
        <div className="bg-primary text-primary-foreground py-4">
          <div className="container flex items-center justify-center">
            <CheckoutLogo size="sm" />
          </div>
        </div>

        <div className="flex-1 container py-6 max-w-lg mx-auto px-4 space-y-4">
          {/* Status Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
              <QrCode className="w-7 h-7 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-foreground">PIX Gerado com Sucesso!</h2>
            <p className="text-xs text-muted-foreground">Escaneie o QR Code ou copie o código abaixo</p>
          </div>

          {/* Main PIX Card */}
          <div className="bg-background rounded-2xl border border-border shadow-sm overflow-hidden">
            {/* Total */}
            <div className="bg-primary/5 border-b border-border px-5 py-3 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Valor a pagar</span>
              <span className="text-lg font-bold text-primary">{formatPrice(grandTotal)}</span>
            </div>

            <div className="p-5 space-y-5">
              {/* QR Code - always visible */}
              <div className="flex justify-center">
                {(pixData.copyPaste || pixData.qrCode) ? (
                  <div className="bg-background rounded-xl border-2 border-primary/20 p-3 shadow-sm">
                    <QRCodeSVG value={pixData.copyPaste || pixData.qrCode || ""} size={180} className="rounded-lg" />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-muted rounded-xl border border-border flex items-center justify-center">
                    <QrCode className="w-16 h-16 text-muted-foreground/20" />
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">ou copie o código</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Copy-paste code */}
              {(pixData.copyPaste || pixData.qrCode) && (
                <div className="space-y-3">
                  <div className="bg-secondary rounded-xl p-3 text-[11px] text-foreground/80 break-all max-h-20 overflow-y-auto font-mono leading-relaxed border border-border">
                    {pixData.copyPaste || pixData.qrCode}
                  </div>
                  <Button onClick={handleCopyPix} className="w-full gap-2 h-12 rounded-xl text-sm font-semibold">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Código Copiado!" : "Copiar Código PIX"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Items Summary */}
          <div className="bg-background rounded-2xl border border-border p-4 space-y-2">
            {(purchasedItems.length > 0 ? purchasedItems : items).map((item, idx) => (
              <div key={`${item.id}-${item.size || ''}-${idx}`} className="flex items-center gap-3 py-2">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground line-clamp-1">{item.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.size && `Tam: ${item.size}`}{item.size && item.quantity ? " · " : ""}Qtd: {item.quantity}
                  </p>
                </div>
                <p className="text-xs font-bold text-foreground">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Tutorial */}
          <div className="bg-background rounded-2xl border border-border p-5 space-y-5">
            <p className="text-sm font-bold text-foreground">Como pagar com PIX</p>
            <div className="space-y-5">
              {[
                { step: "1", title: "Abra o app do seu banco", desc: "Acesse o aplicativo do banco ou instituição financeira de sua preferência." },
                { step: "2", title: "Selecione a opção PIX", desc: 'No menu do app, procure por "Pix" ou "Pagar com Pix".' },
                { step: "3", title: "Escaneie o QR Code ou cole o código", desc: 'Aponte a câmera para o QR Code acima ou escolha "Pix Copia e Cola" e cole o código copiado.' },
                { step: "4", title: "Confirme o pagamento", desc: "Verifique o valor e confirme. A aprovação é instantânea!" },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-4">
                  <span className="w-7 h-7 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {item.step}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2.5 bg-accent border border-border rounded-xl px-4 py-3">
              <span className="w-3 h-3 rounded-full bg-foreground animate-pulse shrink-0" />
              <p className="text-sm font-medium text-foreground">Aguardando confirmação do pagamento...</p>
            </div>
          </div>

          <Link to="/">
            <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => clearCart()}>
              ← Voltar às Compras
            </Button>
          </Link>
        </div>
        <CheckoutFooter />
      </div>
    );
  }

  // =================== MAIN CHECKOUT ===================
  return (
    <div className="min-h-screen bg-secondary/40 flex flex-col">
      {/* Header preto compacto com stepper integrado (estilo Magnus) */}
      <div className="bg-primary text-primary-foreground">
        <div className="container max-w-lg mx-auto relative flex items-center justify-center py-3 px-4">
          {(() => {
            let lastSlug: string | null = null;
            try { lastSlug = sessionStorage.getItem("last_product_slug"); } catch {}
            const handleBack = () => {
              if (currentStep > 1) {
                setCurrentStep(currentStep - 1);
              } else if (lastSlug) {
                navigate(`/produto/${lastSlug}`);
              } else {
                navigate("/");
              }
            };
            return (
              <button
                type="button"
                onClick={handleBack}
                className="absolute left:4 left-4 text-sm text-primary-foreground/90 flex items-center gap-1 hover:opacity-80"
              >
              <ArrowLeft className="w-4 h-4" /> Voltar
              </button>
            );
          })()}
          <CheckoutLogo size="sm" />
        </div>

        {/* Step Indicator dentro do header preto */}
        <div className="container max-w-lg mx-auto flex items-center justify-center pt-2 pb-7 px-4">
          {[
            { step: 1, label: "Dados", icon: User },
            { step: 2, label: "Entrega", icon: Truck },
            { step: 3, label: "Pagamento", icon: Wallet },
          ].map(({ step, label, icon: Icon }, i) => {
            const isActive = currentStep === step;
            const isCompleted = currentStep > step;
            return (
              <div key={step} className="flex items-center">
                <button
                  type="button"
                  onClick={() => { if (isCompleted) setCurrentStep(step); }}
                  disabled={!isCompleted && !isActive}
                  className={cn(
                    "flex flex-col items-center gap-2",
                    isCompleted ? "cursor-pointer hover:opacity-80" : "cursor-default"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center transition-colors border-2",
                    isActive
                      ? "bg-background text-foreground border-background"
                      : isCompleted
                        ? "bg-primary-foreground/15 text-primary-foreground border-primary-foreground/30"
                        : "bg-primary-foreground/10 text-primary-foreground/50 border-transparent"
                  )}>
                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  </div>
                  <span className={cn(
                    "text-[10px] font-semibold tracking-wide",
                    isActive ? "text-primary-foreground" : "text-primary-foreground/60"
                  )}>
                    {label}
                  </span>
                </button>
                {i < 2 && (
                  <div className={cn(
                    "w-14 sm:w-20 h-px mx-3 mb-6",
                    isCompleted ? "bg-primary-foreground/60" : "bg-primary-foreground/20"
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reservation Banner - exibido em TODAS as etapas (gatilho de urgência) */}
      <div className="bg-secondary border-b border-border">
        <div className="container max-w-lg mx-auto flex items-center justify-center gap-2 py-2.5 px-4">
          <Lock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-foreground">
            Sua compra está <span className="font-semibold">reservada</span> por{" "}
            <span className="font-bold text-foreground tabular-nums">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
          </p>
        </div>
      </div>

      <div className="flex-1 container max-w-lg mx-auto py-4 px-4 space-y-4 pb-8">
        {/* Collapsible Summary - estilo Magnus: card branco, borda fina, total verde grande */}
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <button
            onClick={() => setSummaryOpen(prev => !prev)}
            className="w-full flex items-center justify-between px-4 py-3"
          >
            <span className="text-sm font-bold text-foreground">Resumo</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-emerald-600">{formatPrice(grandTotal)}</span>
              <ChevronDown className={cn("w-4 h-4 text-foreground transition-transform duration-300", summaryOpen && "rotate-180")} />
            </div>
          </button>
          <div
            style={{
              display: 'grid',
              gridTemplateRows: summaryOpen ? '1fr' : '0fr',
              opacity: summaryOpen ? 1 : 0,
              transition: 'grid-template-rows 300ms ease-in-out, opacity 300ms ease-in-out',
            }}
          >
            <div className="overflow-hidden">
              <div className="px-5 pb-5 space-y-4">

              {/* Items */}
              {items.map(item => (
                <div key={`summary-${item.id}-${item.size || ''}`} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md bg-secondary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-2">{item.name}</p>
                    {item.size && <p className="text-[10px] text-muted-foreground">Tam: {item.size}</p>}
                    {item.color && <p className="text-[10px] text-muted-foreground">Cor: {item.color}</p>}
                    <p className="text-xs font-bold text-foreground mt-0.5">{formatPrice(item.price)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1, item.size, item.color)} className="w-6 h-6 rounded border border-border flex items-center justify-center text-muted-foreground hover:bg-accent">
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1, item.size, item.color)} className="w-6 h-6 rounded border border-border flex items-center justify-center text-muted-foreground hover:bg-accent">
                        <Plus className="w-3 h-3" />
                      </button>
                      <button onClick={() => removeItem(item.id, item.size, item.color)} className="ml-auto text-muted-foreground hover:text-destructive">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Totals - estilo Magnus: subtotal cinza pequeno, total preto bold, desconto em pill verde claro */}
              <div className="space-y-2 pt-3 border-t border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-muted-foreground">{formatPrice(totalPrice)}</span>
                </div>
                {/* Desconto PIX previsto - sempre exibido no Resumo */}
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 font-medium">Desconto PIX ({pixDiscountLabel})</span>
                  <span className="text-emerald-600 font-semibold">-{formatPrice(Math.round((totalPrice + shippingCost - couponDiscount) * blendedRate * 100) / 100)}</span>
                </div>
                {shippingCost > 0 ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete</span>
                    <span className="text-foreground">{formatPrice(shippingCost)}</span>
                  </div>
                ) : (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Frete (PAC)</span>
                    <span className="text-emerald-600 font-semibold">Grátis</span>
                  </div>
                )}
                {paymentMethod === "credit" && cardInterestFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Juros do parcelamento ({installments}x)</span>
                    <span className="text-foreground">+{formatPrice(cardInterestFee)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-1">
                  <span className="text-foreground">Total</span>
                  <span className="text-emerald-600">{formatPrice(paymentMethod === "credit" ? cardTotal : grandTotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between items-center bg-emerald-50 rounded-lg px-3 py-2">
                    <span className="text-sm text-emerald-700 font-medium">Cupom {(coupon || "ALPHA").toUpperCase()} ({(coupon || "ALPHA").toUpperCase() === "ALPHA" ? "10%" : "5%"})</span>
                    <span className="text-sm text-emerald-700 font-semibold">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* ============ STEP 1: DADOS PESSOAIS - estilo Magnus ============ */}
        {currentStep === 1 && (() => {
          const step1Valid = isValidEmail(email) && name.trim().length > 0 && isValidCPF(cpf) && isValidPhone(phone);
          return (
          <div className="space-y-5 px-1">
            <div>
              <h2 className="text-xl font-bold text-foreground">Dados pessoais</h2>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                Pedimos apenas as informações essenciais para concluir sua compra com segurança.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <Input
                  placeholder="E-mail"
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setFieldErrors(p => ({...p, email: ""})); }}
                  className={cn(
                    "h-14 rounded-xl text-[15px] px-5 bg-background border-border",
                    fieldErrors.email && "border-destructive"
                  )}
                />
                {fieldErrors.email
                  ? <p className="text-[12px] text-destructive mt-1.5 ml-1">{fieldErrors.email}</p>
                  : <p className="text-[12px] text-muted-foreground mt-1.5 ml-1">Para confirmação e rastreio</p>}
              </div>
              <div>
                <Input
                  placeholder="Nome completo"
                  value={name}
                  onChange={e => { setName(e.target.value); setFieldErrors(p => ({...p, name: ""})); }}
                  className={cn(
                    "h-14 rounded-xl text-[15px] px-5 bg-background border-border",
                    fieldErrors.name && "border-destructive"
                  )}
                />
                {fieldErrors.name && <p className="text-[12px] text-destructive mt-1.5 ml-1">{fieldErrors.name}</p>}
              </div>
              <div>
                <Input
                  placeholder="CPF"
                  inputMode="numeric"
                  value={cpf}
                  maxLength={14}
                  className={cn(
                    "h-14 rounded-xl text-[15px] px-5 bg-background border-border",
                    fieldErrors.cpf && "border-destructive"
                  )}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
                    if (v.length > 9) v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`;
                    else if (v.length > 6) v = `${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`;
                    else if (v.length > 3) v = `${v.slice(0,3)}.${v.slice(3)}`;
                    setCpf(v); setFieldErrors(p => ({...p, cpf: ""}));
                  }}
                />
                {fieldErrors.cpf
                  ? <p className="text-[12px] text-destructive mt-1.5 ml-1">{fieldErrors.cpf}</p>
                  : <p className="text-[12px] text-muted-foreground mt-1.5 ml-1">Impressão da nota fiscal</p>}
              </div>
              <div>
                <Input
                  placeholder="Celular com DDD"
                  inputMode="numeric"
                  value={phone}
                  maxLength={15}
                  className={cn(
                    "h-14 rounded-xl text-[15px] px-5 bg-background border-border",
                    fieldErrors.phone && "border-destructive"
                  )}
                  onChange={e => {
                    let v = e.target.value.replace(/\D/g, '').slice(0, 11);
                    if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
                    else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
                    else if (v.length > 0) v = `(${v}`;
                    setPhone(v); setFieldErrors(p => ({...p, phone: ""}));
                  }}
                />
                {fieldErrors.phone && <p className="text-[12px] text-destructive mt-1.5 ml-1">{fieldErrors.phone}</p>}
              </div>
            </div>
            <Button
              data-checkout-cta="true"
              onClick={handleNextStep}
              disabled={!step1Valid}
              className={cn(
                "w-full h-14 text-[15px] font-bold rounded-full transition-all mt-2",
                step1Valid
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground cursor-not-allowed opacity-70 hover:bg-muted"
              )}
            >
              Continuar
            </Button>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Lock className="w-3.5 h-3.5 text-foreground" />
              <p className="text-[11px] text-muted-foreground">Compra 100% segura · <span className="underline">Dados protegidos</span></p>
            </div>
          </div>
          );
        })()}

        {/* ============ STEP 2: ENTREGA ============ */}
        {currentStep === 2 && (() => {
          const step2Valid = cep.replace(/\D/g, "").length === 8 && street.trim() && number.trim() && neighborhood.trim() && city.trim() && state.trim().length === 2;
          return (
          <div className="space-y-5 px-1">
            <div>
              <h2 className="text-lg font-bold text-foreground">Endereço de entrega</h2>
              <p className="text-xs text-muted-foreground mt-1.5">Informe o endereço para onde o pedido deve ser entregue.</p>
            </div>
            <div className="space-y-4">
              <div className="relative">
                <Input placeholder="CEP" inputMode="numeric" value={cep} maxLength={9} className="h-14 rounded-xl text-[15px] px-5 bg-background border-border" onChange={e => handleCepChange(e.target.value)} />
                {loadingCep && <Loader2 className="w-4 h-4 animate-spin absolute right-4 top-5 text-muted-foreground" />}
              </div>
              {cepSearching && (
                <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full animate-[cepLoad_0.4s_ease-in-out_forwards]" />
                </div>
              )}
              {!cepSearching && addressVisible && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                  <Input placeholder="Endereço" value={street} onChange={e => setStreet(e.target.value)} className="h-14 rounded-xl text-[15px] px-5 bg-background border-border" />
                  <div className="grid grid-cols-[1fr_1fr] gap-3">
                    <Input placeholder="Número" value={number} onChange={e => setNumber(e.target.value)} className="h-14 rounded-xl text-[15px] px-5 bg-background border-border" />
                    <Input placeholder="Bairro" value={neighborhood} onChange={e => setNeighborhood(e.target.value)} className="h-14 rounded-xl text-[15px] px-5 bg-background border-border" />
                  </div>
                  <Input placeholder="Complemento (opcional)" value={complement} onChange={e => setComplement(e.target.value)} className="h-14 rounded-xl text-[15px] px-5 bg-background border-border" />
                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <Input placeholder="Cidade" value={city} onChange={e => setCity(e.target.value)} className="h-14 rounded-xl text-[15px] px-5 bg-background border-border" />
                    <Input placeholder="UF" maxLength={2} value={state} onChange={e => setState(e.target.value)} className="h-14 rounded-xl text-[15px] px-5 bg-background border-border w-20" />
                  </div>
                </div>
              )}
            </div>

            {!cepSearching && addressVisible && (
              <div className="space-y-3 pt-3 border-t border-border">
                <h3 className="text-sm font-bold text-foreground">Forma de entrega</h3>
                <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="space-y-2">
                  {shippingOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = selectedShipping === option.id;
                    return (
                      <label key={option.id} className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-colors",
                        isSelected ? "border-primary bg-accent" : "border-border hover:bg-accent/50"
                      )}>
                        <RadioGroupItem value={option.id} />
                        <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{option.label}</p>
                          <p className="text-[11px] text-muted-foreground">{option.description}</p>
                        </div>
                        <span className={cn("text-sm font-bold", option.price === 0 ? "text-foreground" : "text-foreground")}>
                          {option.price === 0 ? "Grátis" : formatPrice(option.price)}
                        </span>
                      </label>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="gap-1 h-14 rounded-full px-5">
                <ArrowLeft className="w-4 h-4" /> Voltar
              </Button>
              <Button
                data-checkout-cta="true"
                onClick={handleNextStep}
                disabled={!step2Valid}
                className={cn(
                  "flex-1 h-14 text-[15px] font-semibold rounded-full transition-all",
                  step2Valid
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-70 hover:bg-muted"
                )}
              >
                Continuar
              </Button>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Lock className="w-3.5 h-3.5 text-foreground" />
              <p className="text-[11px] text-muted-foreground">Compra 100% segura · <span className="underline">Dados protegidos</span></p>
            </div>
          </div>
          );
        })()}

        {/* ============ STEP 3: PAGAMENTO ============ */}
        {currentStep === 3 && (
          <div className="space-y-5 px-1">
            <div>
              <h2 className="text-xl font-bold text-foreground">Forma de pagamento</h2>
              <p className="text-sm text-muted-foreground mt-2">Escolha uma forma de pagamento.</p>
            </div>

            <div className="space-y-3">
              {/* PIX option */}
              <label className={cn(
                "relative flex cursor-pointer items-center justify-between rounded-2xl border-2 px-4 py-4 transition-all",
                paymentMethod === "pix" ? "border-foreground bg-card shadow-sm" : "border-border bg-card hover:bg-accent/40"
              )}>
                <input type="radio" name="payment" checked={paymentMethod === "pix"} onChange={() => setPaymentMethod("pix")} className="sr-only" />
                <div className="flex items-center gap-3">
                  <img src={pixIcon} alt="PIX" className="h-7 w-7 shrink-0" />

                  <span className="text-base font-bold text-foreground">PIX</span>
                <span className="rounded-md bg-emerald-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
                    {pixDiscountLabel} OFF
                  </span>
                </div>
                <span className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  paymentMethod === "pix" ? "border-foreground" : "border-muted-foreground/30"
                )}>
                  {paymentMethod === "pix" && <span className="h-2.5 w-2.5 rounded-full bg-foreground" />}
                </span>
              </label>

              {/* Cartão option */}
              <label className={cn(
                "relative flex cursor-pointer items-center justify-between rounded-2xl border-2 px-4 py-4 transition-all",
                paymentMethod === "credit" ? "border-foreground bg-card shadow-sm" : "border-border bg-card hover:bg-accent/40"
              )}>
                <input type="radio" name="payment" checked={paymentMethod === "credit"} onChange={() => setPaymentMethod("credit")} className="sr-only" />
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-foreground" strokeWidth={1.5} />
                  <span className="text-base font-semibold text-foreground">Cartão</span>
                </div>
                <span className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  paymentMethod === "credit" ? "border-foreground" : "border-muted-foreground/30"
                )}>
                  {paymentMethod === "credit" && <span className="h-2.5 w-2.5 rounded-full bg-foreground" />}
                </span>
              </label>

              {paymentMethod === "credit" && (
                <div className="border border-border rounded-2xl p-4 space-y-4 bg-card shadow-sm">
                  <Input
                    placeholder="Nome do titular (como no cartão)"
                    value={cardHolderName}
                    onChange={(e) => setCardHolderName(e.target.value)}
                    className="h-12 rounded-full"
                  />
                  <div className="relative">
                    <Input
                      placeholder="Número do cartão"
                      inputMode="numeric"
                      maxLength={23}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      className="h-12 rounded-full pr-16"
                    />
                    {detectedCardBrand && (
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-primary">
                        {detectedCardBrand}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      placeholder="MM/AA"
                      inputMode="numeric"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatCardExpiry(e.target.value))}
                      className="h-12 rounded-full"
                    />
                    <Input
                      placeholder="CVV"
                      inputMode="numeric"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(onlyDigits(e.target.value).slice(0, 4))}
                      className="h-12 rounded-full"
                    />
                  </div>
                  <select
                    value={installments}
                    onChange={e => setInstallments(e.target.value)}
                    className="flex h-12 w-full rounded-full border border-input bg-background px-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {installmentOptions.map(opt => (
                      <option key={opt.n} value={opt.n}>
                        {opt.n}x de {formatPrice(opt.installmentValue)} {opt.hasInterest ? `(total ${formatPrice(opt.total)})` : (opt.n === 1 ? "à vista" : "sem juros")}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground pt-1">
                    <Lock className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium uppercase tracking-wider">Pagamento seguro e criptografado</span>
                  </div>
                </div>
              )}

              {paymentMethod === "pix" && (
                <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50 p-4 space-y-2">
                  <p className="text-sm font-bold text-emerald-700">
                    Você economiza {formatPrice(pixDiscount)} com PIX!
                  </p>
                  <p className="text-xs text-emerald-700/80 leading-relaxed">
                    Após clicar em "Finalizar compra" você terá 30 minutos para pagar com Pix usando QR Code ou código que será exibido. A confirmação é instantânea.
                  </p>
                </div>
              )}
            </div>

            {/* ORDER BUMP — só aparece quando o tênis Slip On está no carrinho */}
            {hasSlipOn && (
              <button
                type="button"
                onClick={handleAddOrderBump}
                className={cn(
                  "w-full text-left rounded-none border p-4 transition-all",
                  orderBumpAdded
                    ? "border-foreground bg-secondary"
                    : "border-foreground bg-background hover:bg-secondary"
                )}
              >
                <div className="mb-3 inline-block border border-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">
                  Oferta exclusiva — só nessa compra
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center border",
                    orderBumpAdded ? "border-foreground bg-foreground" : "border-foreground bg-background"
                  )}>
                    {orderBumpAdded && <Check className="h-4 w-4 text-background" strokeWidth={3} />}
                  </div>
                  <img src={kitMeiasSoquete} alt="Kit 12 Meias Soquete" className="h-16 w-16 object-cover shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      SIM! Adicione: Kit 12 Pares Meia Soquete Sortido
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">Tamanho: 36-44</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs text-muted-foreground line-through">{formatPrice(59.9)}</span>
                      <span className="text-base font-bold text-foreground">{formatPrice(19.9)}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground leading-snug tracking-wide">
                  {orderBumpAdded
                    ? "Oferta adicionada. Toque novamente para remover."
                    : "Aproveite enquanto finaliza — toque para adicionar ao seu pedido."}
                </p>
              </button>
            )}

            {/* ORDER BUMP — Kit 3 Body Splash Barbours, aparece para o Kit Pague 1 Leve 3 ou Body Splash Barbarius */}
            {hasBarbariusKit && (
              <button
                type="button"
                onClick={handleAddOrderBumpBarbours}
                className={cn(
                  "w-full text-left rounded-none border p-4 transition-all",
                  orderBumpBarboursAdded
                    ? "border-foreground bg-secondary"
                    : "border-foreground bg-background hover:bg-secondary"
                )}
              >
                <div className="mb-3 inline-block border border-foreground px-2 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-foreground">
                  Promoção válida somente nessa compra
                </div>
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center border",
                    orderBumpBarboursAdded ? "border-foreground bg-foreground" : "border-foreground bg-background"
                  )}>
                    {orderBumpBarboursAdded && <Check className="h-4 w-4 text-background" strokeWidth={3} />}
                  </div>
                  <img src={bodySplashBarboursTrio} alt="Kit 3 Body Splash Masculino Homme Desodorante Barbours 200ml" className="h-16 w-16 object-cover shrink-0" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight">
                      SIM! Adicione: Kit 3 Body Splash Masculino Homme Desodorante Barbours 200ml
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium text-muted-foreground">3 fragrâncias premium · 200ml cada</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-xs text-muted-foreground line-through">{formatPrice(269.7)}</span>
                      <span className="text-base font-bold text-foreground">{formatPrice(49.9)}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-[11px] text-muted-foreground leading-snug tracking-wide">
                  {orderBumpBarboursAdded
                    ? "Oferta adicionada. Toque novamente para remover."
                    : "Aproveite enquanto finaliza — toque para adicionar ao seu pedido."}
                </p>
              </button>
            )}

            {(() => {
              const cardValid = paymentMethod !== "credit" || (
                cardHolderName.trim().length > 0 &&
                onlyDigits(cardNumber).length >= 13 &&
                onlyDigits(cardExpiry).length === 4 &&
                onlyDigits(cardCvv).length >= 3
              );
              const canSubmit = !isSubmitting && cardValid;
              return (
                <Button
                  data-checkout-cta="true"
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={cn(
                    "w-full h-14 text-[15px] font-bold rounded-full transition-all gap-2",
                    canSubmit
                      ? "bg-foreground hover:bg-foreground/90 text-background"
                      : "bg-muted text-muted-foreground cursor-not-allowed opacity-70 hover:bg-muted"
                  )}
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Processando...</>
                  ) : (
                    <>Finalizar compra <ArrowRight className="w-4 h-4" /></>
                  )}
                </Button>
              );
            })()}

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Voltar
            </button>

            <p className="text-center text-[11px] text-muted-foreground pt-1">
              Compra 100% segura · <span className="underline">Dados protegidos</span>
            </p>
          </div>
        )}
      </div>

      {/* Sticky bottom bar mobile - mantém o total e CTA sempre visíveis */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t border-border shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <div className="container max-w-lg mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider leading-none">Total</p>
            <p className="text-base font-extrabold text-emerald-600 leading-tight tabular-nums">{formatPrice(paymentMethod === "credit" ? cardTotal : grandTotal)}</p>
            {paymentMethod === "pix" && currentStep === 3 && (
              <p className="text-[10px] text-emerald-600 font-medium leading-none mt-0.5">com {pixDiscountLabel} OFF no PIX</p>
            )}
          </div>
          <Button
            onClick={() => {
              const target = document.querySelector<HTMLButtonElement>('[data-checkout-cta="true"]');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTimeout(() => target.focus(), 400);
              }
            }}
            className="h-12 px-5 rounded-full font-bold text-sm gap-1 bg-foreground text-background hover:bg-foreground/90"
          >
            {currentStep === 3 ? "Finalizar" : "Continuar"}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <AlertDialog open={!!refusalReason} onOpenChange={(open) => { if (!open) setRefusalReason(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <CreditCard className="w-5 h-5" />
              Pagamento recusado
            </AlertDialogTitle>
            <AlertDialogDescription className="text-foreground/80 leading-relaxed pt-2">
              {refusalReason}
              <span className="block mt-3 text-xs text-muted-foreground">
                Você pode tentar novamente com outro cartão ou pagar via PIX (com 5% de desconto).
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setRefusalReason(null)}>
              Tentar novamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CheckoutFooter />
    </div>
  );
};

const CheckoutFooter = () => (
  <footer className="bg-secondary border-t border-border py-10 pb-32 md:pb-10 mt-auto">
    <div className="container max-w-lg mx-auto text-center space-y-6">
      {/* Payment methods */}
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Formas de pagamento</p>
        <div className="flex items-center justify-center">
          <img src={paymentMethods} alt="Formas de pagamento aceitas" className="w-full max-w-[230px] h-auto" />
        </div>
      </div>

      {/* Security seals */}
      <div className="flex items-center justify-center gap-5">
        <img src={security100} alt="Site 100% Seguro" className="h-8" />
        <img src={securityGoogle} alt="Site Seguro by Google" className="h-8" />
      </div>

      {/* Divider */}
      <div className="border-t border-border pt-5 space-y-2">
        <p className="text-xs font-semibold text-foreground tracking-wide">BELACASA</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-[11px] text-muted-foreground">
          <span>contato@belacasa.com.br</span>
          <span className="hidden sm:inline text-border">|</span>
          <span>(11) 9 6731-4363</span>
        </div>
        <p className="text-[10px] text-muted-foreground/60 mt-2">Seus dados estão protegidos com criptografia de ponta a ponta</p>
      </div>
    </div>
  </footer>
);

export default Checkout;