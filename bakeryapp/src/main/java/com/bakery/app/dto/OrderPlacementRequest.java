package com.bakery.app.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class OrderPlacementRequest {
    
    @NotBlank(message = "Customer name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String customerName;
    
    @NotBlank(message = "Delivery address is required")
    @Size(min = 10, max = 500, message = "Address must be between 10 and 500 characters")
    private String deliveryAddress;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Phone number must be 10-15 digits")
    private String deliveryPhone;
    
    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String deliveryNotes;
    
    private Double latitude;
    
    private Double longitude;
    
    // Payment verification fields
    @NotBlank(message = "Payment ID is required")
    private String paymentId;
    
    @NotBlank(message = "Payment order ID is required")
    private String paymentOrderId;
    
    @NotBlank(message = "Payment signature is required")
    private String paymentSignature;
}
