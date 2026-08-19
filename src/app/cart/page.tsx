"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Trash2, ArrowRight, Tag, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth, useClerk } from "@clerk/nextjs";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

interface CartItemData {
  id: string;
  quantity: number;
  variant: {
    id: string;
    size: string;
    color: string;
    priceOverride: number | null;
    product: {
      id: string;
      name: string;
      basePrice: number;
      images: { url: string }[];
    };
  };
}

export default function CartPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { openSignIn } = useClerk();

  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    async function fetchCart() {
      try {
        const res = await fetch("/api/cart");
        const result = await res.json();
        if (result.success && result.data) {
          setCartItems(result.data.items || []);
        }
      } catch (error) {
        toast.error("Failed to load your cart");
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [isLoaded, isSignedIn]);

  const updateQuantity = async (itemId: string, currentQty: number, delta: number) => {
    const newQty = Math.max(1, currentQty + delta);
    setUpdatingId(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update quantity");

      setCartItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
      );
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (itemId: string) => {
    setUpdatingId(itemId);
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to remove item");

      setCartItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success("Item removed from cart");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  };

  const getItemPrice = (item: CartItemData) => {
    return item.variant.priceOverride ?? item.variant.product.basePrice;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0);
  const discount = subtotal > 0 ? Math.round(subtotal * 0.2) : 0;
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = subtotal - discount + deliveryFee;

  // Not signed in state
  if (isLoaded && !isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-10 font-satoshi">
          <div className="text-center py-16 bg-white border border-black/10 rounded-[20px]">
            <p className="text-lg text-black/60 mb-4">Please sign in to view your cart.</p>
            <button
              onClick={() => openSignIn()}
              className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-black/80 transition-colors cursor-pointer"
            >
              Sign In
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
      {/* Header Component */}
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-10 font-satoshi">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-xs sm:text-sm text-black/60 mb-6 gap-2">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-4 h-4 text-black/40 flex-shrink-0" />
          <span className="text-black font-medium">Cart</span>
        </nav>

        <h1 className="text-2xl sm:text-[32px] font-bold text-black mb-6 uppercase">Your Cart</h1>

        {loading ? (
          <div className="text-center py-16">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-black/40" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16 bg-white border border-black/10 rounded-[20px]">
            <p className="text-lg text-black/60 mb-4">Your cart is empty.</p>
            <Link href="/" className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-black/80 transition-colors">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Cart Items List */}
            <div className="lg:col-span-7 bg-white border border-black/10 rounded-[20px] p-4 sm:p-6 flex flex-col gap-6">
              {cartItems.map((item, index) => {
                const product = item.variant.product;
                const imageUrl = product.images[0]?.url || "/Product-related-img1.png";
                const price = getItemPrice(item);

                return (
                  <div key={item.id} className={`flex gap-4 pb-6 ${index !== cartItems.length - 1 ? 'border-b border-black/10' : ''}`}>
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-[16px] bg-[#F0EEED] relative overflow-hidden flex-shrink-0 border border-black/5 flex items-center justify-center">
                      <Image 
                        src={imageUrl} 
                        alt={product.name} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-base sm:text-lg text-black">{product.name}</h3>
                          <p className="text-xs sm:text-sm text-black/60 mt-0.5">Size: <span className="text-black">{item.variant.size}</span></p>
                          <p className="text-xs sm:text-sm text-black/60">Color: <span className="text-black">{item.variant.color}</span></p>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          disabled={updatingId === item.id}
                          className="text-[#FF3333] hover:text-red-700 transition-colors cursor-pointer p-1 disabled:opacity-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xl sm:text-2xl font-bold text-black">${(price * item.quantity).toString()}</span>
                        <div className="flex items-center bg-[#F0F0F0] rounded-full px-3 py-1.5 gap-3">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity, -1)}
                            disabled={updatingId === item.id}
                            className="text-black/60 hover:text-black font-bold text-sm cursor-pointer disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="text-sm font-semibold text-black">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity, 1)}
                            disabled={updatingId === item.id}
                            className="text-black/60 hover:text-black font-bold text-sm cursor-pointer disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 bg-white border border-black/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-5">
              <h3 className="font-bold text-black text-xl">Order Summary</h3>

              <div className="flex flex-col gap-4 text-sm sm:text-base border-b border-black/10 pb-5">
                <div className="flex justify-between text-black/60">
                  <span>Subtotal</span>
                  <span className="font-bold text-black">${subtotal}</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>Discount (-20%)</span>
                  <span className="font-bold text-[#FF3333]">-${discount}</span>
                </div>
                <div className="flex justify-between text-black/60">
                  <span>Delivery Fee</span>
                  <span className="font-bold text-black">${deliveryFee}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-base sm:text-lg font-bold text-black">
                <span>Total</span>
                <span className="text-xl sm:text-2xl">${total}</span>
              </div>

              {/* Promo Code & Checkout */}
              <div className="flex flex-col gap-3 mt-2">
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
                    <input 
                      type="text" 
                      placeholder="Add promo code" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="w-full bg-[#F0F0F0] rounded-full pl-10 pr-4 py-3 text-sm outline-none text-black placeholder:text-black/40"
                    />
                  </div>
                  <button className="bg-black text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-black/80 transition-colors cursor-pointer">
                    Apply
                  </button>
                </div>

                <button
                  onClick={() => router.push("/checkout")}
                  className="w-full bg-black text-white font-medium py-4 rounded-full mt-2 flex items-center justify-center gap-2 hover:bg-black/80 transition-colors cursor-pointer text-sm sm:text-base"
                >
                  Go to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}