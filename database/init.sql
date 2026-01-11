-- Database initialization script
-- This script runs automatically when Docker container starts

USE bakery_db;

-- Set character set and collation
ALTER DATABASE bakery_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Enable strict mode for data integrity
SET GLOBAL sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- Set timezone
SET GLOBAL time_zone = '+05:30';

SELECT 'Database initialized successfully!' AS message;
