import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const category = await prisma.category.create({
      data: json,
    });
    return new NextResponse(JSON.stringify(category), {
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
    // return new NextResponse(JSON.stringify(await prisma.category.findMany()), {
    //   status: 200,
    //   headers: { 'Content-Type': 'application/json' },
    // });
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    const id= searchParams.get('id')
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const categories = await prisma.category.findMany({
      skip,
      take,
      include: {
        children: true,
      }
    });

    return new NextResponse(JSON.stringify(categories), {
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
            return new NextResponse(JSON.stringify({ error: "Category ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return new NextResponse(JSON.stringify({ error: "Category not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const category = await prisma.category.update({
            where: { id },
            data: json,
        });

        return new NextResponse(JSON.stringify(category), {
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
            return new NextResponse(JSON.stringify({ error: "Category ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingCategory = await prisma.category.findUnique({
            where: { id },
        });

        if (!existingCategory) {
            return new NextResponse(JSON.stringify({ error: "Category not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await prisma.category.delete({
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
