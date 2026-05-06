import { useState } from "react";
import { Star, Lock, CheckCircle, Camera, X, MessageSquarePlus } from "lucide-react";
import { poloReviews, jeansReviews, nautilusReviews, vulcanReviews, alfaiatariaReviews, tenisSlipOnReviews, titanReviews, havocReviews, shortLinhoReviews, alfaGelatoReviews, arielReviews, shortsCompressaoReviews, calcaRetaSarjaReviews, dryfitTactelReviews, joggerPoliamidaReviews, camisetaTechReviews, cuecaBoxReviews, poloPoliamidaReviews, calcaJeansKitReviews, jaquetaSarjaReviews, kitBermudasTactelReviews, kitCamisetaOversizedReviews, moletomParisReviews, dogzurbCuecaReviews, joggerSkinnyAcademiaReviews, tenisAcademiaReviews, camisaTricotReviews, perfumeKitReviews, perfumeKit3Reviews, perfumeKitDuoReviews, kitJeans3PromoReviews, poloOldMoneyReviews, sueterGolaAltaReviews, bermudaDryfitPremiumReviews, bodySplashBarboursReviews, profitCuecaDryfitReviews, bermudaMonster2em1Reviews, kitBarbariusMidtownReviews, bodySplashBarbariusSoloReviews, kitParisStreetwearReviews, techDailyInsiderReviews, techDailyInsiderPremiumReviews } from "@/data/reviews";
import { toast } from "sonner";

interface ProductReviewsProps {
  productId?: number;
}

