import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Chip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  Cake,
  AdminPanelSettings,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';
import { showSuccess, showError } from '../utils/toast';

const AdminRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    }
    if (formData.password.length < 6) {
      const errorMsg = 'Password must be at least 6 characters';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    }
    if (!/^\d{10,15}$/.test(formData.phone)) {
      const errorMsg = 'Phone number must be 10-15 digits';
      setError(errorMsg);
      showError(errorMsg);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await adminAPI.register(registerData);
      
      if (response.data.success) {
        setSuccess('Admin registration successful! Redirecting to login...');
        showSuccess('Admin registration successful! Redirecting to login...');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        const errorMessage = response.data.message;
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      let errorMessage;
      if (err.response?.data?.data) {
        errorMessage = Object.values(err.response.data.data).join(', ');
      } else {
        errorMessage = err.response?.data?.message || 'Registration failed. Please try again.';
      }
      setError(errorMessage);
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    padding: '20px',
  };

  const paperStyle = {
    padding: '40px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    maxWidth: '500px',
    width: '100%',
    background: '#fff',
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '20px',
  };

  const logoStyle = {
    fontSize: '48px',
    color: '#f0701f',
    marginRight: '10px',
  };

  const adminBadgeStyle = {
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'center',
  };

  return (
    <Box style={containerStyle}>
      <Container maxWidth="sm">
        <Paper elevation={0} style={paperStyle}>
          <Box style={logoContainerStyle}>
            <Cake style={logoStyle} />
            <Typography variant="h4" style={{ fontWeight: 700, color: '#1a1a2e' }}>
              Fronst & Crinkle
            </Typography>
          </Box>

          <Box style={adminBadgeStyle}>
            <Chip
              icon={<AdminPanelSettings />}
              label="Admin Portal"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 600,
                padding: '20px 10px',
                fontSize: '14px',
              }}
            />
          </Box>

          <Typography 
            variant="h5" 
            align="center" 
            gutterBottom
            style={{ fontWeight: 600, marginBottom: '10px', color: '#1a1a2e' }}
          >
            Admin Registration
          </Typography>
          
          <Typography 
            variant="body2" 
            align="center" 
            style={{ color: '#666', marginBottom: '30px' }}
          >
            Create an admin account to manage the bakery
          </Typography>

          {error && (
            <Alert severity="error" style={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" style={{ marginBottom: '20px' }}>
              {success}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person style={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
              }}
              style={{ marginBottom: '16px' }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email style={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
              }}
              style={{ marginBottom: '16px' }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              margin="normal"
              placeholder="1234567890"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone style={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
              }}
              style={{ marginBottom: '16px' }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock style={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ marginBottom: '16px' }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              margin="normal"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock style={{ color: '#667eea' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              style={{ marginBottom: '24px' }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              style={{
                padding: '12px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: '8px',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
              }}
            >
              {loading ? 'Creating Account...' : 'Register as Admin'}
            </Button>

            <Box style={{ textAlign: 'center', marginTop: '20px' }}>
              <Typography variant="body2" style={{ color: '#666' }}>
                Already have an admin account?{' '}
                <Link
                  component={RouterLink}
                  to="/admin/login"
                  style={{
                    color: '#667eea',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>

            <Box style={{ textAlign: 'center', marginTop: '10px' }}>
              <Typography variant="body2" style={{ color: '#999', fontSize: '12px' }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  style={{
                    color: '#667eea',
                    textDecoration: 'none',
                  }}
                >
                  ← Back to Customer Login
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminRegister;
