import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface Product {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  rating: number;
  reviewsCount: string;
}

const topSellingData: Product[] = [
  {
    id: "vertical-striped-shirt",
    name: "Vertical Striped Shirt",
    image: "/Home-topselling-img1.png",
    price: 212,
    originalPrice: 232,
    discount: "-20%",
    rating: 5.0,
    reviewsCount: "5.0/5",
  },
  {
    id: "courage-graphic-t-shirt",
    name: "Courage Graphic T-shirt",
    image: "/Home-topselling-img2.png",
    price: 145,
    rating: 4.0,
    reviewsCount: "4.0/5",
  },
  {
    id: "loose-fit-bermuda-shorts",
    name: "Loose Fit Bermuda Shorts",
    image: "/Home-topselling-img3.png",
    price: 80,
    rating: 3.0,
    reviewsCount: "3.0/5",
  },
  {
    id: "faded-skinny-jeans",
    name: "Faded Skinny Jeans",
    image: "/Home-topselling-img4.png",
    price: 210,
    rating: 4.5,
    reviewsCount: "4.5/5",
  },
];

export default function TopSelling() {
  return (
    <section className="py-12 sm:py-16 bg-white border-b border-black/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <h2 className="text-center text-3xl sm:text-4xl md:text-[48px] font-bold tracking-tight text-black mb-8 sm:mb-12 font-integral uppercase">
          TOP SELLING
        </h2>

        {/* Products Grid - 2 columns on mobile/425px, 4 columns on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {topSellingData.map((product) => (
            <div key={product.id} className="flex flex-col group">
              {/* Image Container */}
              <div className="w-full h-[298px] bg-[#F0EEED] rounded-[20px] overflow-hidden relative mb-4 flex items-center justify-center p-4">
                <Image
                  src={product.image}
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
                          ratingValue <= Math.floor(product.rating)
                            ? "fill-current"
                            : ratingValue - product.rating <= 0.5
                            ? "fill-current opacity-70"
                            : "text-gray-300 fill-gray-300"
                        }`}
                      />
                    );
                  })}
                </div>
                <span className="text-xs sm:text-sm text-black/60">
                  {product.reviewsCount}
                </span>
              </div>

              {/* Price & Discount */}
              <div className="flex items-center gap-3">
                <span className="text-xl sm:text-2xl font-bold text-black">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl sm:text-2xl font-bold text-black/40 line-through">
                    ${product.originalPrice}
                  </span>
                )}
                {product.discount && (
                  <span className="bg-[#FF3333]/10 text-[#FF3333] text-xs font-medium px-2.5 py-1 rounded-full">
                    {product.discount}
                  </span>
                )}
              </div>
            </div>
          ))}
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