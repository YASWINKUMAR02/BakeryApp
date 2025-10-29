package com.bakery.app.repository;

import com.bakery.app.entity.OrderHistoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderHistoryItemRepository extends JpaRepository<OrderHistoryItem, Integer> {
    
    @Query("SELECT COUNT(ohi) FROM OrderHistoryItem ohi WHERE ohi.itemId = :itemId")
    long countByItemId(@Param("itemId") Integer itemId);
}
