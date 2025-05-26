"use client";

import React, { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";

interface Product {
  id: string | number;
  name: string;
  image?: string;
  price: number;
  salePrice?: number;
  discount?: number;
  rating?: number;
}

function ProductsAmazing() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAmazingProducts() {
      try {
        const response = await fetch("/api/global?modelName=Product");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result && Array.isArray(result.items)) {
          setProducts(result.items.slice(0, 4));
        } else if (Array.isArray(result)) {
          setProducts(result.slice(0, 4));
        } else {
          setProducts([]);
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAmazingProducts();
  }, []);

  if (loading) {
    return <div className="px-8 py-8 text-center text-lg font-medium">Loading amazing products...</div>;
  }
  if (error) {
    return <div className="px-8 py-8 text-center text-red-500">Error loading products: {error}</div>;
  }
  if (products.length === 0) {
    return <div className="px-8 py-8 text-center text-gray-500">No amazing products to display.</div>;
  }

  return (
    <section className="w-full py-8 px-2 md:px-8">
      <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-r from-indigo-100 via-white to-pink-100 shadow-lg p-4 md:p-8 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => {
            const displayPrice = product.salePrice ? product.salePrice : product.price;
            const formattedPrice = `$${displayPrice.toLocaleString("en-US")}`;
            return (
              <div key={product.id} className="w-full">
                <ProductCard
                  id={String(product.id)}
                  title={product.name}
                  price={formattedPrice}
                  image={product.image || null}
                  rating={product.rating || 4}
                />
              </div>
            );
          })}
        </div>
        <aside className="w-full md:w-1/4 flex flex-col items-center justify-center bg-white/80 rounded-2xl shadow p-4 min-h-[180px]">
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Special Offers</h2>
          <p className="text-gray-600 text-center">Check out our amazing deals and discounts!</p>
        </aside>
      </div>
    </section>
  );
}

export default ProductsAmazing;