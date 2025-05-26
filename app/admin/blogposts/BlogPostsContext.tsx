"use client";

import React, { createContext, useState, useEffect, useContext } from "react";

interface BlogPostsContextProps {
  state?: any;
  setState?: React.Dispatch<React.SetStateAction<any>>;
  reload?: () => void;
  handleFormChange?: (newFormData: any) => void;
  handleSubmit?: (formDataFromComponent: any) => Promise<void>;
  handleEdit?: (post: any) => void;
  handleDelete?: (id: any) => Promise<void>;
  handleSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerSearch?: () => void;
}

const BlogPostsContext = createContext<BlogPostsContextProps | undefined>(undefined);

export const useBlogPostsContext = () => {
  const context = useContext(BlogPostsContext);
  if (!context) {
    throw new Error("useBlogPostsContext must be used within a BlogPostsContextProvider");
  }
  return context;
};

interface BlogPostsContextProviderProps {
  get: any;
  create: any;
  update: any;
  deleted: any;
  refetch: any;
  children: React.ReactNode;
}

export const BlogPostsContextProvider: React.FC<BlogPostsContextProviderProps> = ({
  get,
  create,
  update,
  deleted,
  refetch,
  children,
}) => {
  // Combine all states into a single state object
  const [state, setState] = useState<any>({
    selected: null,
    dynamicFields: [],
    fieldsLoading: true,
    form: {}, // وضعیت فرم توسط DynamicForm مدیریت می‌شود
    editingId: null,
    error: "",
    formLoading: false,
    search: "",
  });

  // Destructure state for easier access
  const { dynamicFields } = state;

  // Helper to generate initial form state based on dynamic fields
  const generateInitialFormState = (fields: any[]) => {
    const initialState: { [key: string]: any } = {};
    fields.forEach((field) => {
      if (field.input === "checkbox") {
        initialState[field.name] = false; // Default checkbox to false
      } else {
        initialState[field.name] = "";
      }
    });
    return initialState;
  };

  // Fetch fields on component mount
  useEffect(() => {
    const fetchFields = async () => {
      try {
        setState((prevState: any) => ({ ...prevState, fieldsLoading: true }));
    const result = await get({ page: 1, pageSize: 1 }); // Fetch minimal data to get columns
    if (result && result.col) {
      const fetchedFields = result.col.map((col: any) => ({
        name: col.name,
        type: col.type, // Assuming type info is available
        input:
          col.input ||
          (col.type === "longtext" || col.type === "text"
            ? "textarea"
            : col.type === "tinyint(1)"
              ? "checkbox"
              : col.type === "datetime(3)"
                ? "datetime-local"
                : "input"), // Infer input type, map datetime(3) to datetime-local
        label: col.label || col.name.charAt(0).toUpperCase() + col.name.slice(1), // Generate label
        required: col.required || false, // Assuming required info is available
        // inputType is now handled within the 'input' mapping above
      }));
      setState((prevState: any) => ({
        ...prevState,
        dynamicFields: fetchedFields,
        form: generateInitialFormState(fetchedFields), // Initialize form after fields are loaded
      }));
    } else {
      setState((prevState: any) => ({ ...prevState, error: "Failed to load field definitions." }));
    }
  } catch (e: any) {
    setState((prevState: any) => ({ ...prevState, error: e.message || "Error fetching field definitions." }));
  } finally {
    setState((prevState: any) => ({ ...prevState, fieldsLoading: false }));
  }
};

    fetchFields();
  }, [get]); // Dependency on getAction

  const reload = () => {
    refetch(); // Use the refetch function provided by MultiAPIComponent
  };

  // تابع مدیریت تغییرات فرم که به DynamicForm ارسال می‌شود
  const handleFormChange = (newFormData: any) => {
    setState((prevState: any) => ({ ...prevState, form: newFormData }));
  };

  const handleSubmit = async (formDataFromComponent: any) => {
    // e.preventDefault(); // دیگر لازم نیست، DynamicForm مدیریت می‌کند
    setState((prevState: any) => ({ ...prevState, formLoading: true, error: "" }));
    try {
      // DynamicForm باید فرمت‌بندی تاریخ را انجام دهد یا داده‌های خام را ارسال کند
      // منطق فرمت‌بندی تاریخ در اینجا حذف شده است، با فرض اینکه DynamicForm آن را مدیریت می‌کند
      const submissionData = { ...formDataFromComponent }; // استفاده از داده‌های فرم از کامپوننت

      if (state.editingId) {
        await update(submissionData, state.editingId); // Use update action from props
      } else {
        await create(submissionData); // Use create action from props
      }
      setState((prevState: any) => ({
        ...prevState,
        form: generateInitialFormState(dynamicFields), // Reset form to initial state using dynamic fields
        editingId: null,
      }));
      reload(); // Refetch data after successful operation
    } catch (e: any) {
      setState((prevState: any) => ({ ...prevState, error: e.message || "خطا در ذخیره پست" }));
    } finally {
      // اطمینان از اینکه formLoading همیشه false می‌شود
      setState((prevState: any) => ({ ...prevState, formLoading: false }));
    }
  };

  const handleEdit = (post: any) => {
    // DynamicForm باید بتواند داده‌های اولیه را دریافت کند
    // منطق فرمت‌بندی تاریخ در اینجا حذف شده است
    const initialFormData = { ...post };
    // اطمینان از اینکه مقادیر null یا undefined به درستی مدیریت می‌شوند
    dynamicFields.forEach((field: any) => {
      if (initialFormData[field.name] === null || initialFormData[field.name] === undefined) {
        initialFormData[field.name] = field.input === "checkbox" ? false : "";
      }
    });
    setState((prevState: any) => ({ ...prevState, form: initialFormData, editingId: post.id }));
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm("آیا مطمئن هستید؟")) return;
    setState((prevState: any) => ({ ...prevState, formLoading: true, error: "" })); // Use formLoading for delete operation as well
    try {
      await deleted(id); // Use delete action from props
      reload(); // Refetch data after successful deletion
    } catch (e: any) {
      setState((prevState: any) => ({ ...prevState, error: e.message || "خطا در حذف پست" }));
    }
    setState((prevState: any) => ({ ...prevState, formLoading: false }));
  };

  // TODO: Implement debounced search
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prevState: any) => ({ ...prevState, search: e.target.value }));
    // Ideally, call refetch with the search term after a delay (debounce)
    // For now, refetch immediately or require a button press
  };

  const triggerSearch = () => {
    // Pass search state to the get function via MultiAPIComponent options modification or refetch parameterization if supported
    // Currently, MultiAPIComponent's get doesn't accept search directly in refetch.
    // A possible solution is to modify MultiAPIComponent to accept search in refetch or manage search state within it.
    // For simplicity, we might need to trigger a full state update in the parent if search needs to be passed to `get`.
    console.log("Search functionality needs implementation in MultiAPIComponent or parent.");
    // Example: refetch({ search }); // If refetch supported parameters
  };

  const value: BlogPostsContextProps = {
    state: state, // مقدار اولیه state از useState
    setState: setState, // تابع setState از useState
    reload: reload, // تابع reload موجود
    handleFormChange: handleFormChange, // تابع handleFormChange موجود
    handleSubmit: handleSubmit, // تابع handleSubmit موجود
    handleEdit: handleEdit, // تابع handleEdit موجود
    handleDelete: handleDelete, // تابع handleDelete موجود
    handleSearchChange: handleSearchChange, // تابع handleSearchChange موجود
    triggerSearch: triggerSearch, // تابع triggerSearch موجود
  };

  return <BlogPostsContext.Provider value={value}>{children}</BlogPostsContext.Provider>;
};
