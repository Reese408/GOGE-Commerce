import { Geist, Geist_Mono } from "next/font/google";
import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { LayoutWrapper } from "@/components/layout-page/layout-wrapper";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://graceongoing.com";
const siteName = "Grace, Ongoing";
const siteDescription = "Discover curated fashion and timeless style at Grace, Ongoing. Shop our exclusive collection of clothing, accessories, and more.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} | Curated Fashion & Timeless Style`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "fashion",
    "clothing",
    "accessories",
    "style",
    "curated fashion",
    "women's fashion",
    "online boutique",
    "Grace Ongoing",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName,
    title: `${siteName} | Curated Fashion & Timeless Style`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - Curated Fashion`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Curated Fashion & Timeless Style`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@graceongoing",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://grace-ongoing.myshopify.com" />
        <link rel="dns-prefetch" href="https://grace-ongoing.myshopify.com" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper>{children}</LayoutWrapper>
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
