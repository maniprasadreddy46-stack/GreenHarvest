package com.greenharvest.dto;

import com.greenharvest.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record OrderStatusRequest(
        @NotNull(message = "Status is required (PLACED, CONFIRMED, SHIPPED, DELIVERED or CANCELLED)")
        OrderStatus status) {
}
