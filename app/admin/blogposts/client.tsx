"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { MultiAPI } from "@/app/service/multiApi";
import { DynamicForm } from "@/components/ui/dynamicForm"; // وارد کردن DynamicForm
import { BlogPostsContextProvider, useBlogPostsContext } from "./BlogPostsContext";

// The actual table component that receives props from MultiAPIComponent
function BlogPostsTable({
  data: posts = [],
  isLoading,
  fetchNextPage,
  hasNextPage,
}: any) {
  const { state, setState, reload, handleFormChange, handleSubmit, handleEdit, handleDelete, handleSearchChange, triggerSearch } = useBlogPostsContext();

  // Destructure state for easier access
  const { selected, dynamicFields, fieldsLoading, form, editingId, error, formLoading, search } = state;

  if (fieldsLoading) {
    return <div className="p-6 text-center">Loading form fields...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Blog Posts Management</h2>
      {/* استفاده از DynamicForm */}
      {!fieldsLoading && (
        <DynamicForm
          fields={dynamicFields.filter((f: any) => !['id', 'createdAt', 'updatedAt'].includes(f.name))} // Filter non-editable fields
          initialData={editingId ? form : undefined} // Pass form data only when editing
          onSubmit={handleSubmit} // Pass the handleSubmit function
          isLoading={formLoading}
          onCancel={() => setState((prevState: any) => ({ ...prevState, editingId: null, form: {} }))} // Renamed prop
          submitButtonText={editingId ? "Edit Post" : "Add Post"}
          cancelButtonText="Cancel"
          className="mb-6 bg-gray-50 p-4 rounded-lg border" // Renamed prop
        />
      )}

      <div className="mb-4 flex gap-2">
        <Input
          value={search}
          onChange={handleSearchChange}
          placeholder="Search by Title, Slug, Tags..."
          className="max-w-sm"
        />
      </div>

      {error && <div className="text-red-600 mb-4">Error: {error}</div>}

      {isLoading && posts.length === 0 ? <div className="text-center p-4">Loading...</div> : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {/* Update Table Headers based on relevant fields - Example: show first 3 non-ID fields */}
                {dynamicFields.filter((f: any) => !['id', 'createdAt', 'updatedAt', 'content', 'excerpt'].includes(f.name)).slice(0, 3).map((field: any) => (
                  <TableHead key={field.name}>{field.label}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts && posts.length > 0 ? posts.map((post: any) => (
                <TableRow key={post.id}>
                  {/* Update Table Cells based on relevant fields */}
                  {dynamicFields.filter((f: any) => !['id', 'createdAt', 'updatedAt', 'content', 'excerpt'].includes(f.name)).slice(0, 3).map((field: any) => (
                    <TableCell key={field.name}>
                      {field.input === 'checkbox' ? (post[field.name] ? 'Yes' : 'No') :
                        field.input === 'datetime-local' && post[field.name] ? new Date(post[field.name]).toLocaleString() : // نمایش تاریخ خوانا
                          post[field.name]}
                    </TableCell>
                  ))}
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)} disabled={formLoading}>Delete</Button>
                    <Button variant="ghost" size="sm" onClick={() => setState((prevState: any) => ({ ...prevState, selected: post }))}>Details</Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={dynamicFields.filter((f: any) => !['id', 'createdAt', 'updatedAt', 'content', 'excerpt'].includes(f.name)).slice(0, 3).length + 1} className="text-center">No posts found.</TableCell> {/* Adjust colSpan dynamically */}
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination handled by Load More button */}
          <div className="mt-4 flex justify-center">
            <Button onClick={fetchNextPage} disabled={!hasNextPage || isLoading}>
              {isLoading ? 'Loading...' : 'Load More'}
            </Button>
          </div>
        </>
      )}

      {/* Details View Modal/Section - Updated to show dynamic fields */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50" onClick={() => setState((prevState: any) => ({ ...prevState, selected: null }))}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}> {/* Prevent closing on inner click */}
            <h3 className="text-xl font-semibold mb-4">Post Details</h3>
            <div className="space-y-2">
              {dynamicFields.map((field: any) => (
                <div key={field.name}>
                  <strong className="font-medium">{field.label}:</strong>
                  <span className="ml-2">
                    {field.input === 'checkbox' ? (selected[field.name] ? 'Yes' : 'No') :
                      field.input === 'datetime-local' && selected[field.name] ? new Date(selected[field.name]).toLocaleString() : // نمایش تاریخ خوانا
                        selected[field.name]}
                  </span>
                </div>
              ))}
            </div>
            <Button variant="outline" className="mt-4" onClick={() => setState((prevState: any) => ({ ...prevState, selected: null }))}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// The main component that uses MultiAPI HOC
const BlogPostsClient = ({ get, create, update, deleted, refetch }: any) => { // Accept CRUD functions as props
  return (
    <MultiAPI
      options={{ get, create, update, deleted }}
      component={BlogPostsTable} // Pass the component directly
    />
  );
};

export default BlogPostsClient;
