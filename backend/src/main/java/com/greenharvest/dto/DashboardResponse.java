package com.greenharvest.dto;

import java.math.BigDecimal;
import java.util.Map;

public record DashboardResponse(
        long totalProducts,
        long activeProducts,
        long lowStockProducts,
        long totalOrders,
        long totalCustomers,
        BigDecimal revenue,
        Map<String, Long> ordersByStatus) {
}
