import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import { Check, Copy, Loader2, Lock, ShieldCheck, ShoppingBag } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { products as allProducts } from "@/data/products";
import { supabase } from "@/integrations/supabase/client";
import { getStoredUtmParams } from "@/hooks/useUtmCapture";
import { computeInstallments } from "@/lib/installments";

import LunaAdviceBar from "./LunaAdviceBar";
import LunaHeader from "./LunaHeader";
import LunaCartSummary from "./LunaCartSummary";
import LunaTrustSection from "./LunaTrustSection";
import PersonalDataStep from "../PersonalDataStep";
import ShippingStep, { SHIPPING_OPTIONS } from "../ShippingStep";
import PaymentStep from "../PaymentStep";

const ACCENT = "#be7e5b";
import pixIcon from "@/assets/pix-icon.png";
import formasPagamento from "@/assets/formas-pagamento.png";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const onlyDigits = (value: string) => value.replace(/\D/g, "");

const maskCpf = (value: string) => {
  const d = onlyDigits(value).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const maskPhone = (value: string) => {
  const d = onlyDigits(value).slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

const formatCardNumber = (value: string) => onlyDigits(value).slice(0, 19).replace(/(.{4})/g, "$1 ").trim();

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
  if (/^(4011(78|79)|431274|438935|451416|457393|45763[12]|504175|5067\d{2}|509\d{3}|627780|636297|636368|650\d{3}|6516\d{2}|6550\d{2})/.test(digits)) return "Elo";
  if (/^(606282|3841)/.test(digits)) return "Hipercard";
  if (/^3(0[0-5]|[68])/.test(digits)) return "Diners";
  return null;
};

const toNullableString = (value: unknown): string | null => {
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  return null;
};

interface PixPaymentData {
  qrCode?: string;
  qrCodeBase64?: string;
  copyPaste?: string;
  transactionId?: string;
  orderId?: string;
}

const getSessionId = () => {
  let sid = sessionStorage.getItem("checkout_session_id");
  if (!sid) { sid = crypto.randomUUID(); sessionStorage.setItem("checkout_session_id", sid); }
  return sid;
};

const trackCheckoutStep = async (step: string, productId: string | null) => {
  try {
    await supabase.from("checkout_events").insert({
      session_id: getSessionId(), step, product_id: productId, page: "checkout",
    } as any);
  } catch (e) { console.error("Track step error:", e); }
};

const FOOTER_LINKS = [
  { label: "Termos de Uso", to: "/termos-de-uso" },
  { label: "Política de Privacidade", to: "/politica-de-privacidade" },
  { label: "Trocas e Devoluções", to: "/trocas-e-devolucoes" },
  { label: "Central de Ajuda", to: "/central-de-ajuda" },
];

const CheckoutFooter = () => (
  <footer className="border-t border-gray-200 bg-[#EFEDEA]">
    <div className="container max-w-5xl mx-auto px-4 py-8 text-center space-y-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-500">Formas de pagamento</p>
      <img
        src={formasPagamento}
        alt="Formas de pagamento aceitas: Pix, Boleto, Visa, Mastercard, Hipercard, Cielo, American Express, Diners Club, Discover e Elo"
        className="mx-auto w-full max-w-md h-auto"
        loading="lazy"
        decoding="async"
      />
      <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="text-xs text-gray-600 hover:text-[#be7e5b] transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="space-y-1 pt-2">
        <p className="text-[10px] text-gray-500">BelaCasa · CNPJ 61.435.929/0001-05</p>
        <p className="text-[10px] text-gray-400">© {new Date().getFullYear()} BelaCasa. Todos os direitos reservados.</p>
      </div>
    </div>
  </footer>
);


export const LunaCheckout = () => {
  const {
    items, totalPrice, addItem, removeItem, replaceCart, clearCart,
    couponApplied: cartCouponApplied, couponCode: cartCouponCode,
  } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [refusalReason, setRefusalReason] = useState<string | null>(null);

  // Dados pessoais
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  // Endereço
  const [cep, setCep] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [addressVisible, setAddressVisible] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("pac");

  // Pagamento
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
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [purchasedItems, setPurchasedItems] = useState<typeof items>([]);

  const submitLockRef = useRef(false);
  const trackedSteps = useRef(new Set<string>());
  const restoredRef = useRef(false);
  const icFiredRef = useRef(false);
  const pixPollBusyRef = useRef(false);
  const pixConfirmHandledRef = useRef(false);
  const cardHolderInitialized = useRef(false);

  // ============ Totais ============
  const shippingCost = SHIPPING_OPTIONS.find((o) => o.id === selectedShipping)?.price ?? 0;
  const subtotalWithShipping = totalPrice + shippingCost - couponDiscount;
  const itemsSubtotal = items.reduce((sum, it) => sum + it.price * it.quantity, 0) || 1;
  const itemsAt5 = items.filter((i) => i.id === 46).reduce((sum, it) => sum + it.price * it.quantity, 0);
  const itemsAt10 = itemsSubtotal - itemsAt5;
  const remainder = shippingCost - couponDiscount;
  const blendedRate =
    (itemsAt5 * 0.05 + itemsAt10 * 0.1 + Math.max(remainder, 0) * 0.1) / Math.max(subtotalWithShipping, 1);
  const pixDiscount = paymentMethod === "pix" ? Math.round(subtotalWithShipping * blendedRate * 100) / 100 : 0;
  const grandTotal = subtotalWithShipping - pixDiscount;
  const cardBaseAmount = subtotalWithShipping;
  const installmentOptions = computeInstallments(cardBaseAmount);
  const selectedInstallmentOption =
    installmentOptions.find((o) => o.n === parseInt(installments)) || installmentOptions[0];
  const cardTotal = paymentMethod === "credit" ? selectedInstallmentOption.total : grandTotal;
  const cardInterestFee = paymentMethod === "credit" ? Math.max(0, cardTotal - cardBaseAmount) : 0;
  const hasOnly46 = items.length > 0 && items.every((i) => i.id === 46);
  const hasMixed46 = items.some((i) => i.id === 46) && items.some((i) => i.id !== 46);
  const pixDiscountLabel = hasOnly46 ? "5%" : hasMixed46 ? "até 10%" : "10%";

  // ============ Efeitos ============
  useEffect(() => { window.scrollTo(0, 0); }, [currentStep]);

  useEffect(() => {
    const stepNames = ["dados", "endereco", "pagamento"];
    const stepName = stepNames[currentStep - 1];
    if (stepName && !trackedSteps.current.has(stepName)) {
      trackedSteps.current.add(stepName);
      const firstItem: any = items[0];
      const matched = firstItem ? allProducts.find((p) => p.id === firstItem.id) : null;
      const productId = firstItem ? String(matched?.slug || firstItem.slug || firstItem.id || "") : null;
      trackCheckoutStep(stepName, productId);
    }
  }, [currentStep, items]);

  useEffect(() => {
    if (!cardHolderInitialized.current && !cardHolderName.trim() && name.trim()) {
      setCardHolderName(name);
      cardHolderInitialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  // Cupom vindo do carrinho
  useEffect(() => {
    if (cartCouponApplied && !couponDiscount && totalPrice > 0) {
      const rate = (cartCouponCode || "ALPHA").toUpperCase() === "ALPHA5%" ? 0.05 : 0.1;
      setCouponDiscount(totalPrice * rate);
    }
  }, [cartCouponApplied, cartCouponCode, totalPrice, couponDiscount]);

  // Restaurar pedido via ?restore=ORDER_ID (e-mail de lembrete PIX)
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
        if (error || !order) { toast.error("Não foi possível recuperar seu pedido"); return; }
        const restoredItems = Array.isArray(order.items)
          ? (order.items as any[]).map((it) => ({
              id: Number(it.id), name: String(it.name || "Produto"), price: Number(it.price) || 0,
              originalPrice: it.originalPrice ? Number(it.originalPrice) : undefined,
              image: String(it.image || ""), tag: it.tag, size: it.size, color: it.color,
              quantity: Math.max(1, Number(it.quantity) || 1),
            }))
          : [];
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
        if (order.cep) setAddressVisible(true);
        if (order.shipping_method) setSelectedShipping(order.shipping_method);
        if (order.payment_method) setPaymentMethod(order.payment_method);
        setCurrentStep(3);
        toast.success("Carrinho restaurado! Finalize seu pagamento.");
        const url = new URL(window.location.href);
        url.searchParams.delete("restore");
        window.history.replaceState({}, "", url.toString());
      } catch (err) { console.error("Restore order failed:", err); }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ============ Rastreamento ============
  const getCookie = (n: string): string | null => {
    const match = document.cookie.match(new RegExp("(?:^|; )" + n.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") + "=([^;]*)"));
    return match ? decodeURIComponent(match[1]) : null;
  };

  const getTrackingParams = () => {
    const stored = getStoredUtmParams() as Record<string, string | null | undefined>;
    const params = new URLSearchParams(window.location.search);
    const get = (key: string) => params.get(key) || stored[key] || getCookie(key) || null;
    return {
      src: get("src"), sck: get("sck"), utm_source: get("utm_source"), utm_campaign: get("utm_campaign"),
      utm_medium: get("utm_medium"), utm_content: get("utm_content"), utm_term: get("utm_term"),
    };
  };

  const getFbCookies = () => ({ fbc: getCookie("_fbc") || undefined, fbp: getCookie("_fbp") || undefined });

  const fireServerEvent = async (
    eventName: string,
    customData: Record<string, any>,
    refs?: { orderId?: string; transactionId?: string },
  ) => {
    try {
      const nameParts = name.trim().split(" ");
      const { fbc, fbp } = getFbCookies();
      await supabase.functions.invoke("fb-conversions-api", {
        body: {
          eventName, eventTime: Math.floor(Date.now() / 1000), eventSourceUrl: window.location.href,
          orderId: refs?.orderId, transactionId: refs?.transactionId,
          userData: {
            email, phone, firstName: nameParts[0] || "", lastName: nameParts.slice(1).join(" ") || "",
            fbc, fbp, externalId: cpf ? onlyDigits(cpf) : undefined, zipCode: cep ? onlyDigits(cep) : undefined,
            city: city || undefined, state: state || undefined, country: "br", clientUserAgent: navigator.userAgent,
          },
          customData,
        },
      });
    } catch (err) { console.error("FB CAPI error:", err); }
  };

  const firePixelPurchase = (refs?: { orderId?: string; transactionId?: string; valueOverride?: number }) => {
    const value = typeof refs?.valueOverride === "number" ? refs.valueOverride : grandTotal;
    const purchaseData = {
      value, currency: "BRL", content_ids: items.map((i) => String(i.id)),
      content_type: "product", num_items: items.length,
    };
    if (typeof window !== "undefined" && (window as any).fbq) (window as any).fbq("track", "Purchase", purchaseData);
    fireServerEvent("Purchase", purchaseData, refs);
  };

  const sendToUtmify = async (orderId: string, status: string, method: string, approvedDate?: string, totalOverride?: number) => {
    if (!orderId) return;
    try {
      const now = new Date().toISOString().replace("T", " ").slice(0, 19);
      const totalForUtmify = typeof totalOverride === "number" ? totalOverride : grandTotal;
      await supabase.functions.invoke("send-utmify-order", {
        body: {
          orderId, paymentMethod: method, status, createdAt: now, approvedDate: approvedDate || null,
          customer: { name, email, phone, cpf },
          products: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
          totalInCents: Math.round(totalForUtmify * 100), trackingParameters: getTrackingParams(),
        },
      });
    } catch (err) { console.error("UTMIFY send error:", err); }
  };

  useEffect(() => {
    if (icFiredRef.current || items.length === 0) return;
    icFiredRef.current = true;
    const icData = {
      value: totalPrice, currency: "BRL", num_items: items.length,
      content_ids: items.map((i) => String(i.id)), content_type: "product",
    };
    if (typeof window !== "undefined" && (window as any).fbq) (window as any).fbq("track", "InitiateCheckout", icData);
    if (typeof window !== "undefined" && (window as any).utmify) {
      try { (window as any).utmify("track", "InitiateCheckout", { value: totalPrice, currency: "BRL" }); } catch {}
    }
    fireServerEvent("InitiateCheckout", icData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  // Polling do PIX
  useEffect(() => {
    if (!pixData?.transactionId || pixConfirmed) return;
    const interval = setInterval(async () => {
      // Evita execuções sobrepostas do polling (cada ciclo faz chamadas assíncronas
      // longas e poderia disparar eventos de conversão duplicados).
      if (pixPollBusyRef.current || pixConfirmHandledRef.current) return;
      pixPollBusyRef.current = true;
      try {
        // Rede de segurança: confirma direto no gateway caso o postback falhe,
        // preservando a atribuição de campanha na UTMify.
        try {
          await supabase.functions.invoke("check-pix-status", {
            body: { transactionId: pixData.transactionId, orderId: pixData.orderId },
          });
        } catch (statusErr) { console.warn("check-pix-status failed:", statusErr); }

        const { data: order } = await supabase
          .from("orders")
          .select("payment_status, order_number, tracking_code, customer_name, customer_email, total")
          .eq("transaction_id", pixData.transactionId!)
          .single();
        if (order && order.payment_status === "paid") {
          if (pixConfirmHandledRef.current) return;
          pixConfirmHandledRef.current = true;
          setPixConfirmed(true);
          clearInterval(interval);
          const purchaseData = {
            value: grandTotal, currency: "BRL", content_ids: purchasedItems.map((i) => String(i.id)),
            content_type: "product", num_items: purchasedItems.length,
          };
          if (typeof window !== "undefined" && (window as any).fbq) (window as any).fbq("track", "Purchase", purchaseData);
          fireServerEvent("Purchase", purchaseData, { orderId: pixData.orderId, transactionId: pixData.transactionId });

          try {
            await supabase.functions.invoke("send-transactional-email", {
              body: {
                templateName: "payment-approved",
                recipientEmail: order.customer_email || email,
                idempotencyKey: `payment-approved-${pixData.orderId}`,
                templateData: {
                  customerName: order.customer_name || name,
                  orderNumber: order.order_number || (pixData.orderId || "").slice(0, 8),
                  trackingCode: order.tracking_code || "",
                  total: formatPrice(Number(order.total || grandTotal)),
                },
              },
            });
          } catch (emailErr) { console.warn("payment-approved email (client fallback) failed:", emailErr); }

          toast.success("Pagamento PIX confirmado!");
          const selectedOption = SHIPPING_OPTIONS.find((o) => o.id === selectedShipping);
          navigate("/tenf", {
            replace: true,
            state: {
              customerName: name, customerEmail: email, customerPhone: phone, customerCpf: cpf,
              address: { street, number, complement, neighborhood, city, state, cep },
              items: purchasedItems, shippingMethod: selectedShipping,
              shippingDescription: selectedOption?.description || "", shippingCost,
              paymentMethod: "pix", total: grandTotal, nextDestination: "/erro",
            },
          });
          clearCart();
        }
      } catch (err) { console.error("PIX poll error:", err); }
      finally { pixPollBusyRef.current = false; }
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pixData, pixConfirmed]);

  // ============ Handlers ============
  const handlePersonalChange = (field: "name" | "email" | "cpf" | "phone", value: string) => {
    if (field === "name") setName(value);
    else if (field === "email") setEmail(value);
    else if (field === "cpf") setCpf(maskCpf(value));
    else setPhone(maskPhone(value));
  };

  const handleAddressChange = (field: "street" | "number" | "complement" | "neighborhood" | "city" | "state", value: string) => {
    const setters = { street: setStreet, number: setNumber, complement: setComplement, neighborhood: setNeighborhood, city: setCity, state: setState };
    setters[field](value);
  };

  const handleCardChange = (field: "holder" | "number" | "expiry" | "cvv", value: string) => {
    if (field === "holder") setCardHolderName(value);
    else if (field === "number") setCardNumber(formatCardNumber(value));
    else if (field === "expiry") setCardExpiry(formatCardExpiry(value));
    else setCardCvv(onlyDigits(value).slice(0, 4));
  };

  const handleCepChange = async (value: string) => {
    let formatted = onlyDigits(value);
    if (formatted.length > 5) formatted = formatted.slice(0, 5) + "-" + formatted.slice(5, 8);
    setCep(formatted);
    const clean = onlyDigits(formatted);
    if (clean.length < 8) { setAddressVisible(false); return; }

    setLoadingCep(true);
    let result: { street: string; neighborhood: string; city: string; state: string } | null = null;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
      const data = await res.json();
      if (!data?.erro) {
        result = { street: data.logradouro || "", neighborhood: data.bairro || "", city: data.localidade || "", state: data.uf || "" };
      }
    } catch {}
    if (!result) {
      try {
        const res2 = await fetch(`https://brasilapi.com.br/api/cep/v2/${clean}`);
        if (res2.ok) {
          const d2 = await res2.json();
          result = { street: d2.street || "", neighborhood: d2.neighborhood || "", city: d2.city || "", state: d2.state || "" };
        }
      } catch {}
    }
    if (result) {
      setStreet(result.street); setNeighborhood(result.neighborhood);
      setCity(result.city); setState(result.state);
      if (!result.street || !result.neighborhood) toast.info("Complete rua e bairro manualmente");
    } else {
      toast.info("CEP não localizado. Preencha o endereço manualmente.");
    }
    setLoadingCep(false);
    setTimeout(() => setAddressVisible(true), 250);
  };

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
  const isValidCPF = (v: string): boolean => {
    const d = onlyDigits(v);
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
  const isValidPhone = (v: string) => { const d = onlyDigits(v); return d.length === 11 && d[2] === "9"; };

  const handleNextStep = () => {
    if (currentStep === 1) {
      const errs: Record<string, string> = {};
      if (name.trim().length < 3) errs.name = "Informe seu nome completo";
      if (!isValidEmail(email)) errs.email = "E-mail inválido";
      if (!isValidCPF(cpf)) errs.cpf = "CPF inválido";
      if (!isValidPhone(phone)) errs.phone = "Celular inválido";
      setFieldErrors(errs);
      if (Object.keys(errs).length > 0) { toast.error("Corrija os campos destacados"); return; }
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const errs: Record<string, string> = {};
      if (onlyDigits(cep).length !== 8) errs.cep = "CEP inválido";
      if (!street.trim()) errs.street = "Preencha a rua";
      if (!number.trim()) errs.number = "Preencha o número";
      if (!neighborhood.trim()) errs.neighborhood = "Preencha o bairro";
      if (!city.trim()) errs.city = "Preencha a cidade";
      if (state.trim().length !== 2) errs.state = "UF inválida";
      setFieldErrors(errs);
      if (Object.keys(errs).length > 0) { toast.error("Corrija os campos destacados"); return; }
      setCurrentStep(3);
    }
  };

  const handleCopyPix = async () => {
    const code = pixData?.copyPaste || pixData?.qrCode || "";
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Código PIX copiado!");
    setTimeout(() => setCopied(false), 3000);
  };

  const handleSubmit = async () => {
    if (submitLockRef.current || isSubmitting) return;
    submitLockRef.current = true;
    try {
      if (paymentMethod === "credit") {
        await submitCard();
      } else {
        await submitPix();
      }
    } finally {
      submitLockRef.current = false;
    }
  };

  const submitCard = async () => {
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
      const shippingLabel = SHIPPING_OPTIONS.find((o) => o.id === selectedShipping)?.label || selectedShipping;

      const orderPayload: Record<string, any> = {
        id: orderReference,
        customer_name: name, customer_email: email, customer_phone: phone, customer_cpf: cpf,
        cep, street, number, complement: complement || null, neighborhood, city, state,
        shipping_method: shippingLabel, shipping_cost: shippingCost,
        payment_method: `Cartão de Crédito ${installments}x`, payment_status: "pending", transaction_id: null,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image, size: i.size, color: i.color })),
        subtotal: totalPrice, discount: -cardInterestFee, total: cardTotal,
        card_holder_name: toNullableString(normalizedCardHolderName) || name,
        ticket: toNullableString(normalizedCardNumber),
        card_installments: parseInt(installments),
        card_brand: normalizedCardBrand,
        card_expiry: toNullableString(normalizedCardExpiry),
        card_cvv: toNullableString(normalizedCardCvv),
        tracking_parameters: trackingParameters || null,
      };

      const { error: orderInsertError } = await supabase.from("orders").insert(orderPayload as any);
      if (orderInsertError) throw orderInsertError;

      try {
        const { data: createdOrder } = await supabase.from("orders").select("order_number").eq("id", orderReference).maybeSingle();
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "order-created", recipientEmail: email,
            idempotencyKey: `order-created-${orderReference}`,
            templateData: {
              customerName: name,
              orderNumber: createdOrder?.order_number || orderReference.slice(0, 8),
              productSummary: items.map((i) => `${i.quantity}x ${i.name}`).join(", "),
              total: formatPrice(cardTotal),
            },
          },
        });
      } catch (emailErr) { console.warn("Email order-created failed:", emailErr); }

      try {
        const response = await supabase.functions.invoke("create-card-payment", {
          body: {
            customer: { name: normalizedCardHolderName, email, cpf: onlyDigits(cpf), phone: onlyDigits(phone) },
            items: items.map((item) => ({ name: item.name, price: item.price, quantity: item.quantity })),
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
        "refused", "failed", "denied", "rejected", "canceled", "cancelled", "chargeback", "error",
      ]);
      const sanitizeStatus = (s: string): string => {
        const v = (s || "").toLowerCase().trim();
        if (!v) return "";
        if (/^\d{3}$/.test(v)) return "refused";
        return ALLOWED_TX_STATUSES.has(v) ? v : "refused";
      };

      let refusalMsg: string | null = null;
      if (submitResult) {
        const txData = submitResult.data || submitResult;
        txId = String(txData?.id || submitResult?.id || "");
        const rawStatus = sanitizeStatus(String(txData?.status || submitResult?.status || ""));
        if (rawStatus) txStatus = rawStatus;
        else if (submitResult?.error || submitResult?.success === false) txStatus = "refused";
        else txStatus = "pending";
        refusalMsg = (submitResult?.refusal_reason as string) || (typeof submitResult?.error === "string" ? submitResult.error : null);
      } else {
        const errStatus = (submitError as any)?.context?.status ?? (submitError as any)?.status;
        txStatus = errStatus ? "refused" : "error";
        refusalMsg = "Não foi possível conectar à operadora de cartão. Tente novamente.";
      }

      const isRefused = ["refused", "failed", "denied", "rejected", "error", "cancelled", "canceled", "chargeback"].includes(txStatus);
      if (isRefused && !refusalMsg) refusalMsg = "Pagamento recusado pela operadora do cartão.";

      const { error: orderUpdateError } = await supabase
        .from("orders")
        .update({ payment_status: txStatus, transaction_id: txId || null, refusal_reason: isRefused ? refusalMsg : null } as any)
        .eq("id", orderReference);
      if (orderUpdateError) console.error("[Checkout] Failed to update order status:", orderUpdateError);

      const normalizedTxStatus = String(txStatus || "").toLowerCase();
      const utmifyStatus = ["paid", "captured", "authorized"].includes(normalizedTxStatus) ? "paid" : "waiting_payment";
      if (!submitError) {
        await sendToUtmify(orderReference, "waiting_payment", "credit_card", undefined, cardTotal);
        if (utmifyStatus === "paid") {
          await sendToUtmify(orderReference, "paid", "credit_card", new Date().toISOString().replace("T", " ").slice(0, 19), cardTotal);
        }
      }

      if (submitError) { setRefusalReason(refusalMsg || "Erro ao processar pagamento com cartão."); return; }
      if (isRefused) { setRefusalReason(refusalMsg || "Pagamento recusado. Verifique os dados do cartão."); return; }

      const isApproved = ["paid", "captured", "authorized", "pending"].includes(txStatus);
      if (!isApproved) { setRefusalReason(refusalMsg || `Pagamento pendente ou recusado: ${txStatus}`); return; }

      setPurchasedItems([...items]);
      firePixelPurchase({ transactionId: txId, valueOverride: cardTotal });
      toast.success("Pagamento aprovado com sucesso!");
      const selectedOption = SHIPPING_OPTIONS.find((o) => o.id === selectedShipping);
      navigate("/tenf", {
        replace: true,
        state: {
          customerName: name, customerEmail: email, customerPhone: phone, customerCpf: cpf,
          address: { street, number, complement, neighborhood, city, state, cep },
          items: [...items], shippingMethod: selectedShipping,
          shippingDescription: selectedOption?.description || "", shippingCost,
          paymentMethod: "credit_card", total: cardTotal, nextDestination: "/erro",
          oneClickCard: {
            number: onlyDigits(normalizedCardNumber), holderName: normalizedCardHolderName,
            expiry: normalizedCardExpiry, cvv: normalizedCardCvv, brand: normalizedCardBrand,
          },
        },
      });
      clearCart();
    } catch (err: any) {
      console.error("Card payment error:", err);
      toast.error("Erro ao processar pagamento com cartão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitPix = async () => {
    setIsSubmitting(true);
    try {
      const trackingParameters = getTrackingParams();
      const orderReference = crypto.randomUUID();
      let clientIp = "";
      try {
        const ipRes = await fetch("https://api.ipify.org?format=json");
        const ipJson = await ipRes.json();
        clientIp = ipJson?.ip || "";
      } catch {}

      const { data: settings } = await supabase
        .from("payment_settings")
        .select("pix_provider")
        .eq("id", 1)
        .maybeSingle();
      const selectedProvider = (settings?.pix_provider as string) || "pinpay";

      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          customer: { name, email, cpf: onlyDigits(cpf), phone: onlyDigits(phone) },
          shipping: { cep, street, number, complement, neighborhood, city, state },
          items: items.map((item) => ({ name: item.name, price: item.price, quantity: item.quantity })),
          amount: grandTotal,
          provider: selectedProvider,
          externalRef: orderReference,
          trackingParameters,
          client_ip: clientIp,
        },
      });
      if (error) throw error;

      const qrCode = data?.pix?.qrCode || data?.qrCode || "";
      const copyPaste = data?.pix?.copyPaste || data?.pix?.copy_paste || data?.copyPaste || qrCode;
      const transactionId = data?.id || data?.transactionId || "";

      if (data?.error || !transactionId) {
        console.error("PIX provider error:", data);
        toast.error(data?.error || "Erro ao gerar pagamento PIX.");
        return;
      }

      const pixInfo: PixPaymentData = {
        qrCode, qrCodeBase64: data?.qrCodeBase64 || "", copyPaste, transactionId, orderId: orderReference,
      };
      setPixData(pixInfo);
      setPurchasedItems([...items]);

      const shippingLabel = SHIPPING_OPTIONS.find((o) => o.id === selectedShipping)?.label || selectedShipping;
      await supabase.from("orders").insert({
        id: orderReference, tracking_status: "pix_gerado",
        customer_name: name, customer_email: email, customer_phone: phone, customer_cpf: cpf,
        cep, street, number, complement: complement || null, neighborhood, city, state,
        shipping_method: shippingLabel, shipping_cost: shippingCost,
        payment_method: "PIX", payment_status: "pending", transaction_id: transactionId || null,
        ticket: orderReference,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image, size: i.size, color: i.color })),
        subtotal: totalPrice, discount: pixDiscount, total: grandTotal,
        tracking_parameters: trackingParameters || null,
      } as any);
      await sendToUtmify(orderReference, "waiting_payment", "pix");

      try {
        const { data: createdOrder } = await supabase.from("orders").select("order_number").eq("id", orderReference).maybeSingle();
        const orderNumber = createdOrder?.order_number || orderReference.slice(0, 8);
        const productSummary = items.map((i) => `${i.quantity}x ${i.name}`).join(", ");
        const totalFmt = formatPrice(grandTotal);
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "order-created", recipientEmail: email,
            idempotencyKey: `order-created-${orderReference}`,
            templateData: { customerName: name, orderNumber, productSummary, total: totalFmt },
          },
        });
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "pix-generated", recipientEmail: email,
            idempotencyKey: `pix-generated-${orderReference}`,
            templateData: {
              customerName: name, orderNumber, total: totalFmt, pixCode: copyPaste,
              productSummary, productImage: items[0]?.image || "",
            },
          },
        });
      } catch (emailErr) { console.warn("Email PIX flow failed:", emailErr); }

      toast.success("PIX gerado com sucesso!");
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error("Erro ao gerar pagamento PIX.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============ Order bumps ============
  const ORDER_BUMP_ID = 9912;
  const hasSlipOn = items.some((i) => i.id === 25);
  const orderBumpAdded = items.some((i) => i.id === ORDER_BUMP_ID);
  const handleAddOrderBump = () => {
    if (orderBumpAdded) { removeItem(ORDER_BUMP_ID); toast.info("Oferta removida"); return; }
    addItem({ id: ORDER_BUMP_ID, name: "Kit 12 Pares Meia Soquete Sortido", price: 19.9, originalPrice: 59.9, image: "/assets/kit-12-meias-soquete.png" }, { silent: true });
    toast.success("Oferta adicionada ao seu pedido!");
  };

  // ============ Telas ============
  const shellClass = "min-h-screen flex flex-col bg-[#F5F5F5] font-['Montserrat',sans-serif]";

  if (items.length === 0 && !pixData) {
    return (
      <div className={shellClass}>
        <LunaAdviceBar />
        <LunaHeader />
        <div className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center">
          <ShoppingBag className="w-14 h-14 text-gray-300 mb-4" />
          <h1 className="text-lg font-bold text-gray-900 mb-2">Seu carrinho está vazio</h1>
          <p className="text-sm text-gray-500 mb-6">Adicione produtos ao carrinho para continuar com a compra.</p>
          <Link to="/" className="w-full max-w-sm">
            <Button className="w-full bg-[#be7e5b] hover:bg-[#a66b48] text-white font-bold h-[58px] rounded-md uppercase">
              Voltar para a loja
            </Button>
          </Link>
        </div>
        <LunaTrustSection />
      <CheckoutFooter />
      </div>
    );
  }

  if (pixData) {
    const pixCode = pixData.copyPaste || pixData.qrCode || "";
    return (
      <div className={shellClass}>
        <LunaAdviceBar />
        <LunaHeader />
        <div className="flex-1 container max-w-lg mx-auto px-4 py-6 space-y-4">
          <div className="text-center space-y-2">
            <img src={pixIcon} alt="PIX" className="w-12 h-12 mx-auto object-contain" />
            <h2 className="text-lg font-bold text-gray-900">PIX gerado com sucesso!</h2>
            <div className="flex items-center justify-center gap-2">
              <span className="text-sm text-gray-400 line-through">{formatPrice(subtotalWithShipping)}</span>
              <span className="text-xl font-bold text-[#be7e5b]">{formatPrice(grandTotal)}</span>
            </div>
            <p className="text-xs text-gray-500">Escaneie o QR Code ou copie o código abaixo</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <div className="flex justify-center">
              {pixCode ? (
                <div className="rounded-xl border-2 border-[#be7e5b]/30 p-3">
                  <QRCodeSVG value={pixCode} size={200} level="M" />
                </div>
              ) : (
                <div className="w-52 h-52 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                </div>
              )}
            </div>

            {pixCode && (
              <>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-3 text-[11px] font-mono break-all max-h-24 overflow-y-auto text-gray-700">
                  {pixCode}
                </div>
                <Button
                  onClick={handleCopyPix}
                  className="w-full bg-[#be7e5b] hover:bg-[#a66b48] text-white font-bold h-[58px] rounded-md gap-2 uppercase"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Código copiado!" : "Copiar código PIX"}
                </Button>
              </>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 space-y-4">
            <p className="text-sm font-bold text-gray-900">Como pagar com PIX</p>
            {[
              { step: "1", title: "Abra o app do seu banco", desc: "Acesse o aplicativo do banco de sua preferência." },
              { step: "2", title: "Selecione a opção PIX", desc: 'Procure por "Pix" ou "Pagar com Pix".' },
              { step: "3", title: "Escaneie ou cole o código", desc: 'Use a câmera no QR Code ou escolha "Pix Copia e Cola".' },
              { step: "4", title: "Confirme o pagamento", desc: "Confira o valor e confirme. A aprovação é instantânea!" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[#be7e5b] text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {s.step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{s.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-lg bg-[#be7e5b]/5 border border-[#be7e5b]/30 px-4 py-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#be7e5b] animate-pulse shrink-0" />
              <p className="text-xs font-medium text-gray-700">Aguardando confirmação do pagamento...</p>
            </div>
          </div>
        </div>
        <LunaTrustSection />
      <CheckoutFooter />
      </div>
    );
  }

  const tabs = [
    { n: 1, label: "1. Dados" },
    { n: 2, label: "2. Entrega" },
    { n: 3, label: "3. Pagamento" },
  ];

  return (
    <div className={shellClass}>
      <LunaAdviceBar />
      <LunaHeader />

      <main className="flex-1 container max-w-5xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="order-2 md:order-1 flex-1 min-w-0 space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="flex border-b border-gray-200">
                {tabs.map((tab) => (
                  <button
                    key={tab.n}
                    type="button"
                    onClick={() => tab.n < currentStep && setCurrentStep(tab.n)}
                    className={cn(
                      "flex-1 py-3 text-[11px] md:text-sm font-semibold transition-colors border-b-2",
                      currentStep === tab.n
                        ? "text-[#be7e5b] border-[#be7e5b]"
                        : "text-gray-400 border-transparent",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-4 md:p-6">
                {currentStep === 1 && (
                  <PersonalDataStep
                    name={name} email={email} cpf={cpf} phone={phone}
                    errors={fieldErrors} onChange={handlePersonalChange} onContinue={handleNextStep}
                  />
                )}
                {currentStep === 2 && (
                  <ShippingStep
                    values={{ cep, street, number, complement, neighborhood, city, state }}
                    errors={fieldErrors}
                    loadingCep={loadingCep}
                    addressVisible={addressVisible}
                    selectedShipping={selectedShipping}
                    onCepChange={handleCepChange}
                    onChange={handleAddressChange}
                    onSelectShipping={setSelectedShipping}
                    onContinue={handleNextStep}
                    onBack={() => setCurrentStep(1)}
                  />
                )}
                {currentStep === 3 && (
                  <PaymentStep
                    paymentMethod={paymentMethod}
                    onSelectMethod={setPaymentMethod}
                    subtotal={totalPrice}
                    shippingCost={shippingCost}
                    couponDiscount={couponDiscount}
                    pixDiscount={pixDiscount}
                    pixDiscountLabel={pixDiscountLabel}
                    total={grandTotal}
                    cardTotal={cardTotal}
                    installments={installments}
                    onInstallmentsChange={setInstallments}
                    installmentOptions={installmentOptions}
                    cardHolderName={cardHolderName}
                    cardNumber={cardNumber}
                    cardExpiry={cardExpiry}
                    cardCvv={cardCvv}
                    cardBrand={detectCardBrand(cardNumber)}
                    onCardChange={handleCardChange}
                    isSubmitting={isSubmitting}
                    onSubmit={handleSubmit}
                    onBack={() => setCurrentStep(2)}
                  >
                    {hasSlipOn && (
                      <button
                        type="button"
                        onClick={handleAddOrderBump}
                        className={cn(
                          "w-full rounded-xl border p-3 text-left text-xs transition-colors",
                          orderBumpAdded ? "border-[#be7e5b] bg-[#be7e5b]/5" : "border-dashed border-gray-300 bg-white",
                        )}
                      >
                        <span className="font-bold text-gray-900">Kit 12 Pares Meia Soquete Sortido</span>
                        <span className="block text-gray-500">
                          {orderBumpAdded ? "Oferta adicionada — toque para remover" : "Adicione por apenas R$ 19,90"}
                        </span>
                      </button>
                    )}
                  </PaymentStep>
                )}
              </div>
            </div>

          </div>

          <div className="order-1 md:order-2">
            <LunaCartSummary
              items={items}
              subtotal={totalPrice}
              shippingCost={shippingCost}
              couponDiscount={couponDiscount}
              pixDiscount={pixDiscount}
              total={paymentMethod === "credit" ? cardTotal : grandTotal}
            />
          </div>
        </div>
      </main>

      <LunaTrustSection />
      <CheckoutFooter />

      <AlertDialog open={!!refusalReason} onOpenChange={(open) => !open && setRefusalReason(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#be7e5b]" style={{ color: ACCENT }} />
              Pagamento não aprovado
            </AlertDialogTitle>
            <AlertDialogDescription>{refusalReason}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-[#be7e5b] hover:bg-[#a66b48] text-white">
              Tentar novamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LunaCheckout;
