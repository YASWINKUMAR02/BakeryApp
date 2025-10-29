-- Add egg/eggless variant columns to items table
ALTER TABLE items 
ADD COLUMN egg_price DOUBLE,
ADD COLUMN eggless_price DOUBLE,
ADD COLUMN has_egg_option BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN egg_stock INT DEFAULT 0,
ADD COLUMN eggless_stock INT DEFAULT 0;

-- Update existing items to have default values
UPDATE items SET has_egg_option = FALSE WHERE has_egg_option IS NULL;
UPDATE items SET egg_stock = 0 WHERE egg_stock IS NULL;
UPDATE items SET eggless_stock = 0 WHERE eggless_stock IS NULL;

-- Add egg_type column to cart_items table
ALTER TABLE cart_items 
ADD COLUMN egg_type VARCHAR(20);

-- Add egg_type column to order_items table (if exists)
ALTER TABLE order_items 
ADD COLUMN egg_type VARCHAR(20);
