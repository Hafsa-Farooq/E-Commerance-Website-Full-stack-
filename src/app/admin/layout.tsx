import Link from "next/link";
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  Boxes, 
  ShoppingCart, 
  Users, 
  TicketPercent, 
  CreditCard 
} from "lucide-react";

const sidebarNav = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Categories", href: "/admin/categories", icon: Layers },
  { name: "Inventory", href: "/admin/inventory", icon: Boxes },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Coupons", href: "/admin/coupons", icon: TicketPercent },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-tight text-white">Store Admin</h1>
          <p className="text-xs text-slate-400 mt-1">Management Portal</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-slate-800 hover:text-white text-slate-400"
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-8">
          <h2 className="text-sm font-medium text-slate-300">Admin Dashboard</h2>
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full font-medium">
            Live DB Connected
          </span>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}