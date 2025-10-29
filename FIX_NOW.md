# ⚠️ URGENT FIX - Database Migration Required

## Error You're Seeing
```
Column 'item_id' cannot be null
```

## Why This Happens
The database table `order_items` still has a NOT NULL constraint on `item_id` column. You MUST update the database schema before item deletion will work.

---

## 🚀 SOLUTION - Choose ONE Method

### Method 1: Automatic (Easiest) ⭐

1. **Double-click** `run_migration.bat`
2. Enter your MySQL username (usually `root`)
3. Enter your MySQL password
4. Wait for "Migration completed successfully!"
5. **Restart backend**

---

### Method 2: MySQL Workbench (Visual)

1. **Open MySQL Workbench**
2. **Connect** to your database
3. **Click** "File" → "Open SQL Script"
4. **Select** `database_migration.sql`
5. **Click** Execute (⚡ lightning icon)
6. **Check** output shows "Migration completed successfully!"
7. **Restart backend**

---

### Method 3: Command Line (Manual)

**Step 1:** Open Command Prompt

**Step 2:** Run these commands:
```bash
mysql -u root -p
```

**Step 3:** Enter your password

**Step 4:** Copy and paste these SQL commands:
```sql
USE bakery_db;

-- Add item_name column
ALTER TABLE order_items 
ADD COLUMN item_name VARCHAR(100);

-- Populate existing data
UPDATE order_items oi
INNER JOIN items i ON oi.item_id = i.id
SET oi.item_name = i.name;

-- Allow NULL
ALTER TABLE order_items 
MODIFY COLUMN item_id INT NULL;

-- Verify
DESCRIBE order_items;
```

**Step 5:** You should see:
```
item_id   | int          | YES  | MUL | NULL
item_name | varchar(100) | YES  |     | NULL
```

**Step 6:** Type `exit` and press Enter

**Step 7:** **Restart backend**

---

## ✅ Verify Migration Worked

Run this in MySQL:
```sql
USE bakery_db;
DESCRIBE order_items;
```

**Look for:**
- `item_id` → **Null: YES** ✅
- `item_name` → **Type: varchar(100)** ✅

If you see both, migration succeeded!

---

## 🔄 After Migration

### 1. Restart Backend
```bash
cd c:\GaMes\BakeryApp\bakeryapp
mvnw spring-boot:run
```

### 2. Test Item Deletion

**Test Case 1: Item in Delivered Orders**
1. Go to Admin → Orders
2. Find an order with status "Pending" or "Confirmed"
3. Change status to "Delivered"
4. Go to Admin → Items
5. Click delete on an item from that order
6. **Expected:** ✅ Item deleted successfully!

**Test Case 2: Item in Active Orders**
1. Go to Admin → Items
2. Try to delete an item in a Pending order
3. **Expected:** ❌ Error: "Cannot delete item. It exists in X active order(s)"

**Test Case 3: View Order History**
1. Go to Orders (Customer or Admin)
2. View an order with a deleted item
3. **Expected:** Shows item name with "(discontinued)" or "(item deleted)"

---

## 🐛 Troubleshooting

### Problem: "Access denied for user"
**Solution:** Check your MySQL username and password

### Problem: "Unknown database 'bakery_db'"
**Solution:** Create the database first:
```sql
CREATE DATABASE bakery_db;
```

### Problem: "Table 'order_items' doesn't exist"
**Solution:** Run your Spring Boot app once to create tables, then run migration

### Problem: Still getting "cannot be null" error
**Solution:** 
1. Verify migration ran: `DESCRIBE order_items;`
2. Restart backend completely (stop and start)
3. Clear browser cache

### Problem: "Column 'item_name' already exists"
**Solution:** That's OK! Just run the ALTER for item_id:
```sql
ALTER TABLE order_items MODIFY COLUMN item_id INT NULL;
```

---

## 📊 What This Migration Does

| Before | After |
|--------|-------|
| ❌ Cannot delete items in orders | ✅ Can delete items in delivered orders |
| ❌ "Column cannot be null" error | ✅ No errors |
| ❌ Lose order history | ✅ Order history preserved |
| - | ✅ Shows item name even after deletion |

---

## ⚡ Quick Command Reference

**Check if migration needed:**
```sql
SHOW COLUMNS FROM order_items WHERE Field = 'item_id';
```
If shows `Null: NO` → Need migration
If shows `Null: YES` → Already migrated ✅

**Run migration:**
```bash
mysql -u root -p bakery_db < database_migration.sql
```

**Verify migration:**
```sql
SELECT 
    COLUMN_NAME, 
    IS_NULLABLE, 
    DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'order_items' 
AND COLUMN_NAME IN ('item_id', 'item_name');
```

---

## 🎯 Summary

1. ✅ Run database migration (choose one method above)
2. ✅ Verify migration succeeded
3. ✅ Restart backend
4. ✅ Test item deletion
5. ✅ Done!

**The migration takes less than 1 minute to run!**

---

## 📞 Still Having Issues?

If you've run the migration and restarted but still getting errors:

1. **Check backend logs** - Look for "Database migration required"
2. **Check database** - Run `DESCRIBE order_items;`
3. **Check connection** - Ensure backend connects to correct database
4. **Try fresh start** - Stop backend, run migration again, start backend

---

**After migration, everything will work perfectly!** 🎉
