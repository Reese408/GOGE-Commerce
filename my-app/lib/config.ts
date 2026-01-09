/**
 * Centralized configuration constants for the Grace, Ongoing e-commerce app
 */

// Shopify API Configuration
export const SHOPIFY_API_VERSION = "2025-10";
export const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!;
export const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN!;

// Free Shipping Configuration
export const FREE_SHIPPING_THRESHOLD = 75;

// Cart Configuration
export const MAX_CART_ITEMS = 50;

// Search Configuration
export const SEARCH_DEBOUNCE_MS = 300;
export const POPULAR_SEARCHES = ["Shirts", "Sweatshirts", "Stickers", "Buttons"];

// Product Categories
export const PRODUCT_CATEGORIES = {
  ALL: "all",
  SHIRTS: "shirts",
  SWEATSHIRTS: "sweatshirts",
  ACCESSORIES: "accessories",
} as const;

// Animation Configuration
export const ANIMATION_DURATION = 300;
export const SLIDESHOW_INTERVAL = 5000;

// S3 Media Configuration
export const S3_BASE_URL = "https://grace-ongoing-media.s3.us-east-2.amazonaws.com";
export const S3_IMAGES_URL = `${S3_BASE_URL}/images`;
export const S3_VIDEOS_URL = `${S3_BASE_URL}/videos`;

// S3 Image Paths
export const LOGO_URL = `${S3_IMAGES_URL}/logos/logo1.png`;
export const SLIDESHOW_IMAGE_1_URL = `${S3_IMAGES_URL}/slideimages/image1.jpeg`;
export const SLIDESHOW_IMAGE_2_URL = `${S3_IMAGES_URL}/slideimages/image2.jpeg`;
export const FOUNDER_PROFILE_URL = `${S3_IMAGES_URL}/profile/amanda-profile.jpg`;
