"use client"
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { MultiAPI } from "@/app/service/multiApi";
import {DynamicForm} from "@/components/ui/dynamicForm"; // وارد کردن DynamicForm

// Helper to generate initial form state based on dynamic fields
const generateInitialFormState = (fields: any[]) => {
  const initialState: { [key: string]: any } = {};
  fields.forEach(field => {
    if (field.input === 'checkbox') {
      initialState[field.name] = false; // Default checkbox to false
    } else {
      initialState[field.name] = "";
    }
  });
  return initialState;
};

// The actual table component that receives props from MultiAPIComponent
function BlogPostsTable({ 
  data: posts = [], 
  isLoading, 
  fetchNextPage, 
  hasNextPage, 
  refetch, 
  create: createAction, 
  update: updateAction, 
  deleted: deleteAction ,
  get: getAction // Receive getAction here
}: any) {
  // Combine all states into a single state object
  const [state, setState] = useState<any>({
    selected: null,
    dynamicFields: [],
    fieldsLoading: true,
    form: {}, // وضعیت فرم توسط DynamicForm مدیریت می‌شود
    editingId: null,
    error: "",
    formLoading: false,
    search: ""
  });

  // Destructure state for easier access
  const { selected, dynamicFields, fieldsLoading, form, editingId, error, formLoading, search } = state;

  // Fetch fields on component mount
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setState(prevState => ({ ...prevState, fieldsLoading: true }));
        const result = await getAction({ page: 1, pageSize: 1 }); // Fetch minimal data to get columns
        if (result && result.col) {
          const fetchedFields = result.col.map((col: any) => ({
            name: col.name,
            type: col.type, // Assuming type info is available
            input: col.input || (col.type === 'longtext' || col.type === 'text' ? 'textarea' : col.type === 'tinyint(1)' ? 'checkbox' : col.type === 'datetime(3)' ? 'datetime-local' : 'input'), // Infer input type, map datetime(3) to datetime-local
            label: col.label || col.name.charAt(0).toUpperCase() + col.name.slice(1), // Generate label
            required: col.required || false, // Assuming required info is available
            // inputType is now handled within the 'input' mapping above
          })); 
          setState(prevState => ({
            ...prevState,
            dynamicFields: fetchedFields,
            form: generateInitialFormState(fetchedFields) // Initialize form after fields are loaded
          }));
        } else {
          setState(prevState => ({ ...prevState, error: "Failed to load field definitions." }));
        }
      } catch (e: any) {
        setState(prevState => ({ ...prevState, error: e.message || "Error fetching field definitions." }));
      } finally {
        setState(prevState => ({ ...prevState, fieldsLoading: false }));
      }
    };

    fetchFields();
  }, [getAction]); // Dependency on getAction

  const reload = () => {
    refetch(); // Use the refetch function provided by MultiAPIComponent
  };

  // تابع handleChange و handleSelectChange دیگر لازم نیستند زیرا DynamicForm آن را مدیریت می‌کند
  // const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { ... };
  // const handleSelectChange = (name: string, value: string) => { ... };

  // تابع مدیریت تغییرات فرم که به DynamicForm ارسال می‌شود
  const handleFormChange = (newFormData: any) => {
    setState(prevState => ({ ...prevState, form: newFormData }));
  };

  const handleSubmit = async (formDataFromComponent: any) => { // formData از DynamicForm می‌آید
    // e.preventDefault(); // دیگر لازم نیست، DynamicForm مدیریت می‌کند
    setState(prevState => ({ ...prevState, formLoading: true, error: "" }));
    try {
      // DynamicForm باید فرمت‌بندی تاریخ را انجام دهد یا داده‌های خام را ارسال کند
      // منطق فرمت‌بندی تاریخ در اینجا حذف شده است، با فرض اینکه DynamicForm آن را مدیریت می‌کند
      const submissionData = { ...formDataFromComponent }; // استفاده از داده‌های فرم از کامپوننت

      if (editingId) {
        await updateAction(submissionData, editingId); // Use update action from props
      } else {
        await createAction(submissionData); // Use create action from props
      }
      setState(prevState => ({
        ...prevState,
        form: generateInitialFormState(dynamicFields), // Reset form to initial state using dynamic fields
        editingId: null
      }));
      reload(); // Refetch data after successful operation
    } catch (e: any) {
      setState(prevState => ({ ...prevState, error: e.message || "خطا در ذخیره پست" }));
    } finally { // اطمینان از اینکه formLoading همیشه false می‌شود
       setState(prevState => ({ ...prevState, formLoading: false }));
    }
  };

  const handleEdit = (post: any) => {
    // DynamicForm باید بتواند داده‌های اولیه را دریافت کند
    // منطق فرمت‌بندی تاریخ در اینجا حذف شده است
    const initialFormData = { ...post };
    // اطمینان از اینکه مقادیر null یا undefined به درستی مدیریت می‌شوند
    dynamicFields.forEach(field => {
      if (initialFormData[field.name] === null || initialFormData[field.name] === undefined) {
        initialFormData[field.name] = field.input === 'checkbox' ? false : '';
      }
    });
    setState(prevState => ({ ...prevState, form: initialFormData, editingId: post.id }));
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    setState(prevState => ({ ...prevState, formLoading: true, error: "" })); // Use formLoading for delete operation as well
    try {
      await deleteAction(id); // Use delete action from props
      reload(); // Refetch data after successful deletion
    } catch (e: any) {
      setState(prevState => ({ ...prevState, error: e.message || "خطا در حذف پست" }));
    }
    setState(prevState => ({ ...prevState, formLoading: false }));
  };

  // TODO: Implement debounced search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prevState => ({ ...prevState, search: e.target.value }));
    // Ideally, call refetch with the search term after a delay (debounce)
    // For now, refetch immediately or require a button press
  };

  const triggerSearch = () => {
     // Pass search state to the get function via MultiAPIComponent options modification or refetch parameterization if supported
     // Currently, MultiAPIComponent's get doesn't accept search directly in refetch. 
     // A possible solution is to modify MultiAPIComponent to accept search in refetch or manage search state within it.
     // For simplicity, we might need to trigger a full state update in the parent if search needs to be passed to `get`.
     console.log("Search functionality needs implementation in MultiAPIComponent or parent.")
     // Example: refetch({ search }); // If refetch supported parameters
  }

  if (fieldsLoading) {
    return <div className="p-6 text-center">Loading form fields...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Blog Posts Management</h2>
      {/* استفاده از DynamicForm */} 
      {!fieldsLoading && (
        <DynamicForm
          fields={dynamicFields.filter(f => !['id', 'createdAt', 'updatedAt'].includes(f.name))} // Filter non-editable fields
          initialData={editingId ? form : undefined} // Pass form data only when editing
          onSubmit={handleSubmit} // Pass the handleSubmit function
          isLoading={formLoading}
          onCancel={() => setState(prevState => ({ ...prevState, editingId: null, form: generateInitialFormState(dynamicFields) }))} // Renamed prop
          submitButtonText={editingId ? "Edit Post" : "Add Post"}
          cancelButtonText="Cancel"
          className="mb-6 bg-gray-50 p-4 rounded-lg border" // Renamed prop
          // gridColsClass is removed, DynamicForm uses gridCols prop (defaults to 3)
          // onFormChange is removed, DynamicForm manages its own state
          // editingId is removed, DynamicForm uses initialData presence
        />
      )}

      {/* فرم قدیمی حذف شد */} 
      {/* <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 p-4 rounded-lg border"> ... </form> */}

      <div className="mb-4 flex gap-2">
        <Input 
          value={search} 
          onChange={handleSearchChange} 
          placeholder="Search by Title, Slug, Tags..." 
          className="max-w-sm"
        />
        {/* <Button onClick={triggerSearch}>Search</Button> */} {/* Search trigger might need adjustment based on MultiAPI */} 
      </div>

      {error && <div className="text-red-600 mb-4">Error: {error}</div>}

      {isLoading && posts.length === 0 ? <div className="text-center p-4">Loading...</div> : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                {/* Update Table Headers based on relevant fields - Example: show first 3 non-ID fields */} 
                {dynamicFields.filter(f => !['id', 'createdAt', 'updatedAt', 'content', 'excerpt'].includes(f.name)).slice(0, 3).map(field => (
                    <TableHead key={field.name}>{field.label}</TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts && posts.length > 0 ? posts.map((post: any) => (
                <TableRow key={post.id}>
                  {/* Update Table Cells based on relevant fields */} 
                  {dynamicFields.filter(f => !['id', 'createdAt', 'updatedAt', 'content', 'excerpt'].includes(f.name)).slice(0, 3).map(field => (
                    <TableCell key={field.name}>
                        {field.input === 'checkbox' ? (post[field.name] ? 'Yes' : 'No') : 
                         field.input === 'datetime-local' && post[field.name] ? new Date(post[field.name]).toLocaleString() : // نمایش تاریخ خوانا
                         post[field.name]}
                    </TableCell>
                  ))}
                  <TableCell className="space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(post)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(post.id)} disabled={formLoading}>Delete</Button>
                    <Button variant="ghost" size="sm" onClick={() => setState(prevState => ({ ...prevState, selected: post }))}>Details</Button> 
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={dynamicFields.filter(f => !['id', 'createdAt', 'updatedAt', 'content', 'excerpt'].includes(f.name)).slice(0, 3).length + 1} className="text-center">No posts found.</TableCell> {/* Adjust colSpan dynamically */}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50" onClick={() => setState(prevState => ({ ...prevState, selected: null }))}>
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}> {/* Prevent closing on inner click */} 
            <h3 className="text-xl font-semibold mb-4">Post Details</h3>
            <div className="space-y-2">
              {dynamicFields.map(field => (
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
            <Button variant="outline" className="mt-4" onClick={() => setState(prevState => ({ ...prevState, selected: null }))}>Close</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// The main component that uses MultiAPI HOC
const BlogPostsClient = ({ get, create, update, deleted }: any) => { // Accept CRUD functions as props
  return (
    <MultiAPI 
      options={{ get, create, update, deleted }}
      component={BlogPostsTable} // Pass the component directly
    />
    // The render prop pattern is handled inside MultiAPI now
    // >
    //   {/* Pass CRUD actions and data down to the table component */}
    //   {(props: any) => <BlogPostsTable {...props} />}
    // </MultiAPI>
  );
};

export default BlogPostsClient;
