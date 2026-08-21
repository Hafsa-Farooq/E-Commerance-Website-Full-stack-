import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/mail";

// GET: Admin dashboard ke liye orders list karna (with pagination & filtering)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const tab = searchParams.get("tab") || "All";
    
    // Pagination parameters
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { user: { email: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (tab && tab !== "All") {
      where.status = tab.toUpperCase();
    }

    // Total count calculate karein pagination ke liye
    const total = await prisma.order.count({ where });
    const totalPages = Math.ceil(total / limit) || 1;

    // Paginated orders fetch karein
    const orders = await prisma.order.findMany({
      where,
      skip,
      take: limit,
      include: {
        user: true,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedOrders = orders.map((order) => {
      const firstItem = order.items[0];
      const productName = firstItem?.variant?.product?.name || "Multiple Products";
      const productImage = firstItem?.variant?.product?.images[0]?.url || "/placeholder.png";

      let statusColor = "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      if (order.status === "DELIVERED" || order.status === "PAID") {
        statusColor = "bg-green-500/10 text-green-600 border-green-200";
      } else if (order.status === "CANCELLED" || order.status === "REFUNDED") {
        statusColor = "bg-red-500/10 text-red-600 border-red-200";
      } else if (order.status === "PROCESSING" || order.status === "SHIPPED") {
        statusColor = "bg-blue-500/10 text-blue-600 border-blue-200";
      }

      return {
        id: order.orderNumber,
        dbId: order.id,
        productName,
        productImage,
        price: `$${Number(order.total).toFixed(2)}`,
        customerName: order.user?.name || "Guest Customer",
        customerEmail: order.user?.email || "",
        date: new Date(order.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        type: order.orderType || "Delivery",
        status: order.status.charAt(0) + order.status.slice(1).toLowerCase(),
        statusColor,
      };
    });

    return NextResponse.json({ 
      success: true, 
      data: formattedOrders,
      total,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Customer checkout se naya order create karna (COD / Bank Transfer)
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Please sign in first" }, { status: 401 });
    }

    const body = await request.json();
    const {
      fullName,
      phone,
      line1,
      line2,
      city,
      state,
      postalCode,
      country,
      paymentMethod, 
      couponCode, 
    } = body;

    if (!fullName || !phone || !line1 || !city || !state || !postalCode || !country) {
      return NextResponse.json({ error: "All address fields are required" }, { status: 400 });
    }

    if (!paymentMethod) {
      return NextResponse.json({ error: "Please select a payment method" }, { status: 400 });
    }

    const validMethods = ["COD", "BANK_TRANSFER", "STRIPE"];
    if (!validMethods.includes(paymentMethod)) {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
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

    const cart = await prisma.cart.findUnique({
      where: { userId: user.id },
      include: {
        items: {
          include: {
            variant: { include: { product: true } },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
    }

    const address = await prisma.address.create({
      data: {
        userId: user.id,
        type: "SHIPPING",
        fullName,
        phone,
        line1,
        line2: line2 || null,
        city,
        state,
        postalCode,
        country,
      },
    });

    const subtotal = cart.items.reduce((sum, item) => {
      const price = item.variant.priceOverride
        ? Number(item.variant.priceOverride)
        : Number(item.variant.product.basePrice);
      return sum + price * item.quantity;
    }, 0);

    let coupon = null;
    let discount = 0;

    if (couponCode) {
      coupon = await prisma.coupon.findUnique({ where: { code: couponCode.toUpperCase() } });

      if (!coupon || !coupon.isActive) {
        return NextResponse.json({ error: "Invalid or inactive coupon code" }, { status: 400 });
      }
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
        return NextResponse.json({ error: "This coupon has expired" }, { status: 400 });
      }
      if (coupon.minOrderAmount && subtotal < Number(coupon.minOrderAmount)) {
        return NextResponse.json(
          { error: `Minimum order amount for this coupon is $${Number(coupon.minOrderAmount)}` },
          { status: 400 }
        );
      }

      if (coupon.discountType === "PERCENTAGE") {
        discount = Math.round((subtotal * Number(coupon.discountValue)) / 100);
        if (coupon.maxDiscountAmount) {
          discount = Math.min(discount, Number(coupon.maxDiscountAmount));
        }
      } else {
        discount = Number(coupon.discountValue);
      }
    } else {
      discount = Math.round(subtotal * 0.2);
    }

    const shipping = 15;
    const total = subtotal - discount + shipping;

    const orderNumber = `ORD-${Date.now()}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: user.id,
        addressId: address.id,
        couponId: coupon?.id || null,
        status: "PENDING",
        subtotal,
        discount,
        shipping,
        total,
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
            method: paymentMethod,
            status: "PENDING",
            amount: total,
          },
        },
      },
      include: { items: true },
    });

    if (coupon) {
      await prisma.couponUsage.create({
        data: { couponId: coupon.id, userId: user.id },
      });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    // Send Checkout / Order Placed Email
    if (user.email) {
      await sendEmail({
        to: user.email,
        subject: `Order Confirmation (${orderNumber}) - Shop.co`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2>Thank you for your order!</h2>
            <p>Hi ${user.name || "Customer"},</p>
            <p>Your order <strong>${orderNumber}</strong> has been successfully placed.</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Total Amount:</strong> $${total.toFixed(2)}</p>
            <br/>
            <p>We will notify you once your order status updates.</p>
            <p>Best regards,<br/><strong>Shop.co Team</strong></p>
          </div>
        `,
      });
    }

    return NextResponse.json(
      { success: true, data: { orderId: order.id, orderNumber: order.orderNumber } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: error.message || "Failed to place order" },
      { status: 500 }
    );
  }
}