import { shopifyFetch } from "./shopify";

// Using the new Cart API (replaces deprecated Checkout API)
const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        attributes {
          key
          value
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

export interface CheckoutLineItem {
  variantId: string;
  quantity: number;
}

interface CartCreateResponse {
  data: {
    cartCreate: {
      cart: {
        id: string;
        checkoutUrl: string;
      } | null;
      userErrors: Array<{
        field: string[];
        message: string;
      }>;
    };
  };
}

/**
 * Gets the base URL for the storefront
 * Works on both client and server side
 */
function getBaseUrl(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.graceongoing.com';
}

/**
 * Appends return URL parameters to Shopify checkout URL
 * This is more reliable than cart attributes on Basic plan
 */
function appendReturnParams(checkoutUrl: string, baseUrl: string): string {
  const url = new URL(checkoutUrl);
  
  // These params tell Shopify where to redirect after checkout actions
  // Note: Not all params work on all plans, but we try them all
  url.searchParams.set('return_to', `${baseUrl}/shop`);
  url.searchParams.set('return_url', `${baseUrl}/shop`);
  
  return url.toString();
}

export async function createCheckout(lineItems: CheckoutLineItem[]) {
  try {
    const baseUrl = getBaseUrl();

    const response = await shopifyFetch<CartCreateResponse>({
      query: CREATE_CART_MUTATION,
      variables: {
        input: {
          lines: lineItems.map((item) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity,
          })),
          // Keep attributes as backup (works on higher plans)
          attributes: [
            {
              key: '_return_to',
              value: `${baseUrl}/shop`
            },
            {
              key: '_cancel_url', 
              value: `${baseUrl}/review`
            }
          ],
          buyerIdentity: {
            countryCode: 'US'
          }
        },
      },
    });

    const { cart, userErrors } = response.data.cartCreate;

    if (userErrors?.length > 0) {
      throw new Error(userErrors[0].message);
    }

    if (!cart) {
      throw new Error("Failed to create cart");
    }

    // Append return URL params to the checkout URL
    const enhancedCheckoutUrl = appendReturnParams(cart.checkoutUrl, baseUrl);

    return {
      id: cart.id,
      webUrl: enhancedCheckoutUrl,
    };
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

export function getCheckoutUrl(checkoutId: string): string {
  const numericId = checkoutId.split("/").pop();
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  return `https://${domain}/cart/${numericId}`;
}

/**
 * Redirects the browser to Shopify checkout
 */
export function redirectToCheckout(checkoutUrl: string): void {
  if (typeof window !== "undefined") {
    window.location.href = checkoutUrl;
  }
}