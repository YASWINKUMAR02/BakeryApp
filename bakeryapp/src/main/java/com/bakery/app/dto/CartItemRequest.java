package com.bakery.app.dto;

import lombok.Data;

@Data
public class CartItemRequest {
    private Integer itemId;
    private Integer quantity;
    private String eggType;  // "EGG", "EGGLESS", or null
    private Double selectedWeight;  // For cakes: 1.0, 1.5, 2.0, 2.5, 3.0 kg
    private Double priceAtAddition;  // Store the price when item was added to cart
}
