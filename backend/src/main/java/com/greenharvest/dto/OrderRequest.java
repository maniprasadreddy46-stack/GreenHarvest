package com.greenharvest.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Note: no total and no user id. The server works those out itself. */
public record OrderRequest(
        @NotBlank(message = "Name is required")
        @Size(max = 100, message = "Name must be at most 100 characters")
        String customerName,

        @NotBlank(message = "Phone number is required")
        @Pattern(regexp = "^[0-9+\\-\\s]{10,15}$", message = "Enter a valid phone number (10 to 15 digits)")
        String phone,

        @NotBlank(message = "Delivery address is required")
        @Size(min = 10, max = 500, message = "Address must be 10 to 500 characters")
        String deliveryAddress,

        @NotEmpty(message = "Your cart is empty")
        @Size(max = 50, message = "An order can have at most 50 different products")
        List<@Valid OrderItemRequest> items) {
}
