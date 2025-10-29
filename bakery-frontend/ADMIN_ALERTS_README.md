# Admin Order Alert System

## Overview
The admin alert system provides real-time notifications when new orders are placed by customers. It includes visual, audio, and browser notifications to ensure admins never miss an order.

## Features

### 1. **Visual Alert (Snackbar)**
- A prominent green gradient alert appears in the top-right corner when a new order is received
- Shows the order ID and customer name
- Includes a "View" button to quickly navigate to the orders page
- Auto-dismisses after 10 seconds
- Can be manually closed

### 2. **Audio Notification**
- Plays a pleasant beep sound when a new order arrives
- Uses Web Audio API for cross-browser compatibility
- Volume set to 30% to avoid being jarring

### 3. **Browser Notification**
- Desktop notification appears even when the browser tab is not active
- Shows order details with the bakery logo
- Requires user permission (requested automatically on first load)

### 4. **Sidebar Badge**
- Red pulsing badge on the "Orders" menu item
- Shows the count of unread order notifications
- Animates with a subtle pulse effect to draw attention

### 5. **Notification Bell**
- Standard notification bell in the admin header
- Shows total unread notifications count
- Clicking opens a dropdown with all notifications

## How It Works

### Notification Flow
1. Customer places an order via the Checkout page
2. `notifyAdminNewOrder()` is called from `Checkout.js`
3. Notification is stored in localStorage with key `notifications_ADMIN_1`
4. Custom event `notificationAdded` is dispatched
5. All alert components listen for this event and update accordingly

### Components

#### **AdminOrderAlert.js**
- Main alert component that shows the visual snackbar
- Polls localStorage every 5 seconds for new orders
- Plays audio and shows browser notifications
- Integrated into `AdminHeader.js`

#### **AdminSidebar.js**
- Enhanced with badge counter on Orders menu
- Tracks unread order notifications
- Updates in real-time when new orders arrive

#### **Notifications.js**
- Existing notification dropdown component
- Shows all notifications with timestamps
- Allows marking as read or deleting

### Storage Structure
```javascript
// localStorage key: notifications_ADMIN_1
[
  {
    id: 1729845600000,
    message: "New order #123 received from John Doe",
    type: "ORDER_PLACED",
    read: false,
    createdAt: "2024-10-24T10:30:00.000Z"
  }
]
```

## Configuration

### Admin ID
Currently hardcoded to admin ID `1`. To support multiple admins:
1. Update the storage key in all components
2. Get the actual admin ID from the auth context
3. Modify `notifyAdminNewOrder()` to notify all admins

### Polling Interval
- Alert component: 5 seconds
- Sidebar badge: 5 seconds
- Notification dropdown: 30 seconds

To change, modify the `setInterval` duration in respective components.

### Sound Settings
Audio volume is set to 0.3 (30%). To adjust:
```javascript
// In AdminOrderAlert.js
gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Change 0.3 to desired volume
```

## Testing

### Test New Order Alert
1. Log in as admin
2. In another browser/incognito window, log in as customer
3. Add items to cart and place an order
4. Admin should see:
   - Visual snackbar alert
   - Hear audio beep
   - See browser notification (if permitted)
   - Red badge on Orders menu
   - Notification in bell dropdown

### Browser Notification Permission
- First time: Browser will ask for notification permission
- If denied: Only visual and audio alerts will work
- To reset: Clear site permissions in browser settings

## Files Modified/Created

### New Files
- `/src/components/AdminOrderAlert.js` - Main alert component

### Modified Files
- `/src/components/AdminHeader.js` - Added AdminOrderAlert
- `/src/components/AdminSidebar.js` - Added badge counter
- `/src/context/ToastContext.js` - Updated toast colors

### Existing Files (No Changes Needed)
- `/src/utils/notificationUtils.js` - Already has notification functions
- `/src/components/Notifications.js` - Already handles notification display
- `/src/pages/customer/Checkout.js` - Already calls notification functions

## Future Enhancements

1. **Multi-Admin Support**: Notify all admins instead of just admin ID 1
2. **Sound Customization**: Allow admins to choose notification sound
3. **Do Not Disturb**: Add quiet hours setting
4. **Priority Levels**: Different alerts for urgent vs normal orders
5. **WebSocket Integration**: Replace polling with real-time WebSocket updates
6. **Mobile Push**: Add mobile push notifications via service workers

## Troubleshooting

### Alert Not Showing
- Check browser console for errors
- Verify localStorage has notifications
- Ensure admin is logged in with ID 1

### No Sound
- Check browser audio permissions
- Ensure volume is not muted
- Some browsers block audio without user interaction

### No Browser Notification
- Check notification permission in browser settings
- Ensure HTTPS (some browsers require secure context)
- Try clicking "Allow" when prompted

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Web Audio API and Notifications supported
- Mobile browsers: Visual alerts work, audio may be limited
