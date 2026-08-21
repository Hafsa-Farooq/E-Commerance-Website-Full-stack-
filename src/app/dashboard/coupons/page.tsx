'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, MoreHorizontal, 
  Ticket, Plus, Loader2 
} from "lucide-react";

interface Coupon {
  id: string;
  dbId: string;
  code: string;
  title: string;
  type: string;
  value: string;
  usage: string;
  status: string;
  statusColor: string;
  expiry: string;
}

export default function CouponsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/coupons');
      const data = await res.json();
      if (data.success) {
        setCoupons(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (dbId: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;

    try {
      const res = await fetch(`/api/coupons/${dbId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.success) {
        setCoupons((prev) => prev.filter((c) => c.dbId !== dbId));
        setOpenDropdownId(null);
      } else {
        alert(data.error || "Failed to delete coupon");
      }
    } catch (error) {
      console.error("Error deleting coupon:", error);
      alert("Something went wrong");
    }
  };

  // Filter coupons based on search query
  const filteredCoupons = coupons.filter(cpn => 
    cpn.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cpn.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredCoupons.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredCoupons.map(c => c.id));
    }
  };

  const toggleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 w-full">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Coupons</h1>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Manage promotional discount codes, vouchers, and special offers for your store.</p>
        </div>
        <Link href="/dashboard/coupons/new">
          <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold text-xs h-10">
            <Plus className="h-4 w-4" /> Create Coupon
          </Button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search coupons by code or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Coupons Table Card */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === filteredCoupons.length && filteredCoupons.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Discount</th>
                <th className="py-3 px-4">Usage Limits</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Expiry Date</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
                    Loading coupons from database...
                  </td>
                </tr>
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground font-medium">
                    No coupons found. Create your first coupon using the button above!
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((cpn) => {
                  const isSelected = selectedRows.includes(cpn.id);
                  const isDropdownOpen = openDropdownId === cpn.id;

                  return (
                    <tr key={cpn.id} className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-muted/50' : ''}`}>
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelectRow(cpn.id)}
                          className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <Ticket className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="font-mono font-bold text-foreground text-sm tracking-wider">{cpn.code}</span>
                            <span className="block text-[11px] text-muted-foreground">{cpn.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground">{cpn.value}</td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">{cpn.usage}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${cpn.statusColor}`}>
                          {cpn.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">{cpn.expiry}</td>
                      <td className="py-3 px-4 text-right relative">
                        <button 
                          onClick={() => setOpenDropdownId(isDropdownOpen ? null : cpn.id)}
                          className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-all ml-auto cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {isDropdownOpen && (
                          <div className="absolute right-10 top-12 w-40 bg-popover text-popover-foreground border rounded-xl shadow-lg p-1.5 z-50 text-left space-y-0.5">
                            <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase border-b mb-1">Actions</div>
                            <button 
                              onClick={() => setOpenDropdownId(null)} 
                              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs font-medium cursor-pointer"
                            >
                              Edit Coupon
                            </button>
                            <button 
                              onClick={() => handleDelete(cpn.dbId)} 
                              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive text-xs font-medium cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4 text-xs text-muted-foreground">
          <div>
            {selectedRows.length} of {filteredCoupons.length} row(s) selected.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled className="rounded-xl text-xs font-semibold h-9">
              Previous
            </Button>
            <Button variant="outline" disabled className="rounded-xl text-xs font-semibold h-9">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}