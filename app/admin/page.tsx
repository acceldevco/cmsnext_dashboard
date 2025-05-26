"use client"
import { ContentLayout } from "@/components/admin-panel/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const initialSalesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Monthly Sales',
      data: [3000, 3500, 4000, 3800, 4200, 4500],
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Sales Trend',
    },
  },
};

interface DashboardData {
  users: number;
  products: number;
  orders: number;
  categories: number;
  reviews: number;
  newUsers: number;
  lowStockProducts: number;
  totalRevenue: number;
  averageRating: number;
  recentSales: number;
  monthlyGrowth: number;
  pendingOrders: number;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
}

export default function Page() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [salesChartData, setSalesChartData] = useState(initialSalesData);

  useEffect(() => {
    (async () => {
      try {
        const [usersResponse, productsResponse, ordersResponse, categoriesResponse, reviewsResponse] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/product'),
          fetch('/api/orders'),
          fetch('/api/category'),
          fetch('/api/review'),
        ]);

        if (!usersResponse.ok || !productsResponse.ok || !ordersResponse.ok || !categoriesResponse.ok || !reviewsResponse.ok) {
          console.error('Failed to fetch data');
          // Optionally, set an error state here to display to the user
          return;
        }

        const parseJsonResponse = async (response: Response, fallback: any = []) => {
          if (!response.ok) {
            console.error(`API request failed with status: ${response.status} for ${response.url}`);
            // Check if the response is HTML (e.g., a redirect to login page)
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/html')) {
              console.error('Received HTML response instead of JSON. This might be due to an authentication issue or redirect.');
              // Potentially trigger a redirect to login or show a specific error message
            }
            return fallback; // Return fallback for non-OK responses
          }
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          }
          console.error(`Invalid content type: ${contentType} for ${response.url}. Expected application/json.`);
          return fallback; // Return fallback for non-JSON responses
        };

        const [users, products, ordersData, categories, reviews] = await Promise.all([
          parseJsonResponse(usersResponse, []),
          parseJsonResponse(productsResponse, { products: [] }), // Assuming products endpoint returns { products: [...] }
          parseJsonResponse(ordersResponse, []),
          parseJsonResponse(categoriesResponse, []),
          parseJsonResponse(reviewsResponse, { reviews: [] }), // Assuming reviews endpoint returns { reviews: [...] }
        ]);

      const totalRevenue = ordersData && Array.isArray(ordersData) ? ordersData.reduce((sum: number, order: any) => sum + (order.amount || 0), 0) : 0;
    
      const lowStock = products && products.products && Array.isArray(products.products) ? products.products.filter((product: any) => product.stock < 10).length : 0;
      const pendingOrders = ordersData && Array.isArray(ordersData) ? ordersData.filter((order: any) => order.status === 'pending').length : 0;
      
      setData({
        users: users && Array.isArray(users) ? users.length : 0,
        products: products && products.products && Array.isArray(products.products) ? products.products.length : 0,
        orders: ordersData && Array.isArray(ordersData) ? ordersData.length : 0,
        categories: categories && Array.isArray(categories) ? categories.length : 0,
        reviews: reviews && Array.isArray(reviews) ? reviews.length : 0,
        newUsers: users && Array.isArray(users) ? users.filter((user: any) => {
          const createdAt = new Date(user.createdAt);
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return createdAt >= thirtyDaysAgo;
        }).length : 0,
        lowStockProducts: lowStock,
        totalRevenue: totalRevenue,
        averageRating: reviews && reviews.reviews && Array.isArray(reviews.reviews) && reviews.reviews.length > 0 ? reviews.reviews.reduce((sum: number, review: any) => sum + (review.rating || 0), 0) / reviews.reviews.length : 0,
        recentSales: ordersData && Array.isArray(ordersData) ? ordersData.filter((order: any) => {
          const orderDate = new Date(order.date);
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return orderDate >= sevenDaysAgo;
        }).length : 0,
        monthlyGrowth: 15, // Example value, calculate based on your needs
        pendingOrders: pendingOrders,
      });

      setOrders(ordersData && Array.isArray(ordersData) ? ordersData : []);

      // Process ordersData for chart
      if (ordersData && Array.isArray(ordersData)) {
        const monthlySales: { [key: string]: number } = {};
        ordersData.forEach((order: Order) => {
          try {
            const date = new Date(order.date);
            const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            if (order.amount) {
                monthlySales[monthYear] = (monthlySales[monthYear] || 0) + order.amount;
            }
          } catch (e) {
            console.error("Error processing order date for chart: ", order, e);
          }
        });

        const sortedMonths = Object.keys(monthlySales).sort((a, b) => {
            const [aMonth, aYear] = a.split(' ');
            const [bMonth, bYear] = b.split(' ');
            const dateA = new Date(`${aMonth} 1, ${aYear}`);
            const dateB = new Date(`${bMonth} 1, ${bYear}`);
            return dateA.getTime() - dateB.getTime();
        });

        const chartLabels = sortedMonths;
        const chartDatasetData = sortedMonths.map(month => monthlySales[month]);

        setSalesChartData({
          labels: chartLabels,
          datasets: [
            {
              label: 'Monthly Sales',
              data: chartDatasetData,
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        });
      }
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        // Optionally, set an error state here to display to the user
        setData(null); // Or some default error state
        setOrders([]);
    }
    })();
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
  
    <ContentLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
              <CardDescription>Overall earnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${data.totalRevenue.toLocaleString()}</div>
              <p className="text-sm text-green-600">+{data.monthlyGrowth}% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>Last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.recentSales}</div>
              <p className="text-sm text-muted-foreground">orders</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Orders</CardTitle>
              <CardDescription>Awaiting processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.pendingOrders}</div>
              <p className="text-sm text-muted-foreground">orders to process</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Low Stock</CardTitle>
              <CardDescription>Products to restock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.lowStockProducts}</div>
              <p className="text-sm text-red-600">products below threshold</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <Line options={options} data={salesChartData} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
              <CardDescription>Overall performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Total Users</p>
                    <p className="text-2xl font-bold">{data.users}</p>
                    <p className="text-sm text-muted-foreground">+{data.newUsers} new this month</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Average Rating</p>
                    <p className="text-2xl font-bold">{data.averageRating.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">from {data.reviews} reviews</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Products</p>
                    <p className="text-2xl font-bold">{data.products}</p>
                    <p className="text-sm text-muted-foreground">in {data.categories} categories</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total Orders</p>
                    <p className="text-2xl font-bold">{data.orders}</p>
                    <p className="text-sm text-muted-foreground">lifetime orders</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>A list of recent orders</CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.date}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </ContentLayout>
  

  );
}
