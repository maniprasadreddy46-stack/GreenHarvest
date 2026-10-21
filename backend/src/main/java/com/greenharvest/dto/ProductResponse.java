package com.greenharvest.dto;

import com.greenharvest.entity.Product;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String unit,
        int stockQuantity,
        String imageUrl,
        Long categoryId,
        String categoryName,
        boolean active) {

    public static ProductResponse from(Product p) {
        return new ProductResponse(
                p.getId(), p.getName(), p.getDescription(), p.getPrice(), p.getUnit(),
                p.getStockQuantity(), p.getImageUrl(),
                p.getCategory().getId(), p.getCategory().getName(), p.isActive());
    }
}
