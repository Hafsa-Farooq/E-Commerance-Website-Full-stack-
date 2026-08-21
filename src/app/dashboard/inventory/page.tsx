'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Search, MoreHorizontal, ArrowUpDown, 
  Plus 
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  image: string;
  stock: number;
  price: string;
  status: string;
  statusColor: string;
}

export default function InventoryPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Aik page par kitne items dikhane hain

  // Fetch inventory from API with search filtering
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/inventory?search=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setInventoryItems(data.data);
          setCurrentPage(1); // Naya search hote hi pehle page pe wapas jana
        }
      } catch (error) {
        console.error("Failed to fetch inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchInventory();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Pagination Logic Calculations
  const totalPages = Math.ceil(inventoryItems.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = inventoryItems.slice(indexOfFirstItem, indexOfLastItem);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Handle stock update
  const handleUpdateStock = async (id: string, currentStock: number) => {
    const newStockStr = prompt("Enter new stock quantity:", currentStock.toString());
    if (newStockStr !== null) {
      const newStock = parseInt(newStockStr, 10);
      if (isNaN(newStock) || newStock < 0) {
        alert("Please enter a valid stock number.");
        return;
      }

      try {
        const res = await fetch(`/api/inventory/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stock: newStock }),
        });
        const data = await res.json();
        if (data.success) {
          setInventoryItems(inventoryItems.map(item => {
            if (item.id === id) {
              let status = "In Stock";
              let statusColor = "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400";
              if (newStock === 0) {
                status = "Out of Stock";
                statusColor = "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400";
              } else if (newStock <= 10) {
                status = "Low Stock";
                statusColor = "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400";
              }
              return { ...item, stock: newStock, status, statusColor };
            }
            return item;
          }));
          setOpenDropdownId(null);
        } else {
          alert(data.error || "Failed to update stock");
        }
      } catch (error) {
        console.error("Error updating stock:", error);
      }
    }
  };

  // Handle item deletion
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this item?")) {
      try {
        const res = await fetch(`/api/inventory/${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (data.success) {
          setInventoryItems(inventoryItems.filter(item => item.id !== id));
          setOpenDropdownId(null);
        } else {
          alert(data.error || "Failed to delete item");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === currentItems.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentItems.map(item => item.id));
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Inventory</h1>
          <p className="text-xs text-muted-foreground mt-1">Monitor stock levels, SKUs, and manage warehouse product availability.</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard/inventory/new")}
          className="rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold text-xs h-10 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Stock
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search inventory by SKU or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Inventory Table Card */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === currentItems.length && currentItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Stock <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    Loading inventory...
                  </td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No inventory items found.
                  </td>
                </tr>
              ) : (
                currentItems.map((item) => {
                  const isSelected = selectedRows.includes(item.id);
                  const isDropdownOpen = openDropdownId === item.id;

                  return (
                    <tr key={item.id} className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-muted/50' : ''}`}>
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelectRow(item.id)}
                          className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="h-10 w-10 rounded-xl object-cover border" />
                          ) : (
                            <div className="h-10 w-10 rounded-xl bg-muted border flex items-center justify-center font-bold text-muted-foreground text-xs">
                              {item.name ? item.name.charAt(0).toUpperCase() : "P"}
                            </div>
                          )}
                          <div>
                            <span className="font-bold text-foreground text-sm">{item.name}</span>
                            <span className="block text-[11px] text-muted-foreground">{item.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{item.sku}</td>
                      <td className="py-3 px-4 text-muted-foreground font-medium">{item.category}</td>
                      <td className="py-3 px-4 font-bold text-foreground">{item.stock} units</td>
                      <td className="py-3 px-4 font-semibold text-foreground">{item.price}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${item.statusColor}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right relative">
                        <button 
                          onClick={() => setOpenDropdownId(isDropdownOpen ? null : item.id)}
                          className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-all ml-auto cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {isDropdownOpen && (
                          <div className="absolute right-10 top-12 w-40 bg-popover text-popover-foreground border rounded-xl shadow-lg p-1.5 z-50 text-left space-y-0.5">
                            <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase border-b mb-1">Actions</div>
                            <button 
                              onClick={() => handleUpdateStock(item.id, item.stock)}
                              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs font-medium cursor-pointer"
                            >
                              Update Stock
                            </button>
                            <button 
                              onClick={() => {
                                setOpenDropdownId(null);
                                router.push(`/dashboard/product-detail?id=${item.id}`);
                              }}
                              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-muted text-xs font-medium cursor-pointer"
                            >
                              View Details
                            </button>
                            <button 
                              onClick={() => handleDelete(item.id)}
                              className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-destructive/10 text-destructive text-xs font-medium cursor-pointer"
                            >
                              Remove
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

        {/* Table Footer / Functional Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{selectedRows.length} of {currentItems.length} row(s) selected.</span>
            <span>Page {currentPage} of {totalPages} ({inventoryItems.length} total items)</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              className="rounded-xl text-xs font-semibold h-9" 
              onClick={handlePrevPage}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              className="rounded-xl text-xs font-semibold h-9" 
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}