# Testing Hybrid Checkout Flow

## Setup: Enable Shopify Test Mode

Before testing, enable Shopify's test payment gateway to avoid real charges:

1. **Go to Shopify Admin** → Settings → Payments
2. **Find "Test Mode" section** or add **Bogus Gateway**:
   - Click "Add payment method"
   - Search for "Bogus Gateway" (for testing)
   - Activate it
3. **Test credit card numbers** that Shopify accepts:
   - **Success**: `1` (single digit) or `4242 4242 4242 4242`
   - **Failure**: `2` or any other number
   - **CVV**: Any 3 digits
   - **Expiry**: Any future date

## Testing Steps

### 1. Add Products to Cart
- Navigate to your app's homepage
- Browse products and add items to cart
- Click "Add to Cart" or use Quick Add (hover over product in grid)
- Verify cart icon shows correct item count

### 2. View Cart
- Click cart icon in navigation
- Verify all items are displayed correctly
- Check quantity controls work (+/-)
- Test remove item functionality
- Verify undo toast appears after removal

### 3. Go to Checkout
- Click "Checkout" button in cart
- Should navigate to `/checkout`

### 4. Fill Shipping Information
Fill in the shipping form with test data:
```
Email: test@example.com
First Name: Test
Last Name: User
Address: 123 Main Street
Apartment: Apt 4B (optional)
City: New York
State: NY
ZIP Code: 10001
Phone: (555) 123-4567 (optional)
```

- Select a shipping method (Standard, Express, or Overnight)
- Verify "Free shipping on orders $50+" message if applicable

### 5. Continue to Payment
- Click "Continue to Payment" button
- **CRITICAL TEST**: Check browser console (F12 → Console tab)
- You should see a log message: `"Redirecting to Shopify checkout with pre-filled info: ..."`
- Browser should redirect to Shopify checkout page

### 6. Verify Shopify Checkout
On the Shopify checkout page, verify:

✅ **Cart Items**: All products from your cart are present with correct quantities
✅ **Pre-filled Information**: Your shipping details should be automatically filled in:
   - Email
   - First and Last Name
   - Address (including apartment if provided)
   - City, State, ZIP
   - Phone (if provided)

✅ **Shopify Branding**: Page shows Shopify checkout UI (you can customize this later)

### 7. Complete Test Purchase
- Review the pre-filled information
- Scroll to payment section
- Use test card number: `1` or `4242 4242 4242 4242`
- Fill CVV: `123`
- Fill Expiry: `12/25` (any future date)
- Click "Complete Order"

### 8. Verify Order Completion
- Should see Shopify's order confirmation page
- Order should appear in **Shopify Admin** → Orders
- Customer should receive order confirmation email (if email notifications are enabled)

## What to Check

### ✅ Success Indicators
- [ ] Cart items correctly passed to Shopify
- [ ] Shipping information pre-filled in Shopify checkout
- [ ] Test payment accepted (using Bogus Gateway)
- [ ] Order appears in Shopify Admin
- [ ] Order confirmation page displays

### ❌ Common Issues

**Issue**: Redirect fails or blank page
- **Fix**: Check browser console for errors
- **Fix**: Verify `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` in `.env.local`

**Issue**: Cart items not showing in Shopify
- **Fix**: Check that product variant IDs are valid
- **Fix**: Verify products exist in your Shopify store

**Issue**: Shipping info not pre-filled
- **Fix**: Check URL parameters in browser address bar
- **Fix**: Ensure all required fields are filled before clicking "Continue to Payment"

**Issue**: Payment fails even with test card
- **Fix**: Verify Bogus Gateway is activated in Shopify Admin
- **Fix**: Try using `1` as card number (Shopify test mode special value)

## Console Debugging

Open browser console (F12) and check for these log messages:

```javascript
// When clicking "Continue to Payment"
"Redirecting to Shopify checkout with pre-filled info: https://grace-ongoing.myshopify.com/cart/..."

// Should show URL with parameters like:
?checkout[email]=test@example.com
&checkout[shipping_address][first_name]=Test
&checkout[shipping_address][last_name]=User
// ... etc
```

## Order Tracking Test

After completing a test order:

1. **Go to** `/track-order` page
2. **Enter** your test order number (from confirmation email or Shopify admin)
3. **Enter** email used for order
4. **Click** "Track Order"
5. **Verify** redirects to Shopify's order status page

## Returns Test

1. **Go to** `/returns` page
2. **Fill out** return request form:
   - Order Number: Test order number
   - Email: test@example.com
   - Reason: Select from dropdown
   - Message: Optional details
3. **Submit** request
4. **Verify** success message displays
5. **Check** form submission (currently logs to console, would send to backend in production)

## Next Steps

After successful testing:

1. **Disable Test Mode**: In Shopify Admin, deactivate Bogus Gateway
2. **Enable Real Payments**: Activate Shopify Payments or your preferred payment provider
3. **Configure Email Notifications**: Set up order confirmation emails
4. **Customize Shopify Checkout**: In Shopify Admin → Settings → Checkout, customize branding and policies
5. **Test with Real Small Amount**: Do a real test purchase with minimum amount to verify end-to-end flow

## Production Checklist

Before going live:

- [ ] Real payment gateway activated (Shopify Payments recommended)
- [ ] Test mode disabled
- [ ] Shipping rates configured in Shopify
- [ ] Tax settings configured
- [ ] Order confirmation emails enabled
- [ ] Return policy linked in Shopify checkout
- [ ] Terms of service added
- [ ] Privacy policy added
- [ ] Test real purchase with small amount
- [ ] Verify order fulfillment workflow
