package com.bakery.app.service;

import com.bakery.app.dto.ReviewRequest;
import com.bakery.app.dto.ReviewResponse;
import com.bakery.app.entity.Customer;
import com.bakery.app.entity.Item;
import com.bakery.app.entity.Review;
import com.bakery.app.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final ItemService itemService;
    private final CustomerService customerService;
    
    public Review createReview(Integer itemId, Integer customerId, ReviewRequest request) {
        Item item = itemService.getItemById(itemId);
        Customer customer = customerService.getCustomerById(customerId);
        
        Review review = new Review();
        review.setItem(item);
        review.setCustomer(customer);
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setReviewDate(LocalDateTime.now());
        
        return reviewRepository.save(review);
    }
    
    public List<ReviewResponse> getReviewsByItemId(Integer itemId) {
        List<Review> reviews = reviewRepository.findByItemId(itemId);
        return reviews.stream()
                .map(review -> new ReviewResponse(
                        review.getId(),
                        review.getRating(),
                        review.getComment(),
                        review.getReviewDate(),
                        review.getCustomer().getName(),
                        review.getCustomer().getId()
                ))
                .collect(Collectors.toList());
    }
    
    public void deleteReview(Integer reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
