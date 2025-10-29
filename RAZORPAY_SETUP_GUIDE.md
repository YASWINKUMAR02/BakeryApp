# Razorpay Integration Setup Guide

## Overview
Razorpay payment gateway has been integrated into the Frost & Crinkle Bakery application for secure online payments.

## Frontend Changes

### 1. Files Modified/Created:
- ✅ `public/index.html` - Added Razorpay checkout script
- ✅ `src/services/razorpay.js` - Razorpay service utility (NEW)
- ✅ `src/services/api.js` - Added payment API endpoints
- ✅ `src/pages/customer/Checkout.js` - Integrated Razorpay payment flow

### 2. Payment Flow:
1. Customer fills delivery details
2. Clicks "Proceed to Payment"
3. Backend creates Razorpay order
4. Razorpay payment modal opens
5. Customer completes payment
6. Payment verified on backend
7. Order placed successfully

## Backend Setup Required

### 1. Add Razorpay Dependencies (pom.xml):
```xml
<dependency>
    <groupId>com.razorpay</groupId>
    <artifactId>razorpay-java</artifactId>
    <version>1.4.3</version>
</dependency>
```

### 2. Application Properties:
Add to `application.properties`:
```properties
# Razorpay Configuration
razorpay.key.id=YOUR_RAZORPAY_KEY_ID
razorpay.key.secret=YOUR_RAZORPAY_KEY_SECRET
```

### 3. Create Payment Controller:
Create `PaymentController.java` in `com.bakery.controller`:

```java
package com.bakery.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:3000")
public class PaymentController {

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            Double amount = ((Number) data.get("amount")).doubleValue();
            Integer customerId = (Integer) data.get("customerId");
            
            // Convert amount to paise (Razorpay uses paise)
            int amountInPaise = (int) (amount * 100);
            
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1);
            
            Order order = razorpayClient.orders.create(orderRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("razorpayOrderId", order.get("id"));
            orderData.put("amount", amount);
            orderData.put("currency", "INR");
            response.put("data", orderData);
            
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create payment order: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            String razorpayOrderId = data.get("razorpayOrderId");
            String razorpayPaymentId = data.get("razorpayPaymentId");
            String razorpaySignature = data.get("razorpaySignature");
            
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);
            
            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);
            
            Map<String, Object> response = new HashMap<>();
            if (isValidSignature) {
                response.put("success", true);
                response.put("message", "Payment verified successfully");
            } else {
                response.put("success", false);
                response.put("message", "Invalid payment signature");
            }
            
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Payment verification failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<?> getPaymentDetails(@PathVariable String orderId) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            Order order = razorpayClient.orders.fetch(orderId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", order.toJson());
            
            return ResponseEntity.ok(response);
        } catch (RazorpayException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch payment details: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
```

### 4. Update Order Entity (Optional):
Add payment fields to `Order.java`:
```java
@Column(name = "payment_id")
private String paymentId;

@Column(name = "payment_order_id")
private String paymentOrderId;

@Column(name = "payment_signature")
private String paymentSignature;

@Column(name = "payment_status")
private String paymentStatus = "PENDING";
```

### 5. Update Order Service:
Modify `placeOrder` method to accept payment details:
```java
public Order placeOrder(Long customerId, OrderRequest orderRequest) {
    // ... existing code ...
    
    // Set payment details if provided
    if (orderRequest.getPaymentId() != null) {
        order.setPaymentId(orderRequest.getPaymentId());
        order.setPaymentOrderId(orderRequest.getPaymentOrderId());
        order.setPaymentSignature(orderRequest.getPaymentSignature());
        order.setPaymentStatus("PAID");
    }
    
    // ... rest of the code ...
}
```

## Getting Razorpay Credentials

### 1. Sign Up:
- Go to https://razorpay.com/
- Click "Sign Up" and create an account
- Complete KYC verification (for live mode)

### 2. Get API Keys:
- Login to Razorpay Dashboard
- Go to Settings → API Keys
- Generate Test/Live Keys
- Copy Key ID and Key Secret

### 3. Test Mode:
- Use Test Keys for development
- Test card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

### 4. Live Mode:
- Complete KYC verification
- Switch to Live mode in dashboard
- Use Live Keys in production

## Environment Variables

### Frontend (.env file):
Create `.env` in `bakery-frontend/`:
```
REACT_APP_RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
```

### Backend (application.properties):
```properties
razorpay.key.id=rzp_test_YOUR_KEY_ID
razorpay.key.secret=YOUR_KEY_SECRET
```

## Testing

### Test Cards:
```
Success: 4111 1111 1111 1111
Failure: 4111 1111 1111 1112
CVV: Any 3 digits
Expiry: Any future date
OTP: 1234 (for 3D Secure)
```

### Test Flow:
1. Add items to cart
2. Go to checkout
3. Fill delivery details
4. Click "Proceed to Payment"
5. Use test card details
6. Complete payment
7. Verify order is placed

## Security Notes

1. ✅ Never expose Key Secret in frontend
2. ✅ Always verify payment signature on backend
3. ✅ Use HTTPS in production
4. ✅ Store payment details securely
5. ✅ Implement webhook for payment status updates

## Webhook Setup (Optional but Recommended)

Add webhook endpoint in backend:
```java
@PostMapping("/webhook")
public ResponseEntity<?> handleWebhook(@RequestBody String payload,
                                       @RequestHeader("X-Razorpay-Signature") String signature) {
    // Verify webhook signature
    // Update order status based on payment events
    return ResponseEntity.ok().build();
}
```

Configure webhook URL in Razorpay Dashboard:
- Settings → Webhooks
- Add: `https://yourdomain.com/api/payments/webhook`
- Select events: payment.captured, payment.failed

## Troubleshooting

### Payment Modal Not Opening:
- Check if Razorpay script is loaded in index.html
- Verify Key ID is correct
- Check browser console for errors

### Payment Verification Failed:
- Ensure Key Secret is correct in backend
- Check signature verification logic
- Verify payment data is passed correctly

### Order Not Created After Payment:
- Check backend logs for errors
- Verify payment verification endpoint
- Ensure order placement logic handles payment data

## Support

- Razorpay Docs: https://razorpay.com/docs/
- Integration Guide: https://razorpay.com/docs/payments/payment-gateway/web-integration/
- Support: support@razorpay.com
