# Grace Ongoing E-Commerce - Dev Reference

## Tech Stack
- Next.js 16.1.1 (App Router) + TypeScript
- Tailwind CSS with dark mode
- Shopify Storefront API (Headless channel)

## Architecture

### Key Files
- `/lib/shopify.ts` - API client with HTTP + GraphQL error handling, 60s cache
- `/lib/queries.ts` - `SINGLE_PRODUCT_QUERY` and `ALL_PRODUCTS_QUERY`
- `/app/page.tsx` - Main showcase (typed with `ShopifyProduct` interface)
- `/next.config.ts` - Image config for `cdn.shopify.com/s/files/**`

### Shopify Setup
- API Version: `2025-10` (in `lib/shopify.ts`)
- Token Type: Storefront API (hex format, NOT `shpat_` Admin tokens)
- Products must be available to Headless channel in Shopify admin

### GraphQL Response Structure
```typescript
data.products.edges[0].node = {
  id, title, description, handle,
  priceRange: { minVariantPrice, maxVariantPrice },
  images.edges[0].node: { url, altText, width, height },
  availableForSale
}
```

## Error Handling
- **HTTP errors** (401, 404): Shows status + response body
- **GraphQL errors**: Detected even with 200 OK (checks `json.errors`)

## Dev Notes
- Dev server runs on port 3001 (3000 in use)
- Restart required for: `.env.local`, `next.config.ts`, dependencies
- Images: Next.js optimizes to WebP, lazy loads (except `priority`)
- Pricing: `Intl.NumberFormat` auto-formats currency

## Common Issues
1. 401 Unauthorized = invalid/expired token
2. Image errors = add domain to `next.config.ts` remotePatterns
3. No products = check Headless channel availability in Shopify
4. GraphQL errors = check query syntax/field names

## Color Palette
```
#927194 - Muted Purple
#D08F90 - Dusty Rose
#E8CFA9 - Warm Beige
#F9F4C8 - Soft Cream
#A0B094 - Sage Green
```

## File Structure (Component-Focused)
```
app/page.tsx                           → Homepage (Hero + FeaturedProducts)
components/
  layout-page/
    - main-layout.tsx                  → Reusable layout with navbar + cart
    - hero.tsx                         → Hero section with scroll animations
  products/
    - featured-products.tsx            → Server component (fetches products)
    - product-card.tsx                 → Card (featured/grid layouts)
    - add-to-cart-button.tsx           → Add to cart with success animation
  cart/cart-sidebar.tsx                → Animated cart sidebar
  search/search-input.tsx              → Search w/ Cmd/Ctrl+K
  navigation/navbar.tsx                → Nav links + mobile menu
lib/
  - types.ts                           → ALL TypeScript interfaces
  - shopify.ts                         → API client
  - queries.ts                         → GraphQL queries
  - store/cart-store.ts                → Zustand cart state
next.config.ts                         → Image optimization
```
## Cart & State Management (Zustand)
- **Store**: `lib/store/cart-store.ts` - Global cart state with localStorage persistence
- **Actions**: addItem, removeItem, updateQuantity, clearCart, toggleCart
- **Features**:
  - Cart count badge (auto-updates, shows "99+" for >99 items)
  - Animated cart sidebar (slides in from right)
  - Persistent cart (survives page refreshes)
  - Add to cart with success animation

## Components
- `CartSidebar` - Animated slide-out cart with Framer Motion
- `AddToCartButton` - Button with success state animation
- Cart automatically opens when item added

## Things looking to add
super killer ui for the products along with real world functioanlity for customization of product like which color, size all in one.