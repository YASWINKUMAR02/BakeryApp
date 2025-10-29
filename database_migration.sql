-- ============================================
-- Bakery App Database Migration
-- Purpose: Allow item deletion while preserving order history
-- Date: October 22, 2025
-- ============================================

USE bakery_db;

-- Step 1: Add item_name column if it doesn't exist
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS item_name VARCHAR(100);

-- Step 2: Populate item_name for all existing order items
UPDATE order_items oi
INNER JOIN items i ON oi.item_id = i.id
SET oi.item_name = i.name
WHERE oi.item_name IS NULL OR oi.item_name = '';

-- Step 3: Allow NULL for item_id column
ALTER TABLE order_items 
MODIFY COLUMN item_id INT NULL;

-- Step 4: Verify the changes
SELECT 'Migration completed successfully!' AS Status;

-- Step 5: Show updated schema
DESCRIBE order_items;

-- Step 6: Show sample data
SELECT 
    oi.id,
    oi.item_id,
    oi.item_name,
    oi.price,
    oi.quantity,
    o.status
FROM order_items oi
INNER JOIN orders o ON oi.order_id = o.id
LIMIT 5;
