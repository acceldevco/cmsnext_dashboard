import { NextResponse } from "next/server";
import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  console.log(await prisma.category.findFirst());
  
  try {
    const categories = await prisma.category.findMany({
      skip: 0,
      take: 10,
      include: {
        children: true,
      },
    });
    return NextResponse.json(categories);
  } catch (error) {
    // console.error(error);
    return NextResponse.json(
      { message: "Could not fetch categories" },
      { status: 500 }
    );
  }
}
