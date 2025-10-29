-- Check if egg_stock and eggless_stock columns exist and have data
SELECT id, name, stock, egg_stock, eggless_stock 
FROM items 
LIMIT 10;
