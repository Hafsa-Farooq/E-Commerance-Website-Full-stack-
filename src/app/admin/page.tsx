import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [productCount, customerCount, lowStockProducts] = await Promise.all([
    prisma.product.count(),
    prisma.user ? prisma.user.count() : Promise.resolve(0),
    prisma.inventory.count({ where: { availableQty: { lte: 5 } } }),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h1>
        <p className="text-sm text-slate-400">Here is what is happening in your store today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
          <span className="text-sm text-slate-400">Total Products</span>
          <div className="text-3xl font-bold text-white">{productCount}</div>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
          <span className="text-sm text-slate-400">Total Customers</span>
          <div className="text-3xl font-bold text-white">{customerCount}</div>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2">
          <span className="text-sm text-slate-400">Low Stock Alerts</span>
          <div className="text-3xl font-bold text-amber-400">{lowStockProducts}</div>
        </div>
      </div>
    </div>
  );
}