package com.greenharvest.dto;

import com.greenharvest.entity.CustomerOrder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponse(
        Long id,
        String customerName,
        String customerEmail,
        String phone,
        String deliveryAddress,
        BigDecimal totalAmount,
        String status,
        LocalDateTime createdAt,
        List<OrderItemResponse> items) {

    public static OrderResponse from(CustomerOrder o) {
        return new OrderResponse(
                o.getId(), o.getCustomerName(), o.getUser().getEmail(), o.getPhone(),
                o.getDeliveryAddress(), o.getTotalAmount(), o.getStatus().name(),
                o.getCreatedAt(),
                o.getItems().stream().map(OrderItemResponse::from).toList());
    }
}
