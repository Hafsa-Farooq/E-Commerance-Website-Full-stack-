'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Plus, UploadCloud } from "lucide-react";

export default function AddProductPage() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Title & Action Buttons */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Add Products</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl text-xs font-semibold">
            Discard
          </Button>
          <Button variant="outline" className="rounded-xl text-xs font-semibold">
            Save Draft
          </Button>
          <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/95 text-xs font-semibold">
            Publish
          </Button>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (Main Form Details) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Product Details Card */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold">Name</Label>
                <Input id="name" placeholder="Product name" className="rounded-xl" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-xs font-semibold">SKU</Label>
                  <Input id="sku" placeholder="SKU code" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode" className="text-xs font-semibold">Barcode</Label>
                  <Input id="barcode" placeholder="Barcode number" className="rounded-xl" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Set a description to the product for better visibility." 
                  className="rounded-xl min-h-[120px] resize-none" 
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Images Card */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Product Images</CardTitle>
              <button className="text-xs font-semibold text-primary hover:underline">
                Add media from URL
              </button>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-muted rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-muted/20">
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm mb-3 text-muted-foreground">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">Drop your images here</p>
                <p className="text-xs text-muted-foreground mb-4">PNG or JPG (max. 5MB)</p>
                <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold flex items-center gap-2">
                  <ImagePlus className="h-4 w-4" /> Select images
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Variants Card */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Variants</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold text-muted-foreground">
                <span>Options</span>
                <span>Value</span>
                <span>Price</span>
              </div>

              {/* Variant Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <Select>
                  <SelectTrigger className="rounded-xl text-xs">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="color">Color</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Value" className="rounded-xl text-xs" />
                <Input placeholder="Price" className="rounded-xl text-xs" />
              </div>

              {/* Variant Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <Select>
                  <SelectTrigger className="rounded-xl text-xs">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="size">Size</SelectItem>
                    <SelectItem value="color">Color</SelectItem>
                    <SelectItem value="material">Material</SelectItem>
                  </SelectContent>
                </Select>
                <Input placeholder="Value" className="rounded-xl text-xs" />
                <Input placeholder="Price" className="rounded-xl text-xs" />
              </div>

              <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold flex items-center gap-1.5 mt-2">
                <Plus className="h-4 w-4" /> Add Variant
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Pricing Card */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="base-price" className="text-xs font-semibold">Base Price</Label>
                <Input id="base-price" placeholder="0.00" className="rounded-xl" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount-price" className="text-xs font-semibold">Discounted Price</Label>
                <Input id="discount-price" placeholder="0.00" className="rounded-xl" />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="charge-tax" className="text-xs font-medium text-foreground">Charge tax on this product</Label>
                <Switch id="charge-tax" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Label htmlFor="in-stock" className="text-xs font-medium text-foreground">In stock</Label>
                <Switch id="in-stock" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select defaultValue="draft">
                <SelectTrigger className="rounded-xl text-xs">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              <CardDescription className="text-xs text-muted-foreground">
                Set the product status.
              </CardDescription>
            </CardContent>
          </Card>

          {/* Categories Card */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="rounded-xl text-xs flex-1">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="home">Home & Kitchen</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="rounded-xl text-xs flex-1">
                    <SelectValue placeholder="Select a sub category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phones">Phones</SelectItem>
                    <SelectItem value="laptops">Laptops</SelectItem>
                    <SelectItem value="shirts">Shirts</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 shrink-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}