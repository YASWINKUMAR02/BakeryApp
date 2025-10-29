package com.bakery.app.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "order_history")
@Data
@NoArgsConstructor
public class OrderHistory {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private Integer customerId;
    
    @Column(nullable = false)
    private String customerName;
    
    @Column(nullable = false)
    private LocalDateTime orderDate;
    
    @Column(nullable = false)
    private LocalDateTime deliveredDate;
    
    @Column(nullable = false)
    private Double totalAmount;
    
    @Column(nullable = false)
    private String status;  // Will be "Delivered"
    
    @Column(nullable = false)
    private String deliveryAddress;
    
    @Column(nullable = false)
    private String deliveryPhone;
    
    @Column(length = 500)
    private String deliveryNotes;
    
    @OneToMany(mappedBy = "orderHistory", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderHistoryItem> orderItems;
}
