'use client';

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, SlidersHorizontal, Columns3, MoreHorizontal, 
  ArrowUpDown 
} from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  dbId: string;
  productName: string;
  productImage: string;
  price: string;
  customerName: string;
  customerEmail: string;
  date: string;
  type: string;
  status: string;
  statusColor: string;
}

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);

  const tabs = ["All", "Completed", "Processed", "Returned", "Canceled"];

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchQuery) queryParams.append("search", searchQuery);
        if (activeTab) queryParams.append("tab", activeTab);

        const res = await fetch(`/api/orders?${queryParams.toString()}`);
        const data = await res.json();

        if (data.success) {
          setOrders(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, activeTab]);

  const toggleSelectAll = () => {
    if (selectedRows.length === orders.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(orders.map(o => o.id));
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
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Orders</h1>
        <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold text-xs cursor-pointer">
          <Plus className="h-4 w-4" /> Create Order
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === tab 
                ? 'bg-muted text-foreground shadow-sm' 
                : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Button variant="outline" className="rounded-xl gap-2 text-xs font-semibold h-10 cursor-pointer">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Status
          </Button>
          <Button variant="outline" className="rounded-xl gap-2 text-xs font-semibold h-10 cursor-pointer">
            <Columns3 className="h-3.5 w-3.5" /> Columns
          </Button>
        </div>
      </div>

      {/* Orders Table Card */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === orders.length && orders.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    # <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Price <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Date <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Status <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground font-medium">
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground font-medium">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isSelected = selectedRows.includes(order.id);
                  const isDropdownOpen = openDropdownId === order.id;

                  return (
                    <tr key={order.id} className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-muted/50' : ''}`}>
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelectRow(order.id)}
                          className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground">{order.id}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img src={order.productImage} alt={order.productName} className="h-9 w-9 rounded-xl object-cover border" />
                          <span className="font-semibold text-foreground">{order.productName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold text-foreground">{order.price}</td>
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-bold text-foreground">{order.customerName}</div>
                          <div className="text-[11px] text-muted-foreground">{order.customerEmail}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">{order.type}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${order.statusColor}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right relative">
                        <button 
                          onClick={() => setOpenDropdownId(isDropdownOpen ? null : order.id)}
                          className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-all ml-auto cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {isDropdownOpen && (
                          <div className="absolute right-10 top-12 w-40 bg-popover text-popover-foreground border rounded-xl shadow-lg p-1.5 z-50 text-left space-y-0.5">
                            <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase border-b mb-1">Actions</div>
                            
                            {/* Connected Link to Sidebar Order Detail Page with query param */}
                            <Link href={`/dashboard/order-detail?id=${order.id}`} className="w-full block">
                              <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs font-medium cursor-pointer">
                                Order Details
                              </button>
                            </Link>

                            <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs font-medium cursor-pointer">Edit</button>
                            <button className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive text-xs font-medium cursor-pointer">Delete</button>
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
            {selectedRows.length} of {orders.length} row(s) selected.
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" disabled className="rounded-xl text-xs font-semibold h-9 cursor-pointer">
              Previous
            </Button>
            <Button variant="outline" className="rounded-xl text-xs font-semibold h-9 cursor-pointer">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}