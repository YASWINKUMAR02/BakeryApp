package com.bakery.app.controller;

import com.bakery.app.dto.ApiResponse;
import com.bakery.app.dto.CartItemRequest;
import com.bakery.app.entity.Cart;
import com.bakery.app.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {
    
    private final CartService cartService;
    
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addItemToCart(@RequestParam Integer customerId,
                                                     @RequestBody CartItemRequest request) {
        try {
            Cart cart = cartService.addItemToCart(customerId, request);
            return ResponseEntity.ok(new ApiResponse(true, "Item added to cart successfully", cart));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/{customerId}")
    public ResponseEntity<ApiResponse> getCart(@PathVariable Integer customerId) {
        try {
            System.out.println("GET request for cart of customer: " + customerId);
            Cart cart = cartService.getCartByCustomerId(customerId);
            System.out.println("Returning cart with " + cart.getItems().size() + " items");
            return ResponseEntity.ok(new ApiResponse(true, "Cart retrieved successfully", cart));
        } catch (Exception e) {
            System.err.println("Error getting cart: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/update/{cartItemId}")
    public ResponseEntity<ApiResponse> updateCartItem(@PathVariable Integer cartItemId,
                                                      @RequestParam Integer quantity) {
        try {
            Cart cart = cartService.updateCartItem(cartItemId, quantity);
            return ResponseEntity.ok(new ApiResponse(true, "Cart item updated successfully", cart));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove/{cartItemId}")
    public ResponseEntity<ApiResponse> removeCartItem(@PathVariable Integer cartItemId) {
        try {
            System.out.println("Attempting to remove cart item with ID: " + cartItemId);
            cartService.removeCartItem(cartItemId);
            System.out.println("Successfully removed cart item with ID: " + cartItemId);
            return ResponseEntity.ok(new ApiResponse(true, "Cart item removed successfully"));
        } catch (Exception e) {
            System.err.println("Error removing cart item: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
