import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Header from "@/components/layout/Header";
import Hero from "@/components/sections/home/Hero";
import BrandMarquee from "@/components/sections/home/BrandMarquee";
import NewArrivals from "@/components/sections/home/NewArrivals";
import TopSelling from "@/components/sections/home/TopSelling";
import BrowseByStyle from "@/components/sections/home/BrowseByStyle";
import Testimonials from "@/components/sections/home/Testimonials";
import Footer from "@/components/layout/Footer";

export default async function Home() {
  const user = await currentUser();

  // Agar user logged in hai aur uska role admin hai, toh direct dashboard par bhej do
  if (user) {
    const role = (user.publicMetadata as { role?: string })?.role;
    if (role === "admin") {
      redirect("/dashboard");
    }
  }

  return (
    <main>
      <Header />
      <Hero />
      <BrandMarquee />
      <NewArrivals />
      <TopSelling />
      <BrowseByStyle />
      <Testimonials />
      <Footer />
    </main>
  );
}