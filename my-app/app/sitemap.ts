import { MetadataRoute } from "next";
import { SHOPIFY_API_VERSION, SHOPIFY_STORE_DOMAIN, SHOPIFY_STOREFRONT_TOKEN } from "@/lib/config";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://graceongoing.com";

async function fetchAllProducts() {
  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query: `
            query GetAllProducts {
              products(first: 250) {
                edges {
                  node {
                    handle
                    updatedAt
                  }
                }
              }
            }
          `,
        }),
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    const data = await response.json();
    return data?.data?.products?.edges?.map((edge: any) => edge.node) || [];
  } catch (error) {
    console.error("Error fetching products for sitemap:", error);
    return [];
  }
}

async function fetchAllCollections() {
  try {
    const response = await fetch(
      `https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query: `
            query GetAllCollections {
              collections(first: 250) {
                edges {
                  node {
                    handle
                    updatedAt
                  }
                }
              }
            }
          `,
        }),
        next: { revalidate: 3600 },
      }
    );

    const data = await response.json();
    return data?.data?.collections?.edges?.map((edge: any) => edge.node) || [];
  } catch (error) {
    console.error("Error fetching collections for sitemap:", error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await fetchAllProducts();
  const collections = await fetchAllCollections();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/collections`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/return-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/returns`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/track-order`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Product routes
  const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${siteUrl}/products/${product.handle}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Collection routes
  const collectionRoutes: MetadataRoute.Sitemap = collections.map((collection: any) => ({
    url: `${siteUrl}/collections/${collection.handle}`,
    lastModified: new Date(collection.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
