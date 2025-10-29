# 🔧 Troubleshooting Guide - Bakery App

## Current Issues & Solutions

### Issue 1: Cannot Delete Items from Cart (Customer)

#### Symptoms:
- Success message shows "Item removed from cart"
- Item doesn't disappear from the cart
- Page needs manual refresh

#### Root Cause:
- Database transaction not committing properly
- Frontend state not updating correctly
- Cache issues with JPA entities

#### Solution Applied:
1. **Backend (CartService.java)**:
   ```java
   - Remove item from cart's collection first
   - Delete cart item entity
   - Flush EntityManager
   - Proper logging at each step
   ```

2. **Frontend (Cart.js)**:
   ```javascript
   - Immediate state update (filter out item)
   - Fetch fresh cart data
   - Show success message
   ```

#### How to Test:
1. **Restart Backend**:
   ```bash
   cd bakeryapp
   mvnw clean spring-boot:run
   ```

2. **Clear Browser Cache**:
   - Press Ctrl+Shift+Delete
   - Clear cached images and files
   - Or use Incognito mode

3. **Test Cart Deletion**:
   - Add items to cart
   - Click delete icon
   - Confirm deletion
   - Check browser console (F12)
   - Check backend terminal logs

#### Expected Console Output:

**Backend Terminal:**
```
Attempting to remove cart item with ID: 5
Found cart item in cart: 1
Cart item 5 deleted successfully
GET request for cart of customer: 1
Fetched cart with 2 items for customer: 1
Returning cart with 2 items
```

**Browser Console:**
```
Attempting to remove cart item with ID: 5
Remove item response: {data: {success: true, message: "Cart item removed successfully"}}
Fetching cart for user: 1
Cart response: {success: true, data: {id: 1, items: [...]}}
Cart updated with items: 2
```

---

### Issue 2: Cannot Delete Items (Admin)

#### Symptoms:
- Error: "Cannot delete item. It exists in X order(s)"
- Even for delivered orders

#### Root Cause:
- Items that have been ordered should be preserved for order history
- This is intentional to maintain data integrity

#### Current Behavior:
✅ **Items CAN be deleted if**:
- Never been ordered
- Only in customer carts (carts are cleared automatically)

❌ **Items CANNOT be deleted if**:
- Exist in ANY orders (Pending, Confirmed, OR Delivered)
- This preserves complete order history

#### Alternative Solutions:

**Option 1: Soft Delete (Recommended)**
Instead of deleting, mark items as "inactive" or "discontinued":

```java
// Add to Item entity
@Column(nullable = false)
private Boolean active = true;

// In ItemService
public void deactivateItem(Integer id) {
    Item item = getItemById(id);
    item.setActive(false);
    itemRepository.save(item);
}

// Filter in queries
List<Item> getAllActiveItems() {
    return itemRepository.findByActiveTrue();
}
```

**Option 2: Archive System**
Move old items to an archive table instead of deleting.

**Option 3: Allow Deletion with Warning**
Let admins delete but show strong warning about losing order history.

#### Recommended Approach:
Use **Soft Delete** - This is the industry standard for e-commerce applications.

---

### Issue 3: TransientObjectException

#### Status: ✅ FIXED

#### What Was Done:
- Changed from individual deletes to batch `deleteAll()`
- Added proper EntityManager flush/clear sequence
- Added null checks
- Proper entity collection handling

---

## General Troubleshooting Steps

### 1. Backend Not Starting

**Check:**
```bash
# Verify Java version
java -version  # Should be 17+

# Verify MySQL is running
mysql -u root -p

# Check database exists
SHOW DATABASES;
```

**Fix:**
- Update `application.properties` with correct database credentials
- Create database if missing: `CREATE DATABASE bakery_db;`
- Check port 8080 is not in use

### 2. Frontend Not Loading

**Check:**
```bash
# Verify Node version
node -v  # Should be 16+

# Clear node_modules
rm -rf node_modules package-lock.json
npm install

# Check port 3000 is not in use
```

**Fix:**
- Clear browser cache
- Check console for errors (F12)
- Verify backend is running on port 8080

### 3. API Calls Failing

**Check:**
- Backend console for errors
- Network tab in browser (F12 → Network)
- CORS settings in backend
- API base URL in `api.js`

