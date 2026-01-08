import { shopifyFetch } from "./shopify";

// Using the new Cart API (replaces deprecated Checkout API)
const CREATE_CART_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
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

export async function createCheckout(lineItems: CheckoutLineItem[]) {
  try {
    const response = await shopifyFetch<CartCreateResponse>({
      query: CREATE_CART_MUTATION,
      variables: {
        input: {
          lines: lineItems.map((item) => ({
            merchandiseId: item.variantId,
            quantity: item.quantity,
          })),
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

    return {
      id: cart.id,
      webUrl: cart.checkoutUrl,
    };
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

export function getCheckoutUrl(checkoutId: string): string {
  // Extract the numeric ID from the Shopify GID
  const numericId = checkoutId.split("/").pop();
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  return `https://${domain}/cart/${numericId}`;
}

/**
 * Redirects the browser to Shopify checkout
 * @param checkoutUrl - The Shopify checkout URL
 */
export function redirectToCheckout(checkoutUrl: string): void {
  if (typeof window !== "undefined") {
    window.location.href = checkoutUrl;
  }
}
