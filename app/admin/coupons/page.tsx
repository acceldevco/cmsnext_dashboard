"use client"

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

interface Coupon {
  id:          string;
  code:        string;
  description: string | null;
  discountType: string;
  discountValue: number;
  minOrder:    number | null;
  maxDiscount: number | null;
  startDate:   string;
  endDate:     string;
  usageLimit:  number | null;
  usedCount:   number;
  active:      boolean;
  createdAt:   string;
  updatedAt:   string;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState(0);
  const [minOrder, setMinOrder] = useState<number | null>(null);
  const [maxDiscount, setMaxDiscount] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [usageLimit, setUsageLimit] = useState<number | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    (async () => {
      const couponsData = await fetch("/api/coupon").then((res) => res.json());
      setCoupons(couponsData);
    })();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const newCoupon = {
      code,
      description,
      discountType,
      discountValue,
      minOrder,
      maxDiscount,
      startDate,
      endDate,
      usageLimit,
      active,
    };

    const response = await fetch("/api/coupon", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCoupon),
    });

    if (response.ok) {
      // Refresh the coupon list
      const couponsData = await fetch("/api/coupon").then((res) => res.json());
      setCoupons(couponsData);

      // Clear the form
      setCode("");
      setDescription("");
      setDiscountType("PERCENTAGE");
      setDiscountValue(0);
      setMinOrder(null);
      setMaxDiscount(null);
      setStartDate("");
      setEndDate("");
      setUsageLimit(null);
      setActive(true);
    } else {
      console.error("Failed to create coupon");
    }
  };

  return (
    <ContentLayout title="Coupons">
      <h2>Coupons Management</h2>

      <h3>Create New Coupon</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="code">Code</label>
            <input
              type="text"
              id="code"
              className="border rounded-md px-2 py-1 w-full"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              className="border rounded-md px-2 py-1 w-full"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="discountType">Discount Type</label>
            <select
              id="discountType"
              className="border rounded-md px-2 py-1 w-full"
              value={discountType}
              onChange={(e) => setDiscountType(e.target.value)}
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed</option>
            </select>
          </div>
          <div>
            <label htmlFor="discountValue">Discount Value</label>
            <input
              type="number"
              id="discountValue"
              className="border rounded-md px-2 py-1 w-full"
              value={discountValue}
              onChange={(e) => setDiscountValue(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="minOrder">Min Order</label>
            <input
              type="number"
              id="minOrder"
              className="border rounded-md px-2 py-1 w-full"
              value={minOrder || ""}
              onChange={(e) => setMinOrder(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="maxDiscount">Max Discount</label>
            <input
              type="number"
              id="maxDiscount"
              className="border rounded-md px-2 py-1 w-full"
              value={maxDiscount || ""}
              onChange={(e) => setMaxDiscount(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="startDate">Start Date</label>
            <input
              type="datetime-local"
              id="startDate"
              className="border rounded-md px-2 py-1 w-full"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="endDate">End Date</label>
            <input
              type="datetime-local"
              id="endDate"
              className="border rounded-md px-2 py-1 w-full"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="usageLimit">Usage Limit</label>
            <input
              type="number"
              id="usageLimit"
              className="border rounded-md px-2 py-1 w-full"
              value={usageLimit || ""}
              onChange={(e) => setUsageLimit(Number(e.target.value))}
            />
          </div>
          <div>
            <label htmlFor="active">Active</label>
            <input
              type="checkbox"
              id="active"
              className="border rounded-md px-2 py-1"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </div>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
          Create Coupon
        </button>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Discount Type</TableHead>
            <TableHead>Discount Value</TableHead>
            <TableHead>Min Order</TableHead>
            <TableHead>Max Discount</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Usage Limit</TableHead>
            <TableHead>Used Count</TableHead>
            <TableHead>Active</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.map((coupon) => (
            <TableRow key={coupon.id}>
              <TableCell className="font-medium">{coupon.id}</TableCell>
              <TableCell>{coupon.code}</TableCell>
              <TableCell>{coupon.description}</TableCell>
              <TableCell>{coupon.discountType}</TableCell>
              <TableCell>{coupon.discountValue}</TableCell>
              <TableCell>{coupon.minOrder}</TableCell>
              <TableCell>{coupon.maxDiscount}</TableCell>
              <TableCell>{coupon.startDate}</TableCell>
              <TableCell>{coupon.endDate}</TableCell>
              <TableCell>{coupon.usageLimit}</TableCell>
              <TableCell>{coupon.usedCount}</TableCell>
              <TableCell>{coupon.active ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ContentLayout>
  );
}
