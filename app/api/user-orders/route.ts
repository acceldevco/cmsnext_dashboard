import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/userData';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Fetch orders from database based on user ID
    // Replace this with your actual database query
    const orders = [
      { id: 1, date: '2025-05-20', status: 'Delivered', total: 100, items: [{ name: 'Product 1', quantity: 1, price: 100 }] },
      { id: 2, date: '2025-05-19', status: 'Pending', total: 50, items: [{ name: 'Product 2', quantity: 2, price: 25 }] },
    ];

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}
