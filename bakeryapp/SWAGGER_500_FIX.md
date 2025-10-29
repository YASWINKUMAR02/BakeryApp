# 🔧 Swagger 500 Error - Troubleshooting Guide

## Problem
Getting 500 error when accessing `/api-docs`

## Possible Causes & Solutions

### Solution 1: Use H2 Database (Recommended for Testing)

If MySQL is not running or not configured, use H2 in-memory database:

```bash
# Run with H2 profile
mvn spring-boot:run -Dspring-boot.run.profiles=h2
```

Or in your IDE, set active profile to `h2`

**Benefits:**
- No MySQL installation needed
- Works immediately
- Perfect for testing Swagger
- Access H2 Console at: `http://localhost:8080/h2-console`

### Solution 2: Ensure MySQL is Running

If you want to use MySQL:

1. **Start MySQL Server**
   ```bash
   # Windows - Start MySQL service
   net start MySQL80
   
   # Or use MySQL Workbench/XAMPP
   ```

2. **Create Database** (if not auto-created)
   ```sql
   CREATE DATABASE bakery_db;
   ```

3. **Update Credentials** in `application.properties`
   ```properties
   spring.datasource.username=YOUR_USERNAME
   spring.datasource.password=YOUR_PASSWORD
   ```

### Solution 3: Check Application Logs

Look for the actual error in console output:

```bash
mvn spring-boot:run
```

Common errors:
- `Communications link failure` → MySQL not running
- `Access denied` → Wrong username/password
- `Unknown database` → Database doesn't exist
- `StackOverflowError` → Circular reference (already fixed)

## Quick Test Steps

### Option A: Test with H2 (Easiest)

1. **Run with H2 profile:**
   ```bash
   mvn clean install
   mvn spring-boot:run -Dspring-boot.run.profiles=h2
   ```

2. **Access Swagger:**
   - http://localhost:8080/swagger-ui.html
   - http://localhost:8080/api-docs

3. **Access H2 Console** (optional):
   - URL: http://localhost:8080/h2-console
   - JDBC URL: `jdbc:h2:mem:bakery_db`
   - Username: `sa`
   - Password: (leave empty)

### Option B: Test with MySQL

1. **Ensure MySQL is running**

2. **Run application:**
   ```bash
   mvn spring-boot:run
   ```

3. **Check logs** for any database connection errors

4. **Access Swagger:**
   - http://localhost:8080/swagger-ui.html
   - http://localhost:8080/api-docs

## Debugging Commands

### Check if MySQL is running (Windows)
```powershell
Get-Service MySQL*
```

### Check MySQL connection
```bash
mysql -u root -p
```

### View application logs with more detail
```bash
mvn spring-boot:run -Dlogging.level.org.springframework=DEBUG
```

## What We've Fixed

1. ✅ Added `@JsonIgnore` to prevent circular references
2. ✅ Added `@JsonProperty(WRITE_ONLY)` for passwords
3. ✅ Configured Jackson serialization settings
4. ✅ Disabled `open-in-view` to prevent lazy loading issues
5. ✅ Added H2 database as fallback option
6. ✅ Added debug logging for Springdoc
7. ✅ Added `@Schema` annotations for better Swagger documentation

## Still Getting 500?

If you're still getting a 500 error:

1. **Stop the application** (Ctrl+C)

2. **Clean and rebuild:**
   ```bash
   mvn clean install
   ```

3. **Run with H2 profile:**
   ```bash
   mvn spring-boot:run -Dspring-boot.run.profiles=h2
   ```

4. **Check the console output** for the actual error message

5. **Share the error message** from the console - it will show the root cause

## Expected Behavior

When working correctly, you should see:
- Swagger UI loads at `/swagger-ui.html`
- All 7 controllers visible (Category, Item, Customer, Cart, Order, Admin, Review)
- API docs JSON at `/api-docs`
- No 500 errors

## Next Steps

Once Swagger is working:
1. Test the APIs using Swagger UI
2. Create some test data
3. Switch back to MySQL for production use (if needed)

---

**Try running with H2 profile first - it's the quickest way to test Swagger!** 🚀
