import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { QrCode, Loader2, Check, FlaskConical, Copy } from "lucide-react";
import { toast } from "sonner";
import { products } from "@/data/products";

type Provider = "primecash" | "payout" | "vumepay";

const PROVIDERS: { id: Provider; name: string; host: string; description: string }[] = [
  { id: "primecash", name: "PrimeCash", host: "api.primecashbrasil.com", description: "Adquirente principal" },
  { id: "payout", name: "Payout", host: "api.payoutbr.com.br", description: "Adquirente Payout" },
  { id: "vumepay", name: "VumePay", host: "api.vumepay.com.br", description: "Adquirente VumePay" },
];

const normalizeProvider = (p?: string | null): Provider => {
  if (p === "payout") return "payout";
  if (p === "vumepay") return "vumepay";
  return "primecash";
};

const PixProviderSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [current, setCurrent] = useState<Provider>("primecash");

  // Test PIX state
  const [testProductId, setTestProductId] = useState<number>(products[0]?.id ?? 1);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<null | {
    ok: boolean;
    provider?: string;
    qrCode?: string;
    qrCodeBase64?: string;
    transactionId?: string;
    error?: string;
    rawStatus?: number | string;
    rawMessage?: string;
  }>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("payment_settings").select("pix_provider").eq("id", 1).maybeSingle();
      setCurrent(normalizeProvider(data?.pix_provider as string));
      setLoading(false);
    })();
  }, []);

  const handleSelect = async (provider: Provider) => {
    if (saving || provider === current) return;
    setSaving(true);
    const { error } = await supabase
      .from("payment_settings")
      .upsert({ id: 1, pix_provider: provider, updated_at: new Date().toISOString() }, { onConflict: "id" });
    setSaving(false);
    if (error) {
      console.error("payment_settings upsert error:", error);
      toast.error(`Erro ao salvar adquirente: ${error.message}`);
      return;
    }
    // Confirma lendo do banco
    const { data: check } = await supabase.from("payment_settings").select("pix_provider").eq("id", 1).maybeSingle();
    const persisted = normalizeProvider(check?.pix_provider as string);
    setCurrent(persisted);
    if (persisted !== provider) {
      toast.error("A alteração não foi persistida. Verifique permissões.");
      return;
    }
    toast.success(`Adquirente alterada: ${PROVIDERS.find(p => p.id === provider)?.name}`);
  };

  const handleTest = async () => {
    const product = products.find(p => p.id === testProductId);
    if (!product) {
      toast.error("Produto não encontrado");
      return;
    }
    setTesting(true);
    setTestResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("create-pix-payment", {
        body: {
          customer: {
            name: "Cliente Teste Painel",
            email: "teste@alphaoficial.com",
            phone: "11999999999",
            cpf: "11144477735",
          },
          items: [{ name: product.name, quantity: 1, price: product.price }],
          amount: product.price,
          shipping: {
            cep: "01001000",
            street: "Praça da Sé",
            number: "1",
            neighborhood: "Sé",
            city: "São Paulo",
            state: "SP",
          },
          externalRef: `test-${current}-${Date.now()}`,
          provider: current,
        },
      });
      if (error) throw error;
      if (data?.status === "failed" || data?.error) {
        const att = Array.isArray(data?.attempts) ? data.attempts[0] : null;
        setTestResult({ ok: false, error: data?.error || "Falha ao gerar PIX", rawStatus: att?.status, rawMessage: att?.message });
        toast.error(`Falha (${current}): ${data?.error || "erro desconhecido"}`);
      } else {
        setTestResult({
          ok: true,
          provider: data?.provider,
          qrCode: data?.qrCode,
          qrCodeBase64: data?.qrCodeBase64,
          transactionId: data?.transactionId,
        });
        toast.success(`PIX gerado com sucesso via ${data?.provider || current}`);
      }
    } catch (e: any) {
      setTestResult({ ok: false, error: e?.message || "Erro inesperado" });
      toast.error(`Erro: ${e?.message || "inesperado"}`);
    } finally {
      setTesting(false);
    }
  };

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado!");
  };

  const currentProviderName = PROVIDERS.find(p => p.id === current)?.name || current;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-foreground">Adquirente PIX</h3>
          <p className="text-xs text-muted-foreground">
            Selecione o provedor usado para gerar QR Codes PIX no checkout.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-24">
          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PROVIDERS.map((p) => {
            const active = current === p.id;
            return (
              <button
                key={p.id}
                type="button"
                disabled={saving}
                onClick={() => handleSelect(p.id)}
                className={`relative text-left rounded-xl border-2 p-4 transition-all disabled:opacity-60 ${
                  active ? "border-violet-500 bg-violet-500/5" : "border-border hover:border-foreground/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">{p.name}</p>
                  {active && (
                    <span className="flex items-center gap-1 text-[9px] uppercase tracking-widest font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      <Check className="w-3 h-3" /> Em uso
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{p.description}</p>
                <p className="text-[11px] text-muted-foreground font-mono mt-1 break-all">{p.host}</p>
              </button>
            );
          })}
        </div>
      )}

      {saving && (
        <p className="text-xs text-muted-foreground flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" /> Salvando...
        </p>
      )}

      {/* Test PIX */}
      <div className="border-t border-border pt-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
            <FlaskConical className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-foreground">Testar PIX com produto real</h4>
            <p className="text-[11px] text-muted-foreground">
              Gera uma cobrança PIX real na adquirente selecionada (<strong>{currentProviderName}</strong>) usando um produto da loja.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <label className="text-[11px] uppercase tracking-wider font-bold text-muted-foreground">Produto</label>
            <select
              value={testProductId}
              onChange={(e) => setTestProductId(Number(e.target.value))}
              disabled={testing}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name.length > 70 ? p.name.slice(0, 67) + "..." : p.name} — R$ {p.price.toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || loading}
            className="rounded-lg bg-foreground text-background px-5 py-2.5 text-sm font-bold hover:opacity-90 disabled:opacity-50 flex items-center gap-2 justify-center"
          >
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
            {testing ? "Gerando..." : "Gerar PIX de teste"}
          </button>
        </div>

        {testResult && (
          <div className={`rounded-xl border p-4 space-y-3 ${testResult.ok ? "border-emerald-500/40 bg-emerald-500/5" : "border-red-500/40 bg-red-500/5"}`}>
            {testResult.ok ? (
              <>
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
                  <Check className="w-4 h-4" /> PIX gerado com sucesso via {testResult.provider}
                </div>
                {testResult.transactionId && (
                  <p className="text-[11px] text-muted-foreground font-mono break-all">TX: {testResult.transactionId}</p>
                )}
                {testResult.qrCodeBase64 && (
                  <img
                    src={testResult.qrCodeBase64.startsWith("data:") ? testResult.qrCodeBase64 : `data:image/png;base64,${testResult.qrCodeBase64}`}
                    alt="QR Code PIX"
                    className="w-40 h-40 rounded-lg bg-white p-2"
                  />
                )}
                {testResult.qrCode && (
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">Copia e cola</label>
                    <div className="flex gap-2 mt-1">
                      <code className="flex-1 text-[10px] bg-muted/50 rounded-md px-2 py-2 break-all max-h-24 overflow-auto">
                        {testResult.qrCode}
                      </code>
                      <button
                        type="button"
                        onClick={() => copy(testResult.qrCode!)}
                        className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> Copiar
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <p className="text-sm font-bold text-red-600 dark:text-red-400">Falha ao gerar PIX</p>
                <p className="text-xs text-foreground">{testResult.error}</p>
                {testResult.rawStatus && (
                  <p className="text-[11px] text-muted-foreground font-mono">HTTP {testResult.rawStatus}</p>
                )}
                {testResult.rawMessage && (
                  <p className="text-[11px] text-muted-foreground font-mono break-all">{testResult.rawMessage}</p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PixProviderSettings;
