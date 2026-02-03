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
  Stack,
  Chip,
  IconButton,
  InputAdornment,
  FormControlLabel,
  Switch,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Tooltip,
  CircularProgress,
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
  Add,
  Home,
  CreditCard,
  DeleteOutline,
  CheckCircle,
  ShieldOutlined,
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import designTokens from '../../theme/designTokens';
import { customerAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';
import { showSuccess, showError } from '../../utils/toast';

const { colors, gradients, shadows, transitions } = designTokens;

const defaultPreferences = {
  eggless: false,
  nutFree: false,
  sugarFree: false,
};

const paymentTypeOptions = [
  { value: 'Card', label: 'Credit / Debit Card' },
  { value: 'UPI', label: 'UPI ID' },
  { value: 'Wallet', label: 'Wallet / PayLater' },
  { value: 'Cash', label: 'Cash on Delivery' },
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, login, loading: authLoading } = useAuth();

  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);

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
  const [editPasswordMode, setEditPasswordMode] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    id: null,
    label: '',
    contactName: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    instructions: '',
    isDefault: false,
  });

  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);
  const [paymentForm, setPaymentForm] = useState({
    id: null,
    nickname: '',
    type: 'Card',
    details: '',
    expiry: '',
    notes: '',
    isPrimary: false,
  });

  const [preferences, setPreferences] = useState(defaultPreferences);

  const storageKey = user?.id ? `profile_meta_${user.id}` : null;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!storageKey) {
      setAddresses([]);
      setPaymentMethods([]);
      setPreferences(defaultPreferences);
      return;
    }

    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAddresses(parsed.addresses || []);
        setPaymentMethods(parsed.paymentMethods || []);
        setPreferences({ ...defaultPreferences, ...(parsed.preferences || {}) });
      } catch (error) {
        console.error('Failed to parse personalization data', error);
      }
    } else {
      setAddresses([]);
      setPaymentMethods([]);
      setPreferences(defaultPreferences);
    }
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey) return;
    const payload = JSON.stringify({ addresses, paymentMethods, preferences });
    localStorage.setItem(storageKey, payload);
  }, [addresses, paymentMethods, preferences, storageKey]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

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
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    if (!user) return;
    setProfileSaving(true);

    try {
      const response = await customerAPI.update(user.id, formData);
      if (response.data.success) {
        login({ ...user, ...formData });
        showSuccess('Profile updated successfully!');
        setEditMode(false);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    if (!user) return;

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showError('Password must be at least 6 characters');
      return;
    }

    setPasswordSaving(true);

    try {
      await customerAPI.updatePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showSuccess('Password updated successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setEditPasswordMode(false);
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const buildInitialAddressForm = () => ({
    id: null,
    label: addresses.length === 0 ? 'Home' : '',
    contactName: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    postalCode: '',
    instructions: '',
    isDefault: addresses.length === 0,
  });

  const handleOpenAddressDialog = (address = null) => {
    if (address) {
      setAddressForm({ ...address });
      setEditingAddressId(address.id);
    } else {
      setAddressForm(buildInitialAddressForm());
      setEditingAddressId(null);
    }
    setAddressDialogOpen(true);
  };

  const handleCloseAddressDialog = () => {
    setAddressDialogOpen(false);
    setAddressForm(buildInitialAddressForm());
    setEditingAddressId(null);
  };

  const handleAddressFieldChange = (event) => {
    const { name, value } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressToggle = (event) => {
    const { name, checked } = event.target;
    setAddressForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSaveAddress = (event) => {
    event.preventDefault();

    if (!addressForm.label.trim() || !addressForm.line1.trim() || !addressForm.city.trim() || !addressForm.postalCode.trim()) {
      showError('Please add a label, address line, city, and postal code.');
      return;
    }

    const normalized = {
      ...addressForm,
      id: editingAddressId ?? Date.now(),
      label: addressForm.label.trim(),
      contactName: addressForm.contactName.trim(),
      phone: addressForm.phone.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      postalCode: addressForm.postalCode.trim(),
      instructions: addressForm.instructions.trim(),
    };

    setAddresses((prev) => {
      let updated = editingAddressId
        ? prev.map((item) => (item.id === editingAddressId ? normalized : item))
        : [...prev, normalized];

      if (normalized.isDefault) {
        updated = updated.map((item) => ({ ...item, isDefault: item.id === normalized.id }));
      }

      return updated;
    });

    showSuccess(editingAddressId ? 'Address updated' : 'Address added');
    handleCloseAddressDialog();
  };

  const handleDeleteAddress = (id) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id));
    showSuccess('Address removed');
  };

  const handleMakeDefaultAddress = (id) => {
    setAddresses((prev) => prev.map((item) => ({ ...item, isDefault: item.id === id })));
    showSuccess('Default address updated');
  };

  const buildInitialPaymentForm = () => ({
    id: null,
    nickname: '',
    type: 'Card',
    details: '',
    expiry: '',
    notes: '',
    isPrimary: paymentMethods.length === 0,
  });

  const handleOpenPaymentDialog = (payment = null) => {
    if (payment) {
      setPaymentForm({ ...payment });
      setEditingPaymentId(payment.id);
    } else {
      setPaymentForm(buildInitialPaymentForm());
      setEditingPaymentId(null);
    }
    setPaymentDialogOpen(true);
  };

  const handleClosePaymentDialog = () => {
    setPaymentDialogOpen(false);
    setPaymentForm(buildInitialPaymentForm());
    setEditingPaymentId(null);
  };

  const handlePaymentFieldChange = (event) => {
    const { name, value } = event.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentToggle = (event) => {
    const { name, checked } = event.target;
    setPaymentForm((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSavePayment = (event) => {
    event.preventDefault();

    if (!paymentForm.nickname.trim() || !paymentForm.details.trim()) {
      showError('Please add a nickname and payment identifier.');
      return;
    }

    const normalized = {
      ...paymentForm,
      id: editingPaymentId ?? Date.now(),
      nickname: paymentForm.nickname.trim(),
      details: paymentForm.details.trim(),
      expiry: paymentForm.expiry.trim(),
      notes: paymentForm.notes.trim(),
    };

    setPaymentMethods((prev) => {
      let updated = editingPaymentId
        ? prev.map((item) => (item.id === editingPaymentId ? normalized : item))
        : [...prev, normalized];

      if (normalized.isPrimary) {
        updated = updated.map((item) => ({ ...item, isPrimary: item.id === normalized.id }));
      }

      return updated;
    });

    showSuccess(editingPaymentId ? 'Payment method updated' : 'Payment method added');
    handleClosePaymentDialog();
  };

  const handleDeletePayment = (id) => {
    setPaymentMethods((prev) => prev.filter((item) => item.id !== id));
    showSuccess('Payment method removed');
  };

  const handleMakePrimaryPayment = (id) => {
    setPaymentMethods((prev) => prev.map((item) => ({ ...item, isPrimary: item.id === id })));
    showSuccess('Primary payment method updated');
  };

  const handlePreferenceToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const activePreferences = Object.keys(preferences).filter((key) => preferences[key]);

  if (authLoading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', backgroundColor: colors.cloud }}>
        <CircularProgress sx={{ color: colors.brandPink }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: '100vh', backgroundColor: colors.cloud }}>
        <Paper
          sx={{
            px: 4,
            py: 5,
            borderRadius: 0,
            border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
            boxShadow: shadows.subtle,
          }}
        >
          <Stack spacing={2} alignItems="center">
            <ShieldOutlined sx={{ fontSize: 48, color: colors.brandPink }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: colors.brandInk }}>
              Please sign in to personalise your profile
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                borderRadius: 0,
                px: 4,
                py: 1.25,
                background: gradients.primary,
                boxShadow: shadows.resting,
                textTransform: 'none',
                fontWeight: 600,
              }}
            >
              Go to login
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: colors.cloud }}>
      <Box sx={{ flex: 1, pt: { xs: 12, md: 14 }, pb: { xs: 10, md: 12 } }}>
        <Container maxWidth="lg">
          <Stack spacing={4}>
            <Paper
              sx={{
                borderRadius: 0,
                px: { xs: 3, md: 4 },
                py: { xs: 4, md: 5 },
                background: gradients.softGlow,
                boxShadow: shadows.subtle,
              }}
            >
              <Grid container spacing={3} alignItems="center">
                <Grid item xs={12} md={3}>
                  <Avatar
                    sx={{
                      width: { xs: 72, md: 96 },
                      height: { xs: 72, md: 96 },
                      fontSize: { xs: '1.8rem', md: '2.6rem' },
                      backgroundColor: alpha(colors.brandPink, 0.2),
                      color: colors.brandPink,
                      fontWeight: 700,
                      border: `2px solid ${alpha(colors.brandPink, 0.25)}`,
                    }}
                  >
                    {user.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                </Grid>
                <Grid item xs={12} md={9}>
                  <Stack spacing={1.25}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, letterSpacing: '-0.02em', color: colors.brandInk }}
                    >
                      Personalisation hub
                    </Typography>
                    <Typography variant="body1" sx={{ color: colors.stone, maxWidth: 520 }}>
                      Tailor Frost & Crinkle to your taste. Update your profile, store preferred addresses and
                      payment methods, and let us know your dietary preferences for a seamless experience.
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      <Chip
                        icon={<CheckCircle sx={{ fontSize: 18 }} />}
                        label={`${addresses.length} saved ${addresses.length === 1 ? 'address' : 'addresses'}`}
                        sx={{
                          borderRadius: 0,
                          backgroundColor: alpha(colors.brandPink, 0.12),
                          color: colors.brandPink,
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        icon={<CreditCard sx={{ fontSize: 18 }} />}
                        label={`${paymentMethods.length} preferred payment${paymentMethods.length === 1 ? '' : 's'}`}
                        sx={{
                          borderRadius: 0,
                          backgroundColor: alpha(colors.brandBurgundy, 0.1),
                          color: colors.brandBurgundy,
                          fontWeight: 600,
                        }}
                      />
                      {activePreferences.length > 0 && (
                        <Chip
                          icon={<ShieldOutlined sx={{ fontSize: 18 }} />}
                          label={`${activePreferences.length} dietary preference${activePreferences.length === 1 ? '' : 's'} active`}
                          sx={{
                            borderRadius: 0,
                            backgroundColor: alpha(colors.success, 0.12),
                            color: colors.success,
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            <Grid container spacing={4}>
              <Grid item xs={12} md={7}>
                <Stack spacing={3}>
                  <Paper
                    sx={{
                      borderRadius: 0,
                      border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                      boxShadow: shadows.subtle,
                      backgroundColor: colors.paper,
                      p: { xs: 3, md: 4 },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                      <Stack spacing={0.5}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brandInk }}>
                          Profile information
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.muted }}>
                          Keep your contact details up to date for a smoother delivery experience.
                        </Typography>
                      </Stack>
                      <Button
                        variant="text"
                        startIcon={editMode ? <Cancel /> : <Edit />}
                        onClick={() => setEditMode((prev) => !prev)}
                        sx={{
                          borderRadius: 0,
                          fontWeight: 600,
                          textTransform: 'none',
                          color: editMode ? colors.muted : colors.brandPink,
                        }}
                      >
                        {editMode ? 'Cancel' : 'Edit'}
                      </Button>
                    </Stack>

                    <Box component="form" onSubmit={handleUpdateProfile}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Full name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={!editMode}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Person sx={{ color: colors.muted }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={formData.email}
                            disabled
                            helperText="Email is verified and cannot be updated online"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Email sx={{ color: colors.muted }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Phone number"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            disabled={!editMode}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Phone sx={{ color: colors.muted }} />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        {editMode && (
                          <Grid item xs={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              startIcon={<Save />}
                              disabled={profileSaving}
                              sx={{
                                borderRadius: 0,
                                px: 3,
                                py: 1.2,
                                fontWeight: 600,
                                textTransform: 'none',
                                background: gradients.primary,
                                boxShadow: shadows.resting,
                                '&:hover': { boxShadow: shadows.hover, background: gradients.primary },
                              }}
                            >
                              {profileSaving ? 'Saving…' : 'Save changes'}
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  </Paper>

                  <Paper
                    sx={{
                      borderRadius: 0,
                      border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                      boxShadow: shadows.subtle,
                      backgroundColor: colors.paper,
                      p: { xs: 3, md: 4 },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                      <Stack spacing={0.5}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brandInk }}>
                          Password & security
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.muted }}>
                          Update your password regularly to keep your account secured.
                        </Typography>
                      </Stack>
                      <Button
                        variant="text"
                        startIcon={editPasswordMode ? <Cancel /> : <Edit />}
                        onClick={() => setEditPasswordMode((prev) => !prev)}
                        sx={{
                          borderRadius: 0,
                          fontWeight: 600,
                          textTransform: 'none',
                          color: editPasswordMode ? colors.muted : colors.brandPink,
                        }}
                      >
                        {editPasswordMode ? 'Cancel' : 'Edit'}
                      </Button>
                    </Stack>

                    {editPasswordMode ? (
                      <Box component="form" onSubmit={handleUpdatePassword}>
                        <Stack spacing={2.5}>
                          <TextField
                            fullWidth
                            label="Current password"
                            name="currentPassword"
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            required
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => togglePasswordVisibility('current')} edge="end">
                                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="New password"
                            name="newPassword"
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            required
                            error={!!passwordErrors.newPassword}
                            helperText={passwordErrors.newPassword || 'Must be at least 6 characters'}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => togglePasswordVisibility('new')} edge="end">
                                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <TextField
                            fullWidth
                            label="Confirm new password"
                            name="confirmPassword"
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            required
                            error={!!passwordErrors.confirmPassword}
                            helperText={passwordErrors.confirmPassword || ''}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => togglePasswordVisibility('confirm')} edge="end">
                                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          <Button
                            type="submit"
                            variant="contained"
                            startIcon={<Lock />}
                            disabled={passwordSaving}
                            sx={{
                              borderRadius: 0,
                              px: 3,
                              py: 1.2,
                              fontWeight: 600,
                              textTransform: 'none',
                              background: gradients.primary,
                              boxShadow: shadows.resting,
                              '&:hover': { boxShadow: shadows.hover, background: gradients.primary },
                            }}
                          >
                            {passwordSaving ? 'Updating…' : 'Update password'}
                          </Button>
                        </Stack>
                      </Box>
                    ) : (
                      <Stack spacing={2.5}>
                        <Typography variant="body2" sx={{ color: colors.stone }}>
                          Password updated regularly keeps your frequent purchases safe.
                        </Typography>
                        <Stack direction="row" spacing={1.5}>
                          <Chip label="Two-factor coming soon" variant="outlined" sx={{ borderRadius: 0, fontWeight: 600 }} />
                          <Chip label="Sessions dashboard" variant="outlined" sx={{ borderRadius: 0, fontWeight: 600 }} />
                        </Stack>
                      </Stack>
                    )}
                  </Paper>
                </Stack>
              </Grid>

              <Grid item xs={12} md={5}>
                <Stack spacing={3}>
                  <Paper
                    sx={{
                      borderRadius: 0,
                      border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                      boxShadow: shadows.subtle,
                      backgroundColor: colors.paper,
                      p: { xs: 3, md: 4 },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                      <Stack spacing={0.5}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brandInk }}>
                          Saved addresses
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.muted }}>
                          Speed through checkout with curated delivery spots.
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => handleOpenAddressDialog()}
                        sx={{
                          borderRadius: 0,
                          textTransform: 'none',
                          fontWeight: 600,
                          borderColor: colors.brandPink,
                          color: colors.brandPink,
                          '&:hover': { borderColor: colors.brandBurgundy, color: colors.brandBurgundy },
                        }}
                      >
                        Add
                      </Button>
                    </Stack>

                    <Stack spacing={2.5}>
                      {addresses.length === 0 ? (
                        <Typography variant="body2" sx={{ color: colors.muted }}>
                          No saved addresses yet. Pin your go-to delivery points for a faster checkout.
                        </Typography>
                      ) : (
                        addresses.map((address) => (
                          <Paper
                            key={address.id}
                            sx={{
                              borderRadius: 0,
                              border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                              backgroundColor: alpha(colors.brandInk, 0.02),
                              p: 2.5,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1.5,
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Stack spacing={0.75}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Home sx={{ fontSize: 20, color: colors.brandPink }} />
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.brandInk }}>
                                    {address.label}
                                  </Typography>
                                  {address.isDefault && (
                                    <Chip
                                      label="Default"
                                      size="small"
                                      sx={{
                                        borderRadius: 0,
                                        backgroundColor: alpha(colors.success, 0.18),
                                        color: colors.success,
                                        fontWeight: 600,
                                      }}
                                    />
                                  )}
                                </Stack>
                                <Typography variant="body2" sx={{ color: colors.brandInk, whiteSpace: 'pre-line' }}>
                                  {[address.line1, address.line2, address.city, address.state, address.postalCode]
                                    .filter(Boolean)
                                    .join(', ')}
                                </Typography>
                                {(address.contactName || address.phone) && (
                                  <Typography variant="body2" sx={{ color: colors.muted }}>
                                    {address.contactName}
                                    {address.contactName && address.phone ? ' • ' : ''}
                                    {address.phone}
                                  </Typography>
                                )}
                                {address.instructions && (
                                  <Typography variant="caption" sx={{ color: colors.muted }}>
                                    Note: {address.instructions}
                                  </Typography>
                                )}
                              </Stack>
                              <Stack direction="row" spacing={1}>
                                {!address.isDefault && (
                                  <Tooltip title="Make default">
                                    <IconButton onClick={() => handleMakeDefaultAddress(address.id)} size="small" sx={{ borderRadius: 0 }}>
                                      <CheckCircle sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Tooltip title="Edit">
                                  <IconButton onClick={() => handleOpenAddressDialog(address)} size="small" sx={{ borderRadius: 0 }}>
                                    <Edit sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Remove">
                                  <IconButton onClick={() => handleDeleteAddress(address.id)} size="small" sx={{ borderRadius: 0 }}>
                                    <DeleteOutline sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Stack>
                          </Paper>
                        ))
                      )}
                    </Stack>
                  </Paper>

                  <Paper
                    sx={{
                      borderRadius: 0,
                      border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                      boxShadow: shadows.subtle,
                      backgroundColor: colors.paper,
                      p: { xs: 3, md: 4 },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                      <Stack spacing={0.5}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brandInk }}>
                          Preferred payments
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.muted }}>
                          Store your go-to payment methods for quick confirmation.
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        startIcon={<Add />}
                        onClick={() => handleOpenPaymentDialog()}
                        sx={{
                          borderRadius: 0,
                          textTransform: 'none',
                          fontWeight: 600,
                          borderColor: colors.brandPink,
                          color: colors.brandPink,
                          '&:hover': { borderColor: colors.brandBurgundy, color: colors.brandBurgundy },
                        }}
                      >
                        Add
                      </Button>
                    </Stack>

                    <Stack spacing={2.5}>
                      {paymentMethods.length === 0 ? (
                        <Typography variant="body2" sx={{ color: colors.muted }}>
                          No saved payment methods yet. Add your favourite cards or UPI handles for faster checkout.
                        </Typography>
                      ) : (
                        paymentMethods.map((method) => (
                          <Paper
                            key={method.id}
                            sx={{
                              borderRadius: 0,
                              border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                              backgroundColor: alpha(colors.brandPink, 0.05),
                              p: 2.5,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1.5,
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                              <Stack spacing={0.75}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <CreditCard sx={{ fontSize: 20, color: colors.brandPink }} />
                                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: colors.brandInk }}>
                                    {method.nickname}
                                  </Typography>
                                  {method.isPrimary && (
                                    <Chip
                                      label="Primary"
                                      size="small"
                                      sx={{
                                        borderRadius: 0,
                                        backgroundColor: alpha(colors.brandPink, 0.2),
                                        color: colors.brandPink,
                                        fontWeight: 600,
                                      }}
                                    />
                                  )}
                                </Stack>
                                <Typography variant="body2" sx={{ color: colors.brandInk }}>
                                  {method.type}: {method.details}
                                </Typography>
                                {method.expiry && (
                                  <Typography variant="body2" sx={{ color: colors.muted }}>
                                    Expiry: {method.expiry}
                                  </Typography>
                                )}
                                {method.notes && (
                                  <Typography variant="caption" sx={{ color: colors.muted }}>
                                    Note: {method.notes}
                                  </Typography>
                                )}
                              </Stack>
                              <Stack direction="row" spacing={1}>
                                {!method.isPrimary && (
                                  <Tooltip title="Mark primary">
                                    <IconButton onClick={() => handleMakePrimaryPayment(method.id)} size="small" sx={{ borderRadius: 0 }}>
                                      <CheckCircle sx={{ fontSize: 18 }} />
                                    </IconButton>
                                  </Tooltip>
                                )}
                                <Tooltip title="Edit">
                                  <IconButton onClick={() => handleOpenPaymentDialog(method)} size="small" sx={{ borderRadius: 0 }}>
                                    <Edit sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Remove">
                                  <IconButton onClick={() => handleDeletePayment(method.id)} size="small" sx={{ borderRadius: 0 }}>
                                    <DeleteOutline sx={{ fontSize: 18 }} />
                                  </IconButton>
                                </Tooltip>
                              </Stack>
                            </Stack>
                          </Paper>
                        ))
                      )}
                    </Stack>
                  </Paper>

                  <Paper
                    sx={{
                      borderRadius: 0,
                      border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                      boxShadow: shadows.subtle,
                      backgroundColor: colors.paper,
                      p: { xs: 3, md: 4 },
                    }}
                  >
                    <Stack spacing={2.5}>
                      <Stack spacing={0.5}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: colors.brandInk }}>
                          Dietary preferences
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.muted }}>
                          Let our chefs know your go-to choices for curated recommendations.
                        </Typography>
                      </Stack>

                      <Stack spacing={1.5}>
                        <FormControlLabel
                          control={<Switch checked={preferences.eggless} onChange={() => handlePreferenceToggle('eggless')} />}
                          label="Always show eggless options first"
                        />
                        <FormControlLabel
                          control={<Switch checked={preferences.nutFree} onChange={() => handlePreferenceToggle('nutFree')} />}
                          label="Highlight nut-free bakes"
                        />
                        <FormControlLabel
                          control={<Switch checked={preferences.sugarFree} onChange={() => handlePreferenceToggle('sugarFree')} />}
                          label="Prefer low sugar / sugar-free picks"
                        />
                      </Stack>

                      <Divider sx={{ borderColor: alpha(colors.brandInk, 0.08) }} />

                      <Stack spacing={1}>
                        <Typography variant="subtitle2" sx={{ color: colors.brandInk, fontWeight: 600 }}>
                          Current focus
                        </Typography>
                        {activePreferences.length === 0 ? (
                          <Typography variant="body2" sx={{ color: colors.muted }}>
                            No dietary filters active. Toggle preferences above to personalise your recommendations.
                          </Typography>
                        ) : (
                          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {activePreferences.map((key) => (
                              <Chip
                                key={key}
                                label={
                                  key === 'eggless'
                                    ? 'Eggless favourites'
                                    : key === 'nutFree'
                                    ? 'Nut-free only'
                                    : 'Lower sugar treats'
                                }
                                sx={{
                                  borderRadius: 0,
                                  backgroundColor: alpha(colors.success, 0.12),
                                  color: colors.success,
                                  fontWeight: 600,
                                }}
                              />
                            ))}
                          </Stack>
                        )}
                      </Stack>
                    </Stack>
                  </Paper>
                </Stack>
              </Grid>
            </Grid>
          </Stack>
        </Container>
      </Box>

      <Footer />

      <Dialog open={addressDialogOpen} onClose={handleCloseAddressDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Saved address</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Box component="form" id="address-form" onSubmit={handleSaveAddress}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField label="Label" name="label" value={addressForm.label} onChange={handleAddressFieldChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Contact name" name="contactName" value={addressForm.contactName} onChange={handleAddressFieldChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Phone" name="phone" value={addressForm.phone} onChange={handleAddressFieldChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Address line 1" name="line1" value={addressForm.line1} onChange={handleAddressFieldChange} fullWidth required />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Address line 2" name="line2" value={addressForm.line2} onChange={handleAddressFieldChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="City" name="city" value={addressForm.city} onChange={handleAddressFieldChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="State" name="state" value={addressForm.state} onChange={handleAddressFieldChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Postal code" name="postalCode" value={addressForm.postalCode} onChange={handleAddressFieldChange} fullWidth required />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Delivery notes"
                  name="instructions"
                  value={addressForm.instructions}
                  onChange={handleAddressFieldChange}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch checked={addressForm.isDefault} onChange={handleAddressToggle} name="isDefault" />}
                  label="Set as default delivery address"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleCloseAddressDialog} sx={{ borderRadius: 0, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button type="submit" form="address-form" variant="contained" sx={{ borderRadius: 0, textTransform: 'none', fontWeight: 600 }}>
            {editingAddressId ? 'Save changes' : 'Add address'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={paymentDialogOpen} onClose={handleClosePaymentDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>Payment method</DialogTitle>
        <DialogContent dividers sx={{ pt: 2 }}>
          <Box component="form" id="payment-form" onSubmit={handleSavePayment}>
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <TextField label="Nickname" name="nickname" value={paymentForm.nickname} onChange={handlePaymentFieldChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select label="Type" name="type" value={paymentForm.type} onChange={handlePaymentFieldChange} fullWidth>
                  {paymentTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label={paymentForm.type === 'UPI' ? 'UPI ID' : paymentForm.type === 'Cash' ? 'Instructions' : 'Card / Wallet details'}
                  name="details"
                  value={paymentForm.details}
                  onChange={handlePaymentFieldChange}
                  fullWidth
                  required
                  helperText={paymentForm.type === 'Card' ? 'Mask sensitive digits if preferred (e.g., **** 1234)' : ''}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Expiry / reminder" name="expiry" value={paymentForm.expiry} onChange={handlePaymentFieldChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Notes"
                  name="notes"
                  value={paymentForm.notes}
                  onChange={handlePaymentFieldChange}
                  fullWidth
                  multiline
                  minRows={2}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Switch checked={paymentForm.isPrimary} onChange={handlePaymentToggle} name="isPrimary" />}
                  label="Set as primary payment method"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={handleClosePaymentDialog} sx={{ borderRadius: 0, textTransform: 'none' }}>
            Cancel
          </Button>
          <Button type="submit" form="payment-form" variant="contained" sx={{ borderRadius: 0, textTransform: 'none', fontWeight: 600 }}>
            {editingPaymentId ? 'Save changes' : 'Add method'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
