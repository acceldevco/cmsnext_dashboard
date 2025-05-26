import { PrismaClient } from '@/generated/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { generateToken } from '@/lib/jwt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  console.log('hgfh');
  
  try {
    const json = await request.json();
    const { email, password } = json;
    console.log(json);
    
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid credentials' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid credentials' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const token = generateToken({ userId: user.id });

    return new NextResponse(JSON.stringify({ token }), {
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
