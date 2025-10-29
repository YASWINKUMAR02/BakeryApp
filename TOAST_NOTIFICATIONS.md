# Toast Notifications Guide

## Overview
Toast notifications have been implemented using `react-toastify` for better user feedback throughout the application.

## Installation

The package has been added to `package.json`:
```json
"react-toastify": "^9.1.3"
```

**Install the package:**
```bash
cd bakery-frontend
npm install
```

## Configuration

### App.js Setup
The ToastContainer is configured globally in `App.js`:

```javascript
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {/* Rest of app */}
    </ThemeProvider>
  );
}
```

## Toast Utility Functions

Created in `src/utils/toast.js`:

### Available Functions

#### 1. **showSuccess(message)**
Display success messages
```javascript
import { showSuccess } from '../utils/toast';

showSuccess('Item added to cart!');
showSuccess('Order placed successfully!');
```

#### 2. **showError(message)**
Display error messages
```javascript
import { showError } from '../utils/toast';

showError('Failed to add item');
showError('Insufficient stock available');
```

#### 3. **showInfo(message)**
Display informational messages
```javascript
import { showInfo } from '../utils/toast';

showInfo('Processing your request...');
showInfo('Please wait while we load your data');
```

#### 4. **showWarning(message)**
Display warning messages
```javascript
import { showWarning } from '../utils/toast';

showWarning('Stock is running low');
showWarning('Please verify your information');
```

#### 5. **showPromise(promise, messages)**
Display toast for async operations
```javascript
import { showPromise } from '../utils/toast';

const promise = orderAPI.placeOrder(customerId, orderData);

showPromise(promise, {
  pending: 'Placing your order...',
  success: 'Order placed successfully!',
  error: 'Failed to place order'
});
```

## Usage Examples

### Basic Usage

```javascript
import { showSuccess, showError } from '../utils/toast';

const handleSave = async () => {
  try {
    await itemAPI.create(itemData);
    showSuccess('Item created successfully!');
  } catch (err) {
    showError(err.response?.data?.message || 'Operation failed');
  }
};
```

### Replace Alert Components

**Before (using Material-UI Alert):**
```javascript
const [success, setSuccess] = useState('');
const [error, setError] = useState('');

// In JSX
{success && <Alert severity="success">{success}</Alert>}
{error && <Alert severity="error">{error}</Alert>}

// In handler
setSuccess('Item saved!');
setTimeout(() => setSuccess(''), 3000);
```

**After (using Toast):**
```javascript
import { showSuccess, showError } from '../utils/toast';

// In handler
showSuccess('Item saved!');
// No need for state or setTimeout!
```

### Multiple Toasts

```javascript
// Multiple toasts can be shown simultaneously
showSuccess('Item 1 added to cart!');
showSuccess('Item 2 added to cart!');
showInfo('You have 5 items in your cart');
```

### With Async/Await

```javascript
const handleDelete = async (id) => {
  if (window.confirm('Are you sure?')) {
    try {
      await itemAPI.delete(id);
      showSuccess('Item deleted successfully!');
      fetchItems();
    } catch (err) {
      showError('Failed to delete item');
    }
  }
};
```

### Promise-based Toast

```javascript
const handlePlaceOrder = async () => {
  const orderPromise = orderAPI.placeOrder(customerId, orderData);
  
  showPromise(orderPromise, {
    pending: 'Placing your order...',
    success: 'Order placed successfully! 🎉',
    error: 'Failed to place order. Please try again.'
  });
  
  try {
    await orderPromise;
    navigate('/orders');
  } catch (err) {
    // Error already shown by toast
  }
};
```

## Components Updated

### ✅ Admin Components
- **Items.js** - Create, update, delete items
- More components can be updated similarly

### ✅ Customer Components
- **Shop.js** - Add to cart
- **Login.js** - Login success/error
- More components can be updated similarly

### 🔄 Components to Update
- Register.js
- Cart.js
- Checkout.js
- Orders.js
- Categories.js
- Customers.js
- And others...

## Migration Guide

### Step 1: Import Toast Functions
```javascript
import { showSuccess, showError, showInfo, showWarning } from '../utils/toast';
```

### Step 2: Remove State Variables
```javascript
// Remove these
const [success, setSuccess] = useState('');
const [error, setError] = useState('');
```

### Step 3: Replace setState with Toast
```javascript
// Replace
setSuccess('Item saved!');
setTimeout(() => setSuccess(''), 3000);

// With
showSuccess('Item saved!');
```

### Step 4: Remove Alert JSX
```javascript
// Remove these from JSX
{success && <Alert severity="success">{success}</Alert>}
{error && <Alert severity="error">{error}</Alert>}
```

