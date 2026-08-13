import React from "react";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[#F0F0F0] pt-28 sm:pt-24 pb-8 mt-20">
      {/* Newsletter Banner - Positioned to overlap the top of the footer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-32px)] sm:w-full max-w-7xl px-0 sm:px-6 lg:px-8 z-20">
        <div className="bg-black text-white rounded-[20px] p-6 sm:p-10 lg:px-16 lg:py-9 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xl">
          {/* Heading */}
          <h2 className="text-[30px] sm:text-4xl lg:text-[40px] font-bold font-integral uppercase leading-[1.1] max-w-xl text-center lg:text-left">
            STAY UPTO DATE ABOUT OUR LATEST OFFERS
          </h2>

          {/* Newsletter Form */}
          <div className="flex flex-col w-full lg:w-[349px] gap-3">
            <div className="flex items-center bg-white rounded-full px-4 py-3 gap-3 w-full">
              <Mail className="w-5 h-5 text-black/40 flex-shrink-0" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="bg-transparent text-black text-sm sm:text-base placeholder:text-black/40 focus:outline-none w-full font-satoshi"
              />
            </div>
            <button className="bg-white text-black font-medium text-sm sm:text-base rounded-full py-3 transition-colors duration-200 font-satoshi text-center cursor-pointer hover:bg-gray-100">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-16 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-12 pb-12 border-b border-black/10">
          
          {/* Brand Info & Socials */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Link href="/" className="font-integral text-2xl sm:text-[33.45px] font-bold tracking-tight text-black">
              SHOP.CO
            </Link>
            <p className="text-black/60 text-sm sm:text-base leading-relaxed font-satoshi">
              We have clothes that suits your style and which you&apos;re proud to wear. From women to men.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {/* Twitter */}
              <Link
                href="https://twitter.com"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white hover:border-black transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              {/* Facebook */}
              <Link
                href="https://facebook.com"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center hover:opacity-80 transition-opacity duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.378 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.582 9 4.75V8z" />
                </svg>
              </Link>
              {/* Instagram */}
              <Link
                href="https://instagram.com"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white hover:border-black transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              {/* Github */}
              <Link
                href="https://github.com"
                aria-label="Github"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white border border-black/20 flex items-center justify-center text-black hover:bg-black hover:text-white hover:border-black transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Links Columns: 2 columns on mobile/tablet, 4 columns on desktop */}
          <div className="lg:col-span-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Company */}
            <div className="flex flex-col gap-4">
              <h3 className="font-satoshi font-bold text-sm sm:text-base tracking-[3px] text-black uppercase">
                Company
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/about" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/works" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Works
                  </Link>
                </li>
                <li>
                  <Link href="/career" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Career
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div className="flex flex-col gap-4">
              <h3 className="font-satoshi font-bold text-sm sm:text-base tracking-[3px] text-black uppercase">
                Help
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/support" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Customer Support
                  </Link>
                </li>
                <li>
                  <Link href="/delivery" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Delivery Details
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Terms & Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* FAQ */}
            <div className="flex flex-col gap-4">
              <h3 className="font-satoshi font-bold text-sm sm:text-base tracking-[3px] text-black uppercase">
                FAQ
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/account" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Account
                  </Link>
                </li>
                <li>
                  <Link href="/deliveries" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Manage Deliveries
                  </Link>
                </li>
                <li>
                  <Link href="/orders" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Orders
                  </Link>
                </li>
                <li>
                  <Link href="/payments" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Payments
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-4">
              <h3 className="font-satoshi font-bold text-sm sm:text-base tracking-[3px] text-black uppercase">
                Resources
              </h3>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link href="/ebooks" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Free eBooks
                  </Link>
                </li>
                <li>
                  <Link href="/tutorial" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Development Tutorial
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    How to - Blog
                  </Link>
                </li>
                <li>
                  <Link href="/playlist" className="text-black/60 text-sm sm:text-base hover:text-black font-satoshi transition-colors">
                    Youtube Playlist
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-black/60 text-sm font-satoshi text-center sm:text-left">
            Shop.co &copy; 2000-2023, All Rights Reserved
          </p>

          {/* Payment Gateway Badges */}
          <div className="flex items-center flex-wrap justify-center gap-3">
            {/* Visa */}
            <div className="bg-white rounded px-2.5 py-1.5 shadow-xs flex items-center justify-center w-[46px] h-[30px]">
              <span className="font-bold text-[#1434CB] italic tracking-tighter text-xs">VISA</span>
            </div>
            {/* MasterCard */}
            <div className="bg-white rounded px-2.5 py-1.5 shadow-xs flex items-center justify-center w-[46px] h-[30px]">
              <div className="flex -space-x-1.5">
                <div className="w-3.5 h-3.5 rounded-full bg-[#EB001B]" />
                <div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] mix-blend-multiply" />
              </div>
            </div>
            {/* PayPal */}
            <div className="bg-white rounded px-2.5 py-1.5 shadow-xs flex items-center justify-center w-[46px] h-[30px]">
              <span className="font-bold text-[#003087] text-[10px] tracking-tighter">PayPal</span>
            </div>
            {/* Apple Pay */}
            <div className="bg-white rounded px-2.5 py-1.5 shadow-xs flex items-center justify-center w-[46px] h-[30px]">
              <span className="font-bold text-black text-[10px]">Pay</span>
            </div>
            {/* Google Pay */}
            <div className="bg-white rounded px-2.5 py-1.5 shadow-xs flex items-center justify-center w-[46px] h-[30px]">
              <span className="font-bold text-black text-[10px]">GPay</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}