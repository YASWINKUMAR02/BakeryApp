-- Migration script to create order history tables
-- Run this script to create the new order history tables

-- Create order_history table
CREATE TABLE IF NOT EXISTS order_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    order_date DATETIME NOT NULL,
    delivered_date DATETIME NOT NULL,
    total_amount DOUBLE NOT NULL,
    status VARCHAR(50) NOT NULL,
    delivery_address VARCHAR(500) NOT NULL,
    delivery_phone VARCHAR(20) NOT NULL,
    delivery_notes VARCHAR(500),
    INDEX idx_customer_id (customer_id),
    INDEX idx_order_date (order_date)
);

-- Create order_history_items table
CREATE TABLE IF NOT EXISTS order_history_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_history_id INT NOT NULL,
    item_id INT,
    item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    price DOUBLE NOT NULL,
    FOREIGN KEY (order_history_id) REFERENCES order_history(id) ON DELETE CASCADE,
    INDEX idx_order_history_id (order_history_id),
    INDEX idx_item_id (item_id)
);

-- Optional: Migrate existing delivered orders to history
-- Uncomment the following lines if you want to migrate existing delivered orders

-- INSERT INTO order_history (customer_id, customer_name, order_date, delivered_date, total_amount, status, delivery_address, delivery_phone, delivery_notes)
-- SELECT c.id, o.customer_name, o.order_date, NOW(), o.total_amount, o.status, o.delivery_address, o.delivery_phone, o.delivery_notes
-- FROM orders o
-- JOIN customers c ON o.customer_id = c.id
-- WHERE o.status = 'Delivered';

-- INSERT INTO order_history_items (order_history_id, item_id, item_name, quantity, price)
-- SELECT oh.id, oi.item_id, oi.item_name, oi.quantity, oi.price
-- FROM order_items oi
-- JOIN orders o ON oi.order_id = o.id
-- JOIN order_history oh ON o.customer_id = oh.customer_id AND o.order_date = oh.order_date
-- WHERE o.status = 'Delivered';

-- DELETE FROM orders WHERE status = 'Delivered';
