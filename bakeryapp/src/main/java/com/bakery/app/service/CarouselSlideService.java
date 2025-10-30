package com.bakery.app.service;

import com.bakery.app.model.CarouselSlide;
import com.bakery.app.repository.CarouselSlideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CarouselSlideService {
    
    @Autowired
    private CarouselSlideRepository carouselSlideRepository;
    
    public List<CarouselSlide> getAllSlides() {
        return carouselSlideRepository.findAllByOrderByDisplayOrderAsc();
    }
    
    public List<CarouselSlide> getActiveSlides() {
        return carouselSlideRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }
    
    public Optional<CarouselSlide> getSlideById(Long id) {
        return carouselSlideRepository.findById(id);
    }
    
    public CarouselSlide createSlide(CarouselSlide slide) {
        return carouselSlideRepository.save(slide);
    }
    
    public CarouselSlide updateSlide(Long id, CarouselSlide slideDetails) {
        CarouselSlide slide = carouselSlideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Carousel slide not found"));
        
        slide.setTitle(slideDetails.getTitle());
        slide.setSubtitle(slideDetails.getSubtitle());
        slide.setDescription(slideDetails.getDescription());
        slide.setImageUrl(slideDetails.getImageUrl());
        slide.setButtonText(slideDetails.getButtonText());
        slide.setLinkType(slideDetails.getLinkType());
        slide.setLinkValue(slideDetails.getLinkValue());
        slide.setDisplayOrder(slideDetails.getDisplayOrder());
        slide.setActive(slideDetails.getActive());
        
        return carouselSlideRepository.save(slide);
    }
    
    public void deleteSlide(Long id) {
        carouselSlideRepository.deleteById(id);
    }
}
