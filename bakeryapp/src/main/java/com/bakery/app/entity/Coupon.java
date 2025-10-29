package com.bakery.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "coupons")
@Data
@NoArgsConstructor
public class Coupon {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, unique = true)
    private String code;
    
    @Column(nullable = false)
    private String description;
    
    @Column(nullable = false)
    private String discountType; // PERCENTAGE or FIXED
    
    @Column(nullable = false)
    private Double discountValue;
    
    @Column(nullable = false)
    private Double minOrderAmount = 0.0;
    
    @Column(nullable = false)
    private Double maxDiscountAmount; // For percentage discounts
    
    @Column(nullable = false)
    private LocalDateTime validFrom;
    
    @Column(nullable = false)
    private LocalDateTime validUntil;
    
    @Column(nullable = false)
    private Boolean active = true;
    
    @Column(nullable = false)
    private Integer usageLimit = 0; // 0 means unlimited
    
    @Column(nullable = false)
    private Integer usageCount = 0;
}
