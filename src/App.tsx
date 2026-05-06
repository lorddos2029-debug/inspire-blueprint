import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/store/CartDrawer";
import { useUtmCapture } from "@/hooks/useUtmCapture";
import { usePresence } from "@/hooks/usePresence";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index.tsx";

// Lazy-load todas as outras rotas para reduzir o bundle inicial
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const ProductPage = lazy(() => import("./pages/ProductPage.tsx"));
const Painel = lazy(() => import("./pages/Painel.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const SobreNos = lazy(() => import("./pages/SobreNos.tsx"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade.tsx"));
const TermosUso = lazy(() => import("./pages/TermosUso.tsx"));
const TrabalheConosco = lazy(() => import("./pages/TrabalheConosco.tsx"));
const CentralAjuda = lazy(() => import("./pages/CentralAjuda.tsx"));
const TrocasDevolucoes = lazy(() => import("./pages/TrocasDevolucoes.tsx"));
const PrazoEntrega = lazy(() => import("./pages/PrazoEntrega.tsx"));
const FormasPagamento = lazy(() => import("./pages/FormasPagamento.tsx"));
const Obrigado = lazy(() => import("./pages/Obrigado.tsx"));
const ResolveRastreio = lazy(() => import("./pages/ResolveRastreio.tsx"));
const Tenf = lazy(() => import("./pages/Tenf.tsx"));
const UpsellTenis = lazy(() => import("./pages/UpsellTenis.tsx"));
const UpsellJaqueta = lazy(() => import("./pages/UpsellJaqueta.tsx"));
const UpsellJaqueta2 = lazy(() => import("./pages/UpsellJaqueta2.tsx"));
const UpsellPerfume = lazy(() => import("./pages/UpsellPerfume.tsx"));
const UpsellPerfume2 = lazy(() => import("./pages/UpsellPerfume2.tsx"));
const DownsellPerfume = lazy(() => import("./pages/DownsellPerfume.tsx"));
// Funil infinito de perfumes (Effervescent → Armaf → Kit 5 Árabes)
const UpsellPerfume1New = lazy(() => import("./pages/funnel/UpsellPerfume1.tsx"));
const DownsellPerfume1New = lazy(() => import("./pages/funnel/DownsellPerfume1.tsx"));
const UpsellPerfume2New = lazy(() => import("./pages/funnel/UpsellPerfume2.tsx"));
const DownsellPerfume2New = lazy(() => import("./pages/funnel/DownsellPerfume2.tsx"));
const UpsellPerfume3New = lazy(() => import("./pages/funnel/UpsellPerfume3.tsx"));
const DownsellPerfume3New = lazy(() => import("./pages/funnel/DownsellPerfume3.tsx"));
// Funil infinito de tênis (Academia → Kit Tênis+Relógio → Camurça)
const UpsellTenis1 = lazy(() => import("./pages/funnel/UpsellTenis1.tsx"));
const DownsellTenis1 = lazy(() => import("./pages/funnel/DownsellTenis1.tsx"));
const UpsellTenis2 = lazy(() => import("./pages/funnel/UpsellTenis2.tsx"));
const DownsellTenis2 = lazy(() => import("./pages/funnel/DownsellTenis2.tsx"));
const UpsellTenis3 = lazy(() => import("./pages/funnel/UpsellTenis3.tsx"));
const DownsellTenis3 = lazy(() => import("./pages/funnel/DownsellTenis3.tsx"));
const UpsellPreview = lazy(() => import("./pages/UpsellPreview.tsx"));

const Erro = lazy(() => import("./pages/Erro.tsx"));
const Rastreio = lazy(() => import("./pages/Rastreio.tsx"));
const Unsubscribe = lazy(() => import("./pages/Unsubscribe.tsx"));

const queryClient = new QueryClient();

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-8 w-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
  </div>
);

const AppContent = () => {
  useUtmCapture();
  usePresence();
  return (
    <CartProvider>
      <ScrollToTop />
      <CartDrawer />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/produto/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/sobre-nos" element={<SobreNos />} />
          <Route path="/politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/termos-de-uso" element={<TermosUso />} />
          <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
          <Route path="/central-de-ajuda" element={<CentralAjuda />} />
          <Route path="/trocas-e-devolucoes" element={<TrocasDevolucoes />} />
          <Route path="/prazo-de-entrega" element={<PrazoEntrega />} />
          <Route path="/formas-de-pagamento" element={<FormasPagamento />} />
          <Route path="/obrigado" element={<Obrigado />} />
          <Route path="/resolverastreio" element={<ResolveRastreio />} />
          <Route path="/tenf" element={<Tenf />} />
          <Route path="/upselltenis" element={<UpsellTenis />} />
          <Route path="/upselljaqueta" element={<UpsellJaqueta />} />
          <Route path="/upselljaqueta2" element={<UpsellJaqueta2 />} />
          <Route path="/upsellperfume" element={<UpsellPerfume />} />
          <Route path="/upsellperfume2" element={<UpsellPerfume2 />} />
          <Route path="/downsellperfume" element={<DownsellPerfume />} />
          {/* Funil infinito de perfumes */}
          <Route path="/upsell-perfume1" element={<UpsellPerfume1New />} />
          <Route path="/downsell-perfume1" element={<DownsellPerfume1New />} />
          <Route path="/upsell-perfume2" element={<UpsellPerfume2New />} />
          <Route path="/downsell-perfume2" element={<DownsellPerfume2New />} />
          <Route path="/upsell-perfume3" element={<UpsellPerfume3New />} />
          <Route path="/downsell-perfume3" element={<DownsellPerfume3New />} />
          {/* Funil infinito de tênis */}
          <Route path="/upsell-tenis1" element={<UpsellTenis1 />} />
          <Route path="/downsell-tenis1" element={<DownsellTenis1 />} />
          <Route path="/upsell-tenis2" element={<UpsellTenis2 />} />
          <Route path="/downsell-tenis2" element={<DownsellTenis2 />} />
          <Route path="/upsell-tenis3" element={<UpsellTenis3 />} />
          <Route path="/downsell-tenis3" element={<DownsellTenis3 />} />
          
          <Route path="/upsell-preview" element={<UpsellPreview />} />
          <Route path="/rastreio" element={<Rastreio />} />
          <Route path="/erro" element={<Erro />} />
          <Route path="/unsubscribe" element={<Unsubscribe />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </CartProvider>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
