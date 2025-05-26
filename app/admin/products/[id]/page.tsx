"use client"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useEffect } from "react";
import { ChangeEvent } from 'react';

interface Category {
    id: string;
    name: string;
}

function ProductEditPage() {
    const [product, setProduct] = useState({
        id: "",
        name: "",
        slug: "",
        description: "",
        price: 0,
        discountPrice: 0,
        sku: "",
        stock: 0,
        images: [],
        categoryId: "",
        published: false,
        featured: false,
        salesCount: 0,
        popularity: 0
    });

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        // Fetch categories from API
        const fetchCategories = async () => {
            const response = await fetch('/api/category');
            const data = await response.json();
            setCategories(data);
        };

        fetchCategories();

        // Fetch product data (replace 'productId' with the actual product ID)
        const fetchProduct = async () => {
            const response = await fetch(`/api/product/${productId}`); // Replace productId
            const data = await response.json();
            setProduct(data);
        };
        fetchProduct();
    }, []);

    const productId = "your_product_id_here"; // Replace with actual product ID

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        let newValue: string | boolean = value;
        if (type === 'checkbox') {
            newValue = (e.currentTarget as HTMLInputElement).checked;
        }
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Send updated product data to API
        const response = await fetch(`/api/product/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        });

        if (response.ok) {
            alert('Product updated successfully!');
        } else {
            alert('Failed to update product.');
        }
    };


    return (
        <>
            <div className="flex   overflow-hidden gap-6 bg-white p-2">
                <div className="flex flex-col  flex-grow-[5]  gap-[30px]">
                    <div className="flex justify-start items-center self-end flex-grow-0 flex-shrink-0  gap-11">
                        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0  relative overflow-hidden gap-2.5 px-[105px] py-[117px] bg-[#ededed]">
                            {product.images && product.images.length > 0 ? (
                                <img src={product.images[0]} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="100" height="100" fill="#E0E0E0" />
                                    <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#A0A0A0">No Image</text>
                                </svg>
                            )}
                        </div>
                        <div>
                            {product.salesCount ? <p>Sales: {product.salesCount}</p> : null}
                            {product.popularity ? <p>Popularity: {product.popularity}</p> : null}
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className=" gap-[41px] flex flex-col">
                        <Tabs defaultValue="general" className="">
                            <TabsList className="self-end">
                                <TabsTrigger value="general">General</TabsTrigger>
                                <TabsTrigger value="pricing">Pricing</TabsTrigger>
                                <TabsTrigger value="inventory">Inventory</TabsTrigger>
                                <TabsTrigger value="images">Images</TabsTrigger>
                            </TabsList>
                            <TabsContent value="general" className="flex flex-col">
                                <Input placeholder="Name" type="text" name="name" value={product.name} onChange={handleChange} />
                                <Input placeholder="Slug" type="text" name="slug" value={product.slug} onChange={handleChange} />
                                <textarea placeholder="Description" name="description" value={product.description} onChange={handleChange} />
                                <select name="categoryId" value={product.categoryId} onChange={handleChange}>
                                    <option value="">Select Category</option>
                                    {categories.map((category: Category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </TabsContent>
                            <TabsContent value="pricing">
                                <Input placeholder="Price" type="number" name="price" value={product.price} onChange={handleChange} />
                                <Input placeholder="Discount Price" type="number" name="discountPrice" value={product.discountPrice} onChange={handleChange} />
                            </TabsContent>
                            <TabsContent value="inventory">
                                <Input placeholder="SKU" type="text" name="sku" value={product.sku} onChange={handleChange} />
                                <Input placeholder="Stock" type="number" name="stock" value={product.stock} onChange={handleChange} />
                            </TabsContent>
                            <TabsContent value="images">
                                <Input type="file" multiple onChange={(e) => {
                                    console.log(e.target.files);
                                }} />
                            </TabsContent>
                        </Tabs>
                        <div>
                            <label>
                                Published:
                                <Input type="checkbox" name="published" checked={product.published} onChange={handleChange} />
                            </label>
                            <label>
                                Featured:
                                <Input type="checkbox" name="featured" checked={product.featured} onChange={handleChange} />
                            </label>
                        </div>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ProductEditPage;
