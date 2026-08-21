import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany({
      include: {
        usages: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const now = new Date();

    const formattedCoupons = coupons.map((cpn) => {
      let status = "Active";
      let statusColor = "bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400";

      if (!cpn.isActive) {
        status = "Inactive";
        statusColor = "bg-muted text-muted-foreground border-border";
      } else if (cpn.expiresAt && new Date(cpn.expiresAt) < now) {
        status = "Expired";
        statusColor = "bg-muted text-muted-foreground border-border";
      } else if (cpn.startsAt && new Date(cpn.startsAt) > now) {
        status = "Scheduled";
        statusColor = "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-400";
      }

      const valNumber = Number(cpn.discountValue);
      let formattedValue = `$${valNumber.toFixed(2)} OFF`;
      
      if (cpn.discountType === 'PERCENTAGE') {
        formattedValue = `${valNumber}% OFF`;
      }

      const usageCount = cpn.usages.length;
      const maxLimit = cpn.usageLimit !== null ? cpn.usageLimit : '∞';

      return {
        id: `CPN-${cpn.id.slice(-4).toUpperCase()}`,
        dbId: cpn.id,
        code: cpn.code,
        title: `Discount Offer (${cpn.discountType})`,
        type: cpn.discountType,
        rawDiscountValue: valNumber, // <-- Yeh add kiya hai calculation ke liye
        value: formattedValue,
        usage: `${usageCount} / ${maxLimit}`,
        status: status,
        statusColor: statusColor,
        expiry: cpn.expiresAt 
          ? new Date(cpn.expiresAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) 
          : "No Expiry",
      };
    });

    return NextResponse.json({ success: true, data: formattedCoupons });
  } catch (error) {
    console.error("Error fetching coupons:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { code, discountType, discountValue, usageLimit, expiresAt } = body;

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType, 
        discountValue: parseFloat(discountValue),
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: newCoupon });
  } catch (error: any) {
    console.error("Error creating coupon:", error);
    if (error.code === 'P2002') {
      return NextResponse.json({ success: false, error: "Coupon code already exists!" }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}