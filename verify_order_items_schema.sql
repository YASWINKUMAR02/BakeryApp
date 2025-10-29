-- Verify and Update order_items table schema
-- Run this to check if egg_type and selected_weight columns exist

-- Check current schema
DESCRIBE order_items;

-- Add egg_type column if it doesn't exist
-- (This will error if column already exists, which is fine)
ALTER TABLE order_items ADD COLUMN egg_type VARCHAR(50);

-- Add selected_weight column if it doesn't exist
-- (This will error if column already exists, which is fine)
ALTER TABLE order_items ADD COLUMN selected_weight DOUBLE;

-- Verify the schema again
DESCRIBE order_items;

-- Check sample data to see if eggType and selectedWeight are being saved
SELECT id, item_name, quantity, price, egg_type, selected_weight 
FROM order_items 
ORDER BY id DESC 
LIMIT 10;
