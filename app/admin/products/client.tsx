"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useCallback } from "react";
import { DynamicForm } from "@/components/ui/dynamicForm";
// import { useProductContext } from "./products-context";
import { useAppContext } from "@/app/admin/GlobalContext";

export default function ProductsPage({
  get,
  deleted,
  update,
  create
}: any) {
  const { states, setState } = useAppContext();

  useEffect(() => {
    (async () => {
      setState('data', 'products', await get())
    })();
  }, []);




  // useEffect(() => {
  //   // setState("/admin/products", "products2", products);
  // }, [products, setState]);
  // const submitHandler = async (e: any) => {
  //   handleSubmit(e)
  // };
  const fields = async () => (await get()).col
  const formFields = [
    { name: "name", label: "Name", type: "text", input: 'input' as const, inputType: "text" },
    { name: "slug", label: "Slug", type: "text", input: 'input' as const, inputType: "text" },
    { name: "description", label: "Description", type: "text", input: 'textarea' as const },
    { name: "price", label: "Price", type: "number", input: 'input' as const, inputType: "number" },
    { name: "discountPrice", label: "Discount Price", type: "number", input: 'input' as const, inputType: "number" },
    { name: "sku", label: "SKU", type: "text", input: 'input' as const, inputType: "text" },
    { name: "stock", label: "Stock", type: "number", input: 'input' as const, inputType: "number" },
    { name: "categoryId", label: "Category ID", type: "text", input: 'input' as const, inputType: "text" },
    { name: "published", label: "Published", type: "checkbox", input: 'checkbox' as const },
    { name: "featured", label: "Featured", type: "checkbox", input: 'checkbox' as const },
    { name: "images", label: "Images", inputType: "file", input: 'input' as const },
  ];


  return (
    <ContentLayout title="Products">
      <h2>Create New Product</h2>
      <DynamicForm
        fields={formFields}
        initialData={states["/admin/products"]?.["edit"] ? states["/admin/products"]?.["products2"] : undefined}
        onCancel={() => {
          setState("/admin/products", "products2", {});
          setState("/admin/products", "edit", false);
        }} // Renamed prop
        submitButtonText={states["/admin/products"]?.["edit"] ? "Edit Post" : "Add Post"}
        cancelButtonText="Cancel"
        onSubmit={async (values: any) => {
          const newProduct = {
            ...values,
          };
          delete newProduct.categoryId;
          let response;
          if (states["/admin/products"]?.["edit"]) {
            response = await update(newProduct, states["/admin/products"]?.["products2"]?.id);
            setState("/admin/products", "products2", {});
          } else {
            response = await create(newProduct);
            setState("/admin/products", "products2", {});
          }
          if (response && !response?.error) {
            // Refresh the product list
            var data = ((await get()).items)
            setState('data', 'products', await get())
          } else {
            console.error("Failed to create product");
          }
        }}
      />

      <h2>Search and Filter</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="search">Search</label>
          <input
            type="text"
            id="search"
            className="border rounded-md px-2 py-1 w-full"
            // value={search}
            onChange={async (e) => {
              // console.log(await get(e.target.value.split("")));
              console.log(await get(e.target.value.split("")));
              
              setState('data', 'products', await get(e.target.value.split("")))
            }}
          />
        </div>
        <div>
          <label htmlFor="categoryFilter">Category</label>
          <input
            type="text"
            id="categoryFilter"
            className="border rounded-md px-2 py-1 w-full"
          // value={categoryFilter}
          // onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Discount Price</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Category ID</TableHead>
            <TableHead>Published</TableHead>
            <TableHead>Featured</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {states ? (
            states.data?.products?.items?.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.slug}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.discountPrice}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell>{product.categoryId}</TableCell>
                <TableCell>{product.published ? "Yes" : "No"}</TableCell>
                <TableCell>{product.featured ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                    onClick={async () => {
                      setState("/admin/products", "products2", product);
                      setState("/admin/products", "edit", true)
                    }}>
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded-md"
                    onClick={async () => {
                      const response = await deleted({ id: product.id });
                      if (response && !response.error) {
                        // Refresh the product list
                        // var data = ((await get()).items)
                        setState('data', 'products', await get())
                      } else {
                        console.error("Failed to delete product");
                      }
                    }}
                  >
                    Delete
                  </button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={12} className="text-center">
                Loading products...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ContentLayout>
  );
}
