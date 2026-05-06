import { Link } from "react-router-dom";

const categories = [
  { name: "CAMA & BANHO", image: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80" },
  { name: "MESA POSTA", image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80" },
  { name: "ELETROPORTÁTEIS", image: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80" },
  { name: "ORGANIZAÇÃO", image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=800&q=80" },
];

const CategoryGrid = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.4em] font-semibold text-[hsl(var(--gold))]">CATEGORIAS</span>
          <h2 className="font-display text-4xl md:text-5xl font-medium text-primary mt-3">
            Curadoria para o seu lar
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link to="/" key={cat.name} className="group relative aspect-[3/4] overflow-hidden cursor-pointer rounded-md">
              <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/20 to-transparent" />
              <div className="absolute inset-0 flex items-end p-5">
                <span className="text-primary-foreground text-xs md:text-sm tracking-[0.25em] font-semibold">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
