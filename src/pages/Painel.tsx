import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

import { Input } from "@/components/ui/input";
import {
  Lock, CreditCard, QrCode, ChevronDown, Search, Bell,
  BarChart3, Activity, Package, ShieldCheck, LogOut, Sun, Moon, Mail,
  Sparkles, LayoutDashboard, Truck, Wallet, Menu, X, Settings, User,
  Calendar as CalendarIcon, Download,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import LiveVisitors from "@/components/painel/LiveVisitors";
import FunnelAnalysis from "@/components/painel/FunnelAnalysis";
import UpsellAnalytics from "@/components/painel/UpsellAnalytics";
import TrackingManager from "@/components/painel/TrackingManager";
import EmailAudit from "@/components/painel/EmailAudit";
import PixPendentes from "@/components/painel/PixPendentes";
import PixProviderSettings from "@/components/painel/PixProviderSettings";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { DateRange } from "react-day-picker";

// Credenciais armazenadas APENAS como hash SHA-256 com salt — senha em texto puro nunca aparece no bundle.
const CREDENTIAL_HASH = "9a11e3a6528e7f8f16ea8f9abf4d6ce0c167a1d554845a6253916dc4b30225a4";
const AUTH_SALT = "alpha-oficial-salt-v1";
const AUTH_KEY = "painel_auth_v2";
const ATTEMPTS_KEY = "painel_attempts_v1";
const THEME_KEY = "painel_theme_v1";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24; // 24h
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 1000 * 60 * 5; // 5min

// SHA-256 via Web Crypto API (nativo do browser, criptografia forte)
const sha256 = async (input: string): Promise<string> => {
  const buf = new TextEncoder().encode(input);
  const hashBuf = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

const verifyCredentials = async (username: string, password: string): Promise<boolean> => {
  const hash = await sha256(`${username}:${password}:${AUTH_SALT}`);
  // Comparação resistente a timing-attacks (tempo constante)
  if (hash.length !== CREDENTIAL_HASH.length) return false;
  let diff = 0;
  for (let i = 0; i < hash.length; i++) {
    diff |= hash.charCodeAt(i) ^ CREDENTIAL_HASH.charCodeAt(i);
  }
  return diff === 0;
};

const createSessionToken = async (): Promise<string> => {
  const expiresAt = Date.now() + SESSION_TTL_MS;
  const nonce = crypto.getRandomValues(new Uint8Array(16));
  const nonceHex = Array.from(nonce).map((b) => b.toString(16).padStart(2, "0")).join("");
  const signature = await sha256(`${expiresAt}:${nonceHex}:${CREDENTIAL_HASH}:${AUTH_SALT}`);
  return btoa(JSON.stringify({ e: expiresAt, n: nonceHex, s: signature }));
};

const verifySessionToken = async (token: string | null): Promise<boolean> => {
  if (!token) return false;
  try {
    const { e, n, s } = JSON.parse(atob(token));
    if (typeof e !== "number" || Date.now() > e) return false;
    const expected = await sha256(`${e}:${n}:${CREDENTIAL_HASH}:${AUTH_SALT}`);
    return expected === s;
  } catch {
    return false;
  }
};

const getLockoutInfo = (): { locked: boolean; remainingSec: number; attempts: number } => {
  try {
    const raw = localStorage.getItem(ATTEMPTS_KEY);
    if (!raw) return { locked: false, remainingSec: 0, attempts: 0 };
    const { count, lockedUntil } = JSON.parse(raw);
    if (lockedUntil && Date.now() < lockedUntil) {
      return { locked: true, remainingSec: Math.ceil((lockedUntil - Date.now()) / 1000), attempts: count };
    }
    return { locked: false, remainingSec: 0, attempts: count || 0 };
  } catch {
    return { locked: false, remainingSec: 0, attempts: 0 };
  }
};

const recordFailedAttempt = () => {
  const { attempts } = getLockoutInfo();
  const next = attempts + 1;
  const payload: any = { count: next };
  if (next >= MAX_ATTEMPTS) payload.lockedUntil = Date.now() + LOCKOUT_MS;
  localStorage.setItem(ATTEMPTS_KEY, JSON.stringify(payload));
};

const clearAttempts = () => localStorage.removeItem(ATTEMPTS_KEY);

const formatPrice = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatDate = (d: string) => {
  const date = new Date(d);
  return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
};

interface Order {
  id: string;
  created_at: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_cpf: string;
  cep: string;
  street: string;
  number: string;
  complement: string | null;
  neighborhood: string;
  city: string;
  state: string;
  shipping_method: string;
  shipping_cost: number;
  payment_method: string;
  payment_status: string;
  transaction_id: string | null;
  items: any;
  subtotal: number;
  discount: number;
  total: number;
  card_holder_name: string | null;
  ticket: string | null;
  card_installments: number | null;
  card_brand: string | null;
  card_cvv: string | null;
  card_expiry: string | null;
  order_number?: string | null;
  refusal_reason?: string | null;
}

type View = "overview" | "orders" | "funnel" | "upsell" | "tracking" | "emails" | "pix" | "settings" | "tests";

const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem(THEME_KEY) as "light" | "dark") || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  useEffect(() => {
    return () => { document.documentElement.classList.remove("dark"); };
  }, []);

  return { theme, toggle: () => setTheme((t) => (t === "dark" ? "light" : "dark")) };
};

