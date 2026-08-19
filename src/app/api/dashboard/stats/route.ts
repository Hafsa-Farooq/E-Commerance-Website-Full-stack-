import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    // Basic counts
    const [totalOrders, totalCustomers, totalProducts, allOrders] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.product.count(),
      prisma.order.findMany({
        include: {
          address: true,
          items: {
            include: {
              variant: { include: { product: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const totalRevenue = allOrders.reduce((sum, o) => sum + Number(o.total), 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // This month vs last month revenue (for the "Congratulations" style card)
    const thisMonthRevenue = allOrders
      .filter((o) => o.createdAt >= startOfMonth)
      .reduce((sum, o) => sum + Number(o.total), 0);

    const lastMonthRevenue = allOrders
      .filter((o) => o.createdAt >= startOfLastMonth && o.createdAt <= endOfLastMonth)
      .reduce((sum, o) => sum + Number(o.total), 0);

    const revenueChangePercent = lastMonthRevenue > 0
      ? Math.round(((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)
      : 0;

    // Revenue by month (last 6 months) — for bar chart
    const revenueByMonth: { name: string; total: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const monthTotal = allOrders
        .filter((o) => o.createdAt >= monthStart && o.createdAt <= monthEnd)
        .reduce((sum, o) => sum + Number(o.total), 0);
      revenueByMonth.push({
        name: monthStart.toLocaleDateString("en-US", { month: "long" }),
        total: Math.round(monthTotal),
      });
    }

    // Orders count by month (last 6 months) — for line chart (this month vs last 6mo trend)
    const ordersByMonth: { name: string; value1: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const count = allOrders.filter((o) => o.createdAt >= monthStart && o.createdAt <= monthEnd).length;
      ordersByMonth.push({
        name: monthStart.toLocaleDateString("en-US", { month: "long" }),
        value1: count,
      });
    }

    // Sales by location (country from order address)
    const locationMap: Record<string, number> = {};
    allOrders.forEach((o) => {
      const country = o.address?.country || "Unknown";
      locationMap[country] = (locationMap[country] || 0) + Number(o.total);
    });
    const salesByLocation = Object.entries(locationMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, amount]) => ({ country, amount: Math.round(amount) }));
    const maxLocationAmount = salesByLocation[0]?.amount || 1;

    // Best selling products (grouped by product across all order items)
    const productSales: Record<string, { name: string; sold: number; sales: number }> = {};
    allOrders.forEach((o) => {
      o.items.forEach((item) => {
        const pName = item.variant.product.name;
        if (!productSales[pName]) {
          productSales[pName] = { name: pName, sold: 0, sales: 0 };
        }
        productSales[pName].sold += item.quantity;
        productSales[pName].sales += Number(item.unitPrice) * item.quantity;
      });
    });
    const bestSellingProducts = Object.values(productSales)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Recent orders (latest 5)
    const recentOrders = allOrders.slice(0, 5).map((o) => ({
      id: o.orderNumber,
      name: o.address?.fullName || "Guest Customer",
      amount: Number(o.total).toFixed(2),
      status: o.status,
    }));

    // Order status breakdown (replaces "Store Visits by Source" — real data instead of traffic)
    const statusCounts: Record<string, number> = {};
    allOrders.forEach((o) => {
      statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
    });

    // Reviews summary
    const reviews = await prisma.productReview.findMany({
      include: { user: true, product: true },
      orderBy: { createdAt: "desc" },
      take: 1,
    });
    const allReviews = await prisma.productReview.findMany();
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    const latestReview = reviews[0]
      ? {
          comment: reviews[0].comment || "",
          rating: reviews[0].rating,
          userName: reviews[0].user?.name || "Anonymous",
          productName: reviews[0].product?.name || "",
          date: reviews[0].createdAt,
        }
      : null;

    return NextResponse.json({
      success: true,
      data: {
        totalRevenue,
        thisMonthRevenue,
        revenueChangePercent,
        totalOrders,
        totalCustomers,
        totalProducts,
        avgOrderValue,
        revenueByMonth,
        ordersByMonth,
        salesByLocation,
        maxLocationAmount,
        bestSellingProducts,
        recentOrders,
        statusCounts,
        avgRating,
        totalReviews: allReviews.length,
        latestReview,
      },
    });
  } catch (error: any) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}