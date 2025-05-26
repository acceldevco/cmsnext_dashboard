'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';

interface CartItem {
    id: string;
    productId?: string; // productId ممکن است در localStorage موجود نباشد، اختیاری می‌کنیم
    name: string;
    price: number;
    quantity: number;
    image: string;
}

export default function CartPage({ // پارامترهای get, deleted, update, create, find دیگر لازم نیستند
    // get,
    // deleted,
    // update,
    // create,
    // find
}:any) {
    const [couponCode, setCouponCode] = useState('');
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // تابعی برای بارگذاری آیتم‌های سبد خرید از localStorage
    const loadCartItems = () => {
        if (typeof window !== 'undefined') {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                setCartItems(JSON.parse(storedCart));
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadCartItems();
        // برای گوش دادن به تغییرات localStorage (اختیاری و پیچیده‌تر)
        // window.addEventListener('storage', loadCartItems);
        // return () => window.removeEventListener('storage', loadCartItems);
    }, []);

    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = 10; // Fixed shipping cost
    const total = subtotal + shippingCost;

    const updateLocalStorageCart = (updatedCart: CartItem[]) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            setCartItems(updatedCart);
        }
    };

    const handleQuantityChange = async (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) return;
        const updatedCart = cartItems.map(item =>
            item.id === itemId ? { ...item, quantity: newQuantity } : item
        );
        updateLocalStorageCart(updatedCart);
    };

    const handleRemoveItem = async (itemId: string) => {
        const updatedCart = cartItems.filter(item => item.id !== itemId);
        updateLocalStorageCart(updatedCart);
    };

    const handleApplyCoupon = async () => {
        // Apply coupon logic here
        console.log('Applying coupon:', couponCode);
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cartItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-4">
                                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                                                <span>{item.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>${item.price.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                >
                                                    -
                                                </Button>
                                                <span className="w-8 text-center">{item.quantity}</span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </TableCell>
                                        <TableCell>${(item.price * item.quantity).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleRemoveItem(item.id)}
                                            >
                                                Remove
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                <div>
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span>Subtotal</span>
                                <span>${subtotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${shippingCost.toLocaleString()}</span>
                            </div>
                            <div className="border-t pt-4">
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span>${total.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="mt-6 space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Discount Code"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                    />
                                    <Button onClick={handleApplyCoupon}>Apply</Button>
                                </div>
                                <Button className="w-full" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}