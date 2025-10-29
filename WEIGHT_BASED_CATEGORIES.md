# Weight-Based Pricing Categories

## Categories that use weight-based pricing:
- Occasional Cakes
- Premium Cakes
- Party Cakes

## Categories that use regular pricing:
- Cupcakes
- Pastries
- Cookies
- Brownies
- All other items

## How to check in code:

```javascript
const isWeightBased = (categoryName) => {
  const name = categoryName?.toLowerCase() || '';
  return name.includes('occasional') || 
         name.includes('premium') || 
         name.includes('party');
};
```

## Files that need this check:
1. ✅ Admin Items.js - UPDATED
2. Shop.js - Shows "From ₹X"
3. ItemDetail.js - Weight selection
4. Cart.js - Weight badge
5. Checkout.js - Delivery notes validation
6. Orders.js (customer) - Weight badge
7. Orders.js (admin) - Weight badge  
8. OrderHistory.js (admin) - Weight badge

Note: Cupcakes will now use regular price + quantity system like pastries.
