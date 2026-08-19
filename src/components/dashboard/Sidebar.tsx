'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ChevronDown, 
  ChevronRight, 
  ShoppingCart, 
  Users, 
  Ticket, 
  CreditCard,
  Sparkles,
  ChevronsUpDown,
  LogOut
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();
  const [isEcommerceOpen, setIsEcommerceOpen] = useState(true);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(() => router.push("/"));
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 bg-card border-r transition-all duration-300 flex flex-col ${isOpen ? "w-72" : "w-20"}`}>
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-6 border-b relative">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 shrink-0 bg-foreground text-background rounded-xl flex items-center justify-center font-bold text-lg">
            S
          </div>
          {isOpen && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-foreground text-sm tracking-tight">SHOP.CO</span>
              <span className="text-[11px] text-muted-foreground truncate">Admin Dashboard</span>
            </div>
          )}
        </div>
        {isOpen && (
          <div className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="p-1 rounded-lg hover:bg-muted transition-colors cursor-pointer"
            >
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
            </button>

            {isAccountMenuOpen && (
              <>
                {/* Backdrop to close dropdown on outside click */}
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsAccountMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-44 bg-card border rounded-xl shadow-lg py-1.5 z-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Dashboards Section */}
        <div className="space-y-2">
          {isOpen && <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Dashboards</p>}
          
          <Link 
            href="/dashboard"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname === "/dashboard" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {isOpen && <span>Classic Dashboard</span>}
          </Link>

          {/* E-commerce Dropdown */}
          <div className="space-y-1">
            <button 
              onClick={() => setIsEcommerceOpen(!isEcommerceOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4 shrink-0" />
                {isOpen && <span>E-commerce</span>}
              </div>
              {isOpen && (
                isEcommerceOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {isOpen && isEcommerceOpen && (
              <div className="pl-9 space-y-1 pt-1">
                <Link 
                  href="/dashboard" 
                  className="block px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/dashboard/product-list" 
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                    pathname === "/dashboard/product-list" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  Product List
                </Link>
                <Link 
                  href="/dashboard/product-detail" 
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                    pathname === "/dashboard/product-detail" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  Product Detail
                </Link>
                <Link 
                  href="/dashboard/add-product" 
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                    pathname === "/dashboard/add-product" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  Add Product
                </Link>
                <Link 
                  href="/dashboard/categories" 
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                    pathname === "/dashboard/categories" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  Categories
                </Link>
                <Link 
                  href="/dashboard/inventory" 
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                    pathname === "/dashboard/inventory" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  Inventory
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Other Sections (Orders Dropdown and Payments added here) */}
        <div className="space-y-1">
          {/* Orders Dropdown */}
          <div>
            <button 
              onClick={() => setIsOrdersOpen(!isOrdersOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors"
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-4 w-4 shrink-0" />
                {isOpen && <span>Orders</span>}
              </div>
              {isOpen && (
                isOrdersOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
            </button>

            {isOpen && isOrdersOpen && (
              <div className="pl-9 space-y-1 pt-1">
                <Link 
                  href="/dashboard/orders" 
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                    pathname === "/dashboard/orders" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  Order List
                </Link>
                <Link 
                  href="/dashboard/order-detail" 
                  className={`block px-3 py-2 rounded-xl text-sm font-medium ${
                    pathname === "/dashboard/order-detail" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  Order Detail
                </Link>
              </div>
            )}
          </div>

          <Link href="/dashboard/customers" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
            <Users className="h-4 w-4 shrink-0" />
            {isOpen && <span>Customers</span>}
          </Link>
          <Link href="/dashboard/coupons" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground">
            <Ticket className="h-4 w-4 shrink-0" />
            {isOpen && <span>Coupons</span>}
          </Link>
          <Link 
            href="/dashboard/payments" 
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              pathname === "/dashboard/payments" ? "bg-muted text-foreground font-semibold" : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
          >
            <CreditCard className="h-4 w-4 shrink-0" />
            {isOpen && <span>Payments</span>}
          </Link>
        </div>
      </div>

      {/* Unlock Everything Promo Card */}
      {isOpen && (
        <div className="p-4 m-4 bg-muted/30 border rounded-2xl space-y-3">
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-amber-500" /> Unlock Everything
            </h4>
            <p className="text-xs text-muted-foreground">
              Get instant access to all premium dashboards, templates, and UI components.
            </p>
          </div>
          <button className="w-full bg-foreground text-background font-medium py-2 rounded-xl text-xs hover:bg-foreground/90 transition-colors">
            Get Full Access
          </button>
        </div>
      )}

      {/* User Profile Footer */}
      <div className="p-4 border-t flex items-center gap-3">
        <div className="h-10 w-10 shrink-0 rounded-full bg-muted overflow-hidden">
          <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="User" className="h-full w-full object-cover" />
        </div>
        {isOpen && (
          <div className="flex flex-col truncate">
            <span className="font-semibold text-sm text-foreground truncate">Toby Belhome</span>
            <span className="text-xs text-muted-foreground truncate">hello@tobybelhome.com</span>
          </div>
        )}
      </div>
    </aside>
  );
}