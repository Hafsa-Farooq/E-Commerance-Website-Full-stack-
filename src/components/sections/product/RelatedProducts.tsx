"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
}

export default function RelatedProducts() {
  const products: Product[] = [
    {
      id: 1,
      name: "Polo with Contrast Trims",
      image: "/Product-related-img1.png",
      price: 212,
      originalPrice: 242,
      discount: "-20%",
      rating: 4.0,
    },
    {
      id: 2,
      name: "Gradient Graphic T-shirt",
      image: "/Product-related-img2.png",
      price: 145,
      rating: 3.5,
    },
    {
      id: 3,
      name: "Polo with Tipping Details",
      image: "/Product-related-img3.png",
      price: 180,
      rating: 4.5,
    },
    {
      id: 4,
      name: "Black Striped T-shirt",
      image: "/Product-related-img4.png",
      price: 120,
      originalPrice: 150,
      discount: "-30%",
      rating: 5.0,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 font-satoshi border-t border-black/10">
      {/* Section Heading */}
      <h2 className="text-2xl sm:text-[48px] font-bold font-integral uppercase text-center mb-8 sm:mb-14 leading-tight text-black">
        You Might Also Like
      </h2>

      {/* Products Grid (2 columns on mobile, 4 columns on desktop) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {products.map((product) => (
          <div key={product.id} className="flex flex-col group cursor-pointer">
            {/* Image Container */}
            <div className="bg-[#F0EEED] rounded-[20px] overflow-hidden relative w-full h-[180px] sm:h-[298px] mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-[1.02]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover"
              />
            </div>

            {/* Product Info */}
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <h3 className="font-bold text-sm sm:text-lg text-black truncate">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="flex items-center text-[#FFC633] gap-0.5 sm:gap-1">
                  {[...Array(5)].map((_, i) => {
                    const isFilled = i < Math.floor(product.rating);
                    return (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                          isFilled ? "fill-current" : "text-gray-300"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-xs sm:text-sm text-black font-medium">
                  {product.rating}
                  <span className="text-black/60">/5</span>
                </span>
              </div>

              {/* Pricing */}
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <span className="text-lg sm:text-2xl font-bold text-black">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg sm:text-2xl font-bold text-black/40 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-[#FF3333]/10 text-[#FF3333] text-[10px] sm:text-xs font-medium px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full">
                    {product.discount}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}