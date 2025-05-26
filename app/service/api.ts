import React from "react";
import {
  useQuery,
  useInfiniteQuery,
  QueryFunctionContext,
} from "@tanstack/react-query";
import axios from "axios";

type Params = Record<string, any>;

interface FetchOptions {
  url: string;
  params?: Params;
  paginate?: boolean;
  pageParamKey?: string; // default: "page"
}

interface APIComponentProps<T> {
  component: React.ComponentType<{ data: T[]; isLoading: boolean; fetchNextPage?: () => void; hasNextPage?: boolean }>;
  options: FetchOptions;
}

const fetchData = async ({ queryKey, pageParam = 1 }: QueryFunctionContext) => {
  const [{ url, params = {}, paginate = false, pageParamKey = "page" }] = queryKey;

  const queryParams = new URLSearchParams({
    ...params,
    ...(paginate ? { [pageParamKey]: pageParam } : {}),
  });

  const response = await axios.get(`${url}?${queryParams.toString()}`);
  return response.data;
};

export function APIComponent<T>({ component: Component, options }: APIComponentProps<T>) {
  const queryKey = [options];

  if (options.paginate) {
    const {
      data,
      isLoading,
      fetchNextPage,
      hasNextPage,
    } = useInfiniteQuery({
      queryKey,
      queryFn: fetchData,
      getNextPageParam: (lastPage, pages) => {
        // Customize according to your API
        if (lastPage?.nextPage) return lastPage.nextPage;
        return undefined;
      },
    });

    const flatData = data?.pages.flatMap(page => page.results || []);

    return <Component data={flatData || []} isLoading={isLoading} fetchNextPage={fetchNextPage} hasNextPage={hasNextPage} />;
  }

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: fetchData,
  });

  return <Component data={data?.results || []} isLoading={isLoading} />;
}
