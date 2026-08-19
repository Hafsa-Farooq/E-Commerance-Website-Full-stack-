import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

async function getOrCreateLocalUser() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  let user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    const cu = await currentUser();
    user = await prisma.user.create({
      data: {
        clerkId,
        email: cu?.emailAddresses[0]?.emailAddress || `${clerkId}@placeholder.com`,
        name: cu?.fullName || null,
      },
    });
  }
  return user;
}

// GET: Current user ka cart fetch karna
export async function GET() {
  const user = await getOrCreateLocalUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          variant: {
            include: { product: { include: { images: true } } },
          },
        },
      },
    },
  });

  return NextResponse.json({ success: true, data: cart });
}

// POST: Cart mein item add karna
export async function POST(request: Request) {
  const user = await getOrCreateLocalUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { variantId, quantity } = body;

    if (!variantId || !quantity) {
      return NextResponse.json(
        { error: "Product variant and quantity are required" },
        { status: 400 }
      );
    }

    let cart = await prisma.cart.findUnique({ where: { userId: user.id } });
    if (!cart) {
      cart = await prisma.cart.create({ data: { userId: user.id } });
    }

    const existingItem = await prisma.cartItem.findUnique({
      where: { cartId_variantId: { cartId: cart.id, variantId } },
    });

    let cartItem;
    if (existingItem) {
      cartItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      });
    } else {
      cartItem = await prisma.cartItem.create({
        data: { cartId: cart.id, variantId, quantity },
      });
    }

    return NextResponse.json({ success: true, data: cartItem }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding to cart:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add to cart" },
      { status: 500 }
    );
  }
}