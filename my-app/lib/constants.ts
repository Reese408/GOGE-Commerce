// ==================== Shipping Constants ====================

// Free shipping threshold (Shopify applies this at checkout)
export const FREE_SHIPPING_THRESHOLD = 75;

// ==================== Product Weight Constants ====================
// Weight in pounds - used for shipping rate calculations (UX display only)
// Note: Shopify checkout is the source of truth for actual shipping costs

export const PRODUCT_WEIGHTS = {
  // T-Shirts (Unisex)
  TSHIRT: 0.5,

  // Hoodies
  HOODIE: 1.4, // Average of 1.3-1.5 lb

  // Stickers
  STICKER: 0.1,

  // Default for unknown items
  DEFAULT: 0.5,
} as const;

// ==================== Shipping Rate Tiers (UX Reference Only) ====================
// These mirror Shopify's actual shipping rules for UX consistency
// SHOPIFY CHECKOUT IS AUTHORITATIVE - DO NOT USE THESE FOR PRICING

export const SHIPPING_TIERS = {
  ECONOMY_FREE: {
    label: "Free Shipping",
    minSubtotal: 75,
    minWeight: 0,
    maxWeight: Infinity,
    cost: 0,
  },
  ECONOMY_0_5: {
    label: "Economy Shipping",
    minSubtotal: 0,
    minWeight: 0,
    maxWeight: 5,
    cost: 4.90,
  },
  ECONOMY_5_70: {
    label: "Economy Shipping",
    minSubtotal: 0,
    minWeight: 5,
    maxWeight: 70,
    cost: 19.90,
  },
  STANDARD_0_1: {
    label: "Standard Shipping",
    minSubtotal: 0,
    minWeight: 0,
    maxWeight: 1,
    cost: 6.90,
  },
  STANDARD_1_5: {
    label: "Standard Shipping",
    minSubtotal: 0,
    minWeight: 1,
    maxWeight: 5,
    cost: 9.90,
  },
} as const;

// ==================== Size Chart Constants ====================

export const UNISEX_SIZE_CHART = [
  { size: "XS", width: 16, length: 26 },
  { size: "S", width: 18, length: 28 },
  { size: "M", width: 20, length: 29 },
  { size: "L", width: 22, length: 30 },
  { size: "XL", width: 24, length: 31 },
  { size: "XXL", width: 26, length: 32 },
] as const;

export const SIZE_CHART_NOTE = "Unisex fit. Size up for an oversized look.";
export const SIZE_CHART_BRAND = "Gildan Unisex";
