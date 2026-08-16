import { prisma } from "@/lib/prisma";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: {
        include: { inventory: true }
      },
      images: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Management</h1>
          <p className="text-sm text-slate-400">Total products in store: {products.length}</p>
        </div>
      </div>

      <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-900/80">
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Base Price</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {products.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No products found in database.</td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-medium text-white">{p.name}</td>
                  <td className="p-4 text-slate-400">{p.category?.name || "Uncategorized"}</td>
                  <td className="p-4">${Number(p.basePrice).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${p.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}