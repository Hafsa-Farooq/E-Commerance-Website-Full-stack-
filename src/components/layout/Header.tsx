"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-black/10 font-satoshi">
      {/* Top Banner */}
      <div className="bg-black text-white text-xs sm:text-sm py-2 px-4 text-center flex items-center justify-center gap-2">
        <span>Sign up and get 20% off to your first order.</span>
        <Link href="/" className="underline font-medium cursor-pointer">Sign Up Now</Link>
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
          <Link href="/shop" className="hover:text-black/70 transition-colors flex items-center gap-1">
            <span>Shop</span>
            <ChevronDown className="w-4 h-4" />
          </Link>
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

        {/* Right Icons: Cart & Profile */}
        <div className="flex items-center gap-4 text-black">
          <Link href="/cart" className="relative cursor-pointer hover:opacity-80 transition-opacity p-1">
            <ShoppingCart className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </Link>
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity p-1">
            <User className="w-6 h-6" />
          </Link>
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