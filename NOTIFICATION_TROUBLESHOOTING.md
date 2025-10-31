# Notification System Troubleshooting Guide

## Quick Test Steps

### 1. Restart Backend Server
The backend needs to be restarted to load the new NotificationController.

```bash
# Stop the backend if running
# Then start it again
cd bakeryapp
mvn spring-boot:run
```

### 2. Check Database Table Created
The `notifications` table should be auto-created by JPA. Check your database:

```sql
SHOW TABLES LIKE 'notifications';
-- or
SELECT * FROM notifications;
```

### 3. Test Notification Flow

#### As Admin:
1. Open browser console (F12)
2. Login as admin
3. Go to Orders page
4. Change an order status to "Out for Delivery"
5. **Check console logs** - you should see:
   ```
   📤 Sending notification to customer: [ID] for order: [ID] status: Out for Delivery
   ✅ Notification sent successfully
   ```

#### As Customer:
1. Open **different browser or incognito window**
2. Login as the customer who placed the order
3. Open browser console (F12)
4. Wait up to 30 seconds (auto-refresh interval)
5. **Check console logs** - you should see:
   ```
   📡 Notification API response: {success: true, data: [...]}
   ✅ Loaded X notifications from backend
   ```
6. Check notification bell icon - should show badge with count

## Common Issues & Solutions

### Issue 1: "404 Not Found" on `/api/notifications`
**Cause:** Backend not restarted after adding NotificationController
**Solution:** Restart backend server

### Issue 2: "500 Internal Server Error"
**Cause:** Database table not created or entity mapping issue
**Solution:** 
- Check backend console for SQL errors
- Verify `spring.jpa.hibernate.ddl-auto` is set to `update` in application.properties
- Manually create table if needed:
```sql
CREATE TABLE notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    message VARCHAR(500) NOT NULL,
    type VARCHAR(100) NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL
);
```

### Issue 3: No console logs appearing
**Cause:** Browser console not open or logs cleared
**Solution:** 
- Open Developer Tools (F12)
- Go to Console tab
- Clear console and try again

### Issue 4: Notification sent but customer doesn't see it
**Cause:** Customer page not polling or wrong user ID
**Solution:**
- Check customer is logged in with correct account
- Verify customer ID matches the order's customer ID
- Wait 30 seconds for auto-refresh
- Manually refresh page

### Issue 5: CORS error in console
**Cause:** Backend CORS not configured for notification endpoints
**Solution:** NotificationController already has `@CrossOrigin(origins = "*")` - restart backend

## Manual Testing via API

### Test Create Notification
```bash
curl -X POST http://localhost:8080/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "userRole": "CUSTOMER",
    "message": "Test notification",
    "type": "ORDER_OUT_FOR_DELIVERY",
    "read": false
  }'
```

### Test Get Notifications
```bash
curl http://localhost:8080/api/notifications/1
```

Expected response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "userId": 1,
      "userRole": "CUSTOMER",
      "message": "Test notification",
      "type": "ORDER_OUT_FOR_DELIVERY",
      "read": false,
      "createdAt": "2025-10-30T21:00:00"
    }
  ]
}
```

## Debug Checklist

- [ ] Backend server restarted
- [ ] Database table `notifications` exists
- [ ] Admin console shows "✅ Notification sent successfully"
- [ ] Customer console shows "✅ Loaded X notifications from backend"
- [ ] Customer ID in notification matches order customer ID
- [ ] No CORS errors in console
- [ ] No 404/500 errors in Network tab
- [ ] Notification bell icon visible in customer header
- [ ] Badge count updates when notification received

## Still Not Working?

1. **Check Backend Logs:**
   - Look for errors when creating notification
   - Verify NotificationController is loaded
   - Check database connection

2. **Check Network Tab:**
   - Open DevTools > Network
   - Filter by "notifications"
   - Check request/response for errors

3. **Check Database:**
   ```sql
   SELECT * FROM notifications WHERE user_id = [CUSTOMER_ID];
   ```

4. **Verify Order Customer ID:**
   ```sql
   SELECT id, customer_id FROM orders WHERE id = [ORDER_ID];
   ```

## Expected Console Output

### Admin Side (when updating order):
```
📤 Sending notification to customer: 2 for order: 123 status: Out for Delivery
✅ Notification sent to backend for user: 2
✅ Notification sent successfully
```

### Customer Side (when polling):
```
📡 Notification API response: {success: true, data: Array(1)}
✅ Loaded 1 notifications from backend
```

If you see these logs, the system is working correctly! 🎉
