package com.bakery.app.controller;

import com.bakery.app.dto.ApiResponse;
import com.bakery.app.dto.ReviewRequest;
import com.bakery.app.dto.ReviewResponse;
import com.bakery.app.entity.Review;
import com.bakery.app.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @PostMapping("/{itemId}")
    public ResponseEntity<ApiResponse> createReview(@PathVariable Integer itemId,
                                                    @RequestParam Integer customerId,
                                                    @RequestBody ReviewRequest request) {
        try {
            Review review = reviewService.createReview(itemId, customerId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Review created successfully", review));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/item/{itemId}")
    public ResponseEntity<ApiResponse> getReviewsByItem(@PathVariable Integer itemId) {
        List<ReviewResponse> reviews = reviewService.getReviewsByItemId(itemId);
        return ResponseEntity.ok(new ApiResponse(true, "Reviews retrieved successfully", reviews));
    }
    
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Integer reviewId) {
        try {
            reviewService.deleteReview(reviewId);
            return ResponseEntity.ok(new ApiResponse(true, "Review deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
