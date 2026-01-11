package com.bakery.app.service;

import com.bakery.app.dto.ItemRequest;
import com.bakery.app.entity.Category;
import com.bakery.app.entity.Item;
import com.bakery.app.entity.OrderItem;
import com.bakery.app.repository.CartItemRepository;
import com.bakery.app.repository.ItemRepository;
import com.bakery.app.repository.OrderItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ItemServiceTest {

    @Mock
    private ItemRepository itemRepository;

    @Mock
    private CategoryService categoryService;

    @Mock
    private CartItemRepository cartItemRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private OrderHistoryService orderHistoryService;

    private ItemService itemService;

    private Item testItem;
    private Category testCategory;
    private ItemRequest testItemRequest;

    @BeforeEach
    void setUp() {
        itemService = new ItemService(
            itemRepository,
            categoryService,
            cartItemRepository,
            orderItemRepository,
            orderHistoryService
        );

        testCategory = new Category();
        testCategory.setId(1);
        testCategory.setName("Cakes");

        testItem = new Item();
        testItem.setId(1);
        testItem.setName("Chocolate Cake");
        testItem.setDescription("Delicious chocolate cake");
        testItem.setPrice(500.0);
        testItem.setGrams(1000);
        testItem.setPieces(1);
        testItem.setCategory(testCategory);
        testItem.setImageUrl("chocolate-cake.jpg");
        testItem.setFeatured(true);
        testItem.setAvailable(true);
        testItem.setStock(10);
        testItem.setEggStock(5);
        testItem.setEgglessStock(5);

        testItemRequest = new ItemRequest();
        testItemRequest.setName("Chocolate Cake");
        testItemRequest.setDescription("Delicious chocolate cake");
        testItemRequest.setPrice(500.0);
        testItemRequest.setGrams(1000);
        testItemRequest.setPieces(1);
        testItemRequest.setCategoryId(1);
        testItemRequest.setImageUrl("chocolate-cake.jpg");
        testItemRequest.setFeatured(true);
        testItemRequest.setAvailable(true);
        testItemRequest.setStock(10);
    }

    @Test
    void getAllItems_ShouldReturnAllItems() {
        // Arrange
        List<Item> items = Arrays.asList(testItem);
        when(itemRepository.findAll()).thenReturn(items);

        // Act
        List<Item> result = itemService.getAllItems();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Chocolate Cake", result.get(0).getName());
        verify(itemRepository, times(1)).findAll();
    }

    @Test
    void getItemById_WithValidId_ShouldReturnItem() {
        // Arrange
        when(itemRepository.findById(1)).thenReturn(Optional.of(testItem));

        // Act
        Item result = itemService.getItemById(1);

        // Assert
        assertNotNull(result);
        assertEquals("Chocolate Cake", result.getName());
        assertEquals(500.0, result.getPrice());
        verify(itemRepository, times(1)).findById(1);
    }

    @Test
    void getItemById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(itemRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            itemService.getItemById(999);
        });
        verify(itemRepository, times(1)).findById(999);
    }

    @Test
    void createItem_WithValidData_ShouldCreateItem() {
        // Arrange
        when(categoryService.getCategoryById(1)).thenReturn(testCategory);
        when(itemRepository.save(any(Item.class))).thenReturn(testItem);

        // Act
        Item result = itemService.createItem(testItemRequest);

        // Assert
        assertNotNull(result);
        assertEquals("Chocolate Cake", result.getName());
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    void updateItem_WithValidData_ShouldUpdateItem() {
        // Arrange
        ItemRequest updatedRequest = new ItemRequest();
        updatedRequest.setName("Updated Cake");
        updatedRequest.setPrice(600.0);
        updatedRequest.setCategoryId(1);
        updatedRequest.setGrams(1000);

        when(itemRepository.findById(1)).thenReturn(Optional.of(testItem));
        when(categoryService.getCategoryById(1)).thenReturn(testCategory);
        when(itemRepository.save(any(Item.class))).thenReturn(testItem);

        // Act
        Item result = itemService.updateItem(1, updatedRequest);

        // Assert
        assertNotNull(result);
        verify(itemRepository, times(1)).findById(1);
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    void deleteItem_WithValidId_ShouldDeleteItem() {
        // Arrange
        when(itemRepository.findById(1)).thenReturn(Optional.of(testItem));
        when(orderItemRepository.findAll()).thenReturn(Collections.emptyList());
        when(orderHistoryService.isItemInOrderHistory(1)).thenReturn(false);
        doNothing().when(cartItemRepository).deleteByItemId(1);
        doNothing().when(itemRepository).deleteById(1);

        // Act
        itemService.deleteItem(1);

        // Assert
        verify(itemRepository, times(1)).findById(1);
        verify(itemRepository, times(1)).deleteById(1);
    }

    @Test
    void getItemsByCategory_ShouldReturnItemsInCategory() {
        // Arrange
        List<Item> items = Arrays.asList(testItem);
        when(itemRepository.findByCategoryId(1)).thenReturn(items);

        // Act
        List<Item> result = itemService.getItemsByCategory(1);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(itemRepository, times(1)).findByCategoryId(1);
    }

    @Test
    void getFeaturedItems_ShouldReturnOnlyFeaturedItems() {
        // Arrange
        List<Item> items = Arrays.asList(testItem);
        when(itemRepository.findAll()).thenReturn(items);

        // Act
        List<Item> result = itemService.getFeaturedItems();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getFeatured());
        assertTrue(result.get(0).getAvailable());
        verify(itemRepository, times(1)).findAll();
    }

    @Test
    void searchItems_WithKeyword_ShouldReturnMatchingItems() {
        // Arrange
        List<Item> items = Arrays.asList(testItem);
        when(itemRepository.findAll()).thenReturn(items);

        // Act
        List<Item> result = itemService.searchItems("chocolate");

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertTrue(result.get(0).getName().toLowerCase().contains("chocolate"));
        verify(itemRepository, times(1)).findAll();
    }

    @Test
    void updateStock_WithValidQuantity_ShouldUpdateStock() {
        // Arrange
        when(itemRepository.findById(1)).thenReturn(Optional.of(testItem));
        when(itemRepository.save(any(Item.class))).thenReturn(testItem);

        // Act
        itemService.updateStock(1, 5);

        // Assert
        verify(itemRepository, times(1)).findById(1);
        verify(itemRepository, times(1)).save(any(Item.class));
    }

    @Test
    void updateStock_WithEggType_ShouldUpdateCorrectStock() {
        // Arrange
        when(itemRepository.findById(1)).thenReturn(Optional.of(testItem));
        when(itemRepository.save(any(Item.class))).thenReturn(testItem);

        // Act
        itemService.updateStock(1, 2, "EGGLESS");

        // Assert
        verify(itemRepository, times(1)).findById(1);
        verify(itemRepository, times(1)).save(any(Item.class));
    }
}
