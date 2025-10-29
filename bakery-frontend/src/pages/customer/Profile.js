import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  IconButton,
  InputAdornment,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Lock,
  Save,
  Visibility,
  VisibilityOff,
  Edit,
  Cancel,
  ExpandMore,
} from '@mui/icons-material';
import { customerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CustomerHeader from '../../components/CustomerHeader';
import Footer from '../../components/Footer';
import { showSuccess, showError } from '../../utils/toast';
import { validateEmail, validatePhone, validateName, validatePasswordSimple, validateConfirmPassword } from '../../utils/formValidation';

const Profile = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [expandedProfile, setExpandedProfile] = useState(false);
  const [expandedPassword, setExpandedPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
    
    // Real-time validation
    const errors = {};
    if (name === 'newPassword') {
      if (value.length > 0 && value.length < 6) {
        errors.newPassword = 'Password must be at least 6 characters';
      }
      if (passwordData.confirmPassword && value !== passwordData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    if (name === 'confirmPassword') {
      if (value !== passwordData.newPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }
    setPasswordErrors(errors);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await customerAPI.update(user.id, formData);
      if (response.data.success) {
        // Update user in context
        login({ ...user, ...formData });
        showSuccess('Profile updated successfully!');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await customerAPI.updatePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showSuccess('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CustomerHeader />

      <Box style={{ flex: 1, background: '#f5f5f5', paddingTop: '100px', paddingBottom: '40px', paddingLeft: '8px', paddingRight: '8px' }}>
        <Container maxWidth="md">
          {/* Profile Header */}
          <Paper style={{ padding: '30px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center' }}>
            <Avatar
              style={{
                width: '100px',
                height: '100px',
                margin: '0 auto 20px',
                background: '#e91e63',
                fontSize: '40px',
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h4" style={{ fontWeight: 700, marginBottom: '8px' }}>
              {user?.name}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {user?.email}
            </Typography>
          </Paper>

          {/* Profile Information */}
          <Accordion 
            expanded={expandedProfile} 
            onChange={() => setExpandedProfile(!expandedProfile)}
            style={{ marginBottom: '20px', borderRadius: '0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              style={{ padding: '16px 24px' }}
            >
              <Box style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Person style={{ marginRight: '10px', color: '#ff69b4' }} />
                <Typography variant="h6" style={{ fontWeight: 600, flexGrow: 1 }}>
                  Profile Information
                </Typography>
                {expandedProfile && (
                  <Button
                    startIcon={editMode ? <Cancel /> : <Edit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditMode(!editMode);
                    }}
                    style={{
                      color: editMode ? '#666' : '#e91e63',
                      textTransform: 'none',
                      fontWeight: 600,
                      marginRight: '16px',
                    }}
                  >
                    {editMode ? 'Cancel' : 'Edit'}
                  </Button>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails style={{ padding: '24px' }}>

            <form onSubmit={handleUpdateProfile}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Person style={{ marginRight: '10px', color: '#666' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled
                    helperText="Email cannot be changed"
                    InputProps={{
                      startAdornment: <Email style={{ marginRight: '10px', color: '#666' }} />,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: <Phone style={{ marginRight: '10px', color: '#666' }} />,
                    }}
                  />
                </Grid>
                {editMode && (
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      startIcon={<Save />}
                      style={{
                        background: '#e91e63',
                        color: '#fff',
                        padding: '12px',
                        textTransform: 'none',
                        fontSize: '16px',
                      }}
                    >
                      Save Changes
                    </Button>
                  </Grid>
                )}
              </Grid>
            </form>
            </AccordionDetails>
          </Accordion>

          {/* Change Password */}
          <Accordion 
            expanded={expandedPassword} 
            onChange={() => setExpandedPassword(!expandedPassword)}
            style={{ borderRadius: '0', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
          >
            <AccordionSummary
              expandIcon={<ExpandMore />}
              style={{ padding: '16px 24px' }}
            >
              <Box style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Lock style={{ marginRight: '10px', color: '#ff69b4' }} />
                <Typography variant="h6" style={{ fontWeight: 600, flexGrow: 1 }}>
                  Change Password
                </Typography>
                {expandedPassword && (
                  <Button
                    startIcon={editPasswordMode ? <Cancel /> : <Edit />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditPasswordMode(!editPasswordMode);
                    }}
                    style={{
                      color: editPasswordMode ? '#666' : '#e91e63',
                      textTransform: 'none',
                      fontWeight: 600,
                      marginRight: '16px',
                    }}
                  >
                    {editPasswordMode ? 'Cancel' : 'Edit'}
                  </Button>
                )}
              </Box>
            </AccordionSummary>
            <AccordionDetails style={{ padding: '24px' }}>

            {editPasswordMode ? (
              <form onSubmit={handleUpdatePassword}>
                <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Current Password"
                    name="currentPassword"
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('current')}
                            edge="end"
                          >
                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="New Password"
                    name="newPassword"
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    required
                    error={!!passwordErrors.newPassword}
                    helperText={passwordErrors.newPassword || "Must be at least 6 characters"}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('new')}
                            edge="end"
                          >
                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Confirm New Password"
                    name="confirmPassword"
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                    error={!!passwordErrors.confirmPassword}
                    helperText={passwordErrors.confirmPassword}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => togglePasswordVisibility('confirm')}
                            edge="end"
                          >
                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={loading}
                    startIcon={<Lock />}
                    style={{
                      background: '#e91e63',
                      color: '#fff',
                      padding: '12px',
                      textTransform: 'none',
                      fontSize: '16px',
                    }}
                  >
                    Update Password
                  </Button>
                </Grid>
                </Grid>
              </form>
            ) : (
              <Typography variant="body1" color="textSecondary" style={{ textAlign: 'center', padding: '20px' }}>
                Click "Edit Password" to change your password
              </Typography>
            )}
            </AccordionDetails>
          </Accordion>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
};

export default Profile;
