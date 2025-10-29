package com.bakery.app.service;

import com.bakery.app.dto.ContactMessageDTO;
import com.bakery.app.entity.ContactMessage;
import com.bakery.app.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactMessageService {
    
    private final ContactMessageRepository contactMessageRepository;
    private final JavaMailSender mailSender;
    
    @Value("${app.admin.email:admin@frostandcrinkle.com}")
    private String adminEmail;
    
    public ContactMessage saveMessage(ContactMessageDTO dto) {
        ContactMessage message = new ContactMessage();
        message.setName(dto.getName());
        message.setEmail(dto.getEmail());
        message.setPhone(dto.getPhone());
        message.setSubject(dto.getSubject());
        message.setMessage(dto.getMessage());
        message.setIsRead(false);
        
        ContactMessage savedMessage = contactMessageRepository.save(message);
        
        // Send email notification to admin asynchronously
        sendEmailToAdmin(savedMessage);
        
        return savedMessage;
    }
    
    @Async
    private void sendEmailToAdmin(ContactMessage message) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setTo(adminEmail);
            helper.setSubject("🔔 New Contact Message: " + (message.getSubject() != null ? message.getSubject() : "No Subject"));
            
            String htmlContent = buildHtmlEmailTemplate(message);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            // Log error but don't fail the request since it's async
            System.err.println("Failed to send email notification: " + e.getMessage());
        }
    }
    
    private String buildHtmlEmailTemplate(ContactMessage message) {
        String phone = message.getPhone() != null && !message.getPhone().isEmpty() 
            ? message.getPhone() : "<span style='color: #999;'>Not provided</span>";
        String subject = message.getSubject() != null && !message.getSubject().isEmpty() 
            ? message.getSubject() : "<span style='color: #999;'>Not provided</span>";
        
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
                <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                    <tr>
                        <td align="center">
                            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                                <!-- Header -->
                                <tr>
                                    <td style="background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); padding: 40px 30px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                            🍰 Frost & Crinkle
                                        </h1>
                                        <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                                            New Contact Message Received
                                        </p>
                                    </td>
                                </tr>
                                
                                <!-- Content -->
                                <tr>
                                    <td style="padding: 40px 30px;">
                                        <p style="margin: 0 0 30px 0; color: #333; font-size: 16px; line-height: 1.6;">
                                            You have received a new message from your website contact form:
                                        </p>
                                        
                                        <!-- Customer Details Card -->
                                        <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 25px;">
                                            <tr>
                                                <td style="padding: 25px;">
                                                    <h2 style="margin: 0 0 20px 0; color: #667eea; font-size: 18px; font-weight: 600; border-bottom: 2px solid #667eea; padding-bottom: 10px;">
                                                        📋 Customer Details
                                                    </h2>
                                                    
                                                    <table width="100%%" cellpadding="8" cellspacing="0">
                                                        <tr>
                                                            <td style="color: #666; font-size: 14px; font-weight: 600; width: 120px; vertical-align: top;">
                                                                👤 Name:
                                                            </td>
                                                            <td style="color: #333; font-size: 14px; font-weight: 500;">
                                                                %s
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="color: #666; font-size: 14px; font-weight: 600; padding-top: 12px; vertical-align: top;">
                                                                ✉️ Email:
                                                            </td>
                                                            <td style="color: #333; font-size: 14px; padding-top: 12px;">
                                                                <a href="mailto:%s" style="color: #667eea; text-decoration: none; font-weight: 500;">%s</a>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="color: #666; font-size: 14px; font-weight: 600; padding-top: 12px; vertical-align: top;">
                                                                📱 Phone:
                                                            </td>
                                                            <td style="color: #333; font-size: 14px; padding-top: 12px;">
                                                                %s
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td style="color: #666; font-size: 14px; font-weight: 600; padding-top: 12px; vertical-align: top;">
                                                                📌 Subject:
                                                            </td>
                                                            <td style="color: #333; font-size: 14px; padding-top: 12px; font-weight: 500;">
                                                                %s
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Message Card -->
                                        <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #fff3e0; border-left: 4px solid #ff9800; border-radius: 8px; margin-bottom: 25px;">
                                            <tr>
                                                <td style="padding: 25px;">
                                                    <h2 style="margin: 0 0 15px 0; color: #ff9800; font-size: 18px; font-weight: 600;">
                                                        💬 Message
                                                    </h2>
                                                    <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.8; white-space: pre-wrap;">%s</p>
                                                </td>
                                            </tr>
                                        </table>
                                        
                                        <!-- Timestamp -->
                                        <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #e8eaf6; border-radius: 8px;">
                                            <tr>
                                                <td style="padding: 15px 20px; text-align: center;">
                                                    <p style="margin: 0; color: #666; font-size: 13px;">
                                                        🕐 <strong>Received at:</strong> %s
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                
                                <!-- Footer -->
                                <tr>
                                    <td style="background-color: #f8f9fa; padding: 25px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                                        <p style="margin: 0 0 10px 0; color: #666; font-size: 13px;">
                                            This is an automated notification from your Frost & Crinkle website.
                                        </p>
                                        <p style="margin: 0; color: #999; font-size: 12px;">
                                            Please respond to the customer at their provided email address.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(
                message.getName(),
                message.getEmail(),
                message.getEmail(),
                phone,
                subject,
                message.getMessage(),
                message.getCreatedAt()
            );
    }
    
    public List<ContactMessage> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc();
    }
    
    public List<ContactMessage> getUnreadMessages() {
        return contactMessageRepository.findByIsReadOrderByCreatedAtDesc(false);
    }
    
    public ContactMessage markAsRead(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsRead(true);
        return contactMessageRepository.save(message);
    }
    
    public ContactMessage markAsReplied(Long id) {
        ContactMessage message = contactMessageRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsRead(true);
        message.setRepliedAt(LocalDateTime.now());
        return contactMessageRepository.save(message);
    }
    
    public void deleteMessage(Long id) {
        contactMessageRepository.deleteById(id);
    }
}
