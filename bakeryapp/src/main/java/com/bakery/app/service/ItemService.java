package com.bakery.app.service;

import com.bakery.app.dto.ItemRequest;
import com.bakery.app.entity.CartItem;
import com.bakery.app.entity.Category;
import com.bakery.app.entity.Item;
import com.bakery.app.entity.OrderItem;
import com.bakery.app.repository.CartItemRepository;
import com.bakery.app.repository.ItemRepository;
import com.bakery.app.repository.OrderItemRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {
    
    private final ItemRepository itemRepository;
    private final CategoryService categoryService;
    private final CartItemRepository cartItemRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderHistoryService orderHistoryService;
    
    @PersistenceContext
    private EntityManager entityManager;
    
    public ItemService(
            ItemRepository itemRepository,
            CategoryService categoryService,
            CartItemRepository cartItemRepository,
            OrderItemRepository orderItemRepository,
            @Lazy OrderHistoryService orderHistoryService) {
        this.itemRepository = itemRepository;
        this.categoryService = categoryService;
        this.cartItemRepository = cartItemRepository;
        this.orderItemRepository = orderItemRepository;
        this.orderHistoryService = orderHistoryService;
    }
    
    @Transactional
    public Item createItem(ItemRequest request) {
        Category category = categoryService.getCategoryById(request.getCategoryId());
        
        Item item = new Item();
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        item.setPrice(request.getPrice() != null ? request.getPrice() : 0.0);
        item.setGrams(request.getGrams() != null ? request.getGrams() : 0);
        item.setPieces(request.getPieces() != null ? request.getPieces() : 1);
        item.setImageUrl(request.getImageUrl());
        item.setCategory(category);
        item.setStock(request.getStock() != null ? request.getStock() : 0);
        item.setEggStock(request.getEggStock() != null ? request.getEggStock() : 0);
        item.setEgglessStock(request.getEgglessStock() != null ? request.getEgglessStock() : 0);
        item.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);
        item.setAvailable(request.getAvailable() != null ? request.getAvailable() : true);
        item.setPricePerKg(request.getPricePerKg()); // Set weight-based pricing for cakes
        
        return itemRepository.save(item);
    }
    
    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }
    
    public Item getItemById(Integer id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }
    
    public List<Item> getItemsByCategory(Integer categoryId) {
        return itemRepository.findByCategoryId(categoryId);
    }
    
    @Transactional
    public Item updateItem(Integer id, ItemRequest request) {
        Item item = getItemById(id);
        Category category = categoryService.getCategoryById(request.getCategoryId());
        
        item.setName(request.getName());
        item.setDescription(request.getDescription());
        if (request.getPrice() != null) item.setPrice(request.getPrice());
        if (request.getGrams() != null) item.setGrams(request.getGrams());
        if (request.getPieces() != null) item.setPieces(request.getPieces());
        item.setImageUrl(request.getImageUrl());
        item.setCategory(category);
        if (request.getStock() != null) item.setStock(request.getStock());
        if (request.getEggStock() != null) item.setEggStock(request.getEggStock());
        if (request.getEgglessStock() != null) item.setEgglessStock(request.getEgglessStock());
        if (request.getFeatured() != null) item.setFeatured(request.getFeatured());
        if (request.getAvailable() != null) item.setAvailable(request.getAvailable());
        if (request.getPricePerKg() != null) item.setPricePerKg(request.getPricePerKg()); // Update weight-based pricing
        
        return itemRepository.save(item);
    }
    
    @Transactional
    public void updateStock(Integer itemId, Integer quantity) {
        Item item = getItemById(itemId);
        item.setStock(item.getStock() - quantity);
        if (item.getStock() <= 0) {
            item.setStock(0);
            item.setAvailable(false);
        }
        itemRepository.save(item);
    }
    
    @Transactional
    public void updateStock(Integer itemId, Integer quantity, String eggType) {
        Item item = getItemById(itemId);
        
        if ("EGGLESS".equals(eggType)) {
            // Deduct from eggless stock
            item.setEgglessStock(Math.max(0, item.getEgglessStock() - quantity));
        } else {
            // Deduct from regular stock (for both null and "EGG" - they're the same)
            item.setStock(Math.max(0, item.getStock() - quantity));
        }
        
        // Check if item should be marked unavailable
        if (item.getStock() <= 0 && item.getEgglessStock() <= 0) {
            item.setAvailable(false);
        }
        
        itemRepository.save(item);
    }
    
    public List<Item> getFeaturedItems() {
        return itemRepository.findAll().stream()
                .filter(Item::getFeatured)
                .filter(Item::getAvailable)
                .collect(Collectors.toList());
    }
    
    public List<Item> searchItems(String keyword) {
        return itemRepository.findAll().stream()
                .filter(item -> item.getName().toLowerCase().contains(keyword.toLowerCase()) ||
                               (item.getDescription() != null && item.getDescription().toLowerCase().contains(keyword.toLowerCase())))
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void deleteItem(Integer id) {
        // Get item name first
        String itemName = itemRepository.findById(id)
                .map(Item::getName)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
        
        System.out.println("Attempting to delete item: " + itemName + " (ID: " + id + ")");
        
        // STEP 1: Check if item is in any ACTIVE orders (Pending/Confirmed)
        List<OrderItem> allOrderItems = orderItemRepository.findAll();
        long activeOrderCount = allOrderItems.stream()
                .filter(oi -> oi.getItem() != null && oi.getItem().getId().equals(id))
                .filter(oi -> !oi.getOrder().getStatus().equalsIgnoreCase("Delivered"))
                .count();
        
        if (activeOrderCount > 0) {
            throw new RuntimeException("Cannot delete item. It exists in " + activeOrderCount + " active order(s) (Pending/Confirmed). Please wait until all orders are delivered.");
        }
        
        // STEP 2: Check if item exists in order history (delivered orders are already moved)
        boolean inHistory = orderHistoryService.isItemInOrderHistory(id);
        if (inHistory) {
            System.out.println("Item exists in order history - history will be preserved");
        }
        
        // STEP 3: Delete all cart items referencing this item
        System.out.println("Deleting cart items for item ID: " + id);
        cartItemRepository.deleteByItemId(id);
        
        // STEP 4: Delete the item (no active orders reference it)
        System.out.println("Deleting item: " + itemName + " (ID: " + id + ")");
        itemRepository.deleteById(id);
        
        System.out.println("Item deleted successfully. Order history preserved in separate table.");
    }
}
