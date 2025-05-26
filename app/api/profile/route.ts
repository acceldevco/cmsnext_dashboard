import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    // Get user ID from request (you should implement proper authentication)
    const userId = "c709bb27-c7c7-459c-a49a-c337c69941ca"; // Temporary for testing

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        addresses: {
          select: {
            city: true,
            province: true,
            postalCode: true,
          },
        },
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new NextResponse(JSON.stringify(user), {
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
    // Get user ID from request (you should implement proper authentication)
    const userId = "c709bb27-c7c7-459c-a49a-c337c69941ca"; // Temporary for testing
    const json = await request.json();

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: json.firstName,
        lastName: json.lastName,
        email: json.email,
        phone: json.phone,
        // addresses: json.address,
        addresses: {
          updateMany: {
            where: {},
            data: {
              city: json.city,
              province: json.state,
              postalCode: json.zipCode,
            }
          }
        },
      },
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

export async function PATCH(request: Request) {
  try {
    // Get user ID from request (you should implement proper authentication)
    const userId = "c709bb27-c7c7-459c-a49a-c337c69941ca"; // Temporary for testing
    const json = await request.json();

    // Verify current password
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return new NextResponse(JSON.stringify({ error: 'User not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isPasswordValid = await bcrypt.compare(json.currentPassword, user.password);
    if (!isPasswordValid) {
      return new NextResponse(JSON.stringify({ error: 'Current password is incorrect' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Update password
    const hashedPassword = await bcrypt.hash(json.newPassword, 10);
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return new NextResponse(JSON.stringify({ message: 'Password updated successfully' }), {
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
