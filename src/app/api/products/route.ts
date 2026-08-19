import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Saare products database se fetch karne ke liye
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: true,
      },
    });
    return NextResponse.json({ success: true, data: products }, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST: Naya product database mein add karne ke liye
export async function POST(request: Request) {
  try {
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

    if (!name || !price || !category) {
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
        barcode: barcode || null,
        description: description || null,
        basePrice: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stock: stock !== undefined ? parseInt(stock) : 0,
        status: status ? status.toUpperCase() : "DRAFT",
        categoryId: category,
        images:
          images && images.length > 0
            ? {
                create: images.map((url: string, i: number) => ({
                  url,
                  position: i,
                })),
              }
            : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    const validVariants = Array.isArray(variants)
      ? variants.filter((v: any) => v.value && v.value.trim() !== "")
      : [];

    if (validVariants.length > 0) {
      for (let i = 0; i < validVariants.length; i++) {
        const v = validVariants[i];
        const optionType = v.option || "size";
        const variantValue = v.value.trim();
        const variantPrice = v.price ? parseFloat(v.price) : null;

        await prisma.productVariant.create({
          data: {
            productId: newProduct.id,
            size: optionType === "size" ? variantValue : "One Size",
            color: optionType === "color" ? variantValue : "Default",
            sku: `${newProduct.sku || newProduct.id}-v${i + 1}`,
            priceOverride: variantPrice,
            inventory: {
              create: {
                availableQty: newProduct.stock,
              },
            },
          },
        });
      }
    } else {
      await prisma.productVariant.create({
        data: {
          productId: newProduct.id,
          size: "One Size",
          color: "Default",
          sku: `${newProduct.sku || newProduct.id}-default`,
          inventory: {
            create: {
              availableQty: newProduct.stock,
            },
          },
        },
      });
    }

    return NextResponse.json(
      { success: true, message: "Product created successfully", data: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);

    if (error.code === "P2003") {
      return NextResponse.json(
        { success: false, error: "Invalid category selected" },
        { status: 400 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: `A product with this ${error.meta?.target?.[0] || "value"} already exists` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}