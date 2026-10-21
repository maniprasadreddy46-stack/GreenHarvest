package com.greenharvest.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank(message = "Product name is required")
        @Size(max = 120, message = "Name must be at most 120 characters")
        String name,

        @Size(max = 1000, message = "Description must be at most 1000 characters")
        String description,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.01", message = "Price must be at least 0.01")
        @Digits(integer = 8, fraction = 2, message = "Price can have up to 8 digits and 2 decimals")
        BigDecimal price,

        @NotBlank(message = "Unit is required (for example kg, dozen, litre)")
        @Size(max = 30, message = "Unit must be at most 30 characters")
        String unit,

        @NotNull(message = "Stock quantity is required")
        @Min(value = 0, message = "Stock cannot be negative")
        @Max(value = 1000000, message = "Stock is too large")
        Integer stockQuantity,

        @Size(max = 500, message = "Image URL must be at most 500 characters")
        @Pattern(regexp = "^(https?://\\S+|/\\S*)?$", message = "Image URL must start with http://, https:// or /")
        String imageUrl,

        @NotNull(message = "Category is required")
        Long categoryId,

        /** Optional. Defaults to true (visible in the shop). */
        Boolean active) {
}
