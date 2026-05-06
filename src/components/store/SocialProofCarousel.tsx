import { products } from "@/data/products";

const proofItems = products.slice(0, 6).map((p) => ({
  image: p.image,
  label: [
    "Entrega confirmada",
    "Feedback positivo",
    "Estilo aprovado",
    "Cliente satisfeito",
    "Compra verificada",
    "Recomendado",
  ][p.id % 6],
}));

// Duplicate for seamless loop
const allItems = [...proofItems, ...proofItems];

const SocialProofCarousel = () => {
  return (
    <div className="mt-10 mb-6 space-y-5">
      <p className="text-center text-base text-foreground">
        Mais de <strong>50.000 clientes</strong> já compraram na Alpha Oficial
      </p>

      <div className="overflow-hidden">
        <div className="flex gap-3 animate-marquee w-max">
          {allItems.map((item, idx) => (
            <div
              key={idx}
              className="flex-shrink-0 w-[120px] flex flex-col items-center gap-2"
            >
              <div className="w-[120px] h-[150px] rounded-xl overflow-hidden bg-secondary">
                <img
                  src={item.image}
                  alt={item.label}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[11px] font-medium text-foreground text-center leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialProofCarousel;
