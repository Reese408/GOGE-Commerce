"use client";

import { QueryProvider } from "@/lib/providers/query-provider";
import { CartSidebar } from "@/components/cart/cart-sidebar";

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      {children}
      <CartSidebar />
    </QueryProvider>
  );
}
