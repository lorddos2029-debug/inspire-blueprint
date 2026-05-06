import { useLocation, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Package, User, Mail, Phone, MapPin, CreditCard, ShoppingBag, Inbox, AlertCircle } from "lucide-react";
import logo from "@/assets/logo-new.png";

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface OrderData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerCpf: string;
  address: {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
  items: {
    id: number;
    name: string;
    price: number;
    image: string;
    size?: string;
    color?: string;
    quantity: number;
  }[];
  shippingMethod: string;
  shippingDescription: string;
  shippingCost: number;
  paymentMethod: string;
  total: number;
}

const Obrigado = () => {
  const location = useLocation();
  const order = location.state as OrderData | undefined;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col">
      {/* Header */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container flex items-center justify-center">
          <img src={logo} alt="Logo" className="h-8 w-auto object-contain brightness-0 invert" />
        </div>
      </div>

      <div className="flex-1 container py-8 max-w-lg mx-auto px-4 space-y-5">
        {/* Success Badge */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Compra Aprovada!</h1>
          <p className="text-sm text-muted-foreground">
            Obrigado pela sua compra, <strong className="text-foreground">{order.customerName.split(" ")[0]}</strong>! 🎉
          </p>
        </div>

        {/* Delivery Estimate */}
        <div className="bg-primary text-primary-foreground rounded-2xl p-5 text-center space-y-2">
          <Package className="w-6 h-6 mx-auto" />
          <p className="text-sm font-medium">Previsão de Entrega</p>
          <p className="text-lg font-bold">{order.shippingDescription}</p>
          <p className="text-xs opacity-80">
            {order.shippingMethod === "free" ? "Frete Econômico — Grátis" : `Frete Expresso — ${formatPrice(order.shippingCost)}`}
          </p>
        </div>

        {/* Products */}
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Seus Produtos</span>
          </div>
          <div className="p-4 space-y-3">
            {order.items.map((item, idx) => (
              <div key={`${item.id}-${item.size || ""}-${idx}`} className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg bg-secondary" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground line-clamp-2">{item.name}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mt-0.5">
                    {item.size && <span>Tam: {item.size}</span>}
                    {item.color && <span>Cor: {item.color}</span>}
                    <span>Qtd: {item.quantity}</span>
                  </div>
                </div>
                <p className="text-sm font-bold text-foreground whitespace-nowrap">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="px-5 py-3 border-t border-border flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Total Pago</span>
            <span className="text-lg font-bold text-foreground">{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-background rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3 border-b border-border flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Dados do Cliente</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <User className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{order.customerName}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{order.customerEmail}</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">{order.customerPhone}</span>
            </div>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-foreground">
                {order.address.street}, {order.address.number}
                {order.address.complement ? ` — ${order.address.complement}` : ""}
                <br />
                {order.address.neighborhood}, {order.address.city} — {order.address.state}
                <br />
                CEP: {order.address.cep}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CreditCard className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="text-foreground">
                {order.paymentMethod === "pix" ? "PIX" : "Cartão de Crédito"}
              </span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-1">
          <p className="text-sm font-medium text-emerald-800">📦 Seu pedido está sendo preparado!</p>
          <p className="text-xs text-emerald-700">
            Enviamos os detalhes da compra para <strong>{order.customerEmail}</strong>
          </p>
        </div>

        {/* Email Alert — verificar caixa de entrada e spam */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-amber-700 shrink-0" />
            <p className="text-sm font-bold text-amber-900">Importante: acompanhe seu pedido por e-mail</p>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Acabamos de enviar a confirmação e o link de rastreio para{" "}
            <strong className="break-all">{order.customerEmail}</strong>. Acesse seu e-mail
            para acompanhar todas as atualizações do pedido.
          </p>
          <div className="flex items-start gap-2 bg-amber-100/70 rounded-lg p-2.5 mt-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-900 leading-relaxed">
              <strong>Não encontrou o e-mail?</strong> Verifique sua caixa de <strong>Spam</strong>,
              <strong> Lixo Eletrônico</strong> ou <strong>Promoções</strong> e marque como
              "não é spam" para receber as próximas atualizações.
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link to="/">
          <Button className="w-full h-12 rounded-xl text-sm font-semibold gap-2">
            <ShoppingBag className="w-4 h-4" />
            Continuar Comprando
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Obrigado;