## Customization

### Custom Position
```javascript
showSuccess('Message', {
  position: "bottom-right"
});
```

### Custom Duration
```javascript
showSuccess('Message', {
  autoClose: 5000  // 5 seconds
});
```

### Disable Auto-Close
```javascript
showError('Critical Error', {
  autoClose: false
});
```

### Custom Theme
```javascript
showSuccess('Message', {
  theme: "dark"
});
```

## Toast Types & Colors

| Type | Color | Icon | Use Case |
|------|-------|------|----------|
| Success | Green | ✓ | Successful operations |
| Error | Red | ✗ | Failed operations, errors |
| Info | Blue | ℹ | Informational messages |
| Warning | Orange | ⚠ | Warnings, cautions |

## Best Practices

### 1. **Keep Messages Short**
```javascript
// Good
showSuccess('Item saved!');

// Too long
showSuccess('Your item has been successfully saved to the database and is now available for viewing.');
```

### 2. **Be Specific**
```javascript
// Good
showError('Insufficient stock for Chocolate Brownie');

// Vague
showError('Operation failed');
```

### 3. **Use Appropriate Type**
```javascript
// Success for completed actions
showSuccess('Order placed successfully!');

// Error for failures
showError('Failed to process payment');

// Info for neutral information
showInfo('Loading your data...');

// Warning for cautions
showWarning('Stock is running low');
```

### 4. **Don't Overuse**
```javascript
// Bad - too many toasts
showInfo('Loading...');
showInfo('Processing...');
showInfo('Almost done...');
showSuccess('Complete!');

// Good - one meaningful toast
showSuccess('Order processed successfully!');
```

### 5. **Handle Errors Gracefully**
```javascript
try {
  await api.call();
  showSuccess('Success!');
} catch (err) {
  // Show specific error from backend
  showError(err.response?.data?.message || 'Operation failed');
}
```

## Advanced Features

### Update Existing Toast
```javascript
import { toast } from 'react-toastify';

const toastId = toast.loading('Processing...');

// Later update it
toast.update(toastId, {
  render: 'Completed!',
  type: 'success',
  isLoading: false,
  autoClose: 3000
});
```

### Custom Render
```javascript
import { toast } from 'react-toastify';

toast.success(
  <div>
    <strong>Success!</strong>
    <p>Your order has been placed</p>
  </div>
);
```

### With Progress Bar
```javascript
showSuccess('Uploading...', {
  hideProgressBar: false,
  autoClose: 5000
});
```

## Styling

### Global Styles
Add to your CSS:
```css
.Toastify__toast--success {
  background-color: #4caf50 !important;
}

.Toastify__toast--error {
  background-color: #f44336 !important;
}

.Toastify__toast {
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
}
```

### Custom Class
```javascript
showSuccess('Message', {
  className: 'custom-toast'
});
```

## Testing

### Manual Testing Checklist
- [ ] Success toast appears on successful operation
- [ ] Error toast appears on failed operation
- [ ] Toast auto-closes after 3 seconds
- [ ] Multiple toasts stack properly
- [ ] Toast can be manually closed
- [ ] Toast pauses on hover
- [ ] Toast is draggable

### Test Example
```javascript
// Test in browser console
import { showSuccess, showError } from './utils/toast';

showSuccess('Test success message');
showError('Test error message');
```

## Troubleshooting

### Toast Not Appearing
1. Check ToastContainer is in App.js
2. Verify CSS is imported: `import 'react-toastify/dist/ReactToastify.css'`
3. Check browser console for errors
4. Ensure package is installed: `npm install react-toastify`

### Styling Issues
1. Check CSS import order
2. Verify no conflicting styles
3. Use `!important` if needed

### Multiple Toasts Stacking
This is normal behavior. To prevent:
```javascript
showSuccess('Message', {
  toastId: 'unique-id'  // Same ID won't create duplicate
});
```

## Benefits Over Alert Components

1. **✅ No State Management** - No need for useState
2. **✅ Auto-Dismiss** - Automatically closes
3. **✅ Non-Blocking** - Doesn't take up layout space
4. **✅ Stackable** - Multiple toasts can show
5. **✅ Interactive** - Can be closed, paused, dragged
6. **✅ Consistent** - Same look across all pages
7. **✅ Better UX** - Less intrusive than alerts

## Summary

Toast notifications provide a modern, user-friendly way to show feedback:
- ✅ Easy to use with utility functions
- ✅ No state management required
- ✅ Consistent across the application
- ✅ Better user experience
- ✅ Highly customizable

Replace all Alert components with toast notifications for a more polished application! 🎉
