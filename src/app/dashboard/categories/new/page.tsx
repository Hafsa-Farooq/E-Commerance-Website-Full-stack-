'use client';

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  FolderTree, 
  UploadCloud, 
  Layers, 
  Tag, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  X,
  Image as ImageIcon
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

export default function AddCategoryPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("id");
  const isEditMode = Boolean(categoryId);

  const [submitting, setSubmitting] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [mainCategories, setMainCategories] = useState<Category[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    image: "", // Cloudinary URL yahan save hoga
    parentId: "", 
    status: "Active",
  });

  // Fetch categories for parent dropdown with safe JSON parsing
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        
        if (res.ok) {
          const categoriesList = Array.isArray(data) ? data : (data.data || []);
          // Category apne aap ko apna hi parent nahi ban sakti (edit mode mein exclude karna)
          setMainCategories(
            categoriesList.filter((c: any) => !c.parentId && c.id !== categoryId)
          );
        } else {
          console.error("Failed to fetch categories:", data.error || `Server status: ${res.status}`);
        }
      } catch (error) {
        console.error("Failed to parse categories JSON:", error);
      }
    };
    fetchCategories();
  }, [categoryId]);

  // Edit mode: existing category fetch karke form pre-fill karna
  useEffect(() => {
    if (!categoryId) return;

    async function fetchCategoryForEdit() {
      try {
        const res = await fetch(`/api/categories/${categoryId}`);
        const result = await res.json();

        if (result.success) {
          const c = result.data;
          setFormData({
            name: c.name || "",
            slug: c.slug || "",
            image: c.image || "",
            parentId: c.parentId || "",
            status: "Active",
          });
          if (c.image) {
            setImagePreview(c.image);
          }
        } else {
          alert("Category load nahi ho saki.");
        }
      } catch (error) {
        console.error(error);
        alert("Category load karte waqt masla aaya.");
      } finally {
        setPageLoading(false);
      }
    }

    fetchCategoryForEdit();
  }, [categoryId]);

  // Auto-generate slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setFormData({ ...formData, name, slug });
  };

  // Handle local image selection & preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, image: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.slug) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);
      let uploadedImageUrl = formData.image;

      // Agar user ne nayi image select ki hai toh pehle Cloudinary par upload karein
      if (imageFile) {
        const dataForm = new FormData();
        dataForm.append("file", imageFile);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: dataForm,
        });
        const uploadText = await uploadRes.text();
        const uploadData = uploadText ? JSON.parse(uploadText) : {};

        if (uploadRes.ok && uploadData.success) {
          uploadedImageUrl = uploadData.url;
        } else {
          alert(uploadData.error || "Image upload failed");
          setSubmitting(false);
          return;
        }
      }

      const payload = {
        ...formData,
        image: uploadedImageUrl,
        parentId: formData.parentId === "" ? null : formData.parentId,
      };

      const res = await fetch(
        isEditMode ? `/api/categories/${categoryId}` : "/api/categories",
        {
          method: isEditMode ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const resText = await res.text();
      const data = resText ? JSON.parse(resText) : {};

      if (res.ok || data.success) {
        router.push("/dashboard/categories");
      } else {
        alert(data.error || "Failed to save category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      alert("An unexpected error occurred. Check console.");
    } finally {
      setSubmitting(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground text-sm font-medium">
        Loading category...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-20 pt-2 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Top Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/60">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="rounded-2xl h-11 w-11 p-0 flex items-center justify-center border-border/80 bg-card hover:bg-muted shadow-xs cursor-pointer transition-all"
          >
            <ArrowLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {isEditMode ? "Edit Category" : "Create New Category"}
              </h1>
              <span className="px-3 py-1 text-[11px] font-bold uppercase bg-primary/10 text-primary rounded-full tracking-wider border border-primary/20">
                Catalog Manager
              </span>
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Structure your store layout with primary collections (Men, Women, Kids) and sub-categories.
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Sidebar - Guidelines Card (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="rounded-3xl border border-border/80 shadow-xs bg-card overflow-hidden">
            <div className="p-6 bg-gradient-to-br from-primary/5 via-card to-transparent border-b border-border/60">
              <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-3 shadow-inner">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">Structure Guidelines</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Best practices for professional store navigation.
              </p>
            </div>
            <div className="p-6 space-y-4 text-xs text-muted-foreground">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <p><strong className="text-foreground">Main Categories:</strong> Leave Parent as "None" for top-level sections like <span className="text-foreground font-semibold">Men, Women, Kids</span>.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <p><strong className="text-foreground">Sub-Categories:</strong> Select a parent category to nest items like <span className="text-foreground font-semibold">T-Shirts</span> under Men.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
                <p><strong className="text-foreground">Cloudinary Storage:</strong> Upload images directly from your system; they will be safely stored via Cloudinary.</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Form Container (8 Cols) */}
        <div className="lg:col-span-8">
          <Card className="rounded-3xl border border-border/80 shadow-sm bg-card overflow-hidden">
            <div className="bg-muted/30 px-8 py-5 border-b border-border/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Layers className="h-4 w-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Category Configuration Form</span>
              </div>
            </div>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Parent Category Dropdown */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <FolderTree className="h-4 w-4 text-primary" />
                    Parent Category
                  </label>
                  <select
                    value={formData.parentId}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                    className="w-full h-13 px-4 rounded-2xl border border-input bg-background text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="">None (Top-Level Category e.g., Men, Women, Kids)</option>
                    {mainCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        ↳ Parent: {cat.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-muted-foreground pl-1">
                    Choose a parent if this is a sub-category. Keep as None for primary sections.
                  </p>
                </div>

                {/* Category Name */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Tag className="h-4 w-4 text-primary" />
                    Category Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. T-Shirts, Denim Jeans, Casual Wear"
                    value={formData.name}
                    onChange={handleNameChange}
                    required
                    className="w-full h-13 px-4 rounded-2xl border border-input bg-background text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. t-shirts"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full h-13 px-4 rounded-2xl border border-input bg-muted/30 text-xs sm:text-sm font-mono text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-2xs"
                  />
                </div>

                {/* Direct Image Upload Component */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Category Banner / Image
                  </label>
                  
                  {imagePreview ? (
                    <div className="relative w-full h-48 rounded-2xl border border-border/80 overflow-hidden bg-muted/40 flex items-center justify-center group">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-md hover:bg-destructive/90 transition-all cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-border/80 hover:border-primary/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer bg-muted/20 hover:bg-muted/40 transition-all text-center">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-xs">
                        <UploadCloud className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Click to upload image or drag & drop</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">PNG, JPG, WEBP up to 5MB (Will be uploaded via Cloudinary)</p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                  )}
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-foreground">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full h-13 px-4 rounded-2xl border border-input bg-background text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer shadow-2xs"
                  >
                    <option value="Active">Active (Visible on store)</option>
                    <option value="Inactive">Inactive (Hidden)</option>
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/60 mt-8">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => router.back()}
                    className="rounded-2xl text-xs sm:text-sm font-semibold h-12 px-6 cursor-pointer hover:bg-muted transition-all"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={submitting}
                    className="rounded-2xl bg-foreground text-background hover:bg-foreground/90 text-xs sm:text-sm font-semibold h-12 px-8 cursor-pointer shadow-md transition-all"
                  >
                    {submitting 
                      ? (isEditMode ? "Updating Category..." : "Saving Category...") 
                      : (isEditMode ? "Update Category" : "Save Category")}
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}