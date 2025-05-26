import React from "react";
import Image from "next/image";
import Link from "next/link";

interface Category {
  name: string;
  image: string;
  url: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <Link
            href={category.url}
            key={index}
            className="group block rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
          >
            <div className="relative aspect-square">
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-medium text-center">{category.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};