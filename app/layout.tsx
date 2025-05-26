"use client";
import "./globals.css";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import QueryProvider from "@/components/providers/query-provider";
import { usePathname } from 'next/navigation';
import Providers from "./providers";

interface Subcategory {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  subcategory: Subcategory[];
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${process.env.NEXT_PUBLIC_PROTOCOL || 'http'}://${process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000'}`;

const fetchCategories = async () => {
  try {
    const response = await fetch(`${baseUrl}/api/category`);
    if (!response.ok) {
      throw new Error(`Failed to fetch categories: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const showHeaderFooter = !pathname?.startsWith('/admin') && !pathname?.startsWith('/user');

  const [categories, setCategories] = useState<Category[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 text-gray-900">
        <QueryProvider>
          {showHeaderFooter && (
            <nav className="bg-white/90 backdrop-blur shadow-lg sticky top-0 z-30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                  <div className="flex items-center">
                    <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-700 hover:text-purple-600 transition-colors duration-200">
                      E-Shop
                    </Link>
                  </div>
                  <div className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="hover:text-blue-600 font-medium transition-colors">Home</Link>
                    <Link href="/products" className="hover:text-blue-600 font-medium transition-colors">Products</Link>
                    <div className="relative group">
                      <button
                        className="flex items-center space-x-1 hover:text-blue-600 font-medium focus:outline-none"
                        onMouseEnter={() => setHoveredCategory(null)}
                      >
                        <span>Categories</span>
                        <ChevronDown className="w-4 h-4" />
                        <div className="absolute right-0 top-8 mt-2 w-72 sm:w-96 p-4 bg-white border rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 invisible group-hover:visible z-20">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {categories.map((category) => (
                              <div
                                key={category.id}
                                className="space-y-2"
                                onMouseEnter={() => setHoveredCategory(category.id)}
                                onMouseLeave={() => setHoveredCategory(null)}
                              >
                                <Link
                                  href={`/categories/${category.id}`}
                                  className="text-base font-semibold text-gray-800 hover:text-blue-600 block"
                                >
                                  {category.name}
                                </Link>
                                {Array.isArray(category.subcategory) && category.subcategory.length > 0 && (
                                  <ul className="space-y-1 ml-2">
                                    {category.subcategory.map((subcategory) => (
                                      <li key={subcategory.id}>
                                        <Link
                                          href={`/categories/${category.id}/${subcategory.id}`}
                                          className="text-gray-600 hover:text-blue-600 block text-sm"
                                        >
                                          {subcategory.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </button>
                    </div>
                    <Link href="/cart" className="hover:text-blue-600 font-medium transition-colors">Cart</Link>
                  </div>
                  <div className="md:hidden flex items-center">
                    {/* Mobile menu button */}
                    <button className="text-gray-700 hover:text-blue-600 focus:outline-none" onClick={() => setHoveredCategory('mobile')}> 
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                  </div>
                </div>
                {/* Mobile menu */}
                {hoveredCategory === 'mobile' && (
                  <div className="md:hidden mt-2 bg-white rounded-lg shadow-lg p-4 space-y-2 animate-fade-in-down">
                    <Link href="/" className="block hover:text-blue-600 font-medium">Home</Link>
                    <Link href="/products" className="block hover:text-blue-600 font-medium">Products</Link>
                    <div>
                      <span className="block font-medium text-gray-800 mb-1">Categories</span>
                      <div className="grid grid-cols-2 gap-2">
                        {categories.map((category) => (
                          <Link key={category.id} href={`/categories/${category.id}`} className="block text-gray-700 hover:text-blue-600 text-sm">
                            {category.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <Link href="/cart" className="block hover:text-blue-600 font-medium">Cart</Link>
                  </div>
                )}
              </div>
            </nav>
          )}
          <main className="flex-grow">
            <Providers>
              {children}
            </Providers>
          </main>
          {showHeaderFooter && (
            <footer className="bg-gradient-to-r from-blue-700 via-purple-600 to-blue-400 text-white py-12 mt-10 shadow-inner">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                      <li><Link href="/about" className="text-gray-200 hover:text-white">About</Link></li>
                      <li><Link href="/contact" className="text-gray-200 hover:text-white">Contact</Link></li>
                      <li><Link href="/faq" className="text-gray-200 hover:text-white">FAQ</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Customer Service</h3>
                    <ul className="space-y-2">
                      <li><Link href="/shipping" className="text-gray-200 hover:text-white">Shipping Info</Link></li>
                      <li><Link href="/returns" className="text-gray-200 hover:text-white">Returns</Link></li>
                      <li><Link href="/terms" className="text-gray-200 hover:text-white">Terms & Conditions</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Contact Info</h3>
                    <ul className="space-y-2 text-gray-200">
                      <li>Email: info@eshop.com</li>
                      <li>Phone: (123) 456-7890</li>
                      <li>Address: 123 Shop Street</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-4">Stay Connected</h3>
                    <div className="flex space-x-4 mt-2">
                      <a href="#" className="hover:text-blue-200 transition-colors" aria-label="Twitter"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 16.11 4c-2.37 0-4.29 1.92-4.29 4.29 0 .34.04.67.11.99C7.69 8.99 4.07 7.13 1.64 4.16c-.37.64-.58 1.39-.58 2.19 0 1.51.77 2.84 1.95 3.62-.72-.02-1.39-.22-1.98-.55v.06c0 2.11 1.5 3.87 3.5 4.27-.36.1-.74.16-1.13.16-.28 0-.54-.03-.8-.08.54 1.7 2.11 2.94 3.97 2.97A8.6 8.6 0 0 1 2 19.54c-.32 0-.63-.02-.94-.06A12.13 12.13 0 0 0 8.29 21.5c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22.46 6z"/></svg></a>
                      <a href="#" className="hover:text-blue-200 transition-colors" aria-label="Facebook"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.326 24h11.495v-9.294H9.692v-3.622h3.129V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>
                      <a href="#" className="hover:text-blue-200 transition-colors" aria-label="Instagram"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.974-.974 2.241-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.332.014 7.052.072 5.775.13 4.602.402 3.635 1.37 2.668 2.338 2.396 3.511 2.338 4.788.014 8.332 0 8.741 0 12c0 3.259.014 3.668.072 4.948.058 1.277.33 2.45 1.298 3.418.968.968 2.141 1.24 3.418 1.298C8.332 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 1.277-.058 2.45-.33 3.418-1.298.968-.968-2.141-1.24-3.418-1.298C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm7.842-10.406a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z"/></svg></a>
                    </div>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-white/30 text-center">
                  <p className="text-gray-200">&copy; 2024 E-Shop. All rights reserved.</p>
                </div>
              </div>
            </footer>
          )}
        </QueryProvider>
      </body>
    </html>
  );
}
