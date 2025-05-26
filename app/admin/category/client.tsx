"use client";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect } from "react";
import { DynamicForm } from "@/components/ui/dynamicForm";
import { useAppContext } from "@/app/admin/GlobalContext";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  parentId?: string;
}

export default function CategoryPage({
  get,
  deleted,
  update,
  create
}: any) {
  const { states, setState } = useAppContext();

  useEffect(() => {
    (async () => {
      setState('data', 'categories', await get())
    })();
  }, []);

  const formFields = [
    { name: "name", label: "Name", type: "text", input: 'input' as const, inputType: "text" },
    { name: "slug", label: "Slug", type: "text", input: 'input' as const, inputType: "text" },
    { name: "description", label: "Description", type: "text", input: 'textarea' as const },
    { name: "image", label: "Image URL", type: "text", input: 'input' as const, inputType: "text" },
    { name: "parentId", label: "Parent Category", type: "text", input: 'input' as const, inputType: "text" },
  ];

  return (
    <ContentLayout title="Categories">
      <h2>Create New Category</h2>
      <DynamicForm
        fields={formFields}
        initialData={states?.["data"]?.["editCategory"] ? states?.["data"]?.["editCategory"] : undefined}
        onCancel={() => {
          setState("data", "editCategory", {});
        }}
        submitButtonText={states?.["data"]?.["editCategory"] ? "Edit Category" : "Add Category"}
        cancelButtonText="Cancel"
        onSubmit={async (values: any) => {
          const newCategory = {
            ...values,
          };
          let response;
          if (states?.["data"]?.["editCategory"]) {
            response = await update(newCategory, states?.["data"]?.["editCategory"]?.id);
            setState("data", "editCategory", {});
          } else {
            response = await create(newCategory);
          }
          if (response && !response?.error) {
            setState('data', 'categories', await get())
          } else {
            console.error("Failed to create category");
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
            onChange={async (e) => {
              setState('data', 'categories', await get(e.target.value.split("")))
            }}
          />
        </div>
        <div>
          <label htmlFor="categoryFilter">Category</label>
          <input
            type="text"
            id="categoryFilter"
            className="border rounded-md px-2 py-1 w-full"
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
            <TableHead>Image</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {states?.data?.categories?.items?.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.id}</TableCell>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{category.description}</TableCell>
              <TableCell>{category.image}</TableCell>
              <TableCell>
                <button className="bg-blue-500 text-white px-2 py-1 rounded-md mr-2"
                  onClick={async (e) => {
                    setState("data", "editCategory", category);
                  }}>
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded-md"
                  onClick={async () => {
                    const response = await deleted({ id: category.id });
                    if (response && !response.error) {
                      setState('data', 'categories', await get())
                    } else {
                      console.error("Failed to delete category");
                    }
                  }}
                >
                  Delete
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ContentLayout>
  );
}
