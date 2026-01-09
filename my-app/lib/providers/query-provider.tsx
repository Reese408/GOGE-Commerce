"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: Data is considered fresh for 5 minutes
            staleTime: 5 * 60 * 1000,
            // Cache time: Unused data stays in cache for 10 minutes
            gcTime: 10 * 60 * 1000,
            // Retry failed requests with exponential backoff
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
            // Disable refetch on window focus for better performance
            refetchOnWindowFocus: false,
            // Disable refetch on mount (use cached data when available)
            refetchOnMount: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
