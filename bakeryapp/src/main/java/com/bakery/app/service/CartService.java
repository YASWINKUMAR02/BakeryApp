package com.bakery.app.service;

import com.bakery.app.dto.CartItemRequest;
import com.bakery.app.entity.Cart;
import com.bakery.app.entity.CartItem;
import com.bakery.app.entity.Item;
import com.bakery.app.repository.CartItemRepository;
import com.bakery.app.repository.CartRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {
    
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ItemService itemService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Transactional(readOnly = true)
    public Cart getCartByCustomerId(Integer customerId) {
        // Use JOIN FETCH query to get fresh data from database
        Cart cart = cartRepository.findByCustomerIdWithItems(customerId)
                .orElseThrow(() -> new RuntimeException("Cart not found for customer: " + customerId));
        System.out.println("Fetched cart with " + cart.getItems().size() + " items for customer: " + customerId);
        return cart;
    }
    
    @Transactional
    public Cart addItemToCart(Integer customerId, CartItemRequest request) {
        Cart cart = getCartByCustomerId(customerId);
        Item item = itemService.getItemById(request.getItemId());
        
        // Check if item is available
        if (!item.getAvailable()) {
            throw new RuntimeException("Item '" + item.getName() + "' is currently unavailable");
        }
        
        // Check if item already exists in cart with same egg type and weight (for cakes)
        Optional<CartItem> existingCartItem = cart.getItems().stream()
                .filter(ci -> ci.getItem().getId().equals(item.getId()) && 
                        ((ci.getEggType() == null && request.getEggType() == null) ||
                         (ci.getEggType() != null && ci.getEggType().equals(request.getEggType()))) &&
                        ((ci.getSelectedWeight() == null && request.getSelectedWeight() == null) ||
                         (ci.getSelectedWeight() != null && ci.getSelectedWeight().equals(request.getSelectedWeight()))))
                .findFirst();
        
        int newQuantity = request.getQuantity();
        if (existingCartItem.isPresent()) {
            newQuantity += existingCartItem.get().getQuantity();
        }
        
        // Validate stock availability based on egg type
        int availableStock;
        String stockType;
        if ("EGGLESS".equals(request.getEggType())) {
            availableStock = item.getEgglessStock();
            stockType = "Eggless variant";
        } else {
            // Use regular stock for both null and "EGG" - they're the same
            availableStock = item.getStock();
            stockType = "Regular/Egg";
        }
        
        if (availableStock < newQuantity) {
            throw new RuntimeException("Insufficient stock for " + stockType + " of item: " + item.getName() + 
                                     ". Available: " + availableStock + 
                                     ", Requested: " + newQuantity);
        }
        
        if (existingCartItem.isPresent()) {
            // Update quantity
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(newQuantity);
            // Update price if provided (for cakes with weight pricing)
            if (request.getPriceAtAddition() != null) {
                cartItem.setPriceAtAddition(request.getPriceAtAddition());
            }
            cartItemRepository.save(cartItem);
        } else {
            // Add new item
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setItem(item);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setEggType(request.getEggType());
            cartItem.setSelectedWeight(request.getSelectedWeight());  // Store selected weight for cakes
            cartItem.setPriceAtAddition(request.getPriceAtAddition());  // Store price at time of addition
            cartItemRepository.save(cartItem);
        }
        
        return getCartByCustomerId(customerId);
    }
    
    @Transactional
    public Cart updateCartItem(Integer cartItemId, Integer quantity) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        
        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            // Validate stock availability
            Item item = cartItem.getItem();
            if (item.getStock() < quantity) {
                throw new RuntimeException("Insufficient stock for item: " + item.getName() + 
                                         ". Available: " + item.getStock() + 
                                         ", Requested: " + quantity);
            }
            
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
        
        return cartRepository.findById(cartItem.getCart().getId())
                .orElseThrow(() -> new RuntimeException("Cart not found"));
    }
    
    @Transactional
    public void removeCartItem(Integer cartItemId) {
        System.out.println("Attempting to remove cart item with ID: " + cartItemId);
        
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found with id: " + cartItemId));
        
        Integer cartId = cartItem.getCart().getId();
        System.out.println("Found cart item in cart: " + cartId);
        
        // Remove the item from the cart's collection first
        Cart cart = cartItem.getCart();
        cart.getItems().remove(cartItem);
        
        // Delete the cart item
        cartItemRepository.delete(cartItem);
        
        // Flush to database
        entityManager.flush();
        
        System.out.println("Cart item " + cartItemId + " deleted successfully");
    }
    
    @Transactional
    public void clearCart(Integer customerId) {
        Cart cart = getCartByCustomerId(customerId);
        cart.getItems().clear();
        cartRepository.save(cart);
    }
}
