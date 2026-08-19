import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json(
        { error: "You must be signed in to write a review" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId, rating, comment } = body;

    if (!productId || !rating) {
      return NextResponse.json(
        { error: "Product and rating are required" },
        { status: 400 }
      );
    }

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

    const review = await prisma.productReview.create({
      data: {
        productId,
        userId: user.id,
        rating: parseInt(rating),
        comment: comment || null,
      },
    });

    return NextResponse.json({ success: true, data: review }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit review" },
      { status: 500 }
    );
  }
}