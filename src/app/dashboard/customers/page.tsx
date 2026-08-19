'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, MoreHorizontal, ArrowUpDown, 
  Users, Mail, Phone, ShoppingBag, DollarSign, UserCheck, Loader2 
} from "lucide-react";

interface Customer {
  id: string;
  dbId: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  totalOrders: number;
  totalSpent: string;
  status: string;
  statusColor: string;
  joinedDate: string;
}

// Fallback dummy data taake UI hamesha intact rahe
const fallbackCustomers: Customer[] = [
  {
    id: "CUST-001",
    dbId: "sample-1",
    name: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "+1 (555) 234-5678",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
    totalOrders: 14,
    totalSpent: "$1,420.50",
    status: "Active",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400",
    joinedDate: "Jan 12, 2026"
  },
  {
    id: "CUST-002",
    dbId: "sample-2",
    name: "Sarah Williams",
    email: "sarah.w@example.com",
    phone: "+1 (555) 987-6543",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
    totalOrders: 8,
    totalSpent: "$890.00",
    status: "Active",
    statusColor: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400",
    joinedDate: "Feb 04, 2026"
  }
];

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  
  const [customers, setCustomers] = useState<Customer[]>(fallbackCustomers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/customers');
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setCustomers(data.data);
        }
      } catch (err) {
        console.error("Error fetching customers, using fallback UI template:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // Search filter logic
  const filteredCustomers = customers.filter(cust => 
    cust.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cust.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredCustomers.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredCustomers.map(c => c.id));
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
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Customers</h1>
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-xs text-muted-foreground mt-1">Manage registered buyers, view purchase history, and track customer analytics.</p>
        </div>
        <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold text-xs h-10">
          <Users className="h-4 w-4" /> Add Customer
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Customers Table Card */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Orders <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Total Spent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {filteredCustomers.map((cust) => {
                const isSelected = selectedRows.includes(cust.id);
                const isDropdownOpen = openDropdownId === cust.id;

                return (
                  <tr key={cust.id} className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-muted/50' : ''}`}>
                    <td className="py-3 px-4 text-center">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={() => toggleSelectRow(cust.id)}
                        className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img src={cust.avatar} alt={cust.name} className="h-10 w-10 rounded-full object-cover border" />
                        <div>
                          <span className="font-bold text-foreground text-sm">{cust.name}</span>
                          <span className="block text-[11px] text-muted-foreground">{cust.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-medium">{cust.phone}</td>
                    <td className="py-3 px-4 font-bold text-foreground">{cust.totalOrders} orders</td>
                    <td className="py-3 px-4 font-semibold text-foreground">{cust.totalSpent}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${cust.statusColor}`}>
                        {cust.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground font-medium">{cust.joinedDate}</td>
                    <td className="py-3 px-4 text-right relative">
                      <button 
                        onClick={() => setOpenDropdownId(isDropdownOpen ? null : cust.id)}
                        className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-all ml-auto"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {/* Action Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute right-10 top-12 w-40 bg-popover text-popover-foreground border rounded-xl shadow-lg p-1.5 z-50 text-left space-y-0.5">
                          <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase border-b mb-1">Actions</div>
                          <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs font-medium">View Profile</button>
                          <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs font-medium">Send Email</button>
                          <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive text-xs font-medium">Block User</button>
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
            {selectedRows.length} of {filteredCustomers.length} row(s) selected.
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