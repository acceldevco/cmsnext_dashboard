import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const review = await prisma.review.create({
      data: json,
    });
    return new NextResponse(JSON.stringify(review), {
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

    const reviews = await prisma.review.findMany({
      skip,
      take,
    });

    const totalCount = await prisma.review.count();

    return new NextResponse(JSON.stringify({ reviews, totalCount }), {
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
            return new NextResponse(JSON.stringify({ error: "Review ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingReview = await prisma.review.findUnique({
            where: { id },
        });

        if (!existingReview) {
            return new NextResponse(JSON.stringify({ error: "Review not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const review = await prisma.review.update({
            where: { id },
            data: json,
        });

        return new NextResponse(JSON.stringify(review), {
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
            return new NextResponse(JSON.stringify({ error: "Review ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingReview = await prisma.review.findUnique({
            where: { id },
        });

        if (!existingReview) {
            return new NextResponse(JSON.stringify({ error: "Review not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await prisma.review.delete({
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
