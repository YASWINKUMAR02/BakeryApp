# Email SMTP Setup Guide - Forgot Password Feature

## ✅ Backend Implementation Complete!

All backend code for the Forgot Password feature with Email SMTP has been implemented.

## 📋 What Was Implemented

### 1. Dependencies Added
- ✅ `spring-boot-starter-mail` added to `pom.xml`

### 2. Configuration Added
- ✅ Email SMTP settings in `application.properties`
- ✅ Password reset token expiry configuration (30 minutes)
- ✅ Frontend URL configuration

### 3. Database
- ✅ `PasswordResetToken` entity created
- ✅ `PasswordResetTokenRepository` created
- ✅ SQL migration file: `password_reset_migration.sql`

### 4. Services Created
- ✅ `EmailService.java` - Handles sending emails via SMTP
- ✅ `PasswordResetService.java` - Manages password reset logic

### 5. Controller Endpoints Added
- ✅ `POST /api/customers/forgot-password` - Request password reset
- ✅ `POST /api/customers/reset-password` - Reset password with token

## 🚀 Setup Instructions

### Step 1: Configure Gmail SMTP

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Bakery App" as the name
   - Click "Generate"
   - Copy the 16-character password

3. **Update application.properties**:
   ```properties
   spring.mail.username=your-actual-email@gmail.com
   spring.mail.password=your-16-char-app-password
   ```

### Step 2: Run Database Migration

Execute the SQL migration file:

```bash
# From MySQL command line or MySQL Workbench
mysql -u root -p bakery_db < password_reset_migration.sql
```

Or manually run the SQL:
```sql
CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    customer_id INT NOT NULL,
    expiry_date DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX idx_token ON password_reset_tokens(token);
CREATE INDEX idx_customer_id ON password_reset_tokens(customer_id);
CREATE INDEX idx_expiry_date ON password_reset_tokens(expiry_date);
```

### Step 3: Rebuild and Restart Backend

```bash
cd bakeryapp
mvn clean install
mvn spring-boot:run
```

### Step 4: Test the Feature

1. **Frontend**: Navigate to http://localhost:3000/login
2. Click "Forgot Password?"
3. Enter your email address
4. Check your email inbox
5. Click the reset link
6. Enter new password
7. Login with new password

## 📧 Email Template

The password reset email includes:
- Personalized greeting with customer name
- Clickable reset link with unique token
- 30-minute expiry notice
- Security notice for unwanted requests

## 🔒 Security Features

1. ✅ **Unique Tokens**: UUID-based tokens for each request
2. ✅ **Time-Limited**: Tokens expire after 30 minutes
3. ✅ **Single Use**: Tokens can only be used once
4. ✅ **Automatic Cleanup**: Old tokens deleted when new ones created
5. ✅ **Password Hashing**: BCrypt encryption for passwords
6. ✅ **Email Validation**: Checks if account exists before sending

## 🧪 Testing Checklist

- [ ] Configure Gmail SMTP credentials
- [ ] Run database migration
- [ ] Restart backend server
- [ ] Test forgot password flow
- [ ] Verify email is received
- [ ] Test password reset
- [ ] Verify login with new password
- [ ] Test expired token (wait 30+ minutes)
- [ ] Test already-used token
- [ ] Test invalid token

## 📁 Files Created/Modified

### New Files:
1. `src/main/java/com/bakery/app/entity/PasswordResetToken.java`
2. `src/main/java/com/bakery/app/repository/PasswordResetTokenRepository.java`
3. `src/main/java/com/bakery/app/service/EmailService.java`
4. `src/main/java/com/bakery/app/service/PasswordResetService.java`
5. `password_reset_migration.sql`

### Modified Files:
1. `pom.xml` - Added mail dependency
2. `application.properties` - Added email configuration
3. `CustomerController.java` - Added forgot/reset endpoints

### Frontend Files (Already Complete):
1. `Login.js` - Added forgot password dialog
2. `ResetPassword.js` - New page for password reset
3. `App.js` - Added reset password route
4. `api.js` - Added API endpoints

## 🔧 Troubleshooting

### Email Not Sending?
1. Check Gmail credentials in `application.properties`
2. Verify 2FA is enabled on Gmail account
3. Ensure app password is correctly copied (no spaces)
4. Check backend logs for email errors

### Token Expired?
- Tokens expire after 30 minutes
- Request a new password reset link

### Email Not Received?
1. Check spam/junk folder
2. Verify email address is correct
3. Check backend logs for errors
4. Ensure SMTP port 587 is not blocked

### Database Error?
- Ensure migration SQL was executed
- Check if `password_reset_tokens` table exists
- Verify foreign key to `customers` table

## 📊 API Endpoints

### Forgot Password
```http
POST /api/customers/forgot-password
Content-Type: application/json

{
  "email": "customer@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset link sent to your email",
  "data": null
}
```

### Reset Password
```http
POST /api/customers/reset-password
Content-Type: application/json

{
  "token": "uuid-token-from-email",
  "newPassword": "newSecurePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password reset successful",
  "data": null
}
```

## 🎯 Next Steps

1. Configure your Gmail SMTP credentials
2. Run the database migration
3. Restart the backend server
4. Test the complete flow
5. Monitor email delivery and logs

## 📝 Notes

- **Token Expiry**: Default is 30 minutes (configurable in `application.properties`)
- **Email Provider**: Currently configured for Gmail (can be changed to other SMTP providers)
- **Frontend URL**: Set to `http://localhost:3000` (update for production)
- **Security**: All passwords are hashed with BCrypt before storage

## ✨ Feature Complete!

The Forgot Password feature with Email SMTP is now fully implemented and ready to use! 🎉
