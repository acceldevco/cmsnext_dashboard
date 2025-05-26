// ... existing code ...

import Link from "next/link";

async function getProduct(id: string) {
  // Construct the absolute URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Fallback for safety
  const res = await fetch(`${baseUrl}/api/product/${id}`);

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    // throw new Error('Failed to fetch product data');
    // Return null or a specific error object if you want to handle it differently
    return null;
  }

  return res.json();
}

// You might have other fetch calls (e.g., for reviews), update them similarly
async function getReviews(productId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  // Example: Update this fetch call as well if it exists
  const res = await fetch(`${baseUrl}/api/reviews?productId=${productId}`);
  if (!res.ok) {
    return []; // Or handle error appropriately
  }
  return res.json();
}


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  // const reviews = await getReviews(params.id); // Example if you fetch reviews

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-gray-600">Sorry, we couldn't find the product you're looking for.</p>
        <Link href="/products" className="mt-6 inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Back to Products
        </Link>
      </div>
    );
  }

  // ... rest of your component using the product data ...
}