'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Import useParams
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { ProductGrid } from '@/components/ProductGrid'; // Assuming ProductGrid component exists
// import { ProductCard } from '@/components/ProductCard';
interface Category {
    id: string;
    name: string;
    // imageUrl?: string;
}

// Assuming a Product interface exists
interface Product {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    // Add other relevant product fields
}

// Update component props to accept specific server actions
function CategoryDetailPage({
    getCategory,           // Function to fetch category details
    getProductsByCategory  // Function to fetch products for the category
}: {
    getCategory: (id: string) => Promise<Category | null>;
    getProductsByCategory: (categoryId: string) => Promise<Product[]>;
}) {
    const params = useParams();
    const categoryId = params.id as string; // Get category ID from URL

    const [category, setCategory] = useState<Category | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingCategory, setLoadingCategory] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!categoryId) return; // Don't fetch if ID is not available yet

        async function loadData() {
            setLoadingCategory(true);
            setLoadingProducts(true);
            setError(null);
            try {
                // Fetch category details using the passed server action
                const categoryData = await getCategory(categoryId);
                setCategory(categoryData);
                setLoadingCategory(false); // Set loading false after category is fetched

                // Fetch products using the passed server action
                const productsData = await getProductsByCategory(categoryId);
                // Assuming getProductsByCategory returns the array directly
                setProducts(productsData || []);
                console.log(productsData);
                

            } catch (e: any) {
                console.error('Failed to fetch data:', e);
                setError(e.message || 'An unexpected error occurred.');
                // Ensure loading states are false even on error
                setLoadingCategory(false);
            } finally {
                // Ensure product loading is always set to false at the end
                setLoadingProducts(false);
            }
        }

        loadData();

    }, [categoryId, getCategory, getProductsByCategory]); // Add dependencies

    // Combined loading state
    const isLoading = loadingCategory || loadingProducts;

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                {/* Skeleton for title */}
                <Skeleton className="h-8 w-1/4 mb-6" />
                {/* Skeleton for product grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-40 w-full mb-4" /> {/* Image Skeleton */}
                                <Skeleton className="h-6 w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-4 w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        Failed to load category details or products: {error}
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="container mx-auto px-4 py-8">
                <p>Category not found.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Display category name as title */}
            <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
            {products.length === 0 ? (
                <p>No products found in this category.</p>
            ) : (
               
                // Use ProductGrid component to display products
                // Pass the products array directly
                <ProductGrid products={products.items} />
                // <>{products.items.map((d)=><>{d.id}</>)}</>
            )}
        </div>
    );
}

export default CategoryDetailPage; // Export the renamed component