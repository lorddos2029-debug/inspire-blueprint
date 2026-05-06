import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface PersonalDataStepProps {
  onNext: () => void;
}

const formatCPF = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const isValidCPF = (cpf: string): boolean => {
  const digits = cpf.replace(/\D/g, "");
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(digits[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(digits[10]);
};

const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
};

const isValidPhone = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 11 && digits[2] === "9";
};

const PersonalDataStep = ({ onNext }: PersonalDataStepProps) => {
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!isValidEmail(email)) {
      newErrors.email = "Digite um e-mail válido";
    }
    if (!isValidCPF(cpf)) {
      newErrors.cpf = "CPF inválido";
    }
    if (!isValidPhone(phone)) {
      newErrors.phone = "Celular inválido (DDD + 9 dígitos)";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">Dados Pessoais</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome Completo</Label>
          <Input id="name" name="name" required placeholder="Seu nome" maxLength={100} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            placeholder="seu@email.com"
            maxLength={255}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
            }}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cpf">CPF</Label>
          <Input
            id="cpf"
            name="cpf"
            required
            placeholder="000.000.000-00"
            inputMode="numeric"
            value={cpf}
            onChange={(e) => {
              setCpf(formatCPF(e.target.value));
              if (errors.cpf) setErrors((prev) => ({ ...prev, cpf: "" }));
            }}
          />
          {errors.cpf && <p className="text-xs text-destructive">{errors.cpf}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Celular</Label>
          <Input
            id="phone"
            name="phone"
            required
            placeholder="(00) 00000-0000"
            inputMode="numeric"
            value={phone}
            onChange={(e) => {
              setPhone(formatPhone(e.target.value));
              if (errors.phone) setErrors((prev) => ({ ...prev, phone: "" }));
            }}
          />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
        </div>
      </div>
      <Button type="submit" size="lg" className="w-full">
        CONTINUAR PARA ENTREGA
      </Button>
    </form>
  );
};

export default PersonalDataStep;
