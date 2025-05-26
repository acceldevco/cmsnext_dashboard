"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/ProductGrid";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import InfiniteScroll from 'react-infinite-scroll-component';

interface Category {
  id: string;
  name: string;
}

interface ProductsPageProps {
  categories: Category[];
  products: any[]; // This will be the initial batch of products
}

const ITEMS_PER_PAGE = 5;

export default function ProductsPage({ categories, products: initialProducts }: ProductsPageProps) {
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [displayedProducts, setDisplayedProducts] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>(initialProducts); // Store all products for client-side filtering
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Effect to update allProducts when initialProducts change (e.g., SSR)
  useEffect(() => {
    setAllProducts(initialProducts);
    setDisplayedProducts(initialProducts.slice(0, ITEMS_PER_PAGE));
    setHasMore(initialProducts.length > ITEMS_PER_PAGE);
    setPage(1); // Reset page on initial load or when initialProducts change
  }, [initialProducts]);

  // Effect to re-filter and re-paginate when filters or sort change
  useEffect(() => {
    setLoading(true);
    let filtered = [...allProducts];

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(product => selectedCategories.includes(product.categoryId));
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(product => product.price >= parseFloat(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(product => product.price <= parseFloat(priceRange.max));
    }

    // Search query filter
    if (searchQuery) {
      filtered = filtered.filter(product => product.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Sorting
    filtered.sort((a, b) => {
      if (sortBy === 'price') {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
      } else if (sortBy === 'createdAt') {
        // Assuming createdAt is a string that can be compared or a Date object
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
      }
      return 0;
    });

    setDisplayedProducts(filtered.slice(0, ITEMS_PER_PAGE));
    setHasMore(filtered.length > ITEMS_PER_PAGE);
    setPage(1); // Reset page to 1
    setLoading(false);
  }, [selectedCategories, priceRange, searchQuery, sortBy, sortOrder, allProducts]);

  const fetchMoreData = () => {
    if (displayedProducts.length >= allProducts.length) {
      setHasMore(false);
      return;
    }
    // Simulate API call or fetch next page from allProducts
    setLoading(true);
    setTimeout(() => {
      const nextPage = page + 1;
      const newProducts = allProducts.slice(0, nextPage * ITEMS_PER_PAGE);
      setDisplayedProducts(newProducts);
      setPage(nextPage);
      if (newProducts.length >= allProducts.length) {
        setHasMore(false);
      }
      setLoading(false);
    }, 500); // Simulate network delay
  };

  const sortOptions = [
    { value: "createdAt", order: "desc", label: "Newest" },
    { value: "price", order: "asc", label: "Price: Low to High" },
    { value: "price", order: "desc", label: "Price: High to Low" },
  ];

  const handleSortChange = (value: string, order: string) => {
    setSortBy(value);
    setSortOrder(order);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/4 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow text-left">
            <h3 className="text-lg font-semibold mb-4">Search</h3>
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Price Range</h3>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Min"
                value={priceRange.min}
                onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                className="w-1/2"
              />
              <Input
                type="number"
                placeholder="Max"
                value={priceRange.max}
                onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                className="w-1/2"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <div className="space-y-2">
              {categories && categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category.id} className="flex items-center">
                    <Checkbox
                      id={category.id}
                      checked={selectedCategories.includes(category.id)}
                      onCheckedChange={(checked) => {
                        setSelectedCategories(prev =>
                          checked
                            ? [...prev, category.id]
                            : prev.filter((id) => id !== category.id)
                        );
                      }}
                    />
                    <label
                      htmlFor={category.id}
                      className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {category.name}
                    </label>
                  </div>
                ))
              ) : (
                <div>No categories found.</div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Sort By</h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <Button
                  key={`${option.value}-${option.order}`}
                  variant={sortBy === option.value && sortOrder === option.order ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => handleSortChange(option.value, option.order)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="w-full md:w-3/4">
          <InfiniteScroll
            dataLength={displayedProducts.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading...</h4>} // You can customize this loader
            // endMessage={
            //   <p style={{ textAlign: 'center' }}>
            //     <b>Looks like you have reached the end!</b>
            //   </p>
            // }
            // scrollThreshold="200px" // Optional: Adjust when to trigger next load
          >
            <ProductGrid
              // limit={ITEMS_PER_PAGE} // No longer needed here as InfiniteScroll handles it
              columns={3}
              // priceRange={priceRange} // Filtering is done before passing to ProductGrid
              // selectedCategories={selectedCategories} // Filtering is done before passing to ProductGrid
              // sortBy={sortBy} // Sorting is done before passing to ProductGrid
              // sortOrder={sortOrder} // Sorting is done before passing to ProductGrid
              // searchQuery={searchQuery} // Filtering is done before passing to ProductGrid
              products={displayedProducts} // Pass the currently displayed products
              loading={loading && displayedProducts.length === 0} // Show loading only if no products are displayed yet
            />
          </InfiniteScroll>
        </div>
      </div>
    </div>
  );
}
