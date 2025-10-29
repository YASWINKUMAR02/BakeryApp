# Egg/Eggless Variant Implementation Guide

## Overview
This implementation adds support for items to have egg and eggless variants with different pricing and separate stock management.

## Backend Changes Completed

### 1. Database Schema Updates
**File:** `add_egg_variants.sql`

Run this SQL script to update your database:
```sql
-- Add egg/eggless variant columns to items table
ALTER TABLE items 
ADD COLUMN egg_price DOUBLE,
ADD COLUMN eggless_price DOUBLE,
ADD COLUMN has_egg_option BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN egg_stock INT DEFAULT 0,
ADD COLUMN eggless_stock INT DEFAULT 0;

-- Add egg_type column to cart_items table
ALTER TABLE cart_items 
ADD COLUMN egg_type VARCHAR(20);

-- Add egg_type column to order_items table
ALTER TABLE order_items 
ADD COLUMN egg_type VARCHAR(20);
```

### 2. Entity Updates

**Item.java** - Added fields:
- `eggPrice` - Price for egg variant
- `egglessPrice` - Price for eggless variant
- `hasEggOption` - Boolean flag to indicate if item has variants
- `eggStock` - Separate stock for egg variant
- `egglessStock` - Separate stock for eggless variant

**CartItem.java** - Added field:
- `eggType` - Stores customer's selection ("EGG", "EGGLESS", or null)

**OrderItem.java** - Added field:
- `eggType` - Preserves selection in order history

### 3. Service Layer Updates

**CartService.java:**
- Updated `addItemToCart()` to:
  - Accept `eggType` from request
  - Check appropriate stock based on variant (egg/eggless/regular)
  - Store egg type with cart item
  - Treat same item with different egg types as separate cart items

**CartItemRequest.java:**
- Added `eggType` field to DTO

## Frontend Implementation Needed

### 1. Admin - Items Management Page

Update `Items.js` (Admin) to include:

```javascript
// Add to form state
const [hasEggOption, setHasEggOption] = useState(false);
const [eggPrice, setEggPrice] = useState('');
const [egglessPrice, setEgglessPrice] = useState('');
const [eggStock, setEggStock] = useState(0);
const [egglessStock, setEgglessStock] = useState(0);

// Add to form UI
<FormControlLabel
  control={
    <Checkbox
      checked={hasEggOption}
      onChange={(e) => setHasEggOption(e.target.checked)}
    />
  }
  label="Has Egg/Eggless Options"
/>

{hasEggOption && (
  <>
    <TextField
      label="Egg Variant Price"
      type="number"
      value={eggPrice}
      onChange={(e) => setEggPrice(e.target.value)}
    />
    <TextField
      label="Eggless Variant Price"
      type="number"
      value={egglessPrice}
      onChange={(e) => setEgglessPrice(e.target.value)}
    />
    <TextField
      label="Egg Stock"
      type="number"
      value={eggStock}
      onChange={(e) => setEggStock(e.target.value)}
    />
    <TextField
      label="Eggless Stock"
      type="number"
      value={egglessStock}
      onChange={(e) => setEgglessStock(e.target.value)}
    />
  </>
)}
```

### 2. Customer - Item Detail Page

Update `ItemDetail.js` to show variant selection:

```javascript
const [selectedEggType, setSelectedEggType] = useState(null);

// Add to UI before quantity selector
{item.hasEggOption && (
  <Box style={{ marginBottom: '24px' }}>
    <Typography variant="subtitle1" style={{ fontWeight: 600, marginBottom: '12px' }}>
      Select Variant:
    </Typography>
    <Box style={{ display: 'flex', gap: '12px' }}>
      <Button
        variant={selectedEggType === 'EGG' ? 'contained' : 'outlined'}
        onClick={() => setSelectedEggType('EGG')}
        style={{
          background: selectedEggType === 'EGG' ? '#ff6b35' : 'transparent',
          color: selectedEggType === 'EGG' ? '#fff' : '#ff6b35',
          borderColor: '#ff6b35',
        }}
      >
        Egg - ₹{item.eggPrice?.toFixed(2)}
        <br />
        <Typography variant="caption">
          Stock: {item.eggStock}
        </Typography>
      </Button>
      <Button
        variant={selectedEggType === 'EGGLESS' ? 'contained' : 'outlined'}
        onClick={() => setSelectedEggType('EGGLESS')}
        style={{
          background: selectedEggType === 'EGGLESS' ? '#ff6b35' : 'transparent',
          color: selectedEggType === 'EGGLESS' ? '#fff' : '#ff6b35',
          borderColor: '#ff6b35',
        }}
      >
        Eggless - ₹{item.egglessPrice?.toFixed(2)}
        <br />
        <Typography variant="caption">
          Stock: {item.egglessStock}
        </Typography>
      </Button>
    </Box>
  </Box>
)}

// Update handleAddToCart
const handleAddToCart = async () => {
  if (item.hasEggOption && !selectedEggType) {
    showError('Please select Egg or Eggless variant');
    return;
  }
  
  try {
    await cartAPI.addItem(user.id, {
      itemId: item.id,
      quantity: quantity,
      eggType: selectedEggType,
    });
    showSuccess(`${item.name} added to cart!`);
  } catch (err) {
    showError(err.response?.data?.message || 'Failed to add to cart');
  }
};

// Update price calculation
const getCurrentPrice = () => {
  if (item.hasEggOption && selectedEggType) {
    return selectedEggType === 'EGG' ? item.eggPrice : item.egglessPrice;
  }
  return item.price;
};
```

### 3. Customer - Shop Page

Update `Shop.js` dialog to include variant selection similar to ItemDetail.

### 4. Customer - Cart Page

Update `Cart.js` to display egg type:

```javascript
<Typography variant="body2" color="textSecondary">
  {cartItem.item.name}
  {cartItem.eggType && (
    <Chip 
      label={cartItem.eggType === 'EGG' ? '🥚 Egg' : '🌱 Eggless'}
      size="small"
      style={{ marginLeft: '8px' }}
    />
  )}
</Typography>
```

## How It Works

### For Admin:
1. When creating/editing an item, check "Has Egg/Eggless Options"
2. Enter separate prices for egg and eggless variants
3. Enter separate stock quantities for each variant
4. Regular price and stock still apply for items without variants

### For Customers:
1. When viewing an item with variants, they must select either Egg or Eggless
2. The price updates based on their selection
3. Stock is checked for the specific variant
4. Cart shows which variant was selected
5. Same item with different variants appears as separate cart items

### Stock Management:
- Regular items: Uses `stock` field
- Egg variant: Uses `eggStock` field
- Eggless variant: Uses `egglessStock` field
- Each variant has independent stock tracking

## Testing Steps

1. **Run the SQL migration:**
   ```bash
   mysql -u root -p bakery_db < add_egg_variants.sql
   ```

2. **Restart Spring Boot backend**

3. **Test Admin Flow:**
   - Create a new item with egg/eggless options
   - Set different prices (e.g., Egg: ₹150, Eggless: ₹180)
   - Set stock for each variant

4. **Test Customer Flow:**
   - View the item detail page
   - Select egg variant and add to cart
   - Select eggless variant and add to cart
   - Verify both appear as separate items in cart
   - Complete checkout

## Notes

- Items without `hasEggOption=true` work exactly as before
- Egg/eggless selection is mandatory for items with variants
- Cart treats same item with different egg types as separate entries
- Order history preserves the egg type selection
- Stock is validated separately for each variant

