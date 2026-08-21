import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch inventory items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const products = await prisma.product.findMany({
      where: search ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { sku: { contains: search, mode: "insensitive" } },
        ],
      } : undefined,
      include: {
        category: true,
        images: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedInventory = products.map((product) => {
      let status = "In Stock";
      let statusColor = "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400";

      if (product.stock === 0) {
        status = "Out of Stock";
        statusColor = "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400";
      } else if (product.stock <= 10) {
        status = "Low Stock";
        statusColor = "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400";
      }

      const resolvedImage = product.images?.[0]?.url || "";
      const numericPrice = Number(product.basePrice); // basePrice hai, price nahi

      return {
        id: product.id,
        name: product.name,
        sku: product.sku || `SKU-${product.id.slice(0, 6)}`,
        category: product.category?.name || "Uncategorized",
        image: resolvedImage,
        stock: product.stock,
        price: `$${numericPrice.toFixed(2)}`,
        status,
        statusColor,
      };
    });

    return NextResponse.json({ success: true, data: formattedInventory }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new inventory item / product
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, sku, categoryId, price, stock, image, description } = body;

    if (!name || !price || !categoryId) {
      return NextResponse.json(
        { success: false, error: "Name, price, and category are required" },
        { status: 400 }
      );
    }

    const baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${baseSlug}-${Date.now()}`;

    const newProduct = await prisma.product.create({
      data: {
        name,
        slug,
        sku: sku || null,
        basePrice: parseFloat(price), // basePrice hai, price nahi
        stock: parseInt(stock, 10),
        description: description || null,
        categoryId, // required hai, null nahi ho sakta
        images: image
          ? { create: [{ url: image, position: 0 }] } // image string se ProductImage record banana
          : undefined,
      },
    });

    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to create inventory item" },
      { status: 500 }
    );
  }
}