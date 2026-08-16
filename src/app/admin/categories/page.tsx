import { prisma } from "@/lib/prisma";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Category Management</h1>
        <p className="text-sm text-slate-400">Manage store categories and product types here.</p>
      </div>

      <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-900/80">
              <th className="p-4">Category Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Products Count</th>
              <th className="p-4">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">No categories found.</td>
              </tr>
            ) : (
              categories.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-medium text-white">{c.name}</td>
                  <td className="p-4 text-slate-400 font-mono text-xs">{c.slug}</td>
                  <td className="p-4 text-slate-300">{c._count.products}</td>
                  <td className="p-4 text-slate-400 text-xs">{new Date(c.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}