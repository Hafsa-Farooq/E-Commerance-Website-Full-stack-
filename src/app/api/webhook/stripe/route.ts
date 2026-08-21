import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const shippingData = session.metadata?.shippingData ? JSON.parse(session.metadata.shippingData) : {};
      const clerkId = session.metadata?.userId;

      if (!clerkId) {
        console.error("No userId in session metadata, cannot create order.");
        return NextResponse.json({ error: "Missing user reference" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { clerkId } });
      if (!user) {
        console.error("User not found for clerkId:", clerkId);
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      const cart = await prisma.cart.findUnique({
        where: { userId: user.id },
        include: {
          items: {
            include: { variant: { include: { product: true } } },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        console.error("Cart empty for user:", user.id);
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
      }

      const address = await prisma.address.create({
        data: {
          userId: user.id,
          type: "SHIPPING",
          fullName: shippingData.fullName || "",
          phone: shippingData.phone || null,
          line1: shippingData.line1 || "",
          line2: shippingData.line2 || null,
          city: shippingData.city || "",
          state: shippingData.state || "",
          postalCode: shippingData.postalCode || "",
          country: shippingData.country || "",
        },
      });

      const subtotal = cart.items.reduce((sum, item) => {
        const price = item.variant.priceOverride
          ? Number(item.variant.priceOverride)
          : Number(item.variant.product.basePrice);
        return sum + price * item.quantity;
      }, 0);

      const totalAmount = (session.amount_total || 0) / 100;
      const orderNumber = `ORD-${Date.now()}`;

      const order = await prisma.order.create({
        data: {
          orderNumber,
          userId: user.id,
          addressId: address.id,
          status: "PAID",
          subtotal,
          discount: 0,
          shipping: totalAmount - subtotal > 0 ? totalAmount - subtotal : 0,
          total: totalAmount,
          items: {
            create: cart.items.map((item) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.variant.priceOverride
                ? Number(item.variant.priceOverride)
                : Number(item.variant.product.basePrice),
            })),
          },
          payment: {
            create: {
              method: "STRIPE",
              stripeSessionId: session.id,
              stripePaymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
              status: "SUCCEEDED",
              amount: totalAmount,
            },
          },
        },
      });

      await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

      // Send Payment Success & Order Confirmation Email
      if (user.email) {
        await sendEmail({
          to: user.email,
          subject: `Payment Successful & Order Confirmed (${orderNumber}) - Shop.co`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #2e7d32;">Payment Successful! 🎉</h2>
              <p>Hi ${user.name || "Customer"},</p>
              <p>We have successfully received your online payment via Stripe for order <strong>${orderNumber}</strong>.</p>
              <p><strong>Total Paid:</strong> $${totalAmount.toFixed(2)}</p>
              <p>Your order is confirmed and will be shipped soon.</p>
              <br/>
              <p>Best regards,<br/><strong>Shop.co Team</strong></p>
            </div>
          `,
        });
      }

      console.log(`Order ${orderNumber} successfully created via Stripe webhook for session ID:`, session.id);
    } catch (dbError: any) {
      console.error("Error saving order from webhook to database:", dbError);
      return NextResponse.json({ error: "Database save failed: " + dbError.message }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}