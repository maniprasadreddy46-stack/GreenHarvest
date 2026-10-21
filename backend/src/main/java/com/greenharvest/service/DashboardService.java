package com.greenharvest.service;

import com.greenharvest.dto.DashboardResponse;
import com.greenharvest.entity.OrderStatus;
import com.greenharvest.entity.Role;
import com.greenharvest.repository.OrderRepository;
import com.greenharvest.repository.ProductRepository;
import com.greenharvest.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class DashboardService {

    private static final int LOW_STOCK_LIMIT = 10;

    private final ProductRepository products;
    private final OrderRepository orders;
    private final UserRepository users;

    public DashboardService(ProductRepository products, OrderRepository orders, UserRepository users) {
        this.products = products;
        this.orders = orders;
        this.users = users;
    }

    @Transactional(readOnly = true)
    public DashboardResponse summary() {
        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (OrderStatus s : OrderStatus.values()) {
            byStatus.put(s.name(), orders.countByStatus(s));
        }
        return new DashboardResponse(
                products.count(),
                products.countByActiveTrue(),
                products.countByActiveTrueAndStockQuantityLessThan(LOW_STOCK_LIMIT),
                orders.count(),
                users.countByRole(Role.CUSTOMER),
                java.util.Optional.ofNullable(orders.sumRevenueExcluding(OrderStatus.CANCELLED)).orElse(java.math.BigDecimal.ZERO),
                byStatus);
    }
}
