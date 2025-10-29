package com.bakery.app.service;

import com.bakery.app.entity.Customer;
import com.bakery.app.entity.Item;
import com.bakery.app.entity.Wishlist;
import com.bakery.app.entity.WishlistItem;
import com.bakery.app.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WishlistService {
    
    private final WishlistRepository wishlistRepository;
    private final CustomerService customerService;
    private final ItemService itemService;
    
    @Transactional
    public Wishlist getOrCreateWishlist(Integer customerId) {
        return wishlistRepository.findByCustomerId(customerId)
                .orElseGet(() -> {
                    Customer customer = customerService.getCustomerById(customerId);
                    Wishlist wishlist = new Wishlist();
                    wishlist.setCustomer(customer);
                    return wishlistRepository.save(wishlist);
                });
    }
    
    @Transactional
    public Wishlist addToWishlist(Integer customerId, Integer itemId) {
        Wishlist wishlist = getOrCreateWishlist(customerId);
        Item item = itemService.getItemById(itemId);
        
        // Check if item already in wishlist
        boolean exists = wishlist.getItems().stream()
                .anyMatch(wi -> wi.getItem().getId().equals(itemId));
        
        if (exists) {
            throw new RuntimeException("Item already in wishlist");
        }
        
        WishlistItem wishlistItem = new WishlistItem();
        wishlistItem.setWishlist(wishlist);
        wishlistItem.setItem(item);
        
        wishlist.getItems().add(wishlistItem);
        return wishlistRepository.save(wishlist);
    }
    
    @Transactional
    public void removeFromWishlist(Integer customerId, Integer itemId) {
        Wishlist wishlist = getOrCreateWishlist(customerId);
        wishlist.getItems().removeIf(wi -> wi.getItem().getId().equals(itemId));
        wishlistRepository.save(wishlist);
    }
    
    @Transactional(readOnly = true)
    public Wishlist getWishlist(Integer customerId) {
        return getOrCreateWishlist(customerId);
    }
    
    @Transactional
    public void clearWishlist(Integer customerId) {
        Wishlist wishlist = getOrCreateWishlist(customerId);
        wishlist.getItems().clear();
        wishlistRepository.save(wishlist);
    }
}
