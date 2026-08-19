import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: Promise<{ itemId: string }>;
}

// PUT: Cart item ki quantity update karna
export async function PUT(request: Request, { params }: Params) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { itemId } = await params;
    const body = await request.json();
    const { quantity } = body;

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: "Quantity must be at least 1" }, { status: 400 });
    }

    // Ensure this cart item belongs to the logged-in user's own cart
    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== user.id) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    const updated = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: parseInt(quantity) },
    });

    return NextResponse.json({ success: true, data: updated }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating cart item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update cart item" },
      { status: 500 }
    );
  }
}

// DELETE: Cart se item remove karna
export async function DELETE(request: Request, { params }: Params) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const { itemId } = await params;

    const user = await prisma.user.findUnique({ where: { clerkId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const item = await prisma.cartItem.findUnique({
      where: { id: itemId },
      include: { cart: true },
    });

    if (!item || item.cart.userId !== user.id) {
      return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
    }

    await prisma.cartItem.delete({ where: { id: itemId } });

    return NextResponse.json({ success: true, message: "Item removed" }, { status: 200 });
  } catch (error: any) {
    console.error("Error removing cart item:", error);
    return NextResponse.json(
      { error: error.message || "Failed to remove item" },
      { status: 500 }
    );
  }
}