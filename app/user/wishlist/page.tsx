'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    stock: number;
  };
}

interface Wishlist {
  id: string;
  items: WishlistItem[];
}

const fetchWishlist = async (): Promise<Wishlist> => {
  const response = await fetch('/api/wishlist');
  if (!response.ok) {
    throw new Error('Failed to fetch wishlist');
  }
  return response.json();
};

const removeFromWishlist = async (itemId: string) => {
  const response = await fetch(`/api/wishlist/${itemId}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to remove item from wishlist');
  }
};

export default function WishlistPage() {
  const queryClient = useQueryClient();
  
  const { data: wishlist, isLoading, error } = useQuery<Wishlist>({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist
  });

  const removeMutation = useMutation({
    mutationFn: removeFromWishlist,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Item removed from wishlist');
    },
    onError: () => {
      toast.error('Failed to remove item from wishlist');
    }
  });

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error.message}</div>;
  }

  if (!wishlist?.items?.length) {
    return <div className="text-center py-10">Your wishlist is empty</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Wishlist</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {wishlist.items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <img
                src={item.product.image}
                alt={item.product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-lg">{item.product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="font-medium">${item.product.price.toFixed(2)}</div>
                  <div className={`text-sm ${item.product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.product.stock > 0 ? `In Stock (${item.product.stock})` : 'Out of Stock'}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    disabled={item.product.stock === 0}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="px-3"
                    onClick={() => removeMutation.mutate(item.id)}
                    disabled={removeMutation.isPending}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}