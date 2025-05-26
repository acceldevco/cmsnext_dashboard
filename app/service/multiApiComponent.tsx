"use client"
import React from "react";
import { useQueries, useInfiniteQuery, QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";

type Params = Record<string, any>;

interface MultiFetchOptions {
  urls: string[];
  paramsList?: Params[];
  paginate?: boolean;
  pageParamKey?: string; // default: "page"
  filters?: Params;
}

interface MultiAPIComponentProps<T> {
  component: React.ComponentType<{
    data: T[][];
    isLoading: boolean;
    fetchNextPages?: (() => void)[];
    hasNextPages?: boolean[];
  }>;
  options: MultiFetchOptions;
}

const fetchData = async ({ queryKey, pageParam = 1 }: any) => {
  const { url, params = {}, paginate = false, pageParamKey = "page", filters = {} } = queryKey[0];
  const queryParams = new URLSearchParams({
    ...params,
    ...filters,
    ...(paginate ? { [pageParamKey]: pageParam } : {}),
  });
  const response = await axios.get(`${url}?${queryParams.toString()}`);
 
 
  return response.data;
};

export function MultiAPIComponent<T>({ component: Component, options }: MultiAPIComponentProps<T>) {
  
  
  const { urls, paramsList = [], paginate = true, pageParamKey = "page", filters = {} } = options;
  

  if (paginate) {
    
    // صفحه‌بندی برای هر URL
    const queries = urls.map((url, idx) => {
      return useInfiniteQuery({
        queryKey: [{ url, params: paramsList[idx] || {}, paginate, pageParamKey, filters }],
        queryFn: fetchData,
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
          if (lastPage?.nextPage) return lastPage.nextPage;
          return undefined;
        },
      });
    });
    console.log(queries.map(d=>d.data?.pages.map(d=>d.items)));
    
    const data = queries.map(q => q.data?.pages.flatMap(page => page.items || []) || []);
    const isLoading = queries.some(q => q.isLoading);
    const fetchNextPages = queries.map(q => q.fetchNextPage);
    const hasNextPages = queries.map(q => q.hasNextPage);
    // console.log(data);
    
    return <Component data={data} isLoading={isLoading} fetchNextPages={fetchNextPages} hasNextPages={hasNextPages} />;
  }

  // بدون صفحه‌بندی
  const queries = useQueries({
    queries: urls.map((url, idx) => ({
      queryKey: [{ url, params: paramsList[idx] || {}, paginate: false, pageParamKey, filters }],
      queryFn: fetchData,
    })),
  });
  const data = queries.map(q => q.data?.results || []);

  
  const isLoading = queries.some(q => q.isLoading);
  return <Component data={data} isLoading={isLoading} />;
}
