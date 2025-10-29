package com.bakery.app.controller;

import com.razorpay.Utils;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * Webhook controller to handle Razorpay payment notifications
 * Configure this endpoint in Razorpay Dashboard: https://dashboard.razorpay.com/app/webhooks
 */
@RestController
@RequestMapping("/api/webhooks/razorpay")
@CrossOrigin(origins = "*")
public class RazorpayWebhookController {

    private static final Logger logger = LoggerFactory.getLogger(RazorpayWebhookController.class);

    @Value("${razorpay.webhook.secret:}")
    private String webhookSecret;

    /**
     * Razorpay Webhook Endpoint
     * Events: payment.authorized, payment.captured, payment.failed, order.paid, etc.
     */
    @PostMapping("/payment-event")
    public ResponseEntity<?> handleWebhook(
            @RequestBody String payload,
            @RequestHeader(value = "X-Razorpay-Signature", required = false) String signature) {
        
        try {
            logger.info("Received Razorpay webhook event");
            
            // Verify webhook signature for security
            if (webhookSecret != null && !webhookSecret.isEmpty()) {
                if (signature == null || signature.isEmpty()) {
                    logger.error("Webhook signature missing");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(createResponse(false, "Signature missing"));
                }
                
                if (!verifyWebhookSignature(payload, signature)) {
                    logger.error("Invalid webhook signature");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                            .body(createResponse(false, "Invalid signature"));
                }
            }
            
            // Parse webhook payload
            JSONObject event = new JSONObject(payload);
            String eventType = event.getString("event");
            JSONObject payloadData = event.getJSONObject("payload");
            JSONObject paymentEntity = payloadData.getJSONObject("payment").getJSONObject("entity");
            
            String paymentId = paymentEntity.getString("id");
            String orderId = paymentEntity.optString("order_id", "");
            String status = paymentEntity.getString("status");
            int amount = paymentEntity.getInt("amount");
            
            logger.info("Webhook Event: {}, Payment ID: {}, Order ID: {}, Status: {}, Amount: {}", 
                    eventType, paymentId, orderId, status, amount);
            
            // Handle different event types
            switch (eventType) {
                case "payment.authorized":
                    handlePaymentAuthorized(paymentId, orderId, amount);
                    break;
                    
                case "payment.captured":
                    handlePaymentCaptured(paymentId, orderId, amount);
                    break;
                    
                case "payment.failed":
                    handlePaymentFailed(paymentId, orderId, amount);
                    break;
                    
                case "order.paid":
                    handleOrderPaid(orderId, amount);
                    break;
                    
                default:
                    logger.info("Unhandled event type: {}", eventType);
            }
            
            // Always return 200 OK to acknowledge receipt
            return ResponseEntity.ok(createResponse(true, "Webhook processed successfully"));
            
        } catch (Exception e) {
            logger.error("Error processing webhook: {}", e.getMessage(), e);
            // Still return 200 to prevent Razorpay from retrying
            return ResponseEntity.ok(createResponse(false, "Error processing webhook"));
        }
    }

    /**
     * Verify webhook signature using HMAC SHA256
     */
    private boolean verifyWebhookSignature(String payload, String signature) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            SecretKeySpec secretKeySpec = new SecretKeySpec(
                    webhookSecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            mac.init(secretKeySpec);
            
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            
            String expectedSignature = hexString.toString();
            return expectedSignature.equals(signature);
            
        } catch (Exception e) {
            logger.error("Error verifying webhook signature: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Handle payment.authorized event
     */
    private void handlePaymentAuthorized(String paymentId, String orderId, int amount) {
        logger.info("Payment Authorized - Payment ID: {}, Order ID: {}, Amount: {}", 
                paymentId, orderId, amount);
        // TODO: Update order status to "Payment Authorized"
        // TODO: Send notification to admin
    }

    /**
     * Handle payment.captured event
     */
    private void handlePaymentCaptured(String paymentId, String orderId, int amount) {
        logger.info("Payment Captured - Payment ID: {}, Order ID: {}, Amount: {}", 
                paymentId, orderId, amount);
        // TODO: Update order status to "Payment Confirmed"
        // TODO: Send confirmation email to customer
        // TODO: Notify admin about successful payment
    }

    /**
     * Handle payment.failed event
     */
    private void handlePaymentFailed(String paymentId, String orderId, int amount) {
        logger.error("Payment Failed - Payment ID: {}, Order ID: {}, Amount: {}", 
                paymentId, orderId, amount);
        // TODO: Mark order as failed
        // TODO: Restore inventory if stock was deducted
        // TODO: Send failure notification to customer
    }

    /**
     * Handle order.paid event
     */
    private void handleOrderPaid(String orderId, int amount) {
        logger.info("Order Paid - Order ID: {}, Amount: {}", orderId, amount);
        // TODO: Final confirmation of order payment
        // TODO: Trigger order fulfillment process
    }

    /**
     * Create standard response
     */
    private Map<String, Object> createResponse(boolean success, String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", success);
        response.put("message", message);
        return response;
    }

    /**
     * Health check for webhook endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Webhook endpoint is active");
        response.put("webhookSecretConfigured", webhookSecret != null && !webhookSecret.isEmpty());
        return ResponseEntity.ok(response);
    }
}
