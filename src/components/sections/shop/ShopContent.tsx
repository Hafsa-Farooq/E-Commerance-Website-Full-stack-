"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, ChevronRight, SlidersHorizontal, ChevronDown, X, Check } from "lucide-react";

export default function ShopPage() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("Large");
  const [selectedColor, setSelectedColor] = useState("bg-[#FF3333]");

  const categories = [
    { name: "T-shirts", count: "" },
    { name: "Shorts", count: "" },
    { name: "Shirts", count: "" },
    { name: "Hoodie", count: "" },
    { name: "Jeans", count: "" },
  ];

  const colors = [
    "bg-[#00C12B]", "bg-[#F50606]", "bg-[#F5DD06]", "bg-[#F57906]", 
    "bg-[#06CAF5]", "bg-[#063AF5]", "bg-[#7D06F5]", "bg-[#F506A2]", 
    "bg-[#FFFFFF] border border-black/20", "bg-[#000000]"
  ];

  const sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"];

  const dressStyles = ["Casual", "Formal", "Party", "Gym"];

  const products = [
    {
      id: 1,
      title: "Gradient Graphic T-shirt",
      image: "/Product-related-img2.png",
      rating: "3.5",
      price: 145,
      originalPrice: 242,
      discount: "-20%",
    },
    {
      id: 2,
      title: "Polo with Tipping Details",
      image: "/Product-related-img3.png",
      rating: "4.5",
      price: 180,
      originalPrice: 242,
      discount: "-20%",
    },
    {
      id: 3,
      title: "Black Striped T-shirt",
      image: "/Product-related-img4.png",
      rating: "5.0",
      price: 120,
      originalPrice: 150,
      discount: "-30%",
    },
    {
      id: 4,
      title: "Skinny Fit Jeans",
      image: "/Home-newarrival-img2.png",
      rating: "3.5",
      price: 240,
      originalPrice: 260,
      discount: "-20%",
    },
    {
      id: 5,
      title: "Checkered Shirt",
      image: "/Home-newarrival-img3.png",
      rating: "4.5",
      price: 180,
      originalPrice: null,
      discount: null,
    },
    {
      id: 6,
      title: "Sleeve Striped T-shirt",
      image: "/Home-newarrival-img4.png",
      rating: "4.5",
      price: 130,
      originalPrice: 160,
      discount: "-30%",
    },
    {
      id: 7,
      title: "Vertical Striped Shirt",
      image: "/Home-topselling-img1.png",
      rating: "5.0",
      price: 212,
      originalPrice: 232,
      discount: "-20%",
    },
    {
      id: 8,
      title: "Courage Graphic T-shirt",
      image: "/Home-topselling-img2.png",
      rating: "4.0",
      price: 145,
      originalPrice: null,
      discount: null,
    },
    {
      id: 9,
      title: "Loose Fit Bermuda Shorts",
      image: "/Home-topselling-img3.png",
      rating: "3.0",
      price: 80,
      originalPrice: null,
      discount: null,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-satoshi">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs sm:text-sm text-black/60 mb-6 gap-2">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 text-black/40 flex-shrink-0" />
        <span className="text-black font-medium">Casual</span>
      </nav>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Desktop Filters Sidebar (Left Column - 3 span) */}
        <div className="hidden lg:block lg:col-span-3 bg-white border border-black/10 rounded-[20px] p-5">
          <div className="flex items-center justify-between pb-5 border-b border-black/10">
            <h3 className="font-bold text-black text-xl">Filters</h3>
            <SlidersHorizontal className="w-5 h-5 text-black/40" />
          </div>

          {/* Categories */}
          <div className="py-5 border-b border-black/10 flex flex-col gap-4">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between text-black/60 hover:text-black cursor-pointer text-sm">
                <span>{cat.name}</span>
                <ChevronRight className="w-4 h-4 text-black/40" />
              </div>
            ))}
          </div>

          {/* Price Range */}
          <div className="py-5 border-b border-black/10 flex flex-col gap-4">
            <div className="flex items-center justify-between font-bold text-black text-base">
              <span>Price</span>
              <ChevronDown className="w-4 h-4 text-black/40" />
            </div>
            <div className="relative flex items-center mt-2">
              <div className="w-full h-1 bg-[#F0F0F0] rounded-full">
                <div className="absolute left-0 right-10 h-1 bg-black rounded-full"></div>
              </div>
              <div className="absolute left-0 w-5 h-5 bg-black rounded-full cursor-pointer"></div>
              <div className="absolute right-10 w-5 h-5 bg-black rounded-full cursor-pointer"></div>
            </div>
            <div className="flex justify-between text-sm font-medium text-black mt-2">
              <span>$50</span>
              <span>$200</span>
            </div>
          </div>

          {/* Colors */}
          <div className="py-5 border-b border-black/10 flex flex-col gap-4">
            <div className="flex items-center justify-between font-bold text-black text-base">
              <span>Colors</span>
              <ChevronDown className="w-4 h-4 text-black/40" />
            </div>
            <div className="grid grid-cols-5 gap-3 pt-1">
              {colors.map((colorClass, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedColor(colorClass)}
                  className={`w-9 h-9 rounded-full ${colorClass} flex items-center justify-center transition-transform hover:scale-105 cursor-pointer`}
                >
                  {selectedColor === colorClass && <Check className={`w-4 h-4 ${colorClass.includes("white") ? "text-black" : "text-white"}`} />}
                </button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div className="py-5 border-b border-black/10 flex flex-col gap-4">
            <div className="flex items-center justify-between font-bold text-black text-base">
              <span>Size</span>
              <ChevronDown className="w-4 h-4 text-black/40" />
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    selectedSize === size
                      ? "bg-black text-white"
                      : "bg-[#F0F0F0] text-black/60 hover:bg-black/10"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Dress Style */}
          <div className="py-5 flex flex-col gap-4">
            <div className="flex items-center justify-between font-bold text-black text-base">
              <span>Dress Style</span>
              <ChevronDown className="w-4 h-4 text-black/40" />
            </div>
            {dressStyles.map((style, idx) => (
              <div key={idx} className="flex items-center justify-between text-black/60 hover:text-black cursor-pointer text-sm">
                <span>{style}</span>
                <ChevronRight className="w-4 h-4 text-black/40" />
              </div>
            ))}
          </div>

          <button className="w-full bg-black text-white font-medium py-3.5 rounded-full mt-4 hover:bg-black/80 transition-colors cursor-pointer text-sm">
            Apply Filter
          </button>
        </div>

        {/* Product Listing Area (Right Column - 9 span) */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* Header Row: Title & Sorting */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-[32px] font-bold text-black">Casual</h1>
              <span className="text-xs sm:text-sm text-black/60">Showing 1-10 of 100 Products</span>
            </div>

            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="text-xs sm:text-sm text-black/60">Sort by: <span className="text-black font-medium">Most Popular</span></span>
              <ChevronDown className="w-4 h-4 text-black cursor-pointer" />
              
              {/* Mobile Filter Toggle Button */}
              <button 
                onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden p-2.5 bg-[#F0F0F0] rounded-full text-black flex items-center justify-center cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {products.map((product) => (
              <div key={product.id} className="flex flex-col gap-2.5 sm:gap-3 group cursor-pointer">
                <div className="w-full h-[170px] sm:h-[298px] rounded-[16px] sm:rounded-[20px] bg-[#F0EEED] relative overflow-hidden flex items-center justify-center border border-black/5">
                  <Image 
                    src={product.image} 
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-sm sm:text-lg text-black truncate">{product.title}</h3>
                  
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div className="flex items-center text-[#FFC633] gap-0.5 sm:gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] sm:text-xs text-black font-medium">{product.rating}<span className="text-black/60">/5</span></span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 mt-0.5 sm:mt-1">
                    <span className="text-base sm:text-xl font-bold text-black">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-base sm:text-xl font-bold text-black/40 line-through">${product.originalPrice}</span>
                    )}
                    {product.discount && (
                      <span className="bg-[#FF3333]/10 text-[#FF3333] text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full">
                        {product.discount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-black/10 pt-6 mt-4">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-black/10 rounded-lg text-xs sm:text-sm font-medium text-black hover:border-black transition-colors">
              Previous
            </button>

            <div className="hidden sm:flex items-center gap-1">
              <button className="w-10 h-10 rounded-lg bg-[#F0F0F0] text-black font-medium text-sm flex items-center justify-center">1</button>
              <button className="w-10 h-10 rounded-lg text-black/60 font-medium text-sm flex items-center justify-center hover:bg-black/5">2</button>
              <button className="w-10 h-10 rounded-lg text-black/60 font-medium text-sm flex items-center justify-center hover:bg-black/5">3</button>
              <span className="px-2 text-black/40">...</span>
              <button className="w-10 h-10 rounded-lg text-black/60 font-medium text-sm flex items-center justify-center hover:bg-black/5">10</button>
            </div>

            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-black/10 rounded-lg text-xs sm:text-sm font-medium text-black hover:border-black transition-colors">
              Next
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Filters Bottom Sheet Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end justify-center lg:hidden">
          <div className="w-full bg-white rounded-t-[20px] max-h-[85vh] overflow-y-auto p-5 flex flex-col justify-between animate-in slide-in-from-bottom duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-black/10">
                <h3 className="font-bold text-black text-xl">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1 text-black cursor-pointer">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Filter Content */}
              <div className="py-4 flex flex-col gap-6">
                {/* Categories */}
                <div className="border-b border-black/10 pb-4">
                  <h4 className="font-bold text-black mb-3">Categories</h4>
                  {categories.map((cat, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between text-black/65 hover:text-black text-sm cursor-pointer">
                      <span>{cat.name}</span>
                      <ChevronRight className="w-4 h-4 text-black/40" />
                    </div>
                  ))}
                </div>

                {/* Price Range */}
                <div className="border-b border-black/10 pb-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between font-bold text-black text-base">
                    <span>Price</span>
                    <ChevronDown className="w-4 h-4 text-black/40" />
                  </div>
                  <div className="relative flex items-center mt-2">
                    <div className="w-full h-1 bg-[#F0F0F0] rounded-full">
                      <div className="absolute left-0 right-10 h-1 bg-black rounded-full"></div>
                    </div>
                    <div className="absolute left-0 w-4 h-4 bg-black rounded-full cursor-pointer"></div>
                    <div className="absolute right-10 w-4 h-4 bg-black rounded-full cursor-pointer"></div>
                  </div>
                  <div className="flex justify-between text-xs font-medium text-black mt-1">
                    <span>$50</span>
                    <span>$200</span>
                  </div>
                </div>

                {/* Colors */}
                <div className="border-b border-black/10 pb-4">
                  <h4 className="font-bold text-black mb-3">Colors</h4>
                  <div className="grid grid-cols-5 gap-3">
                    {colors.map((colorClass, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(colorClass)}
                        className={`w-9 h-9 rounded-full ${colorClass} flex items-center justify-center cursor-pointer`}
                      >
                        {selectedColor === colorClass && <Check className={`w-4 h-4 ${colorClass.includes("white") ? "text-black" : "text-white"}`} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div className="border-b border-black/10 pb-4">
                  <h4 className="font-bold text-black mb-3">Size</h4>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-2 rounded-full text-xs font-medium cursor-pointer ${
                          selectedSize === size ? "bg-black text-white" : "bg-[#F0F0F0] text-black/60"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dress Style */}
                <div>
                  <h4 className="font-bold text-black mb-3">Dress Style</h4>
                  {dressStyles.map((style, idx) => (
                    <div key={idx} className="py-1.5 flex items-center justify-between text-black/65 hover:text-black text-sm cursor-pointer">
                      <span>{style}</span>
                      <ChevronRight className="w-4 h-4 text-black/40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-black text-white font-medium py-3.5 rounded-full mt-4 cursor-pointer"
            >
              Apply Filter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}