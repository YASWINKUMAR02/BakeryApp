package com.bakery.app.service;

import com.bakery.app.entity.Coupon;
import com.bakery.app.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponService {
    
    private final CouponRepository couponRepository;
    
    @Transactional
    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }
    
    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }
    
    public Coupon getCouponById(Integer id) {
        return couponRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Coupon not found"));
    }
    
    @Transactional
    public Coupon updateCoupon(Integer id, Coupon couponData) {
        Coupon coupon = getCouponById(id);
        coupon.setCode(couponData.getCode());
        coupon.setDescription(couponData.getDescription());
        coupon.setDiscountType(couponData.getDiscountType());
        coupon.setDiscountValue(couponData.getDiscountValue());
        coupon.setMinOrderAmount(couponData.getMinOrderAmount());
        coupon.setMaxDiscountAmount(couponData.getMaxDiscountAmount());
        coupon.setValidFrom(couponData.getValidFrom());
        coupon.setValidUntil(couponData.getValidUntil());
        coupon.setActive(couponData.getActive());
        coupon.setUsageLimit(couponData.getUsageLimit());
        return couponRepository.save(coupon);
    }
    
    @Transactional
    public void deleteCoupon(Integer id) {
        couponRepository.deleteById(id);
    }
    
    @Transactional
    public Double applyCoupon(String code, Double orderAmount) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));
        
        // Validate coupon
        if (!coupon.getActive()) {
            throw new RuntimeException("Coupon is not active");
        }
        
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidUntil())) {
            throw new RuntimeException("Coupon has expired or not yet valid");
        }
        
        if (orderAmount < coupon.getMinOrderAmount()) {
            throw new RuntimeException("Order amount must be at least ₹" + coupon.getMinOrderAmount());
        }
        
        if (coupon.getUsageLimit() > 0 && coupon.getUsageCount() >= coupon.getUsageLimit()) {
            throw new RuntimeException("Coupon usage limit reached");
        }
        
        // Calculate discount
        double discount = 0.0;
        if ("PERCENTAGE".equals(coupon.getDiscountType())) {
            discount = (orderAmount * coupon.getDiscountValue()) / 100;
            if (discount > coupon.getMaxDiscountAmount()) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else if ("FIXED".equals(coupon.getDiscountType())) {
            discount = coupon.getDiscountValue();
        }
        
        // Update usage count
        coupon.setUsageCount(coupon.getUsageCount() + 1);
        couponRepository.save(coupon);
        
        return discount;
    }
    
    public Double calculateDiscount(String code, Double orderAmount) {
        Coupon coupon = couponRepository.findByCode(code)
                .orElseThrow(() -> new RuntimeException("Invalid coupon code"));
        
        // Validate without updating usage
        if (!coupon.getActive()) {
            throw new RuntimeException("Coupon is not active");
        }
        
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(coupon.getValidFrom()) || now.isAfter(coupon.getValidUntil())) {
            throw new RuntimeException("Coupon has expired");
        }
        
        if (orderAmount < coupon.getMinOrderAmount()) {
            throw new RuntimeException("Minimum order amount: ₹" + coupon.getMinOrderAmount());
        }
        
        // Calculate discount
        double discount = 0.0;
        if ("PERCENTAGE".equals(coupon.getDiscountType())) {
            discount = (orderAmount * coupon.getDiscountValue()) / 100;
            if (discount > coupon.getMaxDiscountAmount()) {
                discount = coupon.getMaxDiscountAmount();
            }
        } else if ("FIXED".equals(coupon.getDiscountType())) {
            discount = coupon.getDiscountValue();
        }
        
        return discount;
    }
}
