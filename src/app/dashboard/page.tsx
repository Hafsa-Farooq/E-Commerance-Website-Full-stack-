'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Calendar, Download, ArrowUpRight, ArrowDownRight, Star,
  Wallet, ShoppingBag, Users, TrendingUp, MapPin, PieChart, MessageSquareText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, ResponsiveContainer, XAxis, Line, LineChart } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface DashboardStats {
  totalRevenue: number;
  thisMonthRevenue: number;
  revenueChangePercent: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  avgOrderValue: number;
  revenueByMonth: { name: string; total: number }[];
  ordersByMonth: { name: string; value1: number }[];
  salesByLocation: { country: string; amount: number }[];
  maxLocationAmount: number;
  bestSellingProducts: { name: string; sold: number; sales: number }[];
  recentOrders: { id: string; name: string; amount: string; status: string }[];
  statusCounts: Record<string, number>;
  avgRating: number;
  totalReviews: number;
  latestReview: {
    comment: string;
    rating: number;
    userName: string;
    productName: string;
    date: string;
  } | null;
}

const statusColorMap: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-600 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-600 border-emerald-200",
  PROCESSING: "bg-blue-50 text-blue-600 border-blue-200",
  SHIPPED: "bg-blue-50 text-blue-600 border-blue-200",
  DELIVERED: "bg-emerald-50 text-emerald-600 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-600 border-rose-200",
  REFUNDED: "bg-rose-50 text-rose-600 border-rose-200",
};

const statusDotColors = ["bg-foreground", "bg-slate-400", "bg-slate-300", "bg-slate-200", "bg-slate-100"];

export default function ECommerceDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/dashboard/stats");
        const result = await res.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-muted-foreground text-sm font-medium">
        Loading dashboard...
      </div>
    );
  }

  const bestSeller = stats.bestSellingProducts[0];

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Title & Date Picker */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">E-Commerce Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl flex items-center gap-2 text-xs font-medium">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Last 6 months
          </Button>
          <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90 flex items-center gap-2 text-xs font-semibold">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      {/* Row 1: Revenue Highlight & 3 Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue This Month Card (replaces "Congratulations" banner) */}
        <Card className="rounded-2xl border shadow-sm bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-card dark:to-purple-950/20 relative overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-black text-foreground">
                  {bestSeller ? `Top Seller: ${bestSeller.name}` : "Revenue This Month"}
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  {bestSeller ? `${bestSeller.sold} units sold` : "No sales yet"}
                </CardDescription>
              </div>
              <div className="h-10 w-10 rounded-xl bg-indigo-100/70 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-300 shrink-0">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">
                ${stats.thisMonthRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className={`text-xs font-medium flex items-center gap-1 mt-0.5 ${stats.revenueChangePercent >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                {stats.revenueChangePercent >= 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                {stats.revenueChangePercent >= 0 ? "+" : ""}{stats.revenueChangePercent}% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Orders (replaces MRR) */}
        <Card className="rounded-2xl border shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Orders</CardTitle>
              <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <ShoppingBag className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-black tracking-tight text-foreground">{stats.totalOrders}</div>
          </CardContent>
        </Card>

        {/* Total Customers (replaces Users) */}
        <Card className="rounded-2xl border shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customers</CardTitle>
              <div className="h-9 w-9 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center text-violet-600 dark:text-violet-400 shrink-0">
                <Users className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-black tracking-tight text-foreground">{stats.totalCustomers}</div>
          </CardContent>
        </Card>

        {/* Average Order Value (replaces User growth) */}
        <Card className="rounded-2xl border shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avg. Order Value</CardTitle>
              <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-black tracking-tight text-foreground">
              ${stats.avgOrderValue.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Total Revenue Bar Chart */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <Wallet className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Total Revenue</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Income over the last 6 months</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.revenueByMonth}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Bar dataKey="total" fill="currentColor" radius={[6, 6, 0, 0]} className="fill-foreground" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders Trend Line Chart (replaces "Returning Rate") */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center text-foreground shrink-0">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Orders Trend</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black text-foreground">{stats.totalOrders}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground font-semibold border">last 6 months</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={stats.ordersByMonth}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Line type="monotone" dataKey="value1" stroke="currentColor" strokeWidth={2} dot={false} className="stroke-foreground" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Sales by Location, Order Status, Customer Reviews */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sales by Location — real from order addresses */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Sales by Location</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">By shipping country</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 text-sm">
            {stats.salesByLocation.length === 0 ? (
              <p className="text-xs text-muted-foreground">No orders yet.</p>
            ) : (
              stats.salesByLocation.map((item, idx) => {
                const percent = Math.round((item.amount / stats.maxLocationAmount) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-medium">
                      <span className="font-semibold text-foreground">{item.country}</span>
                      <span className="text-muted-foreground">${item.amount}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-foreground rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Order Status Breakdown (replaces "Store Visits by Source") */}
        <Card className="rounded-2xl border shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <PieChart className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-bold">Orders by Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-4xl font-black tracking-tight text-foreground">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground mb-6">Total Orders</p>
            <div className="flex flex-wrap gap-3 text-xs font-medium text-muted-foreground justify-center">
              {Object.entries(stats.statusCounts).map(([status, count], idx) => (
                <span key={status} className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${statusDotColors[idx % statusDotColors.length]}`}></span>
                  {status.charAt(0) + status.slice(1).toLowerCase()} ({count})
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Reviews — real average + latest */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-yellow-50 dark:bg-yellow-950/40 flex items-center justify-center text-yellow-600 dark:text-yellow-400 shrink-0">
                <MessageSquareText className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold">Customer Reviews</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Based on {stats.totalReviews} reviews</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-foreground">{stats.avgRating.toFixed(1)}</div>
              <div>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(stats.avgRating) ? "fill-current" : "text-muted fill-muted"}`} />
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground">out of 5</p>
              </div>
            </div>
            {stats.latestReview ? (
              <div className="rounded-xl border bg-muted/20 p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-foreground">{stats.latestReview.productName}</span>
                  <span className="text-[10px] text-muted-foreground font-normal">
                    {new Date(stats.latestReview.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">{stats.latestReview.comment || "No comment provided."}</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-medium text-foreground">{stats.latestReview.userName}</span>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-600 text-[10px]">{stats.latestReview.rating} ★</Badge>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">No reviews yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Recent Orders & Best Selling Products Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders Table */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats.recentOrders.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No orders yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">ID</TableHead>
                    <TableHead className="text-xs">Customer</TableHead>
                    <TableHead className="text-xs">Amount</TableHead>
                    <TableHead className="text-xs text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {stats.recentOrders.map((order, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold text-foreground">{order.id}</TableCell>
                      <TableCell className="font-medium text-foreground">{order.name}</TableCell>
                      <TableCell className="text-muted-foreground">${order.amount}</TableCell>
                      <TableCell className="text-right">
                        <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusColorMap[order.status] || "bg-muted text-muted-foreground"}`}>
                          {order.status.charAt(0) + order.status.slice(1).toLowerCase()}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Best Selling Products Table */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                <TrendingUp className="h-4 w-4" />
              </div>
              <CardTitle className="text-lg font-bold">Best Selling Products</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {stats.bestSellingProducts.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4">No sales yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs">Product</TableHead>
                    <TableHead className="text-xs">Sold</TableHead>
                    <TableHead className="text-xs text-right">Sales</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs">
                  {stats.bestSellingProducts.map((product, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold text-foreground">{product.name}</TableCell>
                      <TableCell className="text-muted-foreground">{product.sold}</TableCell>
                      <TableCell className="text-right font-medium text-foreground">${product.sales.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}