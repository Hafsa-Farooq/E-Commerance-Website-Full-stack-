import { prisma } from "@/lib/prisma";

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    include: {
      order: { include: { user: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Payment Records</h1>
        <p className="text-sm text-slate-400">Inspect gateway transactions and payment statuses.</p>
      </div>

      <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-900/80">
              <th className="p-4">Payment ID</th>
              <th className="p-4">Order #</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {payments.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No payment records found.</td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-400">{payment.id}</td>
                  <td className="p-4 font-mono font-medium text-white">{payment.order?.orderNumber || "N/A"}</td>
                  <td className="p-4 font-semibold text-white">${Number(payment.amount).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${payment.status === 'SUCCEEDED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-xs">{new Date(payment.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}