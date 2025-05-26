import React from "react";
import Image from "next/image";
import { Button } from "./Button";

interface ProductCardProps {
  id: string;
  title: string;
  price: string; // قیمت می‌تواند رشته‌ای مانند "$19.99" باشد، باید برای ذخیره‌سازی تبدیل شود
  image: string | null;
  rating: number;
}

async function urlToBase64(url:any) {
  try {
    // Fetch the image as a blob
    const response = await fetch(url);
    const blob = await response.blob();

    // Convert blob to Base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting URL to Base64:", error);
    return null;
  }
}

const renderStars = (rating: number) => {
  return Array(5)
    .fill(0)
    .map((_, i) => (
      <span
        key={i}
        className={i < rating ? "text-yellow-400" : "text-gray-300"}
      >
        ★
      </span>
    ));
}

export const ProductCard: React.FC<ProductCardProps> = (pros: ProductCardProps) => {
 
  const handleAddToCart = () => {
    if (typeof window !== 'undefined') {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingProductIndex = cart.findIndex((item: any) => item.id === pros.id);

      // قیمت را از رشته به عدد تبدیل می‌کنیم (مثلاً "$19.99" به 19.99)
      const priceAsString = typeof pros.price === 'string' ? pros.price : String(pros.price);
      const priceAsNumber = parseFloat(priceAsString.replace(/[^\d.-]/g, ''));

      if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
      } else {
        cart.push({
          id: pros.id,
          name: pros.title,
          price: priceAsNumber, // قیمت عددی ذخیره شود
          image: pros.image,
          quantity: 1,
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      //می‌توان یک نوتیفیکیشن یا بازخورد به کاربر نشان داد
      alert(`${pros.title} به سبد خرید اضافه شد!`);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative aspect-square">
        <Image
          src={pros.image || "/placeholder-image.png"} // استفاده از تصویر محصول یا یک تصویر پیش‌فرض
          alt={pros.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="font-medium text-lg mb-1">{pros.title}</h3>
        <div className="flex mb-2">{renderStars(pros.rating)}</div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{pros.price}</span>
          <Button variant="primary" size="sm" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};
