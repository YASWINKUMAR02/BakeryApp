package com.bakery.app.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * Security Configuration
 * Configures Spring Security with JWT authentication and CORS
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Value("${cors.allowed.origins}")
    private String allowedOrigins;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        // BCrypt with strength 12 for production-grade security
        return new BCryptPasswordEncoder(12);
    }
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF for stateless JWT authentication
            .csrf(csrf -> csrf.disable())
            
            // Configure CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // Stateless session management
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Security headers
            .headers(headers -> headers
                .frameOptions(frame -> frame.deny())
                .xssProtection(xss -> xss.disable()) // Using CSP instead
                .contentTypeOptions(contentType -> contentType.disable())
            )
            
            // Authorization rules
            .authorizeHttpRequests(auth -> auth
                // Health check and actuator endpoints
                .requestMatchers("/actuator/health", "/actuator/info").permitAll()
                .requestMatchers("/actuator/**").hasRole("ADMIN")
                
                // Public endpoints - authentication
                .requestMatchers("/api/customers/register", "/api/customers/login").permitAll()
                .requestMatchers("/api/customers/forgot-password", "/api/customers/reset-password").permitAll()
                .requestMatchers("/api/admin/login").permitAll()
                
                // Swagger/OpenAPI endpoints (disable in production)
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                
                // Public endpoints - browsing
                .requestMatchers("/api/items/**", "/api/categories/**").permitAll()
                .requestMatchers("/api/reviews/item/**").permitAll()
                
                // Payment webhooks
                .requestMatchers("/api/webhooks/**").permitAll()
                
                // Payment endpoints (authenticated)
                .requestMatchers("/api/payments/**").authenticated()
                
                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/coupons/**").hasRole("ADMIN")
                
                // Customer endpoints
                .requestMatchers("/api/cart/**").hasRole("CUSTOMER")
                .requestMatchers("/api/orders/**").hasAnyRole("CUSTOMER", "ADMIN")
                .requestMatchers("/api/wishlist/**").hasRole("CUSTOMER")
                .requestMatchers("/api/reviews/**").hasRole("CUSTOMER")
                .requestMatchers("/api/order-history/**").hasAnyRole("CUSTOMER", "ADMIN")
                
                // All other requests require authentication
                .anyRequest().authenticated()
            )
            
            // Add JWT filter
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Use environment variable for allowed origins
        List<String> origins = Arrays.asList(allowedOrigins.split(","));
        configuration.setAllowedOrigins(origins);
        
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("Authorization", "Content-Disposition"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L); // Cache preflight for 1 hour
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
