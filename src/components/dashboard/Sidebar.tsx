import Link from "next/link";
import { 
  ShoppingBag, 
  CreditCard, 
  Layers, 
  Boxes, 
  Home, 
  Users, 
  Ticket, 
  ChevronDown,
  MoreVertical,
  Package,
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  return (
    <aside 
      className={`hidden border-r bg-muted/20 md:flex md:flex-col fixed inset-y-0 z-50 transition-all duration-300 ${
        isOpen ? "md:w-72" : "md:w-20"
      }`}
    >
      {/* Top Admin Dashboard Section */}
      <div className={`flex h-16 items-center border-b px-4 shrink-0 ${isOpen ? "justify-between" : "justify-center"}`}>
        <div className="flex items-center gap-3 font-bold text-base overflow-hidden">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm font-bold text-sm">
            H
          </div>
          {isOpen && <span className="truncate">Admin Dashboard</span>}
        </div>
        {isOpen && <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-none">
        <div>
          {isOpen && (
            <p className="text-xs font-semibold text-muted-foreground px-3 mb-2 uppercase tracking-wider">
              Store Management
            </p>
          )}
          <nav className="space-y-1">
            {/* Overview / Classic Dashboard */}
            <Link 
              href="/admin" 
              title={!isOpen ? "Overview" : ""}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground ${!isOpen ? "justify-center px-0" : ""}`}
            >
              <Home className="h-4 w-4 shrink-0" />
              {isOpen && <span className="truncate">Overview</span>}
            </Link>
            
            {/* Products Dropdown / Section */}
            <div className={`rounded-xl ${isOpen ? "bg-muted/60 p-1.5" : "flex justify-center p-1"} space-y-1`}>
              <Link 
                href="/admin/products" 
                title={!isOpen ? "Products Management" : ""}
                className={`flex items-center ${isOpen ? "justify-between px-3 py-2 bg-background shadow-sm" : "justify-center p-2.5"} rounded-lg text-sm font-medium text-foreground`}
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 shrink-0 text-foreground" />
                </div>
                {isOpen && (
                  <>
                    <span className="truncate flex-1 ml-3 font-semibold">Products</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  </>
                )}
              </Link>
              
              {isOpen && (
                <div className="pl-7 space-y-1 text-sm pt-1">
                  <Link href="/admin/products" className="block rounded-lg bg-background px-3 py-1.5 font-medium text-foreground shadow-sm">All Products</Link>
                  <Link href="/admin/categories" className="block rounded-lg px-3 py-1.5 text-muted-foreground hover:text-foreground">Categories</Link>
                  <Link href="/admin/inventory" className="block rounded-lg px-3 py-1.5 text-muted-foreground hover:text-foreground">Inventory</Link>
                </div>
              )}
            </div>

            {/* Other Database-Connected Admin Routes */}
            {[
              { label: "Orders", icon: ShoppingCart, href: "/admin/orders" },
              { label: "Customers", icon: Users, href: "/admin/customers" },
              { label: "Coupons", icon: Ticket, href: "/admin/coupons" },
              { label: "Payments", icon: CreditCard, href: "/admin/payments" },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link 
                  key={idx}
                  href={item.href} 
                  title={!isOpen ? item.label : ""}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted/80 hover:text-foreground ${!isOpen ? "justify-center px-0" : "justify-between"}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 shrink-0" />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Promo Box (Visible only when expanded) */}
        {isOpen && (
          <div className="rounded-2xl border bg-card p-4 shadow-sm space-y-3 relative overflow-hidden">
            <h4 className="font-bold text-sm">Live Database</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Connected securely to your store database via Prisma ORM.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-xl border border-emerald-200 dark:border-emerald-900">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span> DB Connected
            </div>
          </div>
        )}
      </div>

      {/* Bottom Profile Section */}
      <div className={`border-t p-3 flex items-center bg-background shrink-0 ${isOpen ? "justify-between" : "justify-center"}`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="h-9 w-9 shrink-0 rounded-full bg-slate-300 overflow-hidden flex items-center justify-center">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" 
              alt="Avatar" 
              className="h-full w-full object-cover" 
            />
          </div>
          {isOpen && (
            <div className="text-left overflow-hidden">
              <p className="text-sm font-semibold leading-none truncate">Hafsa Store Admin</p>
              <p className="text-xs text-muted-foreground truncate mt-1">admin@store.com</p>
            </div>
          )}
        </div>
        {isOpen && <MoreVertical className="h-4 w-4 text-muted-foreground cursor-pointer shrink-0" />}
      </div>
    </aside>
  );
}