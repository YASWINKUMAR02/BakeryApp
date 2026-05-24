import React, { useEffect, useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, alpha } from '@mui/material/styles';
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
import MobileBottomNav from './components/MobileBottomNav';
import CustomerHeader from './components/CustomerHeader';
import PageLoader from './components/PageLoader';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GuestCartProvider } from './context/GuestCartContext';
import ScrollToTop from './components/ScrollToTop';
import useSwipeGesture from './hooks/useSwipeGesture';
import designTokens from './theme/designTokens';

// --- Lazily loaded page components (code-split per route) ---
// Customer pages
const Home = lazy(() => import('./pages/customer/Home'));
const Shop = lazy(() => import('./pages/customer/Shop'));
const ItemDetail = lazy(() => import('./pages/customer/ItemDetail'));
const Cart = lazy(() => import('./pages/customer/Cart'));
const Checkout = lazy(() => import('./pages/customer/Checkout'));
const CustomerOrders = lazy(() => import('./pages/customer/Orders'));
const Profile = lazy(() => import('./pages/customer/Profile'));
const AboutUs = lazy(() => import('./pages/customer/AboutUs'));
const Contact = lazy(() => import('./pages/customer/Contact'));

// Auth pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminRegister = lazy(() => import('./pages/AdminRegister'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const Categories = lazy(() => import('./pages/admin/Categories'));
const Items = lazy(() => import('./pages/admin/Items'));
const Orders = lazy(() => import('./pages/admin/Orders'));
const AdminOrderHistory = lazy(() => import('./pages/admin/OrderHistory'));
const Customers = lazy(() => import('./pages/admin/Customers'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const AnalyticsDashboard = lazy(() => import('./pages/admin/AnalyticsDashboard'));
const AdminHome = lazy(() => import('./pages/admin/AdminHome'));
const CarouselManagement = lazy(() => import('./pages/admin/CarouselManagement'));

// Info / static pages
const About = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/Contact'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const NotFound = lazy(() => import('./pages/NotFound'));
const SimpleHome = lazy(() => import('./pages/SimpleHome'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Gallery = lazy(() => import('./pages/Gallery'));

const { colors, gradients, shadows, transitions } = designTokens;

const theme = createTheme({
  palette: {
    primary: {
      main: colors.brandPink,
      light: '#f8bbd0',
      dark: colors.brandBurgundy,
    },
    secondary: {
      main: colors.brandDark, // Richer Dark Charcoal
      light: '#2d2d2d',
      dark: '#000000',
    },
    accent: {
      main: colors.accentGold, // Professional Metallic Gold
    },
    success: {
      main: colors.success,
    },
    warning: {
      main: colors.warning,
    },
    error: {
      main: colors.danger,
    },
    background: {
      default: colors.cloud, // Slightly off-white for a warmer, richer feel
      paper: colors.paper,
    },
    text: {
      primary: colors.brandInk,
      secondary: colors.stone,
    }
  },
  typography: {
    fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    h1: {
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.015em',
    },
    h3: {
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h4: {
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontWeight: 600,
    },
    h5: {
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontWeight: 600,
    },
    h6: {
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontWeight: 600,
    },
    button: {
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontWeight: 600,
      letterSpacing: '0.04em',
    },
    subtitle1: {
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
      fontWeight: 600,
    },
    body1: {
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
    body2: {
      fontFamily: "'Inter', 'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          padding: '10px 20px',
          boxShadow: 'none',
          transition: transitions.standard,
          letterSpacing: '0.04em',
          '&:focus-visible': {
            outline: `2px solid ${alpha(colors.brandPink, 0.6)}`,
            outlineOffset: '2px',
          },
          '&.Mui-disabled': {
            opacity: 0.6,
            boxShadow: 'none',
          },
          '&:hover': {
            boxShadow: shadows.resting,
            transform: 'translateY(-1px)',
          },
        },
        containedPrimary: {
          background: gradients.primary,
          color: colors.paper,
          boxShadow: '0 10px 30px rgba(233, 30, 99, 0.25)',
          '&:hover': {
            background: gradients.primary,
            transform: 'translateY(-1px)',
            boxShadow: shadows.hover,
          }
        }
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: shadows.resting,
          border: `1px solid ${alpha(colors.brandInk, 0.04)}`,
          borderRadius: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            backgroundColor: colors.paper,
            '& fieldset': {
              borderColor: alpha(colors.brandInk, 0.12),
            },
            '&:hover fieldset': {
              borderColor: colors.brandPink,
            },
            '&.Mui-focused fieldset': {
              borderColor: colors.brandPink,
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: 600,
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          transition: transitions.standard,
          '&:hover': {
            backgroundColor: alpha(colors.brandPink, 0.08),
          },
          '&.Mui-selected': {
            borderRadius: 0,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
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

const HomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Redirect admins away from the landing page to their dashboard
  if (user && user.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" />;
  }

  // Guests and customers both see the Home page
  return <PageTransition variant="home"><Home /></PageTransition>;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  // Debug log to see what route is being accessed
  console.log('🔀 Route changed to:', location.pathname);

  return (
    <Suspense fallback={<PageLoader />}>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<HomeRoute />} />
          <Route path="/home" element={<HomeRoute />} />

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
          <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
          <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
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
    </Suspense>
  );
};

const GlobalHeader = () => {
  const location = useLocation();
  // Don't show header on admin pages, login, and register pages
  const noHeaderRoutes = ['/login', '/register', '/admin/login', '/admin/register'];
  if (location.pathname.startsWith('/admin') || noHeaderRoutes.includes(location.pathname)) {
    return null;
  }
  return <CustomerHeader />;
};

const GlobalNavs = () => {
  const location = useLocation();
  const noNavRoutes = ['/login', '/register', '/admin/login', '/admin/register'];
  
  if (location.pathname.startsWith('/admin') || noNavRoutes.includes(location.pathname)) {
    return null;
  }
  
  return (
    <>
      <BottomNav />
      <MobileBottomNav />
    </>
  );
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
      <GlobalNavs />
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
            <GuestCartProvider>
              <AppRoutes />
            </GuestCartProvider>
          </AuthProvider>
        </ToastProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
