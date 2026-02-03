import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  CalendarToday,
  CheckCircle,
  Close,
  Download,
  Edit,
  FilterList,
  HelpOutline,
  History,
  Home,
  LocalShipping,
  LocationOn,
  Notes,
  Person,
  Phone,
  RateReview,
  Receipt,
  Replay,
  Save,
  Search,
  ShoppingBag,
} from '@mui/icons-material';
import { orderAPI, orderHistoryAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Footer from '../../components/Footer';
import { showError, showSuccess } from '../../utils/toast';
import LocationPicker from '../../components/LocationPicker';
import { OrderCardSkeleton } from '../../components/LoadingSkeleton';
import OrderStatusStepper from '../../components/OrderStatusStepper';
import { formatCurrency } from '../../utils/currencyUtils';
import designTokens from '../../theme/designTokens';

const defaultEditForm = {
  doorNo: '',
  street: '',
  area: '',
  city: 'Coimbatore',
  pincode: '',
  deliveryPhone: '',
  deliveryNotes: '',
};

const Orders = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { colors, gradients, shadows, spacing } = designTokens;

  const [orders, setOrders] = useState([]);
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [historySearchTerm, setHistorySearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [supportDialogOpen, setSupportDialogOpen] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [editAddressMethod, setEditAddressMethod] = useState(null);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [editLocationCoordinates, setEditLocationCoordinates] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [editFormData, setEditFormData] = useState(defaultEditForm);

  useEffect(() => {
    if (!user) return;

    fetchOrders();
    fetchOrderHistory();

    const handleNotificationAdded = (event) => {
      const notification = event.detail;
      if (notification?.type?.includes('ORDER_')) {
        fetchOrders();
      }
    };

    window.addEventListener('notificationAdded', handleNotificationAdded);
    return () => window.removeEventListener('notificationAdded', handleNotificationAdded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;
    try {
      const response = await orderAPI.getByCustomer(user.id);
      if (response.data?.success) {
        const sortedOrders = (response.data.data || []).sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrders(sortedOrders);
        setSelectedOrder((prev) => {
          if (!prev) return prev;
          return sortedOrders.find((entry) => entry.id === prev.id) || prev;
        });
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      if (err.response?.status === 404) {
        setOrders([]);
      } else {
        setError(err.response?.data?.message || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderHistory = async () => {
    if (!user) return;
    try {
      const response = await orderHistoryAPI.getByCustomer(user.id);
      if (response.data) {
        const sortedHistory = (response.data || []).sort(
          (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
        );
        setOrderHistory(sortedHistory);
      }
    } catch (err) {
      console.error('Error fetching order history:', err);
      if (err.response?.status === 404) {
        setOrderHistory([]);
      }
    }
  };

  const statusFilterOptions = [
    { label: 'All', value: 'ALL' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Confirmed', value: 'Confirmed' },
    { label: 'Packed', value: 'Packed' },
    { label: 'Out for Delivery', value: 'Out for Delivery' },
    { label: 'Delivered', value: 'Delivered' },
  ];

  const statusMetrics = useMemo(() => {
    const base = {
      pending: 0,
      confirmed: 0,
      baking: 0,
      outForDelivery: 0,
      delivered: 0,
      total: orders.length,
    };

    orders.forEach((order) => {
      const status = order.status?.toLowerCase();
      if (!status) return;
      if (status.includes('pending')) base.pending += 1;
      if (status.includes('confirm')) base.confirmed += 1;
      if (status.includes('pack') || status.includes('bake')) base.baking += 1;
      if (status.includes('out')) base.outForDelivery += 1;
      if (status.includes('deliver')) base.delivered += 1;
    });

    return base;
  }, [orders]);

  const activeOrders = Math.max(statusMetrics.total - statusMetrics.delivered, 0);
  const deliveredPercentage = statusMetrics.total
    ? Math.round((statusMetrics.delivered / statusMetrics.total) * 100)
    : 0;
  const todayDeliveries = useMemo(
    () =>
      orders.filter((order) => {
        if (!order.deliveryDate) return false;
        const deliveryDate = new Date(order.deliveryDate);
        const now = new Date();
        return (
          deliveryDate.getDate() === now.getDate() &&
          deliveryDate.getMonth() === now.getMonth() &&
          deliveryDate.getFullYear() === now.getFullYear()
        );
      }).length,
    [orders]
  );

  const metricCards = useMemo(
    () => [
      {
        label: 'Active orders',
        value: activeOrders,
        helper: 'Currently in progress',
        icon: LocalShipping,
        accent: colors.brandPink,
      },
      {
        label: 'Awaiting confirmation',
        value: statusMetrics.pending + statusMetrics.confirmed,
        helper: 'Needs bakery approval',
        icon: CalendarToday,
        accent: colors.accentGold,
      },
      {
        label: 'Deliveries today',
        value: todayDeliveries,
        helper: 'Scheduled for today',
        icon: CheckCircle,
        accent: colors.success,
      },
      {
        label: 'Delivered',
        value: statusMetrics.delivered,
        helper: `${deliveredPercentage}% of total orders`,
        icon: Receipt,
        accent: colors.brandInk,
      },
    ],
    [activeOrders, colors, deliveredPercentage, statusMetrics, todayDeliveries]
  );

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === 'ALL' || (order.status || '').toLowerCase() === statusFilter.toLowerCase();
      if (!matchesStatus) return false;

      if (!searchTerm.trim()) return true;

      const term = searchTerm.trim().toLowerCase();
      const idMatch = String(order.id).toLowerCase().includes(term);
      const itemMatch = (order.orderItems || []).some((item) =>
        item.item?.name?.toLowerCase().includes(term) || item.itemName?.toLowerCase().includes(term)
      );
      const notesMatch = order.deliveryNotes?.toLowerCase().includes(term);

      return idMatch || itemMatch || notesMatch;
    });
  }, [orders, searchTerm, statusFilter]);

  const filteredHistory = useMemo(() => {
    if (!historySearchTerm.trim()) return orderHistory;
    const term = historySearchTerm.trim().toLowerCase();
    return orderHistory.filter((order) => {
      const idMatch = String(order.id).toLowerCase().includes(term);
      const itemMatch = (order.orderItems || []).some((item) =>
        item.item?.name?.toLowerCase().includes(term) || item.itemName?.toLowerCase().includes(term)
      );
      return idMatch || itemMatch;
    });
  }, [historySearchTerm, orderHistory]);

  const showEmptyState = !loading && orders.length === 0;
  const showNoMatches = !loading && orders.length > 0 && filteredOrders.length === 0;
  const showHistoryEmpty = !loading && orderHistory.length === 0;
  const showHistoryNoMatches = !loading && orderHistory.length > 0 && filteredHistory.length === 0;

  const formatOrderDate = (value) => {
    if (!value) return 'N/A';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  };

  const summarizeOrderItems = (order) => {
    const items = order.orderItems || [];
    if (!items.length) return 'No items';
    const preview = items.slice(0, 2).map((item) => {
      const name = item.item?.name || item.itemName || 'Item';
      return `${name} × ${item.quantity}`;
    });
    const remaining = items.length - preview.length;
    return `${preview.join(', ')}${remaining > 0 ? ` + ${remaining} more` : ''}`;
  };

  const getDeliverySnapshot = (order) => {
    if (order.deliveryDate) {
      return `Scheduled for ${new Date(order.deliveryDate).toLocaleDateString('en-IN', {
        month: 'short',
        day: 'numeric',
      })}`;
    }
    if (order.expectedDeliveryTime) {
      return `Expected by ${order.expectedDeliveryTime}`;
    }
    return 'Delivery slot to be confirmed';
  };

  const getStatusAccent = (status) => {
    const key = (status || '').toLowerCase();
    if (key.includes('pending')) return colors.warning;
    if (key.includes('confirm')) return colors.accentGold;
    if (key.includes('pack') || key.includes('bake')) return colors.accentGold;
    if (key.includes('out')) return '#1976d2';
    if (key.includes('deliver')) return colors.success;
    return colors.stone;
  };

  const handleOpenDetail = (order) => {
    setSelectedOrder(order);
    setDetailOpen(true);
    setEditingOrderId(null);
    setEditAddressMethod(null);
    setEditLocationCoordinates(null);
    setEditFormData(defaultEditForm);
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedOrder(null);
    handleCancelEdit();
  };

  const handleReorder = (order) => {
    showSuccess(`We'll rebuild order #${order.id} in your cart shortly.`);
  };

  const handleTrackOrder = (order) => {
    if (order.trackingUrl) {
      window.open(order.trackingUrl, '_blank', 'noopener,noreferrer');
    } else {
      showError('Tracking information will be available once the package is dispatched.');
    }
  };

  const handleDownloadInvoice = (order) => {
    if (order.invoiceUrl) {
      window.open(order.invoiceUrl, '_blank', 'noopener,noreferrer');
    } else {
      showSuccess('A detailed invoice will be sent to your email shortly.');
    }
  };

  const handleReviewOrder = (order) => {
    showSuccess(`Feedback flow for order #${order.id} will open soon.`);
  };

  const handleOpenSupport = (order) => {
    setSelectedOrder(order);
    setSupportMessage(`Hi Bakery team,\n\nI need help with order #${order.id}.\n\nDetails: `);
    setSupportDialogOpen(true);
  };

  const handleSupportSubmit = () => {
    if (!supportMessage.trim()) {
      showError('Please add a short note before sending your request.');
      return;
    }
    showSuccess('Thanks! Our support team will reach out shortly.');
    setSupportDialogOpen(false);
    setSupportMessage('');
  };

  const handleEditAddress = (order) => {
    setEditingOrderId(order.id);
    setEditAddressMethod(null);
    setEditLocationCoordinates(null);

    let doorNo = '';
    let street = '';
    let area = '';
    let city = 'Coimbatore';
    let pincode = '';

    if (order.deliveryAddress) {
      const parts = order.deliveryAddress.split(',').map((part) => part.trim());
      if (parts[0]?.toLowerCase() === 'location') {
        doorNo = 'location';
      } else {
        doorNo = parts[0] || '';
        street = parts[1] || '';
        let cityPincodeIndex = -1;
        for (let i = parts.length - 1; i >= 2; i -= 1) {
          if (parts[i].includes('-')) {
            cityPincodeIndex = i;
            break;
          }
        }
        if (cityPincodeIndex !== -1) {
          area = parts.slice(2, cityPincodeIndex).join(', ');
          const cityPincode = parts[cityPincodeIndex]
            .split('-')
            .map((segment) => segment.trim());
          city = cityPincode[0] || 'Coimbatore';
          pincode = cityPincode[1] || '';
        } else {
          area = parts.slice(2).join(', ');
        }
      }
    }

    setEditFormData({
      doorNo,
      street,
      area,
      city,
      pincode,
      deliveryPhone: order.deliveryPhone || '',
      deliveryNotes: order.deliveryNotes || '',
    });
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
    setEditAddressMethod(null);
    setEditLocationCoordinates(null);
    setEditFormData(defaultEditForm);
  };

  const handleEditFormChange = (event) => {
    const { name, value } = event.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationSelectInEdit = (locationData) => {
    setShowLocationPicker(false);
    setEditFormData((prev) => ({
      ...prev,
      doorNo: 'location',
      street: '',
      area: '',
      city: 'Coimbatore',
      pincode: '',
    }));
    setEditLocationCoordinates({
      lat: locationData.lat,
      lng: locationData.lng,
    });
    setEditAddressMethod('location');
    showSuccess('Location verified! Your GPS location will be used for delivery.');
  };

  const handleSaveAddress = async (orderId) => {
    if (!editFormData.deliveryPhone) {
      showError('Please enter phone number');
      return;
    }

    const isLocationBased = editFormData.doorNo.trim().toLowerCase() === 'location';

    if (!editFormData.doorNo) {
      showError('Please fill in door number or use location verification');
      return;
    }

    if (!isLocationBased) {
      if (!editFormData.street || !editFormData.area || !editFormData.pincode) {
        showError('Please fill in all address fields');
        return;
      }
      if (!/^641[0-9]{3}$/.test(editFormData.pincode)) {
        showError('Please enter a valid Coimbatore pincode (641xxx)');
        return;
      }
    }

    setUpdating(true);
    try {
      const deliveryAddress = `${editFormData.doorNo}, ${editFormData.street}, ${editFormData.area}, ${editFormData.city} - ${editFormData.pincode}`;
      const updatePayload = {
        deliveryAddress,
        deliveryPhone: editFormData.deliveryPhone,
        deliveryNotes: editFormData.deliveryNotes,
        latitude: editLocationCoordinates?.lat || null,
        longitude: editLocationCoordinates?.lng || null,
      };

      const response = await orderAPI.updateAddress(orderId, user.id, updatePayload);
      if (response.data?.success) {
        showSuccess(response.data.message || 'Address updated successfully');
        handleCancelEdit();
        fetchOrders();
      } else {
        showError(response.data?.message || 'Failed to update address');
      }
    } catch (err) {
      console.error('Error updating address:', err);
      showError(err.response?.data?.message || 'Failed to update address');
    } finally {
      setUpdating(false);
    }
  };

  const renderManualEditForm = () => (
    <Box
      sx={{
        border: `1px dashed ${alpha(colors.brandInk, 0.2)}`,
        borderRadius: 0,
        p: { xs: spacing(3), md: spacing(4) },
        backgroundColor: alpha(colors.brandInk, 0.02),
        mt: spacing(3),
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            name="deliveryPhone"
            value={editFormData.deliveryPhone}
            onChange={handleEditFormChange}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone fontSize="small" sx={{ color: colors.brandPink }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 0 },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Door No / Building"
            name="doorNo"
            value={editFormData.doorNo}
            onChange={handleEditFormChange}
            size="small"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Home fontSize="small" sx={{ color: colors.brandPink }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 0 },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Street"
            name="street"
            value={editFormData.street}
            onChange={handleEditFormChange}
            size="small"
            required
            InputProps={{ sx: { borderRadius: 0 } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Area / Locality"
            name="area"
            value={editFormData.area}
            onChange={handleEditFormChange}
            size="small"
            required
            InputProps={{ sx: { borderRadius: 0 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value="Coimbatore"
            size="small"
            disabled
            InputProps={{ sx: { borderRadius: 0 } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Pincode"
            name="pincode"
            value={editFormData.pincode}
            onChange={handleEditFormChange}
            size="small"
            required
            placeholder="641xxx"
            inputProps={{ maxLength: 6 }}
            InputProps={{ sx: { borderRadius: 0 } }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Delivery Notes (Optional)"
            name="deliveryNotes"
            value={editFormData.deliveryNotes}
            onChange={handleEditFormChange}
            size="small"
            multiline
            minRows={2}
            placeholder="Any special instructions for delivery..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Notes fontSize="small" sx={{ color: colors.brandPink }} />
                </InputAdornment>
              ),
              sx: { borderRadius: 0 },
            }}
          />
        </Grid>
      </Grid>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: spacing(4) }}>
        <Button
          variant="contained"
          onClick={() => handleSaveAddress(editingOrderId)}
          disabled={updating}
          startIcon={
            updating ? <CircularProgress size={18} sx={{ color: colors.paper }} /> : <Save fontSize="small" />
          }
          sx={{
            flex: 1,
            textTransform: 'none',
            borderRadius: 0,
            background: updating ? colors.muted : gradients.primary,
            boxShadow: shadows.subtle,
          }}
        >
          {updating ? 'Saving…' : 'Save changes'}
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancelEdit}
          disabled={updating}
          startIcon={<Close fontSize="small" />}
          sx={{
            flex: 1,
            textTransform: 'none',
            borderRadius: 0,
            borderColor: colors.brandPink,
            color: colors.brandPink,
          }}
        >
          Cancel
        </Button>
      </Stack>
    </Box>
  );

  const renderOrderCardActions = (order) => {
    const actions = [
      {
        label: 'Track package',
        icon: LocalShipping,
        onClick: () => handleTrackOrder(order),
        disabled: !order.trackingUrl,
        tooltip: order.trackingUrl ? '' : 'Tracking becomes available once dispatched',
      },
      {
        label: 'Reorder',
        icon: Replay,
        onClick: () => handleReorder(order),
        disabled: false,
        tooltip: '',
      },
      {
        label: 'Need help',
        icon: HelpOutline,
        onClick: () => handleOpenSupport(order),
        disabled: false,
        tooltip: '',
      },
    ];

    return (
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ flexWrap: 'wrap' }}>
        {actions.map((action) => {
          const ActionIcon = action.icon;
          return (
            <Tooltip key={action.label} title={action.tooltip} disableHoverListener={!action.tooltip}>
              <span>
                <Button
                  variant="outlined"
                  onClick={action.onClick}
                  disabled={action.disabled}
                  startIcon={<ActionIcon fontSize="small" />}
                  sx={{
                    borderRadius: 0,
                    textTransform: 'none',
                    borderColor: colors.brandPink,
                    color: colors.brandPink,
                    minWidth: { xs: '100%', sm: 160 },
                  }}
                >
                  {action.label}
                </Button>
              </span>
            </Tooltip>
          );
        })}
        <Button
          variant="contained"
          onClick={() => handleOpenDetail(order)}
          startIcon={<Receipt fontSize="small" />}
          sx={{
            borderRadius: 0,
            textTransform: 'none',
            background: gradients.primary,
            minWidth: { xs: '100%', sm: 160 },
            boxShadow: shadows.subtle,
          }}
        >
          View details
        </Button>
      </Stack>
    );
  };

  const renderOrderCard = (order) => {
    const statusAccent = getStatusAccent(order.status);
    const itemCount = (order.orderItems || []).reduce((acc, item) => acc + (item.quantity || 0), 0);

    return (
      <Paper
        key={order.id}
        elevation={0}
        sx={{
          borderRadius: 0,
          p: { xs: spacing(4), md: spacing(5) },
          background: 'linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,240,245,0.92) 100%)',
          border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
          boxShadow: shadows.subtle,
        }}
      >
        <Stack spacing={spacing(3)}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', md: 'center' }}
            spacing={spacing(2)}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ color: colors.muted, letterSpacing: '0.12em' }}>
                Order #{order.id}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5 }}>
                {summarizeOrderItems(order)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.stone, mt: 0.5 }}>
                Placed on {formatOrderDate(order.orderDate)}
              </Typography>
            </Box>
            <Chip
              label={order.status}
              sx={{
                backgroundColor: alpha(statusAccent, 0.18),
                color: statusAccent,
                fontWeight: 600,
                letterSpacing: '0.06em',
              }}
            />
          </Stack>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={spacing(3)}
            alignItems={{ md: 'center' }}
            divider={<Divider flexItem orientation={{ xs: 'horizontal', md: 'vertical' }} />}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CalendarToday fontSize="small" sx={{ color: colors.brandPink }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {getDeliverySnapshot(order)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <ShoppingBag fontSize="small" sx={{ color: colors.brandPink }} />
              <Typography variant="body2">
                Total {formatCurrency(order.totalAmount)} ({itemCount} {itemCount === 1 ? 'item' : 'items'})
              </Typography>
            </Stack>
          </Stack>

          <OrderStatusStepper currentStatus={order.status} />

          {renderOrderCardActions(order)}
        </Stack>
      </Paper>
    );
  };

  const renderHistoryCard = (order) => {
    const statusAccent = getStatusAccent(order.status);

    return (
      <Paper
        key={order.id}
        elevation={0}
        sx={{
          borderRadius: 0,
          p: { xs: spacing(3), md: spacing(4) },
          backgroundColor: colors.paper,
          border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
        }}
      >
        <Stack spacing={spacing(2)}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="subtitle2" sx={{ color: colors.muted, letterSpacing: '0.1em' }}>
                Order #{order.id}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {formatCurrency(order.totalAmount)} • {summarizeOrderItems(order)}
              </Typography>
              <Typography variant="body2" sx={{ color: colors.stone }}>
                Delivered on {formatOrderDate(order.deliveryDate || order.orderDate)}
              </Typography>
            </Box>
            <Chip
              label={order.status}
              sx={{
                backgroundColor: alpha(statusAccent, 0.12),
                color: statusAccent,
                fontWeight: 600,
              }}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<Replay fontSize="small" />}
              onClick={() => handleReorder(order)}
              sx={{
                borderRadius: 0,
                borderColor: colors.brandPink,
                color: colors.brandPink,
                textTransform: 'none',
              }}
            >
              Reorder items
            </Button>
            <Button
              variant="outlined"
              startIcon={<Download fontSize="small" />}
              onClick={() => handleDownloadInvoice(order)}
              sx={{
                borderRadius: 0,
                borderColor: alpha(colors.brandInk, 0.2),
                color: colors.brandInk,
                textTransform: 'none',
              }}
            >
              Download invoice
            </Button>
            {order.status === 'Delivered' && (
              <Button
                variant="contained"
                startIcon={<RateReview fontSize="small" />}
                onClick={() => handleReviewOrder(order)}
                sx={{
                  borderRadius: 0,
                  textTransform: 'none',
                  background: gradients.primary,
                }}
              >
                Leave a review
              </Button>
            )}
          </Stack>
        </Stack>
      </Paper>
    );
  };

  const renderDeliveryInformation = (order) => (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: spacing(1.5) }}>
        Delivery information
      </Typography>
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Person fontSize="small" sx={{ color: colors.brandPink }} />
          <Typography variant="body2">{order.customerName || 'N/A'}</Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Phone fontSize="small" sx={{ color: colors.brandPink }} />
          <Typography variant="body2">{order.deliveryPhone || 'N/A'}</Typography>
        </Stack>
        <Stack direction="row" spacing={1.5} alignItems="flex-start">
          <Home fontSize="small" sx={{ color: colors.brandPink, mt: 0.4 }} />
          <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
            {order.deliveryAddress && order.deliveryAddress.startsWith('location,')
              ? order.latitude && order.longitude
                ? `📍 Lat: ${order.latitude.toFixed(6)}, Long: ${order.longitude.toFixed(6)}`
                : '📍 Location-based delivery'
              : order.deliveryAddress || 'N/A'}
          </Typography>
        </Stack>
        {order.deliveryNotes && (
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Notes fontSize="small" sx={{ color: colors.brandPink, mt: 0.4 }} />
            <Typography variant="body2" sx={{ fontStyle: 'italic' }}>{order.deliveryNotes}</Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: colors.cloud }}>
      <Box
        sx={{
          flex: 1,
          py: { xs: spacing(10), md: spacing(16) },
          background: gradients.subtleCard,
          backgroundSize: 'cover',
        }}
      >
        <Container maxWidth="lg">
          {error && (
            <Alert severity="error" sx={{ mb: spacing(3), borderRadius: 0 }}>
              {error}
            </Alert>
          )}

          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              px: { xs: spacing(4), md: spacing(6) },
              py: { xs: spacing(5), md: spacing(7) },
              mb: spacing(5),
              background: 'linear-gradient(130deg, rgba(255,255,255,0.94) 0%, rgba(255,235,243,0.92) 50%, rgba(255,255,255,0.94) 100%)',
              border: `1px solid ${alpha(colors.brandInk, 0.06)}`,
              boxShadow: shadows.subtle,
            }}
          >
            <Stack spacing={spacing(4)}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={spacing(3)}
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: spacing(1.5) }}>
                    <Receipt sx={{ color: colors.brandPink }} />
                    <Typography variant="overline" sx={{ letterSpacing: '0.2em', color: colors.muted }}>
                      Orders dashboard
                    </Typography>
                  </Stack>
                  <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    Track every bakery order from kitchen to doorstep
                  </Typography>
                  <Typography variant="body1" sx={{ color: colors.stone, mt: spacing(2), maxWidth: 520 }}>
                    Monitor baking progress, delivery status, and post-order actions in one place. Refine the list with
                    filters or deep-dive into each order’s timeline.
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  onClick={() => navigate('/shop')}
                  sx={{
                    textTransform: 'none',
                    borderRadius: 0,
                    background: gradients.primary,
                    boxShadow: shadows.hover,
                    px: spacing(6),
                    py: spacing(3),
                    fontWeight: 700,
                  }}
                >
                  Browse the shop
                </Button>
              </Stack>

              <Grid container spacing={3}>
                {metricCards.map((metric) => {
                  const MetricIcon = metric.icon;
                  return (
                    <Grid key={metric.label} item xs={12} sm={6} md={3}>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 0,
                          px: spacing(4),
                          py: spacing(5),
                          display: 'flex',
                          flexDirection: 'column',
                          gap: spacing(1.5),
                          background: alpha(metric.accent, 0.08),
                          border: `1px solid ${alpha(metric.accent, 0.2)}`,
                          boxShadow: shadows.subtle,
                        }}
                      >
                        <MetricIcon sx={{ color: metric.accent }} />
                        <Typography variant="overline" sx={{ letterSpacing: '0.1em', color: colors.muted }}>
                          {metric.label}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {metric.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: colors.stone }}>
                          {metric.helper}
                        </Typography>
                      </Paper>
                    </Grid>
                  );
                })}
              </Grid>
            </Stack>
          </Paper>

          <Paper
            elevation={0}
            sx={{
              borderRadius: 0,
              backgroundColor: colors.paper,
              border: `1px solid ${alpha(colors.brandInk, 0.08)}`,
              boxShadow: shadows.subtle,
            }}
          >
            <Tabs
              value={tabValue}
              onChange={(event, newValue) => setTabValue(newValue)}
              variant="fullWidth"
              sx={{
                borderBottom: `1px solid ${alpha(colors.brandInk, 0.08)}`,
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 600,
                  minHeight: 64,
                },
                '& .Mui-selected': {
                  color: colors.brandPink,
                },
              }}
              TabIndicatorProps={{ style: { backgroundColor: colors.brandPink } }}
            >
              <Tab icon={<Receipt />} iconPosition="start" label="Active orders" />
              <Tab icon={<History />} iconPosition="start" label="Order history" />
            </Tabs>

            <Box sx={{ p: { xs: spacing(4), md: spacing(5) } }}>
              {tabValue === 0 && (
                <Stack spacing={spacing(4)}>
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={spacing(2)} alignItems={{ md: 'center' }}>
                    <TextField
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      placeholder="Search by order ID, item or notes"
                      fullWidth
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search sx={{ color: colors.brandPink }} />
                          </InputAdornment>
                        ),
                        sx: { borderRadius: 0 },
                      }}
                    />
                    <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ pt: { xs: spacing(2), md: 0 } }}>
                      {statusFilterOptions.map((option) => (
                        <Chip
                          key={option.value}
                          label={option.label}
                          onClick={() => setStatusFilter(option.value)}
                          icon={<FilterList fontSize="small" />}
                          variant={statusFilter === option.value ? 'filled' : 'outlined'}
                          sx={{
                            borderRadius: 0,
                            backgroundColor:
                              statusFilter === option.value ? colors.brandPink : 'transparent',
                            color: statusFilter === option.value ? colors.paper : colors.stone,
                            border: `1px solid ${alpha(colors.brandInk, 0.12)}`,
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>

                  {loading && (
                    <Stack spacing={spacing(3)}>
                      {[...Array(3)].map((_, index) => (
                        <OrderCardSkeleton key={index} />
                      ))}
                    </Stack>
                  )}

                  {showEmptyState && (
                    <Box sx={{ textAlign: 'center', py: spacing(10) }}>
                      <Receipt sx={{ fontSize: 56, color: colors.muted, mb: spacing(2) }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        You have no active orders yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.stone, mt: spacing(1) }}>
                        Browse the menu to place your first bakery order and it will appear here.
                      </Typography>
                      <Button
                        variant="contained"
                        onClick={() => navigate('/shop')}
                        sx={{ mt: spacing(4), textTransform: 'none', borderRadius: 0, background: gradients.primary }}
                      >
                        Explore cakes & pastries
                      </Button>
                    </Box>
                  )}

                  {showNoMatches && (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: spacing(8),
                        backgroundColor: alpha(colors.brandInk, 0.02),
                        border: `1px dashed ${alpha(colors.brandInk, 0.1)}`,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        No orders match your filters
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.stone, mt: spacing(1) }}>
                        Try clearing the filters or search using a different keyword.
                      </Typography>
                    </Box>
                  )}

                  {!loading && filteredOrders.length > 0 && (
                    <Stack spacing={spacing(4)}>
                      {filteredOrders.map((order) => renderOrderCard(order))}
                    </Stack>
                  )}
                </Stack>
              )}

              {tabValue === 1 && (
                <Stack spacing={spacing(4)}>
                  <TextField
                    value={historySearchTerm}
                    onChange={(event) => setHistorySearchTerm(event.target.value)}
                    placeholder="Search past orders"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: colors.brandPink }} />
                        </InputAdornment>
                      ),
                      sx: { borderRadius: 0 },
                    }}
                  />

                  {loading && (
                    <Stack spacing={spacing(3)}>
                      {[...Array(3)].map((_, index) => (
                        <OrderCardSkeleton key={index} />
                      ))}
                    </Stack>
                  )}

                  {showHistoryEmpty && (
                    <Box sx={{ textAlign: 'center', py: spacing(10) }}>
                      <History sx={{ fontSize: 56, color: colors.muted, mb: spacing(2) }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        No past orders yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.stone, mt: spacing(1) }}>
                        Completed or cancelled orders will be archived here for easy access.
                      </Typography>
                    </Box>
                  )}

                  {showHistoryNoMatches && (
                    <Box
                      sx={{
                        textAlign: 'center',
                        py: spacing(8),
                        backgroundColor: alpha(colors.brandInk, 0.02),
                        border: `1px dashed ${alpha(colors.brandInk, 0.1)}`,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        No orders match that search
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.stone, mt: spacing(1) }}>
                        Double-check the order ID or try a product name.
                      </Typography>
                    </Box>
                  )}

                  {!loading && filteredHistory.length > 0 && (
                    <Stack spacing={spacing(3)}>
                      {filteredHistory.map((order) => renderHistoryCard(order))}
                    </Stack>
                  )}
                </Stack>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>

      <Dialog open={detailOpen} onClose={handleCloseDetail} fullWidth maxWidth="md">
        <DialogTitle sx={{ pr: spacing(5), borderBottom: `1px solid ${alpha(colors.brandInk, 0.08)}` }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="subtitle2" sx={{ color: colors.muted, letterSpacing: '0.08em' }}>
                Order overview
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Order #{selectedOrder?.id}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              {selectedOrder && (
                <Chip
                  label={selectedOrder.status}
                  sx={{
                    backgroundColor: alpha(getStatusAccent(selectedOrder.status), 0.12),
                    color: getStatusAccent(selectedOrder.status),
                    fontWeight: 600,
                  }}
                />
              )}
              <IconButton onClick={handleCloseDetail}>
                <Close />
              </IconButton>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent dividers sx={{ py: spacing(5) }}>
          {selectedOrder && (
            <Stack spacing={spacing(4)}>
              <Stack spacing={spacing(2)}>
                <Typography variant="body2" sx={{ color: colors.stone }}>
                  Placed on {formatOrderDate(selectedOrder.orderDate)}
                </Typography>
                <OrderStatusStepper currentStatus={selectedOrder.status} />
              </Stack>

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: spacing(2) }}>
                  Order items
                </Typography>
                <Stack spacing={spacing(2)}>
                  {(selectedOrder.orderItems || []).map((item, index) => (
                    <Paper
                      key={`${selectedOrder.id}-${index}`}
                      elevation={0}
                      sx={{
                        borderRadius: 0,
                        px: spacing(3),
                        py: spacing(2.5),
                        border: `1px solid ${alpha(colors.brandInk, 0.06)}`,
                        backgroundColor: alpha(colors.brandInk, 0.02),
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {item.item?.name || item.itemName || 'Item'}
                          </Typography>
                          <Stack direction="row" spacing={1} sx={{ mt: spacing(1) }}>
                            {item.selectedWeight && (
                              <Chip
                                size="small"
                                label={`${item.selectedWeight} Kg`}
                                sx={{
                                  borderRadius: 0,
                                  backgroundColor: alpha(colors.brandPink, 0.12),
                                  color: colors.brandPink,
                                }}
                              />
                            )}
                            {item.eggType === 'EGGLESS' && (
                              <Chip
                                size="small"
                                label="Eggless"
                                sx={{
                                  borderRadius: 0,
                                  backgroundColor: alpha(colors.success, 0.12),
                                  color: colors.success,
                                }}
                              />
                            )}
                          </Stack>
                        </Box>
                        <Typography variant="body1" sx={{ fontWeight: 700 }}>
                          {item.quantity} × {formatCurrency(item.price)}
                        </Typography>
                      </Stack>
                    </Paper>
                  ))}
                  <Paper
                    elevation={0}
                    sx={{
                      borderRadius: 0,
                      px: spacing(3),
                      py: spacing(2.5),
                      backgroundColor: alpha(colors.brandPink, 0.08),
                      border: `1px solid ${alpha(colors.brandPink, 0.2)}`,
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1" sx={{ fontWeight: 700 }}>
                        Order total
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {formatCurrency(selectedOrder.totalAmount)}
                      </Typography>
                    </Stack>
                  </Paper>
                </Stack>
              </Box>

              <Divider />

              <Stack spacing={spacing(3)}>
                {editingOrderId === selectedOrder.id ? (
                  <Box>
                    <Alert severity="info" sx={{ borderRadius: 0, mb: spacing(3) }}>
                      Delivery is only available within Coimbatore (Pincode: 641xxx). Choose a method below to update the
                      address.
                    </Alert>
                    {!editAddressMethod && (
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: spacing(3) }}>
                        <Button
                          variant="contained"
                          startIcon={<LocationOn />}
                          onClick={() => setShowLocationPicker(true)}
                          sx={{
                            flex: 1,
                            borderRadius: 0,
                            textTransform: 'none',
                            background: gradients.primary,
                          }}
                        >
                          Use GPS location
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<Edit />}
                          onClick={() => setEditAddressMethod('manual')}
                          sx={{
                            flex: 1,
                            borderRadius: 0,
                            textTransform: 'none',
                            borderColor: colors.brandPink,
                            color: colors.brandPink,
                          }}
                        >
                          Enter manually
                        </Button>
                      </Stack>
                    )}

                    {editAddressMethod === 'location' && (
                      <Alert severity="success" sx={{ borderRadius: 0, mb: spacing(3) }}>
                        ✓ GPS location captured. Confirm the delivery phone & notes below.
                      </Alert>
                    )}

                    {(editAddressMethod === 'manual' || editAddressMethod === 'location') && renderManualEditForm()}
                  </Box>
                ) : (
                  <Stack spacing={spacing(3)}>
                    {renderDeliveryInformation(selectedOrder)}
                    {selectedOrder.status !== 'Delivered' && (
                      <Button
                        variant="outlined"
                        startIcon={<Edit />}
                        onClick={() => handleEditAddress(selectedOrder)}
                        sx={{
                          alignSelf: 'flex-start',
                          textTransform: 'none',
                          borderRadius: 0,
                          borderColor: colors.brandPink,
                          color: colors.brandPink,
                        }}
                      >
                        Update delivery address
                      </Button>
                    )}
                  </Stack>
                )}
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ px: spacing(4), py: spacing(3), gap: spacing(2) }}>
          {selectedOrder && (
            <>
              <Button
                variant="text"
                startIcon={<Replay />}
                onClick={() => handleReorder(selectedOrder)}
                sx={{ textTransform: 'none' }}
              >
                Reorder
              </Button>
              <Button
                variant="text"
                startIcon={<Download />}
                onClick={() => handleDownloadInvoice(selectedOrder)}
                sx={{ textTransform: 'none' }}
              >
                Invoice
              </Button>
              {selectedOrder.status === 'Delivered' && (
                <Button
                  variant="text"
                  startIcon={<RateReview />}
                  onClick={() => handleReviewOrder(selectedOrder)}
                  sx={{ textTransform: 'none' }}
                >
                  Review order
                </Button>
              )}
            </>
          )}
          <Box sx={{ flexGrow: 1 }} />
          {selectedOrder && (
            <Button
              variant="outlined"
              startIcon={<HelpOutline />}
              onClick={() => handleOpenSupport(selectedOrder)}
              sx={{
                textTransform: 'none',
                borderRadius: 0,
                borderColor: colors.brandPink,
                color: colors.brandPink,
              }}
            >
              Need help
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleCloseDetail}
            sx={{
              textTransform: 'none',
              borderRadius: 0,
              background: gradients.primary,
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={supportDialogOpen} onClose={() => setSupportDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle sx={{ borderBottom: `1px solid ${alpha(colors.brandInk, 0.08)}` }}>
          Raise a support ticket
        </DialogTitle>
        <DialogContent sx={{ py: spacing(4) }}>
          <Stack spacing={spacing(3)}>
            <Typography variant="body2" sx={{ color: colors.stone }}>
              Let us know what went wrong and our team will reach out with a resolution.
            </Typography>
            <TextField
              multiline
              minRows={5}
              value={supportMessage}
              onChange={(event) => setSupportMessage(event.target.value)}
              placeholder="Describe the issue..."
              InputProps={{ sx: { borderRadius: 0 } }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: spacing(4), pb: spacing(3), gap: spacing(2) }}>
          <Button variant="text" onClick={() => setSupportDialogOpen(false)} sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSupportSubmit}
            sx={{
              textTransform: 'none',
              borderRadius: 0,
              background: gradients.primary,
            }}
          >
            Submit ticket
          </Button>
        </DialogActions>
      </Dialog>

      <LocationPicker
        open={showLocationPicker}
        onClose={() => setShowLocationPicker(false)}
        onSelectLocation={handleLocationSelectInEdit}
      />

      <Footer />
    </Box>
  );
};

export default Orders;
