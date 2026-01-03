// GraphQL query to fetch products from Shopify
// This uses the Storefront API 2025-01 schema
export const SINGLE_PRODUCT_QUERY = `
  query SingleProduct {
    products(first: 1) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          availableForSale
        }
      }
    }
  }
`;

// Query to fetch all products (useful for product listing pages)
export const ALL_PRODUCTS_QUERY = `
  query AllProducts($first: Int = 10) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          availableForSale
        }
      }
    }
  }
`;

// Query to search products by keyword
export const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($query: String!, $first: Int = 10) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 1) {
            edges {
              node {
                url
                altText
                width
                height
              }
            }
          }
          availableForSale
        }
      }
    }
  }
`;

// Query to search collections
export const SEARCH_COLLECTIONS_QUERY = `
  query SearchCollections($query: String!, $first: Int = 5) {
    collections(first: $first, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
          }
        }
      }
    }
  }
`;

// Query to fetch a single product by ID with all variants
export const PRODUCT_BY_ID_QUERY = `
  query ProductById($id: ID!) {
    product(id: $id) {
      id
      title
      description
      handle
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 20) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
          }
        }
      }
      availableForSale
    }
  }
`;
