package com.bakery.app.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderAddressUpdateRequest {
    
    @NotBlank(message = "Delivery address is required")
    private String deliveryAddress;
    
    @NotBlank(message = "Delivery phone is required")
    private String deliveryPhone;
    
    private String deliveryNotes;
    
    private Double latitude;
    
    private Double longitude;
}
