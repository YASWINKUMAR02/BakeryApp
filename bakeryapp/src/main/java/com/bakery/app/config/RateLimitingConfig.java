package com.bakery.app.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate Limiting Configuration
 * Prevents abuse by limiting requests per IP address
 */
@Configuration
@Order(1)
public class RateLimitingConfig implements Filter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String ip = getClientIP(httpRequest);
        String path = httpRequest.getRequestURI();
        
        // Apply rate limiting only to sensitive endpoints
        if (shouldRateLimit(path)) {
            Bucket bucket = resolveBucket(ip, path);
            
            if (bucket.tryConsume(1)) {
                // Request allowed
                chain.doFilter(request, response);
            } else {
                // Rate limit exceeded
                httpResponse.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write(
                    "{\"success\":false,\"message\":\"Too many requests. Please try again later.\"}"
                );
            }
        } else {
            // No rate limiting for this endpoint
            chain.doFilter(request, response);
        }
    }

    private Bucket resolveBucket(String ip, String path) {
        String key = ip + ":" + path;
        return cache.computeIfAbsent(key, k -> createBucket(path));
    }

    private Bucket createBucket(String path) {
        Bandwidth limit;
        
        if (path.contains("/login") || path.contains("/register")) {
            // Strict limit for auth endpoints: 5 requests per minute
            limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
        } else if (path.contains("/forgot-password") || path.contains("/reset-password")) {
            // Very strict for password reset: 3 requests per 5 minutes
            limit = Bandwidth.classic(3, Refill.intervally(3, Duration.ofMinutes(5)));
        } else if (path.contains("/orders")) {
            // Moderate limit for orders: 20 requests per minute
            limit = Bandwidth.classic(20, Refill.intervally(20, Duration.ofMinutes(1)));
        } else {
            // Default: 100 requests per minute
            limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(1)));
        }
        
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    private boolean shouldRateLimit(String path) {
        // Apply rate limiting to these endpoints
        return path.contains("/api/customers/login") ||
               path.contains("/api/customers/register") ||
               path.contains("/api/admin/login") ||
               path.contains("/api/admin/register") ||
               path.contains("/api/customers/forgot-password") ||
               path.contains("/api/customers/reset-password") ||
               path.contains("/api/orders") ||
               path.contains("/api/payments");
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
