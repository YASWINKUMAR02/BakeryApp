# 🌙 Offline Mode Feature

## ✅ What Was Added

Your website now automatically detects when the backend server is offline and shows a professional "Website Currently Not Available" page.

---

## 🎯 How It Works

### **When Backend is Online (9 AM - 9 PM):**
✅ Website works normally
✅ All features available
✅ Customers can browse and order

### **When Backend is Offline (9 PM - 9 AM):**
🌙 Shows professional offline notice
🕐 Displays business hours (9 AM - 9 PM)
🔄 "Try Again" button to refresh
⏰ Automatic check every 30 seconds

---

## 📁 Files Created

### **1. OfflineNotice.js**
`bakery-frontend/src/components/OfflineNotice.js`

Beautiful offline page with:
- 🔴 WiFi off icon
- 📝 Clear message
- 🕐 Business hours display
- 🔄 Try Again button

### **2. checkBackendStatus.js**
`bakery-frontend/src/utils/checkBackendStatus.js`

Backend status checker:
- Checks if backend is responding
- 5 second timeout
- Retry logic (2 attempts)
- Network error handling

### **3. App.js (Modified)**
Added backend status checking:
- Checks on app load
- Rechecks every 30 seconds
- Shows offline notice when down
- Automatic reconnect when back online

---

## 🔄 User Experience

### **Scenario 1: Customer visits at 10 AM (Backend ON)**
```
1. Website loads
2. Backend check: ✅ Online
3. Shows normal website
4. Customer can browse and order
```

### **Scenario 2: Customer visits at 11 PM (Backend OFF)**
```
1. Website loads
2. Backend check: ❌ Offline
3. Shows offline notice:
   
   🔴 Website Currently Not Available
   
   We're currently offline. Our online ordering 
   is available during business hours.
   
   🕐 Business Hours
   9:00 AM - 9:00 PM Daily
   
   [Try Again Button]
```

### **Scenario 3: Customer on site when you shut down (9 PM)**
```
1. Customer browsing at 8:55 PM
2. You shut down backend at 9:00 PM
3. After 30 seconds, automatic check runs
4. Detects backend offline
5. Automatically shows offline notice
6. Customer sees business hours message
```

---

## ⚙️ Technical Details

### **Backend Check Logic:**
```javascript
// Tries to fetch items from backend
// If successful → Backend online
// If network error/timeout → Backend offline
// Timeout: 5 seconds
// Retries: 2 attempts with 2 second delay
```

### **Check Frequency:**
- **On app load:** Immediate check
- **During use:** Every 30 seconds
- **On "Try Again" button:** Immediate check

### **What Triggers Offline Mode:**
- ❌ Backend server not running
- ❌ Network timeout (5 seconds)
- ❌ Connection refused
- ❌ DNS resolution failure

### **What Doesn't Trigger Offline Mode:**
- ✅ 401/403 errors (backend is online, just unauthorized)
- ✅ 500 errors (backend is online, just error)
- ✅ Slow responses under 5 seconds

---

## 🎨 Offline Notice Features

### **Design:**
- Purple gradient background
- White card with shadow
- Large WiFi off icon
- Clear typography
- Professional look

### **Information Shown:**
1. **Status:** "Website Currently Not Available"
2. **Explanation:** Why it's offline
3. **Business Hours:** 9 AM - 9 PM Daily
4. **Action:** Try Again button

### **User Actions:**
- **Try Again Button:** Refreshes page to check again
- **Automatic Retry:** Checks every 30 seconds in background

---

## 📊 Status Flow

```
App Loads
    ↓
Check Backend (5s timeout, 2 retries)
    ↓
    ├─→ Online? → Show Normal Website
    │                    ↓
    │              Check every 30s
    │                    ↓
    │              Still Online? → Continue
    │              Offline? → Show Offline Notice
    │
    └─→ Offline? → Show Offline Notice
                         ↓
                   Check every 30s
                         ↓
                   Back Online? → Show Normal Website
                   Still Offline? → Keep showing notice
```

---

## 🔧 Configuration

### **Change Check Interval:**
In `App.js`, line 415:
```javascript
// Check every 30 seconds (30000 ms)
const interval = setInterval(async () => {
  const isOnline = await checkBackendWithRetry(1);
  setBackendOnline(isOnline);
}, 30000); // Change this value
```

### **Change Timeout:**
In `checkBackendStatus.js`, line 12:
```javascript
const response = await axios.get(`${API_BASE_URL}/items`, {
  timeout: 5000, // Change this value (milliseconds)
});
```

### **Change Business Hours:**
In `OfflineNotice.js`, line 76:
```javascript
<Typography variant="body1">
  9:00 AM - 9:00 PM Daily  {/* Change this text */}
</Typography>
```

---

## 💡 Benefits

### **For Customers:**
✅ Clear communication about availability
✅ No confusing error messages
✅ Know when to come back
✅ Professional experience

### **For You:**
✅ No need to take down Hostinger
✅ Frontend stays online 24/7
✅ Automatic detection
✅ No manual intervention needed

### **For Business:**
✅ Professional image
✅ Clear business hours
✅ Reduces customer confusion
✅ Better user experience

---

## 🎯 What Happens in Different Scenarios

### **1. Normal Shutdown (9 PM):**
```
You: Close backend terminals
Website: Detects offline within 30 seconds
Customer: Sees offline notice with business hours
```

### **2. Unexpected Crash:**
```
Backend: Crashes unexpectedly
Website: Detects offline within 30 seconds
Customer: Sees offline notice
You: Restart backend
Website: Detects online within 30 seconds
Customer: Automatically sees normal website
```

### **3. Network Issues:**
```
Internet: Connection lost
Website: Detects offline (timeout)
Customer: Sees offline notice
Internet: Connection restored
Website: Detects online within 30 seconds
```

### **4. Customer Clicks "Try Again":**
```
Customer: Clicks "Try Again" button
Website: Immediately checks backend
If Online: Shows normal website
If Offline: Stays on offline notice
```

---

## 📱 Mobile Responsive

The offline notice is fully responsive:
- ✅ Works on mobile phones
- ✅ Works on tablets
- ✅ Works on desktop
- ✅ Touch-friendly button
- ✅ Readable text sizes

---

## 🚀 Testing

### **Test Offline Mode:**
1. Start frontend: `npm start`
2. **Don't start backend**
3. Visit `http://localhost:3000`
4. Should see offline notice ✅

### **Test Online Mode:**
1. Start backend: `mvn spring-boot:run`
2. Start frontend: `npm start`
3. Visit `http://localhost:3000`
4. Should see normal website ✅

### **Test Auto-Detection:**
1. Start both frontend and backend
2. Website works normally
3. Stop backend (Ctrl+C)
4. Wait 30 seconds
5. Should automatically show offline notice ✅

### **Test Reconnection:**
1. Website showing offline notice
2. Start backend
3. Wait 30 seconds
4. Should automatically show normal website ✅

---

## ✅ Summary

**What You Get:**
- 🌙 Professional offline notice
- 🕐 Business hours display
- 🔄 Automatic detection
- ⏰ Auto-reconnect
- 📱 Mobile responsive
- 🎨 Beautiful design

**How It Works:**
- Checks backend every 30 seconds
- Shows offline notice when down
- Automatically reconnects when back
- No manual intervention needed

**Customer Experience:**
- Clear communication
- Know when to come back
- Professional image
- No confusion

**Your Experience:**
- Shut down at 9 PM
- No need to manage anything
- Automatic handling
- Professional appearance

---

**Your website now gracefully handles offline periods!** 🎉
