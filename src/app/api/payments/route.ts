import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const methodLabels: Record<string, string> = {
  COD: "Cash on Delivery",
  CASH: "Cash on Delivery",
  BANK_TRANSFER: "Bank Transfer",
  STRIPE: "Stripe",
  CARD: "Credit/Debit Card",
};

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        payment: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedPayments = orders.map((order) => {
      const payment = order.payment;
      const totalAmount = payment ? Number(payment.amount) : Number(order.total);

      // Strictly fetch real data from database column without any fallback guesses
      let method = "Not Specified";
      if (payment?.method) {
        const upperMethod = payment.method.toUpperCase().trim();
        method = methodLabels[upperMethod] || payment.method;
      }

      let status = "Pending";
      let statusColor = "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400";

      if (payment?.status === "SUCCEEDED" || payment?.status === "COMPLETED") {
        status = "Completed";
        statusColor = "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400";
      } else if (payment?.status === "FAILED") {
        status = "Failed";
        statusColor = "bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-950/40 dark:text-rose-400";
      } else if (payment?.status === "REFUNDED") {
        status = "Refunded";
        statusColor = "bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-950/40 dark:text-slate-400";
      }

      return {
        id: `PAY-${order.id.slice(-4).toUpperCase()}`,
        dbId: order.id,
        orderId: order.orderNumber,
        customer: order.user?.name || "Valued Customer",
        email: order.user?.email || "customer@example.com",
        method,
        amount: `$${totalAmount.toFixed(2)}`,
        status,
        statusColor,
        date: new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      };
    });

    return NextResponse.json({ success: true, data: formattedPayments });
  } catch (error) {
    console.error("Error fetching payments:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}