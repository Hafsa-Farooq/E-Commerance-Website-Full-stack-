'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Download, ArrowUpRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bar, BarChart, ResponsiveContainer, XAxis, Line, LineChart } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const barData = [
  { name: "January", total: 4000 },
  { name: "February", total: 3000 },
  { name: "March", total: 5000 },
  { name: "April", total: 2780 },
  { name: "May", total: 1890 },
  { name: "June", total: 2390 },
];

const lineData = [
  { name: "March", value1: 2000, value2: 1200 },
  { name: "April", value1: 3500, value2: 2200 },
  { name: "May", value1: 3000, value2: 1800 },
  { name: "June", value1: 4500, value2: 2900 },
  { name: "July", value1: 3800, value2: 2400 },
  { name: "August", value1: 5200, value2: 3400 },
];

export default function ECommerceDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Title & Date Picker */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">E-Commerce Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-xl flex items-center gap-2 text-xs font-medium">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            20 Jul 2026 - 16 Aug 2026
          </Button>
          <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90 flex items-center gap-2 text-xs font-semibold">
            <Download className="h-4 w-4" /> Download
          </Button>
        </div>
      </div>

      {/* Row 1: Congratulations Banner & 3 Metric Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Congratulations Card */}
        <Card className="rounded-2xl border shadow-sm bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50 dark:from-indigo-950/20 dark:via-card dark:to-purple-950/20 relative overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-black text-foreground">Congratulations Toby! 🎉</CardTitle>
            <CardDescription className="text-xs text-muted-foreground">Best seller of the month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div>
              <div className="text-2xl font-bold tracking-tight text-foreground">$15,231.89</div>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                <ArrowUpRight className="h-3.5 w-3.5" /> +65% from last month
              </p>
            </div>
            <Button size="sm" variant="outline" className="rounded-xl text-xs font-semibold bg-card shadow-sm">
              View Sales
            </Button>
          </CardContent>
        </Card>

        {/* Metric 1 */}
        <Card className="rounded-2xl border shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Monthly recurring...</CardTitle>
            <span className="text-xs font-semibold text-emerald-600">+6.1%</span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-black tracking-tight text-foreground">$34.1K</div>
            <div className="text-xs text-primary font-medium flex items-center gap-1 cursor-pointer hover:underline">
              View more &rarr;
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="rounded-2xl border shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Users</CardTitle>
            <span className="text-xs font-semibold text-emerald-600">+19.2%</span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-black tracking-tight text-foreground">500.1K</div>
            <div className="text-xs text-primary font-medium flex items-center gap-1 cursor-pointer hover:underline">
              View more &rarr;
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="rounded-2xl border shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">User growth</CardTitle>
            <span className="text-xs font-semibold text-rose-500">-1.2%</span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-black tracking-tight text-foreground">11.3%</div>
            <div className="text-xs text-primary font-medium flex items-center gap-1 cursor-pointer hover:underline">
              View more &rarr;
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Total Revenue Bar Chart */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">Total Revenue</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Income in the last 28 days</CardDescription>
            </div>
            <div className="flex gap-4 text-xs font-semibold">
              <div>
                <span className="text-muted-foreground block text-[10px]">DESKTOP</span>
                <span className="text-base font-bold text-foreground">24,828</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[10px]">MOBILE</span>
                <span className="text-base font-bold text-foreground">25,010</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Bar dataKey="total" fill="currentColor" radius={[6, 6, 0, 0]} className="fill-foreground" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Returning Rate Line Chart */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">Returning Rate</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-black text-foreground">$42,379</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-600 font-semibold border border-emerald-200">+2.5%</span>
              </div>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
              Export
            </Button>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={lineData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                <Line type="monotone" dataKey="value1" stroke="currentColor" strokeWidth={2} dot={false} className="stroke-foreground" />
                <Line type="monotone" dataKey="value2" stroke="#cbd5e1" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Sales by Location, Store Visits, Customer Reviews */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Sales by Location */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">Sales by Location</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Income in the last 28 days</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs">Export</Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-2 text-sm">
            {[
              { country: "Canada", change: "+5.2%", percent: "85%" },
              { country: "Greenland", change: "+7.8%", percent: "80%" },
              { country: "Russia", change: "-2.1%", percent: "63%" },
              { country: "China", change: "+3.4%", percent: "60%" },
              { country: "Australia", change: "+1.2%", percent: "45%" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="flex items-center gap-2 font-semibold text-foreground">
                    {item.country} <span className={`text-[10px] ${item.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>{item.change}</span>
                  </span>
                  <span className="text-muted-foreground">{item.percent}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-foreground rounded-full" style={{ width: item.percent }}></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Store Visits by Source */}
        <Card className="rounded-2xl border shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Store Visits by Source</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6">
            <div className="text-4xl font-black tracking-tight text-foreground">10.2K</div>
            <p className="text-xs text-muted-foreground mb-6">Visitors</p>
            <div className="flex flex-wrap gap-4 text-xs font-medium text-muted-foreground justify-center">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-foreground"></span> Direct</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-400"></span> Referrals</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-slate-200"></span> Email</span>
            </div>
          </CardContent>
        </Card>

        {/* Customer Reviews */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold">Customer Reviews</CardTitle>
              <CardDescription className="text-xs text-muted-foreground">Based on 5,500 verified purchases</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl text-xs">View All &rarr;</Button>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-black text-foreground">4.5</div>
              <div>
                <div className="flex text-amber-400 gap-0.5">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <p className="text-[11px] text-muted-foreground">out of 5</p>
              </div>
            </div>
            <div className="rounded-xl border bg-muted/20 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-foreground">Exceeded my expectations!</span>
                <span className="text-[10px] text-muted-foreground font-normal">March 12, 2025</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">I was skeptical at first, but this product has completely changed my daily routine...</p>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-medium text-foreground">Sarah J.</span>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-600 text-[10px]">Verified Purchase</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 4: Recent Orders & Best Selling Products Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Orders Table */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-bold">Recent Orders</CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl text-xs">Export</Button>
          </CardHeader>
          <CardContent>
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
                {[
                  { id: "#1023", name: "Theodore Bell", amount: "$300.00", status: "Processing", variant: "bg-blue-50 text-blue-600 border-blue-200" },
                  { id: "#2045", name: "Amelia Grant", amount: "$450.00", status: "Paid", variant: "bg-amber-50 text-amber-600 border-amber-200" },
                  { id: "#3067", name: "Eleanor Ward", amount: "$200.00", status: "Success", variant: "bg-emerald-50 text-emerald-600 border-emerald-200" },
                  { id: "#4089", name: "Henry Carter", amount: "$500.00", status: "Processing", variant: "bg-blue-50 text-blue-600 border-blue-200" },
                  { id: "#5102", name: "Olivia Harris", amount: "$350.00", status: "Failed", variant: "bg-rose-50 text-rose-600 border-rose-200" },
                ].map((order, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-foreground">{order.id}</TableCell>
                    <TableCell className="font-medium text-foreground">{order.name}</TableCell>
                    <TableCell className="text-muted-foreground">{order.amount}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${order.variant}`}>
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Best Selling Products Table */}
        <Card className="rounded-2xl border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg font-bold">Best Selling Products</CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl text-xs">Export</Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Product</TableHead>
                  <TableHead className="text-xs">Sold</TableHead>
                  <TableHead className="text-xs text-right">Sales</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs">
                {[
                  { name: "Sports Shoes", sold: "10", sales: "$316.00" },
                  { name: "Black T-Shirt", sold: "20", sales: "$274.00" },
                  { name: "Jeans", sold: "15", sales: "$195.00" },
                  { name: "Red Sneakers", sold: "40", sales: "$402.00" },
                  { name: "Red Scarf", sold: "37", sales: "$280.00" },
                ].map((product, i) => (
                  <TableRow key={i}>
                    <TableCell className="font-semibold text-foreground">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sold}</TableCell>
                    <TableCell className="text-right font-medium text-foreground">{product.sales}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}