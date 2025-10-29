# 🧪 Payment Flow Test Scenarios

## How Razorpay Payment Flow Works

### ✅ CORRECT FLOW (Payment Success)
```
1. User clicks "Place Order"
2. Backend creates Razorpay order → Returns order_id
3. Razorpay modal opens
4. User enters payment details
5. Payment succeeds on Razorpay
6. ✅ Razorpay calls handler() → onSuccess fires
7. completeOrder() is called
8. Backend verifies payment signature
9. Order created in database
10. Success message shown
11. User redirected to /orders
```

### ❌ SCENARIO 1: User Cancels Payment
```
1. User clicks "Place Order"
2. Backend creates Razorpay order → Returns order_id
3. Razorpay modal opens
4. User clicks "X" or "Back" button
5. ❌ Payment NOT completed
6. ❌ handler() NEVER fires
7. ✅ ondismiss() fires → onFailure called
8. Error message: "Payment cancelled by user"
9. User stays on checkout page
10. ❌ NO order created
```

### ❌ SCENARIO 2: Payment Fails
```
1. User clicks "Place Order"
2. Backend creates Razorpay order → Returns order_id
3. Razorpay modal opens
4. User enters payment details
5. Payment fails (insufficient funds, network error, etc.)
6. ❌ handler() NEVER fires
7. ✅ payment.failed event fires → onFailure called
8. Error message: "Payment failed. Please try again."
9. User stays on checkout page
10. ❌ NO order created
```

### ❌ SCENARIO 3: Network Error During Payment
```
1. User clicks "Place Order"
2. Backend creates Razorpay order → Returns order_id
3. Razorpay modal opens
4. User enters payment details
5. Network disconnects
6. Payment status unknown
7. ❌ handler() NEVER fires
8. ✅ ondismiss() fires → onFailure called
9. Error message: "Payment cancelled by user"
10. User stays on checkout page
11. ❌ NO order created
```

---

## 🔍 How to Test Each Scenario

### Test 1: Successful Payment ✅
**Steps:**
1. Add items to cart
2. Go to checkout
3. Fill in all details
4. Click "Place Order"
5. **Complete payment** in Razorpay modal
6. Wait for confirmation

**Expected Result:**
- ✅ Console shows: "✅ Razorpay Payment Successful"
- ✅ Console shows: "✅ Payment confirmed by Razorpay, proceeding to place order..."
- ✅ Success message: "Payment verified! Order placed successfully."
- ✅ Redirected to /orders page
- ✅ Order appears in database with payment_verified = true

**Check Console Logs:**
```
✅ Razorpay Payment Successful: {razorpay_payment_id, razorpay_order_id, razorpay_signature}
Payment ID: pay_xxxxx
Order ID: order_xxxxx
Signature: xxxxx
✅ Payment confirmed by Razorpay, proceeding to place order...
Payment verified successfully for payment ID: pay_xxxxx
```

---

### Test 2: Cancel Payment ❌
**Steps:**
1. Add items to cart
2. Go to checkout
3. Fill in all details
4. Click "Place Order"
5. **Click "X" or "Back"** in Razorpay modal (DO NOT complete payment)

**Expected Result:**
- ❌ Console shows: "❌ Payment cancelled or incomplete"
- ❌ Error message: "Payment cancelled by user"
- ❌ User stays on checkout page
- ❌ NO order created
- ❌ NO success message

**Check Console Logs:**
```
Modal dismissed. Payment successful: false
❌ Payment cancelled or incomplete
❌ Payment failed or cancelled: Payment cancelled by user
```

---

### Test 3: Payment Failure ❌
**Steps:**
1. Add items to cart
2. Go to checkout
3. Fill in all details
4. Click "Place Order"
5. Use **test card that fails**: Card number `4000000000000002`
6. Complete the payment attempt

**Expected Result:**
- ❌ Console shows: "❌ Payment Failed"
- ❌ Error message: "Payment failed. Please try again."
- ❌ User stays on checkout page
- ❌ NO order created

**Check Console Logs:**
```
❌ Payment Failed: {error object}
Error Code: BAD_REQUEST_ERROR
Error Description: Payment failed
❌ Payment failed or cancelled: Payment failed. Please try again.
```

