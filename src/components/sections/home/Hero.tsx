import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative bg-[#F2F0F1] overflow-hidden pt-10 md:pt-16 lg:pt-24">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          
          {/* Left Column: Text & Stats */}
          <div className="lg:col-span-7 flex flex-col justify-center z-10 pb-10 lg:pb-24">
            
            {/* Heading */}
            <h1 className="font-extrabold text-3xl sm:text-5xl lg:text-[64px] leading-tight sm:leading-none tracking-tight text-black mb-6">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>

            {/* Description */}
            <p className="text-black/60 text-sm sm:text-base font-normal leading-relaxed sm:leading-[22px] mb-8 max-w-[545px]">
              Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
            </p>

            {/* CTA Button */}
            <div className="mb-12">
              <Link
                href="/shop"
                className="inline-block bg-black text-white font-medium text-base px-14 py-4 rounded-full hover:bg-black/80 transition-all text-center w-full sm:w-auto shadow-sm"
              >
                Shop Now
              </Link>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 pt-2 border-t border-black/10 sm:border-t-0">
              {/* Stat 1 */}
              <div>
                <h3 className="text-2xl sm:text-4xl font-bold text-black tracking-normal">
                  200+
                </h3>
                <p className="text-xs sm:text-sm text-black/60 mt-1">
                  International Brands
                </p>
              </div>

              {/* Stat 2 */}
              <div>
                <h3 className="text-2xl sm:text-4xl font-bold text-black tracking-normal">
                  2,000+
                </h3>
                <p className="text-xs sm:text-sm text-black/60 mt-1">
                  High-Quality Products
                </p>
              </div>

              {/* Stat 3 (Spans full width on mobile grid if 2 columns, or normal in 3-col grid) */}
              <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
                <h3 className="text-2xl sm:text-4xl font-bold text-black tracking-normal">
                  30,000+
                </h3>
                <p className="text-xs sm:text-sm text-black/60 mt-1">
                  Happy Customers
                </p>
              </div>
            </div>

          </div>

          {/* Right Column: Hero Images & Decorative Stars */}
          <div className="lg:col-span-5 relative flex justify-center items-end h-full min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            
            {/* 1. Main Human Model Image */}
            <div className="relative w-full h-[450px] sm:h-[550px] lg:h-[650px] max-w-[500px] lg:max-w-none">
              <Image
                src="/Home-hero-bg-crop-img.jpg" 
                alt="Trendy fashionable couple posing"
                fill
                priority
                className="object-contain object-bottom"
              />
            </div>

            {/* 2. Decorative Star/Sparkle Image (Large - Top Right) */}
            <div className="absolute top-10 right-4 sm:right-10 w-12 h-12 sm:w-20 sm:h-20 pointer-events-none">
              <Image
                src="/Home-hero-bg-startR.png" 
                alt="Decorative Star"
                fill
                className="object-contain "
              />
            </div>

            {/* 3. Decorative Star/Sparkle Image (Small - Mid Left) */}
            <div className="absolute top-1/2 left-2 sm:left-6 w-8 h-8 sm:w-12 sm:h-12 pointer-events-none">
              <Image
                src="/Home-hero-bg-startL.png" 
                alt="Decorative Star"
                fill
                className="object-contain"
              />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}