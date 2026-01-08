"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { MainLayout } from "@/components/layout-page/main-layout";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  // Exclude MainLayout (header/footer) from checkout and review pages
  const isCheckoutPage = pathname?.startsWith("/checkout");
  const isReviewPage = pathname?.startsWith("/review");
  const excludeMainLayout = isCheckoutPage || isReviewPage;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {excludeMainLayout ? children : <MainLayout>{children}</MainLayout>}
          <Toaster
            position="top-center"
            richColors
            expand={false}
            visibleToasts={9}
            closeButton
            offset="16px"
            gap={8}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
