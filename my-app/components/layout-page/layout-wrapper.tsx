"use client";

import { usePathname } from "next/navigation";
import { MainLayout } from "@/components/layout-page/main-layout";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Exclude MainLayout (header/footer) from checkout and review pages
  const isCheckoutPage = pathname?.startsWith("/checkout");
  const isReviewPage = pathname?.startsWith("/review");
  const excludeMainLayout = isCheckoutPage || isReviewPage;

  return excludeMainLayout ? <>{children}</> : <MainLayout>{children}</MainLayout>;
}
