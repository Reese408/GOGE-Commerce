import { shopifyFetch } from "./shopify";

const CREATE_CHECKOUT_MUTATION = `
  mutation checkoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
      }
      checkoutUserErrors {
        field
        message
      }
    }
  }
`;

const ADD_TO_CHECKOUT_MUTATION = `
  mutation checkoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
        id
        webUrl
        lineItems(first: 250) {
          edges {
            node {
              id
              title
              quantity
            }
          }
        }
      }
      checkoutUserErrors {
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

export async function createCheckout(lineItems: CheckoutLineItem[]) {
  try {
    const response = await shopifyFetch({
      query: CREATE_CHECKOUT_MUTATION,
      variables: {
        input: {
          lineItems: lineItems.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
          })),
        },
      },
    });

    const { checkout, checkoutUserErrors } = response.checkoutCreate;

    if (checkoutUserErrors?.length > 0) {
      throw new Error(checkoutUserErrors[0].message);
    }

    return checkout;
  } catch (error) {
    console.error("Error creating checkout:", error);
    throw error;
  }
}

export async function addToCheckout(checkoutId: string, lineItems: CheckoutLineItem[]) {
  try {
    const response = await shopifyFetch({
      query: ADD_TO_CHECKOUT_MUTATION,
      variables: {
        checkoutId,
        lineItems: lineItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    });

    const { checkout, checkoutUserErrors } = response.checkoutLineItemsAdd;

    if (checkoutUserErrors?.length > 0) {
      throw new Error(checkoutUserErrors[0].message);
    }

    return checkout;
  } catch (error) {
    console.error("Error adding to checkout:", error);
    throw error;
  }
}

export function getCheckoutUrl(checkoutId: string): string {
  // Extract the numeric ID from the Shopify GID
  const numericId = checkoutId.split("/").pop();
  const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  return `https://${domain}/cart/${numericId}`;
}
