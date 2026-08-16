import { prisma } from "@/lib/prisma";

export default async function AdminInventoryPage() {
  const inventoryItems = await prisma.inventory.findMany({
    include: {
      variant: {
        include: { product: true }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
        <p className="text-sm text-slate-400">Track and monitor variant stock quantities.</p>
      </div>

      <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-900/80">
              <th className="p-4">Product & Variant</th>
              <th className="p-4">SKU</th>
              <th className="p-4">Available Qty</th>
              <th className="p-4">Reserved</th>
              <th className="p-4">Sold</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {inventoryItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No inventory records found.</td>
              </tr>
            ) : (
              inventoryItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-medium text-white">
                    {item.variant?.product?.name} <span className="text-xs text-slate-400">({item.variant?.size} / {item.variant?.color})</span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-xs">{item.variant?.sku}</td>
                  <td className="p-4">
                    <span className={`font-semibold ${item.availableQty <= item.lowStockThreshold ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {item.availableQty}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400">{item.reservedQty}</td>
                  <td className="p-4 text-slate-400">{item.soldQty}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}