const ProductReviews = ({ productId = 1 }: ProductReviewsProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formRating, setFormRating] = useState(0);
  const [formHover, setFormHover] = useState(0);
  const [formName, setFormName] = useState("");
  const [formText, setFormText] = useState("");
  const [formImage, setFormImage] = useState<string | null>(null);
  const isJeans = productId === 2;
  const isNautilus = productId === 3;
  const isVulcan = productId === 4;
  const isAlfaiataria = productId === 9;
  const isTenis = productId === 10 || productId === 25;
  const isTitan = productId === 11;
  const isHavoc = productId === 12;
  const isShortLinho = productId === 13;
  const isAlfaGelato = productId === 14;
  const isAriel = productId === 15;
  
  const isShortsCompressao = productId === 17;
  const isCalcaRetaSarja = productId === 18;
  const isDryfitTactel = productId === 19;
  const isJoggerPoliamida = productId === 20;
  const isCamisetaTech = productId === 21;
  const isCuecaBox = productId === 22;
  const isPoloPoliamida = productId === 24;
  const isCalcaJeansKit = productId === 27;
  const isJaquetaSarja = productId === 26 || productId === 33;
  const isKitBermudasTactel = productId === 28;
  const isKitCamisetaOversized = productId === 23;
  const isMoletomParis = productId === 29;
  const isDogzurbCueca = productId === 30;
  const isJoggerSkinnyAcademia = productId === 31;
  const isTenisAcademia = productId === 32;
  const isCamisaTricot = productId === 34;
  const isPerfumeKit = productId === 35;
  const isPerfumeKit3 = productId === 41;
  const isPerfumeKitDuo = productId === 36;
  const isKitJeans3Promo = productId === 37;
  const isPoloOldMoney = productId === 38;
  const isSueterGolaAlta = productId === 39;
  const isBermudaDryfitPremium = productId === 40;
  const isBodySplashBarbours = productId === 42;
  const isProfitCuecaDryfit = productId === 43;
  const isBermudaMonster2em1 = productId === 44;
  const isKitBarbariusMidtown = productId === 45;
  const isBodySplashBarbariusSolo = productId === 46;
  const isKitParisStreetwear = productId === 47;
  const isTechDailyInsider = productId === 48;
  const isTechDailyInsiderPremium = productId === 49;
  const reviews = isTechDailyInsiderPremium ? techDailyInsiderPremiumReviews : isTechDailyInsider ? techDailyInsiderReviews : isKitParisStreetwear ? kitParisStreetwearReviews : isBodySplashBarbariusSolo ? bodySplashBarbariusSoloReviews : isKitBarbariusMidtown ? kitBarbariusMidtownReviews : isBermudaMonster2em1 ? bermudaMonster2em1Reviews : isProfitCuecaDryfit ? profitCuecaDryfitReviews : isBodySplashBarbours ? bodySplashBarboursReviews : isPerfumeKit3 ? perfumeKit3Reviews : isBermudaDryfitPremium ? bermudaDryfitPremiumReviews : isSueterGolaAlta ? sueterGolaAltaReviews : isPoloOldMoney ? poloOldMoneyReviews : isKitJeans3Promo ? kitJeans3PromoReviews : isPerfumeKitDuo ? perfumeKitDuoReviews : isPerfumeKit ? perfumeKitReviews : isCamisaTricot ? camisaTricotReviews : isTenisAcademia ? tenisAcademiaReviews : isJoggerSkinnyAcademia ? joggerSkinnyAcademiaReviews : isDogzurbCueca ? dogzurbCuecaReviews : isMoletomParis ? moletomParisReviews : isKitCamisetaOversized ? kitCamisetaOversizedReviews : isKitBermudasTactel ? kitBermudasTactelReviews : isJaquetaSarja ? jaquetaSarjaReviews : isCalcaJeansKit ? calcaJeansKitReviews : isPoloPoliamida ? poloPoliamidaReviews : isCuecaBox ? cuecaBoxReviews : isCamisetaTech ? camisetaTechReviews : isJoggerPoliamida ? joggerPoliamidaReviews : isDryfitTactel ? dryfitTactelReviews : isCalcaRetaSarja ? calcaRetaSarjaReviews : isShortsCompressao ? shortsCompressaoReviews : isAriel ? arielReviews : isAlfaGelato ? alfaGelatoReviews : isShortLinho ? shortLinhoReviews : isHavoc ? havocReviews : isTitan ? titanReviews : isTenis ? tenisSlipOnReviews : isAlfaiataria ? alfaiatariaReviews : isVulcan ? vulcanReviews : isNautilus ? nautilusReviews : isJeans ? jeansReviews : poloReviews;
  const totalReviews = isTechDailyInsiderPremium ? 392 : isTechDailyInsider ? 458 : isKitParisStreetwear ? 612 : isBodySplashBarbariusSolo ? 387 : isKitBarbariusMidtown ? 524 : isBermudaMonster2em1 ? 689 : isProfitCuecaDryfit ? 542 : isBodySplashBarbours ? 612 : isPerfumeKit3 ? 587 : isBermudaDryfitPremium ? 478 : isSueterGolaAlta ? 386 : isKitJeans3Promo ? 524 : isPerfumeKitDuo ? 487 : isPerfumeKit ? 632 : isCamisaTricot ? 1247 : isTenisAcademia ? 348 : isJoggerSkinnyAcademia ? 264 : isDogzurbCueca ? 487 : isMoletomParis ? 268 : isKitBermudasTactel ? 412 : isJaquetaSarja ? 297 : isCalcaJeansKit ? 386 : isPoloPoliamida ? 412 : isCuecaBox ? 523 : isCamisetaTech ? 342 : isJoggerPoliamida ? 287 : isDryfitTactel ? 320 : isShortsCompressao ? 448 : isAriel ? 158 : isAlfaGelato ? 79 : isShortLinho ? 312 : isHavoc ? 469 : isTitan ? 404 : isTenis ? 120 : isAlfaiataria ? 312 : isVulcan ? 207 : isNautilus ? 53 : isJeans ? 158 : 91;
  const avgRating = isTechDailyInsiderPremium ? 4.9 : isTechDailyInsider ? 4.9 : isKitParisStreetwear ? 4.9 : isBodySplashBarbariusSolo ? 4.9 : isKitBarbariusMidtown ? 4.9 : isBermudaMonster2em1 ? 4.9 : isProfitCuecaDryfit ? 4.9 : isBodySplashBarbours ? 4.9 : isPerfumeKit3 ? 4.9 : isBermudaDryfitPremium ? 4.9 : isSueterGolaAlta ? 4.9 : isKitJeans3Promo ? 4.9 : isPerfumeKitDuo ? 4.9 : isPerfumeKit ? 4.9 : isCamisaTricot ? 4.9 : isTenisAcademia ? 4.9 : isJoggerSkinnyAcademia ? 4.9 : isDogzurbCueca ? 4.9 : isMoletomParis ? 4.9 : isKitBermudasTactel ? 4.9 : isJaquetaSarja ? 4.9 : isCalcaJeansKit ? 4.9 : isPoloPoliamida ? 4.9 : isCuecaBox ? 4.9 : isCamisetaTech ? 4.9 : isJoggerPoliamida ? 4.9 : isDryfitTactel ? 4.9 : isShortsCompressao ? 4.8 : isAriel ? 5.0 : isAlfaGelato ? 4.9 : isShortLinho ? 4.9 : isHavoc ? 5.0 : isTitan ? 4.9 : isTenis ? 4.9 : isAlfaiataria ? 4.9 : isVulcan ? 5.0 : isNautilus ? 5.0 : isJeans ? 5.0 : 4.9;
  const ratingBreakdown = isTenisAcademia
    ? [
        { stars: 5, count: 322 },
        { stars: 4, count: 20 },
        { stars: 3, count: 4 },
        { stars: 2, count: 1 },
        { stars: 1, count: 1 },
      ]
    : isKitBermudasTactel
    ? [
        { stars: 5, count: 380 },
        { stars: 4, count: 25 },
        { stars: 3, count: 5 },
        { stars: 2, count: 1 },
        { stars: 1, count: 1 },
      ]
    : isJaquetaSarja
    ? [
        { stars: 5, count: 274 },
        { stars: 4, count: 18 },
        { stars: 3, count: 3 },
        { stars: 2, count: 1 },
        { stars: 1, count: 1 },
      ]
    : isCalcaJeansKit
    ? [
        { stars: 5, count: 354 },
        { stars: 4, count: 25 },
        { stars: 3, count: 5 },
        { stars: 2, count: 1 },
        { stars: 1, count: 1 },
      ]
    : isPoloPoliamida
    ? [
        { stars: 5, count: 378 },
        { stars: 4, count: 26 },
        { stars: 3, count: 5 },
        { stars: 2, count: 2 },
        { stars: 1, count: 1 },
      ]
    : isCuecaBox
    ? [
        { stars: 5, count: 478 },
        { stars: 4, count: 33 },
        { stars: 3, count: 8 },
        { stars: 2, count: 2 },
        { stars: 1, count: 2 },
      ]
    : isCamisetaTech
    ? [
        { stars: 5, count: 261 },
        { stars: 4, count: 19 },
        { stars: 3, count: 5 },
        { stars: 2, count: 1 },
        { stars: 1, count: 1 },
      ]
    : isDryfitTactel
    ? [
        { stars: 5, count: 295 },
        { stars: 4, count: 18 },
        { stars: 3, count: 5 },
        { stars: 2, count: 1 },
        { stars: 1, count: 1 },
      ]
    : isAriel
    ? [
        { stars: 5, count: 161 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ]
    : isAlfaGelato
    ? [
        { stars: 5, count: 73 },
        { stars: 4, count: 6 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ]
    : isShortLinho
    ? [
        { stars: 5, count: 461 },
        { stars: 4, count: 10 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
      ]
    : isTitan
    ? [
        { stars: 5, count: 424 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 7 },
      ]
    : isTenis
    ? [
        { stars: 5, count: 105 },
        { stars: 4, count: 10 },
        { stars: 3, count: 3 },
        { stars: 2, count: 1 },
        { stars: 1, count: 1 },
      ]
    : isAlfaiataria
    ? [
        { stars: 5, count: 290 },
        { stars: 4, count: 15 },
        { stars: 3, count: 4 },
        { stars: 2, count: 2 },
        { stars: 1, count: 1 },
      ]
    : isVulcan
    ? [
        { stars: 5, count: 225 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 1 },
      ]
    : isNautilus
    ? [
        { stars: 5, count: 168 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 2 },
        { stars: 1, count: 11 },
      ]
    : isJeans
    ? [
        { stars: 5, count: 170 },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 3 },
      ]
    : [
        { stars: 5, count: 135 },
        { stars: 4, count: 9 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 5 },
      ];

  const maxCount = Math.max(...ratingBreakdown.map((r) => r.count), 1);

  return (
    <div className="mt-16 border-t border-border pt-10">
      {/* Trust Block */}
      <div className="text-center mb-10 max-w-md mx-auto">
        <Lock className="w-6 h-6 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-bold text-foreground mb-2">
          Elegância com confiança
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Marca brasileira com atendimento real, envio nacional com rastreio e compra 100% protegida. Você acompanha cada etapa do pedido com segurança.
        </p>
      </div>

      {/* Verified Badge */}
      <div className="flex justify-center mb-8">
        <span className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-sm font-medium px-4 py-2 rounded-full">
          <CheckCircle className="w-4 h-4" />
          Avaliações Verificadas
        </span>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          O que nossos clientes dizem
        </h2>
      </div>

      {/* Rating Summary */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10 bg-secondary/30 border border-border rounded-xl p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-5xl font-bold text-foreground">{avgRating}</p>
          <div className="flex justify-center mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Baseado em <strong className="text-foreground">{totalReviews}</strong> avaliações
          </p>
        </div>
        <div className="space-y-1.5 w-full max-w-xs">
          {ratingBreakdown.map((row) => (
            <div key={row.stars} className="flex items-center gap-2 text-sm">
              <span className="w-16 text-muted-foreground shrink-0">{row.stars} estrelas</span>
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${(row.count / maxCount) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-muted-foreground">{row.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendation Banner */}
      <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3.5 max-w-2xl mx-auto mb-10">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-sm font-semibold text-emerald-700">
          100% dos clientes recomendam este produto
        </p>
      </div>

      {/* Leave Review Button */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <MessageSquarePlus className="w-4 h-4" />
          {showForm ? "Cancelar" : "Deixar Avaliação"}
        </button>
      </div>

      {/* Review Form (decorative) */}
      {showForm && (
        <div className="max-w-2xl mx-auto mb-10 border border-border rounded-xl p-6 space-y-5 bg-secondary/20">
          <h3 className="text-lg font-bold text-foreground">Sua Avaliação</h3>

          {/* Star Rating */}
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Nota</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onMouseEnter={() => setFormHover(s)}
                  onMouseLeave={() => setFormHover(0)}
                  onClick={() => setFormRating(s)}
                  className="p-0.5"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      s <= (formHover || formRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-border"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Nome</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Seu nome"
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Review Text */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Comentário</label>
            <textarea
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              placeholder="Conte sua experiência com o produto..."
              rows={3}
              className="w-full border border-border rounded-lg px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Foto (opcional)</label>
            <label className="inline-flex items-center gap-2 border border-dashed border-border rounded-lg px-4 py-3 cursor-pointer hover:bg-secondary/40 transition-colors text-sm text-muted-foreground">
              <Camera className="w-4 h-4" />
              {formImage ? "Foto selecionada ✓" : "Adicionar foto"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setFormImage(URL.createObjectURL(file));
                }}
              />
            </label>
            {formImage && (
              <div className="mt-2 relative inline-block">
                <img src={formImage} alt="Preview" className="w-20 h-20 rounded-lg object-cover border border-border" />
                <button
                  onClick={() => setFormImage(null)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Submit (does nothing) */}
          <button
            type="button"
            onClick={() => {
              toast.success("Obrigado pela sua avaliação! Ela será analisada antes de ser publicada.");
              setShowForm(false);
              setFormRating(0);
              setFormName("");
              setFormText("");
              setFormImage(null);
            }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Enviar Avaliação
          </button>
        </div>
      )}

      {/* Individual Reviews */}
      <div className="flex flex-col gap-4 max-w-2xl mx-auto">
        {reviews.map((review, idx) => (
          <div key={idx} className="border border-border rounded-lg p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{review.name}</p>
                  <p className="text-xs text-muted-foreground">{review.date}</p>
                </div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-3.5 h-3.5 ${
                      s <= review.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-border"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
            {review.image && (
              <img
                src={review.image}
                alt={`Foto da avaliação de ${review.name}`}
                loading="lazy"
                className="mt-2 w-full max-w-xs rounded-lg border border-border object-cover"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
