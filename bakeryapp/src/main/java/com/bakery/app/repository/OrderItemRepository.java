package com.bakery.app.repository;

import com.bakery.app.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    
    @Modifying
    @Query(value = "UPDATE order_items SET item_id = NULL WHERE item_id = :itemId", nativeQuery = true)
    void nullifyItemReference(@Param("itemId") Integer itemId);
    
    @Modifying
    @Query(value = "UPDATE order_items SET item_name = :itemName WHERE item_id = :itemId AND (item_name IS NULL OR item_name = '')", nativeQuery = true)
    void updateItemNameForItem(@Param("itemId") Integer itemId, @Param("itemName") String itemName);
}
