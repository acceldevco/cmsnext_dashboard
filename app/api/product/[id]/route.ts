import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

interface Params {
  params: { id: string }
}

export async function GET(request: Request, { params }: Params) {
  const prisma = new PrismaClient();
  const { id } = params;
  console.log(id);
  
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: id,
      }
      ,
    });
    // return NextResponse.json(product);
    if (!product) {
      return NextResponse.json(null, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error fetching product' }, { status: 500 });
  }
}
