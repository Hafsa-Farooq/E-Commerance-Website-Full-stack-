'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Search, MoreHorizontal, ArrowUpDown 
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productsCount: number;
  status: string;
}

export default function CategoriesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/categories?search=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchCategories();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        const res = await fetch(`/api/categories/${id}`, {
          method: "DELETE",
        });
        
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};

        if (res.ok && data.success) {
          setCategories(categories.filter(c => c.id !== id));
          setOpenDropdownId(null);
        } else {
          alert(data.error || text || "Failed to delete category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Failed to delete category due to a server or network error.");
      }
    }
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === categories.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(categories.map(c => c.id));
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
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage product categories like clothing, shoes, and more.</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard/categories/new")}
          className="rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold text-xs h-10 cursor-pointer"
        >
          <Plus className="h-4 w-4" /> Add Category
        </Button>
      </div>

      {/* Search and Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border bg-background text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      {/* Categories Table Card */}
      <Card className="rounded-2xl border shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <th className="py-3 px-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedRows.length === categories.length && categories.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">
                  <div className="flex items-center gap-1 cursor-pointer hover:text-foreground">
                    Products <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
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
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    Loading categories...
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-muted-foreground">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => {
                  const isSelected = selectedRows.includes(cat.id);
                  const isDropdownOpen = openDropdownId === cat.id;

                  return (
                    <tr key={cat.id} className={`hover:bg-muted/30 transition-colors ${isSelected ? 'bg-muted/50' : ''}`}>
                      <td className="py-3 px-4 text-center">
                        <input 
                          type="checkbox" 
                          checked={isSelected}
                          onChange={() => toggleSelectRow(cat.id)}
                          className="rounded border-input text-primary focus:ring-primary cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={cat.image || "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=100&auto=format&fit=crop&q=80"} 
                            alt={cat.name} 
                            className="h-10 w-10 rounded-xl object-cover border" 
                          />
                          <div>
                            <span className="font-bold text-foreground text-sm">{cat.name}</span>
                            <span className="block text-[11px] text-muted-foreground">{cat.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-muted-foreground">{cat.slug}</td>
                      <td className="py-3 px-4 font-semibold text-foreground">{cat.productsCount} items</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {cat.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right relative">
                        <button 
                          onClick={() => setOpenDropdownId(isDropdownOpen ? null : cat.id)}
                          className="h-8 w-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground transition-all ml-auto cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {/* Action Dropdown Menu */}
                        {isDropdownOpen && (
                          <div className="absolute right-4 top-12 w-44 bg-popover text-popover-foreground border rounded-xl shadow-xl p-1.5 z-50 text-left space-y-0.5">
                            <div className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground uppercase border-b mb-1">Actions</div>
                            <button 
                              onClick={() => {
                                setOpenDropdownId(null);
                                router.push(`/dashboard/categories/new?id=${cat.id}`);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-xs font-medium cursor-pointer"
                            >
                              Edit Category
                            </button>
                            <button 
                              onClick={() => {
                                setOpenDropdownId(null);
                                router.push(`/dashboard/products?category=${cat.slug}`);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-xs font-medium cursor-pointer"
                            >
                              View Products
                            </button>
                            <button 
                              onClick={() => {
                                handleDelete(cat.id);
                              }}
                              className="w-full text-left px-3 py-2 rounded-lg hover:bg-destructive/10 text-destructive text-xs font-medium cursor-pointer"
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
            {selectedRows.length} of {categories.length} row(s) selected.
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