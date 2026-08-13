"use client";

import { useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

const navLinks = [
  { label: "Shop", href: "#", hasDropdown: true },
  { label: "On Sale", href: "#" },
  { label: "New Arrivals", href: "#" },
  { label: "Brands", href: "#" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-0 py-3.5 lg:py-[14px] flex items-center gap-3 lg:gap-10">
        {/* Mobile hamburger — left side, hidden on desktop */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden shrink-0"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 6H21M3 12H21M3 18H21"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Logo */}
        <a
          href="/"
          className="font-heading font-bold text-xl sm:text-2xl lg:text-[32px] leading-none tracking-tight shrink-0"
        >
          SHOP.CO
        </a>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-6 shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="font-satoshi text-base text-black flex items-center gap-1"
            >
              {link.label}
              {link.hasDropdown && (
                <svg width="12" height="7" viewBox="0 0 12 7" fill="none">
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </a>
          ))}
        </nav>

        {/* Desktop search bar */}
        <div className="hidden lg:flex items-center flex-1 max-w-[577px] bg-[#F0F0F0] rounded-full px-4 py-3 gap-3">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle
              cx="9"
              cy="9"
              r="7"
              stroke="black"
              strokeOpacity="0.4"
              strokeWidth="1.5"
            />
            <path
              d="M19 19L14.65 14.65"
              stroke="black"
              strokeOpacity="0.4"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="text"
            placeholder="Search for products..."
            className="font-satoshi text-base bg-transparent outline-none w-full text-black placeholder:text-black/40"
          />
        </div>

        {/* Icons — pushed to right */}
        <div className="flex items-center gap-3.5 ml-auto shrink-0">
          {/* Mobile search icon (opens dropdown search) */}
          <button
            aria-label="Search"
            className="lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="7" stroke="black" strokeWidth="1.5" />
              <path
                d="M19 19L14.65 14.65"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <button aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="lg:w-[22px] lg:h-[22px]">
              <path
                d="M3 3H5L5.4 5M7 13H17L21 5H5.4M7 13L5.4 5M7 13L4.7 15.3C4.1 15.9 4.5 17 5.4 17H17M17 17C15.9 17 15 17.9 15 19C15 20.1 15.9 21 17 21C18.1 21 19 20.1 19 19C19 17.9 18.1 17 17 17ZM9 19C9 20.1 8.1 21 7 21C5.9 21 5 20.1 5 19C5 17.9 5.9 17 7 17C8.1 17 9 17.9 9 19Z"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Clerk Authentication Integration */}
          <SignedOut>
            <SignInButton mode="modal">
              <button aria-label="Account" className="cursor-pointer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="lg:w-[22px] lg:h-[22px]">
                  <circle cx="12" cy="8" r="4" stroke="black" strokeWidth="1.5" />
                  <path
                    d="M4 20C4 16.5 7.5 14 12 14C16.5 14 20 16.5 20 20"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>

      {/* Mobile dropdown — search + nav links */}
      {menuOpen && (
        <div className="lg:hidden px-4 pb-4 flex flex-col gap-4 border-t border-black/10 pt-4">
          <div className="flex items-center bg-[#F0F0F0] rounded-full px-4 py-3 gap-3">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle
                cx="9"
                cy="9"
                r="7"
                stroke="black"
                strokeOpacity="0.4"
                strokeWidth="1.5"
              />
              <path
                d="M19 19L14.65 14.65"
                stroke="black"
                strokeOpacity="0.4"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search for products..."
              className="font-satoshi text-sm bg-transparent outline-none w-full placeholder:text-black/40"
            />
          </div>
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-satoshi text-base text-black"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}