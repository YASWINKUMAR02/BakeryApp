package com.bakery.app.controller;

import com.bakery.app.dto.ApiResponse;
import com.bakery.app.entity.Coupon;
import com.bakery.app.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CouponController {
    
    private final CouponService couponService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createCoupon(@RequestBody Coupon coupon) {
        try {
            Coupon created = couponService.createCoupon(coupon);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Coupon created successfully", created));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllCoupons() {
        List<Coupon> coupons = couponService.getAllCoupons();
        return ResponseEntity.ok(new ApiResponse(true, "Coupons retrieved successfully", coupons));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getCouponById(@PathVariable Integer id) {
        try {
            Coupon coupon = couponService.getCouponById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Coupon retrieved successfully", coupon));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateCoupon(@PathVariable Integer id, @RequestBody Coupon coupon) {
        try {
            Coupon updated = couponService.updateCoupon(id, coupon);
            return ResponseEntity.ok(new ApiResponse(true, "Coupon updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteCoupon(@PathVariable Integer id) {
        try {
            couponService.deleteCoupon(id);
            return ResponseEntity.ok(new ApiResponse(true, "Coupon deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse> validateCoupon(@RequestParam String code, 
                                                       @RequestParam Double orderAmount) {
        try {
            Double discount = couponService.calculateDiscount(code, orderAmount);
            Map<String, Object> result = new HashMap<>();
            result.put("discount", discount);
            result.put("finalAmount", orderAmount - discount);
            return ResponseEntity.ok(new ApiResponse(true, "Coupon is valid", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
