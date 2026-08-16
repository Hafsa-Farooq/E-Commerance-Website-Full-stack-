'use client';

import React, { useState } from "react";
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

const productsData = [
  {
    id: "RCH45Q1A",
    name: "HP Pavilion 16.1 Inch Gaming Laptop",
    price: "$960.99",
    category: "Electronics",
    stock: 5,
    sku: "RCH45Q1A",
    rating: 4.9,
    status: "Active",
    image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=100&h=100&fit=crop"
  },
  {
    id: "MVCFH27F-1",
    name: "Samsung SM-A21S Galaxy A21S",
    price: "$350.00",
    category: "Electronics",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Active",
    image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=100&h=100&fit=crop"
  },
  {
    id: "MVCFH27F-2",
    name: "Schwaiger KH510S 513 Buegelkopfhoerer",
    price: "$300.00",
    category: "Electronics",
    stock: 27,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Out Of Stock",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop"
  },
  {
    id: "MVCFH27F-3",
    name: "Ultimate Ears Wonderboom Bluetooth Speaker",
    price: "$119.99",
    category: "Electronics",
    stock: 10,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Active",
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=100&h=100&fit=crop"
  },
  {
    id: "MVCFH27F-4",
    name: "Canon Pixma TS3350 Multifunction Printer",
    price: "$439.50",
    category: "Electronics",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
    image: "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=100&h=100&fit=crop"
  },
  {
    id: "MVCFH27F-5",
    name: "Canon 4000D 18-55 MM III (Canon Eurasia Guaranteed)",
    price: "$49.50",
    category: "Beauty",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop"
  },
  {
    id: "MVCFH27F-6",
    name: "Lobwerk Lenovo Tab M10 TB-X605F",
    price: "$49.50",
    category: "Beauty",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=100&h=100&fit=crop"
  },
  {
    id: "MVCFH27F-7",
    name: "2019 55\" Q60R QLED 4K Quantum HDR Smart TV",
    price: "$49.50",
    category: "Beauty",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
    image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=100&h=100&fit=crop"
  },
  {
    id: "MVCFH27F-8",
    name: "Toshiba Canvio Partner 1 TB Portable",
    price: "$49.50",
    category: "Beauty",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
    image: "https://images.unsplash.com/photo-1531492740946-444738540855?w=100&h=100&fit=crop"
  },
  {
    id: "MVCFH27F-9",
    name: "Projection Laser Presentation Controller 2.4ghz Kl-Qx01",
    price: "$49.50",
    category: "Beauty",
    stock: 25,
    sku: "MVCFH27F",
    rating: 4.65,
    status: "Closed For Sale",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=100&h=100&fit=crop"
  }
];

export default function ProductListPage() {
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Products</h1>
        <Button className="bg-foreground text-background hover:bg-foreground/90 font-medium rounded-xl gap-2 shadow-sm">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
            <span>Total Sales</span>
            <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">+20.1%</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">$30,230</div>
        </div>

        <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
            <span>Number of Sales</span>
            <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">+5.02</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">982</div>
        </div>

        <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
            <span>Affiliate</span>
            <span className="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 text-xs font-semibold px-2 py-0.5 rounded-full border border-emerald-200">+3.1%</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">$4,530</div>
        </div>

        <div className="bg-card border rounded-2xl p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground text-sm font-medium">
            <span>Discounts</span>
            <span className="text-rose-600 bg-rose-50 dark:bg-rose-950/50 text-xs font-semibold px-2 py-0.5 rounded-full border border-rose-200">-3.58%</span>
          </div>
          <div className="text-2xl font-bold tracking-tight">$2,230</div>
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

          <button className="flex items-center gap-2 border bg-background hover:bg-muted/50 px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground">
            <Plus className="h-3.5 w-3.5" /> Status
          </button>

          <button className="flex items-center gap-2 border bg-background hover:bg-muted/50 px-3.5 py-2 rounded-xl text-sm font-medium text-muted-foreground">
            <Plus className="h-3.5 w-3.5" /> Category
          </button>

          <button className="flex items-center justify-between gap-4 border bg-background hover:bg-muted/50 px-3.5 py-2 rounded-xl text-sm font-medium text-foreground">
            <span>Price: $100-$200</span>
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        </div>

        <button className="flex items-center gap-2 border bg-background hover:bg-muted/50 px-3.5 py-2 rounded-xl text-sm font-medium text-foreground">
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
                  <input type="checkbox" className="rounded border-muted-foreground/30" />
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
              {productsData.map((product, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors group">
                  <td className="py-3 px-4 text-center">
                    <input type="checkbox" className="rounded border-muted-foreground/30" />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 rounded-xl bg-muted overflow-hidden border">
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                      </div>
                      <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium text-foreground">{product.price}</td>
                  <td className="py-3 px-4 text-muted-foreground">{product.category}</td>
                  <td className="py-3 px-4 text-muted-foreground">{product.stock}</td>
                  <td className="py-3 px-4 text-muted-foreground font-mono text-xs">{product.sku}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1 font-medium">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{product.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === "Active" 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-900" 
                        : product.status === "Out Of Stock" 
                        ? "bg-amber-50 text-amber-600 border border-amber-200 dark:bg-amber-950/40 dark:border-amber-900" 
                        : "bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/40 dark:border-rose-900"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === idx ? null : idx)}
                      className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {activeDropdown === idx && (
                      <div className="absolute right-8 top-12 w-44 bg-card border rounded-2xl shadow-lg p-1.5 z-50 text-left space-y-0.5">
                        <div className="px-3 py-1.5 text-xs font-semibold text-muted-foreground border-b mb-1">Actions</div>
                        <button className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground">
                          <Eye className="h-3.5 w-3.5 text-muted-foreground" /> View details
                        </button>
                        <button className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground">
                          <Edit className="h-3.5 w-3.5 text-muted-foreground" /> Edit
                        </button>
                        <button className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-muted text-foreground">
                          <Copy className="h-3.5 w-3.5 text-muted-foreground" /> Copy ID
                        </button>
                        <button className="flex w-full items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl hover:bg-rose-50 hover:text-rose-600 text-rose-500">
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="flex items-center justify-between p-4 border-t bg-muted/10 text-sm text-muted-foreground">
          <span>0 of 12 row(s) selected.</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl font-medium" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="rounded-xl font-medium">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}