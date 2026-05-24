import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useSearchParams, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  Link,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  ArrowBack,
} from '@mui/icons-material';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError, showErrorLong } from '../utils/toast';
import { validateEmail, validatePasswordSimple } from '../utils/formValidation';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { login } = useAuth();
  
  // Support ?returnUrl= query param AND location.state.from (from guest checkout redirect)
  const returnUrl = location.state?.from || searchParams.get('returnUrl') || '/';
  const redirectMessage = location.state?.message || null;
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError('');
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    errors.email = validateEmail(formData.email);
    errors.password = validatePasswordSimple(formData.password);
    
    setFieldErrors(errors);
    
    // Check if any errors
    if (Object.values(errors).some(err => err !== '')) {
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      const response = await customerAPI.login(formData);
      if (response.data.success) {
        login(response.data.data);
        showSuccess('Login successful! Welcome back!');
        // Redirect to returnUrl if provided, otherwise go to home
        navigate(returnUrl);
      } else {
        const errorMessage = response.data.message || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Account not found. Please check your email and password.';
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordOpen = () => {
    setForgotPasswordOpen(true);
    setResetEmail('');
  };

  const handleForgotPasswordClose = () => {
    setForgotPasswordOpen(false);
    setResetEmail('');
  };

  const handleForgotPasswordSubmit = async () => {
    if (!resetEmail) {
      showError('Please enter your email address');
      return;
    }

    setResetLoading(true);
    try {
      console.log('Sending forgot password request for:', resetEmail);
      const response = await customerAPI.forgotPassword({ email: resetEmail });
      console.log('Forgot password response:', response);
      if (response.data.success) {
        showSuccess('Password reset link sent to your email!');
        handleForgotPasswordClose();
      } else {
        console.error('Failed response:', response.data);
        showErrorLong(response.data.message || 'Failed to send reset link');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      console.error('Error response:', err.response);
      showErrorLong(err.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: `
      linear-gradient(rgba(255, 255, 255, 0.92), rgba(255, 255, 255, 0.92)),
      url('https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=1920&q=80') center/cover no-repeat
    `,
    padding: { xs: '24px 16px', sm: '20px' },
  };

  const paperStyle = {
    padding: '28px 24px',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.09)',
    maxWidth: '400px',
    width: '100%',
    background: '#ffffff',
    border: '1px solid #f0f0f0',
  };

  const logoContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  };

  return (
    <Box sx={containerStyle}>
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Paper elevation={0} sx={{ ...paperStyle, padding: { xs: '28px 24px', sm: '36px 32px' } }}>
          <Box style={logoContainerStyle}>
            <img 
              src="/LOGOO.png" 
              alt="Frost and Crinkle Logo" 
              style={{
                height: '64px',
                width: 'auto',
                objectFit: 'contain',
                marginBottom: '12px',
              }}
            />
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              style={{
                textTransform: 'none',
                fontWeight: 500,
                color: '#666',
                borderColor: '#ddd',
                marginBottom: '4px',
                fontSize: '0.8rem',
                padding: '4px 12px',
              }}
              variant="outlined"
              size="small"
            >
              Go back to Home
            </Button>
          </Box>

          <Typography 
            variant="h5" 
            align="center" 
            gutterBottom
            style={{ 
              fontWeight: 700, 
              marginBottom: '4px',
              background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Welcome Back!
          </Typography>
          
          <Typography 
            variant="body2" 
            align="center" 
            style={{ color: '#64748b', marginBottom: '20px', fontSize: '13px' }}
          >
            Sign in to your Frost & Crinkle account
          </Typography>

          {redirectMessage && (
            <Alert severity="info" style={{ marginBottom: '16px', borderRadius: '8px' }}>
              🛒 {redirectMessage}
            </Alert>
          )}

          {error && (
            <Alert severity="error" style={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="dense"
              error={!!fieldErrors.email}
              helperText={fieldErrors.email}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email style={{ color: '#ff69b4', fontSize: '18px' }} />
                  </InputAdornment>
                ),
              }}
              style={{ marginBottom: '10px' }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              margin="dense"
              error={!!fieldErrors.password}
              helperText={fieldErrors.password}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock style={{ color: '#ff69b4', fontSize: '18px' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      style={{ color: '#666' }}
                      size="small"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ marginBottom: '4px' }}
            />

            <Box style={{ textAlign: 'right', marginBottom: '16px' }}>
              <Link
                component="button"
                type="button"
                onClick={handleForgotPasswordOpen}
                style={{
                  color: '#ff69b4',
                  fontWeight: 500,
                  textDecoration: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Forgot Password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="medium"
              disabled={loading}
              style={{
                padding: '10px',
                fontSize: '15px',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
                boxShadow: '0 4px 12px rgba(233, 30, 99, 0.35)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box style={{ textAlign: 'center', marginTop: '20px' }}>
              <Typography variant="body2" style={{ color: '#666' }}>
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to={returnUrl !== '/' ? `/register?returnUrl=${encodeURIComponent(returnUrl)}` : '/register'}
                  style={{
                    color: '#e91e63',
                    fontWeight: 700,
                    textDecoration: 'none',
                    borderBottom: '2px solid #e91e63',
                    paddingBottom: '2px',
                  }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>

      {/* Forgot Password Dialog */}
      <Dialog
        open={forgotPasswordOpen}
        onClose={handleForgotPasswordClose}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: '12px',
            padding: '8px',
          }
        }}
      >
        <DialogTitle style={{ fontWeight: 600, fontSize: '20px' }}>
          Reset Password
        </DialogTitle>
        <DialogContent>
          <DialogContentText style={{ marginBottom: '20px' }}>
            Enter your email address and we'll send you a link to reset your password.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            label="Email Address"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email style={{ color: '#ff69b4' }} />
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions style={{ padding: '16px 24px' }}>
          <Button 
            onClick={handleForgotPasswordClose}
            style={{ textTransform: 'none', color: '#666' }}
            disabled={resetLoading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleForgotPasswordSubmit}
            variant="contained"
            disabled={resetLoading}
            style={{ 
              background: '#e91e63', 
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
            }}
          >
            {resetLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
