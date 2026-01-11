package com.bakery.app.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;

import java.io.IOException;

/**
 * Security Headers Configuration
 * Adds essential security headers to all HTTP responses
 */
@Configuration
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SecurityHeadersConfig implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        // Prevent clickjacking attacks
        httpResponse.setHeader("X-Frame-Options", "DENY");
        
        // Prevent MIME type sniffing
        httpResponse.setHeader("X-Content-Type-Options", "nosniff");
        
        // Enable XSS protection
        httpResponse.setHeader("X-XSS-Protection", "1; mode=block");
        
        // Content Security Policy
        httpResponse.setHeader("Content-Security-Policy", 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src 'self' https://fonts.gstatic.com; " +
            "img-src 'self' data: https:; " +
            "connect-src 'self' https://api.razorpay.com; " +
            "frame-src https://api.razorpay.com;");
        
        // Referrer Policy
        httpResponse.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        
        // Permissions Policy (formerly Feature Policy)
        httpResponse.setHeader("Permissions-Policy", 
            "geolocation=(), microphone=(), camera=()");
        
        // Strict Transport Security (HSTS) - Enable only when using HTTPS
        // Uncomment in production with HTTPS
        // httpResponse.setHeader("Strict-Transport-Security", 
        //     "max-age=31536000; includeSubDomains; preload");
        
        chain.doFilter(request, response);
    }
}
