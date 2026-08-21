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

// PUT: Product ko update karne ke liye (core fields + images + variants)
export async function PUT(request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const id = params.id;
    const body = await request.json();
    const {
      name,
      sku,
      barcode,
      description,
      price,
      discountPrice,
      stock,
      status,
      category,
      images,
      variants,
    } = body;

    const stockNum = stock !== undefined ? parseInt(stock) : undefined;

    // Step 1: Product ke core fields update karna
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(sku !== undefined && { sku: sku || null }),
        ...(barcode !== undefined && { barcode: barcode || null }),
        ...(description !== undefined && { description: description || null }),
        ...(price !== undefined && { basePrice: parseFloat(price) }),
        ...(discountPrice !== undefined && { discountPrice: discountPrice ? parseFloat(discountPrice) : null }),
        ...(stockNum !== undefined && { stock: stockNum }),
        ...(status && { status: status.toUpperCase() }),
        ...(category !== undefined && { categoryId: category }),
      },
    });

    // Step 2: Images — agar naya array bheja gaya hai, purani hata kar naye set karna
    if (Array.isArray(images)) {
      await prisma.productImage.deleteMany({ where: { productId: id } });
      if (images.length > 0) {
        await prisma.productImage.createMany({
          data: images.map((url: string, i: number) => ({ productId: id, url, position: i })),
        });
      }
    }

    // Step 3: Variants — agar naya array bheja gaya hai, purane hata kar naye banana
    // aur stock ko unke beech divide karna (duplicate nahi)
    if (Array.isArray(variants)) {
      const validVariants = variants.filter((v: any) => v.value && v.value.trim() !== "");

      const oldVariants = await prisma.productVariant.findMany({
        where: { productId: id },
        select: { id: true },
      });
      const oldVariantIds = oldVariants.map((v) => v.id);
      if (oldVariantIds.length > 0) {
        await prisma.inventory.deleteMany({ where: { variantId: { in: oldVariantIds } } });
      }
      await prisma.productVariant.deleteMany({ where: { productId: id } });

      const totalStock = stockNum !== undefined ? stockNum : updatedProduct.stock;
      const variantCount = validVariants.length > 0 ? validVariants.length : 1;
      const baseQty = Math.floor(totalStock / variantCount);
      const remainder = totalStock - baseQty * variantCount;

      if (validVariants.length > 0) {
        for (let i = 0; i < validVariants.length; i++) {
          const v = validVariants[i];
          const optionType = v.option || "size";
          const variantValue = v.value.trim();
          const variantPrice = v.price ? parseFloat(v.price) : null;
          const qty = baseQty + (i === validVariants.length - 1 ? remainder : 0);

          await prisma.productVariant.create({
            data: {
              productId: id,
              size: optionType === "size" ? variantValue : "One Size",
              color: optionType === "color" ? variantValue : "Default",
              sku: `${updatedProduct.sku || updatedProduct.id}-v${i + 1}`,
              priceOverride: variantPrice,
              inventory: {
                create: {
                  availableQty: qty,
                },
              },
            },
          });
        }
      } else {
        await prisma.productVariant.create({
          data: {
            productId: id,
            size: "One Size",
            color: "Default",
            sku: `${updatedProduct.sku || updatedProduct.id}-default`,
            inventory: {
              create: {
                availableQty: totalStock,
              },
            },
          },
        });
      }
    }

    const finalProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        variants: { include: { inventory: true } },
      },
    });

    return NextResponse.json(
      { success: true, message: "Product updated successfully", data: finalProduct },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating product:", error);

    if (error.code === "P2025") {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: `A product with this ${error.meta?.target?.[0] || "value"} already exists` },
        { status: 400 }
      );
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