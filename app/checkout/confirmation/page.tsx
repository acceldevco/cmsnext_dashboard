'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  status: string;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  orderItems: OrderItem[];
}

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/checkout?orderId=${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError('Could not load order details');
        console.error('Error fetching order:', err);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold text-red-500 mb-4">Error</h1>
          <p>{error}</p>
          <Link href="/">
            <Button className="mt-4">Return to Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your purchase</p>
          <p className="text-sm text-gray-500">Order ID: {order.id}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="space-y-2">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/user/orders">
            <Button>View All Orders</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}