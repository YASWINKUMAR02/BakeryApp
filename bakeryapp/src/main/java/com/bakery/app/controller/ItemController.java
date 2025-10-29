package com.bakery.app.controller;

import com.bakery.app.dto.ApiResponse;
import com.bakery.app.dto.ItemRequest;
import com.bakery.app.entity.Item;
import com.bakery.app.service.ItemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/items")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ItemController {
    
    private final ItemService itemService;
    
    @PostMapping
    public ResponseEntity<ApiResponse> createItem(@Valid @RequestBody ItemRequest request) {
        try {
            Item item = itemService.createItem(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Item created successfully", item));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<ApiResponse> getAllItems() {
        List<Item> items = itemService.getAllItems();
        return ResponseEntity.ok(new ApiResponse(true, "Items retrieved successfully", items));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse> getItemById(@PathVariable Integer id) {
        try {
            Item item = itemService.getItemById(id);
            return ResponseEntity.ok(new ApiResponse(true, "Item retrieved successfully", item));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<ApiResponse> getItemsByCategory(@PathVariable Integer categoryId) {
        List<Item> items = itemService.getItemsByCategory(categoryId);
        return ResponseEntity.ok(new ApiResponse(true, "Items retrieved successfully", items));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateItem(@PathVariable Integer id, 
                                                  @Valid @RequestBody ItemRequest request) {
        try {
            Item item = itemService.updateItem(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Item updated successfully", item));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteItem(@PathVariable Integer id) {
        try {
            itemService.deleteItem(id);
            return ResponseEntity.ok(new ApiResponse(true, "Item deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/featured")
    public ResponseEntity<ApiResponse> getFeaturedItems() {
        List<Item> items = itemService.getFeaturedItems();
        return ResponseEntity.ok(new ApiResponse(true, "Featured items retrieved successfully", items));
    }
    
    @GetMapping("/search")
    public ResponseEntity<ApiResponse> searchItems(@RequestParam String keyword) {
        List<Item> items = itemService.searchItems(keyword);
        return ResponseEntity.ok(new ApiResponse(true, "Search results retrieved successfully", items));
    }
    
    @PatchMapping("/{id}/stock")
    public ResponseEntity<ApiResponse> updateStock(@PathVariable Integer id, 
                                                   @RequestParam Integer quantity,
                                                   @RequestParam(defaultValue = "add") String operation) {
        try {
            Item item = itemService.getItemById(id);
            int newStock;
            
            if ("add".equalsIgnoreCase(operation)) {
                newStock = item.getStock() + quantity;
            } else if ("set".equalsIgnoreCase(operation)) {
                newStock = quantity;
            } else if ("subtract".equalsIgnoreCase(operation)) {
                newStock = item.getStock() - quantity;
            } else {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Invalid operation. Use 'add', 'set', or 'subtract'"));
            }
            
            if (newStock < 0) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse(false, "Stock cannot be negative"));
            }
            
            ItemRequest request = convertItemToRequest(item);
            request.setStock(newStock);
            request.setAvailable(newStock > 0);
            
            Item updatedItem = itemService.updateItem(id, request);
            return ResponseEntity.ok(new ApiResponse(true, "Stock updated successfully", updatedItem));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/low-stock")
    public ResponseEntity<ApiResponse> getLowStockItems(@RequestParam(defaultValue = "10") Integer threshold) {
        try {
            List<Item> items = itemService.getAllItems().stream()
                    .filter(item -> item.getStock() <= threshold)
                    .toList();
            return ResponseEntity.ok(new ApiResponse(true, "Low stock items retrieved successfully", items));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @GetMapping("/out-of-stock")
    public ResponseEntity<ApiResponse> getOutOfStockItems() {
        try {
            List<Item> items = itemService.getAllItems().stream()
                    .filter(item -> item.getStock() == 0)
                    .toList();
            return ResponseEntity.ok(new ApiResponse(true, "Out of stock items retrieved successfully", items));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    private ItemRequest convertItemToRequest(Item item) {
        ItemRequest request = new ItemRequest();
        request.setName(item.getName());
        request.setDescription(item.getDescription());
        request.setPrice(item.getPrice());
        request.setGrams(item.getGrams());
        request.setImageUrl(item.getImageUrl());
        request.setCategoryId(item.getCategory().getId());
        request.setStock(item.getStock());
        request.setFeatured(item.getFeatured());
        request.setAvailable(item.getAvailable());
        return request;
    }
}
