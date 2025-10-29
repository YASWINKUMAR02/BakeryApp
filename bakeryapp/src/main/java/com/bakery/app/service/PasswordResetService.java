package com.bakery.app.service;

import com.bakery.app.entity.Customer;
import com.bakery.app.entity.PasswordResetToken;
import com.bakery.app.repository.CustomerRepository;
import com.bakery.app.repository.PasswordResetTokenRepository;
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
