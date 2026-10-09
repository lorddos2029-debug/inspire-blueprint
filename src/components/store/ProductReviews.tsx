import { useState } from "react";
import { Star, Camera, X, MessageSquarePlus } from "lucide-react";
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

  const {
    reviews,
    total: totalReviews,
    avg: avgRating,
    breakdown: ratingBreakdown,
  } = getReviewsForProduct(productId);

  const maxCount = Math.max(...ratingBreakdown.map((row) => row.count), 1);

  return (
    <section className="mt-12 sm:mt-14 w-full min-w-0 max-w-full overflow-hidden border-t border-border pt-8 sm:pt-10">
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="break-words [overflow-wrap:anywhere] text-xl font-extrabold tracking-tight text-foreground">
            Avaliações de clientes
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="max-w-full inline-flex items-center gap-2 border border-border rounded-md px-3 sm:px-4 py-2 text-sm font-semibold text-foreground hover:bg-secondary transition"
        >
          <MessageSquarePlus className="size-4" />
          {showForm ? "Cancelar" : "Deixar avaliação"}
        </button>
      </div>

      {showForm && (
        <div className="mt-6 w-full min-w-0 max-w-2xl border border-border rounded-lg p-4 sm:p-5 space-y-5 bg-secondary/20">
          <h3 className="font-bold text-foreground">Sua avaliação</h3>

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
                    className={`size-7 transition-colors ${
                      s <= (formHover || formRating)
                        ? "fill-primary text-primary"
                        : "text-border"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Nome
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="Seu nome"
              className="w-full border border-border rounded-md px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Comentário
            </label>
            <textarea
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              placeholder="Conte sua experiência com o produto..."
              rows={3}
              className="w-full border border-border rounded-md px-4 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">
              Foto (opcional)
            </label>
            <label className="inline-flex items-center gap-2 border border-dashed border-border rounded-md px-4 py-3 cursor-pointer hover:bg-secondary transition text-sm text-muted-foreground">
              <Camera className="size-4" />
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
                <img
                  src={formImage}
                  alt="Preview"
                  className="size-20 rounded-md object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={() => setFormImage(null)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5"
                >
                  <X className="size-3" />
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              toast.success(
                "Obrigado pela sua avaliação! Ela será analisada antes de ser publicada.",
              );
              setShowForm(false);
              setFormRating(0);
              setFormName("");
              setFormText("");
              setFormImage(null);
            }}
            className="w-full bg-primary text-primary-foreground py-3 rounded-md font-semibold text-sm hover:opacity-90 transition"
          >
            Enviar avaliação
          </button>
        </div>
      )}

      {productId === 116 && (
        <div className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground">
            Avaliações reproduzidas de imagens de outra plataforma fornecidas para referência.
            Não são compras verificadas nesta loja.
          </p>
          <p className="text-sm font-semibold text-foreground">Fotos compartilhadas nas avaliações de referência</p>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => {
              const src = `/assets/products-bc/aoc-roku-43/reviews/review-${n}.png`;
              return (
                <a key={n} href={src} target="_blank" rel="noopener noreferrer" aria-label={`Abrir foto ${n} das avaliações de referência`}>
                  <img src={src} alt={`Foto ${n} de avaliações de referência da TV AOC`} loading="lazy" className="size-20 rounded-md object-cover border border-border hover:opacity-90 transition" />
                </a>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-6 grid w-full min-w-0 grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)] gap-6 md:gap-8">
        <div className="w-full min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black text-foreground">
              {avgRating}
            </span>
            <span className="text-muted-foreground">/5</span>
          </div>

          <div className="mt-2 flex text-primary">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`size-5 ${totalReviews > 0 ? "fill-current" : "text-border"}`} />
            ))}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {totalReviews} avaliações
          </p>

          <div className="mt-4 space-y-1.5">
            {ratingBreakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-sm">
                <span className="w-4 text-muted-foreground">{row.stars}</span>
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${(row.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="w-9 text-right text-muted-foreground">
                  {row.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full min-w-0">
          <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-semibold text-muted-foreground">
              Mais recentes
            </span>
            <span className="text-sm text-muted-foreground">
              {reviews.length} comentários
            </span>
          </div>

          {reviews.length === 0 && <p className="mt-4 text-sm text-muted-foreground">Nenhuma avaliação deste produto foi enviada ainda.</p>}
          <div className="mt-4 space-y-0">
            {reviews.map((review, idx) => (
              <article
                key={idx}
                className="w-full min-w-0 border-b border-border/70 py-5 first:pt-0"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <div className="size-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-bold text-xs shrink-0">
                    {review.name
                      .split(" ")
                      .map((part) => part.charAt(0))
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex min-w-0 flex-wrap items-center justify-between gap-2 sm:gap-3">
                      <div className="min-w-0">
                        <p className="break-words [overflow-wrap:anywhere] text-sm font-bold text-foreground">
                          {review.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {review.date}
                        </p>
                      </div>

                      <div className="flex text-primary">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`size-3.5 ${
                              s <= review.rating
                                ? "fill-current"
                                : "text-border"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="mt-2 max-w-full break-words [overflow-wrap:anywhere] text-sm text-muted-foreground leading-relaxed">
                      {review.text}
                    </p>

                    {(review.images?.length || review.image) && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(review.images ?? (review.image ? [review.image] : [])).map(
                          (image, imageIndex) => (
                            <a
                              key={`${image}-${imageIndex}`}
                              href={image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block"
                            >
                              <img
                                src={image}
                                alt={`Foto enviada por ${review.name}`}
                                loading="lazy"
                                className="size-20 rounded-md object-cover border border-border hover:opacity-90 transition"
                              />
                            </a>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReviews;
