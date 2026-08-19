import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }> | { id: string };
};

// GET: Kisi aik specific product ki details fetch karne ke liye
export async function GET(request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const id = params.id;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: { orderBy: { position: "asc" } },
        variants: {
          include: { inventory: true },
        },
        reviews: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    // Actual orders count aur revenue nikalna — is product ke variants se linked OrderItems se
    const variantIds = product.variants.map((v) => v.id);
    const orderItems = variantIds.length > 0
      ? await prisma.orderItem.findMany({
          where: { variantId: { in: variantIds } },
        })
      : [];

    const ordersCount = orderItems.reduce((sum, item) => sum + item.quantity, 0);
    const totalRevenue = orderItems.reduce(
      (sum, item) => sum + Number(item.unitPrice) * item.quantity,
      0
    );

    // Total available stock — saare variants ki inventory se
    const availableStock = product.variants.reduce(
      (sum, v) => sum + (v.inventory?.availableQty ?? 0),
      0
    );

    const responseData = {
      ...product,
      ordersCount,
      totalRevenue,
      availableStock,
    };

    return NextResponse.json({ success: true, data: responseData }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to fetch product details" }, { status: 500 });
  }
}

// PUT: Product ko update karne ke liye
export async function PUT(request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    const { name, sku, barcode, description, price, discountPrice, stock, status, category } = body;

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(sku !== undefined && { sku: sku || null }),
        ...(barcode !== undefined && { barcode: barcode || null }),
        ...(description !== undefined && { description: description || null }),
        ...(price !== undefined && { basePrice: parseFloat(price) }),
        ...(discountPrice !== undefined && { discountPrice: discountPrice ? parseFloat(discountPrice) : null }),
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(status && { status: status.toUpperCase() }),
        ...(category !== undefined && { categoryId: category }),
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json({ success: true, message: "Product updated successfully", data: updatedProduct }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating product:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: error.message || "Failed to update product" }, { status: 500 });
  }
}

// DELETE: Product ko delete karne ke liye
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const id = params.id;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting product:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: error.message || "Failed to delete product" }, { status: 500 });
  }
}