import Header from "@/components/layout/Header";
import Hero from "@/components/sections/home/Hero";
import BrandMarquee from "@/components/sections/home/BrandMarquee";
import NewArrivals from "@/components/sections/home/NewArrivals";
import TopSelling from "@/components/sections/home/TopSelling";
import BrowseByStyle from "@/components/sections/home/BrowseByStyle";
import Testimonials from "@/components/sections/home/Testimonials";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <BrandMarquee/>
      <NewArrivals/>
      <TopSelling/>
      <BrowseByStyle/>
      <Testimonials/>
      <Footer/>
    </main>
  );
}