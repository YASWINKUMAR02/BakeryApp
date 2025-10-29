# Forgot Password Backend Implementation Guide

## Overview
This document outlines the backend implementation needed for the Forgot Password feature with Email SMTP functionality.

## Frontend Changes Completed ✅
1. Added "Forgot Password" link in Login page
2. Created Forgot Password dialog
3. Created Reset Password page (`/reset-password`)
4. Added API endpoints in `api.js`:
   - `customerAPI.forgotPassword(data)`
   - `customerAPI.resetPassword(data)`

## Backend Implementation Required

### 1. Dependencies to Add (pom.xml)
```xml
<!-- Email Support -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-mail</artifactId>
</dependency>

<!-- For generating secure tokens -->
<dependency>
    <groupId>org.apache.commons.codec</groupId>
    <artifactId>commons-codec</artifactId>
</dependency>
```

### 2. Application Properties (application.properties)
```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true

# Password Reset Token Expiry (in minutes)
password.reset.token.expiry=30

# Frontend URL for reset link
frontend.url=http://localhost:3000
```

### 3. Database Changes

#### Create PasswordResetToken Table
```sql
CREATE TABLE password_reset_tokens (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    expiry_date DATETIME NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);

CREATE INDEX idx_token ON password_reset_tokens(token);
CREATE INDEX idx_customer_id ON password_reset_tokens(customer_id);
```

### 4. Entity Class

#### PasswordResetToken.java
```java
package com.bakery.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String token;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;
    
    @Column(nullable = false)
    private boolean used = false;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    public boolean isExpired() {
        return LocalDateTime.now().isAfter(expiryDate);
    }
}
```

### 5. Repository

#### PasswordResetTokenRepository.java
```java
package com.bakery.repository;

import com.bakery.entity.PasswordResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    void deleteByCustomerId(Long customerId);
}
```

### 6. Email Service

#### EmailService.java
```java
package com.bakery.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${frontend.url}")
    private String frontendUrl;
    
    public void sendPasswordResetEmail(String toEmail, String customerName, String resetToken) {
        String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
        
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Password Reset Request - Bakery App");
        message.setText(
            "Hello " + customerName + ",\n\n" +
            "We received a request to reset your password for your Bakery App account.\n\n" +
            "Click the link below to reset your password:\n" +
            resetLink + "\n\n" +
            "This link will expire in 30 minutes.\n\n" +
            "If you didn't request a password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "Bakery App Team"
        );
        
        mailSender.send(message);
    }
}
```

### 7. Password Reset Service

#### PasswordResetService.java
```java
package com.bakery.service;

import com.bakery.entity.Customer;
import com.bakery.entity.PasswordResetToken;
import com.bakery.repository.CustomerRepository;
import com.bakery.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {
    
    @Autowired
    private CustomerRepository customerRepository;
    
    @Autowired
    private PasswordResetTokenRepository tokenRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Value("${password.reset.token.expiry}")
    private int tokenExpiryMinutes;
    
    @Transactional
    public void createPasswordResetToken(String email) {
        Optional<Customer> customerOpt = customerRepository.findByEmail(email);
        
        if (customerOpt.isEmpty()) {
            throw new RuntimeException("No account found with this email address");
        }
        
        Customer customer = customerOpt.get();
        
        // Delete any existing tokens for this customer
        tokenRepository.deleteByCustomerId(customer.getId());
        
        // Generate new token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryDate = LocalDateTime.now().plusMinutes(tokenExpiryMinutes);
        
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setCustomer(customer);
        resetToken.setExpiryDate(expiryDate);
        resetToken.setUsed(false);
        
        tokenRepository.save(resetToken);
        
        // Send email
        emailService.sendPasswordResetEmail(customer.getEmail(), customer.getName(), token);
    }
    
    @Transactional
    public void resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(token);
        
        if (tokenOpt.isEmpty()) {
            throw new RuntimeException("Invalid reset token");
        }
        
        PasswordResetToken resetToken = tokenOpt.get();
        
        if (resetToken.isUsed()) {
            throw new RuntimeException("This reset link has already been used");
        }
        
        if (resetToken.isExpired()) {
            throw new RuntimeException("This reset link has expired. Please request a new one.");
        }
        
        // Update password
        Customer customer = resetToken.getCustomer();
        customer.setPassword(passwordEncoder.encode(newPassword));
        customerRepository.save(customer);
        
        // Mark token as used
        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }
}
```

### 8. Controller Endpoints

#### Add to CustomerController.java
```java
@Autowired
private PasswordResetService passwordResetService;

@PostMapping("/forgot-password")
public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestBody Map<String, String> request) {
    try {
        String email = request.get("email");
        passwordResetService.createPasswordResetToken(email);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset link sent to your email", null));
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body(new ApiResponse<>(false, e.getMessage(), null));
    }
}

@PostMapping("/reset-password")
public ResponseEntity<ApiResponse<String>> resetPassword(@RequestBody Map<String, String> request) {
    try {
        String token = request.get("token");
        String newPassword = request.get("newPassword");
        
        if (newPassword == null || newPassword.length() < 6) {
            return ResponseEntity.badRequest()
                .body(new ApiResponse<>(false, "Password must be at least 6 characters long", null));
        }
        
        passwordResetService.resetPassword(token, newPassword);
        return ResponseEntity.ok(new ApiResponse<>(true, "Password reset successful", null));
    } catch (Exception e) {
        return ResponseEntity.badRequest()
            .body(new ApiResponse<>(false, e.getMessage(), null));
    }
}
```

### 9. Gmail App Password Setup

To use Gmail SMTP:
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security > 2-Step Verification > App passwords
4. Generate an app password for "Mail"
5. Use this 16-character password in `application.properties`

### 10. Testing

Test the flow:
1. Click "Forgot Password" on login page
2. Enter email address
3. Check email inbox for reset link
4. Click link to open reset password page
5. Enter new password
6. Login with new password

## Security Considerations

1. ✅ Tokens expire after 30 minutes
2. ✅ Tokens can only be used once
3. ✅ Old tokens are deleted when new ones are created
4. ✅ Passwords are hashed using BCrypt
5. ✅ Email validation before sending reset link
6. ✅ Token validation before password reset

## Frontend URLs

- Login: `http://localhost:3000/login`
- Reset Password: `http://localhost:3000/reset-password?token=<TOKEN>`

## Email Template

The email sent will contain:
- Personalized greeting
- Reset link with token
- Expiry notice (30 minutes)
- Security notice
