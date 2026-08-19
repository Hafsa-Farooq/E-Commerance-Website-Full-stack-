"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useAuth, useClerk } from "@clerk/nextjs";

interface CartItemData {
  id: string;
  quantity: number;
  variant: {
    size: string;
    color: string;
    priceOverride: number | null;
    product: {
      name: string;
      basePrice: number;
      images: { url: string }[];
    };
  };
}

type PaymentMethod = "COD" | "BANK_TRANSFER" | "STRIPE";

export default function CheckoutSection() {
  const router = useRouter();
  // Clerk se userId bhi extract kar liya
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { openSignIn } = useClerk();

  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("COD");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      setLoadingCart(false);
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
        setLoadingCart(false);
      }
    }
    fetchCart();
  }, [isLoaded, isSignedIn]);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getItemPrice = (item: CartItemData) => {
    return item.variant.priceOverride ?? item.variant.product.basePrice;
  };

  const subtotal = cartItems.reduce((acc, item) => acc + getItemPrice(item) * item.quantity, 0);
  const discount = subtotal > 0 ? Math.round(subtotal * 0.2) : 0;
  const deliveryFee = subtotal > 0 ? 15 : 0;
  const total = subtotal - discount + deliveryFee;

  const handlePlaceOrder = async () => {
    const { fullName, phone, line1, city, state, postalCode, country } = formData;
    if (!fullName || !phone || !line1 || !city || !state || !postalCode || !country) {
      toast.error("Please fill in all required address fields");
      return;
    }

    setPlacingOrder(true);
    try {
      // Agar payment method STRIPE hai toh Stripe Checkout API ko call karein
      if (paymentMethod === "STRIPE") {
        const formattedItems = cartItems.map((item) => ({
          name: item.variant.product.name,
          price: getItemPrice(item),
          quantity: item.quantity,
          image: item.variant.product.images[0]?.url || "",
        }));

        const stripeRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // Yahan shippingData aur userId add kar diya hai
          body: JSON.stringify({ 
            items: formattedItems,
            shippingData: formData,
            userId: userId 
          }),
        });

        const stripeData = await stripeRes.json();
        if (!stripeRes.ok) throw new Error(stripeData.error || "Failed to create Stripe session");

        if (stripeData.url) {
          window.location.href = stripeData.url; // Redirect to Stripe Checkout page
          return;
        }
      }

      // Baqi payment methods (COD / Bank Transfer) ke liye normal orders API call karein
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, paymentMethod }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      toast.success(`Order placed! Order #${data.data.orderNumber}`);
      router.push("/");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (isLoaded && !isSignedIn) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-10 font-satoshi">
        <div className="text-center py-16 bg-white border border-black/10 rounded-[20px]">
          <p className="text-lg text-black/60 mb-4">Please sign in to checkout.</p>
          <button
            onClick={() => openSignIn()}
            className="inline-block bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-black/80 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-10 font-satoshi">
      {/* Breadcrumbs */}
      <nav className="flex items-center text-xs sm:text-sm text-black/60 mb-6 gap-2">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 text-black/40 flex-shrink-0" />
        <Link href="/cart" className="hover:text-black transition-colors">Cart</Link>
        <ChevronRight className="w-4 h-4 text-black/40 flex-shrink-0" />
        <span className="text-black font-medium">Checkout</span>
      </nav>

      <h1 className="text-2xl sm:text-[32px] font-bold text-black mb-6 uppercase">Checkout</h1>

      {loadingCart ? (
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
          {/* Left Column: Address + Payment */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Shipping Address Card */}
            <div className="bg-white border border-black/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-4">
              <h3 className="font-bold text-black text-xl">Shipping Address</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  className="bg-[#F0F0F0] rounded-xl px-4 py-3 text-sm outline-none text-black placeholder:text-black/40"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="bg-[#F0F0F0] rounded-xl px-4 py-3 text-sm outline-none text-black placeholder:text-black/40"
                />
              </div>

              <input
                type="text"
                placeholder="Address Line 1"
                value={formData.line1}
                onChange={(e) => handleChange("line1", e.target.value)}
                className="bg-[#F0F0F0] rounded-xl px-4 py-3 text-sm outline-none text-black placeholder:text-black/40"
              />
              <input
                type="text"
                placeholder="Address Line 2 (Optional)"
                value={formData.line2}
                onChange={(e) => handleChange("line2", e.target.value)}
                className="bg-[#F0F0F0] rounded-xl px-4 py-3 text-sm outline-none text-black placeholder:text-black/40"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className="bg-[#F0F0F0] rounded-xl px-4 py-3 text-sm outline-none text-black placeholder:text-black/40"
                />
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  className="bg-[#F0F0F0] rounded-xl px-4 py-3 text-sm outline-none text-black placeholder:text-black/40"
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={formData.postalCode}
                  onChange={(e) => handleChange("postalCode", e.target.value)}
                  className="bg-[#F0F0F0] rounded-xl px-4 py-3 text-sm outline-none text-black placeholder:text-black/40"
                />
              </div>

              <input
                type="text"
                placeholder="Country"
                value={formData.country}
                onChange={(e) => handleChange("country", e.target.value)}
                className="bg-[#F0F0F0] rounded-xl px-4 py-3 text-sm outline-none text-black placeholder:text-black/40"
              />
            </div>

            {/* Payment Method Card */}
            <div className="bg-white border border-black/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-4">
              <h3 className="font-bold text-black text-xl">Payment Method</h3>

              <div className="flex flex-col gap-3">
                {[
                  { id: "COD", label: "Cash on Delivery", desc: "Pay when your order arrives" },
                  { id: "BANK_TRANSFER", label: "Bank Transfer", desc: "Transfer directly to our bank account" },
                  { id: "STRIPE", label: "Credit / Debit Card (Stripe)", desc: "Secure online payment via Stripe" },
                ].map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`flex items-center justify-between border rounded-xl px-4 py-3.5 text-left transition-all cursor-pointer ${
                      paymentMethod === method.id
                        ? "border-black bg-black/5"
                        : "border-black/10 hover:border-black/30"
                    }`}
                  >
                    <div>
                      <p className="font-medium text-black text-sm">{method.label}</p>
                      <p className="text-xs text-black/60">{method.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 ${
                        paymentMethod === method.id ? "bg-black border-black" : "border-black/20"
                      }`}
                    >
                      {paymentMethod === method.id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-white border border-black/10 rounded-[20px] p-5 sm:p-6 flex flex-col gap-5">
            <h3 className="font-bold text-black text-xl">Order Summary</h3>

            {/* Items list */}
            <div className="flex flex-col gap-4 border-b border-black/10 pb-5 max-h-[300px] overflow-y-auto">
              {cartItems.map((item) => {
                const product = item.variant.product;
                const imageUrl = product.images[0]?.url || "/Product-related-img1.png";
                const price = getItemPrice(item);

                return (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 rounded-xl bg-[#F0EEED] relative overflow-hidden flex-shrink-0 border border-black/5">
                      <Image src={imageUrl} alt={product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm text-black">{product.name}</p>
                      <p className="text-xs text-black/60">{item.variant.size} / {item.variant.color} × {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-black">${(price * item.quantity).toString()}</span>
                  </div>
                );
              })}
            </div>

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

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full bg-black text-white font-medium py-4 rounded-full mt-2 flex items-center justify-center gap-2 hover:bg-black/80 transition-colors cursor-pointer text-sm sm:text-base disabled:opacity-60"
            >
              {placingOrder && <Loader2 className="w-4 h-4 animate-spin" />}
              {placingOrder ? "Processing..." : paymentMethod === "STRIPE" ? "Proceed to Stripe" : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}