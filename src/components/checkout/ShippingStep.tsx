import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Loader2, MapPin, Package, Zap } from "lucide-react";

export interface ShippingAddressFields {
  cep: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ShippingStepProps {
  values: ShippingAddressFields;
  errors: Record<string, string>;
  loadingCep: boolean;
  addressVisible: boolean;
  selectedShipping: string;
  onCepChange: (value: string) => void;
  onChange: (field: keyof Omit<ShippingAddressFields, "cep">, value: string) => void;
  onSelectShipping: (id: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

export const SHIPPING_OPTIONS = [
  { id: "pac", label: "PAC", description: "2 a 6 dias úteis", price: 0, icon: Package },
  { id: "sedex", label: "SEDEX", description: "1 a 3 dias úteis", price: 15.23, icon: Zap },
];

const labelClass = "text-[10px] font-semibold uppercase tracking-wide text-gray-500";
const compactField = (hasError?: boolean) =>
  cn(
    "h-9 rounded-md border-gray-300 bg-white text-sm focus-visible:ring-[#be7e5b] focus-visible:border-[#be7e5b]",
    hasError && "border-red-500",
  );

export const ShippingStep = ({
  values,
  errors,
  loadingCep,
  addressVisible,
  selectedShipping,
  onCepChange,
  onChange,
  onSelectShipping,
  onContinue,
  onBack,
}: ShippingStepProps) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#be7e5b]" />
        <h2 className="text-sm font-bold text-gray-900">Endereço de entrega</h2>
      </div>

      {/* CEP — único campo visível antes da busca */}
      <div className="space-y-1">
        <label className={labelClass} htmlFor="luna-cep">CEP</label>
        <div className="relative">
          <Input
            id="luna-cep"
            inputMode="numeric"
            autoComplete="off"
            placeholder="00000-000"
            value={values.cep}
            onChange={(e) => onCepChange(e.target.value)}
            className={cn(
              "h-12 rounded-md border-2 border-[#be7e5b] bg-white text-sm focus-visible:ring-[#be7e5b]",
              errors.cep && "border-red-500",
            )}
          />
          {loadingCep && (
            <Loader2 className="w-4 h-4 animate-spin text-[#be7e5b] absolute right-3 top-1/2 -translate-y-1/2" />
          )}
        </div>
        {errors.cep && <p className="text-[10px] text-red-500">{errors.cep}</p>}
        {!addressVisible && !loadingCep && (
          <p className="text-[10px] text-gray-500">Digite seu CEP para calcular o frete e completar o endereço.</p>
        )}
      </div>

      {addressVisible && (
        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 space-y-1">
              <label className={labelClass}>Rua</label>
              <Input autoComplete="off" value={values.street} onChange={(e) => onChange("street", e.target.value)} className={compactField(!!errors.street)} />
              {errors.street && <p className="text-[10px] text-red-500">{errors.street}</p>}
            </div>
            <div className="col-span-7 space-y-1">
              <label className={labelClass}>Bairro</label>
              <Input autoComplete="off" value={values.neighborhood} onChange={(e) => onChange("neighborhood", e.target.value)} className={compactField(!!errors.neighborhood)} />
              {errors.neighborhood && <p className="text-[10px] text-red-500">{errors.neighborhood}</p>}
            </div>
            <div className="col-span-5 space-y-1">
              <label className={labelClass}>Número</label>
              <Input autoComplete="off" inputMode="numeric" value={values.number} onChange={(e) => onChange("number", e.target.value)} className={compactField(!!errors.number)} />
              {errors.number && <p className="text-[10px] text-red-500">{errors.number}</p>}
            </div>
            <div className="col-span-12 space-y-1">
              <label className={labelClass}>Complemento</label>
              <Input autoComplete="off" placeholder="Opcional" value={values.complement} onChange={(e) => onChange("complement", e.target.value)} className={compactField()} />
            </div>
            <div className="col-span-9 space-y-1">
              <label className={labelClass}>Cidade</label>
              <Input autoComplete="off" value={values.city} onChange={(e) => onChange("city", e.target.value)} className={compactField(!!errors.city)} />
              {errors.city && <p className="text-[10px] text-red-500">{errors.city}</p>}
            </div>
            <div className="col-span-3 space-y-1">
              <label className={labelClass}>UF</label>
              <Input autoComplete="off" maxLength={2} value={values.state} onChange={(e) => onChange("state", e.target.value.toUpperCase())} className={compactField(!!errors.state)} />
              {errors.state && <p className="text-[10px] text-red-500">{errors.state}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">Opção de frete</p>
            {SHIPPING_OPTIONS.map((option) => {
              const Icon = option.icon;
              const active = selectedShipping === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onSelectShipping(option.id)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-xl border p-3 text-left transition-colors",
                    active ? "border-[#be7e5b] bg-[#be7e5b]/5" : "border-gray-200 bg-white hover:border-gray-300",
                  )}
                >
                  <span
                    className={cn(
                      "w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0",
                      active ? "border-[#be7e5b]" : "border-gray-300",
                    )}
                  >
                    {active && <span className="w-2 h-2 rounded-full bg-[#be7e5b]" />}
                  </span>
                  <Icon className={cn("w-4 h-4", active ? "text-[#be7e5b]" : "text-gray-400")} />
                  <span className="flex-1 min-w-0">
                    <span className="block text-xs font-bold text-gray-900">{option.label}</span>
                    <span className="block text-[10px] text-gray-500">{option.description}</span>
                  </span>
                  <span className={cn("text-xs font-bold", option.price === 0 ? "text-green-600" : "text-gray-900")}>
                    {option.price === 0
                      ? "Grátis"
                      : option.price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <Button
        type="button"
        onClick={onContinue}
        className="w-full bg-[#be7e5b] hover:bg-[#a66b48] text-white font-bold h-[58px] md:h-[68px] text-base md:text-lg rounded-md uppercase"
      >
        Continuar para pagamento
      </Button>

      <button type="button" onClick={onBack} className="w-full text-xs text-gray-500 hover:text-[#be7e5b] transition-colors">
        Voltar
      </button>
    </div>
  );
};

export default ShippingStep;
