import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const order = await prisma.order.create({
      data: json,
    });
    return new NextResponse(JSON.stringify(order), {
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
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    const whereClause: any = {
      AND: [],
    };

    if (search) {
      whereClause.AND.push({
        orderNumber: { contains: search, mode: "insensitive" },
      });
    }

    if (status) {
      whereClause.AND.push({
        status: status,
      });
    }

    const orders = await prisma.order.findMany({
      skip,
      take,
      where: whereClause,
      include: {
        user: true,
      },
    });

    return new NextResponse(JSON.stringify(orders), {
      status: 200,
      headers: { "Content-Type": "application/json" },
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
        JSON.stringify({ error: "Order ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return new NextResponse(
        JSON.stringify({ error: "Order not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: json.status,
      },
    });

    return new NextResponse(JSON.stringify(order), {
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
        const id = request.url.split('/').pop();

        if (!id) {
            return new NextResponse(JSON.stringify({ error: "Order ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingOrder = await prisma.order.findUnique({
            where: { id },
        });

        if (!existingOrder) {
            return new NextResponse(JSON.stringify({ error: "Order not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await prisma.order.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error(error);
        return new NextResponse(JSON.stringify({ error: error.message }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
