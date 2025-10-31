package com.bakery.app.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "user_role", nullable = false)
    private String userRole; // CUSTOMER or ADMIN
    
    @Column(name = "message", nullable = false, length = 500)
    private String message;
    
    @Column(name = "type", nullable = false)
    private String type; // ORDER_PLACED, ORDER_CONFIRMED, ORDER_OUT_FOR_DELIVERY, etc.
    
    @Column(name = "is_read", nullable = false)
    private Boolean read = false;
    
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
