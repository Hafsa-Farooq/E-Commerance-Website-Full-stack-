'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  MoreHorizontal, 
  Star, 
  ArrowUpDown,
  Eye,
  Edit,
  Copy,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ProductListPage() {
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        const result = await res.json();

        if (result.success) {
          setProducts(result.data);
          toast.success("Products successfully load ho gaye hain!");
        } else {
          toast.error("Products load karne mein masla aaya hai.");
        }
      } catch (error) {
        toast.error("Kuch galat ho gaya hai!");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Real data calculations for top metric cards
  const totalInventoryValue = products.reduce((acc, p) => acc + (Number(p.basePrice || 0) * Number(p.stock || 0)), 0);
  const totalStockCount = products.reduce((acc, p) => acc + Number(p.stock || 0), 0);
  const activeProductsCount = products.filter(p => p.isActive ?? true).length;
  const averagePrice = products.length > 0 ? (products.reduce((acc, p) => acc + Number(p.basePrice || 0), 0) / products.length).toFixed(0) : 0;

  const handleViewDetails = (productId: string) => {
    setActiveDropdown(null);
    router.push(`/dashboard/product-detail?id=${productId}`);
  };

  const handleEdit = (productId: string) => {
    setActiveDropdown(null);
    router.push(`/dashboard/add-product?id=${productId}`);
  };

  const handleDelete = async (productId: string, productName: string) => {
    setActiveDropdown(null);

    const confirmed = window.confirm(`Kya aap "${productName}" ko delete karna chahte hain? Ye action wapas nahi ho sakta.`);
    if (!confirmed) return;

    setDeletingId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.error || "Product delete nahi ho saka");
      }

      setProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success("Product delete ho gaya hai!");
    } catch (error: any) {
      toast.error(error.message || "Kuch galat ho gaya hai!");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Products</h1>
        <Link href="/dashboard/add-product">
          <button className="inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90 transition-colors cursor-pointer">
            + Add Product
          </button>
        </Link>
      </div>

      {/* Dynamic Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
            <span>Total Inventory Value</span>
            <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">Live</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">${totalInventoryValue.toLocaleString()}</div>
        </div>

        <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
            <span>Total Stock Units</span>
            <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">{products.length} Items</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">{totalStockCount}</div>
        </div>

        <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
            <span>Active Products</span>
            <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">Active</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">{activeProductsCount}</div>
        </div>

        <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
            <span>Average Price</span>
            <span className="text-blue-600 bg-blue-50 dark:bg-blue-950/50 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-200">Avg</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">${averagePrice}</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-card border rounded-2xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative min-w-[240px] flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search products..." 
              className="w-full bg-muted/30 border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <button className="flex items-center gap-2 border bg-background hover:bg-muted/50 px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Status
          </button>

          <button className="flex items-center gap-2 border bg-background hover:bg-muted/50 px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground cursor-pointer">
            <Plus className="h-3.5 w-3.5" /> Category
          </button>

          <button className="flex items-center justify-between gap-4 border bg-background hover:bg-muted/50 px-3.5 py-2 rounded-xl text-sm font-medium text-foreground cursor-pointer">
            <span>Price: All</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        <button className="flex items-center gap-2 border bg-background hover:bg-muted/50 px-3.5 py-2 rounded-xl text-sm font-medium text-foreground cursor-pointer">
          <span>Columns</span>
          <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/20 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <th className="py-4 px-4 w-12 text-center">
                  <input type="checkbox" className="rounded border-muted-foreground/30 cursor-pointer" />
                </th>
                <th className="py-4 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
                    Product Name <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-4 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
                    Price <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-4 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
                    Category <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-4 px-4">
                  <div className="flex items-center gap-1.5 cursor-pointer hover:text-foreground">
                    Stock <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-4 px-4">SKU</th>
                <th className="py-4 px-4">Rating</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground">
                    Loading products from database...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground">
                    Koi product database mein mojood nahi hai.
                  </td>
                </tr>
              ) : (
                products.map((product, idx) => (
                  <tr 
                    key={product.id || idx} 
                    className={`hover:bg-muted/30 transition-colors group ${deletingId === product.id ? "opacity-40 pointer-events-none" : ""}`}
                  >
                    <td className="py-3 px-4 text-center">
                      <input type="checkbox" className="rounded border-muted-foreground/30 cursor-pointer" />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-muted overflow-hidden border">
                          <img 
                            src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop"} 
                            alt={product.name} 
                            className="h-full w-full object-cover" 
                          />
                        </div>
                        <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-foreground">${product.basePrice}</td>
                    <td className="py-3 px-4 text-muted-foreground">{product.category?.name || "N/A"}</td>
                    <td className="py-3 px-4 text-muted-foreground">{product.stock ?? 10}</td>
                    <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{product.sku || product.id.slice(0, 8)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-medium">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{product.rating || 5.0}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        (product.isActive ?? true)
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900" 
                          : "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900"
                      }`}>
                        {(product.isActive ?? true) ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                        className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>

                      {activeDropdown === idx && (
                        <div className="absolute right-8 top-12 w-44 bg-card border rounded-2xl shadow-lg p-1.5 z-50 text-left space-y-0.5">
                          <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1">Actions</div>
                          <button 
                            onClick={() => handleViewDetails(product.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground cursor-pointer"
                          >
                            <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View details
                          </button>
                          <button 
                            onClick={() => handleEdit(product.id)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5 text-muted-foreground" /> Edit
                          </button>
                          <button 
                            onClick={() => {
                              navigator.clipboard.writeText(product.id);
                              toast.success("Product ID copy ho gayi hai!");
                              setActiveDropdown(null);
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground cursor-pointer"
                          >
                            <Copy className="h-3.5 w-3.5 text-muted-foreground" /> Copy ID
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id, product.name)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-rose-50 hover:text-rose-600 text-rose-500 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between p-4 border-t bg-muted/10 text-sm text-muted-foreground">
          <span>{products.length} row(s) found.</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl font-medium" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-xl font-medium cursor-pointer">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}