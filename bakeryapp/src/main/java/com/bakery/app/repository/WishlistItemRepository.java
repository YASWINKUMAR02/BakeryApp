package com.bakery.app.repository;

import com.bakery.app.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, Integer> {
    void deleteByItemId(Integer itemId);
}
