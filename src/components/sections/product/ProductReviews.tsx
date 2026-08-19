"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, SlidersHorizontal, ChevronDown, Check, MoreHorizontal, X, Loader2 } from "lucide-react";

interface ReviewData {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: { name: string | null } | null;
}

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  reviews: ReviewData[];
}

interface Props {
  product: ProductData;
}

export default function ProductReviews({ product }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("reviews");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reviews = product.reviews;

  const handleSubmitReview = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          rating: newRating,
          comment: newComment,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");

      setShowReviewModal(false);
      setNewComment("");
      setNewRating(5);
      router.refresh(); // Page ko refresh kar ke naya review fetch karega
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

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

      {activeTab === "details" && (
        <p className="text-black/70 text-sm sm:text-base leading-relaxed mb-10">
          {product.description || "No additional details available for this product."}
        </p>
      )}

      {activeTab === "faqs" && (
        <p className="text-black/70 text-sm sm:text-base leading-relaxed mb-10">
          No FAQs added for this product yet.
        </p>
      )}

      {activeTab === "reviews" && (
        <>
          {/* Reviews Header & Action Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-[24px] font-bold text-black flex items-center gap-2">
              All Reviews <span className="text-xs sm:text-sm font-normal text-black/60">({reviews.length})</span>
            </h2>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#F0F0F0] flex items-center justify-center hover:bg-black/10 transition-colors flex-shrink-0">
                <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </button>

              <div className="relative flex items-center gap-2 bg-[#F0F0F0] px-4 py-2.5 sm:px-5 sm:py-3 rounded-full cursor-pointer hover:bg-black/10 transition-colors">
                <span className="text-xs sm:text-sm font-medium text-black">Latest</span>
                <ChevronDown className="w-4 h-4 text-black" />
              </div>

              <button
                onClick={() => setShowReviewModal(true)}
                className="bg-black text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-full text-xs sm:text-sm font-medium hover:bg-black/80 transition-colors whitespace-nowrap"
              >
                Write a Review
              </button>
            </div>
          </div>

          {/* Reviews Grid */}
          {reviews.length === 0 ? (
            <p className="text-black/60 text-sm mb-10">No reviews yet — be the first to review this product.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
              {reviews.map((review) => (
                <div key={review.id} className="border border-black/10 rounded-[20px] p-5 sm:p-8 flex flex-col justify-between bg-white">
                  <div className="flex flex-col gap-3">
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

                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base sm:text-lg text-black">{review.user?.name || "Anonymous"}</h3>
                      <span className="w-5 h-5 rounded-full bg-[#01AB31] flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                    </div>

                    <p className="text-black/60 text-xs sm:text-base leading-relaxed">
                      {review.comment || ""}
                    </p>
                  </div>

                  <span className="text-black/60 text-xs sm:text-sm mt-6 block font-medium">
                    Posted on {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
              ))}
            </div>
          )}

          {reviews.length > 0 && (
            <div className="flex justify-center">
              <button className="border border-black/10 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-medium text-black hover:bg-black hover:text-white transition-all">
                Load More Reviews
              </button>
            </div>
          )}
        </>
      )}

      {/* Write a Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[20px] w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 text-black/40 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-black mb-4">Write a Review</h3>

            {/* Star Rating Picker */}
            <div className="flex items-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setNewRating(star)}
                  className="cursor-pointer"
                >
                  <Star
                    className={`w-7 h-7 ${star <= newRating ? "fill-[#FFC633] text-[#FFC633]" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="w-full border border-black/10 rounded-xl p-3 text-sm min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-black/10"
            />

            <button
              onClick={handleSubmitReview}
              disabled={submitting}
              className="w-full bg-black text-white font-medium py-3 rounded-full mt-4 hover:bg-black/80 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}