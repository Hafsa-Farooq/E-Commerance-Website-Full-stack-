import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function NewArrivals() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    take: 4,
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      reviews: true,
    },
  });

  if (products.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="text-center text-3xl sm:text-4xl md:text-[48px] font-bold tracking-tight text-black mb-8 sm:mb-12 font-integral uppercase">
          NEW ARRIVALS
        </h2>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => {
            const basePrice = Number(product.basePrice);
            const discountPrice = product.discountPrice ? Number(product.discountPrice) : null;
            const displayPrice = discountPrice ?? basePrice;
            const hasDiscount = discountPrice !== null && discountPrice < basePrice;
            const discountPercent = hasDiscount
              ? Math.round(((basePrice - (discountPrice as number)) / basePrice) * 100)
              : 0;

            const avgRating = product.reviews.length > 0
              ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
              : 5;

            const imageUrl = product.images[0]?.url || "/Home-newarrival-img1.png";

            return (
              <Link key={product.id} href={`/product/${product.slug}`} className="flex flex-col group">
                {/* Image Container */}
                <div className="w-full h-[298px] bg-[#F0EEED] rounded-[20px] overflow-hidden relative mb-4 flex items-center justify-center p-4">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Product Info */}
                <h3 className="font-bold text-base sm:text-lg text-black truncate mb-1">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="flex items-center text-yellow-400">
                    {[...Array(5)].map((_, i) => {
                      const ratingValue = i + 1;
                      return (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            ratingValue <= Math.floor(avgRating)
                              ? "fill-current"
                              : ratingValue - avgRating <= 0.5
                              ? "fill-current opacity-70"
                              : "text-gray-300 fill-gray-300"
                          }`}
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs sm:text-sm text-black/60">
                    {avgRating.toFixed(1)}/5
                  </span>
                </div>

                {/* Price & Discount */}
                <div className="flex items-center gap-3">
                  <span className="text-xl sm:text-2xl font-bold text-black">
                    ${displayPrice.toString()}
                  </span>
                  {hasDiscount && (
                    <span className="text-xl sm:text-2xl font-bold text-black/40 line-through">
                      ${basePrice.toString()}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-[#FF3333]/10 text-[#FF3333] text-xs font-medium px-2.5 py-1 rounded-full">
                      -{discountPercent}%
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="flex justify-center mt-9 sm:mt-12">
          <Link
            href="/shop"
            className="w-full sm:w-[218px] h-[52px] rounded-full border border-black/10 flex items-center justify-center text-black font-medium hover:bg-black hover:text-white transition-all duration-300"
          >
            View All
          </Link>
        </div>
      </div>
    </section>
  );
}