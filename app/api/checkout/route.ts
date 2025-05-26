import { PrismaClient, OrderStatus } from '@/generated/prisma';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const { userId, items, shippingAddress, paymentMethod, totalAmount } = json;

    // Create a new order
    const order = await prisma.order.create({
      data: {
        userId,
        status: 'PENDING' as OrderStatus,
        total: totalAmount,
        shippingAddress: {
          create: {
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            postalCode: shippingAddress.postalCode,
            country: shippingAddress.country
          }
        },
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        },
        paymentMethod,
        orderNumber: 'TEMP_ORDER_NUMBER',
        shippingMethod: 'TEMP_SHIPPING_METHOD',
        shippingCost: 0,
        subtotal: totalAmount,
        tax: 0,
        CouponId: "TEMP_COUPON_ID"
      },
      include: {
        items: true
      }
    });

    return new NextResponse(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return new NextResponse(JSON.stringify({ error: 'Order ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return new NextResponse(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new NextResponse(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Get order error:', error);
    return new NextResponse(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
