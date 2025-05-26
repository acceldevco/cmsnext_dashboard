"use client";
const initialGlobalState = {
  searchTerm: '',
  filterOptions: {},
  sortOrder: null,
  isLoading: false,
  error: null, // For global errors
  selected: null, // Added from BlogPostsContext
  form: {}, // Added from BlogPostsContext
  editingId: null, // Added from BlogPostsContext
  formLoading: false, // Added from BlogPostsContext
  formErrors: null, // For form-specific errors
  listData: [], // Added
  currentItem: null, // Added
  currentPage: 1, // Added for pagination
  itemsPerPage: 10, // Added for pagination
  totalItems: 0, // Added for pagination
  totalPages: 0, // Added for pagination
  dynamicFields: [], // Added
  fieldsLoading: false, // Added
};
import React, { createContext, useState, useContext, ReactNode } from 'react';
const GlobalContext = createContext<any>(undefined);
export const GlobalContextProvider: any = ({ children }: any) => {
  const [globalState, setGlobalState] = useState<any>(initialGlobalState);
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
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalState((prevState:any) => ({ ...prevState, searchTerm: e.target.value }));
  };
    const triggerSearch = () => {
    // This function will typically trigger handleFetchList in the component that uses the context
    // For example, by having a useEffect watch globalState.searchTerm and call handleFetchList
    // Or, if a direct refetch is needed without relying on useEffect, this function could call a passed-in refetch function.
    // For now, it primarily updates searchTerm, and components should react to that change.
    // console.log("Search triggered with term:", globalState.searchTerm);
    // To directly trigger a fetch here, we would need access to the fetchListAction, which might complicate the context.
    // It's often cleaner for components to observe searchTerm and call handleFetchList themselves.
  };

  const handleSearch = (term: string) => { // This function seems to be a duplicate or older version, handleSearchChange is preferred
    setGlobalState((prevState: any) => ({ ...prevState, searchTerm: term }));
  };

    const applyFilter = (filterName: string, value: any) => {
    setGlobalState((prevState: { filterOptions: any; }) => ({
      ...prevState,
      filterOptions: {
        ...prevState.filterOptions,
        [filterName]: value,
      },
    }));
  };

  const clearFilter = (filterName: string) => {
    setGlobalState((prevState: { filterOptions: any; }) => {
      const newFilterOptions = { ...prevState.filterOptions };
      delete newFilterOptions[filterName];
      return { ...prevState, filterOptions: newFilterOptions };
    });
  };

  const clearAllFilters = () => {
    setGlobalState((prevState: any) => ({ ...prevState, filterOptions: {} }));
  };

  const applySort = (field: string, direction: 'asc' | 'desc') => {
    setGlobalState((prevState: any) => ({ ...prevState, sortOrder: { field, direction } }));
  };

  const clearSort = () => {
    setGlobalState((prevState: any) => ({ ...prevState, sortOrder: null }));
  };

 const setLoading = (loading: boolean) => {
    setGlobalState((prevState: any) => ({ ...prevState, isLoading: loading }));
  };

  const setGlobalError = (error: string | null) => {
    setGlobalState((prevState: any) => ({ ...prevState, error }));
  };

  const setFormErrors = (errors: Record<string, string> | null) => {
    setGlobalState((prevState: any) => ({ ...prevState, formErrors: errors }));
  };

  const handleFormChange = (newFormData: any) => {
    setGlobalState((prevState: any) => ({ ...prevState, form: newFormData }));
  };

  const handleSubmit = async (formDataFromComponent: any, createAction: (data: any) => Promise<any>, updateAction: (data: any, id: any) => Promise<any>, refetchList?: () => void) => {
    setGlobalState((prevState: any) => ({ ...prevState, formLoading: true, formErrors: null, error: null }));
    try {
      if (globalState.editingId) {
        await updateAction(formDataFromComponent, globalState.editingId);
      } else {
        await createAction(formDataFromComponent);
      }
      setGlobalState((prevState: any) => ({
        ...prevState,
        form: initialGlobalState.form, // Reset form to initial state or a passed initial state
        editingId: null,
        formErrors: null,
      }));
      if (refetchList) refetchList();
    } catch (e: any) {
      // Assuming the error object might have a 'errors' field for form validation errors
      if (e.response && e.response.data && e.response.data.errors && typeof e.response.data.errors === 'object') {
        setGlobalState(prevState => ({ ...prevState, formErrors: e.response.data.errors as Record<string, string> }));
      } else {
        setGlobalState(prevState => ({ ...prevState, error: e.message || "Error saving data" }));
      }
    } finally {
      setGlobalState(prevState => ({ ...prevState, formLoading: false }));
    }
  };

  const handleEdit = (item: any) => {
    setGlobalState(prevState => ({ ...prevState, form: { ...item }, editingId: item.id }));
  };

  const setSelected = (item: any | null) => {
    setGlobalState(prevState => ({ ...prevState, selected: item }));
  };
    const resetForm = (initialFormState: Record<string, any> = {}) => {
    setGlobalState(prevState => ({ ...prevState, form: initialFormState, editingId: null, formErrors: null }));
  };

  const handleFetchList = async (fetchListAction: (page: number, limit: number, searchTerm?: string, filterOptions?: Record<string, any>, sortOrder?: { field: string; direction: 'asc' | 'desc' } | null) => Promise<{ data: any[], totalItems: number }>) => {
    setGlobalState(prevState => ({ ...prevState, isLoading: true, error: null }));
    try {
      const { data, totalItems } = await fetchListAction(
        globalState.currentPage,
        globalState.itemsPerPage,
        globalState.searchTerm,
        globalState.filterOptions,
        globalState.sortOrder
      );
      setGlobalState(prevState => ({
        ...prevState,
        listData: data,
        totalItems: totalItems,
        totalPages: Math.ceil(totalItems / prevState.itemsPerPage),
        isLoading: false
      }));
    } catch (e: any) {
      setGlobalState(prevState => ({ ...prevState, error: e.message || "Error fetching list data", isLoading: false }));
    }
  };

  const fetchFormSchema = async (fetchSchemaAction: (get: any) => Promise<any[]>, getAction?: any) => {
    setGlobalState(prevState => ({ ...prevState, fieldsLoading: true, error: null }));
    try {
      // Pass the getAction (or a similar mechanism for fetching) to fetchSchemaAction
      const fetchedFields = await fetchSchemaAction(getAction);
      setGlobalState(prevState => ({
        ...prevState,
        dynamicFields: fetchedFields,
        form: generateInitialFormState(fetchedFields), // Initialize form after fields are loaded
        fieldsLoading: false,
      }));
    } catch (e: any) {
      setGlobalState(prevState => ({ ...prevState, error: e.message || "Error fetching form schema", fieldsLoading: false }));
    }
  };

  const reloadListData = async (refetchListAction: () => Promise<void>) => {
    setGlobalState(prevState => ({ ...prevState, isLoading: true, error: null }));
    try {
      await refetchListAction(); // This function should internally call handleFetchList or similar logic
      // Assuming refetchListAction updates listData and related states internally or via handleFetchList
      setGlobalState(prevState => ({ ...prevState, isLoading: false })); // isLoading might be set by handleFetchList
    } catch (e: any) {
      setGlobalState(prevState => ({ ...prevState, error: e.message || "Error reloading list data", isLoading: false }));
    }
  };

  const handleFetchItem = async (fetchItemAction: (id: string | number) => Promise<any>, id: string | number) => {
    setGlobalState(prevState => ({ ...prevState, isLoading: true, error: null }));
    try {
      const data = await fetchItemAction(id);
      setGlobalState(prevState => ({ ...prevState, currentItem: data, isLoading: false }));
    } catch (e: any) {
      setGlobalState(prevState => ({ ...prevState, error: e.message || "Error fetching item data", isLoading: false }));
    }
  };

  const handleDeleteItem = async (deleteItemAction: (id: string | number) => Promise<void>, id: string | number, refetchList?: () => void) => {
    setGlobalState(prevState => ({ ...prevState, isLoading: true, error: null }));
    try {
      await deleteItemAction(id);
      setGlobalState(prevState => ({ ...prevState, isLoading: false }));
      if (refetchList) {
        refetchList(); // This should trigger a call to handleFetchList with the current pagination settings
      }
    } catch (e: any) {
      setGlobalState(prevState => ({ ...prevState, error: e.message || "Error deleting item", isLoading: false }));
    }
  };

  const handlePageChange = (page: number) => {
    setGlobalState(prevState => ({ ...prevState, currentPage: page }));
    // Note: Data fetching should be triggered by the component using the context
    // by calling handleFetchList after page changes.
    // Example in component: useEffect(() => { handleFetchList(fetchFunction); }, [globalState.currentPage, handleFetchList]);
  };

  const setItemsPerPage = (count: number) => {
    setGlobalState(prevState => ({
      ...prevState,
      itemsPerPage: count,
      currentPage: 1, // Reset to first page when items per page changes
      totalPages: Math.ceil(prevState.totalItems / count), // Recalculate total pages
    }));
    // Note: Data fetching should be triggered by the component using the context, similar to handlePageChange.
  };

  const saveToLocalStorage = (key: string, value: any) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error("Error saving to localStorage", error);
    }
  };

  const getFromLocalStorage = (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
      return null;
    } catch (error) {
      console.error("Error getting from localStorage", error);
      return null;
    }
  };

  const removeFromLocalStorage = (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error("Error removing from localStorage", error);
    }
  };

    const value = {
    globalState,
    setGlobalState,
    handleSearchChange, // Updated
    triggerSearch, // Added
    applyFilter,
    clearFilter,
    clearAllFilters,
    applySort,
    clearSort,
    setLoading,
    setGlobalError, // Updated
    setFormErrors, // Added
    handleFormChange, // Added
    handleSubmit, // Added
    handleEdit, // Added
    setSelected, // Added
    resetForm, // Added
    handleFetchList, // Updated
    fetchFormSchema, // Added
    reloadListData, // Added
    handleFetchItem, // Added
    handleDeleteItem, // Updated
    handlePageChange, // Added
    setItemsPerPage, // Added
    saveToLocalStorage,
    getFromLocalStorage,
    removeFromLocalStorage,
  };
    return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>;
}
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider');
  }
  return context;
};

