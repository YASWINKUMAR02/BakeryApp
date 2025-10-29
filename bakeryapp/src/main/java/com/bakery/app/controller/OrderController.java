package com.bakery.app.controller;

import com.bakery.app.dto.ApiResponse;
import com.bakery.app.dto.OrderPlacementRequest;
import com.bakery.app.dto.OrderStatusRequest;
import com.bakery.app.entity.Order;
import jakarta.validation.Valid;
import com.bakery.app.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {
    
    private final OrderService orderService;
    
    @PostMapping("/place/{customerId}")
    public ResponseEntity<ApiResponse> placeOrder(@PathVariable Integer customerId,
                                                  @Valid @RequestBody OrderPlacementRequest request) {
        try {
            Order order = orderService.placeOrder(customerId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Order placed successfully", order));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{customerId}")
    public ResponseEntity<ApiResponse> getCustomerOrders(@PathVariable Integer customerId) {
        List<Order> orders = orderService.getOrdersByCustomerId(customerId);
        return ResponseEntity.ok(new ApiResponse(true, "Orders retrieved successfully", orders));
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return ResponseEntity.ok(new ApiResponse(true, "All orders retrieved successfully", orders));
    }
    
    @GetMapping("/detail/{orderId}")
    public ResponseEntity<ApiResponse> getOrderById(@PathVariable Integer orderId) {
        try {
            com.bakery.app.dto.OrderDetailResponse orderDetails = orderService.getOrderDetailsById(orderId);
            return ResponseEntity.ok(new ApiResponse(true, "Order retrieved successfully", orderDetails));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/status/{orderId}")
    public ResponseEntity<ApiResponse> updateOrderStatus(@PathVariable Integer orderId,
                                                         @RequestBody OrderStatusRequest request) {
        try {
            Order order = orderService.updateOrderStatus(orderId, request.getStatus());
            
            String message = "Order status updated successfully";
            if ("Delivered".equalsIgnoreCase(request.getStatus())) {
                message = "Order marked as delivered and moved to order history";
            }
            
            return ResponseEntity.ok(new ApiResponse(true, message, order));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, "Failed to update order status: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/cancel/{orderId}")
    public ResponseEntity<ApiResponse> cancelOrder(@PathVariable Integer orderId,
                                                    @RequestParam Integer customerId) {
        try {
            orderService.cancelOrder(orderId, customerId);
            return ResponseEntity.ok(new ApiResponse(true, "Order cancelled successfully"));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/address/{orderId}")
    public ResponseEntity<ApiResponse> updateOrderAddress(@PathVariable Integer orderId,
                                                          @RequestParam Integer customerId,
                                                          @Valid @RequestBody com.bakery.app.dto.OrderAddressUpdateRequest request) {
        try {
            Order order = orderService.updateOrderAddress(orderId, customerId, request);
            return ResponseEntity.ok(new ApiResponse(true, "Delivery address updated successfully. Admin has been notified.", order));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
