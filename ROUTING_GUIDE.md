# Routing Guide - Bakery Application

## Overview
Complete routing structure with Home as the public landing page and proper authentication flow.

## Route Structure

### **Public Routes** (No Authentication Required)
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | **Landing page** - Public home with carousel, featured items, categories |
| `/login` | Login | Customer login page |
| `/register` | Register | Customer registration page |
| `/admin/login` | AdminLogin | Admin login page |
| `/admin/register` | AdminRegister | Admin registration page |

### **Protected Customer Routes** (Requires Authentication)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | Dashboard | Customer dashboard |
| `/shop` | Shop | Browse all bakery items |
| `/cart` | Cart | Shopping cart |
| `/checkout` | Checkout | Order checkout |
| `/orders` | CustomerOrders | Active orders |
| `/order-history` | CustomerOrderHistory | Delivered orders history |

### **Protected Admin Routes** (Requires Admin Role)
| Route | Component | Description |
|-------|-----------|-------------|
| `/admin/dashboard` | AdminDashboard | Admin dashboard |
| `/admin/categories` | Categories | Manage categories |
| `/admin/items` | Items | Manage items & stock |
| `/admin/orders` | Orders | Manage all orders |
| `/admin/customers` | Customers | View all customers |
| `/admin/order-history` | AdminOrderHistory | View order history |

## Authentication Flow

### **Landing Page (`/`)**
```
User visits "/" (Home page)
├─ Not Authenticated
│  └─ Shows public home page
│     ├─ Header: Login | Sign Up buttons
│     ├─ Carousel with "Shop Now" button
│     ├─ Featured items (Add to Cart → redirects to /login)
│     └─ Categories & Why Choose Us sections
│
└─ Authenticated
   ├─ Shows home page with full navigation
   ├─ Header: Home | Shop | Cart | Orders | History | Logout
   └─ Add to Cart works normally
```

### **Login/Register Pages**
```
User visits /login or /register
├─ Not Authenticated
│  └─ Shows login/register form
│
└─ Already Authenticated
   ├─ If role = ADMIN → Redirect to /admin/dashboard
   └─ If role = CUSTOMER → Redirect to /dashboard
```

### **Protected Routes**
```
User tries to access protected route (e.g., /shop)
├─ Not Authenticated
│  └─ Redirect to "/" (Home)
│
└─ Authenticated
   └─ Show requested page
```

## Navigation Components

### **CustomerHeader**
Dynamic header that changes based on authentication:

#### **Not Authenticated:**
```
[Logo] Bakery Shop                    [Home] [Login] [Sign Up]
```

#### **Authenticated:**
```
[Logo] Bakery Shop    [Home] [Shop] [Cart] [Orders] [History]    [User Name] [Logout]
```

### **AdminHeader**
Always requires authentication:
```
[Logo] Admin Dashboard    [Back]    [Admin Name] [Logout]
```

## Route Guards

### **ProtectedRoute Component**
Protects routes that require authentication:
```javascript
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/" />;
};
```

### **AuthRedirect Component**
Redirects authenticated users from login/register pages:
```javascript
const AuthRedirect = ({ children }) => {
  const { user } = useAuth();
  if (user) {
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" />;
    }
    return <Navigate to="/dashboard" />;
  }
  return children;
};
```

## User Journey Examples

### **New Customer Journey**
1. Visit `/` → See public home page
2. Click "Shop Now" or "Sign Up" → Go to `/register`
3. Register → Auto-login → Redirect to `/dashboard`
4. Navigate to `/shop` → Browse items
5. Add to cart → Go to `/cart`
6. Checkout → Go to `/checkout`
7. Place order → Redirect to `/orders`

### **Returning Customer Journey**
1. Visit `/` → See public home page
2. Click "Login" → Go to `/login`
3. Login → Redirect to `/dashboard`
4. Continue shopping...

### **Admin Journey**
1. Visit `/admin/login` → Admin login page
2. Login → Redirect to `/admin/dashboard`
3. Manage items, orders, categories, customers
4. Logout → Redirect to `/` (Home)

### **Guest Browsing**
1. Visit `/` → See public home page
2. Browse featured items
3. Click "Add to Cart" → Redirect to `/login`
4. After login → Item added to cart

