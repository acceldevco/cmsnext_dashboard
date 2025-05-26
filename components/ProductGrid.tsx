import React from "react";
import { ProductCard } from "./ProductCard";
import { Button } from "@/components/ui/button"; // Import Button component

interface Product {
  id: string;
  title: string;
  price: string;
  image: string;
  rating: number;
  reviews: { rating: number }[];
}

interface ProductGridProps {
  limit: number;
  columns: number;
  priceRange: { min: string; max: string };
  selectedCategories: string[];
  sortBy: string;
  sortOrder: string;
  searchQuery: string;
  products: any[];
  loading: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  limit = 8,
  columns = 4,
  priceRange,
  selectedCategories,
  sortBy,
  sortOrder,
  searchQuery,
  products,
  loading
}) => {
 
  const gridClasses = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className={`grid ${gridClasses[columns as keyof typeof gridClasses]} gap-6`}>
        {Array.isArray(products) &&
          products.map((product: any) => (
            <ProductCard key={product.id} {...product} />
          ))}
      </div>
    </div>
  );
};
