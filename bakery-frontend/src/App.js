import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence } from 'framer-motion';
import { ToastProvider, useToast } from './context/ToastContext';
import { setToastFunction } from './utils/toast';
import PageTransition from './components/PageTransition';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/customer/Home';
import Shop from './pages/customer/Shop';
import ItemDetail from './pages/customer/ItemDetail';
import Cart from './pages/customer/Cart';
import Checkout from './pages/customer/Checkout';
import CustomerOrders from './pages/customer/Orders';
import Profile from './pages/customer/Profile';
import AboutUs from './pages/customer/AboutUs';
import Contact from './pages/customer/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminDashboard from './pages/AdminDashboard';
import Categories from './pages/admin/Categories';
import Items from './pages/admin/Items';
import Orders from './pages/admin/Orders';
import AdminOrderHistory from './pages/admin/OrderHistory';
import Customers from './pages/admin/Customers';
import Analytics from './pages/admin/Analytics';
import AnalyticsDashboard from './pages/admin/AnalyticsDashboard';
import AdminHome from './pages/admin/AdminHome';
import CarouselManagement from './pages/admin/CarouselManagement';
import { AuthProvider, useAuth } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
// New pages
import About from './pages/About';
import ContactPage from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import NotFound from './pages/NotFound';
import SimpleHome from './pages/SimpleHome';

const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6b35',
      light: '#ff8c5a',
      dark: '#e55a2b',
    },
    secondary: {
      main: '#1a1a1a',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // Mobile-first responsive typography
    h1: {
      fontSize: '2rem',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:960px)': {
        fontSize: '3rem',
      },
    },
    h2: {
      fontSize: '1.75rem',
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
      '@media (min-width:960px)': {
        fontSize: '2.5rem',
      },
    },
    h3: {
      fontSize: '1.5rem',
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
      '@media (min-width:960px)': {
        fontSize: '2rem',
      },
    },
    h4: {
      fontSize: '1.25rem',
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
      '@media (min-width:960px)': {
        fontSize: '1.75rem',
      },
    },
    body1: {
      fontSize: '0.875rem',
      '@media (min-width:600px)': {
        fontSize: '1rem',
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          // Touch-friendly button size
          minHeight: '48px',
          minWidth: '48px',
          padding: '12px 24px',
          '@media (max-width:600px)': {
            padding: '10px 20px',
            fontSize: '0.875rem',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          // Touch-friendly input fields
          '& .MuiInputBase-root': {
            minHeight: '48px',
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          // Touch-friendly icon buttons
          minWidth: '48px',
          minHeight: '48px',
        },
      },
    },
  },
});

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const AdminProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return user && user.role === 'ADMIN' ? children : <Navigate to="/admin/login" />;
};

const RootRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (user) {
    // Redirect based on role
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" />;
    }
    // Customer goes to home
    return <Navigate to="/home" />;
  }
  
  // Guests go to home page
  return <Navigate to="/home" />;
};

const AuthRedirect = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (user) {
    // Redirect based on role
    if (user.role === 'ADMIN') {
      return <Navigate to="/admin/dashboard" />;
    }
    // Customer already logged in, redirect to home
    return <Navigate to="/" />;
  }
  return children;
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  // Debug log to see what route is being accessed
  console.log('🔀 Route changed to:', location.pathname);
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Home Page - Landing page for everyone (guests, customers) */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        
        {/* Customer Routes */}
        <Route 
          path="/login" 
          element={
            <PageTransition>
              <AuthRedirect>
                <Login />
              </AuthRedirect>
            </PageTransition>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRedirect>
              <Register />
            </AuthRedirect>
          } 
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/item/:id" element={<PageTransition><ItemDetail /></PageTransition>} />
        <Route 
          path="/cart" 
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute>
              <CustomerOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/login" 
          element={
            <AuthRedirect>
              <AdminLogin />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/admin/register" 
          element={
            <AuthRedirect>
              <AdminRegister />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/categories" 
          element={
            <AdminProtectedRoute>
              <Categories />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/items" 
          element={
            <AdminProtectedRoute>
              <Items />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <AdminProtectedRoute>
              <Orders />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/customers" 
          element={
            <AdminProtectedRoute>
              <Customers />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/carousel-management" 
          element={
            <AdminProtectedRoute>
              <CarouselManagement />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/order-history" 
          element={
            <AdminProtectedRoute>
              <AdminOrderHistory />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <AdminProtectedRoute>
              <Analytics />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/analytics-dashboard" 
          element={
            <AdminProtectedRoute>
              <AnalyticsDashboard />
            </AdminProtectedRoute>
          } 
        />
        <Route 
          path="/admin/home" 
          element={
            <AdminProtectedRoute>
              <AdminHome />
            </AdminProtectedRoute>
          } 
        />
        
        {/* Catch all - 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const AppRoutes = () => {
  const { showToast } = useToast();

  useEffect(() => {
    setToastFunction(showToast);
  }, [showToast]);

  return (
    <Router>
      <ScrollToTop />
      <AnimatedRoutes />
    </Router>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
