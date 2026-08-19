'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PackagePlus } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

export default function AddStockPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    categoryId: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  // Fetch categories so user can select one for the stock item
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        router.push("/dashboard/inventory");
      } else {
        alert(data.error || "Failed to add stock");
      }
    } catch (error) {
      console.error("Error adding stock:", error);
      alert("An error occurred while adding stock.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12 w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-xl h-10 w-10 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Add New Stock</h1>
            <p className="text-xs text-muted-foreground mt-1">Add a new product item and initialize its warehouse stock level.</p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <Card className="rounded-2xl border shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Product Name *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Classic Men's Hoodie"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">SKU Code</label>
              <input 
                type="text" 
                placeholder="e.g. HD-MEN-01"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Category *</label>
              <select 
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Price ($) *</label>
              <input 
                type="number" 
                step="0.01"
                required
                placeholder="49.99"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-foreground">Initial Stock (Units) *</label>
              <input 
                type="number" 
                required
                placeholder="45"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full h-10 px-3 rounded-xl border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Image URL</label>
            <input 
              type="url" 
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full h-10 px-3 rounded-xl border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Description</label>
            <textarea 
              rows={3}
              placeholder="Product description..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 rounded-xl border bg-background font-medium focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="rounded-xl h-10 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="rounded-xl bg-foreground text-background hover:bg-foreground/90 h-10 text-xs font-semibold gap-2 cursor-pointer"
            >
              <PackagePlus className="h-4 w-4" /> {loading ? "Saving..." : "Save Stock Item"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}