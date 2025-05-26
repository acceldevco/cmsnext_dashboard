import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

interface Params {
  params: { id: string }
}

export async function GET(request: Request, { params }: Params) {
  const prisma = new PrismaClient();
  const { id } = await params;

  try {
    const reviews = await prisma.review.findMany({
      where: {
        productId: id,
      },
      include: {
        user: {
          select: {
            firstName: true,
          },
        },
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching reviews' }, { status: 500 });
  }
}
