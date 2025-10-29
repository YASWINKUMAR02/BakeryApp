package com.bakery.app.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ItemRequest {
    
    @NotBlank(message = "Item name is required")
    @Size(min = 2, max = 100, message = "Item name must be between 2 and 100 characters")
    private String name;
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;
    
    // Price is optional for cakes (they use pricePerKg)
    @DecimalMin(value = "0.0", message = "Price must be greater than or equal to 0")
    @DecimalMax(value = "100000.00", message = "Price must not exceed ₹100,000")
    private Double price;
    
    // Weight is optional for cakes (customer selects weight)
    @Min(value = 0, message = "Weight must be at least 0 grams")
    @Max(value = 50000, message = "Weight must not exceed 50kg (50000 grams)")
    private Integer grams;
    
    // Pieces is optional for cakes
    @Min(value = 1, message = "Pieces must be at least 1")
    @Max(value = 100, message = "Pieces must not exceed 100")
    private Integer pieces;
    
    // Weight-based pricing for cakes (JSON string)
    @Size(max = 500, message = "Price per kg data must not exceed 500 characters")
    private String pricePerKg;
    
    @Pattern(regexp = "^(https?://.*|)$", message = "Image URL must be a valid HTTP/HTTPS URL or empty")
    private String imageUrl;
    
    @NotNull(message = "Category is required")
    private Integer categoryId;
    
    @Min(value = 0, message = "Stock cannot be negative")
    private Integer stock;
    
    @Min(value = 0, message = "Egg stock cannot be negative")
    private Integer eggStock;
    
    @Min(value = 0, message = "Eggless stock cannot be negative")
    private Integer egglessStock;
    
    private Boolean featured;
    
    private Boolean available;
}
