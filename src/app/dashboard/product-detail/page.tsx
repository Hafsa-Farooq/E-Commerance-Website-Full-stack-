'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, Trash2, ChevronLeft, ChevronRight, DollarSign, 
  ShoppingCart, Layers, TrendingUp, Star, Heart, Plus 
} from "lucide-react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(3);

  useEffect(() => {
    async function fetchProductDetails() {
      if (!productId) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/products/${productId}`);
        const result = await res.json();

        if (result.success) {
          setProduct(result.data);
          // Variants se real sizes/colors nikal kar default select karein
          const sizes = Array.from(new Set(result.data.variants.map((v: any) => v.size))) as string[];
          const colors = Array.from(new Set(result.data.variants.map((v: any) => v.color))) as string[];
          if (sizes.length > 0) setSelectedSize(sizes[0]);
          if (colors.length > 0) setSelectedColor(colors[0]);
        } else {
          toast.error("Product details load nahi ho saki.");
        }
      } catch (error) {
        toast.error("Kuch galat ho gaya hai!");
      } finally {
        setLoading(false);
      }
    }

    fetchProductDetails();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground text-sm font-medium">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
        <p className="text-muted-foreground">Product nahi mila ya invalid ID hai.</p>
        <Button onClick={() => router.push("/dashboard/products")} className="rounded-xl">
          Back to Products
        </Button>
      </div>
    );
  }

  // Real images — koi fallback stock photos nahi
  const productImages = product.images?.length > 0
    ? product.images.map((img: any) => img.url)
    : [];

  // Real reviews — database se
  const reviews = product.reviews || [];

  // Variants se unique sizes aur colors
  const uniqueSizes: string[] = Array.from(new Set(product.variants.map((v: any) => v.size)));
  const uniqueColors: string[] = Array.from(new Set(product.variants.map((v: any) => v.color)));

  const colorSwatch: Record<string, string> = {
    olive: "#4F4631",
    "forest green": "#314F43",
    navy: "#31354F",
    black: "#000000",
    white: "#FFFFFF",
    red: "#F50606",
    blue: "#063AF5",
    default: "#999999",
  };

  // Average rating aur breakdown real reviews se calculate
  const avgRating = reviews.length > 0
    ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length
    : 0;

  const ratingBreakdown = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r: any) => r.rating === star).length;
    const percent = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars: `${star} star${star > 1 ? "s" : ""}`, percent: `${percent}%` };
  });

  const nextImage = () => {
    if (productImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    if (productImages.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const handleDelete = async () => {
    if (!productId) return;
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });
        const result = await res.json();
        if (res.ok && result.success) {
          toast.success("Product deleted successfully!");
          router.push("/dashboard/products");
        } else {
          toast.error(result.error || "Product delete nahi ho saka.");
        }
      } catch (error) {
        toast.error("Kuch galat ho gaya hai!");
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
            <span><strong className="text-foreground">Published :</strong> {new Date(product.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            <span>•</span>
            <span><strong className="text-foreground">SKU :</strong> {product.sku || product.id.slice(0, 8)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="default" 
            onClick={() => router.push(`/dashboard/add-product?id=${product.id}`)}
            className="rounded-xl bg-foreground text-background hover:bg-foreground/90 flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button 
            variant="destructive" 
            onClick={handleDelete}
            className="rounded-xl flex items-center gap-2 text-xs font-semibold cursor-pointer"
          >
            <Trash2 className="h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-2xl border shadow-sm p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</p>
            <h4 className="text-lg font-bold text-foreground">${Number(product.basePrice)}</h4>
          </div>
        </Card>

        <Card className="rounded-2xl border shadow-sm p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">No. of Orders</p>
            <h4 className="text-lg font-bold text-foreground">{product.ordersCount}</h4>
          </div>
        </Card>

        <Card className="rounded-2xl border shadow-sm p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Stocks</p>
            <h4 className="text-lg font-bold text-foreground">{product.availableStock}</h4>
          </div>
        </Card>

        <Card className="rounded-2xl border shadow-sm p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Revenue</p>
            <h4 className="text-lg font-bold text-foreground">${product.totalRevenue.toFixed(2)}</h4>
          </div>
        </Card>
      </div>

      {/* Main Content Layout with Sticky Left & Scrollable Right */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* Left Column: Sticky Image Gallery */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <Card className="rounded-2xl border shadow-sm overflow-hidden p-3">
            <div className="relative aspect-square rounded-xl bg-muted/30 flex items-center justify-center overflow-hidden">
              {productImages.length > 0 ? (
                <img 
                  src={productImages[currentImageIndex]} 
                  alt={product.name} 
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted-foreground">No image uploaded</span>
              )}
              {productImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-background cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-background cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mt-3">
                {productImages.map((img: string, i: number) => (
                  <div 
                    key={i} 
                    onClick={() => setCurrentImageIndex(i)}
                    className={`aspect-square rounded-lg bg-muted/50 border overflow-hidden cursor-pointer transition-all ${currentImageIndex === i ? 'border-primary ring-1 ring-primary' : 'hover:border-primary'}`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Scrollable Content */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Single Description Card containing Description on Left and Details Box on Right */}
          <Card className="rounded-2xl border shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col lg:flex-row gap-6 justify-between items-start">
                
                {/* Left Side: Description Text, Colors, Sizes & Cart Buttons */}
                <div className="flex-1 space-y-4 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    {product.description || "No description provided for this product."}
                  </p>

                  {/* Colors — real variants se */}
                  {uniqueColors.length > 0 && (
                    <div>
                      <h5 className="font-bold text-foreground mb-2 text-xs">Colors:</h5>
                      <div className="flex gap-2">
                        {uniqueColors.map((color, idx) => {
                          const bg = colorSwatch[color.toLowerCase()] || colorSwatch.default;
                          return (
                            <span
                              key={idx}
                              onClick={() => setSelectedColor(color)}
                              style={{ backgroundColor: bg }}
                              title={color}
                              className={`h-6 w-6 rounded-full border-2 cursor-pointer transition-all ${selectedColor === color ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                            ></span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Sizes — real variants se */}
                  {uniqueSizes.length > 0 && (
                    <div className="pt-2">
                      <h5 className="font-bold text-foreground mb-2 text-xs">Sizes:</h5>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map((size) => (
                          <button
                            key={size}
                            onClick={() => setSelectedSize(size)}
                            className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                              selectedSize === size 
                                ? 'border-foreground bg-foreground text-background' 
                                : 'border-input bg-background hover:bg-muted'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    <Button 
                      onClick={() => toast.success(`Added ${product.name} (Size: ${selectedSize}, Color: ${selectedColor}) to Cart!`)}
                      className="flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold cursor-pointer"
                    >
                      <ShoppingCart className="h-4 w-4" /> Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => toast.success("Added product to your Wishlist!")}
                      className="rounded-xl gap-2 font-semibold cursor-pointer"
                    >
                      <Heart className="h-4 w-4" /> Wishlist
                    </Button>
                  </div>
                </div>

                {/* Right Side: Category Details Box */}
                <div className="w-full lg:w-64 bg-muted/20 border rounded-xl p-4 space-y-3 shrink-0">
                  <h5 className="font-bold text-foreground text-xs pb-1 border-b">Details</h5>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground font-medium">Category</span>
                      <span className="font-semibold text-foreground">{product.category?.name || "Uncategorized"}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground font-medium">Status</span>
                      <span className="font-semibold text-foreground capitalize">{product.status?.toLowerCase()}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground font-medium">Color</span>
                      <span className="font-semibold text-foreground capitalize">{selectedColor || "N/A"}</span>
                    </div>
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Reviews Section */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold tracking-tight text-foreground">Reviews</h3>
              <Button 
                variant="outline" 
                onClick={() => toast.info("Opening submit review modal...")}
                className="rounded-xl text-xs font-semibold gap-2 cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Submit Review
              </Button>
            </div>

            {reviews.length === 0 ? (
              <Card className="rounded-2xl border shadow-sm p-6 text-center text-xs text-muted-foreground">
                No reviews yet for this product.
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-3">
                
                {/* Review Cards List (Span 2) */}
                <div className="md:col-span-2 space-y-4">
                  {reviews.slice(0, visibleReviewsCount).map((rev: any, idx: number) => (
                    <Card key={rev.id || idx} className="rounded-2xl border shadow-sm p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {(rev.user?.name || "A").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h5 className="font-bold text-xs text-foreground">{rev.user?.name || "Anonymous"}</h5>
                            <div className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md w-fit mt-0.5">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-[11px] font-bold">{rev.rating}</span>
                            </div>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(rev.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment || "No comment provided."}</p>
                      </div>
                    </Card>
                  ))}

                  {visibleReviewsCount < reviews.length && (
                    <div className="flex justify-center pt-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setVisibleReviewsCount(reviews.length)}
                        className="rounded-xl text-xs font-semibold px-6 cursor-pointer"
                      >
                        Load more..
                      </Button>
                    </div>
                  )}
                </div>

                {/* Rating Breakdown Card (Span 1) — real reviews se calculate */}
                <div className="md:col-span-1">
                  <Card className="rounded-2xl border shadow-sm p-4 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className={`h-4 w-4 ${i <= Math.round(avgRating) ? 'fill-amber-400' : 'text-muted fill-muted'}`} />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-foreground">{avgRating.toFixed(1)} ({reviews.length} reviews)</span>
                    </div>

                    <div className="space-y-2 text-xs">
                      {ratingBreakdown.map((row, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 text-muted-foreground">
                          <span className="w-12">{row.stars}</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-foreground rounded-full" style={{ width: row.percent }}></div>
                          </div>
                          <span className="w-8 text-right font-medium">{row.percent}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}