package com.bakery.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailResponse {
    private Integer id;
    private LocalDateTime orderDate;
    private Double totalAmount;
    private String status;
    private String deliveryAddress;
    private String deliveryPhone;
    private String deliveryNotes;
    private String customerName;
    private List<OrderItemDetail> items;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OrderItemDetail {
        private Integer id;
        private String itemName;
        private Integer quantity;
        private Double price;
        private Boolean isEggless;
    }
}
