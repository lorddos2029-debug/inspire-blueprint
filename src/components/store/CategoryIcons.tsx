import { Link } from "react-router-dom";
import { Bed, Utensils, ShowerHead, Zap, CookingPot, Tag } from "lucide-react";

const categories = [
  {
    label: "Cama",
    icon: Bed,
    href: "/?q=cama#tudo-para-sua-casa",
    color: "bg-primary/5 text-primary"
  },
  {
    label: "Mesa",
    icon: Utensils,
    href: "/?q=mesa#tudo-para-sua-casa",
    color: "bg-primary/5 text-primary"
  },
  {
    label: "Banho",
    icon: ShowerHead,
    href: "/?q=banho#tudo-para-sua-casa",
    color: "bg-primary/5 text-primary"
  },
  {
    label: "Eletro",
    icon: Zap,
    href: "/?q=eletro#tudo-para-sua-casa",
    color: "bg-primary/5 text-primary"
  },
  {
    label: "Cozinha",
    icon: CookingPot,
    href: "/?q=cozinha#tudo-para-sua-casa",
    color: "bg-primary/5 text-primary"
  },
  {
    label: "Ofertas",
    icon: Tag,
    href: "/#tudo-para-sua-casa",
    color: "bg-primary/10 text-primary"
  }
];

const CategoryIcons = () => {
  return (
    <section className="py-10 bg-background overflow-hidden">
      <div className="container overflow-x-auto pb-4 scrollbar-hide cursor-grab active:cursor-grabbing select-none">
        <div className="flex items-center justify-between gap-6 md:gap-10 min-w-max md:min-w-0 md:justify-center px-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.href}
              className="flex flex-col items-center gap-3 shrink-0 group transition-all"
            >
              <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${cat.color} border border-primary/10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground shadow-sm group-hover:shadow-md`}>
                <cat.icon className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
              </div>
              <span className="text-[10px] md:text-[11px] font-bold text-foreground tracking-[0.1em] uppercase group-hover:text-primary transition-colors">
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

