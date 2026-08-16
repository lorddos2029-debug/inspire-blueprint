import ProductCard from "./ProductCard";
import { Product } from "@/data/products";
import SafeLink from "@/components/SafeLink";
import { ChevronRight } from "lucide-react";

interface LifestyleSectionProps {
  title: string;
  subtitle: string;
  products: Product[];
  bannerImage: string;
  themeColor?: string;
  reverse?: boolean;
  slug: string;
}

const LifestyleSection = ({ 
  title, 
  subtitle, 
  products, 
  bannerImage, 
  themeColor = "bg-secondary/30",
  reverse = false,
  slug
}: LifestyleSectionProps) => {
  return (
    <section className={`py-12 md:py-20 ${themeColor}`}>
      <div className="container">
        <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-8 lg:gap-12 items-center`}>
          {/* Banner da Coleção */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="space-y-2">
              <h2 className="font-display text-3xl md:text-5xl font-medium text-primary leading-tight">
                {title}
              </h2>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {subtitle}
              </p>
            </div>
            
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-xl">
              <img 
                src={bannerImage} 
                alt={title} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <SafeLink 
                  to={`/?q=${slug}#tudo-para-sua-casa`}
                  className="bg-background text-foreground px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Ver Coleção <ChevronRight className="w-4 h-4" />
                </SafeLink>
              </div>
            </div>
          </div>

          {/* Grid de Produtos da Coleção */}
          <div className="w-full lg:w-2/3">
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LifestyleSection;