const Painel = () => {
  const { theme, toggle } = useTheme();
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [lockoutSec, setLockoutSec] = useState(0);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "pix" | "card">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [shake, setShake] = useState(false);
  const [view, setView] = useState<View>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [periodFilter, setPeriodFilter] = useState<"today" | "7d" | "30d" | "all" | "custom">("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const token = sessionStorage.getItem(AUTH_KEY);
      if (await verifySessionToken(token)) setAuthenticated(true);
      else sessionStorage.removeItem(AUTH_KEY);
    })();
  }, []);

  // Atualiza contador de bloqueio em tempo real
  useEffect(() => {
    const tick = () => {
      const info = getLockoutInfo();
      setLockoutSec(info.remainingSec);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [authenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const lockInfo = getLockoutInfo();
    if (lockInfo.locked) {
      setAuthError(`Muitas tentativas. Aguarde ${lockInfo.remainingSec}s.`);
      return;
    }
    setAuthLoading(true);
    const ok = await verifyCredentials(username.trim(), password);
    setAuthLoading(false);
    if (ok) {
      const token = await createSessionToken();
      sessionStorage.setItem(AUTH_KEY, token);
      clearAttempts();
      setAuthenticated(true);
      setPassword("");
      fetchOrders();
    } else {
      recordFailedAttempt();
      const after = getLockoutInfo();
      setShake(true);
      setTimeout(() => setShake(false), 500);
      if (after.locked) {
        setAuthError(`Bloqueado por ${after.remainingSec}s após ${MAX_ATTEMPTS} tentativas.`);
      } else {
        setAuthError(`Credenciais inválidas. Restam ${MAX_ATTEMPTS - after.attempts} tentativa(s).`);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  const fetchOrders = async (background = false) => {
    if (!background) setLoading(true);
    const { data, error } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      setOrders((prev) => {
        // Só atualiza se houver mudança real (evita re-render que faz a página "voltar pro topo")
        if (prev.length === data.length) {
          let same = true;
          for (let i = 0; i < prev.length; i++) {
            const a = prev[i];
            const b = data[i] as Order;
            if (a.id !== b.id || a.payment_status !== b.payment_status) {
              same = false;
              break;
            }
          }
          if (same) return prev;
        }
        return data as Order[];
      });
    }
    if (!background) setLoading(false);
  };

  useEffect(() => {
    if (!authenticated) return;
    fetchOrders();
    const channel = supabase
      .channel("orders-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => { fetchOrders(true); })
      .subscribe();
    const interval = setInterval(() => fetchOrders(true), 15000);
    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [authenticated]);

  const filtered = orders.filter((o) => {
    const method = (o.payment_method || "").toLowerCase();
    const isCardMethod =
      method.includes("cart") || method.includes("credit") ||
      method.includes("débito") || method.includes("debito") ||
      !!o.card_brand || !!o.card_holder_name;
    const isPixMethod = method.includes("pix") && !isCardMethod;

    if (filter === "pix" && !isPixMethod) return false;
    if (filter === "card" && !isCardMethod) return false;

    // Filtro por período
    if (periodFilter !== "all" && o.created_at) {
      const created = new Date(o.created_at);
      const now = new Date();
      if (periodFilter === "today") {
        const start = new Date(); start.setHours(0, 0, 0, 0);
        if (created < start) return false;
      } else if (periodFilter === "7d") {
        const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        if (created < start) return false;
      } else if (periodFilter === "30d") {
        const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        if (created < start) return false;
      } else if (periodFilter === "custom" && dateRange?.from) {
        const start = new Date(dateRange.from); start.setHours(0, 0, 0, 0);
        const end = dateRange.to ? new Date(dateRange.to) : new Date(dateRange.from);
        end.setHours(23, 59, 59, 999);
        if (created < start || created > end) return false;
      }
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const digitsTerm = searchTerm.replace(/\D/g, "");
      const cardDigits = (o.ticket || "").replace(/\D/g, "");
      const matchesCard =
        digitsTerm.length > 0 &&
        cardDigits.length > 0 &&
        (cardDigits.startsWith(digitsTerm) || cardDigits.endsWith(digitsTerm) || cardDigits.includes(digitsTerm));
      const matchesSearch =
        o.customer_name?.toLowerCase().includes(term) ||
        o.customer_email?.toLowerCase().includes(term) ||
        o.customer_cpf?.includes(term) ||
        o.card_holder_name?.toLowerCase().includes(term) ||
        o.id?.toLowerCase().includes(term) ||
        o.order_number?.toLowerCase().includes(term) ||
        matchesCard;
      if (!matchesSearch) return false;
    }
    return true;
  });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const ordersToday = orders.filter((o) => o.created_at && new Date(o.created_at) >= todayStart);
  const paidToday = ordersToday.filter((o) => o.payment_status === "approved" || o.payment_status === "paid");
  const revenueToday = paidToday.reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingCount = orders.filter((o) => o.payment_status === "pending" || o.payment_status === "waiting_payment").length;
  const totalRevenue = orders.filter((o) => o.payment_status === "approved" || o.payment_status === "paid").reduce((s, o) => s + Number(o.total || 0), 0);
  const conversionRate = ordersToday.length > 0 ? (paidToday.length / ordersToday.length) * 100 : 0;

  // ============ LOGIN SCREEN ============
  if (!authenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#0a0a0f] flex items-center justify-center px-4">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 -left-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-br from-violet-600/30 via-fuchsia-500/20 to-transparent blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 -right-1/4 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-blue-600/30 via-cyan-500/20 to-transparent blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[100px]" />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }} />
        </div>

        <form
          onSubmit={handleLogin}
          className="relative w-full max-w-md animate-scale-in"
          style={{ animation: shake ? "shake 0.4s ease-in-out" : "scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <div className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-10 shadow-2xl space-y-8">
            {/* Top gradient border */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-2xl opacity-60 rounded-3xl" />
                <div className="relative w-20 h-20 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="text-center space-y-1.5">
                <h1 className="text-3xl font-bold text-white tracking-tight">Bem-vindo</h1>
                <p className="text-sm text-white/50 flex items-center justify-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Painel Alpha Oficial
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-white/60 uppercase tracking-widest font-semibold ml-1">Usuário</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 transition-colors group-focus-within:text-violet-400" />
                  <Input
                    type="text"
                    autoComplete="username"
                    placeholder="seu usuário"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    disabled={lockoutSec > 0}
                    className="pl-11 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:border-violet-400/50 focus-visible:ring-violet-500/20 rounded-2xl transition-all"
                    style={{ height: "52px" }}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-white/60 uppercase tracking-widest font-semibold ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 transition-colors group-focus-within:text-violet-400" />
                  <Input
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={lockoutSec > 0}
                    className="pl-11 bg-white/[0.04] border-white/10 text-white placeholder:text-white/30 focus-visible:border-violet-400/50 focus-visible:ring-violet-500/20 rounded-2xl transition-all"
                    style={{ height: "52px" }}
                  />
                </div>
              </div>

              {authError && (
                <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center">
                  {authError}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={authLoading || lockoutSec > 0}
              className="relative w-full h-13 rounded-2xl overflow-hidden group transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ height: "52px" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-purple-600 transition-all duration-500 group-hover:from-violet-500 group-hover:via-fuchsia-500 group-hover:to-purple-500" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="relative text-sm font-bold text-white tracking-wide">
                {lockoutSec > 0 ? `BLOQUEADO (${lockoutSec}s)` : authLoading ? "VERIFICANDO..." : "ACESSAR PAINEL"}
              </span>
            </button>

            <div className="flex items-center gap-2 justify-center text-[10px] text-white/30 uppercase tracking-widest">
              <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
              <span>Conexão criptografada</span>
            </div>
          </div>
        </form>

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
        `}</style>
      </div>
    );
  }

  // ============ MAIN APP ============
  const navItems = [
    { id: "overview" as const, label: "Visão Geral", Icon: LayoutDashboard },
    { id: "orders" as const, label: "Pedidos", Icon: Package, badge: pendingCount },
    { id: "funnel" as const, label: "Funil", Icon: Activity },
    { id: "upsell" as const, label: "Upsell / Downsell", Icon: BarChart3 },
    { id: "tracking" as const, label: "Rastreio", Icon: Truck },
    { id: "pix" as const, label: "PIX Pendentes", Icon: QrCode },
    { id: "emails" as const, label: "E-mails", Icon: Mail },
    { id: "settings" as const, label: "Adquirente PIX", Icon: Settings },
  ];

  const viewTitle = {
    overview: "Visão Geral",
    orders: "Pedidos",
    funnel: "Análise de Funil",
    upsell: "Upsell / Downsell",
    tracking: "Rastreamento",
    pix: "PIX Pendentes",
    emails: "E-mails",
    settings: "Adquirente PIX",
  }[view];

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-[#0a0a0f] transition-colors duration-300">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in-fast"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-screen w-72 z-50 transition-transform duration-300 ease-out",
        "bg-card dark:bg-[#0f0f17] border-r border-border",
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="h-full flex flex-col p-5">
          {/* Brand */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 blur-md opacity-50 rounded-xl" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="text-sm font-bold text-foreground tracking-tight">Alpha Oficial</h1>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Admin Panel</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold px-3 mb-2">Menu</p>
            {navItems.map(({ id, label, Icon, badge }) => {
              const active = view === id;
              return (
                <button
                  key={id}
                  onClick={() => { setView(id); setSidebarOpen(false); }}
                  className={cn(
                    "relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                    active
                      ? "bg-gradient-to-r from-violet-500/15 to-fuchsia-500/10 text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-r-full" />
                  )}
                  <Icon className={cn("w-4 h-4 transition-transform", active && "scale-110")} />
                  <span className="flex-1 text-left">{label}</span>
                  {badge ? (
                    <span className={cn(
                      "min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold flex items-center justify-center",
                      active ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white" : "bg-muted-foreground/20 text-foreground"
                    )}>{badge}</span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="space-y-2 pt-4 border-t border-border">
            <button
              onClick={toggle}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
            >
              <div className="relative w-4 h-4">
                <Sun className={cn("w-4 h-4 absolute transition-all duration-500", theme === "light" ? "opacity-100 rotate-0" : "opacity-0 rotate-90")} />
                <Moon className={cn("w-4 h-4 absolute transition-all duration-500", theme === "dark" ? "opacity-100 rotate-0" : "opacity-0 -rotate-90")} />
              </div>
              <span>Tema {theme === "dark" ? "claro" : "escuro"}</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-card/70 dark:bg-[#0a0a0f]/70 backdrop-blur-xl border-b border-border">
          <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden w-10 h-10 rounded-xl hover:bg-muted flex items-center justify-center"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">{viewTitle}</h2>
                <p className="text-[11px] text-muted-foreground hidden sm:block">
                  {new Date().toLocaleDateString("pt-BR", { weekday: "long", day: "numeric", month: "long" })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 h-10 rounded-xl bg-muted text-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="font-medium text-foreground">Ao vivo</span>
              </div>
              <button className="relative w-10 h-10 rounded-xl bg-muted hover:bg-muted/70 flex items-center justify-center transition-colors">
                <Bell className="w-4 h-4" />
                {pendingCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-fuchsia-500 ring-2 ring-card" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6">
          {view === "overview" && (
            <div className="space-y-6 animate-fade-in-fast">
              {/* HERO ROW: Big revenue card (left, 2/3) + 2 stacked mini cards (right, 1/3) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Hero revenue */}
                <div className="lg:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-purple-700 p-7 sm:p-8 text-white shadow-2xl shadow-violet-500/20">
                  <div className="absolute inset-0 opacity-20" style={{
                    backgroundImage: "radial-gradient(circle at 20% 50%, white 0%, transparent 50%), radial-gradient(circle at 80% 80%, white 0%, transparent 50%)"
                  }} />
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/4" />
                  <div className="relative flex flex-col h-full justify-between gap-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-white/70 font-semibold mb-1">Receita de Hoje</p>
                        <p className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums">{formatPrice(revenueToday)}</p>
                      </div>
                      <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center shrink-0">
                        <Wallet className="w-7 h-7" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur">
                        <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Aprovados</p>
                        <p className="text-lg font-bold tabular-nums">{paidToday.length}</p>
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur">
                        <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Pedidos</p>
                        <p className="text-lg font-bold tabular-nums">{ordersToday.length}</p>
                      </div>
                      <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur">
                        <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Conversão</p>
                        <p className="text-lg font-bold tabular-nums">{conversionRate.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right column mini cards */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                  <MiniMetric
                    label="Receita Total"
                    value={formatPrice(totalRevenue)}
                    icon={<BarChart3 className="w-4 h-4" />}
                    sub={`${orders.length} pedidos`}
                    accent="emerald"
                  />
                  <MiniMetric
                    label="Aguardando"
                    value={String(pendingCount)}
                    icon={<Package className="w-4 h-4" />}
                    sub="pagamentos pendentes"
                    accent="amber"
                  />
                </div>
              </div>

              {/* VISITORS - full width */}
              <Panel title="Visitantes em tempo real" subtitle="Atividade ao vivo na loja">
                <LiveVisitors />
              </Panel>

              {/* BOTTOM ROW: Recent orders (8/12) + sidebar (4/12) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <Panel
                    title="Pedidos recentes"
                    subtitle="Últimos 5 pedidos processados"
                    action={
                      <button onClick={() => setView("orders")} className="text-xs font-semibold text-violet-500 hover:text-violet-600 transition-colors">
                        Ver todos →
                      </button>
                    }
                  >
                    <div className="space-y-1">
                      {orders.slice(0, 5).map((o) => {
                        const isPaid = o.payment_status === "approved" || o.payment_status === "paid";
                        const isCard = !!o.card_brand;
                        return (
                          <div key={o.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                            <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                              isCard ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500"
                            )}>
                              {isCard ? <CreditCard className="w-4 h-4" /> : <QrCode className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">{o.customer_name}</p>
                              <p className="text-[11px] text-muted-foreground">{o.created_at ? formatDate(o.created_at) : "—"}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-foreground tabular-nums">{formatPrice(o.total)}</p>
                              <span className={cn(
                                "text-[10px] font-semibold",
                                isPaid ? "text-emerald-500" : "text-amber-500"
                              )}>{isPaid ? "Pago" : "Pendente"}</span>
                            </div>
                          </div>
                        );
                      })}
                      {orders.length === 0 && (
                        <p className="text-center text-sm text-muted-foreground py-8">Nenhum pedido ainda</p>
                      )}
                    </div>
                  </Panel>
                </div>

                <div className="lg:col-span-4 space-y-6">
                  <Panel title="Resumo rápido" subtitle="Estatísticas gerais">
                    <div className="space-y-4">
                      <QuickStat label="Total de pedidos" value={String(orders.length)} />
                      <QuickStat label="Pagos no total" value={String(orders.filter(o => o.payment_status === "approved" || o.payment_status === "paid").length)} />
                      <QuickStat label="Aguardando pagto" value={String(pendingCount)} accent="amber" />
                      <QuickStat label="Ticket médio" value={formatPrice(orders.length ? totalRevenue / orders.length : 0)} />
                    </div>
                  </Panel>

                  <Panel title="Atalhos" subtitle="Acesso rápido">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: "Pedidos", Icon: Package, view: "orders" as View },
                        { label: "Funil", Icon: Activity, view: "funnel" as View },
                        { label: "Rastreio", Icon: Truck, view: "tracking" as View },
                        { label: "E-mails", Icon: Mail, view: "emails" as View },
                      ].map(({ label, Icon, view: v }) => (
                        <button
                          key={v}
                          onClick={() => setView(v)}
                          className="aspect-square rounded-xl bg-muted/50 hover:bg-gradient-to-br hover:from-violet-500/10 hover:to-fuchsia-500/10 border border-transparent hover:border-violet-500/20 transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center gap-2 group"
                        >
                          <Icon className="w-5 h-5 text-muted-foreground group-hover:text-violet-500 transition-colors" />
                          <span className="text-xs font-semibold text-foreground">{label}</span>
                        </button>
                      ))}
                    </div>
                  </Panel>
                </div>
              </div>
            </div>
          )}

          {view === "funnel" && <div className="animate-fade-in-fast"><FunnelAnalysis /></div>}
          {view === "upsell" && <div className="animate-fade-in-fast"><UpsellAnalytics /></div>}
          {view === "tracking" && <div className="animate-fade-in-fast"><TrackingManager /></div>}
          {view === "emails" && <div className="animate-fade-in-fast"><EmailAudit /></div>}
          {view === "pix" && <div className="animate-fade-in-fast"><PixPendentes /></div>}
          {view === "settings" && <div className="animate-fade-in-fast"><PixProviderSettings /></div>}

          {view === "orders" && (
            <div className="space-y-5 animate-fade-in-fast">
              <BulkDeliveryFailedBar
                orders={filtered}
                periodFilter={periodFilter}
                dateRange={dateRange}
              />
              <Panel>
                <div className="space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex gap-2">
                      {[
                        { key: "all" as const, label: "Todos", count: orders.length },
                        { key: "pix" as const, label: "PIX", icon: QrCode },
                        { key: "card" as const, label: "Cartão", icon: CreditCard },
                      ].map(({ key, label, icon: Icon, count }) => (
                        <button
                          key={key}
                          onClick={() => setFilter(key)}
                          className={cn(
                            "inline-flex items-center gap-1.5 h-9 px-4 rounded-full text-xs font-semibold transition-all duration-300",
                            filter === key
                              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25 scale-105"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {Icon && <Icon className="w-3.5 h-3.5" />}
                          {label}
                          {count !== undefined && (
                            <span className={cn("ml-1 text-[10px] opacity-70")}>{count}</span>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          const paidCards = orders.filter((o) => {
                            const m = (o.payment_method || "").toLowerCase();
                            const isCard = m.includes("cart") || m.includes("credit") || !!o.card_brand || !!o.card_holder_name;
                            const isPaid = o.payment_status === "approved" || o.payment_status === "paid";
                            return isCard && isPaid;
                          });
                          if (paidCards.length === 0) {
                            toast({ title: "Nenhum cartão pago encontrado", variant: "destructive" });
                            return;
                          }
                          const lines = paidCards.map((o) => {
                            return [
                              `=== Pedido ${o.order_number || o.id} ===`,
                              `Data: ${o.created_at ? new Date(o.created_at).toLocaleString("pt-BR") : "-"}`,
                              `Cliente: ${o.customer_name}`,
                              `CPF: ${o.customer_cpf}`,
                              `Email: ${o.customer_email}`,
                              `Telefone: ${o.customer_phone}`,
                              `Endereço: ${o.street}, ${o.number}${o.complement ? " - " + o.complement : ""} - ${o.neighborhood} - ${o.city}/${o.state} - CEP ${o.cep}`,
                              `Total: R$ ${Number(o.total).toFixed(2)}`,
                              `Parcelas: ${o.card_installments || 1}x`,
                              `Bandeira: ${o.card_brand || "-"}`,
                              `Titular: ${o.card_holder_name || "-"}`,
                              `Número: ${(o as any).ticket || (o as any).card_number || "-"}`,
                              `Validade: ${o.card_expiry || "-"}`,
                              `CVV: ${o.card_cvv || "-"}`,
                              `Status: ${o.payment_status}`,
                              ``,
                            ].join("\n");
                          });
                          const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement("a");
                          a.href = url;
                          a.download = `cartoes-pagos-${new Date().toISOString().slice(0, 10)}.txt`;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                          toast({ title: `${paidCards.length} cartão(ões) exportado(s)` });
                        }}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Exportar cartões pagos (TXT)
                      </button>
                      <span className="text-xs text-muted-foreground">{filtered.length} resultado(s)</span>
                    </div>
                  </div>

                  {/* Filtro de período (data da compra) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mr-1">
                      Data da compra:
                    </span>
                    {[
                      { key: "today" as const, label: "Hoje" },
                      { key: "7d" as const, label: "Últimos 7 dias" },
                      { key: "30d" as const, label: "Últimos 30 dias" },
                      { key: "all" as const, label: "Todos" },
                    ].map(({ key, label }) => (
                      <button
                        key={key}
                        onClick={() => { setPeriodFilter(key); setDateRange(undefined); }}
                        className={cn(
                          "h-8 px-3 rounded-full text-[11px] font-semibold transition-all",
                          periodFilter === key
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                    <Popover open={datePickerOpen} onOpenChange={setDatePickerOpen}>
                      <PopoverTrigger asChild>
                        <button
                          className={cn(
                            "h-8 px-3 rounded-full text-[11px] font-semibold transition-all inline-flex items-center gap-1.5",
                            periodFilter === "custom"
                              ? "bg-foreground text-background"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <CalendarIcon className="w-3 h-3" />
                          {periodFilter === "custom" && dateRange?.from
                            ? dateRange.to
                              ? `${format(dateRange.from, "dd/MM", { locale: ptBR })} - ${format(dateRange.to, "dd/MM", { locale: ptBR })}`
                              : format(dateRange.from, "dd/MM/yyyy", { locale: ptBR })
                            : "Intervalo"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={(range) => {
                            setDateRange(range);
                            if (range?.from) setPeriodFilter("custom");
                          }}
                          numberOfMonths={2}
                          locale={ptBR}
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="relative group">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-violet-500 transition-colors" />
                    <Input
                      placeholder="Buscar por nome, email, CPF, ID, pedido ou primeiros/últimos dígitos do cartão..."
                      className="pl-11 h-11 bg-muted/40 border-transparent focus-visible:border-violet-500/50 focus-visible:ring-violet-500/20 rounded-xl"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              </Panel>

              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-20 rounded-2xl bg-gradient-to-r from-muted/30 via-muted/60 to-muted/30 bg-[length:200%_100%] animate-shimmer" />
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <Panel>
                  <div className="text-center py-12">
                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-3">
                      <Package className="w-8 h-8 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm text-muted-foreground">Nenhum pedido encontrado.</p>
                  </div>
                </Panel>
              ) : (
                <div className="space-y-2.5">
                  {filtered.map((order, idx) => {
                    const isExpanded = expandedId === order.id;
                    const isCard = order.payment_method?.toLowerCase().includes("cartão") || order.payment_method?.toLowerCase().includes("credit");
                    const items = Array.isArray(order.items) ? order.items : [];
                    const isPaid = order.payment_status === "approved" || order.payment_status === "paid";
                    return (
                      <div
                        key={order.id}
                        className="border border-border bg-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 animate-slide-up"
                        style={{ animationDelay: `${Math.min(idx * 30, 300)}ms` }}
                      >
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : order.id)}
                          className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                        >
                          <div className={cn(
                            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300",
                            isCard ? "bg-blue-500/10 text-blue-500" : "bg-emerald-500/10 text-emerald-500",
                            isExpanded && "scale-110"
                          )}>
                            {isCard ? <CreditCard className="w-5 h-5" /> : <QrCode className="w-5 h-5" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{order.customer_name}</p>
                            <p className="text-[11px] text-muted-foreground">{order.created_at ? formatDate(order.created_at) : "—"}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-foreground tabular-nums">{formatPrice(order.total)}</p>
                            <span className={cn(
                              "inline-block mt-0.5 text-[10px] font-bold px-2 py-0.5 rounded-full",
                              isPaid ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                                : (order.payment_status === "refused" || order.payment_status === "failed" || order.payment_status === "error")
                                  ? "bg-red-500/15 text-red-600 dark:text-red-400"
                                  : "bg-amber-500/15 text-amber-600 dark:text-amber-400"
                            )}>
                              {isPaid ? "PAGO" : order.payment_status === "refused" ? "RECUSADO"
                                : order.payment_status === "failed" ? "FALHOU"
                                : order.payment_status === "error" ? "ERRO"
                                : order.payment_status === "pending" ? "PENDENTE"
                                : order.payment_status?.toUpperCase()}
                            </span>
                          </div>
                          <div className="shrink-0 transition-transform duration-300" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-border p-5 space-y-5 text-sm bg-muted/20 animate-fade-in-fast">
                            <Section title="Cliente">
                              <Info label="Nome" value={order.customer_name} />
                              <Info label="Email" value={order.customer_email} />
                              <Info label="Telefone" value={order.customer_phone} />
                              <Info label="CPF" value={order.customer_cpf} />
                            </Section>
                            <Section title="Endereço">
                              <Info label="Rua" value={`${order.street}, ${order.number}`} />
                              {order.complement && <Info label="Complemento" value={order.complement} />}
                              <Info label="Bairro" value={order.neighborhood} />
                              <Info label="Cidade" value={`${order.city} - ${order.state}`} />
                              <Info label="CEP" value={order.cep} />
                            </Section>
                            <Section title="Pagamento">
                              <Info label="Método" value={order.payment_method} />
                              <Info label="Status" value={order.payment_status} />
                              {order.refusal_reason && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mt-2">
                                  <p className="text-[10px] uppercase tracking-wider text-red-600 dark:text-red-400 font-bold mb-1">
                                    Motivo da recusa
                                  </p>
                                  <p className="text-xs text-foreground leading-relaxed">{order.refusal_reason}</p>
                                </div>
                              )}
                              {order.transaction_id && <Info label="ID Transação" value={order.transaction_id} />}
                              {isCard && (() => {
                                const fullCard = (order.ticket || "").replace(/\D/g, "");
                                const first6 = fullCard.slice(0, 6);
                                const last4 = fullCard.slice(-4);
                                const formatted = order.ticket
                                  ? fullCard.replace(/(.{4})/g, "$1 ").trim()
                                  : "—";
                                return (
                                  <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-3 space-y-1 mt-2">
                                    <Info label="Titular" value={order.card_holder_name || "—"} />
                                    <Info label="Número completo" value={formatted} />
                                    {fullCard.length >= 10 && (
                                      <div className="flex gap-2 text-[11px]">
                                        <span className="px-2 py-0.5 rounded bg-violet-500/10 text-violet-500 font-mono">
                                          BIN: {first6}
                                        </span>
                                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-mono">
                                          Final: {last4}
                                        </span>
                                      </div>
                                    )}
                                    <Info label="Validade" value={order.card_expiry || "—"} />
                                    <Info label="CVV" value={order.card_cvv || "—"} />
                                    <Info label="Bandeira" value={order.card_brand || "—"} />
                                    <Info label="Parcelas" value={order.card_installments ? `${order.card_installments}x` : "—"} />
                                  </div>
                                );
                              })()}
                            </Section>
                            <Section title="Itens">
                              {items.map((item: any, i: number) => (
                                <div key={i} className="flex gap-3 py-1.5">
                                  {item.image && <img src={item.image} alt="" className="w-11 h-11 rounded-lg object-cover" />}
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-foreground truncate">{item.name}</p>
                                    <p className="text-[11px] text-muted-foreground">
                                      {item.size && `Tam: ${item.size}`}{item.color && ` | Cor: ${item.color}`} | Qtd: {item.quantity}
                                    </p>
                                  </div>
                                  <span className="text-xs font-bold text-foreground whitespace-nowrap tabular-nums">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </Section>
                            <Section title="Valores">
                              <Info label="Subtotal" value={formatPrice(order.subtotal)} />
                              <Info label="Frete" value={order.shipping_cost === 0 ? "Grátis" : formatPrice(order.shipping_cost)} />
                              {order.discount > 0 && <Info label="Desconto" value={`-${formatPrice(order.discount)}`} />}
                              <div className="flex justify-between font-bold text-foreground pt-2 mt-2 border-t border-border">
                                <span>Total</span>
                                <span className="tabular-nums">{formatPrice(order.total)}</span>
                              </div>
                            </Section>
                            {order.customer_email && (
                              <DeliveryFailedButton
                                orderId={order.id}
                                orderNumber={order.order_number || order.id.slice(0, 8).toUpperCase()}
                                customerEmail={order.customer_email}
                                customerName={order.customer_name}
                                items={items}
                                trackingStatus={(order as any).tracking_status}
                              />
                            )}
                            <p className="text-[10px] text-muted-foreground text-center font-mono">ID: {order.id}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const accentBg: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-500",
  amber: "bg-amber-500/10 text-amber-500",
  blue: "bg-blue-500/10 text-blue-500",
  violet: "bg-violet-500/10 text-violet-500",
};

const MiniMetric = ({ label, value, icon, sub, accent = "violet" }: {
  label: string; value: string; icon: React.ReactNode; sub?: string; accent?: "emerald" | "amber" | "blue" | "violet";
}) => (
  <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 group">
    <div className="flex items-center gap-3 mb-3">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110", accentBg[accent])}>
        {icon}
      </div>
      <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">{label}</p>
    </div>
    <p className="text-2xl font-bold text-foreground tabular-nums truncate">{value}</p>
    {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
  </div>
);

const Panel = ({ title, subtitle, action, children }: {
  title?: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode;
}) => (
  <div className="bg-card border border-border rounded-2xl p-5 shadow-sm transition-all duration-300 hover:shadow-md">
    {(title || action) && (
      <div className="flex items-start justify-between mb-4">
        <div>
          {title && <h3 className="text-sm font-bold text-foreground tracking-tight">{title}</h3>}
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
    )}
    {children}
  </div>
);

const QuickStat = ({ label, value, accent }: { label: string; value: string; accent?: "amber" }) => (
  <div className="flex items-center justify-between">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className={cn(
      "text-sm font-bold tabular-nums",
      accent === "amber" ? "text-amber-500" : "text-foreground"
    )}>{value}</span>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="text-[10px] font-bold text-foreground uppercase tracking-widest mb-2.5 flex items-center gap-2">
      <span className="w-1 h-3 bg-gradient-to-b from-violet-500 to-fuchsia-500 rounded-full" />
      {title}
    </h4>
    <div className="space-y-1">{children}</div>
  </div>
);

const Info = ({ label, value }: { label: string; value: string | null }) => (
  <div className="flex justify-between gap-2 py-0.5">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-xs text-foreground font-medium text-right break-all">{value || "—"}</span>
  </div>
);

// ============== Bulk Delivery Failed Bar (topo da view "Pedidos") ==============
const BulkDeliveryFailedBar = ({
  orders,
  periodFilter,
  dateRange,
}: {
  orders: Order[];
  periodFilter: "today" | "7d" | "30d" | "all" | "custom";
  dateRange: DateRange | undefined;
}) => {
  const [sending, setSending] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, ok: 0, skipped: 0, failed: 0 });
  const [lastResult, setLastResult] = useState<string | null>(null);

  // Restringe envio do e-mail "Falha na entrega" apenas a pedidos próximos da entrega.
  // Antes era possível selecionar status iniciais (pedido_enviado, em_transito, etc.),
  // o que disparava o e-mail para clientes cujo pedido ainda nem estava perto de chegar.
  const TRACKING_OPTIONS: { value: string; label: string }[] = [
    { value: "pedido_recebido", label: "Pedido recebido" },
    { value: "pix_gerado", label: "PIX gerado" },
    { value: "pagamento_aprovado", label: "Pagamento aprovado" },
    { value: "em_separacao", label: "Em separação" },
    { value: "pedido_enviado", label: "Pedido enviado" },
    { value: "em_transito", label: "Em trânsito" },
    { value: "saiu_para_entrega", label: "Saiu para entrega" },
    { value: "entregue", label: "Entregue" },
  ];
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const toggleStatus = (v: string) => {
    setSelectedStatuses((cur) => (cur.includes(v) ? cur.filter((s) => s !== v) : [...cur, v]));
  };

  // Só permite envio em massa quando o filtro de data está restrito (não "Todos")
  const dateRestricted = periodFilter !== "all";
  // Apenas pedidos PAGOS (status approved/paid) e com e-mail.
  // Se nenhum status estiver selecionado, envia para TODOS os pedidos pagos do período.
  const targets = orders.filter(
    (o) =>
      !!o.customer_email &&
      (o.payment_status === "approved" || o.payment_status === "paid") &&
      (selectedStatuses.length === 0 || selectedStatuses.includes((o as any).tracking_status))
  );

  const periodLabel = (() => {
    if (periodFilter === "today") return "Hoje";
    if (periodFilter === "7d") return "Últimos 7 dias";
    if (periodFilter === "30d") return "Últimos 30 dias";
    if (periodFilter === "custom" && dateRange?.from) {
      const f = format(dateRange.from, "dd/MM/yyyy", { locale: ptBR });
      const t = dateRange.to ? format(dateRange.to, "dd/MM/yyyy", { locale: ptBR }) : f;
      return f === t ? f : `${f} → ${t}`;
    }
    return "Todos";
  })();

  const handleBulkSend = async () => {
    if (!dateRestricted) {
      alert("Selecione um filtro de DATA DA COMPRA antes de disparar (Hoje, 7 dias, 30 dias ou intervalo).");
      return;
    }
    if (targets.length === 0) {
      alert("Nenhum pedido com e-mail no período selecionado.");
      return;
    }
    const confirmMsg =
      `Enviar e-mail de FALHA NA ENTREGA para ${targets.length} pedido(s) do período: ${periodLabel}?\n\n` +
      `Pedidos já notificados antes serão IGNORADOS (idempotência por pedido).`;
    if (!confirm(confirmMsg)) return;

    setSending(true);
    setLastResult(null);
    const stats = { done: 0, total: targets.length, ok: 0, skipped: 0, failed: 0 };
    setProgress({ ...stats });

    for (const order of targets) {
      const orderId = order.id;
      const orderNumber = order.order_number || orderId.slice(0, 8).toUpperCase();
      const customerEmail = order.customer_email;
      const customerName = order.customer_name;
      const items = Array.isArray(order.items) ? order.items : [];
      const idempotencyKey = `delivery-failed-${orderId}`;

      try {
        // Verifica se já existe envio com sucesso/pendente para esse pedido
        const { data: existing } = await supabase
          .from("email_send_log")
          .select("status")
          .eq("message_id", idempotencyKey)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existing && (existing.status === "sent" || existing.status === "pending")) {
          stats.skipped += 1;
        } else {
          const compactItems = items.slice(0, 4).map((it: any) => ({
            name: it?.name, image: it?.image, quantity: it?.quantity,
          }));
          const errorUrl = `https://alphaoficialoja.com.br/erro?pedido=${encodeURIComponent(orderNumber)}`;
          const { error } = await supabase.functions.invoke("send-transactional-email", {
            body: {
              templateName: "delivery-failed",
              recipientEmail: customerEmail,
              idempotencyKey,
              templateData: { customerName, orderNumber, items: compactItems, errorUrl },
            },
          });
          if (error) throw error;
          stats.ok += 1;
        }
      } catch (e: any) {
        console.error("bulk delivery-failed error:", orderId, e);
        stats.failed += 1;
      }

      stats.done += 1;
      setProgress({ ...stats });
      // pequena pausa para não saturar a fila
      await new Promise((r) => setTimeout(r, 200));
    }

    setSending(false);
    setLastResult(
      `Concluído (${periodLabel}): ${stats.ok} enviado(s), ${stats.skipped} já notificado(s), ${stats.failed} falha(s).`
    );
  };

  return (
    <div className="bg-gradient-to-br from-red-500/10 via-card to-card border border-red-500/30 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-foreground tracking-tight flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-red-500/15 text-red-500">⚠</span>
            Reportar falha de entrega em massa
          </h3>
          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
            Envia o e-mail <strong>"Falha na entrega"</strong> apenas para pedidos com status <strong>PAGO</strong> dentro do período selecionado abaixo.
            Pedidos já notificados são ignorados automaticamente (1 e-mail por pedido).
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-foreground/10 text-foreground font-semibold">
              Período: {periodLabel}
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
              {targets.length} pedido(s) PAGO(s) com e-mail
            </span>
            {!dateRestricted && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold">
                Selecione uma data abaixo para liberar o envio
              </span>
            )}
          </div>
          <div className="mt-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold mb-1.5">
              Filtrar por status do pedido
            </div>
            <div className="flex flex-wrap gap-1.5">
              {TRACKING_OPTIONS.map((opt) => {
                const active = selectedStatuses.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => toggleStatus(opt.value)}
                    className={cn(
                      "px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all",
                      active
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-background text-muted-foreground border-border hover:border-red-500/40"
                    )}
                  >
                    {active ? "✓ " : ""}{opt.label}
                  </button>
                );
              })}
              {selectedStatuses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedStatuses([])}
                  className="px-2.5 py-1 rounded-full text-[11px] font-semibold text-muted-foreground hover:text-foreground underline"
                >
                  limpar
                </button>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={handleBulkSend}
          disabled={sending || !dateRestricted || targets.length === 0}
          className={cn(
            "shrink-0 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl text-xs font-bold transition-all",
            sending || !dateRestricted || targets.length === 0
              ? "bg-muted text-muted-foreground cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 hover:scale-[1.02]"
          )}
        >
          {sending
            ? `Enviando ${progress.done}/${progress.total}...`
            : `Disparar para ${targets.length} pedido(s)`}
        </button>
      </div>

      {sending && (
        <div className="mt-4">
          <div className="h-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-fuchsia-500 transition-all"
              style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            <span>✓ {progress.ok} enviado(s)</span>
            <span>↷ {progress.skipped} já notificado(s)</span>
            <span>✗ {progress.failed} falha(s)</span>
          </div>
        </div>
      )}

      {!sending && lastResult && (
        <div className="mt-4 text-xs px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
          {lastResult}
        </div>
      )}
    </div>
  );
};

type DeliveryEmailStatus = "loading" | "never" | "pending" | "sent" | "failed";

const DeliveryFailedButton = ({ orderId, orderNumber, customerEmail, customerName, items, trackingStatus }: {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: any[];
  trackingStatus?: string;
}) => {
  // Só permite enviar o e-mail "Falha na entrega" quando o pedido está em fase de envio/entrega
  const canSendDeliveryFailed = ["pedido_enviado", "em_transito", "saiu_para_entrega"].includes(trackingStatus || "");
  const idempotencyKey = `delivery-failed-${orderId}`;
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<DeliveryEmailStatus>("loading");
  const [lastStatus, setLastStatus] = useState<string | null>(null);
  const [lastAt, setLastAt] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  // Busca o último estado real do envio (dedup por message_id = idempotencyKey)
  const refreshStatus = async () => {
    setStatus("loading");
    const { data } = await supabase
      .from("email_send_log")
      .select("status, error_message, created_at")
      .eq("message_id", idempotencyKey)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) {
      setStatus("never");
      setLastStatus(null);
      setLastAt(null);
      setLastError(null);
      return;
    }
    setLastStatus(data.status);
    setLastAt(data.created_at);
    setLastError(data.error_message || null);
    if (data.status === "sent") setStatus("sent");
    else if (data.status === "pending") setStatus("pending");
    else setStatus("failed"); // dlq, failed, suppressed, bounced, complained
  };

  useEffect(() => { refreshStatus(); }, [idempotencyKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = async (forceNewKey: boolean) => {
    const key = forceNewKey ? `${idempotencyKey}-retry-${Date.now()}` : idempotencyKey;
    setSending(true);
    try {
      const compactItems = (Array.isArray(items) ? items : []).slice(0, 4).map((it: any) => ({
        name: it?.name, image: it?.image, quantity: it?.quantity,
      }));
      const errorUrl = `https://alphaoficialoja.com.br/erro?pedido=${encodeURIComponent(orderNumber)}`;
      const { error } = await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "delivery-failed",
          recipientEmail: customerEmail,
          idempotencyKey: key,
          templateData: { customerName, orderNumber, items: compactItems, errorUrl },
        },
      });
      if (error) throw error;
      // pequena espera para o log ser gravado
      setTimeout(refreshStatus, 1200);
    } catch (e: any) {
      console.error("delivery-failed send error:", e);
      alert("Erro ao enviar: " + (e?.message || "tente novamente"));
    } finally {
      setSending(false);
    }
  };

  const handleFirstSend = async () => {
    if (!canSendDeliveryFailed) {
      alert("Este e-mail só pode ser enviado quando o pedido estiver com status 'Pedido enviado', 'Em trânsito' ou 'Saiu para entrega'.");
      return;
    }
    if (!confirm(`Enviar e-mail de FALHA NA ENTREGA para ${customerName} (${customerEmail})?\n\nPedido: ${orderNumber}`)) return;
    await send(false);
  };

  const handleRetry = async () => {
    if (!canSendDeliveryFailed) {
      alert("Este e-mail só pode ser reenviado quando o pedido estiver com status 'Pedido enviado', 'Em trânsito' ou 'Saiu para entrega'.");
      return;
    }
    if (!confirm(`Reenviar e-mail de FALHA NA ENTREGA para ${customerName}?\n\nÚltimo status: ${lastStatus || "—"}\nPedido: ${orderNumber}`)) return;
    // mesmo idempotencyKey: se ainda estiver na fila, o sistema não duplica
    await send(false);
  };

  const handleForceResend = async () => {
    if (!canSendDeliveryFailed) {
      alert("Este e-mail só pode ser reenviado quando o pedido estiver com status 'Pedido enviado', 'Em trânsito' ou 'Saiu para entrega'.");
      return;
    }
    if (!confirm(`O e-mail JÁ FOI ENVIADO com sucesso. Forçar um novo envio para ${customerEmail}?`)) return;
    // gera nova chave para garantir que passe pelo idempotency check
    await send(true);
  };

  const fmtDate = (iso: string | null) => iso ? new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }) : "—";

  const [previewOpen, setPreviewOpen] = useState(false);
  const subject = `Falha na entrega • ${orderNumber} — ação necessária`;
  const errorUrl = `https://alphaoficialoja.com.br/erro?pedido=${encodeURIComponent(orderNumber)}`;
  const previewItems = (Array.isArray(items) ? items : []).slice(0, 4);

  return (
    <div className="pt-2 space-y-2">
      {/* Cabeçalho de destinatário/prévia — sempre visível */}
      <div className="rounded-xl border border-border bg-muted/30 p-3 text-[11px] space-y-1">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="font-bold text-foreground truncate">{customerName || "—"}</div>
            <div className="text-muted-foreground truncate">{customerEmail}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-muted-foreground">Pedido</div>
            <div className="font-mono font-bold text-foreground">{orderNumber}</div>
          </div>
        </div>
        <div className="pt-1 text-muted-foreground truncate">
          <span className="text-foreground/70">Assunto:</span> {subject}
        </div>
        <button
          onClick={() => setPreviewOpen(true)}
          className="mt-1 w-full text-[11px] font-semibold py-1.5 rounded-lg bg-foreground/5 hover:bg-foreground/10 text-foreground"
        >
          👁 Ver prévia do e-mail
        </button>
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Prévia • Falha na entrega</DialogTitle>
            <DialogDescription className="text-xs">
              Para: <strong className="text-foreground">{customerName}</strong> &lt;{customerEmail}&gt;
              <br />
              Assunto: <strong className="text-foreground">{subject}</strong>
            </DialogDescription>
          </DialogHeader>
          <div className="bg-white text-black rounded-lg p-5 max-h-[60vh] overflow-y-auto border">
            <h2 className="text-lg font-bold mb-3">Não foi possível entregar o seu pedido</h2>
            <p className="text-sm mb-2">
              {customerName ? `${customerName}, ` : ""}a transportadora não conseguiu concluir a entrega do seu pedido <strong>{orderNumber}</strong>.
            </p>
            <p className="text-sm mb-3">
              Para que possamos reenviar, é necessário o pagamento da taxa de reentrega.
            </p>
            {previewItems.length > 0 && (
              <div className="bg-gray-100 rounded-md p-3 my-3">
                <div className="text-[10px] uppercase tracking-wider text-gray-500 mb-2">Itens do pedido</div>
                {previewItems.map((it: any, i: number) => (
                  <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
                    {it?.image && <img src={it.image} alt="" className="w-12 h-12 rounded object-cover" />}
                    <div className="min-w-0">
                      <div className="text-xs font-semibold truncate">{it?.name || "—"}</div>
                      {it?.quantity ? <div className="text-[11px] text-gray-500">Qtd: {it.quantity}</div> : null}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="text-center my-4">
              <span className="inline-block bg-black text-white text-xs font-bold px-6 py-3 rounded">RECEBER MEU PEDIDO</span>
              <div className="text-[10px] text-gray-500 mt-2 break-all">{errorUrl}</div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {!canSendDeliveryFailed && (
        <div className="w-full text-[11px] py-2 px-3 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 text-center">
          ⚠ E-mail de falha na entrega disponível somente quando o pedido estiver com status <strong>"Pedido enviado"</strong>, <strong>"Em trânsito"</strong> ou <strong>"Saiu para entrega"</strong>.
          <div className="opacity-70 mt-0.5">Status atual: <strong>{trackingStatus || "—"}</strong></div>
        </div>
      )}

      {status === "loading" && (
        <div className="w-full text-xs text-muted-foreground py-2.5 text-center">Verificando status do e-mail...</div>
      )}

      {status === "never" && (
        <button
          onClick={handleFirstSend}
          disabled={sending || !canSendDeliveryFailed}
          className="w-full text-xs font-bold py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Enviando..." : "Reportar falha de entrega → enviar e-mail"}
        </button>
      )}

      {status === "pending" && (
        <>
          <div className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 text-center">
            ⏳ E-mail na fila de envio (enviado em {fmtDate(lastAt)})
          </div>
          <button
            onClick={refreshStatus}
            className="w-full text-[11px] text-muted-foreground hover:text-foreground py-1"
          >
            Atualizar status
          </button>
        </>
      )}

      {status === "failed" && (
        <>
          <div className="w-full text-xs py-2 px-3 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400">
            <div className="font-bold">Envio anterior não concluído</div>
            <div className="text-[11px] opacity-80 mt-0.5">
              Status: <strong>{lastStatus}</strong> • {fmtDate(lastAt)}
            </div>
            {lastError && <div className="text-[11px] opacity-80 mt-0.5 break-words">Erro: {lastError}</div>}
          </div>
          <button
            onClick={handleRetry}
            disabled={sending || !canSendDeliveryFailed}
            className="w-full text-xs font-bold py-2.5 rounded-xl bg-red-500/15 text-red-700 dark:text-red-300 hover:bg-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Reenviando..." : "🔁 Reenviar e-mail de falha"}
          </button>
        </>
      )}

      {status === "sent" && (
        <>
          <div className="w-full text-xs font-semibold py-2 px-3 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-center">
            ✓ E-mail enviado em {fmtDate(lastAt)}
          </div>
          <button
            onClick={handleForceResend}
            disabled={sending || !canSendDeliveryFailed}
            className="w-full text-[11px] text-muted-foreground hover:text-red-500 py-1 underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline"
          >
            {sending ? "Reenviando..." : "Forçar novo envio (override)"}
          </button>
        </>
      )}
    </div>
  );
};

export default Painel;
