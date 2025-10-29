package com.bakery.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_history_items")
@Data
@NoArgsConstructor
public class OrderHistoryItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_history_id", nullable = false)
    private OrderHistory orderHistory;
    
    @Column(nullable = false)
    private Integer itemId;  // Store item ID for reference
    
    @Column(nullable = false, length = 100)
    private String itemName;
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private Double price;
    
    @Column
    private String eggType;  // "EGG", "EGGLESS", or null for regular items
    
    @Column
    private Double selectedWeight;  // For cakes: 1.0, 1.5, 2.0, 2.5, 3.0 kg
}
