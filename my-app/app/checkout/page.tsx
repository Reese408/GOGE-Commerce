"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

/**
 * Legacy checkout page - redirects to review page
 * This ensures any bookmarks or old links redirect to the new flow
 */
export default function CheckoutPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/review");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}
