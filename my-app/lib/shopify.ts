const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

// API version should be updated regularly to access new features and ensure compatibility
// Using 2025-01 provides the latest stable Shopify Storefront API features
const SHOPIFY_API_VERSION = "2025-10";

export async function shopifyFetch<T>({
  query,
  variables,
  retryCount = 0,
}: {
  query: string;
  variables?: Record<string, any>;
  retryCount?: number;
}): Promise<T> {
  const res = await fetch(`https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // cache for 60s
  });

  // Check rate limit headers
  const throttleStatus = res.headers.get('X-Shopify-Shop-Api-Call-Limit');
  if (throttleStatus) {
    const [current, max] = throttleStatus.split('/').map(Number);
    // Log warning if approaching rate limit (80% threshold)
    if (current / max > 0.8) {
      console.warn(`Shopify API rate limit warning: ${current}/${max} calls used`);
    }
  }

  // Handle rate limiting (429 Too Many Requests)
  if (res.status === 429) {
    if (retryCount < 3) {
      const retryAfter = parseInt(res.headers.get('Retry-After') || '2', 10);
      const delay = Math.min(retryAfter * 1000, 10000); // Max 10s delay
      console.warn(`Rate limited. Retrying after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return shopifyFetch({ query, variables, retryCount: retryCount + 1 });
    }
    throw new Error('Shopify API rate limit exceeded after retries');
  }

  // Check for HTTP errors (network issues, invalid credentials, etc.)
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(
      `Shopify API HTTP Error: ${res.status} ${res.statusText}\nResponse: ${errorText}`
    );
  }

  const json = await res.json();

  // GraphQL can return 200 OK but still contain errors in the response body
  // This happens when the query syntax is wrong or you request fields that don't exist
  if (json.errors) {
    throw new Error(
      `Shopify GraphQL Error: ${JSON.stringify(json.errors, null, 2)}`
    );
  }

  return json;
}
