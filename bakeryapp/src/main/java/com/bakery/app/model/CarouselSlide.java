package com.bakery.app.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "carousel_slides")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CarouselSlide {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false)
    private String subtitle;
    
    private String description;
    
    @Column(nullable = false)
    private String imageUrl;
    
    @Column(nullable = false)
    private String buttonText;
    
    // Type can be: CATEGORY, ITEM, or CUSTOM_URL
    @Column(nullable = false)
    private String linkType;
    
    // Stores category ID, item ID, or custom URL based on linkType
    private String linkValue;
    
    @Column(nullable = false)
    private Integer displayOrder = 0;
    
    @Column(nullable = false)
    private Boolean active = true;
}
