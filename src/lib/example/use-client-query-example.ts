"use client";

import { fetchGraphQlExample } from "lib/example/fetch/example.api";
import type { TExampleResult } from "lib/example/fetch/example.type";
import { useCallback, useState } from "react";

export function useClientQueryExample(initialData: TExampleResult) {
  const [data, setData] = useState<TExampleResult>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setLastError(null);
    try {
      const result = await fetchGraphQlExample();
      setData(result);
    } catch (error) {
      console.error("Error fetching example GraphQL data:", error);
      setLastError("Failed to fetch data");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const items = data?.example?.child?.list ?? [];

  return { data, items, isLoading, lastError, refetch };
}
