import React, { useState } from 'react';
import { useNavigate, Link as RouterLink, useSearchParams } from 'react-router-dom';
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
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Phone,
  ArrowBack,
} from '@mui/icons-material';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showSuccess, showError } from '../utils/toast';
import { validateEmail, validatePasswordSimple, validateName, validatePhone, validateConfirmPassword } from '../utils/formValidation';

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  // Get return URL from query params
  const returnUrl = searchParams.get('returnUrl') || '/';
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    errors.name = validateName(formData.name);
    errors.email = validateEmail(formData.email);
    errors.phone = validatePhone(formData.phone);
    errors.password = validatePasswordSimple(formData.password);
    errors.confirmPassword = validateConfirmPassword(formData.password, formData.confirmPassword);
    
    setFieldErrors(errors);
    
    // Check if any errors
    return !Object.values(errors).some(err => err !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await customerAPI.register(registerData);
      
      if (response.data.success) {
        login(response.data.data);
        showSuccess('Registration successful! Welcome!');
        // Redirect to returnUrl if provided, otherwise go to home
        navigate(returnUrl);
      } else {
        showError(response.data.message);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
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
    padding: { xs: '24px 16px', sm: '40px 20px' },
    overflow: 'auto',
  };

  const paperStyle = {
    padding: { xs: '28px 24px', sm: '36px 32px' },
    borderRadius: '16px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.09)',
    maxWidth: '550px',
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
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        <Paper elevation={0} sx={paperStyle}>
          <Box style={logoContainerStyle}>
            <img 
              src="/LOGOO.png" 
              alt="Frost and Crinkle Logo" 
              style={{
                height: '72px',
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
                marginBottom: '8px',
                fontSize: '0.85rem',
                padding: '4px 16px',
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
              marginBottom: '6px',
              fontSize: '1.6rem',
              background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Create Account
          </Typography>
          
          <Typography 
            variant="body2" 
            align="center" 
            style={{ color: '#64748b', marginBottom: '24px', fontSize: '14px' }}
          >
            Join Frost & Crinkle for delicious baked goods
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Row 1: Full Name (Full Width) */}
            <TextField
              fullWidth label="Full Name" name="name" value={formData.name}
              onChange={handleChange} required margin="normal"
              error={!!fieldErrors.name} helperText={fieldErrors.name}
              InputLabelProps={{ shrink: true }}
              InputProps={{ startAdornment: <InputAdornment position="start"><Person style={{ color: '#ff69b4', fontSize: '20px' }} /></InputAdornment> }}
              style={{ marginTop: 0, marginBottom: '16px' }}
            />

            {/* Row 2: Email (Left) + Phone (Right) */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: { xs: '10px', sm: '16px' }, 
              marginBottom: '16px',
            }}>
              <TextField
                fullWidth label="Email Address" name="email" type="email" value={formData.email}
                onChange={handleChange} required margin="normal"
                error={!!fieldErrors.email} helperText={fieldErrors.email}
                InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Email style={{ color: '#ff69b4', fontSize: '20px' }} /></InputAdornment> }}
                style={{ marginTop: 0, marginBottom: 0 }}
              />
              <TextField
                fullWidth label="Phone Number" name="phone" value={formData.phone}
                onChange={handleChange} required margin="normal"
                error={!!fieldErrors.phone} helperText={fieldErrors.phone}
                inputProps={{ maxLength: 10, pattern: '[6-9][0-9]{9}' }}
                InputLabelProps={{ shrink: true }}
                InputProps={{ startAdornment: <InputAdornment position="start"><Phone style={{ color: '#ff69b4', fontSize: '20px' }} /></InputAdornment> }}
                style={{ marginTop: 0, marginBottom: 0 }}
              />
            </Box>

            {/* Row 3: Password + Confirm Password */}
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              gap: { xs: '10px', sm: '16px' }, 
              marginBottom: '20px',
            }}>
              <TextField
                fullWidth label="Password" name="password"
                type={showPassword ? 'text' : 'password'} value={formData.password}
                onChange={handleChange} required margin="normal"
                error={!!fieldErrors.password} helperText={fieldErrors.password}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock style={{ color: '#ff69b4', fontSize: '20px' }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" style={{ color: '#666' }}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                }}
                style={{ marginTop: 0, marginBottom: 0 }}
              />
              <TextField
                fullWidth label="Confirm Password" name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'} value={formData.confirmPassword}
                onChange={handleChange} required margin="normal"
                error={!!fieldErrors.confirmPassword} helperText={fieldErrors.confirmPassword}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Lock style={{ color: '#ff69b4', fontSize: '20px' }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" style={{ color: '#666' }}>{showConfirmPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>,
                }}
                style={{ marginTop: 0, marginBottom: 0 }}
              />
            </Box>

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
                borderRadius: '10px',
                marginTop: '4px',
                marginBottom: '16px',
                background: 'linear-gradient(135deg, #e91e63 0%, #ff6b9d 100%)',
                boxShadow: '0 4px 14px rgba(233, 30, 99, 0.4)',
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Box style={{ textAlign: 'center', marginTop: '8px' }}>
              <Typography variant="body2" style={{ color: '#666', fontSize: '13px' }}>
                Already have an account?{' '}
                <Link
                  component={RouterLink}
                  to={returnUrl !== '/' ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login'}
                  style={{
                    color: '#e91e63',
                    fontWeight: 700,
                    textDecoration: 'none',
                    borderBottom: '2px solid #e91e63',
                    paddingBottom: '2px',
                  }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
