# IMPORTANT: Run Database Migration

## The egg/eggless stock feature is NOT working because the database columns don't exist yet!

### Step 1: Run the SQL Migration

**Option A: Using MySQL Command Line**
```bash
mysql -u root -p bakery_db < add_egg_variants.sql
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Connect to your database
3. Open the file `add_egg_variants.sql`
4. Click "Execute" (lightning bolt icon)

**Option C: Using phpMyAdmin**
1. Open phpMyAdmin
2. Select `bakery_db` database
3. Go to SQL tab
4. Copy and paste the contents of `add_egg_variants.sql`
5. Click "Go"

### Step 2: Restart Spring Boot Backend

After running the migration, restart your Spring Boot application.

### Step 3: Test

1. Go to Admin Items page
2. Add/Edit an item
3. Set Egg Stock and Eggless Stock
4. Save
5. Check if the stocks appear in the table

### What the Migration Does:

Adds these columns to `items` table:
- `egg_price` - Price for egg variant
- `eggless_price` - Price for eggless variant  
- `has_egg_option` - Boolean flag
- `egg_stock` - Stock for egg variant ✅
- `eggless_stock` - Stock for eggless variant ✅

Adds `egg_type` column to:
- `cart_items` table
- `order_items` table

### Verify Migration Success:

Run this query to check if columns exist:
```sql
DESCRIBE items;
```

You should see `egg_stock` and `eggless_stock` in the output.

