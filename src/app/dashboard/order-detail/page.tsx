'use client';

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Printer, Edit, CreditCard, 
  Check, Truck, Package, CheckCircle2, Loader2, Tag 
} from "lucide-react";

interface OrderItem {
  id: string | number;
  name: string;
  image: string;
  quantity: number;
  price: string;
  total: string;
}

interface OrderData {
  id: string;
  dbId: string;
  createdAt: string;
  status: string;
  orderType: string;
  subtotal: string;
  shipping: string;
  tax: string;
  discount: number;
  promoCode: string;
  total: string;
  customer: {
    name: string;
    email: string;
    address: string;
    phone: string;
  };
  payment: {
    method: string;
    status: string;
  };
  items: OrderItem[];
}

const fallbackOrder: OrderData = {
  id: "ORD-1787053523179",
  dbId: "sample-db-id",
  createdAt: "Aug 18, 2026",
  status: "PENDING",
  orderType: "Delivery",
  subtotal: "$2900.00",
  shipping: "$15.00",
  tax: "$0.00",
  discount: 0,
  promoCode: "",
  total: "$2335.00",
  customer: {
    name: "Ayesha Farooq",
    email: "hafsafarooq688@gmail.com",
    address: "Main Bedian Road Lidher Near Main Hospital Lahore Cantt, Lahore, punjab 54810",
    phone: "+92 300 0000000",
  },
  payment: {
    method: "Stripe Online Payment",
    status: "PAID",
  },
  items: [
    {
      id: 1,
      name: "Wireless Headphones",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&auto=format&fit=crop&q=80",
      quantity: 1,
      price: "$2900.00",
      total: "$2900.00",
    },
  ],
};

