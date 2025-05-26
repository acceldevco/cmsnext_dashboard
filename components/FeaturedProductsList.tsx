"use client";
import React, { useEffect, useState, startTransition } from 'react';
// import { regdbHandler } from '@/lib/regdb'; // Removed as it's no longer directly used
import { ProductCard } from './ProductCard';
import '../styles/snap-scroll.css';

const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

// تعریف نوع داده برای محصول، مطابق با مدل Prisma یا داده‌های بازگشتی
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  images: any; // یا نوع دقیق‌تر اگر مشخص است، مثلا string[]
  // سایر فیلدهای مورد نیاز برای ProductCard
  slug: string; // برای لینک به صفحه محصول
  discountPrice?: number | null;
  rating?: number; // اگر ProductCard از rating استفاده می‌کند
}

interface FeaturedProductsListProps {
  title?: string;
  count?: number;
}

// تابع برای واکشی محصولات از API با متد FIND
async function fetchFeaturedProductsAPI(count: number): Promise<{ items: Product[]; error: string | null }> {
  try {
    const queryParams = new URLSearchParams({ modelName: "Product", action: "find" });
    const response = await fetch(`/api/global?${queryParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ // This is the 'data' that route.ts's FIND function will parse
        // This body is passed as 'data' to regdbHandler with method: 'FIND'
        options:{
          pageSize: count
        }
       ,
        where: { featured: true, published: true },
        orderBy: { createdAt: "desc" },
      }),
    });

    if (!response.ok) {
      let errorMsg = `HTTP error! status: ${response.status}`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (parseError) {
        // If response is not JSON or empty
        errorMsg = `${errorMsg} - ${response.statusText}`;
      }
      return { items: [], error: errorMsg };
    }

    const result = await response.json();

    if (result.error) {
      return { items: [], error: result.error };
    }
    // API returns the direct result of regdbHandler, which includes an 'items' array.
    return { items: (result.items as Product[]) || [], error: null };

  } catch (e: any) {
    console.error("Error fetching featured products via API:", e);
    return { items: [], error: e.message || "خطا در واکشی محصولات از API" };
  }
}

export const FeaturedProductsList: React.FC<FeaturedProductsListProps> = ({ title, count = 10 }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      startTransition(async () => {
        const result = await fetchFeaturedProductsAPI(count); // Changed to call new API function
        if (result.error) {
          setError(result.error);
          setProducts([]);
        } else {
          setProducts(result.items);
        }
        setLoading(false);
      });
    };

    fetchProducts();
  }, [count]);

  if (loading) {
    return (
      <div className="featured-products-list p-4">
        {title && <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>}
        <p className="text-center">در حال بارگذاری محصولات...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="featured-products-list p-4">
        {title && <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>}
        <p className="text-center text-red-500">خطا: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="featured-products-list p-4">
        {title && <h2 className="text-2xl font-bold mb-4 text-center">{title}</h2>}
        <p className="text-center">محصول ویژه‌ای برای نمایش یافت نشد.</p>
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
    <div className="featured-products-list p-4">
      <div className="flex items-center justify-between mb-4">
        {title && <h2 className="text-2xl font-bold text-center">{title}</h2>}
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
                id={product.id}
                title={product.name}
                price={product.price.toString()} // تبدیل قیمت به رشته اگر ProductCard انتظار رشته دارد
                // اطمینان حاصل کنید که ProductCard از اولین تصویر در images استفاده می‌کند یا منطق مناسبی دارد
                image={
                  Array.isArray(product.images) && product.images.length > 0
                    ? isValidUrl(product.images[0]) ? product.images[0] : null
                    : typeof product.images === 'string'
                      ? isValidUrl(product.images) ? product.images : null
                      : null
                }
                rating={product.rating || 0}
                // slug={product.slug} // اگر ProductCard از slug برای لینک استفاده می‌کند
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
