// Parcelamento: 1-3x sem juros; 4-12x com juros compostos de 2,99% a.m.
export const INTEREST_RATE = 0.0299;
export const INTEREST_FREE_UP_TO = 3;
export const MAX_INSTALLMENTS = 12;

export interface InstallmentOption {
  n: number;
  installmentValue: number;
  total: number;
  hasInterest: boolean;
}

export function computeInstallments(amount: number): InstallmentOption[] {
  const opts: InstallmentOption[] = [];
  for (let n = 1; n <= MAX_INSTALLMENTS; n++) {
    if (n <= INTEREST_FREE_UP_TO) {
      opts.push({ n, installmentValue: amount / n, total: amount, hasInterest: false });
    } else {
      // PMT = PV * i / (1 - (1+i)^-n)
      const i = INTEREST_RATE;
      const pmt = (amount * i) / (1 - Math.pow(1 + i, -n));
      const total = pmt * n;
      opts.push({ n, installmentValue: pmt, total, hasInterest: true });
    }
  }
  return opts;
}

export const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