---

### Test 4: Invalid Signature (Backend Verification Fails) ❌
**Steps:**
1. Complete payment successfully
2. Backend receives payment data
3. Signature verification fails (tampered data)

**Expected Result:**
- ❌ Error message: "Payment verification failed. Your payment was processed but order could not be created. Please contact support with payment ID: pay_xxxxx"
- ❌ NO order created
- ❌ Payment ID shown in error for support

---

## 🎯 Key Points to Verify

### ✅ Success Case
- [ ] `handler()` callback fires ONLY when payment succeeds
- [ ] `onSuccess()` is called with payment data
- [ ] `completeOrder()` is executed
- [ ] Backend verifies signature
- [ ] Order created in database
- [ ] Success message shown
- [ ] User redirected to /orders

### ❌ Failure/Cancel Cases
- [ ] `handler()` callback NEVER fires on cancel/failure
- [ ] `onFailure()` is called with error message
- [ ] `completeOrder()` is NEVER executed
- [ ] NO order created in database
- [ ] Error message shown
- [ ] User stays on checkout page
- [ ] `setSubmitting(false)` is called to re-enable form

---

## 🐛 Common Issues & Solutions

### Issue 1: "Payment successful" shown when cancelled
**Cause:** `onSuccess` callback firing incorrectly  
**Solution:** ✅ FIXED - `handler()` only fires when Razorpay confirms payment

### Issue 2: Order created without payment
**Cause:** No signature verification before order creation  
**Solution:** ✅ FIXED - Backend verifies signature in `OrderService.placeOrder()`

### Issue 3: Multiple orders created
**Cause:** `onSuccess` callback called multiple times  
**Solution:** ✅ FIXED - `paymentSuccessful` flag prevents duplicate calls

### Issue 4: User stuck in "submitting" state
**Cause:** `setSubmitting(false)` not called on error  
**Solution:** ✅ FIXED - `finally` block ensures state is reset

---

## 📊 Payment Flow State Machine

```
[Start] → Click "Place Order"
    ↓
[Creating Order] → Backend creates Razorpay order
    ↓
[Payment Modal Open] → User sees Razorpay checkout
    ↓
    ├─→ [Payment Success] → handler() fires
    │       ↓
    │   [Verifying] → Backend verifies signature
    │       ↓
    │       ├─→ [Valid] → Order created → Success → Redirect
    │       └─→ [Invalid] → Error shown → Stay on page
    │
    ├─→ [Payment Failed] → payment.failed fires
    │       ↓
    │   [Error] → Error shown → Stay on page
    │
    └─→ [User Cancelled] → ondismiss fires
            ↓
        [Cancelled] → Error shown → Stay on page
```

---

## 🔐 Security Verification Checklist

After testing, verify:
- [ ] Orders are ONLY created when payment is verified
- [ ] Invalid signatures are rejected
- [ ] Cancelled payments don't create orders
- [ ] Failed payments don't create orders
- [ ] Payment details are logged for audit
- [ ] User receives appropriate error messages
- [ ] No sensitive data in console logs (production)

---

## 📝 Test Results Template

### Test Date: _____________
### Tester: _____________

| Scenario | Expected | Actual | Pass/Fail | Notes |
|----------|----------|--------|-----------|-------|
| Successful Payment | Order created | | | |
| Cancel Payment | No order | | | |
| Payment Failure | No order | | | |
| Invalid Signature | No order | | | |
| Network Error | No order | | | |

---

## 🚀 Next Steps After Testing

1. ✅ Verify all test scenarios pass
2. ✅ Check console logs match expected output
3. ✅ Verify database state after each test
4. ✅ Test with different payment methods (card, UPI, netbanking)
5. ✅ Test with different amounts
6. ✅ Test concurrent payments
7. ✅ Enable HTTPS for production
8. ✅ Configure webhooks for additional reliability

---

**Remember:** The `handler()` callback is Razorpay's way of saying "Payment is successful and verified on our end." It will NEVER fire if payment fails or is cancelled!
