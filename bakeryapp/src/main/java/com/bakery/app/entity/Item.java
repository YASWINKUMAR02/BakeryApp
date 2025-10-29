package com.bakery.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Item {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(length = 1000)
    private String description;
    
    @Column(nullable = false)
    private Double price;
    
    @Column
    private Double eggPrice;  // Price for egg variant
    
    @Column
    private Double egglessPrice;  // Price for eggless variant
    
    @Column(nullable = false)
    private Boolean hasEggOption = false;  // Whether item has egg/eggless variants
    
    @Column(nullable = false)
    private Integer grams;
    
    @Column(nullable = false)
    private Integer pieces = 1;  // Number of pieces per item
    
    private String imageUrl;
    
    @Column(nullable = false)
    private Integer stock = 0;  // Available quantity
    
    @Column
    private Integer eggStock = 0;  // Stock for egg variant
    
    @Column
    private Integer egglessStock = 0;  // Stock for eggless variant
    
    @Column(nullable = false)
    private Boolean featured = false;  // Featured product flag
    
    @Column(nullable = false)
    private Boolean available = true;  // Product availability
    
    // Cake weight-based pricing (JSON stored as string)
    @Column(length = 500)
    private String pricePerKg;  // JSON: {"1": 1500, "1.5": 2000, "2": 2800, "2.5": 3500, "3": 4200}
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
    
    @JsonIgnore
    @OneToMany(mappedBy = "item", cascade = {CascadeType.REMOVE})
    private List<Review> reviews;
}
