import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

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
        images: true // Includes related images table
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedInventory = products.map((product: any) => {
      let status = "In Stock";
      let statusColor = "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400";
      
      if (product.stock === 0) {
        status = "Out of Stock";
        statusColor = "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400";
      } else if (product.stock <= 10) {
        status = "Low Stock";
        statusColor = "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400";
      }

      // Safe image selection: check relation array first, then string field, else empty string
      const resolvedImage = product.images?.[0]?.url || product.image || "";

      // Safe conversion for Prisma Decimal type to prevent $0.00 issue
      const numericPrice = product.price ? Number(product.price.toString()) : 0;

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

    const newProduct = await prisma.product.create({
      data: {
        name,
        sku: sku || `SKU-${Date.now().toString().slice(-6)}`,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        image: image || null,
        description: description || null,
        categoryId: categoryId || null,
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