package com.bakery.app.controller;

import com.bakery.app.dto.ApiResponse;
import com.bakery.app.entity.OrderHistory;
import com.bakery.app.service.OrderHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-history")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderHistoryController {
    
    private final OrderHistoryService orderHistoryService;
    
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<?> getCustomerOrderHistory(@PathVariable Integer customerId) {
        try {
            List<OrderHistory> history = orderHistoryService.getOrderHistoryByCustomerId(customerId);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to fetch order history: " + e.getMessage(), null));
        }
    }
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllOrderHistory() {
        try {
            List<OrderHistory> history = orderHistoryService.getAllOrderHistory();
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to fetch order history: " + e.getMessage(), null));
        }
    }
    
    @PostMapping("/migrate-delivered")
    public ResponseEntity<?> migrateDeliveredOrders() {
        try {
            orderHistoryService.moveAllDeliveredOrdersToHistory();
            return ResponseEntity.ok(new ApiResponse(true, "All delivered orders moved to history", null));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to migrate orders: " + e.getMessage(), null));
        }
    }
}
