const categories = [
  {
    name: "CAMISETAS",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
  },
  {
    name: "CALÇAS",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
  },
  {
    name: "BERMUDAS",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80",
  },
  {
    name: "ACESSÓRIOS",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&q=80",
  },
];

const CategoryGrid = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <h2 className="text-center text-xs tracking-[0.3em] font-semibold text-muted-foreground mb-12">
          CATEGORIAS
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group relative aspect-[3/4] overflow-hidden cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors" />
              <div className="absolute inset-0 flex items-end p-6">
                <span className="text-primary-foreground text-sm tracking-[0.2em] font-semibold">
                  {cat.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
