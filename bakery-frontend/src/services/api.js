import axios from 'axios';

// Use environment variable for production, localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect on 401/403 if it's not a login/register request
    const isAuthRequest = error.config?.url?.includes('/login') || error.config?.url?.includes('/register');
    
    if ((error.response?.status === 401 || error.response?.status === 403) && !isAuthRequest) {
      // Token expired or unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Customer APIs
export const customerAPI = {
  register: (data) => api.post('/customers/register', data),
  login: (data) => api.post('/customers/login', data),
  forgotPassword: (data) => api.post('/customers/forgot-password', data),
  resetPassword: (data) => api.post('/customers/reset-password', data),
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  update: (id, data) => api.put(`/customers/${id}`, data),
  updatePassword: (id, data) => api.put(`/customers/${id}/password`, data),
};

// Admin APIs
export const adminAPI = {
  register: (data) => api.post('/admin/register', data),
  login: (data) => api.post('/admin/login', data),
  getDashboard: () => api.get('/admin/dashboard'),
};

// Category APIs
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Item APIs
export const itemAPI = {
  getAll: () => api.get('/items'),
  getById: (id) => api.get(`/items/${id}`),
  getByCategory: (categoryId) => api.get(`/items/category/${categoryId}`),
  getFeatured: () => api.get('/items/featured'),
  search: (keyword) => api.get(`/items/search?keyword=${keyword}`),
  create: (data) => api.post('/items', data),
  update: (id, data) => api.put(`/items/${id}`, data),
  delete: (id) => api.delete(`/items/${id}`),
  updateStock: (id, quantity, operation = 'add') => api.patch(`/items/${id}/stock?quantity=${quantity}&operation=${operation}`),
  getLowStock: (threshold = 10) => api.get(`/items/low-stock?threshold=${threshold}`),
  getOutOfStock: () => api.get('/items/out-of-stock'),
};

// Order APIs
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (orderId) => api.get(`/orders/detail/${orderId}`),
  getByCustomer: (customerId) => api.get(`/orders/${customerId}`),
  placeOrder: (customerId, data) => api.post(`/orders/place/${customerId}`, data),
  updateStatus: (orderId, data) => api.put(`/orders/status/${orderId}`, data),
  cancel: (orderId, customerId) => api.delete(`/orders/cancel/${orderId}?customerId=${customerId}`),
  updateAddress: (orderId, customerId, data) => api.put(`/orders/address/${orderId}?customerId=${customerId}`, data),
};

// Cart APIs
export const cartAPI = {
  get: (customerId) => api.get(`/cart/${customerId}`),
  addItem: (customerId, data) => api.post(`/cart/add?customerId=${customerId}`, data),
  updateItem: (cartItemId, quantity) => api.put(`/cart/update/${cartItemId}?quantity=${quantity}`),
  removeItem: (cartItemId) => api.delete(`/cart/remove/${cartItemId}`),
};

// Review APIs
export const reviewAPI = {
  create: (itemId, customerId, data) => api.post(`/reviews/${itemId}?customerId=${customerId}`, data),
  getByItem: (itemId) => api.get(`/reviews/item/${itemId}`),
  delete: (reviewId) => api.delete(`/reviews/${reviewId}`),
};

// Order History APIs
export const orderHistoryAPI = {
  getAll: () => api.get('/order-history/all'),
  getByCustomer: (customerId) => api.get(`/order-history/customer/${customerId}`),
  migrateDelivered: () => api.post('/order-history/migrate-delivered'),
};

// Wishlist APIs
export const wishlistAPI = {
  get: (customerId) => api.get(`/wishlist/${customerId}`),
  add: (customerId, itemId) => api.post(`/wishlist/add?customerId=${customerId}&itemId=${itemId}`),
  remove: (customerId, itemId) => api.delete(`/wishlist/remove/${customerId}/${itemId}`),
  clear: (customerId) => api.delete(`/wishlist/clear/${customerId}`),
};

// Coupon APIs
export const couponAPI = {
  getAll: () => api.get('/coupons'),
  getById: (id) => api.get(`/coupons/${id}`),
  create: (data) => api.post('/coupons', data),
  update: (id, data) => api.put(`/coupons/${id}`, data),
  delete: (id) => api.delete(`/coupons/${id}`),
  validate: (code, amount) => api.post(`/coupons/validate?code=${code}&orderAmount=${amount}`),
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: () => api.get('/analytics'),
};

// Notification APIs
export const notificationAPI = {
  getAll: (userId) => api.get(`/notifications/${userId}`),
  getUnread: (userId) => api.get(`/notifications/${userId}/unread`),
  markAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: (userId) => api.put(`/notifications/${userId}/read-all`),
  delete: (notificationId) => api.delete(`/notifications/${notificationId}`),
  create: (data) => api.post('/notifications', data),
};

// Contact Message APIs
export const contactAPI = {
  send: (data) => api.post('/contact/send', data),
  getAll: () => api.get('/contact/messages'),
  getUnread: () => api.get('/contact/messages/unread'),
  markAsRead: (id) => api.put(`/contact/messages/${id}/read`),
  markAsReplied: (id) => api.put(`/contact/messages/${id}/replied`),
  delete: (id) => api.delete(`/contact/messages/${id}`),
};

// Payment APIs
export const paymentAPI = {
  createOrder: (amount, customerId) => api.post('/payments/create-order', { amount, customerId }),
  verifyPayment: (data) => api.post('/payments/verify', data),
  getPaymentDetails: (orderId) => api.get(`/payments/${orderId}`),
};

export default api;
