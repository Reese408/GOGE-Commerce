"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
              <AlertTriangle className="text-red-600 dark:text-red-500" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {this.state.error?.message || "An unexpected error occurred"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={this.handleReset}
                className="bg-[#927194] hover:bg-[#927194]/90 text-white"
              >
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/"}
              >
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Specialized error boundary for cart operations
export function CartErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 text-center">
          <AlertTriangle className="mx-auto text-red-500 mb-4" size={40} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Cart Error
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Unable to load cart. Please refresh the page.
          </p>
        </div>
      }
      onError={(error) => {
        // Log cart-specific errors
        console.error("[Cart Error]:", error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Specialized error boundary for search
export function SearchErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-6 text-center">
          <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={40} />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Search Unavailable
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Search is temporarily unavailable. Please try again later.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      }
      onError={(error) => {
        console.error("[Search Error]:", error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}

// Specialized error boundary for product details
export function ProductErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-[600px] flex items-center justify-center p-6">
          <div className="text-center max-w-md">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Product Unavailable
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              This product could not be loaded. It may be unavailable or removed.
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => window.history.back()}
                variant="outline"
              >
                Go Back
              </Button>
              <Button
                onClick={() => window.location.href = "/shop"}
                className="bg-[#927194] hover:bg-[#927194]/90 text-white"
              >
                Browse Products
              </Button>
            </div>
          </div>
        </div>
      }
      onError={(error) => {
        console.error("[Product Error]:", error);
      }}
    >
      {children}
    </ErrorBoundary>
  );
}
