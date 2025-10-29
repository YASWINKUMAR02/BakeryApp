-- Add egg_type and selected_weight columns to order_history_items table
-- Run this SQL script in your MySQL database

USE bakery_db;

-- Add egg_type column to order_history_items
ALTER TABLE order_history_items ADD COLUMN egg_type VARCHAR(50);

-- Add selected_weight column to order_history_items  
ALTER TABLE order_history_items ADD COLUMN selected_weight DOUBLE;

-- Verify the changes
DESCRIBE order_history_items;

-- Check if data exists
SELECT * FROM order_history_items LIMIT 5;
