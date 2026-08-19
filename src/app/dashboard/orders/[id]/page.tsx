'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface OrderData {
  id: string;
  date: string;
  customer: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  paymentMethod: string;
  status: string;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  promoCode: string;
  total: number;
  items: Array<{
    id: number | string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params?.id as string;

  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 text-xs font-medium text-muted-foreground">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <p className="text-sm font-bold text-foreground">Order not found.</p>
        <Link href="/dashboard/orders">
          <Button variant="outline" className="rounded-xl text-xs font-semibold">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-12 w-full">
      {/* Top Header & Action Buttons (Hidden during print) */}
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/orders">
            <Button variant="outline" size="icon" className="rounded-xl h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Order {order.id}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={handlePrint}
            className="rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold text-xs h-10 cursor-pointer"
          >
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
        </div>
      </div>

      {/* ================= NORMAL DASHBOARD VIEW ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:hidden">
        {/* Customer & Info Card */}
        <Card className="lg:col-span-2 rounded-2xl border shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order {order.id}</span>
              <p className="text-xs text-muted-foreground mt-0.5">Placed on {order.date}</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400">
              {order.status}
            </span>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Customer Information</h3>
            <p className="font-bold text-sm text-foreground">{order.customer.name}</p>
            <p className="text-xs text-muted-foreground">{order.customer.email}</p>
            <p className="text-xs text-muted-foreground">{order.customer.address}</p>
          </div>

          <div className="border-t pt-4 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Payment Method</h3>
              <p className="text-xs font-medium text-foreground">{order.paymentMethod}</p>
            </div>
          </div>
        </Card>

        {/* Order Summary Card */}
        <Card className="rounded-2xl border shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-foreground">Order Summary</h3>
          <div className="space-y-2 text-xs text-muted-foreground border-b pb-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-medium text-foreground">${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-medium text-foreground">${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span className="font-medium text-foreground">${order.tax.toFixed(2)}</span>
            </div>
            {order.promoCode && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Promo Discount ({order.promoCode})</span>
                <span>-${order.discount.toFixed(2)}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between font-bold text-base text-foreground pt-1">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </Card>
      </div>

      {/* Order Items Table (Normal View) */}
      <Card className="rounded-2xl border shadow-sm p-6 print:hidden">
        <h3 className="font-bold text-sm text-foreground mb-4">Order Items</h3>
        <div className="divide-y">
          {order.items.map((item, index) => (
            <div key={index} className="py-3 flex justify-between items-center text-xs">
              <div>
                <p className="font-bold text-foreground text-sm">{item.name}</p>
                <p className="text-muted-foreground">Quantity: {item.quantity}</p>
              </div>
              <span className="font-bold text-foreground text-sm">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* ================= PROFESSIONAL PRINT RECEIPT (Visible ONLY when printing) ================= */}
      <div className="hidden print:block font-sans text-black bg-white p-8 max-w-[800px] mx-auto">
        <div className="flex justify-between items-center border-b pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-wider uppercase">Store Logo / Brand</h1>
            <p className="text-xs text-gray-500 mt-1">Official Purchase Invoice & Receipt</p>
          </div>
          <div className="text-right text-xs">
            <p className="font-bold text-sm">Invoice ID: {order.id}</p>
            <p className="text-gray-500">Date: {order.date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-6 text-xs">
          <div>
            <h4 className="font-bold uppercase text-gray-400 mb-1">Billed To:</h4>
            <p className="font-bold text-sm">{order.customer.name}</p>
            <p className="text-gray-600">{order.customer.email}</p>
            <p className="text-gray-600">{order.customer.address}</p>
          </div>
          <div className="text-right">
            <h4 className="font-bold uppercase text-gray-400 mb-1">Payment Details:</h4>
            <p className="font-medium">{order.paymentMethod}</p>
            <p className="text-gray-600 mt-1">Status: <span className="font-bold text-green-600">{order.status}</span></p>
          </div>
        </div>

        <table className="w-full text-left border-collapse mb-6 text-xs">
          <thead>
            <tr className="border-b-2 border-black text-gray-700 uppercase">
              <th className="py-2">Item Description</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {order.items.map((item, index) => (
              <tr key={index}>
                <td className="py-3 font-medium">{item.name}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">${item.price.toFixed(2)}</td>
                <td className="py-3 text-right font-bold">${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-start border-t pt-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 w-72">
            <p className="text-xs font-bold text-gray-700 uppercase mb-1">Applied Promo Code:</p>
            <p className="text-xs font-mono font-bold text-emerald-700">{order.promoCode || "None"}</p>
          </div>
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping Fee:</span>
              <span>${order.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-emerald-600 font-medium">
              <span>Discount:</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-black border-t pt-2">
              <span>Grand Total:</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 text-center text-[10px] text-gray-400 border-t pt-4">
          <p>Thank you for shopping with us! For support, contact support@yourstore.com</p>
        </div>
      </div>
    </div>
  );
}