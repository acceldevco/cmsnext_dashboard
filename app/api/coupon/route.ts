import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const coupon = await prisma.coupon.create({
      data: {
        code: json.code,
        description: json.description,
        discountType: json.discountType,
        discountValue: json.discountValue,
        minOrder: json.minOrder,
        maxDiscount: json.maxDiscount,
        startDate: json.startDate,
        endDate: json.endDate,
        usageLimit: json.usageLimit,
        active: json.active,
      },
    });
    return new NextResponse(JSON.stringify(coupon), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function GET(request: Request) {
  try {
    const coupons = await prisma.coupon.findMany();
    return new NextResponse(JSON.stringify(coupons), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function PUT(request: Request) {
  try {
    const id = request.url.split("/").pop();
    const json = await request.json();

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Coupon ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return new NextResponse(
        JSON.stringify({ error: "Coupon not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        code: json.code,
        description: json.description,
        discountType: json.discountType,
        discountValue: json.discountValue,
        minOrder: json.minOrder,
        maxDiscount: json.maxDiscount,
        startDate: json.startDate,
        endDate: json.endDate,
        usageLimit: json.usageLimit,
        active: json.active,
      },
    });

    return new NextResponse(JSON.stringify(coupon), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const id = request.url.split("/").pop();

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Coupon ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingCoupon = await prisma.coupon.findUnique({
      where: { id },
    });

    if (!existingCoupon) {
      return new NextResponse(
        JSON.stringify({ error: "Coupon not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await prisma.coupon.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error(error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}
