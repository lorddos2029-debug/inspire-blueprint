import { ShieldCheck } from "lucide-react";

/**
 * Aviso de criptografia exibido logo abaixo dos botões de avanço do checkout.
 */
export const SslNote = () => (
  <p className="flex items-start justify-center gap-2 text-xs text-gray-500">
    <ShieldCheck className="w-4 h-4 text-green-600 shrink-0 mt-[1px]" aria-hidden="true" />
    <span>Seus dados estão protegidos com criptografia SSL</span>
  </p>
);

export default SslNote;
