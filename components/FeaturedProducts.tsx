import React, { useEffect, useState, useRef } from "react";
import { ProductCard } from "./ProductCard";
import '../styles/snap-scroll.css';

interface Product {
  id: string;
  title: string; // Assuming API returns 'name', will map to 'title'
  price: string | number;
  image: string;
  rating: number;
  name?: string; // To accommodate API response directly
}

interface FeaturedProductsProps {
  title: string;
  productIds: string[];
}

export const FeaturedProducts: React.FC<FeaturedProductsProps> = ({
  title,
  productIds,
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!productIds || productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const productPromises = productIds.map(async (id) => {
          const response = await fetch(`/api/global?modelName=Product&id=${id}`);
          if (!response.ok) {
            // Try to get error message from response body
            const errorData = await response.json().catch(() => null);
            throw new Error(
              `Failed to fetch product ${id}: ${response.status} ${response.statusText} ${errorData ? `- ${errorData.error}` : ''}`
            );
          }
          const data = await response.json();
          // Map API's 'name' to 'title' if 'name' exists and 'title' doesn't
          return { ...data, title: data.name || data.title } as Product;
        });

        const fetchedProducts = await Promise.all(productPromises);
        setProducts(fetchedProducts.filter(p => p)); // Filter out any nulls if a fetch failed gracefully before error
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred while fetching products.");
        }
        console.error("Error fetching featured products:", err);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [productIds]);

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <p>No products found.</p>
      </div>
    );
  }

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex space-x-2">
          <button 
            onClick={scrollLeft}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors nav-button"
            aria-label="اسکرول به چپ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            onClick={scrollRight}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors nav-button"
            aria-label="اسکرول به راست"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      <div className="relative w-full overflow-x-auto pb-4">
        <div 
          ref={scrollContainerRef}
          className="flex snap-x snap-mandatory overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-hide gap-4 smooth-scroll"
        >
          {products.map((product) => (
            <div key={product.id} className="snap-start flex-shrink-0 w-64 md:w-72 lg:w-80">
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title || product.name || 'Unnamed Product'} // Ensure title is present
                price={String(product.price)} // Convert price to string
                image={product.image || '/placeholder.jpg'} // Provide a fallback image
                rating={product.rating || 0} // Provide a fallback rating
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
