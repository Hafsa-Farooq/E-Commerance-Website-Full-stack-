'use client';

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Edit, Trash2, ChevronLeft, ChevronRight, DollarSign, 
  ShoppingCart, Layers, TrendingUp, Star, Heart, Plus 
} from "lucide-react";

export default function ProductDetailPage() {
  const [selectedSize, setSelectedSize] = useState("MD");
  const [selectedColor, setSelectedColor] = useState("purple");

  const sizes = ["SM", "MD", "LG", "XL", "XXL"];
  
  const reviews = [
    {
      name: "Mark P.",
      time: "5 days ago",
      rating: 3.2,
      title: "Decent but could be better",
      comment: "The product is okay, but I expected more for the price. A few minor flaws, but overall, it's acceptable.",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "Jessica K.",
      time: "2 weeks ago",
      rating: 3.2,
      title: "Beautiful design",
      comment: "I love the sleek design and the ease of use. Haven't come across such a stylish product in a long time. Highly satisfied!",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "Michael B.",
      time: "4 days ago",
      rating: 3.2,
      title: "Good quality overall",
      comment: "Very comfortable and fits nicely. Delivery was fast and packaging was secure.",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "Lisa G.",
      time: "3 weeks ago",
      rating: 3.2,
      title: "Not worth the price",
      comment: "The product does the job, but I feel it's overpriced for what it offers. There are better options available at a similar price.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80"
    },
    {
      name: "David L.",
      time: "1 month ago",
      rating: 3.2,
      title: "Highly functional and stylish",
      comment: "This product is both functional and stylish. It fits perfectly with my needs, and I'm really impressed with the overall quality.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
    }
  ];

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Top Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Acme Prism T-Shirt</h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
            <span><strong className="text-foreground">Seller :</strong> Poetic Fashion</span>
            <span>•</span>
            <span><strong className="text-foreground">Published :</strong> 20 Oct, 2024</span>
            <span>•</span>
            <span><strong className="text-foreground">SKU :</strong> WH1000XM4</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="default" className="rounded-xl bg-foreground text-background hover:bg-foreground/90 flex items-center gap-2 text-xs font-semibold">
            <Edit className="h-4 w-4" /> Edit
          </Button>
          <Button variant="destructive" className="rounded-xl flex items-center gap-2 text-xs font-semibold">
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
            <h4 className="text-lg font-bold text-foreground">$120.40</h4>
          </div>
        </Card>

        <Card className="rounded-2xl border shadow-sm p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">No. of Orders</p>
            <h4 className="text-lg font-bold text-foreground">250</h4>
          </div>
        </Card>

        <Card className="rounded-2xl border shadow-sm p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
            <Layers className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Available Stocks</p>
            <h4 className="text-lg font-bold text-foreground">2,550</h4>
          </div>
        </Card>

        <Card className="rounded-2xl border shadow-sm p-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-muted/50 flex items-center justify-center text-muted-foreground">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Revenue</p>
            <h4 className="text-lg font-bold text-foreground">$45,938</h4>
          </div>
        </Card>
      </div>

      {/* Main Content Layout with Sticky Left & Scrollable Right */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* Left Column: Sticky Image Gallery */}
        <div className="lg:col-span-5 sticky top-6 space-y-4">
          <Card className="rounded-2xl border shadow-sm overflow-hidden p-3">
            <div className="relative aspect-square rounded-xl bg-muted/30 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center text-muted-foreground font-semibold text-sm">
                Product Image Preview
              </div>
              <button className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-background">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-background">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="aspect-square rounded-lg bg-muted/50 border hover:border-primary cursor-pointer transition-all"></div>
              ))}
            </div>
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
                
                {/* Left Side: Description Text, Features, Colors, Sizes & Cart Buttons */}
                <div className="flex-1 space-y-4 text-xs text-muted-foreground leading-relaxed">
                  <p>
                    Tommy Hilfiger men striped pink sweatshirt. Crafted with cotton. Material composition is 100% organic cotton.
                  </p>
                  <div>
                    <h5 className="font-bold text-foreground mb-2 text-xs">Key Features:</h5>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Industry-leading noise cancellation</li>
                      <li>30-hour battery life</li>
                      <li>Touch sensor controls</li>
                      <li>Speak-to-chat technology</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-bold text-foreground mb-2 text-xs">Colors:</h5>
                    <div className="flex gap-2">
                      <span onClick={() => setSelectedColor("green")} className={`h-6 w-6 rounded-full bg-emerald-500 border-2 cursor-pointer transition-all ${selectedColor === 'green' ? 'ring-2 ring-primary ring-offset-2' : ''}`}></span>
                      <span onClick={() => setSelectedColor("blue")} className={`h-6 w-6 rounded-full bg-blue-400 border-2 cursor-pointer transition-all ${selectedColor === 'blue' ? 'ring-2 ring-primary ring-offset-2' : ''}`}></span>
                      <span onClick={() => setSelectedColor("purple")} className={`h-6 w-6 rounded-full bg-purple-400 border-2 cursor-pointer transition-all ${selectedColor === 'purple' ? 'ring-2 ring-primary ring-offset-2' : ''}`}></span>
                    </div>
                  </div>

                  {/* Sizes Section */}
                  <div className="pt-2">
                    <h5 className="font-bold text-foreground mb-2 text-xs">Sizes:</h5>
                    <div className="flex flex-wrap gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
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

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3 pt-4">
                    <Button className="flex-1 rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold">
                      <ShoppingCart className="h-4 w-4" /> Add to Card
                    </Button>
                    <Button variant="outline" className="rounded-xl gap-2 font-semibold">
                      <Heart className="h-4 w-4" /> Wishlist
                    </Button>
                  </div>
                </div>

                {/* Right Side: Category/Brand Details Box INSIDE Description Card */}
                <div className="w-full lg:w-64 bg-muted/20 border rounded-xl p-4 space-y-3 shrink-0">
                  <h5 className="font-bold text-foreground text-xs pb-1 border-b">Details</h5>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground font-medium">Category</span>
                      <span className="font-semibold text-foreground">T-Shirt</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground font-medium">Brand</span>
                      <span className="font-semibold text-foreground">Tommy Hilfiger</span>
                    </div>
                    <div className="flex justify-between py-1 border-b">
                      <span className="text-muted-foreground font-medium">Color</span>
                      <span className="font-semibold text-foreground">Purple</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground font-medium">Weight</span>
                      <span className="font-semibold text-foreground">140 Gr</span>
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
              <Button variant="outline" className="rounded-xl text-xs font-semibold gap-2">
                <Plus className="h-4 w-4" /> Submit Review
              </Button>
            </div>

            {/* Rating Summary & Review Cards Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              
              {/* Review Cards List (Span 2) */}
              <div className="md:col-span-2 space-y-4">
                {reviews.map((rev, idx) => (
                  <Card key={idx} className="rounded-2xl border shadow-sm p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={rev.avatar} alt={rev.name} className="h-9 w-9 rounded-full object-cover" />
                        <div>
                          <h5 className="font-bold text-xs text-foreground">{rev.name}</h5>
                          <div className="flex items-center gap-1 bg-muted/60 px-2 py-0.5 rounded-md w-fit mt-0.5">
                            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                            <span className="text-[11px] font-bold">{rev.rating}</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{rev.time}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-foreground mb-1">{rev.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{rev.comment}</p>
                    </div>
                  </Card>
                ))}

                <div className="flex justify-center pt-2">
                  <Button variant="outline" className="rounded-xl text-xs font-semibold px-6">
                    Load more..
                  </Button>
                </div>
              </div>

              {/* Rating Breakdown Card (Span 1) */}
              <div className="md:col-span-1">
                <Card className="rounded-2xl border shadow-sm p-4 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400" />
                      ))}
                      <Star className="h-4 w-4 text-amber-400" />
                    </div>
                    <span className="text-xs font-bold text-foreground">4.3 (12 reviews)</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {[
                      { stars: "5 stars", percent: "70%" },
                      { stars: "4 stars", percent: "17%" },
                      { stars: "3 stars", percent: "7%" },
                      { stars: "2 stars", percent: "4%" },
                      { stars: "1 star", percent: "2%" },
                    ].map((row, i) => (
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
          </div>

        </div>
      </div>
    </div>
  );
}