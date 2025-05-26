import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const cart = await prisma.cart.create({
      data: json,
    });
    return new NextResponse(JSON.stringify(cart), {
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

    const carts = await prisma.cart.findMany({
      skip,
      take,
    });

    return new NextResponse(JSON.stringify(carts), {
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
        const id = request.url.split('/').pop();
        const json = await request.json();

        if (!id) {
            return new NextResponse(JSON.stringify({ error: "Cart ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingCart = await prisma.cart.findUnique({
            where: { id },
        });

        if (!existingCart) {
            return new NextResponse(JSON.stringify({ error: "Cart not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const cart = await prisma.cart.update({
            where: { id },
            data: json,
        });

        return new NextResponse(JSON.stringify(cart), {
            status: 200,
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


export async function DELETE(request: Request) {
    try {
        const id = request.url.split('/').pop();

        if (!id) {
            return new NextResponse(JSON.stringify({ error: "Cart ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingCart = await prisma.cart.findUnique({
            where: { id },
        });

        if (!existingCart) {
            return new NextResponse(JSON.stringify({ error: "Cart not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await prisma.cart.delete({
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
