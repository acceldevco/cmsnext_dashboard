
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// interface Props {
//   pageId: string; // Changed from params: { id: string }
//   get: any; // Keep other props as they are
//   deleted: any;
//   update: any;
//   create: any;
// }

async function SinPage({ pageId, get, deleted, update, create, find }: any) { // Destructure pageId directly
  // const id = pageId; // Use pageId as id
  // const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${process.env.NEXT_PUBLIC_PROTOCOL || 'http'}://${process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000'}`;

  const { product } = await find();
  // console.log((await find()).product.items,(await find()).reviews);
  // console.log(product.items[0].reviews);
  console.log(product);
  
  const averageRating = product.items[0].reviews.length > 0
    ? product.items[0].reviews.reduce((acc: number, review: any) => acc + review.rating, 0) / product.items[0].reviews.length
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 p-6">
          <div className="space-y-4">
            <img
              src={product.items[0].image || "/placeholder.jpg"}
              alt={product.items[0].name}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{product.items[0].name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-gray-600">({product.items[0].reviews.length} reviews)</span>
              </div>
              <CardDescription className="text-xl font-semibold text-primary mt-2">
                ${product.items[0].price?.toLocaleString()}
                {product.items[0].discountPrice && (
                  <span className="ml-2 line-through text-gray-400 text-lg">
                    ${product.items[0].discountPrice.toLocaleString()}
                  </span>
                )}
              </CardDescription>
              <div className="mt-2">
             <span className={`text-sm ${product.items[0].variants.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
        
                  {product.items[0].variants.stock > 0 ? `In Stock (${product.items[0].variants.stock} units)` : 'Out of Stock'}
                </span>   
              </div>
            </CardHeader>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Product Description</h3>
                <p className="text-gray-600">{product.items[0].description}</p>
              </div>

              {product.items[0].attributes && product.items[0].attributes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Technical Specifications</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {product.items[0].attributes.map((attr: any, index: number) => (
                      <div key={index} className="flex justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{attr.name}:</span>
                        <span>{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4">User Reviews</h3>
                {/* <div className="space-y-4">
                  {product.items[0].reviews.map((review: any) => (
                    <div key={review.id} className="border-b pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="font-medium">{review.user.firstName}</span>
                      </div>
                      <p className="text-gray-600">{review.comment}</p>
                    </div>
                  ))}
                </div> */}
              </div>

              <div className="flex gap-4">
                <Button size="lg" className="flex-1">
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg">
                  Add to Wishlist
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default SinPage;
