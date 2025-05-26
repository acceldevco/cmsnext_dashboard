"use client";

import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useGlobalContext } from "../../context/GlobalContext"; // Added import

interface Order {
  id:               string;
  userId:           string;
  CouponId:         string;
  orderNumber:      string;
  shippingAddress:  any;
  billingAddress:   any | null;
  paymentMethod:    string;
  paymentStatus:    string;
  paymentId:        string | null;
  shippingMethod:   string;
  shippingCost:     number;
  subtotal:         number;
  tax:              number;
  total:            number;
  status:           string;
  trackingNumber:   string | null;
  notes:            string | null;
  createdAt:        string;
  updatedAt:        string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface OrderRowProps {
  order: Order;
  onUpdate: (updatedOrder: Order) => void; // Added for updating the list
}

function OrderRow({ order, onUpdate }: OrderRowProps) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(order.status);

  const handleSave = async () => {
    // Call API to update order
    const response = await fetch(`/api/orders/${order.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (response.ok) {
      const updatedOrder = await response.json();
      // Update the order in the list
      console.log("Order updated successfully");
      onUpdate(updatedOrder); // Call onUpdate to refresh the list in parent
      setOpen(false);
    } else {
      console.error("Failed to update order");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TableRow key={order.id}>
        <TableCell className="font-medium">{order.id}</TableCell>
        <TableCell>{order.orderNumber}</TableCell>
        <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
        <TableCell>{order.total}</TableCell>
        <TableCell>{order.status}</TableCell>
        <TableCell>{order.user.firstName}</TableCell>
        <TableCell>{order.user.lastName}</TableCell>
        <TableCell>{order.user.email}</TableCell>
        <TableCell>
          <DialogTrigger asChild>
            <Button variant="outline">Edit</Button>
          </DialogTrigger>
        </TableCell>
      </TableRow>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
          <DialogDescription>
            Edit the order details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="status">Status</label>
            <input
              type="text"
              id="status"
              defaultValue={order.status}
              className="border rounded-md px-2 py-1"
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}

export default function OrdersPage({
  get,
  deleted,
  update,
  create
}:any) {
  const { globalState, setGlobalState, handleFetchList, handleSearchChange, applyFilter } = useGlobalContext(); // Use GlobalContext
  const { listData: orders, searchTerm, filterOptions, isLoading } = globalState; // Added isLoading
  const statusFilter = filterOptions.status || "";
  useEffect(() => {
    const fetchOrders = async () => {
      setGlobalState(prev => ({ ...prev, isLoading: true })); // Set loading true
      try {
        // await handleFetchList(async (page, limit, search, filters) => {
        //   // Adapt the 'get' function to match the signature expected by handleFetchList
        //   // Assuming 'get' can take search and statusFilter directly
          const result = await get(searchTerm, statusFilter); // Pass searchTerm and statusFilter if your 'get' function supports it
          console.log(result);
          setGlobalState(prevState => ({
            ...prevState,
            listData: result.items,
            isLoading: false, // Set loading false
          }));
          console.log(globalState);
          
          // return { data: result.items, totalItems: result.totalCount || result?.items?.length }; // Adjust if 'get' returns total count
        // });
      } catch (error) {
        console.error("Failed to fetch orders:", error);
        setGlobalState(prevState => ({ ...prevState, isLoading: false })); // Set loading false on error
      }
    };
    fetchOrders();
  }, [
    searchTerm,
    statusFilter, // Add statusFilter to dependency array if it's used in get
    // filterOptions, // filterOptions might be too broad, consider specific filter values if possible
    // handleFetchList, // If handleFetchList is stable, it might not be needed here or wrap fetchOrders in useCallback
    get,
    setGlobalState // Added setGlobalState to dependencies
  ]);

  return (
    <ContentLayout title="Orders">
      <div className="flex justify-between items-center mb-4">
        <h2>Orders</h2>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search Order Number"
            className="border rounded-md px-2 py-1 mr-2"
            value={searchTerm}
            onChange={handleSearchChange} // Use handleSearchChange from context
          />
          <select
            className="border rounded-md px-2 py-1"
            value={statusFilter} // Use statusFilter from context
            onChange={(e) => applyFilter("status", e.target.value)} // Use applyFilter from context
          >
            <option value="">All Statuses</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Order Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Edit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders && orders.length > 0 ? (
            orders.map((order: Order, i: number) => (
              <OrderRow 
                order={order} 
                key={order.id || i} 
                onUpdate={(updatedOrder) => {
                  // Find and update the order in the local state
                  setGlobalState(prevState => ({
                    ...prevState,
                    listData: prevState.listData.map(o => o.id === updatedOrder.id ? updatedOrder : o)
                  }));
                }}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                {isLoading ? "Loading orders..." : "No orders found."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ContentLayout>
  );
}
