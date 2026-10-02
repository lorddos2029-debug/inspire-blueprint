import { useState } from "react";
import { Star, Lock, CheckCircle, Camera, X, MessageSquarePlus } from "lucide-react";
import { getReviewsForProduct } from "@/data/reviews";
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

  const { reviews, total: totalReviews, avg: avgRating, breakdown: ratingBreakdown } = getReviewsForProduct(productId);
  const isDemoProduct = productId === 40;
  const maxCount = Math.max(...ratingBreakdown.map((r) => r.count), 1);

  return (
    <div className="mt-16 border-t border-border pt-10">
      {/* Trust Block */}
      <div className="text-center mb-10 max-w-md mx-auto">
        <Lock className="w-6 h-6 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-lg font-bold text-foreground mb-2">
          Confiança em cada detalhe do seu lar
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          A BelaCasa é uma marca brasileira com atendimento real, envio nacional com rastreio e compra 100% protegida. Você acompanha cada etapa do pedido com segurança.
        </p>
      </div>

      <div className="flex justify-center mb-8">
        <span className="inline-flex items-center gap-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 text-sm font-medium px-4 py-2 rounded-full">
          <CheckCircle className="w-4 h-4" />
          {isDemoProduct ? "Exemplos de avaliações" : "Avaliações Verificadas"}
        </span>
      </div>

      <div className="text-center mb-10">
        <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
          {isDemoProduct ? "Prévia das avaliações do produto" : "O que nossos clientes dizem"}
        </h2>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10 bg-secondary/30 border border-border rounded-xl p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <p className="text-5xl font-bold text-foreground">{avgRating}</p>
          <div className="flex justify-center mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {isDemoProduct ? (
              <>Mostrando <strong className="text-foreground">{totalReviews}</strong> textos de exemplo</>
            ) : (
              <>Baseado em <strong className="text-foreground">{totalReviews}</strong> avaliações</>
            )}
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

      <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3.5 max-w-2xl mx-auto mb-10">
        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-sm font-semibold text-emerald-700">
          {isDemoProduct
            ? "Textos demonstrativos para prévia do layout de avaliações"
            : "100% dos clientes recomendam este produto"}
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          <MessageSquarePlus className="w-4 h-4" />
          {showForm ? "Cancelar" : "Deixar Avaliação"}
        </button>
      </div>

      {showForm && (
        <div className="max-w-2xl mx-auto mb-10 border border-border rounded-xl p-6 space-y-5 bg-secondary/20">
          <h3 className="text-lg font-bold text-foreground">Sua Avaliação</h3>

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
              <a href={review.image} target="_blank" rel="noopener noreferrer" className="block">
                <img
                  src={review.image}
                  alt={`Foto enviada por ${review.name}`}
                  loading="lazy"
                  className="mt-2 w-32 h-32 rounded-lg object-cover border border-border hover:opacity-90 transition-opacity"
                />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
