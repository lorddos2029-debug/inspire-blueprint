import Header from "@/components/store/Header";
import HeroBanner from "@/components/store/HeroBanner";
import TrustMarquee from "@/components/store/TrustMarquee";
import ProductGrid from "@/components/store/ProductGrid";
import GuaranteeBanners from "@/components/store/GuaranteeBanners";
import CategorySections from "@/components/store/CategorySections";

import AboutUs from "@/components/store/AboutUs";
import HomeFAQ from "@/components/store/HomeFAQ";
import Newsletter from "@/components/store/Newsletter";
import Footer from "@/components/store/Footer";
import ExitIntentPopup from "@/components/store/ExitIntentPopup";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroBanner />
      <TrustMarquee />
      <ProductGrid />
      <GuaranteeBanners />
      <CategorySections />
      
      <AboutUs />
      <HomeFAQ />
      <Newsletter />
      <Footer />
      <ExitIntentPopup />
    </div>
  );
};

export default Index;
