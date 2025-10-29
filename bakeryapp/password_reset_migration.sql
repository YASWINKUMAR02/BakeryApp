-- Create password_reset_tokens table for email-based password reset functionality

CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    expiry_date DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_token ON password_reset_tokens(token);
CREATE INDEX idx_customer_id ON password_reset_tokens(customer_id);
CREATE INDEX idx_expiry_date ON password_reset_tokens(expiry_date);

-- Verify the table was created
SELECT 'password_reset_tokens table created successfully' AS status;