export default function OrderDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const orderId = searchParams.get("id") || "ORD-1787053523179";

  const [order, setOrder] = useState<OrderData>(fallbackOrder);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${orderId}`);
        const data = await res.json();
        if (data.success && data.data) {
          setOrder(data.data);
        }
      } catch (err) {
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const statusLower = (order?.status || "").toLowerCase();
  const isProcessing = true;
  const isShipped = statusLower === 'shipped' || statusLower === 'out_for_delivery' || statusLower === 'delivered';
  const isOutForDelivery = statusLower === 'out_for_delivery' || statusLower === 'delivered';
  const isDelivered = statusLower === 'delivered';

  return (
    <div className="flex flex-col gap-6 pb-12 w-full print:p-0 print:gap-4">
      {/* Top Action Header - Hidden during print */}
      <div className="flex items-center justify-between print:hidden">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-xl h-10 w-10 cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="rounded-xl gap-2 text-xs font-semibold h-10 cursor-pointer" 
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" /> Print Invoice
          </Button>
          <Button className="rounded-xl bg-foreground text-background hover:bg-foreground/90 gap-2 font-semibold text-xs h-10 cursor-pointer">
            <Edit className="h-4 w-4" /> Edit
          </Button>
        </div>
      </div>

      {/* Invoice Header for Print View */}
      <div className="hidden print:flex flex-col border-b pb-6 mb-2">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-foreground">SHOP.CO</h1>
            <p className="text-xs text-muted-foreground">Official Tax Invoice & Receipt</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-bold">INVOICE</h2>
            <p className="text-xs font-medium text-muted-foreground">Order ID: {order?.id || orderId}</p>
            <p className="text-xs text-muted-foreground">Date: {order?.createdAt || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Top Grid: Order Info & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-2">
        {/* Left 2 Columns: Order & Customer Info */}
        <Card className="lg:col-span-2 rounded-2xl p-6 border shadow-sm space-y-6 print:shadow-none print:border-none print:p-0">
          <div className="space-y-1 border-b pb-4 print:pb-2">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Order {order?.id || orderId}</h1>
              {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground print:hidden" />}
            </div>
            <p className="text-xs text-muted-foreground font-medium">Placed on {order?.createdAt || "N/A"}</p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer Information</h3>
            <div className="space-y-1">
              <p className="text-sm font-bold text-foreground">{order?.customer?.name || "N/A"}</p>
              <p className="text-xs text-muted-foreground">{order?.customer?.email || "N/A"}</p>
              <p className="text-xs text-muted-foreground">{order?.customer?.address || "N/A"}</p>
              <p className="text-xs text-muted-foreground">Phone: {order?.customer?.phone || "N/A"}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/40 border flex items-center justify-between print:border print:bg-transparent">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-background border flex items-center justify-center text-foreground">
                <CreditCard className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase">Payment Method</p>
                <p className="text-sm font-semibold text-foreground">{order?.payment?.method || "Stripe Online Payment"}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
              {order?.payment?.status || "PAID"}
            </span>
          </div>
        </Card>

        {/* Right 1 Column: Order Summary */}
        <Card className="rounded-2xl p-6 border shadow-sm space-y-6 flex flex-col justify-between print:shadow-none print:border print:p-4">
          <div className="space-y-4">
            <h3 className="text-base font-bold text-foreground border-b pb-4">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="font-semibold text-foreground">{order?.subtotal || "$0.00"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span className="font-semibold text-foreground">{order?.shipping || "$0.00"}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax</span>
                <span className="font-semibold text-foreground">{order?.tax || "$0.00"}</span>
              </div>

              {/* Promo Code & Discount Display */}
              {order?.promoCode && (
                <div className="flex justify-between items-center text-emerald-600 dark:text-emerald-400 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded-lg">
                  <span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5" /> Promo ({order.promoCode})</span>
                  <span>-${order.discount?.toFixed(2) || "0.00"}</span>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex justify-between text-base font-bold text-foreground">
              <span>Total Bill</span>
              <span className="text-lg">{order?.total || "$0.00"}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Delivery Status Section - Hidden during print */}
      <Card className="rounded-2xl p-6 sm:p-8 border shadow-sm space-y-8 print:hidden">
        <h3 className="text-base font-bold text-foreground">Delivery Status</h3>

        <div className="relative flex items-center justify-between w-full px-2 sm:px-12 py-4">
          <div className="absolute left-12 right-12 top-1/2 -translate-y-1/2 h-1.5 bg-muted z-0">
            <div 
              className={`absolute left-0 top-0 bottom-0 bg-foreground transition-all ${
                isDelivered ? "w-full" : isOutForDelivery ? "w-3/4" : isShipped ? "w-2/3" : "w-1/3"
              }`}
            ></div>
          </div>

          <div className="flex flex-col items-center gap-2 relative z-10 text-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-md ${isProcessing ? 'bg-emerald-500 text-white' : 'bg-background border-2 border-muted-foreground/30 text-muted-foreground'}`}>
              <Check className="h-5 w-5" />
            </div>
            <span className={`text-xs whitespace-nowrap ${isProcessing ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>Processing</span>
          </div>

          <div className="flex flex-col items-center gap-2 relative z-10 text-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-md ${isShipped ? 'bg-emerald-500 text-white' : 'bg-background border-2 border-muted-foreground/30 text-muted-foreground'}`}>
              <Truck className="h-5 w-5" />
            </div>
            <span className={`text-xs whitespace-nowrap ${isShipped ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>Shipped</span>
          </div>

          <div className="flex flex-col items-center gap-2 relative z-10 text-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-md ${isOutForDelivery ? 'bg-emerald-500 text-white' : 'bg-background border-2 border-muted-foreground/30 text-muted-foreground'}`}>
              <Package className="h-5 w-5" />
            </div>
            <span className={`text-xs whitespace-nowrap ${isOutForDelivery ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>Out for Delivery</span>
          </div>

          <div className="flex flex-col items-center gap-2 relative z-10 text-center">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center shadow-md ${isDelivered ? 'bg-emerald-500 text-white' : 'bg-background border-2 border-muted-foreground/30 text-muted-foreground'}`}>
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <span className={`text-xs whitespace-nowrap ${isDelivered ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'}`}>Delivered</span>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-300 dark:bg-sky-950/40 dark:text-sky-400 capitalize">
            {(order?.status || "Pending").toLowerCase().replace('_', ' ')}
          </span>
          <span className="text-xs text-muted-foreground font-medium">on {order?.createdAt || "N/A"}</span>
        </div>
      </Card>

      {/* Order Items Table Section */}
      <Card className="rounded-2xl border shadow-sm overflow-hidden print:shadow-none print:border">
        <div className="p-6 border-b print:p-4">
          <h3 className="text-base font-bold text-foreground">Ordered Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/30 text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-6">Quantity</th>
                <th className="py-3 px-6">Price</th>
                <th className="py-3 px-6 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y text-xs font-medium">
              {(order?.items || []).map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="h-12 w-12 rounded-xl object-cover border print:hidden" />
                      <span className="font-bold text-foreground text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-foreground font-semibold">{item.quantity}</td>
                  <td className="py-4 px-6 text-muted-foreground">{item.price}</td>
                  <td className="py-4 px-6 text-right font-bold text-foreground">{item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Footer Note for Print Invoice */}
      <div className="hidden print:block text-center pt-8 text-xs text-muted-foreground border-t mt-6">
        <p>Thank you for shopping with SHOP.CO! This is a computer-generated invoice.</p>
      </div>
    </div>
  );
}