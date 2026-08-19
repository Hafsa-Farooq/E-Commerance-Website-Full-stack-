import React from "react";
import Header from "@/components/layout/Header";
import CheckoutSection from "@/components/sections/checkout/CheckoutSection";
import Footer from "@/components/layout/Footer";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <CheckoutSection />
      <Footer />
    </main>
  );
}