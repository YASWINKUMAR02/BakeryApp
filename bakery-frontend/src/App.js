import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, CircularProgress } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { AnimatePresence } from 'framer-motion';
import { ToastProvider, useToast } from './context/ToastContext';
import { setToastFunction } from './utils/toast';
import { checkBackendWithRetry } from './utils/checkBackendStatus';
import PageTransition from './components/PageTransition';
import OfflineNotice from './components/OfflineNotice';
import BackToTop from './components/BackToTop';
import BottomNav from './components/BottomNav';
import CustomerHeader from './components/CustomerHeader';
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
import FAQ from './pages/FAQ';
import Gallery from './pages/Gallery';
import PageLoader from './components/PageLoader';
import useSwipeGesture from './hooks/useSwipeGesture';

const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63', // Signature Pink
      light: '#f06292',
      dark: '#ad1457',
    },
    secondary: {
      main: '#121212', // Richer Dark Charcoal
      light: '#2d2d2d',
      dark: '#000000',
    },
    accent: {
      main: '#D4AF37', // Professional Metallic Gold
    },
    background: {
      default: '#fcfcfc', // Slightly off-white for a warmer, richer feel
      paper: '#ffffff',
    },
    text: {
      primary: '#121212',
      secondary: '#555555',
    }
  },
  shape: {
    borderRadius: 16, // More modern, elegant rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '50px', // Circular pills for a modern look
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #e91e63 0%, #ad1457 100%)',
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 40px rgba(0,0,0,0.04)',
          border: '1px solid rgba(0,0,0,0.02)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: '#fff',
          },
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
        <Route path="/" element={<PageTransition variant="home"><Home /></PageTransition>} />
        <Route path="/home" element={<PageTransition variant="home"><Home /></PageTransition>} />

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
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/gallery" element={<PageTransition><Gallery /></PageTransition>} />
        <Route path="/shop" element={<PageTransition variant="shop"><Shop /></PageTransition>} />
        <Route path="/item/:id" element={<PageTransition variant="detail"><ItemDetail /></PageTransition>} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <PageTransition>
              <Cart />
            </PageTransition>
          </ProtectedRoute>
        }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Checkout />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <PageTransition>
                <CustomerOrders />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Profile />
              </PageTransition>
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

const GlobalHeader = () => {
  const location = useLocation();
  // Don't show header on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }
  return <CustomerHeader />;
};

const AppRoutes = () => {
  const { showToast } = useToast();
  const { loading: authLoading } = useAuth();
  const [backendOnline, setBackendOnline] = useState(true);
  const [checking, setChecking] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  // Apply global swipe gestures for mobile navigation
  useSwipeGesture({ threshold: 120 });

  useEffect(() => {
    // Show splash screen for at least 2 seconds
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setToastFunction(showToast);

    // Check backend status on mount
    const checkBackend = async () => {
      const isOnline = await checkBackendWithRetry(2);
      setBackendOnline(isOnline);
      setChecking(false);
    };

    checkBackend();

    // Check backend status every 30 seconds
    const interval = setInterval(async () => {
      const isOnline = await checkBackendWithRetry(1);
      setBackendOnline(isOnline);
    }, 30000);

    return () => clearInterval(interval);
  }, [showToast]);

  // Show splash screen/loader on initial load OR during backend/auth check
  if (checking || initialLoading || authLoading) {
    return <PageLoader />;
  }

  // Show offline notice if backend is down
  if (!backendOnline) {
    return <OfflineNotice />;
  }

  return (
    <>
      <ScrollToTop />
      <GlobalHeader />
      <AnimatedRoutes />
      <BackToTop />
      <BottomNav />
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <ToastProvider>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </ToastProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
