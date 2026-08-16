import { prisma } from "@/lib/prisma";

export default async function AdminCouponsPage() {
  const coupons = await prisma.coupon.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Coupon Management</h1>
        <p className="text-sm text-slate-400">Create and monitor discount vouchers and promo codes.</p>
      </div>

      <div className="border border-slate-800 rounded-2xl bg-slate-900/50 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase bg-slate-900/80">
              <th className="p-4">Code</th>
              <th className="p-4">Discount Type</th>
              <th className="p-4">Value</th>
              <th className="p-4">Status</th>
              <th className="p-4">Expires At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">No coupons available.</td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono font-medium text-white">{coupon.code}</td>
                  <td className="p-4 text-slate-300">{coupon.discountType}</td>
                  <td className="p-4 text-slate-300">
                    {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}%` : `$${Number(coupon.discountValue).toFixed(2)}`}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs rounded-full font-medium ${coupon.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 text-xs">
                    {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}
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