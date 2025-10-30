package com.bakery.app.repository;

import com.bakery.app.model.CarouselSlide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarouselSlideRepository extends JpaRepository<CarouselSlide, Long> {
    List<CarouselSlide> findByActiveTrueOrderByDisplayOrderAsc();
    List<CarouselSlide> findAllByOrderByDisplayOrderAsc();
}
