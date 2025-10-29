// Utility functions to manage notifications locally

export const addNotification = (userId, userRole, notification) => {
  const storageKey = `notifications_${userRole}_${userId}`;
  const stored = localStorage.getItem(storageKey);
  
  let notifications = [];
  if (stored) {
    try {
      notifications = JSON.parse(stored);
    } catch (e) {
      notifications = [];
    }
  }
  
  // Add new notification at the beginning
  const newNotification = {
    id: Date.now(), // Use timestamp as unique ID
    message: notification.message,
    type: notification.type,
    read: false,
    createdAt: new Date().toISOString(),
  };
  
  notifications.unshift(newNotification);
  
  // Keep only last 20 notifications
  if (notifications.length > 20) {
    notifications = notifications.slice(0, 20);
  }
  
  localStorage.setItem(storageKey, JSON.stringify(notifications));
  
  // Dispatch custom event to update notification component
  window.dispatchEvent(new CustomEvent('notificationAdded', { detail: newNotification }));
  
  return newNotification;
};

// Add notification for customer when they place an order
export const notifyCustomerOrderPlaced = (userId, orderId) => {
  return addNotification(userId, 'CUSTOMER', {
    message: `Your order #${orderId} has been placed successfully`,
    type: 'ORDER_PLACED',
  });
};

// Add notification for customer when order is confirmed
export const notifyCustomerOrderConfirmed = (userId, orderId) => {
  return addNotification(userId, 'CUSTOMER', {
    message: `Your order #${orderId} has been confirmed`,
    type: 'ORDER_CONFIRMED',
  });
};

// Add notification for customer when order is packed
export const notifyCustomerOrderPacked = (userId, orderId) => {
  return addNotification(userId, 'CUSTOMER', {
    message: `Your order #${orderId} has been packed and is ready for delivery`,
    type: 'ORDER_PACKED',
  });
};

// Add notification for customer when order is out for delivery
export const notifyCustomerOrderOutForDelivery = (userId, orderId) => {
  return addNotification(userId, 'CUSTOMER', {
    message: `Your order #${orderId} is out for delivery`,
    type: 'ORDER_OUT_FOR_DELIVERY',
  });
};

// Add notification for customer when order is delivered
export const notifyCustomerOrderDelivered = (userId, orderId) => {
  return addNotification(userId, 'CUSTOMER', {
    message: `Your order #${orderId} has been delivered`,
    type: 'ORDER_DELIVERED',
  });
};

// Add notification for customer when order is cancelled
export const notifyCustomerOrderCancelled = (userId, orderId) => {
  return addNotification(userId, 'CUSTOMER', {
    message: `Your order #${orderId} has been cancelled`,
    type: 'ORDER_CANCELLED',
  });
};

// Add notification for admin when new order is received
export const notifyAdminNewOrder = (adminId, orderId, customerName) => {
  return addNotification(adminId, 'ADMIN', {
    message: `New order #${orderId} received from ${customerName}`,
    type: 'ORDER_PLACED',
  });
};

// Add notification for admin about low stock
export const notifyAdminLowStock = (adminId, itemName, quantity) => {
  return addNotification(adminId, 'ADMIN', {
    message: `Low stock alert: ${itemName} (${quantity} items left)`,
    type: 'LOW_STOCK',
  });
};

// Add notification for admin when order is delivered
export const notifyAdminOrderDelivered = (adminId, orderId) => {
  return addNotification(adminId, 'ADMIN', {
    message: `Order #${orderId} delivered successfully`,
    type: 'ORDER_DELIVERED',
  });
};

// Add notification for all admins (you'll need to get admin IDs from your system)
export const notifyAllAdmins = (notification) => {
  // This is a placeholder - you'll need to implement getting all admin IDs
  // For now, we'll use a fixed admin ID (you can modify this)
  const adminId = 1; // Replace with actual admin ID or loop through all admins
  return addNotification(adminId, 'ADMIN', notification);
};

// Get all notifications for a user
export const getNotifications = (userId, userRole) => {
  const storageKey = `notifications_${userRole}_${userId}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }
  return [];
};

// Clear all notifications for a user
export const clearNotifications = (userId, userRole) => {
  const storageKey = `notifications_${userRole}_${userId}`;
  localStorage.removeItem(storageKey);
};
