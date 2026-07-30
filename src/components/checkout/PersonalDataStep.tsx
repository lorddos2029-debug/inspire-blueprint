import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import SslNote from "./luna/SslNote";

export interface PersonalDataStepProps {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  errors: Record<string, string>;
  onChange: (field: "name" | "email" | "cpf" | "phone", value: string) => void;
  onContinue: () => void;
}

const fieldClass = (hasError: boolean) =>
  cn(
    "h-12 rounded-md border-gray-300 bg-white text-sm focus-visible:ring-[#be7e5b] focus-visible:border-[#be7e5b]",
    hasError && "border-red-500",
  );

const labelClass = "text-[10px] font-semibold uppercase tracking-wide text-gray-500";

export const PersonalDataStep = ({
  name,
  email,
  cpf,
  phone,
  errors,
  onChange,
  onContinue,
}: PersonalDataStepProps) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-[#be7e5b]" />
        <h2 className="text-sm font-bold text-gray-900">Seus dados</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <label className={labelClass} htmlFor="luna-name">Nome completo</label>
          <Input
            id="luna-name"
            autoComplete="off"
            placeholder="Digite seu nome completo"
            value={name}
            onChange={(e) => onChange("name", e.target.value)}
            className={fieldClass(!!errors.name)}
          />
          {errors.name && <p className="text-[10px] text-red-500">{errors.name}</p>}
        </div>

        <div className="space-y-1">
          <label className={labelClass} htmlFor="luna-email">E-mail</label>
          <Input
            id="luna-email"
            type="email"
            inputMode="email"
            autoComplete="off"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => onChange("email", e.target.value)}
            className={fieldClass(!!errors.email)}
          />
          {errors.email && <p className="text-[10px] text-red-500">{errors.email}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className={labelClass} htmlFor="luna-cpf">CPF</label>
            <Input
              id="luna-cpf"
              inputMode="numeric"
              autoComplete="off"
              placeholder="000.000.000-00"
              value={cpf}
              onChange={(e) => onChange("cpf", e.target.value)}
              className={fieldClass(!!errors.cpf)}
            />
            {errors.cpf && <p className="text-[10px] text-red-500">{errors.cpf}</p>}
          </div>
          <div className="space-y-1">
            <label className={labelClass} htmlFor="luna-phone">Celular</label>
            <Input
              id="luna-phone"
              inputMode="tel"
              autoComplete="off"
              placeholder="(00) 00000-0000"
              value={phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className={fieldClass(!!errors.phone)}
            />
            {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={onContinue}
        className="w-full bg-[#be7e5b] hover:bg-[#a66b48] text-white font-bold h-[58px] md:h-[68px] text-base md:text-lg rounded-md uppercase"
      >
        Continuar para entrega
      </Button>

      <SslNote />
    </div>
  );
};

export default PersonalDataStep;
