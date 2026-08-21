import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

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
      tax: `$${Number(order.tax || 0).toFixed(2)}`,
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

// PATCH: Admin order status update & syncing payment status + delivery email trigger
export async function PATCH(request: Request, context: Context) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json({ success: false, error: "Status is required" }, { status: 400 });
    }

    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { id: id },
          { orderNumber: id },
        ],
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const newOrderStatus = status.toUpperCase();

    // 1. Update Order Status
    const updatedOrder = await prisma.order.update({
      where: { id: existingOrder.id },
      data: { status: newOrderStatus },
      include: { user: true, address: true },
    });

    // 2. Sync Payment Status based on Order Status Change
    let paymentStatusToSet: string | undefined = undefined;
    if (["DELIVERED", "COMPLETED", "PAID", "PROCESSING", "SHIPPED"].includes(newOrderStatus)) {
      paymentStatusToSet = "SUCCEEDED";
    } else if (["CANCELLED", "REFUNDED"].includes(newOrderStatus)) {
      paymentStatusToSet = newOrderStatus;
    }

    if (paymentStatusToSet) {
      await prisma.payment.updateMany({
        where: { orderId: existingOrder.id },
        data: { status: paymentStatusToSet },
      });
    }

    // 3. Send Order Delivered Email if status is DELIVERED
    if (updatedOrder.status === "DELIVERED" && updatedOrder.user?.email) {
      await sendEmail({
        to: updatedOrder.user.email,
        subject: `Your Order ${updatedOrder.orderNumber} Has Been Delivered! 📦`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #2e7d32;">Order Delivered Successfully!</h2>
            <p>Hi ${updatedOrder.user.name || "Customer"},</p>
            <p>We are thrilled to let you know that your order <strong>${updatedOrder.orderNumber}</strong> has been successfully delivered to your shipping address:</p>
            <p style="background: #f9f9f9; padding: 12px; border-radius: 6px; border-left: 4px solid #2e7d32;">
              ${updatedOrder.address ? `${updatedOrder.address.line1}, ${updatedOrder.address.city}, ${updatedOrder.address.state} ${updatedOrder.address.postalCode}` : "Address on file"}
            </p>
            <p>Thank you for shopping with Shop.co. We hope to see you again soon!</p>
            <br/>
            <p>Best regards,<br/><strong>Shop.co Team</strong></p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true, data: updatedOrder });
  } catch (error: any) {
    console.error("Failed to update order status:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
  }
}