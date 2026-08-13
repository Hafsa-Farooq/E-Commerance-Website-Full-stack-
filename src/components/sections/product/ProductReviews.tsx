"use client";

import React, { useState } from "react";
import { Star, SlidersHorizontal, ChevronDown, Check, MoreHorizontal } from "lucide-react";

export default function ProductReviews() {
  const [activeTab, setActiveTab] = useState("reviews");

  const reviews = [
    {
      name: "Samantha D.",
      verified: true,
      rating: 5,
      comment: '"I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It\'s become my favorite go-to shirt."',
      date: "Posted on August 14, 2023",
    },
    {
      name: "Alex M.",
      verified: true,
      rating: 5,
      comment: '"The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I\'m quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me."',
      date: "Posted on August 15, 2023",
    },
    {
      name: "Ethan R.",
      verified: true,
      rating: 4,
      comment: '"This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer\'s touch in every aspect of this shirt."',
      date: "Posted on August 16, 2023",
    },
    {
      name: "Olivia P.",
      verified: true,
      rating: 5,
      comment: '"As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It\'s evident that the designer poured their creativity into making this t-shirt stand out."',
      date: "Posted on August 17, 2023",
    },
    {
      name: "Liam K.",
      verified: true,
      rating: 5,
      comment: '"This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer\'s skill. It\'s like wearing a piece of art that reflects my passion for both design and fashion."',
      date: "Posted on August 18, 2023",
    },
    {
      name: "Ava H.",
      verified: true,
      rating: 4,
      comment: '"I\'m not just wearing a t-shirt; I\'m wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter."',
      date: "Posted on August 19, 2023",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-satoshi">
      {/* Navigation Tabs */}
      <div className="flex border-b border-black/10 mb-8 overflow-x-auto">
        <button
          onClick={() => setActiveTab("details")}
          className={`flex-1 min-w-[110px] pb-4 text-center text-sm sm:text-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === "details" ? "text-black border-b-2 border-black font-semibold" : "text-black/60 hover:text-black"
          }`}
        >
          Product Details
        </button>
        <button
          onClick={() => setActiveTab("reviews")}
          className={`flex-1 min-w-[130px] pb-4 text-center text-sm sm:text-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === "reviews" ? "text-black border-b-2 border-black font-semibold" : "text-black/60 hover:text-black"
          }`}
        >
          Rating & Reviews
        </button>
        <button
          onClick={() => setActiveTab("faqs")}
          className={`flex-1 min-w-[70px] pb-4 text-center text-sm sm:text-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === "faqs" ? "text-black border-b-2 border-black font-semibold" : "text-black/60 hover:text-black"
          }`}
        >
          FAQs
        </button>
      </div>

      {/* Reviews Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-[24px] font-bold text-black flex items-center gap-2">
          All Reviews <span className="text-xs sm:text-sm font-normal text-black/60">(451)</span>
        </h2>
        
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Filter Button */}
          <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center hover:bg-black/10 transition-colors flex-shrink-0">
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
          </button>

          {/* Sort Dropdown Button */}
          <div className="relative flex items-center gap-2 bg-[#F0F0F0] px-4 py-2.5 sm:px-5 sm:py-3 rounded-full cursor-pointer hover:bg-black/10 transition-colors">
            <span className="text-xs sm:text-sm font-medium text-black">Latest</span>
            <ChevronDown className="w-4 h-4 text-black" />
          </div>

          {/* Write a Review Button */}
          <button className="bg-black text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-xs sm:text-sm font-medium hover:bg-black/80 transition-colors whitespace-nowrap">
            Write a Review
          </button>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
        {reviews.map((review, index) => (
          <div key={index} className="border border-black/10 rounded-[20px] p-5 sm:p-8 flex flex-col justify-between bg-white">
            <div className="flex flex-col gap-3">
              {/* Top Row: Stars and Options */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-[#FFC633] gap-1">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <button className="text-black/40 hover:text-black transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Author Name and Verified Check */}
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-black">{review.name}</h3>
                {review.verified && (
                  <span className="w-5 h-5 rounded-full bg-[#01AB31] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
              </div>

              {/* Review Comment */}
              <p className="text-black/60 text-xs sm:text-base leading-relaxed">
                {review.comment}
              </p>
            </div>

            {/* Date */}
            <span className="text-black/60 text-xs sm:text-sm mt-6 block font-medium">
              {review.date}
            </span>
          </div>
        ))}
      </div>

      {/* Load More Button */}
      <div className="flex justify-center">
        <button className="border border-black/10 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium text-black hover:bg-black hover:text-white transition-all">
          Load More Reviews
        </button>
      </div>
    </div>
  );
}