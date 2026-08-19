'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Ticket, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateCouponPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    usageLimit: "",
    expiresAt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create coupon");
      }

      router.push('/dashboard/coupons');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 w-full max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/coupons">
          <Button variant="outline" size="icon" className="rounded-xl h-9 w-9">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Create New Coupon</h1>
          <p className="text-xs text-muted-foreground mt-1">Add a new discount code or promotional voucher for store users.</p>
        </div>
      </div>

      <Card className="rounded-2xl border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Coupon Code</label>
            <input 
              type="text"
              required
              placeholder="e.g. WINTER50"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border bg-background text-xs font-medium uppercase focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Discount Type</label>
              <select 
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="PERCENTAGE">Percentage (%)</option>
                <option value="FIXED">Fixed Amount ($)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Discount Value</label>
              <input 
                type="number"
                step="0.01"
                required
                placeholder="e.g. 20"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Usage Limit (Optional)</label>
              <input 
                type="number"
                placeholder="e.g. 500"
                value={formData.usageLimit}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Expiry Date</label>
              <input 
                type="date"
                value={formData.expiresAt}
                onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link href="/dashboard/coupons">
              <Button type="button" variant="outline" className="rounded-xl text-xs font-semibold h-10">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={loading} className="rounded-xl bg-foreground text-background hover:bg-foreground/95 text-xs font-semibold h-10 gap-2">
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Coupon
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}