package com.bakery.app.service;

import com.bakery.app.entity.Order;
import com.bakery.app.entity.OrderItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.MessagingException;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Autowired
    private EmailTemplateService emailTemplateService;
    
    @Value("${spring.mail.username}")
    private String fromEmail;
    
    @Value("${frontend.url}")
    private String frontendUrl;
    
    @Value("${admin.email:yaswin02@gmail.com}")
    private String adminEmail;
    
    private static final DecimalFormat df = new DecimalFormat("#,##0.00");
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
    
    public void sendWelcomeEmail(String toEmail, String customerName) {
        try {
            logger.info("Attempting to send welcome email to: {}", toEmail);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🎉 Welcome to Frost & Crinkle Bakery!");
            
            String htmlContent = emailTemplateService.buildWelcomeEmail(customerName, frontendUrl);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            logger.info("Welcome email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", toEmail, e);
            // Don't throw exception - registration should succeed even if email fails
        }
    }
    
    public void sendPasswordResetEmail(String toEmail, String customerName, String resetToken) {
        try {
            String resetLink = frontendUrl + "/reset-password?token=" + resetToken;
            
            logger.info("Attempting to send password reset email to: {}", toEmail);
            logger.info("From email: {}", fromEmail);
            logger.info("Reset link: {}", resetLink);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("🔐 Password Reset Request - Frost & Crinkle Bakery");
            
            String htmlContent = emailTemplateService.buildPasswordResetEmail(customerName, resetLink);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            logger.info("Password reset email sent successfully to: {}", toEmail);
        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", toEmail, e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
    
    public void sendOrderConfirmationToCustomer(Order order) {
        try {
            String customerEmail = order.getCustomer().getEmail();
            String customerName = order.getCustomer().getName();
            
            logger.info("Sending order confirmation email to customer: {}", customerEmail);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(customerEmail);
            helper.setSubject("✅ Order Confirmation - Order #" + order.getId());
            
            String htmlContent = emailTemplateService.buildOrderConfirmationEmail(order, customerName, frontendUrl);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            logger.info("Order confirmation email sent successfully to customer: {}", customerEmail);
        } catch (Exception e) {
            logger.error("Failed to send order confirmation email to customer", e);
            // Don't throw exception - order should still be placed even if email fails
        }
    }
    
    public void sendOrderNotificationToAdmin(Order order) {
        try {
            logger.info("Sending order notification email to admin: {}", adminEmail);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("🛒 New Order Received - Order #" + order.getId());
            
            String htmlContent = emailTemplateService.buildAdminOrderNotificationEmail(order);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            logger.info("Order notification email sent successfully to admin: {}", adminEmail);
        } catch (Exception e) {
            logger.error("Failed to send order notification email to admin", e);
            // Don't throw exception - order should still be placed even if email fails
        }
    }
    
    public void sendOrderOutForDeliveryToCustomer(Order order) {
        try {
            String customerEmail = order.getCustomer().getEmail();
            String customerName = order.getCustomer().getName();
            
            logger.info("Sending out for delivery email to customer: {}", customerEmail);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(customerEmail);
            helper.setSubject("🚚 Order Out for Delivery - Order #" + order.getId());
            
            String htmlContent = emailTemplateService.buildOrderOutForDeliveryEmail(order, customerName);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            logger.info("Out for delivery email sent successfully to customer: {}", customerEmail);
        } catch (Exception e) {
            logger.error("Failed to send out for delivery email to customer", e);
        }
    }
    
    public void sendOrderDeliveredToCustomer(Order order) {
        try {
            String customerEmail = order.getCustomer().getEmail();
            String customerName = order.getCustomer().getName();
            
            logger.info("Sending order delivered email to customer: {}", customerEmail);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(customerEmail);
            helper.setSubject("✓ Order Delivered - Order #" + order.getId());
            
            String htmlContent = emailTemplateService.buildOrderDeliveredEmail(order, customerName);
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            logger.info("Order delivered email sent successfully to customer: {}", customerEmail);
        } catch (Exception e) {
            logger.error("Failed to send order delivered email to customer", e);
        }
    }
    
    public void sendOrderDeliveredToAdmin(Order order) {
        try {
            logger.info("Sending order delivered notification to admin: {}", adminEmail);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("✓ Order Delivered - Order #" + order.getId());
            
            StringBuilder itemsHtml = new StringBuilder();
            for (OrderItem item : order.getOrderItems()) {
                itemsHtml.append("<li>").append(item.getItem().getName())
                        .append(" x").append(item.getQuantity())
                        .append(" - ₹").append(df.format(item.getPrice() * item.getQuantity()));
                if (item.getEggType() != null && "EGGLESS".equals(item.getEggType())) {
                    itemsHtml.append(" (Eggless)");
                }
                itemsHtml.append("</li>");
            }
            
            String htmlContent = "<!DOCTYPE html><html><head><meta charset='UTF-8'><style>" +
                "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                ".container { max-width: 600px; margin: 20px auto; background: #f9f9f9; padding: 30px; border-radius: 8px; }" +
                ".header { background: #4CAF50; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }" +
                ".content { background: white; padding: 25px; border-radius: 0 0 8px 8px; }" +
                ".info-row { padding: 8px 0; border-bottom: 1px solid #eee; }" +
                ".label { font-weight: 600; color: #666; }" +
                "ul { list-style: none; padding: 0; }" +
                "li { padding: 8px; background: #f8f9fa; margin: 5px 0; border-radius: 4px; }" +
                "</style></head><body>" +
                "<div class='container'>" +
                "<div class='header'><h2>✓ Order Delivered Successfully</h2></div>" +
                "<div class='content'>" +
                "<div class='info-row'><span class='label'>Order ID:</span> #" + order.getId() + "</div>" +
                "<div class='info-row'><span class='label'>Customer:</span> " + order.getCustomer().getName() + "</div>" +
                "<div class='info-row'><span class='label'>Email:</span> " + order.getCustomer().getEmail() + "</div>" +
                "<div class='info-row'><span class='label'>Phone:</span> " + order.getCustomer().getPhone() + "</div>" +
                "<div class='info-row'><span class='label'>Delivery Address:</span> " + order.getDeliveryAddress() + "</div>" +
                (order.getLatitude() != null && order.getLongitude() != null ?
                    "<div class='info-row' style='background: #fff3e0; padding: 10px; border-radius: 4px; margin: 8px 0;'>" +
                    "<span class='label' style='color: #e65100;'>📍 GPS Location:</span> " +
                    "<span style='color: #e65100; font-weight: 600;'>" + 
                    String.format("%.6f", order.getLatitude()) + ", " + String.format("%.6f", order.getLongitude()) + 
                    "</span></div>" : "") +
                "<div class='info-row'><span class='label'>Delivery Phone:</span> " + order.getDeliveryPhone() + "</div>" +
                "<h3>Items:</h3><ul>" + itemsHtml.toString() + "</ul>" +
                "<div class='info-row' style='font-size: 18px; font-weight: 700; color: #4CAF50;'>" +
                "<span class='label'>Total:</span> ₹" + df.format(order.getTotalAmount()) + "</div>" +
                "<p style='margin-top: 20px; color: #666;'>This order has been successfully delivered to the customer.</p>" +
                "</div></div></body></html>";
            
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            logger.info("Order delivered notification sent successfully to admin: {}", adminEmail);
        } catch (Exception e) {
            logger.error("Failed to send order delivered notification to admin", e);
        }
    }
    
    public void sendAddressChangeNotificationToAdmin(Order order, String oldAddress, String oldPhone, Double oldLatitude, Double oldLongitude) {
        try {
            logger.info("Sending address change notification to admin: {}", adminEmail);
            
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(adminEmail);
            helper.setSubject("📍 Address Updated - Order #" + order.getId());
            
            String htmlContent = """
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
                                        <td style="background: linear-gradient(135deg, #ff9800 0%%, #f57c00 100%%); padding: 40px 30px; text-align: center;">
                                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                                                🍰 Frost & Crinkle
                                            </h1>
                                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.95;">
                                                📍 Delivery Address Updated
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 40px 30px;">
                                            <div style="background-color: #fff3e0; border-left: 4px solid #ff9800; padding: 15px 20px; margin-bottom: 25px; border-radius: 4px;">
                                                <p style="margin: 0; color: #e65100; font-size: 14px; font-weight: 600;">
                                                    ⚠️ IMPORTANT: Customer has updated their delivery address
                                                </p>
                                            </div>
                                            
                                            <p style="margin: 0 0 25px 0; color: #333; font-size: 16px; line-height: 1.6;">
                                                A customer has changed the delivery address for their order:
                                            </p>
                                            
                                            <!-- Order Info -->
                                            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #f8f9fa; border-radius: 8px; margin-bottom: 25px;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <h2 style="margin: 0 0 15px 0; color: #ff9800; font-size: 18px; font-weight: 600;">
                                                            📦 Order Information
                                                        </h2>
                                                        <table width="100%%" cellpadding="8" cellspacing="0">
                                                            <tr>
                                                                <td style="color: #666; font-size: 14px; font-weight: 600; width: 140px;">Order ID:</td>
                                                                <td style="color: #333; font-size: 14px; font-weight: 700;">#%s</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="color: #666; font-size: 14px; font-weight: 600;">Customer:</td>
                                                                <td style="color: #333; font-size: 14px; font-weight: 500;">%s</td>
                                                            </tr>
                                                            <tr>
                                                                <td style="color: #666; font-size: 14px; font-weight: 600;">Email:</td>
                                                                <td style="color: #333; font-size: 14px;"><a href="mailto:%s" style="color: #ff9800; text-decoration: none;">%s</a></td>
                                                            </tr>
                                                            <tr>
                                                                <td style="color: #666; font-size: 14px; font-weight: 600;">Order Status:</td>
                                                                <td style="color: #333; font-size: 14px; font-weight: 600;">%s</td>
                                                            </tr>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Old Address -->
                                            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #ffebee; border-left: 4px solid #f44336; border-radius: 8px; margin-bottom: 15px;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <h3 style="margin: 0 0 12px 0; color: #c62828; font-size: 16px; font-weight: 600;">
                                                            ❌ Previous Address
                                                        </h3>
                                                        <p style="margin: 0 0 8px 0; color: #333; font-size: 14px; line-height: 1.6;">
                                                            <strong>Address:</strong><br/>%s
                                                        </p>
                                                        <p style="margin: 0 0 8px 0; color: #333; font-size: 14px;">
                                                            <strong>Phone:</strong> %s
                                                        </p>
                                                        %s
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- New Address -->
                                            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #e8f5e9; border-left: 4px solid #4caf50; border-radius: 8px; margin-bottom: 25px;">
                                                <tr>
                                                    <td style="padding: 20px;">
                                                        <h3 style="margin: 0 0 12px 0; color: #2e7d32; font-size: 16px; font-weight: 600;">
                                                            ✅ New Address
                                                        </h3>
                                                        <p style="margin: 0 0 8px 0; color: #333; font-size: 14px; line-height: 1.6;">
                                                            <strong>Address:</strong><br/>%s
                                                        </p>
                                                        <p style="margin: 0 0 8px 0; color: #333; font-size: 14px;">
                                                            <strong>Phone:</strong> %s
                                                        </p>
                                                        %s
                                                        %s
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <!-- Action Required -->
                                            <table width="100%%" cellpadding="0" cellspacing="0" style="background-color: #e3f2fd; border-radius: 8px;">
                                                <tr>
                                                    <td style="padding: 20px; text-align: center;">
                                                        <p style="margin: 0; color: #1565c0; font-size: 14px; font-weight: 600;">
                                                            💡 Please update your delivery records accordingly
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
                                                Address updated at: %s
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
                    order.getId(),
                    order.getCustomer().getName(),
                    order.getCustomer().getEmail(),
                    order.getCustomer().getEmail(),
                    order.getStatus(),
                    oldAddress,
                    oldPhone,
                    oldLatitude != null && oldLongitude != null
                        ? "<p style='margin: 8px 0 0 0; padding: 8px; background: #ffccbc; border-radius: 4px; color: #d84315; font-size: 13px; font-weight: 600;'>" +
                          "📍 Old GPS Location: " + String.format("%.6f", oldLatitude) + ", " + String.format("%.6f", oldLongitude) + "</p>"
                        : "",
                    order.getDeliveryAddress(),
                    order.getDeliveryPhone(),
                    order.getDeliveryNotes() != null && !order.getDeliveryNotes().isEmpty() 
                        ? "<p style='margin: 0; color: #333; font-size: 14px;'><strong>Notes:</strong> " + order.getDeliveryNotes() + "</p>"
                        : "",
                    order.getLatitude() != null && order.getLongitude() != null
                        ? "<p style='margin: 8px 0 0 0; padding: 8px; background: #c8e6c9; border-radius: 4px; color: #2e7d32; font-size: 13px; font-weight: 600;'>" +
                          "📍 New GPS Location: " + String.format("%.6f", order.getLatitude()) + ", " + String.format("%.6f", order.getLongitude()) + "</p>"
                        : "",
                    java.time.LocalDateTime.now().format(dateFormatter)
                );
            
            helper.setText(htmlContent, true);
            
            mailSender.send(mimeMessage);
            logger.info("Address change notification sent successfully to admin: {}", adminEmail);
        } catch (Exception e) {
            logger.error("Failed to send address change notification to admin", e);
        }
    }
}
