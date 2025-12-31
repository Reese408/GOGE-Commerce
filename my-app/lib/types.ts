// ==================== Cart Types ====================

export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  currencyCode: string;
  quantity: number;
  imageUrl?: string;
  variant?: {
    id: string;
    title: string;
  };
}

// ==================== Shopify Product Types ====================

export interface ShopifyImage {
  url: string;
  altText: string | null;
  width?: number;
  height?: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyPriceRange {
  minVariantPrice: ShopifyPrice;
  maxVariantPrice?: ShopifyPrice;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: ShopifyPriceRange;
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  availableForSale: boolean;
}

export interface ShopifyResponse {
  data: {
    products: {
      edges: Array<{
        node: ShopifyProduct;
      }>;
    };
  };
}

// ==================== Component Props Types ====================

export interface ProductCardData {
  id: string;
  title: string;
  description: string;
  price: number;
  currencyCode: string;
  imageUrl?: string;
  availableForSale: boolean;
}

export interface AddToCartProductData {
  id: string;
  title: string;
  price: number;
  currencyCode: string;
  imageUrl?: string;
}

// ==================== About Types ====================

export interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  color: string;
}

export interface FounderCardProps {
  imageSrc?: string;
  imageAlt?: string;
  name: string;
  title: string;
  university: string;
  sport: string;
  bio: string;
  socials: {
    instagram?: string;
    x?: string;
    facebook?: string;
    linkedin?: string;
    portfolio?: string;
  };
}

export interface MissionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

// ==================== Product Detail Types ====================

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
}

export interface ProductDetailData {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
        width?: number;
        height?: number;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: ProductVariant;
    }>;
  };
  availableForSale: boolean;
}

