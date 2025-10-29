package com.bakery.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;
    
    @ManyToOne(cascade = {CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "item_id", nullable = true)
    private Item item;
    
    @Column(length = 100)
    private String itemName;  // Store item name for history
    
    @Column(nullable = false)
    private Integer quantity;
    
    @Column(nullable = false)
    private Double price;  // Price at the time of order
    
    @Column
    private String eggType;  // "EGG", "EGGLESS", or null for regular items
    
    @Column
    private Double selectedWeight;  // For cakes: 1.0, 1.5, 2.0, 2.5, 3.0 kg
}
