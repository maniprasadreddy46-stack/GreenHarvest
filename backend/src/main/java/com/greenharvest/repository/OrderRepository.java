package com.greenharvest.repository;

import com.greenharvest.entity.CustomerOrder;
import com.greenharvest.entity.OrderStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface OrderRepository extends JpaRepository<CustomerOrder, Long> {

    @EntityGraph(attributePaths = {"items", "user"})
    List<CustomerOrder> findByUserIdOrderByCreatedAtDesc(Long userId);

    @EntityGraph(attributePaths = {"items", "user"})
    List<CustomerOrder> findAllByOrderByCreatedAtDesc();

    @EntityGraph(attributePaths = {"items", "user"})
    List<CustomerOrder> findByStatusOrderByCreatedAtDesc(OrderStatus status);

    long countByStatus(OrderStatus status);

    @Query("select sum(o.totalAmount) from CustomerOrder o where o.status <> :excluded")
    BigDecimal sumRevenueExcluding(@Param("excluded") OrderStatus excluded);
}
