package com.greenharvest.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record StockUpdateRequest(
        @NotNull(message = "Stock quantity is required")
        @Min(value = 0, message = "Stock cannot be negative")
        @Max(value = 1000000, message = "Stock is too large")
        Integer stockQuantity) {
}
