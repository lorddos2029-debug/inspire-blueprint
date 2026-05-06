import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Zap, Package, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ShippingStepProps {
  onNext: (shippingCost: number) => void;
  onBack: () => void;
}

const shippingOptions = [
  {
    id: "pac",
    label: "PAC",
    description: "2 a 6 dias úteis",
    price: 0,
    icon: Package,
  },
  {
    id: "sedex",
    label: "SEDEX",
    description: "1 a 3 dias úteis",
    price: 15.23,
    icon: Zap,
  },
];

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const ShippingStep = ({ onNext, onBack }: ShippingStepProps) => {
  const [selectedShipping, setSelectedShipping] = useState("free");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [loadingCep, setLoadingCep] = useState(false);
  const [cepLookupDone, setCepLookupDone] = useState(false);

  const fetchFromViaCep = async (cep: string) => {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!res.ok) throw new Error("viacep_http");
    const data = await res.json();
    if (data.erro) throw new Error("viacep_not_found");
    return {
      street: data.logradouro || "",
      city: data.localidade || "",
      state: data.uf || "",
      neighborhood: data.bairro || "",
    };
  };

  const fetchFromBrasilApi = async (cep: string) => {
    const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${cep}`);
    if (!res.ok) throw new Error("brasilapi_http");
    const data = await res.json();
    return {
      street: data.street || "",
      city: data.city || "",
      state: data.state || "",
      neighborhood: data.neighborhood || "",
    };
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 5) value = value.slice(0, 5) + "-" + value.slice(5, 8);
    e.target.value = value;

    const cleanCep = value.replace(/\D/g, "");
    if (cleanCep.length !== 8) {
      setCepLookupDone(false);
      return;
    }

    setLoadingCep(true);
    let result: { street: string; city: string; state: string; neighborhood: string } | null = null;

    try {
      result = await fetchFromViaCep(cleanCep);
    } catch {
      try {
        result = await fetchFromBrasilApi(cleanCep);
      } catch {
        result = null;
      }
    }

    if (result) {
      setStreet(result.street);
      setCity(result.city);
      setState(result.state);
      setNeighborhood(result.neighborhood);
      if (!result.street || !result.neighborhood) {
        toast.info("Preencha rua e bairro manualmente");
      }
    } else {
      toast.info("CEP não localizado. Preencha o endereço manualmente.");
    }
    setCepLookupDone(true);
    setLoadingCep(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const option = shippingOptions.find((o) => o.id === selectedShipping);
    onNext(option?.price ?? 0);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Endereço de Entrega</h2>
      {cepLookupDone && (!street || !neighborhood) && (
        <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
          Não conseguimos preencher todos os campos automaticamente. Complete <strong className="text-foreground">rua</strong> e <strong className="text-foreground">bairro</strong> manualmente abaixo.
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cep">CEP</Label>
          <div className="relative">
            <Input id="cep" name="cep" required placeholder="00000-000" maxLength={9} onChange={handleCepChange} />
            {loadingCep && <Loader2 className="w-4 h-4 animate-spin absolute right-3 top-3 text-muted-foreground" />}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input id="street" name="street" required placeholder="Nome da rua" value={street} onChange={(e) => setStreet(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="neighborhood">Bairro</Label>
          <Input id="neighborhood" name="neighborhood" required placeholder="Bairro" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="number">Número</Label>
          <Input id="number" name="number" required placeholder="123" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="complement">Complemento</Label>
          <Input id="complement" name="complement" placeholder="Apto, Bloco..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input id="city" name="city" required placeholder="Sua cidade" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input id="state" name="state" required placeholder="SP" maxLength={2} value={state} onChange={(e) => setState(e.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Opção de Frete</h3>
        <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="space-y-3">
          {shippingOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedShipping === option.id;
            return (
              <label
                key={option.id}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                  isSelected ? "border-primary bg-accent" : "border-border hover:bg-accent/50"
                )}
              >
                <RadioGroupItem value={option.id} />
                <Icon className="w-5 h-5 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                <span className={cn("text-sm font-bold", option.price === 0 ? "text-green-600" : "text-foreground")}>
                  {option.price === 0 ? "Grátis" : formatPrice(option.price)}
                </span>
              </label>
            );
          })}
        </RadioGroup>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
        <Button type="submit" size="lg" className="flex-1">
          CONTINUAR PARA PAGAMENTO
        </Button>
      </div>
    </form>
  );
};

export default ShippingStep;
