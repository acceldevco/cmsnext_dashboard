import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const hashedPassword = await bcrypt.hash(json.password, 10);
    const user = await prisma.user.create({
      data: {
        ...json,
        password: hashedPassword,
      },
    });
    const token = generateToken({ userId: user.id });
    return new NextResponse(JSON.stringify({ user, token }), {
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
  console.log('dasd');
  
  // return new NextResponse('gfh')
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
    console.log(page,pageSize);
    

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const users = await prisma.user.findMany({
      skip,
      take,
    });

    return new NextResponse(JSON.stringify(users), {
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
            return new NextResponse(JSON.stringify({ error: "User ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const user = await prisma.user.update({
            where: { id },
            data: json,
        });

        return new NextResponse(JSON.stringify(user), {
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
            return new NextResponse(JSON.stringify({ error: "User ID is required" }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const existingUser = await prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            return new NextResponse(JSON.stringify({ error: "User not found" }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await prisma.user.delete({
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
