package com.greenharvest.controller;

import com.greenharvest.dto.OrderResponse;
import com.greenharvest.dto.OrderStatusRequest;
import com.greenharvest.entity.OrderStatus;
import com.greenharvest.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** ADMIN only. */
@RestController
@RequestMapping("/api/admin/orders")
@PreAuthorize("hasRole('ADMIN')")
public class AdminOrderController {

    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /** GET /api/admin/orders  or  GET /api/admin/orders?status=PLACED */
    @GetMapping
    public List<OrderResponse> list(@RequestParam(required = false) OrderStatus status) {
        return orderService.adminList(status);
    }

    @PutMapping("/{id}/status")
    public OrderResponse updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusRequest request) {
        return orderService.updateStatus(id, request.status());
    }
}
