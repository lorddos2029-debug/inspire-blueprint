import Header from "@/components/store/Header";
import HeroBanner from "@/components/store/HeroBanner";
import BenefitGrid from "@/components/store/BenefitGrid";
import CategoryIcons from "@/components/store/CategoryIcons";
import ProductGrid from "@/components/store/ProductGrid";
import LifestyleSection from "@/components/store/LifestyleSection";
import GuaranteeBanners from "@/components/store/GuaranteeBanners";
import AboutUs from "@/components/store/AboutUs";
import HomeFAQ from "@/components/store/HomeFAQ";
import Newsletter from "@/components/store/Newsletter";
import Footer from "@/components/store/Footer";
import ExitIntentPopup from "@/components/store/ExitIntentPopup";
import { products } from "@/data/products";

const Index = () => {
  // Filtros para coleções lifestyle
  const winterProducts = products.filter(p => 
    p.slug.includes("sherpa") || p.slug.includes("cobertor") || p.slug.includes("cobre-leito")
  );
  
  const kitchenProducts = products.filter(p => 
    p.slug.includes("panela") || p.slug.includes("liquidificador") || p.slug.includes("escova-de-limpeza")
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <BenefitGrid />
      <CategoryIcons />
      
      <ProductGrid />
      
      <LifestyleSection 
        title="Inverno Aconchegante"
        subtitle="Transforme suas noites com o toque extra macio da nossa linha Sherpa e Flannel. Calor e conforto garantidos."
        products={winterProducts}
        bannerImage="/assets/hero-belacasa.jpg"
        slug="inverno"
      />
      
      <LifestyleSection 
        title="Cozinha de Chef"
        subtitle="A praticidade que você merece para preparar suas melhores receitas com tecnologia antiaderente e turbo."
        products={kitchenProducts}
        bannerImage="/assets/products-bc/bianco-v1/img-1.png"
        themeColor="bg-background"
        reverse={true}
        slug="cozinha"
      />
      
      <GuaranteeBanners />
      <AboutUs />
      <HomeFAQ />
      <Newsletter />
      <Footer />
      <ExitIntentPopup />
    </div>
  );
};

export default Index;

