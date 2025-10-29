// Razorpay Integration Service
// NOTE: Replace 'YOUR_RAZORPAY_KEY_ID' with your actual Razorpay Key ID from dashboard

const RAZORPAY_KEY_ID = process.env.REACT_APP_RAZORPAY_KEY_ID || 'rzp_test_RYldrlkOvxvk12';

/**
 * Initialize Razorpay payment
 * @param {Object} options - Payment options
 * @param {number} options.amount - Amount in rupees (will be converted to paise)
 * @param {string} options.orderId - Order ID from backend
 * @param {string} options.customerName - Customer name
 * @param {string} options.customerEmail - Customer email
 * @param {string} options.customerPhone - Customer phone
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onFailure - Failure callback
 */
export const initializeRazorpay = (options) => {
  const {
    amount,
    orderId,
    customerName,
    customerEmail,
    customerPhone,
    onSuccess,
    onFailure,
  } = options;

  // Convert amount to paise (Razorpay accepts amount in paise)
  const amountInPaise = Math.round(amount * 100);

  // Track if payment was successful to prevent ondismiss from firing after success
  let paymentSuccessful = false;

  const razorpayOptions = {
    key: RAZORPAY_KEY_ID,
    amount: amountInPaise,
    currency: 'INR',
    name: 'Frost & Crinkle Bakery',
    description: `Order #${orderId}`,
    image: '/LOGOO.png', // Your logo
    order_id: orderId, // This should be the Razorpay order ID from backend
    handler: function (response) {
      // CRITICAL: This handler ONLY fires when payment is SUCCESSFUL
      // Razorpay has verified the payment on their end
      paymentSuccessful = true;
      console.log('✅ Razorpay Payment Successful:', response);
      console.log('Payment ID:', response.razorpay_payment_id);
      console.log('Order ID:', response.razorpay_order_id);
      console.log('Signature:', response.razorpay_signature);
      
      // Only call onSuccess if we have all required data
      if (response.razorpay_payment_id && response.razorpay_order_id && response.razorpay_signature) {
        if (onSuccess) {
          onSuccess({
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          });
        }
      } else {
        console.error('❌ Payment response missing required fields');
        paymentSuccessful = false;
        if (onFailure) {
          onFailure('Payment data incomplete. Please contact support.');
        }
      }
    },
    prefill: {
      name: customerName,
      email: customerEmail,
      contact: customerPhone,
    },
    notes: {
      order_id: orderId,
    },
    theme: {
      color: '#ff69b4', // Your brand color
    },
    modal: {
      ondismiss: function () {
        // This fires when user closes the modal
        console.log('Modal dismissed. Payment successful:', paymentSuccessful);
        
        // Only call onFailure if payment was NOT successful
        if (!paymentSuccessful) {
          console.log('❌ Payment cancelled or incomplete');
          if (onFailure) {
            onFailure('Payment cancelled by user');
          }
        } else {
          console.log('✅ Modal dismissed after successful payment - no action needed');
        }
      },
    },
  };

  const razorpay = new window.Razorpay(razorpayOptions);

  // Handle payment failures
  razorpay.on('payment.failed', function (response) {
    paymentSuccessful = false;
    console.error('❌ Payment Failed:', response.error);
    console.error('Error Code:', response.error.code);
    console.error('Error Description:', response.error.description);
    
    if (onFailure) {
      onFailure(response.error.description || 'Payment failed. Please try again.');
    }
  });

  razorpay.open();
};

/**
 * Check if Razorpay is loaded
 */
export const isRazorpayLoaded = () => {
  return typeof window.Razorpay !== 'undefined';
};

/**
 * Load Razorpay script dynamically (fallback if not loaded via index.html)
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve, reject) => {
    if (isRazorpayLoaded()) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
    document.body.appendChild(script);
  });
};
