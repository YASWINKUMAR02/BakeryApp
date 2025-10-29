package com.bakery.app.controller;

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

    /**
     * Create Razorpay order
     */
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            
            // Extract amount and convert to paise
            Double amount = ((Number) data.get("amount")).doubleValue();
            Integer customerId = (Integer) data.get("customerId");
            
            // Convert amount to paise (Razorpay uses paise)
            int amountInPaise = (int) (amount * 100);
            
            // Create order request
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcptid_" + System.currentTimeMillis());
            orderRequest.put("payment_capture", 1); // Auto capture payment
            
            // Add notes
            JSONObject notes = new JSONObject();
            notes.put("customer_id", customerId);
            notes.put("order_type", "bakery_order");
            orderRequest.put("notes", notes);
            
            // Create order on Razorpay
            Order order = razorpayClient.orders.create(orderRequest);
            
            // Prepare response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Order created successfully");
            
            Map<String, Object> orderData = new HashMap<>();
            orderData.put("razorpayOrderId", order.get("id"));
            orderData.put("amount", amount);
            orderData.put("amountInPaise", amountInPaise);
            orderData.put("currency", "INR");
            orderData.put("receipt", order.get("receipt"));
            response.put("data", orderData);
            
            return ResponseEntity.ok(response);
            
        } catch (RazorpayException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to create payment order: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Verify payment signature
     */
    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody Map<String, String> data) {
        try {
            String razorpayOrderId = data.get("razorpayOrderId");
            String razorpayPaymentId = data.get("razorpayPaymentId");
            String razorpaySignature = data.get("razorpaySignature");
            
            // Verify signature
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);
            
            boolean isValidSignature = Utils.verifyPaymentSignature(options, razorpayKeySecret);
            
            Map<String, Object> response = new HashMap<>();
            if (isValidSignature) {
                response.put("success", true);
                response.put("message", "Payment verified successfully");
                response.put("verified", true);
            } else {
                response.put("success", false);
                response.put("message", "Invalid payment signature");
                response.put("verified", false);
            }
            
            return ResponseEntity.ok(response);
            
        } catch (RazorpayException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Payment verification failed: " + e.getMessage());
            errorResponse.put("verified", false);
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error: " + e.getMessage());
            errorResponse.put("verified", false);
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Get payment details by order ID
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getPaymentDetails(@PathVariable String orderId) {
        try {
            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpayKeySecret);
            Order order = razorpayClient.orders.fetch(orderId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", order.toJson().toMap());
            
            return ResponseEntity.ok(response);
            
        } catch (RazorpayException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to fetch payment details: " + e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Internal server error: " + e.getMessage());
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Payment service is running");
        response.put("razorpayConfigured", razorpayKeyId != null && !razorpayKeyId.isEmpty());
        return ResponseEntity.ok(response);
    }
}
