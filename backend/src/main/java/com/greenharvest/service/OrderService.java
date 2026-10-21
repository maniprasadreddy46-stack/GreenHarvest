package com.greenharvest.service;

import com.greenharvest.dto.OrderItemRequest;
import com.greenharvest.dto.OrderRequest;
import com.greenharvest.dto.OrderResponse;
import com.greenharvest.entity.CustomerOrder;
import com.greenharvest.entity.OrderItem;
import com.greenharvest.entity.OrderStatus;
import com.greenharvest.entity.Product;
import com.greenharvest.entity.User;
import com.greenharvest.exception.BadRequestException;
import com.greenharvest.exception.ResourceNotFoundException;
import com.greenharvest.repository.OrderRepository;
import com.greenharvest.repository.ProductRepository;
import com.greenharvest.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

/** This is a DEMO order flow: orders are saved, but no payment is taken. */
@Service
public class OrderService {

    private final OrderRepository orders;
    private final ProductRepository products;
    private final UserRepository users;

    public OrderService(OrderRepository orders, ProductRepository products, UserRepository users) {
        this.orders = orders;
        this.products = products;
        this.users = users;
    }

    // ---------- customer ----------

    @Transactional
    public OrderResponse placeOrder(String email, OrderRequest req) {
        User user = users.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Merge repeated products; TreeMap keeps ids sorted so row locks are always taken in the same order.
        Map<Long, Integer> wanted = new TreeMap<>();
        for (OrderItemRequest item : req.items()) {
            wanted.merge(item.productId(), item.quantity(), Integer::sum);
        }

        CustomerOrder order = new CustomerOrder();
        order.setUser(user);
        order.setCustomerName(req.customerName().trim());
        order.setPhone(req.phone().trim());
        order.setDeliveryAddress(req.deliveryAddress().trim());
        order.setStatus(OrderStatus.PLACED);

        BigDecimal total = BigDecimal.ZERO;
        for (Map.Entry<Long, Integer> entry : wanted.entrySet()) {
            Product product = products.findByIdForUpdate(entry.getKey())
                    .filter(Product::isActive)
                    .orElseThrow(() -> new BadRequestException(
                            "Product " + entry.getKey() + " is not available"));
            int qty = entry.getValue();
            if (product.getStockQuantity() < qty) {
                throw new BadRequestException("Only " + product.getStockQuantity() + " "
                        + product.getUnit() + " of " + product.getName() + " left in stock");
            }
            product.setStockQuantity(product.getStockQuantity() - qty);

            // Price comes from the database, never from the browser.
            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(qty));
            OrderItem line = new OrderItem();
            line.setOrder(order);
            line.setProduct(product);
            line.setProductName(product.getName());
            line.setUnitPrice(product.getPrice());
            line.setQuantity(qty);
            line.setLineTotal(lineTotal);
            order.getItems().add(line);
            total = total.add(lineTotal);
        }
        order.setTotalAmount(total);
        return OrderResponse.from(orders.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> myOrders(String email) {
        User user = users.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return orders.findByUserIdOrderByCreatedAtDesc(user.getId()).stream().map(OrderResponse::from).toList();
    }

    /** A customer may cancel only their own order, and only while it is still PLACED. */
    @Transactional
    public OrderResponse cancelMyOrder(String email, Long orderId) {
        CustomerOrder order = orders.findById(orderId)
                .filter(o -> o.getUser().getEmail().equals(email))
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        if (order.getStatus() != OrderStatus.PLACED) {
            throw new BadRequestException("Only orders with status PLACED can be cancelled");
        }
        restock(order);
        order.setStatus(OrderStatus.CANCELLED);
        return OrderResponse.from(order);
    }

    // ---------- admin ----------

    @Transactional(readOnly = true)
    public List<OrderResponse> adminList(OrderStatus status) {
        List<CustomerOrder> list = (status == null)
                ? orders.findAllByOrderByCreatedAtDesc()
                : orders.findByStatusOrderByCreatedAtDesc(status);
        return list.stream().map(OrderResponse::from).toList();
    }

    @Transactional
    public OrderResponse updateStatus(Long orderId, OrderStatus newStatus) {
        CustomerOrder order = orders.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        OrderStatus current = order.getStatus();
        if (current == newStatus) {
            return OrderResponse.from(order);
        }
        if (current == OrderStatus.CANCELLED || current == OrderStatus.DELIVERED) {
            throw new BadRequestException("A " + current + " order cannot be changed");
        }
        if (newStatus == OrderStatus.CANCELLED) {
            restock(order);
        }
        order.setStatus(newStatus);
        return OrderResponse.from(order);
    }

    /** Puts the stock of a cancelled order back on the shelf. */
    private void restock(CustomerOrder order) {
        for (OrderItem item : order.getItems()) {
            Product product = products.findByIdForUpdate(item.getProduct().getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
        }
    }
}
