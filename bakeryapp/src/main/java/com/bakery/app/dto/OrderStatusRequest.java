package com.bakery.app.dto;

import lombok.Data;

@Data
public class OrderStatusRequest {
    private String status;  // Pending, Confirmed, Delivered
}
