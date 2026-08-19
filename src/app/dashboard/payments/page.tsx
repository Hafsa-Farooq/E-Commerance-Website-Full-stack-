'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, MoreHorizontal, ArrowUpDown, 
  CreditCard, DollarSign, Wallet, Building2, Loader2 
} from "lucide-react";

interface Payment {
  id: string;
  dbId: string;
  orderId: string;
  customer: string;
  email: string;
  method: string;
  amount: string;
  status: string;
  statusColor: string;
  date: string;
}

const fallbackPayments: Payment[] = [
  {
    id: "PAY-1001",
    dbId: "1",
    orderId: "ORD-5014",
    customer: "Alex Johnson",
    email: "alex.j@example.com",
    method: "Stripe",
    amount: "$149.99",
    status: "Completed",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400",
    date: "Aug 17, 2026"
  },
  {
    id: "PAY-1002",
    dbId: "2",
    orderId: "ORD-5015",
    customer: "Sarah Williams",
    email: "sarah.w@example.com",
    method: "Bank Transfer",
    amount: "$280.50",
    status: "Pending",
    statusColor: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400",
    date: "Aug 16, 2026"
  }
];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const [payments, setPayments] = useState<Payment[]>(fallbackPayments);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/payments');
        const contentType = res.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (data.success && data.data.length > 0) {
            setPayments(data.data);
          }
        }
      } catch (err) {
        console.error("Error fetching payments, using fallback:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getMethodIcon = (method: string) => {
    if (method.includes("Bank")) return <Building2 className="h-4 w-4 text-purple-500" />;
    if (method.includes("Cash")) return <Wallet className="h-4 w-4 text-emerald-600" />;
    return <CreditCard className="h-4 w-4 text-blue-500" />;
  };

  const filteredPayments = payments.filter(pay => 
    pay.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    pay.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pay.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredPayments.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredPayments.map(p => p.id));
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Payments</h1>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Track customer transaction history, Stripe payments, bank transfers, and cash on delivery.</p>
        </div>
        <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold text-xs h-10">
          <DollarSign className="h-4 w-4" /> Export Report
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by transaction ID, customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Payments Table Card */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === filteredPayments.length && filteredPayments.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Amount <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {filteredPayments.map((pay) => {
                const isSelected = selectedRows.includes(pay.id);
                const isDropdownOpen = openDropdownId === pay.id;

                return (
                  <tr key={pay.id} className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-muted/50' : ''}`}>
                    <td className="py-3 px-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelectRow(pay.id)}
                        className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-foreground">{pay.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-foreground text-sm">{pay.customer}</span>
                        <span className="block text-[11px] text-muted-foreground">{pay.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">{pay.orderId}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2 font-medium text-foreground">
                        {getMethodIcon(pay.method)}
                        <span>{pay.method}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-bold text-foreground">{pay.amount}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${pay.statusColor}`}>
                        {pay.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-medium">{pay.date}</td>
                    <td className="py-3 px-4 text-right relative">
                      <button 
                        onClick={() => setOpenDropdownId(isDropdownOpen ? null : pay.id)}
                        className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-all ml-auto"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {/* Action Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute right-10 top-12 w-44 bg-popover text-popover-foreground border rounded-xl shadow-lg p-1.5 z-50 text-left space-y-0.5">
                          <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase border-b mb-1">Actions</div>
                          <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs font-medium">View Invoice</button>
                          <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs font-medium">Verify Payment</button>
                          <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive text-xs font-medium">Refund</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4 text-xs text-muted-foreground">
          <div>
            {selectedRows.length} of {filteredPayments.length} row(s) selected.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled className="rounded-xl text-xs font-semibold h-9">
              Previous
            </Button>
            <Button variant="outline" className="rounded-xl text-xs font-semibold h-9">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}