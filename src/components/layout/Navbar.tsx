"use client";

import { useState, useRef, useEffect } from "react";

const navLinks = [
  { label: "Shop", href: "#", hasDropdown: true },
  { label: "On Sale", href: "#" },
  { label: "New Arrivals", href: "#" },
  { label: "Brands", href: "#" },
];

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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const shopRef = useRef<HTMLDivElement>(null);

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
    <header className="bg-white relative">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-3.5 lg:py-[14px] flex items-center gap-3 lg:gap-10">
        <button aria-label="Toggle menu" onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H21M3 12H21M3 18H21" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        <a href="/" className="font-heading font-bold text-xl sm:text-2xl lg:text-[32px] leading-none tracking-tight shrink-0">SHOP.CO</a>

        <nav className="hidden lg:flex items-center gap-6 shrink-0">
          {navLinks.map((link) =>
            link.hasDropdown ? (
              <div key={link.label} ref={shopRef} className="relative">
                <button onClick={() => setShopDropdownOpen(!shopDropdownOpen)} className="font-satoshi text-base text-black flex items-center gap-1">
                  {link.label}
                  <svg width="12" height="7" viewBox="0 0 12 7" fill="none" className={`transition-transform duration-200 ${shopDropdownOpen ? "rotate-180" : ""}`}>
                    <path d="M1 1L6 6L11 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {shopDropdownOpen && (
                  <div className="absolute top-full left-0 mt-4 bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-8 py-6 flex gap-12 z-50 min-w-[420px]">
                    {shopCategories.map((category) => (
                      <div key={category.title} className="flex flex-col gap-3">
                        <span className="font-satoshi font-bold text-base text-black">{category.title}</span>
                        {category.items.map((item) => (
                          <a key={item} href="#" className="font-satoshi text-base text-black/60 hover:text-black transition-colors">{item}</a>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <a key={link.label} href={link.href} className="font-satoshi text-base text-black flex items-center gap-1">{link.label}</a>
            )
          )}
        </nav>

        <div className="hidden lg:flex items-center flex-1 max-w-[577px] bg-[#F0F0F0] rounded-full px-4 py-3 gap-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="9" cy="9" r="7" stroke="black" strokeOpacity="0.4" strokeWidth="1.5" />
            <path d="M19 19L14.65 14.65" stroke="black" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input type="text" placeholder="Search for products..." className="font-satoshi text-base bg-transparent outline-none w-full text-black placeholder:text-black/40" />
        </div>

        <div className="flex items-center gap-3.5 ml-auto shrink-0">
          <button aria-label="Search" className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="7" stroke="black" strokeWidth="1.5" />
              <path d="M19 19L14.65 14.65" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <button aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="lg:w-[22px] lg:h-[22px]">
              <path d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.1 15.9 4.5 17 5.4 17H17M17 17C15.9 17 15 17.9 15 19C15 20.1 15.9 21 17 21C18.1 21 19 20.1 19 19C19 17.9 18.1 17 17 17ZM9 19C9 20.1 8.1 21 7 21C5.9 21 5 20.1 5 19C5 17.9 5.9 17 7 17C8.1 17 9 17.9 9 19Z" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="lg:w-[22px] lg:h-[22px]">
              <circle cx="12" cy="8" r="4" stroke="black" strokeWidth="1.5" />
              <path d="M4 20C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 20" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="lg:hidden px-4 pb-4 flex flex-col gap-4 border-t border-black/10 pt-4">
          <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-3 gap-3">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="7" stroke="black" strokeOpacity="0.4" strokeWidth="1.5" />
              <path d="M19 19L14.65 14.65" stroke="black" strokeOpacity="0.4" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Search for products..." className="font-satoshi text-sm bg-transparent outline-none w-full placeholder:text-black/40" />
          </div>
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className="font-satoshi text-base text-black">{link.label}</a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}