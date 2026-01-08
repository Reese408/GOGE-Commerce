"use client";

import { QueryProvider } from "@/lib/providers/query-provider";

/**
 * Review page layout - minimal layout without header/footer
 * Creates a locked checkout experience where users must use back button
 */
export default function ReviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  );
}
