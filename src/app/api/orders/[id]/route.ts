import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: Request, context: Context) {
  try {
    const { id } = await context.params;

    const order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: id },
          { orderNumber: id },
        ],
      },
      include: {
        user: true,
        address: true,
        payment: true,
        coupon: true,
        items: {
          include: {
            variant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    const discountValue = Number(order.discount || 0);

    let promoCode: string | null = null;
    if (order.coupon) {
      const couponAmount = Number(order.coupon.discountValue);
      const couponLabel =
        order.coupon.discountType === "PERCENTAGE"
          ? `${couponAmount}% OFF`
          : `$${couponAmount.toFixed(2)} OFF`;
      promoCode = `${order.coupon.code} (${couponLabel})`;
    } else if (discountValue > 0) {
      promoCode = "Applied Discount";
    }

    const formattedOrder = {
      id: order.orderNumber || order.id,
      dbId: order.id,
      createdAt: new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: order.status,
      orderType: "Delivery",
      subtotal: `$${Number(order.subtotal).toFixed(2)}`,
      shipping: `$${Number(order.shipping).toFixed(2)}`,
      tax: `$${Number(order.tax).toFixed(2)}`,
      discount: discountValue,
      promoCode: promoCode || "",
      total: `$${Number(order.total).toFixed(2)}`,

      customer: {
        name: order.user?.name || order.address?.fullName || "Guest Customer",
        email: order.user?.email || "N/A",
        address: order.address
          ? `${order.address.line1}${order.address.line2 ? `, ${order.address.line2}` : ""}, ${order.address.city}, ${order.address.state} ${order.address.postalCode}`
          : "No address provided",
        phone: order.address?.phone || "N/A",
      },

      // Updated payment method check: Agar payment table mein record hai toh Stripe show ho ga
      payment: {
        method: order.payment ? "Stripe Online Payment" : "Not Specified",
        status: order.payment?.status || "PAID",
      },

      items: order.items.map((item, index) => {
        const unitPrice = Number(item.unitPrice || 0);
        const quantity = Number(item.quantity || 1);
        const itemTotal = unitPrice * quantity;

        const productImage = 
          item.variant?.product?.images?.[0]?.url || 
          (item.variant?.product?.images?.[0] as unknown as string) || 
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80";

        return {
          id: item.id || index + 1,
          name: item.variant?.product?.name || "Product Item",
          image: productImage,
          quantity: quantity,
          price: `$${unitPrice.toFixed(2)}`,
          total: `$${itemTotal.toFixed(2)}`,
        };
      }),
    };

    return NextResponse.json({ success: true, data: formattedOrder });
  } catch (error) {
    console.error("Failed to fetch order details:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}