# Cake Weight Pricing - Complete Test Guide

## Test Case: Add a Cake with Weight Pricing

### Step 1: Admin - Add New Cake
1. Go to Admin → Items
2. Click "Add New Item"
3. Fill in:
   - Name: "Test Chocolate Cake"
   - Description: "Delicious chocolate cake"
   - Image URL: (any image URL)
   - Category: Select "Cakes"
   - Stock: 10
   - Eggless Stock: 5

4. **Weight Pricing Section (should appear):**
   - 1 Kg Price: 1500
   - 1.5 Kg Price: 2000
   - 2 Kg Price: 2800
   - 2.5 Kg Price: 3500
   - 3 Kg Price: 4200

5. Click "CREATE"

### Step 2: Check Browser Console
Open browser console (F12) and look for:
```
Saving cake with pricePerKg: {"1":"1500","1.5":"2000","2":"2800","2.5":"3500","3":"4200"}
```

### Step 3: View in Shop
1. Go to Shop page
2. Find "Test Chocolate Cake"
3. Should show: "From ₹1500"

### Step 4: View Item Detail
1. Click on the cake
2. Select different weights and watch price change:
   - 1 Kg → ₹1500
   - 1.5 Kg → ₹2000
   - 2 Kg → ₹2800

### Step 5: Check Console Logs
When selecting 1.5 Kg, console should show:
```
Item pricePerKg: {"1":"1500","1.5":"2000","2":"2800","2.5":"3500","3":"4200"}
Selected quantity (weight): 1.5
Parsed priceData: {1: "1500", 1.5: "2000", 2: "2800", 2.5: "3500", 3: "4200"}
Looking for key: "1.5"
Base price found: 2000
Final price: 2000
```

## If It's Not Working:

### Check 1: Database
Run this SQL to check the data:
```sql
SELECT id, name, price, price_per_kg FROM items WHERE name LIKE '%Test Chocolate%';
```

Should show:
- price: 0
- price_per_kg: {"1":"1500","1.5":"2000","2":"2800","2.5":"3500","3":"4200"}

### Check 2: Backend Response
Check Network tab in browser:
- Go to item detail page
- Look for API call to `/api/items/{id}`
- Check response JSON for `pricePerKg` field

### Check 3: Frontend State
Add this to ItemDetail.js useEffect:
```javascript
useEffect(() => {
  if (item) {
    console.log('Item loaded:', item);
    console.log('pricePerKg:', item.pricePerKg);
  }
}, [item]);
```
