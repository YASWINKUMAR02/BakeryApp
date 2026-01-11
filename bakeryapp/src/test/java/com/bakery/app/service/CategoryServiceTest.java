package com.bakery.app.service;

import com.bakery.app.entity.Category;
import com.bakery.app.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category testCategory;

    @BeforeEach
    void setUp() {
        testCategory = new Category();
        testCategory.setId(1);
        testCategory.setName("Cakes");
    }

    @Test
    void getAllCategories_ShouldReturnAllCategories() {
        // Arrange
        List<Category> categories = Arrays.asList(testCategory);
        when(categoryRepository.findAll()).thenReturn(categories);

        // Act
        List<Category> result = categoryService.getAllCategories();

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Cakes", result.get(0).getName());
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void getCategoryById_WithValidId_ShouldReturnCategory() {
        // Arrange
        when(categoryRepository.findById(1)).thenReturn(Optional.of(testCategory));

        // Act
        Category result = categoryService.getCategoryById(1);

        // Assert
        assertNotNull(result);
        assertEquals("Cakes", result.getName());
        verify(categoryRepository, times(1)).findById(1);
    }

    @Test
    void getCategoryById_WithInvalidId_ShouldThrowException() {
        // Arrange
        when(categoryRepository.findById(999)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(RuntimeException.class, () -> {
            categoryService.getCategoryById(999);
        });
        verify(categoryRepository, times(1)).findById(999);
    }

    @Test
    void createCategory_WithValidData_ShouldCreateCategory() {
        // Arrange
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        // Act
        Category result = categoryService.createCategory("Cakes");

        // Assert
        assertNotNull(result);
        assertEquals("Cakes", result.getName());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void updateCategory_WithValidData_ShouldUpdateCategory() {
        // Arrange
        when(categoryRepository.findById(1)).thenReturn(Optional.of(testCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        // Act
        Category result = categoryService.updateCategory(1, "Updated Cakes");

        // Assert
        assertNotNull(result);
        verify(categoryRepository, times(1)).findById(1);
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void deleteCategory_WithValidId_ShouldDeleteCategory() {
        // Arrange
        doNothing().when(categoryRepository).deleteById(1);

        // Act
        categoryService.deleteCategory(1);

        // Assert
        verify(categoryRepository, times(1)).deleteById(1);
    }
}
