import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    // images is required, so set it to an empty array if it's not provided
    if (!json.images) {
      json.images = [];
    }
    const product = await prisma.product.create({
      data: json,
    });
    return new NextResponse(JSON.stringify(product), {
      status: 201,
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const t =await prisma.product.findMany({
      where:{
        categoryId:searchParams.getAll("category")[0]
      }
    })
    console.log(t);
    
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);

    const skip = (page - 1) * pageSize;
    const take = pageSize;
    const search = searchParams.get("search") || "";
    const category = searchParams.getAll("category") || [];

    const minPrice = parseFloat(searchParams.get('minPrice') || '0');
    const maxPrice = parseFloat(searchParams.get('maxPrice') || '999999999');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const sortByField = sortBy === 'newest' ? 'createdAt' : sortBy;
    const inStock = searchParams.get('inStock') === 'true';
    const featured = searchParams.get('featured') === 'true';

    let whereClause: any = {
      AND: [
        {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        },
        {
          price: {
            gte: minPrice,
            lte: maxPrice
          }
        },
        inStock ? { stock: { gt: 0 } } : {},
        featured ? { featured: true } : {}
      ].filter(Boolean),
    };

    if (category.length > 0) {
      whereClause.AND.push({
        categoryId: {
          in: category
        }
      });
    }

    const products = await prisma.product.findMany({
      skip,
      take,
      where: whereClause,
      orderBy: {
        [sortByField]: sortOrder
      },
      include: {
        category: true,
        reviews: {
          select: {
            rating: true
          }
        },
        attributes: true
      }
    });

    const productsWithAvgRating = products.map((product: any) => ({
      ...product,
      averageRating: product.reviews.length > 0
        ? product.reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / product.reviews.length
        : null
    }));

    const totalProducts = await prisma.product.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalProducts / pageSize);

    const response = {
      products: productsWithAvgRating,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: totalProducts,
        pageSize
      }
    };

    return new NextResponse(JSON.stringify(response), {
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
        const id = request.url.split('/').pop();
        const json = await request.json();

        if (!id) {
            return new NextResponse(JSON.stringify({ error: "Product ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return new NextResponse(JSON.stringify({ error: "Product not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const product = await prisma.product.update({
            where: { id },
            data: json,
        });

        return new NextResponse(JSON.stringify(product), {
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
            return new NextResponse(JSON.stringify({ error: "Product ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingProduct = await prisma.product.findUnique({
            where: { id },
        });

        if (!existingProduct) {
            return new NextResponse(JSON.stringify({ error: "Product not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await prisma.product.delete({
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
