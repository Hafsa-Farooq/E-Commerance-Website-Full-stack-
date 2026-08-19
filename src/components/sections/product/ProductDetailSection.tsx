"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Minus, Plus, Check, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useClerk, useAuth } from "@clerk/nextjs";

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  sku: string;
  priceOverride: number | null;
}

interface ProductImage {
  id: string;
  url: string;
}

interface ProductReview {
  id: string;
  rating: number;
}

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  discountPrice: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews: ProductReview[];
  category: { name: string; slug: string } | null;
}

interface Props {
  product: ProductData;
}

// Admin ke Add Product page ke color palette se match karta hua mapping
const colorSwatch: Record<string, string> = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#F50606",
  olive: "#4F4631",
  "forest green": "#314F43",
  navy: "#31354F",
  blue: "#063AF5",
  yellow: "#F5DD06",
  orange: "#F57906",
  purple: "#7D06F5",
  pink: "#F506A2",
  cyan: "#06CAF5",
};

export default function ProductDetailSection({ product }: Props) {
  const { openSignIn } = useClerk();
  const { isSignedIn } = useAuth();

  const images = product.images.length > 0
    ? product.images.map((img) => img.url)
    : ["/Product-productdetail-img1.png"];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  // Derive unique colors and sizes from variants
  const uniqueColors = Array.from(new Set(product.variants.map((v) => v.color)));
  const uniqueSizes = Array.from(new Set(product.variants.map((v) => v.size)));

  const [selectedColor, setSelectedColor] = useState(uniqueColors[0] || "");
  const [selectedSize, setSelectedSize] = useState(uniqueSizes[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Average rating from reviews
  const avgRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
    : 0;

  const displayPrice = product.discountPrice ?? product.basePrice;
  const hasDiscount = product.discountPrice !== null && product.discountPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - (product.discountPrice as number)) / product.basePrice) * 100)
    : 0;

  // Find the matching variant based on selected color + size (if variants exist)
  const selectedVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const showSignInToast = () => {
    toast("You must sign in or sign up first", {
      description: "Please log in to add items to your cart.",
      action: {
        label: "Sign In",
        onClick: () => openSignIn(),
      },
    });
  };

  const handleAddToCart = async () => {
    // Pehle client-side hi check kar lein taake bina API call kiye jaldi response mile
    if (!isSignedIn) {
      showSignInToast();
      return;
    }

    setAddingToCart(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariant?.id,
          quantity,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Agar server se bhi 401 aaye (session expire ho chuki ho), wahi toast dikhayein
        if (res.status === 401) {
          showSignInToast();
          return;
        }
        throw new Error(data.error || "Failed to add to cart");
      }

      toast.success("Added to cart!");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setAddingToCart(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 font-satoshi">
      {/* Breadcrumbs with Chevron Icons */}
      <nav className="flex items-center text-xs sm:text-sm text-black/60 mb-6 gap-2 overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 text-black/40 flex-shrink-0" />
        <Link href="/shop" className="hover:text-black transition-colors">Shop</Link>
        <ChevronRight className="w-4 h-4 text-black/40 flex-shrink-0" />
        {product.category && (
          <>
            <span className="hover:text-black transition-colors">{product.category.name}</span>
            <ChevronRight className="w-4 h-4 text-black/40 flex-shrink-0" />
          </>
        )}
        <span className="text-black font-medium">{product.name}</span>
      </nav>

      {/* Main Grid Section: Gallery & Info (items-stretch ensures equal height on desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
        
        {/* Product Gallery (Left Side - 7 Columns) */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row gap-3 sm:gap-4 h-full">
          
          {/* Main Preview Image */}
          <div className="w-full flex-1 sm:h-auto min-h-[320px] sm:min-h-[530px] rounded-[20px] bg-[#F0EEED] overflow-hidden relative border border-black/10 flex items-center justify-center order-1 sm:order-2">
             <Image 
               src={selectedImage} 
               alt="Selected Product Preview"
               fill
               sizes="(max-width: 1024px) 100vw, 50vw"
               className="object-cover"
               priority
             />
          </div>

          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-2.5 sm:gap-3 justify-between sm:justify-start w-full sm:w-auto order-2 sm:order-1">
            {images.map((imgSrc, index) => (
              <div 
                key={index}
                onClick={() => setSelectedImage(imgSrc)}
                className={`flex-1 sm:flex-initial w-full sm:w-[152px] h-[90px] sm:h-[167px] rounded-[16px] sm:rounded-[20px] border overflow-hidden cursor-pointer relative bg-[#F0EEED] transition-all ${
                  selectedImage === imgSrc ? "border-black border-2" : "border-black/10 hover:border-black"
                }`}
              >
                <Image 
                  src={imgSrc} 
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 30vw, 152px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info (Right Side - 5 Columns) */}
        <div className="lg:col-span-5 flex flex-col justify-between h-full">
          <div className="flex flex-col gap-4">
            {/* Title */}
            <h1 className="text-2xl sm:text-[40px] font-bold font-integral uppercase leading-tight text-black">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center text-[#FFC633] gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(avgRating) ? "fill-current" : "text-gray-300 fill-gray-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-black font-medium">
                {avgRating.toFixed(1)}<span className="text-black/60">/5</span>
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-black">${displayPrice.toString()}</span>
              {hasDiscount && (
                <span className="text-2xl sm:text-3xl font-bold text-black/40 line-through">
                  ${product.basePrice.toString()}
                </span>
              )}
              {hasDiscount && (
                <span className="bg-[#FF3333]/10 text-[#FF3333] text-xs sm:text-sm font-medium px-3 py-1 rounded-full">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-black/60 text-sm sm:text-base leading-relaxed border-b border-black/10 pb-4">
              {product.description || "No description available."}
            </p>

            {/* Color Selection */}
            {uniqueColors.length > 0 && (
              <div className="flex flex-col gap-2.5 border-b border-black/10 pb-4">
                <span className="text-sm text-black/60">Select Colors</span>
                <div className="flex items-center gap-3">
                  {uniqueColors.map((color, idx) => {
                    const bg = colorSwatch[color.toLowerCase()] || "#999999";
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: bg }}
                        className="w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                        title={color}
                      >
                        {selectedColor === color && <Check className="w-4 h-4 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {uniqueSizes.length > 0 && (
              <div className="flex flex-col gap-2.5 pb-2">
                <span className="text-sm text-black/60">Choose Size</span>
                <div className="flex items-center flex-wrap gap-2.5">
                  {uniqueSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 sm:px-5 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
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
            )}
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-3 sm:gap-4 pt-6 border-t border-black/10 mt-4">
            <div className="flex items-center justify-between bg-[#F0F0F0] rounded-full px-4 py-3.5 w-32 sm:w-40 flex-shrink-0">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="text-black hover:opacity-60 transition-opacity cursor-pointer"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-medium text-black">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="text-black hover:opacity-60 transition-opacity cursor-pointer"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex-1 bg-black text-white font-medium py-3.5 rounded-full hover:bg-black/80 transition-colors text-center cursor-pointer text-sm sm:text-base disabled:opacity-60"
            >
              {addingToCart ? "Adding..." : "Add to Cart"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}