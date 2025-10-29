package com.bakery.app.controller;

import com.bakery.app.dto.ApiResponse;
import com.bakery.app.entity.Wishlist;
import com.bakery.app.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WishlistController {
    
    private final WishlistService wishlistService;
    
    @GetMapping("/{customerId}")
    public ResponseEntity<ApiResponse> getWishlist(@PathVariable Integer customerId) {
        try {
            Wishlist wishlist = wishlistService.getWishlist(customerId);
            return ResponseEntity.ok(new ApiResponse(true, "Wishlist retrieved successfully", wishlist));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addToWishlist(@RequestParam Integer customerId, 
                                                      @RequestParam Integer itemId) {
        try {
            Wishlist wishlist = wishlistService.addToWishlist(customerId, itemId);
            return ResponseEntity.ok(new ApiResponse(true, "Item added to wishlist", wishlist));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/remove/{customerId}/{itemId}")
    public ResponseEntity<ApiResponse> removeFromWishlist(@PathVariable Integer customerId,
                                                           @PathVariable Integer itemId) {
        try {
            wishlistService.removeFromWishlist(customerId, itemId);
            return ResponseEntity.ok(new ApiResponse(true, "Item removed from wishlist"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/clear/{customerId}")
    public ResponseEntity<ApiResponse> clearWishlist(@PathVariable Integer customerId) {
        try {
            wishlistService.clearWishlist(customerId);
            return ResponseEntity.ok(new ApiResponse(true, "Wishlist cleared"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
