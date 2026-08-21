'use client';

import React, { useRef } from "react";
import { Star, CheckCircle2, ArrowLeft, ArrowRight } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  rating: number;
  content: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: "1",
    name: "Sarah M.",
    rating: 5,
    content: `"I'm blown away by the quality and style of the clothes I received. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."`,
  },
  {
    id: "2",
    name: "Alex K.",
    rating: 5,
    content: `"Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."`,
  },
  {
    id: "3",
    name: "James L.",
    rating: 5,
    content: `"As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."`,
  },
  {
    id: "4",
    name: "Moose W.",
    rating: 5,
    content: `"The quality of the clothing is exceptional! Customer service was helpful, and shipping was remarkably fast. I'm a customer for life."`,
  },
  {
    id: "5",
    name: "Samantha P.",
    rating: 5,
    content: `"Absolutely love shopping here! The website is easy to use, and the clothes fit perfectly. Highly recommend to everyone."`,
  },
];

export default function Testimonials() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-12 sm:py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Navigation Arrows */}
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-[48px] font-bold tracking-tight text-black font-integral uppercase leading-none">
            OUR HAPPY CUSTOMERS
          </h2>
          {/* Navigation Controls */}
          <div className="hidden sm:flex items-center gap-4">
            <button
              onClick={() => scroll("left")}
              aria-label="Previous Testimonial"
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity duration-200 text-black cursor-pointer"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Next Testimonial"
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity duration-200 text-black cursor-pointer"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials Carousel Container with Clean Mask Fade */}
      <div className="relative w-full">
        {/* Scrollable Track with Mask Image for Edge Fading */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide px-4 sm:px-8 lg:px-[max(2rem,calc((100vw-80rem)/2+2rem))] snap-x snap-mandatory pb-4 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="min-w-[320px] sm:min-w-[400px] max-w-[400px] snap-start border border-black/10 rounded-[20px] p-[28px_32px] flex flex-col justify-between bg-white shadow-sm hover:shadow-md transition-shadow duration-300 flex-shrink-0"
            >
              <div className="flex flex-col gap-3">
                {/* Rating Stars */}
                <div className="flex items-center text-[#FFC633] gap-[6.49px]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-[22.58px] h-[22.58px] fill-current" />
                  ))}
                </div>

                {/* Customer Name & Verified Badge */}
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-[20px] leading-[22px] text-black font-satoshi">
                    {item.name}
                  </h3>
                  <CheckCircle2 className="w-5 h-5 text-[#01AB31] fill-[#01AB31]/20" />
                </div>

                {/* Review Content */}
                <p className="text-black/60 text-[16px] leading-[22px] font-satoshi">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}