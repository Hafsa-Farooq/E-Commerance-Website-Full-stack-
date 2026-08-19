import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Orders aur unke associated User data ko fetch karein
    const orders = await prisma.order.findMany({
      include: {
        user: true, // Customer details ke liye
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedPayments = orders.map((order) => {
      // Payment method determine karein (Aap apne schema ke mutabiq field name adjust kar sakte hain, e.g., order.paymentMethod ya order.gateway)
      const rawMethod = order.paymentMethod || "CARD"; 
      let method = "Stripe";
      let status = "Completed";
      let statusColor = "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400";

      const methodUpper = rawMethod.toUpperCase();
      
      if (methodUpper.includes("CASH") || methodUpper.includes("COD")) {
        method = "Cash on Delivery";
        status = "Cash on Delivery";
        statusColor = "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400";
      } else if (methodUpper.includes("BANK") || methodUpper.includes("TRANSFER")) {
        method = "Bank Transfer";
        status = order.isPaid ? "Completed" : "Pending";
        statusColor = order.isPaid 
          ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400"
          : "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400";
      } else {
        method = "Stripe";
        status = order.isPaid ? "Completed" : "Pending";
        statusColor = order.isPaid 
          ? "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400"
          : "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400";
      }

      const totalAmount = Number(order.total || order.amount || 0);

      return {
        id: `PAY-${order.id.slice(-4).toUpperCase()}`,
        dbId: order.id,
        orderId: `ORD-${order.id.slice(-4).toUpperCase()}`,
        customer: order.user?.name || "Valued Customer",
        email: order.user?.email || "customer@example.com",
        method: method,
        amount: `$${totalAmount.toFixed(2)}`,
        status: status,
        statusColor: statusColor,
        date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      };
    });

    return NextResponse.json({ success: true, data: formattedPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}