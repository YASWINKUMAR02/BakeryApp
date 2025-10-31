# Notification Role Filtering Fix

## Problem
Customers were receiving BOTH customer AND admin notifications because the system was only filtering by `userId`, not by `userRole`.

## Solution
Added `userRole` filtering throughout the entire notification system.

## Changes Made

### Backend Changes

**1. NotificationRepository.java**
- Changed: `findByUserIdOrderByCreatedAtDesc(Long userId)`
- To: `findByUserIdAndUserRoleOrderByCreatedAtDesc(Long userId, String userRole)`
- Same for unread and count methods

**2. NotificationService.java**
- Added `userRole` parameter to all methods:
  - `getAllNotificationsByUserId(Long userId, String userRole)`
  - `getUnreadNotificationsByUserId(Long userId, String userRole)`
  - `getUnreadCount(Long userId, String userRole)`

**3. NotificationController.java**
- Added `@RequestParam` for userRole in endpoints:
  - `GET /api/notifications/{userId}?userRole=CUSTOMER`
  - `GET /api/notifications/{userId}/unread?userRole=ADMIN`

### Frontend Changes

**4. api.js**
- Updated API calls to include userRole:
  ```javascript
  getAll: (userId, userRole) => api.get(`/notifications/${userId}?userRole=${userRole}`)
  ```

**5. Notifications.js**
- Pass user.role to API call:
  ```javascript
  const response = await notificationAPI.getAll(user.id, user.role);
  ```

## How It Works Now

### Customer Notifications
```
API Call: GET /api/notifications/2?userRole=CUSTOMER
Returns: Only notifications where userRole = 'CUSTOMER' AND userId = 2
```

### Admin Notifications
```
API Call: GET /api/notifications/1?userRole=ADMIN
Returns: Only notifications where userRole = 'ADMIN' AND userId = 1
```

## Testing

### 1. Restart Backend
```bash
cd bakeryapp
mvn spring-boot:run
```

### 2. Test Customer
- Login as customer
- Check browser console
- Should see: `📡 Notification API response for CUSTOMER: {...}`
- Should only see customer notifications (ORDER_PLACED, ORDER_CONFIRMED, etc.)

### 3. Test Admin
- Login as admin
- Check browser console
- Should see: `📡 Notification API response for ADMIN: {...}`
- Should only see admin notifications (new orders, low stock, etc.)

## Expected Behavior

✅ **Customer sees:**
- Your order #123 has been placed
- Your order #123 has been confirmed
- Your order #123 is out for delivery
- Your order #123 has been delivered

❌ **Customer does NOT see:**
- New order #123 received from John
- Low stock alert: Chocolate Cake

✅ **Admin sees:**
- New order #123 received from John
- Low stock alert: Chocolate Cake
- Order #123 delivered successfully

❌ **Admin does NOT see:**
- Your order #123 has been placed
- Your order #123 is out for delivery

## Database Query Examples

### Get Customer Notifications
```sql
SELECT * FROM notifications 
WHERE user_id = 2 AND user_role = 'CUSTOMER'
ORDER BY created_at DESC;
```

### Get Admin Notifications
```sql
SELECT * FROM notifications 
WHERE user_id = 1 AND user_role = 'ADMIN'
ORDER BY created_at DESC;
```

## Verification

After restarting backend, check console logs:

**Customer:**
```
📡 Notification API response for CUSTOMER: {success: true, data: [
  {userId: 2, userRole: "CUSTOMER", message: "Your order #123..."}
]}
✅ Loaded 1 notifications from backend
```

**Admin:**
```
📡 Notification API response for ADMIN: {success: true, data: [
  {userId: 1, userRole: "ADMIN", message: "New order #123..."}
]}
✅ Loaded 1 notifications from backend
```

## Fixed! 🎉

Customers will now ONLY see their own customer notifications, and admins will ONLY see admin notifications.
