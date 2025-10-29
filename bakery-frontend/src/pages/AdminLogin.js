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
  Cake,
  AdminPanelSettings,
} from '@mui/icons-material';
import { adminAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';

const AdminLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await adminAPI.login(formData);
      if (response.data.success) {
        login(response.data.data);
        showSuccess('Admin login successful! Welcome back!');
        navigate('/admin/dashboard');
      } else {
        const errorMessage = response.data.message || 'Admin login failed. Please check your credentials.';
        setError(errorMessage);
        showError(errorMessage);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Admin account not found. Please check your credentials.';
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
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%), url("https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=1920&h=1080&fit=crop")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    padding: '20px',
  };

  const paperStyle = {
    padding: '48px',
    borderRadius: '20px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    maxWidth: '480px',
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
            <img 
              src="/LOGOO.png" 
              alt="Frost & Crinkle Logo" 
              style={{
                height: '60px',
                width: '180px',
                objectFit: 'cover',
                marginBottom: '10px',
              }}
            />
          </Box>

          <Box style={adminBadgeStyle}>
            <Chip
              icon={<AdminPanelSettings style={{ color: '#fff' }} />}
              label="Admin Portal"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                fontWeight: 600,
                padding: '22px 12px',
                fontSize: '15px',
                borderRadius: 0,
              }}
            />
          </Box>

          <Typography 
            variant="h4" 
            align="center" 
            gutterBottom
            style={{ fontWeight: 700, marginBottom: '12px', color: '#1a1a2e' }}
          >
            Welcome Back
          </Typography>
          
          <Typography 
            variant="body1" 
            align="center" 
            style={{ color: '#666', marginBottom: '32px', fontSize: '15px' }}
          >
            Sign in to manage your bakery
          </Typography>

          {error && (
            <Alert severity="error" style={{ marginBottom: '20px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Admin Email"
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
              style={{ marginBottom: '24px' }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              style={{
                padding: '14px',
                fontSize: '16px',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 0,
                marginBottom: '20px',
                background: loading ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: '#fff',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Box style={{ textAlign: 'center', marginTop: '20px' }}>
              <Typography variant="body2" style={{ color: '#666' }}>
                <Link
                  component={RouterLink}
                  to="/login"
                  style={{
                    color: '#667eea',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  ← Back to Customer Login
                </Link>
              </Typography>
            </Box>

            <Box style={{ textAlign: 'center', marginTop: '10px' }}>
              <Typography variant="body2" style={{ color: '#999', fontSize: '12px' }}>
                Don't have admin access?{' '}
                <Link
                  component={RouterLink}
                  to="/admin/register"
                  style={{
                    color: '#667eea',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Register
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