**Fix:**
```javascript
// In api.js, verify:
const API_BASE_URL = 'http://localhost:8080/api';
```

### 4. Database Issues

**Check:**
```sql
-- Verify tables exist
SHOW TABLES;

-- Check foreign keys
SELECT * FROM information_schema.KEY_COLUMN_USAGE 
WHERE TABLE_SCHEMA = 'bakery_db';

-- Check data
SELECT * FROM items;
SELECT * FROM cart_items;
SELECT * FROM order_items;
```

**Fix:**
- Drop and recreate database if structure is corrupted
- Let Hibernate auto-create tables (ddl-auto=update)

### 5. Cart Not Updating

**Checklist:**
- [ ] Backend logs show "Cart item deleted successfully"
- [ ] Frontend console shows "Cart updated with X items"
- [ ] No errors in browser console
- [ ] No errors in backend terminal
- [ ] Database shows item removed (check cart_items table)

**Debug Steps:**
1. Open browser console (F12)
2. Open Network tab
3. Click delete on cart item
4. Check DELETE request to `/api/cart/remove/{id}`
5. Verify response is 200 OK
6. Check GET request to `/api/cart/{customerId}`
7. Verify response has updated items

### 6. Item Deletion Not Working

**Expected Behavior:**
- If item never ordered → Deletes successfully
- If item in orders → Shows error message

**Debug:**
```sql
-- Check if item is in orders
SELECT o.id, o.status, oi.item_id, i.name
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
JOIN items i ON oi.item_id = i.id
WHERE i.id = YOUR_ITEM_ID;
```

---

## Quick Fixes

### Reset Everything
```bash
# Backend
cd bakeryapp
mvnw clean
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE bakery_db; CREATE DATABASE bakery_db;"
mvnw spring-boot:run

# Frontend
cd bakery-frontend
rm -rf node_modules package-lock.json
npm install
npm start
```

### Clear All Caches
```bash
# Browser: Ctrl+Shift+Delete → Clear everything

# Backend: Delete target folder
cd bakeryapp
rm -rf target

# Frontend: Delete build folder
cd bakery-frontend
rm -rf build node_modules
```

---

## Testing Checklist

### Cart Functionality
- [ ] Add item to cart
- [ ] Update quantity
- [ ] Remove item from cart
- [ ] Cart shows correct total
- [ ] Cart persists after refresh
- [ ] Empty cart shows appropriate message

### Item Management (Admin)
- [ ] Create new item with validation
- [ ] Update existing item
- [ ] Delete item (never ordered)
- [ ] Cannot delete item in orders
- [ ] Error messages are clear

### Order Flow
- [ ] Place order with delivery details
- [ ] View order history
- [ ] Admin can see all orders
- [ ] Admin can update order status
- [ ] Order details show correctly

---

## Common Error Messages

### "Cart item not found"
- Item was already deleted
- Refresh the page
- Check database for orphaned records

### "Item not found"
- Item was deleted
- Database inconsistency
- Check items table

### "Cannot delete item. It exists in X order(s)"
- **This is intentional** - preserves order history
- Use soft delete instead (mark as inactive)
- Or accept that ordered items cannot be deleted

### "Validation failed"
- Check form inputs
- Price must be > 0
- Weight must be > 0
- Name required
- Category required

---

## Performance Tips

1. **Add Database Indexes**:
```sql
CREATE INDEX idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX idx_cart_items_item_id ON cart_items(item_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_item_id ON order_items(item_id);
```

2. **Enable Query Logging** (Development only):
```properties
# application.properties
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

3. **Monitor Performance**:
- Check slow queries
- Use JOIN FETCH for related entities
- Implement pagination for large datasets

---

## Getting Help

### Check Logs
**Backend**: Look in terminal where Spring Boot is running
**Frontend**: Browser console (F12 → Console)
**Database**: MySQL logs

### Debug Mode
**Backend**:
```properties
logging.level.com.bakery.app=DEBUG
```

**Frontend**:
Add more console.log statements in problematic areas

---

## Contact & Support

If issues persist:
1. Check all logs (backend, frontend, database)
2. Verify all dependencies are installed
3. Ensure database schema is correct
4. Try with fresh database
5. Clear all caches

**Last Updated**: October 22, 2025
