# Database Schema Update - Item Deletion Enhancement

## What Changed

The database schema has been updated to allow items to be deleted even if they exist in delivered orders, while preserving complete order history.

## Changes Made

### 1. OrderItem Entity
- `item_id` column changed from `NOT NULL` to `NULL`
- Added `item_name` column (VARCHAR 100) to store item name for history

### 2. Migration Required

If you have existing data, you need to update the database:

```sql
-- Step 1: Add item_name column
ALTER TABLE order_items 
ADD COLUMN item_name VARCHAR(100);

-- Step 2: Populate item_name for existing records
UPDATE order_items oi
JOIN items i ON oi.item_id = i.id
SET oi.item_name = i.name;

-- Step 3: Allow NULL for item_id
ALTER TABLE order_items 
MODIFY COLUMN item_id INT NULL;
```

## How It Works Now

### Before (Old Behavior):
- ❌ Cannot delete items if they exist in ANY orders
- Error: "Cannot delete item. It exists in X order(s)"

### After (New Behavior):
- ✅ Can delete items if all orders are delivered
- ❌ Cannot delete if item in Pending/Confirmed orders
- ✅ Order history preserved with item name and price
- ✅ Item reference set to NULL in delivered orders

## Example Scenarios

### Scenario 1: Item in Active Orders
```
Item: "Chocolate Cake"
Orders: 
  - Order #1: Pending
  - Order #2: Delivered

Result: ❌ Cannot delete
Message: "Cannot delete item. It exists in 1 active order(s) (Pending/Confirmed)"
```

### Scenario 2: Item Only in Delivered Orders
```
Item: "Vanilla Cupcake"
Orders:
  - Order #1: Delivered
  - Order #2: Delivered

Result: ✅ Can delete
Process:
  1. Set item_id = NULL in order_items
  2. Keep item_name, price, quantity
  3. Delete item from items table
  4. Order history preserved
```

### Scenario 3: Item Never Ordered
```
Item: "New Pastry"
Orders: None

Result: ✅ Can delete immediately
```

## Order Display

### Customer View:
- Active items: Shows item name normally
- Deleted items: Shows stored name + "(discontinued)"

### Admin View:
- Active items: Shows item name normally
- Deleted items: Shows stored name + "(item deleted)"

## Benefits

1. **Flexibility**: Admins can delete old/discontinued items
2. **Data Integrity**: Complete order history preserved
3. **User Experience**: Customers can still see what they ordered
4. **Compliance**: Maintains financial records

## Testing

### Test Case 1: Delete Item with Delivered Orders
```
1. Create item "Test Cake"
2. Place order with "Test Cake"
3. Mark order as "Delivered"
4. Try to delete "Test Cake"
Expected: ✅ Success
5. View order history
Expected: Shows "Test Cake (discontinued)"
```

### Test Case 2: Delete Item with Pending Orders
```
1. Create item "Test Cookie"
2. Place order with "Test Cookie"
3. Order status: "Pending"
4. Try to delete "Test Cookie"
Expected: ❌ Error message
```

### Test Case 3: View Old Orders After Item Deletion
```
1. View order from before item deletion
Expected: 
  - Item name displayed
  - Price displayed correctly
  - Quantity displayed correctly
  - "(discontinued)" or "(item deleted)" label shown
```

## Rollback (If Needed)

If you need to revert this change:

```sql
-- Step 1: Re-populate item_id for NULL records (if possible)
-- This will fail if items are permanently deleted

-- Step 2: Make item_id NOT NULL again
ALTER TABLE order_items 
MODIFY COLUMN item_id INT NOT NULL;

-- Step 3: Remove item_name column
ALTER TABLE order_items 
DROP COLUMN item_name;
```

**Note**: Rollback is only possible if items haven't been deleted yet.

## Important Notes

1. **Backup First**: Always backup your database before running migrations
2. **Test Environment**: Test this in development before production
3. **Existing Orders**: All existing orders will continue to work normally
4. **New Orders**: Will automatically store item names
5. **Performance**: No performance impact on queries

## Verification

After applying changes, verify:

```sql
-- Check schema
DESCRIBE order_items;

-- Should show:
-- item_id: INT, NULL allowed
-- item_name: VARCHAR(100)

-- Check existing data
SELECT 
    oi.id,
    oi.item_id,
    oi.item_name,
    oi.price,
    oi.quantity,
    o.status
FROM order_items oi
JOIN orders o ON oi.order_id = o.id
LIMIT 10;
```

## Support

If you encounter issues:
1. Check database logs
2. Verify schema changes applied correctly
3. Ensure all existing order_items have item_name populated
4. Check application logs for errors

---

**Last Updated**: October 22, 2025
**Version**: 2.0.0
**Breaking Changes**: Database schema modification required
