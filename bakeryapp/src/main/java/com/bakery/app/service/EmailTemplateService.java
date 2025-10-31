package com.bakery.app.service;

import com.bakery.app.entity.Order;
import com.bakery.app.entity.OrderItem;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;

@Service
public class EmailTemplateService {
    
    private static final DecimalFormat df = new DecimalFormat("#,##0.00");
    private static final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a");
    
    private static final String BASE_STYLES = 
        "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4; }" +
        ".container { max-width: 650px; margin: 20px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }" +
        ".content { padding: 40px 30px; }" +
        ".greeting { font-size: 18px; color: #333; margin-bottom: 20px; }" +
        ".message { color: #666; font-size: 16px; line-height: 1.8; margin-bottom: 25px; }" +
        ".footer { background: #f8f9fa; padding: 25px 30px; text-align: center; color: #6c757d; font-size: 14px; border-top: 1px solid #e9ecef; }";
    
    public String buildWelcomeEmail(String customerName, String frontendUrl) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>" +
            BASE_STYLES +
            ".header { background: linear-gradient(135deg, #e91e63 0%, #ff6b35 100%); color: white; padding: 50px 20px; text-align: center; }" +
            ".header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 700; }" +
            ".header p { margin: 0; font-size: 16px; opacity: 0.95; }" +
            ".welcome-box { background: linear-gradient(135deg, #fff5f8 0%, #fff8f0 100%); border-radius: 12px; padding: 30px; margin: 25px 0; text-align: center; border: 2px solid #ffe0e9; }" +
            ".welcome-box h2 { color: #e91e63; margin: 0 0 15px 0; font-size: 24px; }" +
            ".feature-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 30px 0; }" +
            ".feature-item { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; }" +
            ".feature-item .icon { font-size: 32px; margin-bottom: 10px; }" +
            ".feature-item .title { font-weight: 600; color: #333; margin-bottom: 5px; }" +
            ".feature-item .desc { font-size: 13px; color: #666; }" +
            ".button-container { text-align: center; margin: 35px 0; }" +
            ".shop-button { display: inline-block; padding: 16px 45px; background: linear-gradient(135deg, #e91e63 0%, #ff6b35 100%); color: white !important; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 17px; box-shadow: 0 4px 20px rgba(233, 30, 99, 0.4); transition: transform 0.2s; }" +
            ".shop-button:hover { transform: translateY(-2px); box-shadow: 0 6px 25px rgba(233, 30, 99, 0.5); }" +
            ".offer-box { background: #fff3e0; border-left: 4px solid #ff9800; padding: 20px; margin: 25px 0; border-radius: 4px; }" +
            ".offer-box h3 { color: #e65100; margin: 0 0 10px 0; font-size: 18px; }" +
            "</style></head><body>" +
            "<div class='container'>" +
            "<div class='header'>" +
            "<h1>🍰 Welcome to Frost & Crinkle!</h1>" +
            "<p>Your journey to delicious treats begins here</p>" +
            "</div>" +
            "<div class='content'>" +
            "<div class='greeting'>Hello " + customerName + ",</div>" +
            "<div class='welcome-box'>" +
            "<h2>🎉 Thank You for Joining Us!</h2>" +
            "<p style='color: #666; font-size: 15px; margin: 0;'>We're thrilled to have you as part of our Frost & Crinkle family. Get ready to explore our delicious collection of freshly baked treats!</p>" +
            "</div>" +
            "<div class='message'>At Frost & Crinkle Bakery, we believe in creating moments of joy with every bite. From classic cakes to custom creations, we're here to make your celebrations sweeter!</div>" +
            "<div class='feature-grid'>" +
            "<div class='feature-item'><div class='icon'>🎂</div><div class='title'>Fresh Daily</div><div class='desc'>Baked with love every morning</div></div>" +
            "<div class='feature-item'><div class='icon'>🚚</div><div class='title'>Fast Delivery</div><div class='desc'>Quick delivery to your doorstep</div></div>" +
            "<div class='feature-item'><div class='icon'>🌟</div><div class='title'>Premium Quality</div><div class='desc'>Only the finest ingredients</div></div>" +
            "<div class='feature-item'><div class='icon'>💝</div><div class='title'>Custom Orders</div><div class='desc'>Personalized cakes & treats</div></div>" +
            "</div>" +
            "<div class='offer-box'>" +
            "<h3>🎁 Special Welcome Offer!</h3>" +
            "<p style='margin: 0; color: #666;'>Enjoy browsing our collection and placing your first order. We can't wait to serve you!</p>" +
            "</div>" +
            "<div class='button-container'><a href='" + frontendUrl + "/shop' class='shop-button'>Start Shopping 🛍️</a></div>" +
            "<div class='message' style='text-align: center; color: #666; font-size: 14px;'>Need help? Feel free to reach out to us anytime. We're here to make your experience delightful!</div>" +
            "</div>" +
            "<div class='footer'>" +
            "<p><strong>Frost & Crinkle Bakery</strong></p>" +
            "<p>Freshly Baked with Love ❤️</p>" +
            "<p style='font-size: 12px; color: #999; margin-top: 15px;'>You're receiving this email because you created an account with us.</p>" +
            "</div>" +
            "</div></body></html>";
    }
    
    public String buildPasswordResetEmail(String customerName, String resetLink) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>" +
            BASE_STYLES +
            ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; text-align: center; }" +
            ".header h1 { margin: 0; font-size: 28px; font-weight: 600; }" +
            ".button-container { text-align: center; margin: 35px 0; }" +
            ".reset-button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white !important; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); }" +
            ".warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; color: #856404; }" +
            "</style></head><body>" +
            "<div class='container'>" +
            "<div class='header'><h1>🔐 Password Reset Request</h1></div>" +
            "<div class='content'>" +
            "<div class='greeting'>Hello " + customerName + ",</div>" +
            "<div class='message'>We received a request to reset your password for your Frost & Crinkle Bakery account. Click the button below to create a new password:</div>" +
            "<div class='button-container'><a href='" + resetLink + "' class='reset-button'>Reset Password</a></div>" +
            "<div class='warning'>⏰ <strong>Important:</strong> This link will expire in 30 minutes for security reasons.</div>" +
            "<div class='message'>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</div>" +
            "</div>" +
            "<div class='footer'><p><strong>Frost & Crinkle Bakery</strong></p><p>Freshly Baked with Love ❤️</p></div>" +
            "</div></body></html>";
    }
    
    public String buildOrderConfirmationEmail(Order order, String customerName, String frontendUrl) {
        StringBuilder itemsHtml = new StringBuilder();
        for (OrderItem item : order.getOrderItems()) {
            itemsHtml.append("<tr>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef;'>");
            itemsHtml.append("<strong>").append(item.getItem().getName()).append("</strong>");
            if (item.getEggType() != null) {
                if ("EGGLESS".equals(item.getEggType())) {
                    itemsHtml.append("<br><span style='color: #28a745; font-size: 12px;'>🌱 Eggless</span>");
                } else {
                    itemsHtml.append("<br><span style='color: #ff9800; font-size: 12px;'>🥚 With Egg</span>");
                }
            }
            itemsHtml.append("</td>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center;'>x").append(item.getQuantity()).append("</td>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; font-weight: 600;'>₹").append(df.format(item.getPrice() * item.getQuantity())).append("</td>");
            itemsHtml.append("</tr>");
        }
        
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>" +
            BASE_STYLES +
            ".header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 40px 20px; text-align: center; }" +
            ".header h1 { margin: 0; font-size: 28px; font-weight: 600; }" +
            ".header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }" +
            ".order-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; }" +
            ".order-info-row { padding: 8px 0; border-bottom: 1px solid #dee2e6; }" +
            ".order-info-row:last-child { border-bottom: none; }" +
            ".label { color: #6c757d; font-weight: 500; }" +
            ".value { color: #333; font-weight: 600; float: right; }" +
            ".items-table { width: 100%; border-collapse: collapse; margin: 25px 0; }" +
            ".items-table th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6; }" +
            ".total-row { background: #28a745; color: white; font-weight: 700; font-size: 18px; }" +
            ".total-row td { padding: 15px 12px !important; border-bottom: none !important; }" +
            ".address-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 25px 0; border-radius: 4px; }" +
            ".address-box h3 { margin: 0 0 10px 0; color: #856404; font-size: 16px; }" +
            ".track-button { display: inline-block; padding: 15px 40px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white !important; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.4); margin: 20px 0; }" +
            "</style></head><body>" +
            "<div class='container'>" +
            "<div class='header'><h1>✅ Order Confirmed!</h1><p>Thank you for your order</p></div>" +
            "<div class='content'>" +
            "<div class='greeting'>Dear " + customerName + ",</div>" +
            "<div class='message'>Your order has been placed successfully! We're excited to prepare your delicious treats. 🎉</div>" +
            "<div class='order-info'>" +
            "<div class='order-info-row'><span class='label'>Order ID:</span><span class='value'>#" + order.getId() + "</span></div>" +
            "<div class='order-info-row'><span class='label'>Order Date:</span><span class='value'>" + order.getOrderDate().format(dateFormatter) + "</span></div>" +
            "<div class='order-info-row'><span class='label'>Status:</span><span class='value' style='color: #28a745;'>" + order.getStatus() + "</span></div>" +
            "</div>" +
            "<h3 style='color: #333; margin-top: 30px;'>📦 Items Ordered</h3>" +
            "<table class='items-table'>" +
            "<thead><tr><th>Item</th><th style='text-align: center;'>Qty</th><th style='text-align: right;'>Price</th></tr></thead>" +
            "<tbody>" +
            itemsHtml.toString() +
            "<tr class='total-row'><td colspan='2'>TOTAL</td><td style='text-align: right;'>₹" + df.format(order.getTotalAmount()) + "</td></tr>" +
            "</tbody></table>" +
            "<div class='address-box'>" +
            "<h3>🚚 Delivery Address</h3>" +
            "<p style='margin: 5px 0; color: #856404;'>" + order.getDeliveryAddress() + "</p>" +
            (order.getLatitude() != null && order.getLongitude() != null ?
                "<p style='margin: 8px 0; padding: 8px; background: #fff3e0; border-radius: 4px; color: #e65100; font-weight: 600;'>" +
                "📍 GPS Location: " + String.format("%.6f", order.getLatitude()) + ", " + String.format("%.6f", order.getLongitude()) + 
                "</p>" : "") +
            "<p style='margin: 5px 0; color: #856404;'><strong>Phone:</strong> " + order.getDeliveryPhone() + "</p>" +
            (order.getDeliveryNotes() != null && !order.getDeliveryNotes().isEmpty() ? 
                "<p style='margin: 10px 0 0 0; color: #856404;'><strong>Notes:</strong> " + order.getDeliveryNotes() + "</p>" : "") +
            "</div>" +
            "<div style='text-align: center;'><a href='" + frontendUrl + "/orders' class='track-button'>Track Your Order</a></div>" +
            "</div>" +
            "<div class='footer'><p><strong>Frost & Crinkle Bakery</strong></p><p>Freshly Baked with Love ❤️</p></div>" +
            "</div></body></html>";
    }
    
    public String buildAdminOrderNotificationEmail(Order order) {
        StringBuilder itemsHtml = new StringBuilder();
        for (OrderItem item : order.getOrderItems()) {
            itemsHtml.append("<tr>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef;'>");
            itemsHtml.append("<strong>").append(item.getItem().getName()).append("</strong>");
            if (item.getEggType() != null) {
                if ("EGGLESS".equals(item.getEggType())) {
                    itemsHtml.append("<br><span style='color: #28a745; font-size: 12px;'>🌱 Eggless</span>");
                } else {
                    itemsHtml.append("<br><span style='color: #ff9800; font-size: 12px;'>🥚 With Egg</span>");
                }
            }
            itemsHtml.append("</td>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center;'>x").append(item.getQuantity()).append("</td>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; font-weight: 600;'>₹").append(df.format(item.getPrice() * item.getQuantity())).append("</td>");
            itemsHtml.append("</tr>");
        }
        
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>" +
            BASE_STYLES +
            ".header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%); color: white; padding: 40px 20px; text-align: center; }" +
            ".header h1 { margin: 0; font-size: 28px; font-weight: 600; }" +
            ".alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-bottom: 25px; border-radius: 4px; color: #856404; font-weight: 600; }" +
            ".section-title { color: #333; font-size: 18px; font-weight: 600; margin: 25px 0 15px 0; border-bottom: 2px solid #dee2e6; padding-bottom: 8px; }" +
            ".info-grid { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; }" +
            ".info-row { padding: 8px 0; border-bottom: 1px solid #dee2e6; }" +
            ".info-row:last-child { border-bottom: none; }" +
            ".label { color: #6c757d; font-weight: 500; }" +
            ".value { color: #333; font-weight: 600; float: right; }" +
            ".items-table { width: 100%; border-collapse: collapse; margin: 15px 0; }" +
            ".items-table th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6; }" +
            ".total-row { background: #ff6b6b; color: white; font-weight: 700; font-size: 18px; }" +
            ".total-row td { padding: 15px 12px !important; border-bottom: none !important; }" +
            "</style></head><body>" +
            "<div class='container'>" +
            "<div class='header'><h1>🛒 New Order Received</h1></div>" +
            "<div class='content'>" +
            "<div class='alert'>⚡ Action Required: New order needs processing!</div>" +
            "<div class='section-title'>Order Information</div>" +
            "<div class='info-grid'>" +
            "<div class='info-row'><span class='label'>Order ID:</span><span class='value'>#" + order.getId() + "</span></div>" +
            "<div class='info-row'><span class='label'>Order Date:</span><span class='value'>" + order.getOrderDate().format(dateFormatter) + "</span></div>" +
            "<div class='info-row'><span class='label'>Status:</span><span class='value' style='color: #ff6b6b;'>" + order.getStatus() + "</span></div>" +
            "</div>" +
            "<div class='section-title'>Customer Details</div>" +
            "<div class='info-grid'>" +
            "<div class='info-row'><span class='label'>Name:</span><span class='value'>" + order.getCustomer().getName() + "</span></div>" +
            "<div class='info-row'><span class='label'>Email:</span><span class='value'>" + order.getCustomer().getEmail() + "</span></div>" +
            "<div class='info-row'><span class='label'>Phone:</span><span class='value'>" + order.getCustomer().getPhone() + "</span></div>" +
            "</div>" +
            "<div class='section-title'>📦 Items Ordered</div>" +
            "<table class='items-table'>" +
            "<thead><tr><th>Item</th><th style='text-align: center;'>Qty</th><th style='text-align: right;'>Price</th></tr></thead>" +
            "<tbody>" +
            itemsHtml.toString() +
            "<tr class='total-row'><td colspan='2'>TOTAL</td><td style='text-align: right;'>₹" + df.format(order.getTotalAmount()) + "</td></tr>" +
            "</tbody></table>" +
            "<div class='section-title'>🚚 Delivery Information</div>" +
            "<div class='info-grid'>" +
            "<div class='info-row'><span class='label'>Address:</span><span class='value'>" + order.getDeliveryAddress() + "</span></div>" +
            (order.getLatitude() != null && order.getLongitude() != null ?
                "<div class='info-row' style='background: #fff3e0; padding: 10px; border-radius: 4px; margin: 8px 0;'>" +
                "<span class='label' style='color: #e65100;'>📍 GPS Location:</span>" +
                "<span class='value' style='color: #e65100; font-weight: 600;'>" + 
                String.format("%.6f", order.getLatitude()) + ", " + String.format("%.6f", order.getLongitude()) + 
                "</span></div>" : "") +
            "<div class='info-row'><span class='label'>Phone:</span><span class='value'>" + order.getDeliveryPhone() + "</span></div>" +
            (order.getDeliveryNotes() != null && !order.getDeliveryNotes().isEmpty() ? 
                "<div class='info-row'><span class='label'>Notes:</span><span class='value'>" + order.getDeliveryNotes() + "</span></div>" : "") +
            "</div>" +
            "</div>" +
            "<div class='footer'><p><strong>Frost & Crinkle Bakery - Admin Panel</strong></p><p>Please process this order promptly</p></div>" +
            "</div></body></html>";
    }
    
    public String buildOrderOutForDeliveryEmail(Order order, String customerName) {
        StringBuilder itemsHtml = new StringBuilder();
        for (OrderItem item : order.getOrderItems()) {
            itemsHtml.append("<tr>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef;'>");
            itemsHtml.append("<strong>").append(item.getItem().getName()).append("</strong>");
            if (item.getEggType() != null) {
                if ("EGGLESS".equals(item.getEggType())) {
                    itemsHtml.append("<br><span style='color: #28a745; font-size: 12px;'>🌱 Eggless</span>");
                } else {
                    itemsHtml.append("<br><span style='color: #ff9800; font-size: 12px;'>🥚 With Egg</span>");
                }
            }
            itemsHtml.append("</td>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center;'>x").append(item.getQuantity()).append("</td>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; font-weight: 600;'>₹").append(df.format(item.getPrice() * item.getQuantity())).append("</td>");
            itemsHtml.append("</tr>");
        }
        
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>" +
            BASE_STYLES +
            ".header { background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 40px 20px; text-align: center; }" +
            ".header h1 { margin: 0; font-size: 28px; font-weight: 600; }" +
            ".header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }" +
            ".alert-box { background: #e3f2fd; border-left: 4px solid #2196F3; padding: 20px; margin: 25px 0; border-radius: 4px; }" +
            ".alert-box h3 { margin: 0 0 10px 0; color: #1565C0; font-size: 18px; }" +
            ".alert-box p { margin: 5px 0; color: #1565C0; }" +
            ".items-table { width: 100%; border-collapse: collapse; margin: 25px 0; }" +
            ".items-table th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6; }" +
            ".total-row { background: #2196F3; color: white; font-weight: 700; font-size: 18px; }" +
            ".total-row td { padding: 15px 12px !important; border-bottom: none !important; }" +
            "</style></head><body>" +
            "<div class='container'>" +
            "<div class='header'><h1>🚚 Order Out for Delivery!</h1><p>Your order is on its way</p></div>" +
            "<div class='content'>" +
            "<div class='greeting'>Dear " + customerName + ",</div>" +
            "<div class='alert-box'>" +
            "<h3>📦 Your order is out for delivery!</h3>" +
            "<p><strong>Order #" + order.getId() + "</strong> is on its way to you.</p>" +
            "<p>Our delivery partner will reach you soon. Please keep your phone handy.</p>" +
            "</div>" +
            "<h3 style='color: #333; margin-top: 30px;'>Order Summary</h3>" +
            "<table class='items-table'>" +
            "<thead><tr><th>Item</th><th style='text-align: center;'>Qty</th><th style='text-align: right;'>Price</th></tr></thead>" +
            "<tbody>" +
            itemsHtml.toString() +
            "<tr class='total-row'><td colspan='2'>TOTAL</td><td style='text-align: right;'>₹" + df.format(order.getTotalAmount()) + "</td></tr>" +
            "</tbody></table>" +
            "<div class='alert-box'>" +
            "<h3>🏠 Delivery Address</h3>" +
            "<p style='margin: 5px 0;'>" + order.getDeliveryAddress() + "</p>" +
            (order.getLatitude() != null && order.getLongitude() != null ?
                "<p style='margin: 8px 0; padding: 8px; background: #fff3e0; border-radius: 4px; color: #e65100; font-weight: 600;'>" +
                "📍 GPS Location: " + String.format("%.6f", order.getLatitude()) + ", " + String.format("%.6f", order.getLongitude()) + 
                "</p>" : "") +
            "<p style='margin: 5px 0;'><strong>Phone:</strong> " + order.getDeliveryPhone() + "</p>" +
            (order.getDeliveryNotes() != null && !order.getDeliveryNotes().isEmpty() ? 
                "<p style='margin: 10px 0 0 0;'><strong>Notes:</strong> " + order.getDeliveryNotes() + "</p>" : "") +
            "</div>" +
            "<div class='message'>Thank you for your patience! We hope you enjoy your delicious treats from Frost & Crinkle Bakery! 🎉</div>" +
            "</div>" +
            "<div class='footer'><p><strong>Frost & Crinkle Bakery</strong></p><p>Freshly Baked with Love ❤️</p></div>" +
            "</div></body></html>";
    }
    
    public String buildOrderDeliveredEmail(Order order, String customerName) {
        StringBuilder itemsHtml = new StringBuilder();
        for (OrderItem item : order.getOrderItems()) {
            itemsHtml.append("<tr>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef;'>");
            itemsHtml.append("<strong>").append(item.getItem().getName()).append("</strong>");
            if (item.getEggType() != null) {
                if ("EGGLESS".equals(item.getEggType())) {
                    itemsHtml.append("<br><span style='color: #28a745; font-size: 12px;'>🌱 Eggless</span>");
                } else {
                    itemsHtml.append("<br><span style='color: #ff9800; font-size: 12px;'>🥚 With Egg</span>");
                }
            }
            itemsHtml.append("</td>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef; text-align: center;'>x").append(item.getQuantity()).append("</td>");
            itemsHtml.append("<td style='padding: 12px; border-bottom: 1px solid #e9ecef; text-align: right; font-weight: 600;'>₹").append(df.format(item.getPrice() * item.getQuantity())).append("</td>");
            itemsHtml.append("</tr>");
        }
        
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style>" +
            BASE_STYLES +
            ".header { background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 40px 20px; text-align: center; }" +
            ".header h1 { margin: 0; font-size: 28px; font-weight: 600; }" +
            ".header p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.95; }" +
            ".success-badge { background: #d4edda; border: 2px solid #28a745; color: #155724; padding: 15px; border-radius: 8px; text-align: center; font-weight: 600; margin: 25px 0; font-size: 18px; }" +
            ".items-table { width: 100%; border-collapse: collapse; margin: 25px 0; }" +
            ".items-table th { background: #f8f9fa; padding: 12px; text-align: left; font-weight: 600; color: #495057; border-bottom: 2px solid #dee2e6; }" +
            ".total-row { background: #4CAF50; color: white; font-weight: 700; font-size: 18px; }" +
            ".total-row td { padding: 15px 12px !important; border-bottom: none !important; }" +
            "</style></head><body>" +
            "<div class='container'>" +
            "<div class='header'><h1>✓ Order Delivered!</h1><p>Your order has arrived</p></div>" +
            "<div class='content'>" +
            "<div class='greeting'>Dear " + customerName + ",</div>" +
            "<div class='success-badge'>🎉 Your order has been delivered successfully!</div>" +
            "<div class='message'>We hope you enjoy your delicious treats from Frost & Crinkle Bakery!</div>" +
            "<h3 style='color: #333; margin-top: 30px;'>Order Summary</h3>" +
            "<table class='items-table'>" +
            "<thead><tr><th>Item</th><th style='text-align: center;'>Qty</th><th style='text-align: right;'>Price</th></tr></thead>" +
            "<tbody>" +
            itemsHtml.toString() +
            "<tr class='total-row'><td colspan='2'>TOTAL</td><td style='text-align: right;'>₹" + df.format(order.getTotalAmount()) + "</td></tr>" +
            "</tbody></table>" +
            "<div class='message'>Thank you for choosing Frost & Crinkle Bakery! We look forward to serving you again soon. ❤️</div>" +
            "</div>" +
            "<div class='footer'><p><strong>Frost & Crinkle Bakery</strong></p><p>Freshly Baked with Love ❤️</p></div>" +
            "</div></body></html>";
    }
}
