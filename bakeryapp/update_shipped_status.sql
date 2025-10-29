-- Migration script to update "Shipped" status to "Out for Delivery"
-- Run this script to update existing orders in the database

-- Update orders table
UPDATE orders 
SET status = 'Out for Delivery' 
WHERE status = 'Shipped';

-- Update order_history table (if it exists and has shipped orders)
UPDATE order_history 
SET status = 'Out for Delivery' 
WHERE status = 'Shipped';

-- Verify the changes
SELECT 'Orders updated:' as message, COUNT(*) as count 
FROM orders 
WHERE status = 'Out for Delivery';

SELECT 'Order history updated:' as message, COUNT(*) as count 
FROM order_history 
WHERE status = 'Out for Delivery';
