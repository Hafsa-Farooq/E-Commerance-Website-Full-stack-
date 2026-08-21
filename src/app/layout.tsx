import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from "next";
import { Outfit, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

// 1. Outfit font ko configure kiya gaya hai
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shop.co Admin Dashboard",
  description: "E-commerce Admin Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${outfit.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body 
          className="min-h-full flex flex-col font-sans" 
          style={{ fontFamily: 'var(--font-outfit), "Outfit Fallback", sans-serif' }}
        >
          {children}
          {/* Toaster component ko global level par add kiya gaya hai */}
          <Toaster richColors position="top-right" />
        </body>
      </html>
    </ClerkProvider>
  );
}