# Troubleshooting Egg/Eggless Stocks Not Working

## Issue: Egg and Eggless stocks not saving or displaying

### Step 1: Verify Database Columns Exist ✅

Run this query:
```sql
mysql -u root -p bakery_db < check_egg_stocks.sql
```

You should see columns: `id`, `name`, `stock`, `egg_stock`, `eggless_stock`

### Step 2: Restart Spring Boot Backend ⚠️ IMPORTANT

**The backend MUST be restarted after database changes!**

1. Stop your Spring Boot application (Ctrl+C in terminal)
2. Start it again:
   ```bash
   cd bakeryapp
   mvn spring-boot:run
   ```
   OR if using IDE, click Stop and then Run again

3. Wait for the message: "Started BakeryApplication in X seconds"

### Step 3: Clear Browser Cache

1. Open browser DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

OR

1. Close all browser tabs with the app
2. Reopen the app

### Step 4: Test the Feature

1. **Admin Side:**
   - Go to Admin Items page
   - Click "Add Item" or "Edit" existing item
   - Scroll down to "Variant Stock (Optional)" section
   - Enter values:
     - Egg Stock: 15
     - Eggless Stock: 8
   - Click Save
   - Check if the table shows the stocks

2. **Check Database:**
   ```sql
   SELECT id, name, stock, egg_stock, eggless_stock FROM items WHERE id = [item_id];
   ```
   Replace [item_id] with the actual item ID

3. **Customer Side:**
   - Go to item detail page
   - Check the eggless checkbox
   - Try to add to cart
   - Should not show "Insufficient stock" error

### Step 5: Check Browser Console for Errors

1. Open DevTools (F12)
2. Go to Console tab
3. Look for any red errors
4. Check Network tab when saving an item
5. Look at the request payload - should include `eggStock` and `egglessStock`

### Common Issues:

**Issue 1: Backend not restarted**
- Solution: Stop and restart Spring Boot

**Issue 2: Old data in browser**
- Solution: Hard refresh (Ctrl+Shift+R)

**Issue 3: Database connection issue**
- Solution: Check Spring Boot console for errors

**Issue 4: Fields not in request**
- Solution: Check browser Network tab, verify payload includes egg stocks

### Verify Everything is Working:

✅ Database has columns (check_egg_stocks.sql shows them)
✅ Backend restarted after database changes
✅ Admin form shows "Variant Stock" section
✅ Values save when you click Save
✅ Table displays the stocks
✅ Customer can select eggless option
✅ No "Insufficient stock" errors

### Debug Commands:

**Check if backend is receiving the data:**
Add this to ItemController or ItemService (temporarily):
```java
System.out.println("Egg Stock: " + item.getEggStock());
System.out.println("Eggless Stock: " + item.getEgglessStock());
```

**Check database directly:**
```sql
-- See all items with their stocks
SELECT id, name, stock, egg_stock, eggless_stock FROM items;

-- Update a specific item manually to test
UPDATE items SET egg_stock = 15, eggless_stock = 8 WHERE id = 1;
```

### If Still Not Working:

1. Share the Spring Boot console output
2. Share the browser console errors
3. Share the Network tab request payload
4. Run: `SELECT * FROM items WHERE id = 1;` and share the result

