import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const customers = await prisma.user.findMany({
      where: {
        orders: {
          some: {},
        },
      },
      include: {
        orders: true,
        addresses: true, // phone yahan se aata hai
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const formattedCustomers = customers.map((user) => {
      const totalOrders = user.orders.length;
      const totalSpentNum = user.orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
      const firstAddress = user.addresses[0];

      return {
        id: `CUST-${user.id.slice(-4).toUpperCase()}`,
        dbId: user.id,
        name: user.name || "Customer",
        email: user.email,
        phone: firstAddress?.phone || "N/A", // User model mein phone nahi hai, Address se aa raha hai
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
        totalOrders,
        totalSpent: `$${totalSpentNum.toFixed(2)}`,
        status: "Active",
        statusColor: "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400",
        joinedDate: new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      };
    });

    return NextResponse.json({ success: true, data: formattedCustomers });
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}