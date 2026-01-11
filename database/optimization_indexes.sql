-- ========================================
-- DATABASE OPTIMIZATION - INDEXES
-- ========================================
-- Run this script to add performance indexes to your database
-- These indexes significantly improve query performance

USE bakery_db;

-- ========================================
-- ITEMS TABLE INDEXES
-- ========================================
-- Index on category_id for filtering by category
CREATE INDEX IF NOT EXISTS idx_items_category_id ON items(category_id);

-- Index on featured flag for homepage queries
CREATE INDEX IF NOT EXISTS idx_items_featured ON items(featured);

-- Index on availability for stock checks
CREATE INDEX IF NOT EXISTS idx_items_available ON items(available);

-- Composite index for category + availability
CREATE INDEX IF NOT EXISTS idx_items_category_available ON items(category_id, available);

-- Index on name for search queries
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);

-- ========================================
-- ORDERS TABLE INDEXES
-- ========================================
-- Index on customer_id for order history
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);

-- Index on status for filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Index on order_date for sorting
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);

-- Composite index for customer + status
CREATE INDEX IF NOT EXISTS idx_orders_customer_status ON orders(customer_id, status);

-- ========================================
-- ORDER_ITEMS TABLE INDEXES
-- ========================================
-- Index on order_id for joins
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Index on item_id for product analytics
CREATE INDEX IF NOT EXISTS idx_order_items_item_id ON order_items(item_id);

-- ========================================
-- ORDER_HISTORY TABLE INDEXES
-- ========================================
-- Index on customer_id for history queries
CREATE INDEX IF NOT EXISTS idx_order_history_customer_id ON order_history(customer_id);

-- Index on delivered_date for sorting
CREATE INDEX IF NOT EXISTS idx_order_history_delivered_date ON order_history(delivered_date);

-- ========================================
-- ORDER_HISTORY_ITEMS TABLE INDEXES
-- ========================================
-- Index on order_history_id for joins
CREATE INDEX IF NOT EXISTS idx_order_history_items_order_id ON order_history_items(order_history_id);

-- ========================================
-- CART TABLE INDEXES
-- ========================================
-- Index on customer_id for cart lookups
CREATE INDEX IF NOT EXISTS idx_carts_customer_id ON carts(customer_id);

-- ========================================
-- CART_ITEMS TABLE INDEXES
-- ========================================
-- Index on cart_id for cart operations
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);

-- Index on item_id for product lookups
CREATE INDEX IF NOT EXISTS idx_cart_items_item_id ON cart_items(item_id);

-- Composite index for cart + item (unique constraint)
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_item ON cart_items(cart_id, item_id);

-- ========================================
-- WISHLIST TABLE INDEXES
-- ========================================
-- Index on customer_id for wishlist queries
CREATE INDEX IF NOT EXISTS idx_wishlist_customer_id ON wishlist(customer_id);

-- Index on item_id for product analytics
CREATE INDEX IF NOT EXISTS idx_wishlist_item_id ON wishlist(item_id);

-- Composite index for customer + item (unique constraint)
CREATE INDEX IF NOT EXISTS idx_wishlist_customer_item ON wishlist(customer_id, item_id);

-- ========================================
-- REVIEWS TABLE INDEXES
-- ========================================
-- Index on item_id for product reviews
CREATE INDEX IF NOT EXISTS idx_reviews_item_id ON reviews(item_id);

-- Index on customer_id for user reviews
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON reviews(customer_id);

-- Index on rating for analytics
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- ========================================
-- COUPONS TABLE INDEXES
-- ========================================
-- Index on code for coupon validation
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);

-- Index on active flag for filtering
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);

-- Index on valid_from and valid_to for date range queries
CREATE INDEX IF NOT EXISTS idx_coupons_validity ON coupons(valid_from, valid_to);

-- ========================================
-- CUSTOMERS TABLE INDEXES
-- ========================================
-- Index on email for login queries (if not already unique)
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- ========================================
-- ADMIN TABLE INDEXES
-- ========================================
-- Index on email for login queries (if not already unique)
CREATE INDEX IF NOT EXISTS idx_admin_email ON admin(email);

-- ========================================
-- PASSWORD_RESET_TOKENS TABLE INDEXES
-- ========================================
-- Index on token for validation
CREATE INDEX IF NOT EXISTS idx_password_reset_token ON password_reset_tokens(token);

-- Index on customer_id for user lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_customer_id ON password_reset_tokens(customer_id);

-- Index on expiry_date for cleanup queries
CREATE INDEX IF NOT EXISTS idx_password_reset_expiry ON password_reset_tokens(expiry_date);

-- ========================================
-- VERIFY INDEXES
-- ========================================
SELECT 
    TABLE_NAME,
    INDEX_NAME,
    COLUMN_NAME,
    SEQ_IN_INDEX,
    INDEX_TYPE
FROM 
    INFORMATION_SCHEMA.STATISTICS
WHERE 
    TABLE_SCHEMA = 'bakery_db'
ORDER BY 
    TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

-- ========================================
-- ANALYZE TABLES
-- ========================================
-- Update table statistics for query optimizer
ANALYZE TABLE items;
ANALYZE TABLE categories;
ANALYZE TABLE orders;
ANALYZE TABLE order_items;
ANALYZE TABLE order_history;
ANALYZE TABLE order_history_items;
ANALYZE TABLE carts;
ANALYZE TABLE cart_items;
ANALYZE TABLE wishlist;
ANALYZE TABLE reviews;
ANALYZE TABLE coupons;
ANALYZE TABLE customers;
ANALYZE TABLE admin;

PRINT 'Database optimization indexes created successfully!';
