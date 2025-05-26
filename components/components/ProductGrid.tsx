import React from "react";
import { ProductCard } from "../ProductCard";

interface ProductGridProps {
  collectionId: string;
  limit: number;
  columns: number;
}

// Mock data - در پروژه واقعی از API استفاده کنید
const mockProducts = [
  {
    id: "1",
    title: "Premium Headphones",
    price: "$199.99",
    image: "/headphones.jpg",
    rating: 5,
  },
  {
    id: "2",
    title: "Wireless Earbuds",
    price: "$129.99",
    image: "/earbuds.jpg",
    rating: 4,
  },
  {
    id: "3",
    title: "Bluetooth Speaker",
    price: "$89.99",
    image: "/speaker.jpg",
    rating: 4,
  },
  {
    id: "4",
    title: "Smart Watch",
    price: "$249.99",
    image: "/watch.jpg",
    rating: 5,
  },
  {
    id: "5",
    title: "Fitness Tracker",
    price: "$79.99",
    image: "/tracker.jpg",
    rating: 4,
  },
  {
    id: "6",
    title: "Laptop Backpack",
    price: "$49.99",
    image: "/backpack.jpg",
    rating: 5,
  },
  {
    id: "7",
    title: "Wireless Charger",
    price: "$29.99",
    image: "/charger.jpg",
    rating: 3,
  },
  {
    id: "8",
    title: "Noise Cancelling Headphones",
    price: "$299.99",
    image: "/noise-cancelling.jpg",
    rating: 5,
  },
];

export const ProductGrid: React.FC<ProductGridProps> = ({
  collectionId,
  limit = 8,
  columns = 4,
}) => {
  // در پروژه واقعی، محصولات را بر اساس collectionId از API دریافت کنید
  const products = mockProducts.slice(0, limit);

  const gridClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  return (
    <div className="container mx-auto py-8">
      <div className={`grid ${gridClasses[columns as keyof typeof gridClasses]} gap-6`}>
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
    </div>
  );
};