-- ============================================
-- Step 2: Complete the migration
-- (item_name column already exists)
-- ============================================

USE bakery_db;

-- Populate item_name for existing records (if any are missing)
UPDATE order_items oi
INNER JOIN items i ON oi.item_id = i.id
SET oi.item_name = i.name
WHERE oi.item_name IS NULL OR oi.item_name = '';

-- THIS IS THE CRITICAL STEP: Allow NULL for item_id
ALTER TABLE order_items 
MODIFY COLUMN item_id INT NULL;

-- Verify the change
SELECT 'Migration completed!' AS Status;

-- Show the updated schema
DESCRIBE order_items;
