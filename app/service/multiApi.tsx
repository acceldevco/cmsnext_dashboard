"use client"
import React from "react";
import { useQueries, useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
// import axios from "axios";

type Params = Record<string, any>;

interface MultiAPIOptions<TData = any> {
  get: (page?: number, pageSize?: number, search?: string) => Promise<TData>;
  create?: (data: any) => Promise<any>;
  update?: (id: any, data: any) => Promise<any>;
  deleted?: (id: any) => Promise<any>; // Note: 'deleted' instead of 'delete' due to reserved keyword
  initialPage?: number;
  initialPageSize?: number;
  initialSearch?: string;
}

interface MultiAPIComponentProps<T, TData = any> {
  component: React.ComponentType<{
    data: TData[]; // Changed from T[][] to TData[] assuming single data source
    isLoading: boolean;
    fetchNextPage?: () => void; // Simplified for single source
    hasNextPage?: boolean; // Simplified for single source
    refetch: () => void; // Added refetch capability
    create?: (data: any) => Promise<any>;
    update?: (id: any, data: any) => Promise<any>;
    deleted?: (id: any) => Promise<any>;
    get?: () => Promise<any>;
  }>;
  options: MultiAPIOptions<TData>;
}



export function MultiAPI<T, TData>({ component: Component, options }: MultiAPIComponentProps<T, TData>) {
  const { 
    get, 
    create, 
    update, 
    deleted, 
    initialPage = 1, 
    initialPageSize = 10, 
    initialSearch = "" 
  } = options;

  const [page, setPage] = React.useState(initialPage);
  const [pageSize, setPageSize] = React.useState(initialPageSize);
  const [search, setSearch] = React.useState(initialSearch);
  const [internalData, setInternalData] = React.useState<TData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchData = React.useCallback(async (currentPage: number, currentSearch: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await get(currentPage, pageSize, currentSearch);
      setInternalData(result);
    } catch (err: any) {      
      setError(err.message || "Failed to fetch data");
      setInternalData(null); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, [get, pageSize]); // Dependency on get and pageSize

  React.useEffect(() => {
    fetchData(page, search);
  }, [fetchData, page, search]); // Refetch when page or search changes

  const refetch = () => {
    fetchData(page, search);
  };

  // Basic pagination logic (can be improved based on actual API response structure)
  // Assuming the response 'internalData' has properties like 'items', 'total', 'page', 'pageSize'
  const items = (internalData as any)?.items || [];
  const totalItems = (internalData as any)?.total || 0;
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = page < totalPages;

  const fetchNextPage = () => {
    if (hasNextPage) {
      setPage(p => p + 1);
    }
  };

  // Pass down the server actions and state management functions
  return (
    <Component 
      data={items} // Pass the actual items array
      isLoading={isLoading}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      refetch={refetch} // Provide refetch capability
      create={create}
      update={update}
      deleted={deleted}
      get={get}
      // You might need to pass down setPage, setSearch etc. if the child needs to control them
    />
  );
}
