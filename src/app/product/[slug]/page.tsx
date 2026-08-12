import React from "react";
import Header from "@/components/layout/Header";
import ProductDetailSection from "@/components/sections/product/ProductDetailSection";
import ProductReviews from "@/components/sections/product/ProductReviews";
import RelatedProducts from "@/components/sections/product/RelatedProducts";
import Footer from "@/components/layout/Footer";

export default function ProductDetailPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header/>
      <ProductDetailSection />
      <ProductReviews />
      <RelatedProducts />
      <Footer />
    </main>
  );
}