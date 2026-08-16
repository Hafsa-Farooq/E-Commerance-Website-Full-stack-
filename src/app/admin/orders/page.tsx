import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      items: {
        include: { variant: { include: { product: true } } }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Order Management</h1>
        <p className="text-sm text-slate-400">Review customer orders and track fulfillment status.</p>
      </div>

      <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-900/80">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No orders placed yet.</td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-medium text-white">{order.orderNumber}</td>
                  <td className="p-4 text-slate-300">{order.user?.email || "Guest"}</td>
                  <td className="p-4 font-semibold text-white">${Number(order.total).toFixed(2)}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}