import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { generateToken } from '../../../lib/jwt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { email, password, firstName } = json;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email:email, 
        password: hashedPassword,
        firstName: firstName, // Assuming 'name' from request is the first name
        lastName: "Unknown", // Add default value for lastName
      },
    });

    const token = generateToken({ userId: user.id });
    
    
    return new NextResponse(JSON.stringify({ token }), {
      status: 201,
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
