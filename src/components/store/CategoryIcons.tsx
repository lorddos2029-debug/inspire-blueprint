import { Link } from "react-router-dom";

const categories = [
  {
    label: "Cama",
    icon: "🛏️",
    href: "/?q=cama#tudo-para-sua-casa",
    color: "bg-blue-50"
  },
  {
    label: "Mesa",
    icon: "🍽️",
    href: "/?q=mesa#tudo-para-sua-casa",
    color: "bg-orange-50"
  },
  {
    label: "Banho",
    icon: "🚿",
    href: "/?q=banho#tudo-para-sua-casa",
    color: "bg-cyan-50"
  },
  {
    label: "Eletro",
    icon: "🔌",
    href: "/?q=eletro#tudo-para-sua-casa",
    color: "bg-purple-50"
  },
  {
    label: "Cozinha",
    icon: "🍳",
    href: "/?q=cozinha#tudo-para-sua-casa",
    color: "bg-red-50"
  },
  {
    label: "Ofertas",
    icon: "🏷️",
    href: "/#tudo-para-sua-casa",
    color: "bg-green-50"
  }
];

const CategoryIcons = () => {
  return (
    <section className="py-8 bg-background overflow-hidden">
      <div className="container">
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.href}
              className="flex flex-col items-center gap-3 shrink-0 snap-center group"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${cat.color} border border-border flex items-center justify-center text-2xl md:text-3xl transition-transform group-hover:scale-110 shadow-sm`}>
                {cat.icon}
              </div>
              <span className="text-xs md:text-sm font-semibold text-foreground tracking-wide uppercase">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryIcons;
