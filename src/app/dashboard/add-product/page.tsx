'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePlus, Plus, UploadCloud, Loader2, X, Check } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

// Variant row ka type — color ke liye value ek array (multi-select), baaqi ke liye single string
type VariantRow = {
  option: string;
  value: string | string[];
  price: string;
};

// Preset color palette — swatch + label, jo Variants mein "color" option select karne par dikhega
const colorPalette = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#F50606" },
  { name: "Olive", hex: "#4F4631" },
  { name: "Forest Green", hex: "#314F43" },
  { name: "Navy", hex: "#31354F" },
  { name: "Blue", hex: "#063AF5" },
  { name: "Yellow", hex: "#F5DD06" },
  { name: "Orange", hex: "#F57906" },
  { name: "Purple", hex: "#7D06F5" },
  { name: "Pink", hex: "#F506A2" },
  { name: "Cyan", hex: "#06CAF5" },
];

export default function AddProductPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const isEditMode = Boolean(productId);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Categories fetched from database
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [selectedCategoryName, setSelectedCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.data || [];
        setCategories(list);
      } catch (error) {
        console.error("Failed to load categories:", error);
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Form state management
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    description: "",
    price: "",
    discountPrice: "",
    stockQuantity: "",
    inStock: true,
    status: "draft",
    category: "",
  });

  // Images state (Cloudinary URLs)
  const [images, setImages] = useState<string[]>([]);

  // Variants state — color option ab array value rakhta hai (multi-select)
  const [variants, setVariants] = useState<VariantRow[]>([
    { option: "color", value: [], price: "" },
  ]);

  // Edit mode: existing product fetch karke form pre-fill karna
  useEffect(() => {
    if (!productId) return;

    async function fetchProductForEdit() {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const result = await res.json();

        if (result.success) {
          const p = result.data;

          setFormData({
            name: p.name || "",
            sku: p.sku || "",
            barcode: p.barcode || "",
            description: p.description || "",
            price: p.basePrice != null ? String(p.basePrice) : "",
            discountPrice: p.discountPrice != null ? String(p.discountPrice) : "",
            stockQuantity: p.stock != null ? String(p.stock) : "",
            inStock: (p.stock ?? 0) > 0,
            status: p.status ? p.status.toLowerCase() : "draft",
            category: p.categoryId || p.category?.id || "",
          });
          setSelectedCategoryName(p.category?.name || "");
          setImages(p.images?.map((img: any) => img.url) || []);

          // Saved ProductVariant records se UI variant-rows reconstruct karna
          const colorValues = Array.from(
            new Set(
              (p.variants || [])
                .filter((v: any) => v.color && v.color !== "Default")
                .map((v: any) => v.color)
            )
          ) as string[];

          const sizeRows: VariantRow[] = (p.variants || [])
            .filter((v: any) => v.size && v.size !== "One Size")
            .map((v: any) => ({
              option: "size",
              value: v.size,
              price: v.priceOverride != null ? String(v.priceOverride) : "",
            }));

          const reconstructed: VariantRow[] = [];
          if (colorValues.length > 0) {
            reconstructed.push({ option: "color", value: colorValues, price: "" });
          }
          reconstructed.push(...sizeRows);

          setVariants(
            reconstructed.length > 0 ? reconstructed : [{ option: "color", value: [], price: "" }]
          );
        } else {
          alert("Product load nahi ho saka.");
        }
      } catch (error) {
        console.error(error);
        alert("Product load karte waqt masla aaya.");
      } finally {
        setPageLoading(false);
      }
    }

    fetchProductForEdit();
  }, [productId]);

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle Cloudinary Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const uploadedUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const data = new FormData();
        data.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: data,
        });

        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Image upload failed");

        if (json.secure_url || json.url) {
          uploadedUrls.push(json.secure_url || json.url);
        }
      }

      setImages((prev) => [...prev, ...uploadedUrls]);
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Failed to upload image");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, index) => index !== indexToRemove));
  };

  // Variant handlers
  const addVariantRow = () => {
    setVariants([...variants, { option: "size", value: "", price: "" }]);
  };

  const updateVariant = (index: number, field: "option" | "value" | "price", value: string) => {
    setVariants((prev) => {
      const updated = [...prev];
      const row = updated[index];

      if (field === "option") {
        // Option badalne par purani value clear kar dein — color ab array, baaqi string
        updated[index] = { ...row, option: value, value: value === "color" ? [] : "" };
      } else if (field === "value") {
        updated[index] = { ...row, value };
      } else {
        updated[index] = { ...row, price: value };
      }
      return updated;
    });
  };

  // Color checkbox toggle — ek row mein multiple colors select/deselect karne ke liye
  const toggleColorValue = (index: number, colorName: string) => {
    setVariants((prev) => {
      const updated = [...prev];
      const row = updated[index];
      const current = Array.isArray(row.value) ? row.value : [];
      const exists = current.includes(colorName);
      updated[index] = {
        ...row,
        value: exists ? current.filter((c) => c !== colorName) : [...current, colorName],
      };
      return updated;
    });
  };

  const removeVariantRow = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e?: React.FormEvent, customStatus?: string) => {
    if (e) e.preventDefault();

    if (!formData.category) {
      alert("Please select a category before publishing.");
      return;
    }

    setLoading(true);
    try {
      const productStatus = customStatus || formData.status;
      const basePriceNum = parseFloat(formData.price) || 0;

      // Color multi-select rows ko individual variant entries mein expand karna
      // (backend ko ab bhi ek row = ek color value chahiye)
      const expandedVariants: { option: string; value: string; price: string }[] = [];
      variants.forEach((v) => {
        if (v.option === "color" && Array.isArray(v.value)) {
          v.value.forEach((colorName) => {
            expandedVariants.push({ option: "color", value: colorName, price: v.price });
          });
        } else if (typeof v.value === "string") {
          expandedVariants.push({ option: v.option, value: v.value, price: v.price });
        }
      });

      // Agar variant ka price base price ke exactly barabar hai, to use "no override" treat karna
      const cleanedVariants = expandedVariants.map((v) => {
        const variantPriceNum = v.price ? parseFloat(v.price) : null;
        if (variantPriceNum !== null && variantPriceNum === basePriceNum) {
          return { ...v, price: "" };
        }
        return v;
      });

      const payload = {
        name: formData.name,
        sku: formData.sku,
        barcode: formData.barcode,
        description: formData.description,
        price: formData.price,
        discountPrice: formData.discountPrice,
        stock: formData.stockQuantity ? parseInt(formData.stockQuantity) : 0,
        status: productStatus,
        category: formData.category,
        images: images,
        variants: cleanedVariants,
      };

      const response = await fetch(
        isEditMode ? `/api/products/${productId}` : "/api/products",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      alert(isEditMode ? "Product updated successfully!" : "Product added successfully!");
      router.push("/dashboard/products");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground text-sm font-medium">
        Loading product...
      </div>
    );
  }

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col gap-6 pb-12">
      {/* Top Header Title & Action Buttons */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {isEditMode ? "Edit Product" : "Add Products"}
        </h1>
        <div className="flex items-center gap-3">
          <Button 
            type="button" 
            variant="outline" 
            className="rounded-xl text-xs font-semibold"
            onClick={() => router.back()}
          >
            Discard
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="rounded-xl text-xs font-semibold"
            disabled={loading}
            onClick={() => handleSubmit(undefined, "draft")}
          >
            Save Draft
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
            className="rounded-xl bg-foreground text-background hover:bg-foreground/95 text-xs font-semibold"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? "Update Product" : "Publish"}
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
                <Input 
                  id="name" 
                  placeholder="Product name" 
                  className="rounded-xl"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku" className="text-xs font-semibold">SKU</Label>
                  <Input 
                    id="sku" 
                    placeholder="SKU code" 
                    className="rounded-xl"
                    value={formData.sku}
                    onChange={(e) => handleChange("sku", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode" className="text-xs font-semibold">Barcode</Label>
                  <Input 
                    id="barcode" 
                    placeholder="Barcode number" 
                    className="rounded-xl"
                    value={formData.barcode}
                    onChange={(e) => handleChange("barcode", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-semibold">Description (Optional)</Label>
                <Textarea 
                  id="description" 
                  placeholder="Set a description to the product for better visibility." 
                  className="rounded-xl min-h-[120px] resize-none" 
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Product Images Card */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold">Product Images</CardTitle>
              <span className="text-xs text-muted-foreground">Uploaded via Cloudinary</span>
            </CardHeader>
            <CardContent className="space-y-4">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                multiple 
                accept="image/*" 
                className="hidden" 
              />

              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-muted rounded-2xl p-8 flex flex-col items-center justify-center text-center bg-muted/20 cursor-pointer hover:bg-muted/30 transition"
              >
                <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center shadow-sm mb-3 text-muted-foreground">
                  {uploadingImage ? <Loader2 className="h-5 w-5 animate-spin" /> : <UploadCloud className="h-5 w-5" />}
                </div>
                <p className="text-sm font-semibold text-foreground mb-1">
                  {uploadingImage ? "Uploading to Cloudinary..." : "Drop your images here or click to browse"}
                </p>
                <p className="text-xs text-muted-foreground mb-4">PNG, JPG, WEBP up to 5MB</p>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="rounded-xl text-xs font-semibold flex items-center gap-2 pointer-events-none"
                >
                  <ImagePlus className="h-4 w-4" /> Select images from device
                </Button>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3 pt-2">
                  {images.map((url, idx) => (
                    <div key={idx} className="relative group rounded-xl overflow-hidden border aspect-square bg-muted">
                      <img src={url} alt={`Uploaded ${idx}`} className="object-cover w-full h-full" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Variants Card — color option ab checkbox multi-select use karta hai */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Variants</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">
                Variant price khaali chhorein agar wo Base Price jaisa hi hai. Colors mein aik se zyada select ki ja sakti hain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold text-muted-foreground">
                <span>Options</span>
                <span>Value</span>
                <span>Price</span>
              </div>

              {variants.map((variant, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                  <Select 
                    value={variant.option} 
                    onValueChange={(val) => updateVariant(index, "option", val)}
                  >
                    <SelectTrigger className="rounded-xl text-xs">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="size">Size</SelectItem>
                      <SelectItem value="color">Color</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Value field — color ke liye multi-select checkboxes, baaqi ke liye text input */}
                  {variant.option === "color" ? (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        {colorPalette.map((c) => {
                          const selectedColors = Array.isArray(variant.value) ? variant.value : [];
                          const isSelected = selectedColors.includes(c.name);
                          return (
                            <button
                              key={c.name}
                              type="button"
                              title={c.name}
                              onClick={() => toggleColorValue(index, c.name)}
                              style={{ backgroundColor: c.hex }}
                              className={`h-7 w-7 rounded-full border flex items-center justify-center transition-transform hover:scale-110 cursor-pointer ${
                                c.hex.toUpperCase() === "#FFFFFF" ? "border-black/20" : "border-black/10"
                              } ${isSelected ? "ring-2 ring-offset-1 ring-black" : ""}`}
                            >
                              {isSelected && (
                                <Check className={`h-3.5 w-3.5 ${c.hex.toUpperCase() === "#FFFFFF" ? "text-black" : "text-white"}`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {Array.isArray(variant.value) && variant.value.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          Selected: {variant.value.join(", ")}
                        </span>
                      )}
                    </div>
                  ) : (
                    <Input 
                      placeholder="Value (e.g. Small / Cotton)" 
                      className="rounded-xl text-xs" 
                      value={typeof variant.value === "string" ? variant.value : ""}
                      onChange={(e) => updateVariant(index, "value", e.target.value)}
                    />
                  )}

                  <div className="flex items-center gap-2">
                    <Input 
                      placeholder="Same as base price (leave empty)" 
                      className="rounded-xl text-xs flex-1" 
                      value={variant.price}
                      onChange={(e) => updateVariant(index, "price", e.target.value)}
                    />
                    {variants.length > 1 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="h-9 w-9 text-red-500 hover:text-red-700 shrink-0"
                        onClick={() => removeVariantRow(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                className="rounded-xl text-xs font-semibold flex items-center gap-1.5 mt-2"
                onClick={addVariantRow}
              >
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
                <Input 
                  id="base-price" 
                  type="number"
                  step="0.01"
                  placeholder="0.00" 
                  className="rounded-xl"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount-price" className="text-xs font-semibold">Discounted Price</Label>
                <Input 
                  id="discount-price" 
                  type="number"
                  step="0.01"
                  placeholder="0.00" 
                  className="rounded-xl"
                  value={formData.discountPrice}
                  onChange={(e) => handleChange("discountPrice", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="stock-quantity" className="text-xs font-semibold">Stock Quantity</Label>
                <Input 
                  id="stock-quantity" 
                  type="number"
                  placeholder="0" 
                  className="rounded-xl"
                  value={formData.stockQuantity}
                  onChange={(e) => handleChange("stockQuantity", e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="charge-tax" className="text-xs font-medium text-foreground">Charge tax on this product</Label>
                <Switch id="charge-tax" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <Label htmlFor="in-stock" className="text-xs font-medium text-foreground">In stock</Label>
                <Switch 
                  id="in-stock" 
                  checked={formData.inStock}
                  onCheckedChange={(checked) => handleChange("inStock", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status Card */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select 
                value={formData.status} 
                onValueChange={(val) => handleChange("status", val)}
              >
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

          {/* Categories Card — dynamic from database with correct name display */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Select 
                  value={formData.category} 
                  onValueChange={(val) => {
                    handleChange("category", val);
                    const selected = categories.find((c) => c.id === val);
                    setSelectedCategoryName(selected?.name || "");
                  }}
                  disabled={loadingCategories}
                >
                  <SelectTrigger className="rounded-xl text-xs flex-1">
                    <SelectValue placeholder={loadingCategories ? "Loading categories..." : "Select a category"}>
                      {selectedCategoryName || undefined}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length === 0 && !loadingCategories && (
                      <div className="px-2 py-1.5 text-xs text-muted-foreground">
                        No categories found. Create one first.
                      </div>
                    )}
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="icon" 
                  className="rounded-xl h-10 w-10 shrink-0"
                  onClick={() => router.push("/dashboard/categories/add")}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}