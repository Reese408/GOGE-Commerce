const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://graceongoing.com";

type StructuredDataProduct = {
  "@context": string;
  "@type": string;
  "@id": string;
  name: string;
  description: string;
  image: string;
  url: string;
  sku: string;
  brand: {
    "@type": string;
    name: string;
  };
  offers: {
    "@type": string;
    url: string;
    priceCurrency: string;
    price: string;
    availability: string;
    seller: {
      "@type": string;
      name: string;
      url: string;
    };
  };
};

export function generateProductSchema(product: {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  currencyCode: string;
  imageUrl?: string;
  availableForSale: boolean;
  brand?: string;
}): StructuredDataProduct {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteUrl}/products/${product.handle}#product`,
    name: product.title,
    description: product.description,
    image: product.imageUrl || `${siteUrl}/icon.png`,
    url: `${siteUrl}/products/${product.handle}`,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || "Grace, Ongoing",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.handle}`,
      priceCurrency: product.currencyCode,
      price: product.price.toFixed(2),
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Grace, Ongoing",
        url: siteUrl,
      },
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Grace, Ongoing",
    url: siteUrl,
    logo: `${siteUrl}/icon.png`,
    description: "Curated fashion and timeless style",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      url: `${siteUrl}/contact`,
    },
    sameAs: [
      // Add your social media URLs here when available
      // "https://www.instagram.com/graceongoing",
      // "https://www.facebook.com/graceongoing",
    ],
  };
}

export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Grace, Ongoing",
    url: siteUrl,
    description: "Discover curated fashion and timeless style",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`,
    })),
  };
}
