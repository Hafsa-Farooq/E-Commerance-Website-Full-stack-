"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

const shopCategories = [
  {
    title: "Men",
    items: ["T-shirts", "Shirts", "Jeans", "Shorts"],
  },
  {
    title: "Women",
    items: ["Tops & Tees", "Dresses", "Jeans", "Jackets"],
  },
  {
    title: "Kids",
    items: ["Casual Wear", "Outerwear", "Sets"],
  },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);
  const { isSignedIn } = useUser();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (shopRef.current && !shopRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-black/10 font-satoshi">
      {/* Top Banner */}
      <div className="bg-black text-white text-xs sm:text-sm py-2 px-4 text-center flex items-center justify-center gap-2">
        <span>Sign up and get 20% off to your first order.</span>
        {!isSignedIn ? (
          <SignInButton mode="modal">
            <button className="underline font-medium cursor-pointer bg-transparent border-none text-white p-0">
              Sign Up Now
            </button>
          </SignInButton>
        ) : (
          <Link href="/" className="underline font-medium cursor-pointer">
            Welcome!
          </Link>
        )}
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-black cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="font-extrabold text-2xl sm:text-[32px] tracking-tight text-black">
            SHOP.CO
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-base text-black">
          <div ref={shopRef} className="relative">
            <button
              onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
              className="hover:text-black/70 transition-colors flex items-center gap-1 cursor-pointer bg-transparent border-none text-black"
            >
              <span>Shop</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${shopDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {shopDropdownOpen && (
              <div className="absolute top-full left-0 mt-4 bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-8 py-6 flex gap-12 z-50 min-w-[420px]">
                {shopCategories.map((category) => (
                  <div key={category.title} className="flex flex-col gap-3">
                    <span className="font-bold text-base text-black">{category.title}</span>
                    {category.items.map((item) => (
                      <Link
                        key={item}
                        href="/shop"
                        onClick={() => setShopDropdownOpen(false)}
                        className="text-base text-black/60 hover:text-black transition-colors"
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
          <Link href="/shop" className="hover:text-black/70 transition-colors">On Sale</Link>
          <Link href="/shop" className="hover:text-black/70 transition-colors">New Arrivals</Link>
          <Link href="/shop" className="hover:text-black/70 transition-colors">Brands</Link>
        </nav>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
          <input 
            type="text" 
            placeholder="Search for products..." 
            className="w-full bg-[#F0F0F0] rounded-full pl-11 pr-4 py-3 text-sm outline-none text-black placeholder:text-black/40"
          />
        </div>

        {/* Right Icons: Cart & Profile / Clerk Auth */}
        <div className="flex items-center gap-4 text-black">
          <Link href="/cart" className="relative cursor-pointer hover:opacity-80 transition-opacity p-1">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </Link>

          {/* Clerk Authentication Integration */}
          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button aria-label="Account" className="cursor-pointer hover:opacity-80 transition-opacity p-1 bg-transparent border-none">
                <User className="w-6 h-6 text-black" />
              </button>
            </SignInButton>
          ) : (
            <div className="flex items-center">
              <UserButton afterSignOutUrl="/" />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-black/10 px-4 py-5 flex flex-col gap-4 shadow-md">
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-between font-medium text-black">
            <span>Shop</span>
            <ChevronDown className="w-4 h-4" />
          </Link>
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-black/70 hover:text-black text-sm">On Sale</Link>
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-black/70 hover:text-black text-sm">New Arrivals</Link>
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="text-black/70 hover:text-black text-sm">Brands</Link>
          <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="text-black/70 hover:text-black text-sm">Cart</Link>
        </div>
      )}
    </header>
  );
}