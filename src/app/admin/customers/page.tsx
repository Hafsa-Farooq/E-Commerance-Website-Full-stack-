import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    include: {
      _count: { select: { orders: true, wishlist: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Customer Management</h1>
        <p className="text-sm text-slate-400">View registered users and their purchase history.</p>
      </div>

      <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-900/80">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Total Orders</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No customers registered yet.</td>
              </tr>
            ) : (
              customers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-medium text-white">{user.name || "N/A"}</td>
                  <td className="p-4 text-slate-300">{user.email}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-slate-800 text-slate-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{user._count.orders}</td>
                  <td className="p-4 text-slate-400 text-xs">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}