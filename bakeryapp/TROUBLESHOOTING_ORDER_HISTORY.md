# Troubleshooting: Order History "Failed to fetch" Error

## Quick Fixes

### 1. Restart Spring Boot Application
The new entities need to be loaded. **Restart your backend server.**

```bash
# Stop the current server (Ctrl+C)
# Then restart it
mvn spring-boot:run
```

### 2. Verify Tables Were Created

Check if the tables exist in MySQL:

```sql
USE bakery_db;
SHOW TABLES;
```

You should see:
- `order_history`
- `order_history_items`

If tables don't exist, run:

```sql
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
```

### 3. Check Backend Logs

Look for errors in the Spring Boot console. Common issues:

**Error: Table doesn't exist**
- Solution: Run the SQL script above or restart with `spring.jpa.hibernate.ddl-auto=create` (WARNING: This will drop all tables)

**Error: Circular dependency**
- Solution: Already fixed with `@Lazy` annotations

**Error: Could not initialize proxy**
- Solution: Already fixed with `FetchType.EAGER` on orderItems

### 4. Test the Endpoint Directly

Open browser or Postman:

```
GET http://localhost:8080/api/order-history/all
```

Expected response:
```json
[]
```
(Empty array if no history yet)

### 5. Check CORS

If frontend can't connect:
- Verify backend is running on port 8080
- Check `@CrossOrigin(origins = "*")` is present in controller

### 6. Verify Frontend API URL

Check `bakery-frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Step-by-Step Verification

### Step 1: Backend Running?
```bash
# Check if Spring Boot is running
curl http://localhost:8080/api/order-history/all
```

### Step 2: Database Connected?
Check application.properties:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bakery_db
spring.datasource.username=root
spring.datasource.password=root
```

### Step 3: Tables Created?
```sql
SHOW TABLES LIKE 'order_history%';
```

### Step 4: Any Data?
```sql
SELECT COUNT(*) FROM order_history;
```

## Common Solutions

### Solution 1: Fresh Start
1. Stop backend
2. Drop and recreate tables:
   ```sql
   DROP TABLE IF EXISTS order_history_items;
   DROP TABLE IF EXISTS order_history;
   ```
3. Restart backend (tables will be auto-created)
4. Refresh frontend

### Solution 2: Manual Table Creation
If auto-creation fails, run the SQL script:
```bash
mysql -u root -p bakery_db < order_history_migration.sql
```

### Solution 3: Check Hibernate DDL
In `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

Look for CREATE TABLE statements in console logs.

## Still Not Working?

### Check Backend Console for:
1. **Port conflict**: Is port 8080 already in use?
2. **Database connection**: Can Spring Boot connect to MySQL?
3. **Entity errors**: Are there any JPA/Hibernate errors?

### Check Frontend Console for:
1. **Network errors**: Open DevTools → Network tab
2. **CORS errors**: Should see the request in Network tab
3. **404 errors**: Verify the URL is correct

## Quick Test

1. **Backend test**:
   ```bash
   curl http://localhost:8080/api/order-history/all
   ```

2. **Frontend test**:
   Open browser console and run:
   ```javascript
   fetch('http://localhost:8080/api/order-history/all')
     .then(r => r.json())
     .then(console.log)
   ```

## Need More Help?

Check the backend logs for the actual error message. The controller now prints detailed error information.
