package com.bakery.app.repository;

import com.bakery.app.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Integer> {
    Optional<CartItem> findByCartIdAndItemId(Integer cartId, Integer itemId);
    
    @Modifying
    @Query(value = "DELETE FROM cart_items WHERE item_id = :itemId", nativeQuery = true)
    void deleteByItemId(@Param("itemId") Integer itemId);
}
