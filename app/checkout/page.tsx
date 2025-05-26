'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // CardContent, CardHeader, CardTitle added
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface CheckoutItem {
  productId: string;
  quantity: number;
  price: number;
  name: string;
}

interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  paymentMethod: string; // added
}

export default function CheckoutPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: ''
  });
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({ // added
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    paymentMethod: 'CREDIT_CARD' // Default value, user can change
  });
  const [error, setError] = useState<string | null>(null); // Added to display errors

  // Mock cart items - In real app, this would come from a cart context or state management
  const [cartItems] = useState<CheckoutItem[]>([
    { productId: '1', quantity: 2, price: 29.99, name: 'Product 1' },
    { productId: '2', quantity: 1, price: 39.99, name: 'Product 2' }
  ]);

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous error
    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous error

    // Simple validation for the payment form (should be more complete in a real app)
    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv) {
      setError('Please enter all payment information.');
      return;
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-id', // TODO: This should come from auth context
          items: cartItems,
          shippingAddress,
          paymentMethod: paymentDetails.paymentMethod, // Using state
          paymentDetails: { // Sending payment details
            cardNumber: paymentDetails.cardNumber,
            expiryDate: paymentDetails.expiryDate,
            cvv: paymentDetails.cvv
          },
          totalAmount
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Payment failed. Please try again.' }));
        throw new Error(errorData.message || 'Payment failed');
      }

      const order = await response.json();
      router.push(`/checkout/confirmation?orderId=${order.id}`);
    } catch (error: any) {
      console.error('Checkout error:', error);
      setError(error.message || 'An error occurred during payment. Please contact support.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      {/* Progress indicator */}
      <div className="flex justify-center mb-8">
        <div className={`mx-2 p-2 rounded-full ${currentStep === 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>1</div>
        <div className={`mx-2 p-2 rounded-full ${currentStep === 2 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>2</div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 border border-red-400 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          {currentStep === 1 ? (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
              <form onSubmit={handleAddressSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="street">Street Address</Label>
                    <Input
                      id="street"
                      value={shippingAddress.street}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State/Province</Label>
                    <Input
                      id="state"
                      value={shippingAddress.state}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">Continue to Payment</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
              <form onSubmit={handlePaymentSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="paymentMethod">Payment Method</Label>
                    <select 
                      id="paymentMethod"
                      value={paymentDetails.paymentMethod}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, paymentMethod: e.target.value })}
                      className="w-full p-2 border rounded mt-1"
                    >
                      <option value="CREDIT_CARD">Credit Card</option>
                      <option value="PAYPAL">PayPal</option>
                      {/* Add other payment methods as needed */}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="**** **** **** ****"
                      value={paymentDetails.cardNumber} // Connecting to state
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })} // Connecting to state
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={paymentDetails.expiryDate} // Connecting to state
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })} // Connecting to state
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="***"
                        value={paymentDetails.cvv} // Connecting to state
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })} // Connecting to state
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Complete Purchase</Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        <Card className="p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-4">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
