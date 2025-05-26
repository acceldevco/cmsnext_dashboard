"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function OrdersPage({ initialUser }: any) {
  let orders, isLoading, error;
  try {    
    orders = initialUser;
    isLoading = false;
    error = null;
  } catch (e) {
    console.error("Error processing initialUser:", e);
    orders = null;
    isLoading = false;
    error = e;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error loading orders</div>;
  }

  if (!orders?.length) {
    return <div>No orders found</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Orders</h1>
      {orders.orders.map((order: any) => (
        <Card key={order.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order #{order.id}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {new Date(order.date).toLocaleDateString()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Status</div>
                  <div className={`text-sm ${order.status === 'Delivered' ? 'text-green-600' : 'text-blue-600'}`}>
                    {order.status}
                  </div>
                </div>
                <div>
                  <div className="font-medium">Total</div>
                  <div className="text-sm">${order.total.toFixed(2)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="font-medium mb-2">Items</div>
                <div className="space-y-2">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        {item.name} x {item.quantity}
                      </div>
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" size="sm">Track Order</Button>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
