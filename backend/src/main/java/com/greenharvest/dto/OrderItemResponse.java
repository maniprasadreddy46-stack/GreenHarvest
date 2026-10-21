package com.greenharvest.dto;

import com.greenharvest.entity.OrderItem;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long productId,
        String productName,
        BigDecimal unitPrice,
        int quantity,
        BigDecimal lineTotal) {

    public static OrderItemResponse from(OrderItem i) {
        return new OrderItemResponse(
                i.getProduct().getId(), i.getProductName(), i.getUnitPrice(),
                i.getQuantity(), i.getLineTotal());
    }
}
