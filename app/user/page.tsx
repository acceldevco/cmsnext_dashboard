import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function UserDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome back, User!</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-sm text-muted-foreground">Total Orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wishlist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">Saved Items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-sm text-muted-foreground">Product Reviews</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((order) => (
              <div key={order} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div className="font-medium">Order #{order}</div>
                  <div className="text-sm text-muted-foreground">Placed on {new Date().toLocaleDateString()}</div>
                </div>
                <div className="text-sm font-medium text-green-600">Delivered</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}