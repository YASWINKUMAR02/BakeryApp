package com.bakery.app.controller;

import com.bakery.app.model.CarouselSlide;
import com.bakery.app.service.CarouselSlideService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/carousel")
@CrossOrigin(origins = "*")
public class CarouselSlideController {
    
    @Autowired
    private CarouselSlideService carouselSlideService;
    
    // Get all slides (admin)
    @GetMapping("/all")
    public ResponseEntity<Map<String, Object>> getAllSlides() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<CarouselSlide> slides = carouselSlideService.getAllSlides();
            response.put("success", true);
            response.put("data", slides);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Get active slides (public)
    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveSlides() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<CarouselSlide> slides = carouselSlideService.getActiveSlides();
            response.put("success", true);
            response.put("data", slides);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Get slide by ID
    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getSlideById(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            CarouselSlide slide = carouselSlideService.getSlideById(id)
                    .orElseThrow(() -> new RuntimeException("Carousel slide not found"));
            response.put("success", true);
            response.put("data", slide);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Create new slide
    @PostMapping
    public ResponseEntity<Map<String, Object>> createSlide(@RequestBody CarouselSlide slide) {
        Map<String, Object> response = new HashMap<>();
        try {
            CarouselSlide createdSlide = carouselSlideService.createSlide(slide);
            response.put("success", true);
            response.put("data", createdSlide);
            response.put("message", "Carousel slide created successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Update slide
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateSlide(@PathVariable Long id, @RequestBody CarouselSlide slide) {
        Map<String, Object> response = new HashMap<>();
        try {
            CarouselSlide updatedSlide = carouselSlideService.updateSlide(id, slide);
            response.put("success", true);
            response.put("data", updatedSlide);
            response.put("message", "Carousel slide updated successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Delete slide
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteSlide(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        try {
            carouselSlideService.deleteSlide(id);
            response.put("success", true);
            response.put("message", "Carousel slide deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}