## Redirect Rules

| From | To | Condition |
|------|-----|-----------|
| Any protected route | `/` | Not authenticated |
| `/login` | `/dashboard` | Already logged in (Customer) |
| `/login` | `/admin/dashboard` | Already logged in (Admin) |
| `/admin/login` | `/admin/dashboard` | Already logged in (Admin) |
| `/admin/login` | `/dashboard` | Already logged in (Customer) |
| Any invalid route | `/` | 404 catch-all |
| Logout | `/` | After logout |

## Key Features

### **1. Public Landing Page**
- ✅ Home page accessible without login
- ✅ Showcases bakery items and features
- ✅ Encourages sign-up with CTAs
- ✅ Smooth transition to authenticated experience

### **2. Smart Redirects**
- ✅ Authenticated users can't access login/register
- ✅ Unauthenticated users redirected to home (not login)
- ✅ Role-based redirects (Admin vs Customer)
- ✅ Preserves user intent after login

### **3. Conditional Navigation**
- ✅ Header changes based on auth status
- ✅ Protected features hidden when not logged in
- ✅ Clear CTAs for guest users

### **4. Seamless Experience**
- ✅ No broken links
- ✅ Graceful handling of auth state changes
- ✅ Consistent navigation across all pages

## Testing Checklist

### **Public Access**
- [ ] Visit `/` without login → Shows public home
- [ ] Click "Add to Cart" → Redirects to login
- [ ] Click "Shop Now" → Redirects to login
- [ ] Click "Sign Up" → Goes to register
- [ ] Click "Login" → Goes to login

### **Customer Flow**
- [ ] Register → Auto-redirects to dashboard
- [ ] Login → Redirects to dashboard
- [ ] Access `/shop` → Works
- [ ] Access `/cart` → Works
- [ ] Access `/admin/dashboard` → Blocked by backend

### **Admin Flow**
- [ ] Admin login → Redirects to admin dashboard
- [ ] Access admin routes → Works
- [ ] Access customer routes → Works (admin can view)
- [ ] Logout → Returns to home

### **Edge Cases**
- [ ] Already logged in, visit `/login` → Redirects to dashboard
- [ ] Not logged in, visit `/shop` → Redirects to home
- [ ] Invalid route → Redirects to home
- [ ] Logout from any page → Returns to home

## Code Snippets

### **App.js Route Configuration**
```javascript
<Routes>
  {/* Public Landing Page */}
  <Route path="/" element={<Home />} />
  
  {/* Auth Pages with Redirect */}
  <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
  <Route path="/register" element={<AuthRedirect><Register /></AuthRedirect>} />
  
  {/* Protected Customer Routes */}
  <Route path="/shop" element={<ProtectedRoute><Shop /></ProtectedRoute>} />
  <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
  
  {/* Protected Admin Routes */}
  <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
  
  {/* Catch All */}
  <Route path="*" element={<Navigate to="/" />} />
</Routes>
```

### **Home Page Auth Check**
```javascript
const handleAddToCart = async (item) => {
  if (!user) {
    navigate('/login');  // Redirect to login if not authenticated
    return;
  }
  
  // Add to cart logic...
};
```

### **Header Conditional Rendering**
```javascript
{user && (
  <>
    <Button onClick={() => navigate('/shop')}>Shop</Button>
    <Button onClick={() => navigate('/cart')}>Cart</Button>
    <Button onClick={handleLogout}>Logout</Button>
  </>
)}

{!user && (
  <>
    <Button onClick={() => navigate('/login')}>Login</Button>
    <Button onClick={() => navigate('/register')}>Sign Up</Button>
  </>
)}
```

## Benefits

1. **Better SEO**: Public landing page can be indexed
2. **User-Friendly**: Clear entry point for new users
3. **Secure**: Protected routes require authentication
4. **Flexible**: Easy to add new public/protected routes
5. **Maintainable**: Clear separation of concerns

## Future Enhancements

- [ ] Add breadcrumb navigation
- [ ] Implement route-based page titles
- [ ] Add loading states during navigation
- [ ] Implement deep linking with state preservation
- [ ] Add analytics tracking for route changes

---

Your routing is now perfectly configured with Home as the landing page! 🎉
