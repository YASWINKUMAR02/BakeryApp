package com.bakery.app.controller;

import com.bakery.app.entity.Category;
import com.bakery.app.entity.Item;
import com.bakery.app.service.ItemService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class ItemControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ItemService itemService;

    private Item testItem;
    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setId(1);
        testCategory.setName("Cakes");

        testItem = new Item();
        testItem.setId(1);
        testItem.setName("Chocolate Cake");
        testItem.setDescription("Delicious chocolate cake");
        testItem.setPrice(500.0);
        testItem.setGrams(1000);
        testItem.setCategory(testCategory);
        testItem.setFeatured(true);
        testItem.setAvailable(true);
        testItem.setStock(10);
    }

    @Test
    void getAllItems_ShouldReturnItemsList() throws Exception {
        // Arrange
        List<Item> items = Arrays.asList(testItem);
        when(itemService.getAllItems()).thenReturn(items);

        // Act & Assert
        mockMvc.perform(get("/api/items")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].name").value("Chocolate Cake"))
                .andExpect(jsonPath("$.data[0].price").value(500.0));
    }

    @Test
    void getItemById_WithValidId_ShouldReturnItem() throws Exception {
        // Arrange
        when(itemService.getItemById(1)).thenReturn(testItem);

        // Act & Assert
        mockMvc.perform(get("/api/items/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.name").value("Chocolate Cake"))
                .andExpect(jsonPath("$.data.price").value(500.0));
    }

    @Test
    void getItemById_WithInvalidId_ShouldReturn404() throws Exception {
        // Arrange
        when(itemService.getItemById(999)).thenThrow(new RuntimeException("Item not found"));

        // Act & Assert
        mockMvc.perform(get("/api/items/999")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    void getFeaturedItems_ShouldReturnFeaturedItems() throws Exception {
        // Arrange
        List<Item> items = Arrays.asList(testItem);
        when(itemService.getFeaturedItems()).thenReturn(items);

        // Act & Assert
        mockMvc.perform(get("/api/items/featured")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].featured").value(true));
    }

    @Test
    void getItemsByCategory_ShouldReturnItemsInCategory() throws Exception {
        // Arrange
        List<Item> items = Arrays.asList(testItem);
        when(itemService.getItemsByCategory(1)).thenReturn(items);

        // Act & Assert
        mockMvc.perform(get("/api/items/category/1")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].category.id").value(1));
    }
}
