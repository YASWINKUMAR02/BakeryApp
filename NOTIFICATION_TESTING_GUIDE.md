# Notification Testing Guide

## Problem: Only ORDER_CONFIRMED notification appearing

This guide will help you test and verify all notification types are working.

## Setup for Testing

### 1. Open Two Browser Windows
- **Window 1:** Admin (Chrome normal)
- **Window 2:** Customer (Chrome Incognito or different browser)

### 2. Open Browser Console in Both (F12)
This is CRITICAL - you need to see the logs!

### 3. Make Sure Backend is Running
```bash
cd c:\GaMes\BakeryApp\bakeryapp
mvn spring-boot:run
```

---

## Step-by-Step Testing

### Test 1: Order Placement Notification

**Customer Window:**
1. Login as customer
2. Add items to cart
3. Go to checkout and place order
4. **Check console** - Should see:
   ```
   ✅ Notification sent to backend for user: [CUSTOMER_ID]
   ```

**Admin Window:**
1. Should receive notification: `"New order #[ID] received from [Name]"`
2. Check console for:
   ```
   📡 Notification API response for ADMIN: {...}
   ✅ Loaded X notifications from backend
   ```

---

### Test 2: Order Confirmed Notification

**Admin Window:**
1. Go to Orders page
2. Find the order
3. Change status dropdown to **"Confirmed"**
4. **Check console** - Should see:
   ```
   🔍 Order details: {orderId: 123, customerId: 2, customerName: "John", newStatus: "Confirmed"}
   📤 Sending notification to customer: 2 for order: 123 status: Confirmed
   ✅ Notification sent successfully
   ```

**Customer Window:**
1. Wait up to 30 seconds (auto-refresh)
2. OR refresh the page manually
3. Check notification bell - should show badge
4. **Check console** - Should see:
   ```
   📡 Notification API response for CUSTOMER: {success: true, data: [...]}
   ✅ Loaded 1 notifications from backend
   ```
5. Click bell - should see: `"Your order #123 has been confirmed"`

---

### Test 3: Order Packed Notification

**Admin Window:**
1. Change same order status to **"Packed"**
2. **Check console** - Should see:
   ```
   🔍 Order details: {orderId: 123, customerId: 2, customerName: "John", newStatus: "Packed"}
   📤 Sending notification to customer: 2 for order: 123 status: Packed
   ✅ Notification sent successfully
   ```

**Customer Window:**
1. Wait 30 seconds OR refresh
2. Check console for new notification fetch
3. Click bell - should see: `"Your order #123 has been packed and is ready for delivery"`

---

### Test 4: Out for Delivery Notification

**Admin Window:**
1. Change status to **"Out for Delivery"**
2. **Check console** - Should see:
   ```
   🔍 Order details: {orderId: 123, customerId: 2, customerName: "John", newStatus: "Out for Delivery"}
   📤 Sending notification to customer: 2 for order: 123 status: Out for Delivery
   ✅ Notification sent successfully
   ```

**Customer Window:**
1. Wait 30 seconds OR refresh
2. Click bell - should see: `"Your order #123 is out for delivery"`
3. Check Orders page - status stepper should show "Out for Delivery" highlighted

---

### Test 5: Order Delivered Notification

**Admin Window:**
1. Change status to **"Delivered"**
2. **Check console** - Should see TWO notifications sent:
   ```
   📤 Sending notification to customer: 2 for order: 123 status: Delivered
   ✅ Notification sent successfully
   ```
3. Admin should also receive: `"Order #123 delivered successfully"`

**Customer Window:**
1. Wait 30 seconds OR refresh
2. Click bell - should see: `"Your order #123 has been delivered"`

---

## Troubleshooting

### Issue: No console logs appearing

**Solution:**
- Make sure Developer Tools (F12) is open
- Go to "Console" tab
- Clear console and try again

---

### Issue: "⚠️ No customer ID found for order"

**Cause:** Order doesn't have customer information loaded

**Solution:**
1. Check admin console for the log:
   ```
   🔍 Order details: {orderId: 123, customerId: undefined, ...}
   ```
2. If customerId is undefined, the order fetch is broken
3. Check backend logs for order fetch errors
4. Verify database has customer_id in orders table:
   ```sql
   SELECT id, customer_id FROM orders WHERE id = 123;
   ```

---

### Issue: "❌ Failed to send notification: [error]"

**Cause:** Backend API error

**Solutions:**

**A. Check Backend is Running**
```bash
# Should see: Started BakeryAppApplication
```

**B. Check Backend Logs**
Look for errors when notification is created

**C. Test API Manually**
```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 2,
    "userRole": "CUSTOMER",
    "message": "Test notification",
    "type": "ORDER_CONFIRMED",
    "read": false
  }'
```

Expected response:
```json
{"success": true, "message": "Notification created successfully"}
```

**D. Check Database Table Exists**
```sql
SHOW TABLES LIKE 'notifications';
SELECT * FROM notifications;
```

---

### Issue: Customer not receiving notifications

**Possible Causes:**

**1. Customer not waiting long enough**
- Notifications poll every 30 seconds
- Solution: Wait or refresh page manually

**2. Wrong customer logged in**
- Check customer ID matches order's customer ID
- Solution: Login with correct customer account

**3. Browser cache**
- Old localStorage data
- Solution: Clear browser cache or use incognito

**4. API returning empty**
- Check customer console:
  ```
  📡 Notification API response for CUSTOMER: {success: true, data: []}
  ```
- If empty, check database:
  ```sql
  SELECT * FROM notifications WHERE user_id = 2 AND user_role = 'CUSTOMER';
  ```

---

### Issue: Customer seeing admin notifications

**Cause:** userRole filtering not working

**Solution:**
1. Verify backend restarted after code changes
2. Check API URL in console includes `?userRole=CUSTOMER`
3. Check database - notifications should have correct user_role:
   ```sql
   SELECT user_id, user_role, message FROM notifications;
   ```

---

## Quick Verification Checklist

Before testing, verify:

- [ ] Backend server is running
- [ ] Database table `notifications` exists
- [ ] Browser console is open (F12) in both windows
- [ ] Admin logged in as admin
- [ ] Customer logged in as customer (different browser/incognito)
- [ ] At least one order exists with items

---

## Expected Console Output

### Admin Side (when changing status):
```
🔍 Order details: {orderId: 123, customerId: 2, customerName: "John Doe", newStatus: "Packed"}
📤 Sending notification to customer: 2 for order: 123 status: Packed
✅ Notification sent to backend for user: 2
✅ Notification sent successfully
```

### Customer Side (when receiving):
```
📡 Notification API response for CUSTOMER: {success: true, data: Array(3)}
✅ Loaded 3 notifications from backend
```

---

## Database Verification

Check notifications are being created:

```sql
-- See all notifications
SELECT 
    id,
    user_id,
    user_role,
    message,
    type,
    is_read,
    created_at
FROM notifications
ORDER BY created_at DESC
LIMIT 10;

-- Count by type
SELECT type, COUNT(*) as count
FROM notifications
GROUP BY type;

-- Check specific customer's notifications
SELECT message, type, is_read, created_at
FROM notifications
WHERE user_id = 2 AND user_role = 'CUSTOMER'
ORDER BY created_at DESC;
```

---

## If Still Not Working

1. **Share the console logs** from both admin and customer windows
2. **Share the database query results** for notifications table
3. **Check backend logs** for any errors
4. **Verify order has customer_id** in database

The console logs will tell us exactly where the problem is! 🔍
