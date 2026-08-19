import React from "react";
import { notFound } from "next/navigation";
import Header from "@/components/layout/Header";
import ProductDetailSection from "@/components/sections/product/ProductDetailSection";
import ProductReviews from "@/components/sections/product/ProductReviews";
import RelatedProducts from "@/components/sections/product/RelatedProducts";
import Footer from "@/components/layout/Footer";
import { prisma } from "@/lib/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      variants: true,
      reviews: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: { images: true, reviews: true },
    take: 4,
  });

  // Convert Decimal fields to plain numbers for client components
  const serializedProduct = {
    ...product,
    basePrice: Number(product.basePrice),
    discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
    variants: product.variants.map((v) => ({
      ...v,
      priceOverride: v.priceOverride ? Number(v.priceOverride) : null,
    })),
    createdAt: product.createdAt.toISOString(),
  };

  const serializedRelated = relatedProducts.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    discountPrice: p.discountPrice ? Number(p.discountPrice) : null,
  }));

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <ProductDetailSection product={serializedProduct as any} />
      <ProductReviews product={serializedProduct as any} />
      <RelatedProducts products={serializedRelated as any} />
      <Footer />
    </main>
  );
}