package com.greenharvest.controller;

import com.greenharvest.dto.OrderRequest;
import com.greenharvest.dto.OrderResponse;
import com.greenharvest.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Needs login. The user comes from the JWT, never from the request body. */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<OrderResponse> place(@Valid @RequestBody OrderRequest request,
                                               Authentication authentication) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(orderService.placeOrder(authentication.getName(), request));
    }

    @GetMapping("/my")
    public List<OrderResponse> myOrders(Authentication authentication) {
        return orderService.myOrders(authentication.getName());
    }

    @PostMapping("/{id}/cancel")
    public OrderResponse cancel(@PathVariable Long id, Authentication authentication) {
        return orderService.cancelMyOrder(authentication.getName(), id);
    }
}
