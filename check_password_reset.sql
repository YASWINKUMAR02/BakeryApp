-- Check if password_reset_tokens table exists
USE bakery_db;

SHOW TABLES LIKE 'password_reset_tokens';

-- If table exists, show its structure
DESCRIBE password_reset_tokens;

-- Check if there are any records
SELECT * FROM password_reset_tokens;

-- Verify customer exists
SELECT id, name, email FROM customers WHERE email = 'yaswin02@gmail.com';
