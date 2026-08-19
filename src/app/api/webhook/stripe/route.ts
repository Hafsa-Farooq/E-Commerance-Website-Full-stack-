import { NextResponse } from "next/server";
import Stripe from "stripe";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-07-29.dahlia" as any,
});

export async function GET() {
  return NextResponse.json({ message: "Stripe webhook endpoint is active and listening!" }, { status: 200 });
}

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!signature || !webhookSecret) {
      return NextResponse.json({ error: "Missing signature or webhook secret" }, { status: 400 });
    }
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout completion event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const shippingData = session.metadata?.shippingData ? JSON.parse(session.metadata.shippingData) : {};
      const userId = session.metadata?.userId;

      const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const totalAmount = (session.amount_total || 0) / 100;

      // 1. Create order in database using Prisma
      await prisma.order.create({
        data: {
          orderNumber,
          userId: userId || null,
          totalAmount,
          paymentStatus: "PAID",
          paymentMethod: "STRIPE",
          fullName: shippingData.fullName || "",
          phone: shippingData.phone || "",
          line1: shippingData.line1 || "",
          line2: shippingData.line2 || null,
          city: shippingData.city || "",
          state: shippingData.state || "",
          postalCode: shippingData.postalCode || "",
          country: shippingData.country || "",
        },
      });

      // 2. Clear user's cart items after successful payment
      if (userId) {
        const cart = await prisma.cart.findUnique({ where: { userId } });
        if (cart) {
          await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
        }
      }

      console.log(`Order ${orderNumber} successfully created via Stripe webhook for session ID:`, session.id);
    } catch (dbError: any) {
      console.error("Error saving order from webhook to database:", dbError);
      return NextResponse.json({ error: "Database save failed: " + dbError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}