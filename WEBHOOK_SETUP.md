# 🔔 Razorpay Webhook Setup Guide

## Step 1: Get Webhook Secret from Razorpay Dashboard

1. Login to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Navigate to **Settings** → **Webhooks**
3. Click **"+ Create New Webhook"**
4. Configure webhook:
   - **Webhook URL**: `http://your-domain.com/api/webhooks/razorpay/payment-event`
   - **Secret**: Copy the generated secret (you'll need this)
   - **Active Events**: Select:
     - ✅ payment.authorized
     - ✅ payment.captured
     - ✅ payment.failed
     - ✅ order.paid
5. Click **"Create Webhook"**

## Step 2: Add Webhook Secret to Backend

Update `application.properties`:

```properties
razorpay.webhook.secret=YOUR_WEBHOOK_SECRET_HERE
```

## Step 3: Test Webhook (Development)

### Option A: Using ngrok (Recommended for local testing)

1. Install ngrok: https://ngrok.com/download
2. Start your backend server (port 8080)
3. Run ngrok:
   ```bash
   ngrok http 8080
   ```
4. Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)
5. Update webhook URL in Razorpay Dashboard:
   ```
   https://abc123.ngrok.io/api/webhooks/razorpay/payment-event
   ```

### Option B: Using Razorpay Test Mode

1. Make a test payment in your application
2. Check backend logs for webhook events
3. Verify signature validation is working

## Step 4: Verify Webhook is Working

### Check Health Endpoint
```bash
curl http://localhost:8080/api/webhooks/razorpay/health
```

Expected response:
```json
{
  "success": true,
  "message": "Webhook endpoint is active",
  "webhookSecretConfigured": true
}
```

### Monitor Logs

When a payment is made, you should see logs like:
```
INFO: Received Razorpay webhook event
INFO: Webhook Event: payment.captured, Payment ID: pay_xxx, Order ID: order_xxx
INFO: Payment Captured - Payment ID: pay_xxx, Amount: 50000
```

## Step 5: Production Deployment

1. Deploy your backend to production server
2. Ensure HTTPS is enabled
3. Update webhook URL in Razorpay Dashboard to production URL:
   ```
   https://api.yourdomain.com/api/webhooks/razorpay/payment-event
   ```
4. Switch to Live API keys (after KYC approval)
5. Test with real payments

## Webhook Event Types

| Event | Description | Handler Method |
|-------|-------------|----------------|
| `payment.authorized` | Payment authorized but not captured | `handlePaymentAuthorized()` |
| `payment.captured` | Payment successfully captured | `handlePaymentCaptured()` |
| `payment.failed` | Payment failed | `handlePaymentFailed()` |
| `order.paid` | Order fully paid | `handleOrderPaid()` |

## Security Features

✅ **Signature Verification**: Every webhook is verified using HMAC SHA256  
✅ **Secure Secret**: Webhook secret stored in backend only  
✅ **Logging**: All events logged for audit trail  
✅ **Error Handling**: Graceful handling of invalid webhooks  

## Troubleshooting

### Webhook not receiving events
- Check if webhook URL is accessible from internet
- Verify webhook is active in Razorpay Dashboard
- Check firewall/security group settings
- Ensure backend server is running

### Signature verification failing
- Verify webhook secret is correct
- Check for extra spaces in secret
- Ensure payload is not modified

### Events not being processed
- Check backend logs for errors
- Verify event type is handled in switch statement
- Check database connection

## Testing Webhooks

### Manual Test (using curl)
```bash
curl -X POST http://localhost:8080/api/webhooks/razorpay/payment-event \
  -H "Content-Type: application/json" \
  -H "X-Razorpay-Signature: test_signature" \
  -d '{
    "event": "payment.captured",
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_test123",
          "order_id": "order_test123",
          "status": "captured",
          "amount": 50000
        }
      }
    }
  }'
```

## Best Practices

1. **Always verify signatures** - Never trust webhook data without verification
2. **Use HTTPS** - Webhooks should only be sent over HTTPS in production
3. **Idempotency** - Handle duplicate webhook events gracefully
4. **Logging** - Log all webhook events for debugging and audit
5. **Monitoring** - Set up alerts for failed webhooks
6. **Retry Logic** - Razorpay retries failed webhooks, ensure your endpoint is idempotent

## Next Steps

After webhook setup:
1. Implement order status updates in webhook handlers
2. Send email notifications based on webhook events
3. Set up monitoring and alerting
4. Test all payment scenarios (success, failure, refund)
5. Document webhook event handling in your codebase

---

**Need Help?**
- Razorpay Webhook Docs: https://razorpay.com/docs/webhooks/
- Support: https://razorpay.com/support/
