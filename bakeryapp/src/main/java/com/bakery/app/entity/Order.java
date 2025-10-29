package com.bakery.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
public class Order {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;
    
    @Column(nullable = false)
    private LocalDateTime orderDate;
    
    @Column(nullable = false)
    private Double totalAmount;
    
    @Column(nullable = false)
    private String status;  // Pending, Confirmed, Delivered
    
    @Column(nullable = false)
    private String deliveryAddress;
    
    @Column(nullable = false)
    private String deliveryPhone;
    
    @Column(length = 500)
    private String deliveryNotes;
    
    @Column(nullable = false)
    private String customerName;
    
    @Column
    private Double latitude;
    
    @Column
    private Double longitude;
    
    // Payment information
    @Column(name = "payment_id")
    private String paymentId;
    
    @Column(name = "payment_order_id")
    private String paymentOrderId;
    
    @Column(name = "payment_signature")
    private String paymentSignature;
    
    @Column(name = "payment_verified")
    private Boolean paymentVerified = false;
    
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderItem> orderItems;
}
