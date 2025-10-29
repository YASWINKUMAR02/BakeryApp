package com.bakery.app.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Integer id;
    private Integer rating;
    private String comment;
    private LocalDateTime reviewDate;
    private String customerName;
    private Integer customerId;
}
