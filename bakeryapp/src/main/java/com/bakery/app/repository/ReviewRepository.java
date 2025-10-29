package com.bakery.app.repository;

import com.bakery.app.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByItemId(Integer itemId);
    List<Review> findByCustomerId(Integer customerId);
}
