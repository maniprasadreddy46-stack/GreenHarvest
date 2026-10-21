package com.greenharvest.service;

import com.greenharvest.dto.MessageResponse;
import com.greenharvest.dto.ProductRequest;
import com.greenharvest.dto.ProductResponse;
import com.greenharvest.entity.Category;
import com.greenharvest.entity.Product;
import com.greenharvest.exception.BadRequestException;
import com.greenharvest.exception.ResourceNotFoundException;
import com.greenharvest.repository.CategoryRepository;
import com.greenharvest.repository.OrderItemRepository;
import com.greenharvest.repository.ProductRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.RoundingMode;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository products;
    private final CategoryRepository categories;
    private final OrderItemRepository orderItems;

    public ProductService(ProductRepository products, CategoryRepository categories, OrderItemRepository orderItems) {
        this.products = products;
        this.categories = categories;
        this.orderItems = orderItems;
    }

    // ---------- public shop ----------

    @Transactional(readOnly = true)
    public List<ProductResponse> searchPublic(String q, Long categoryId) {
        String term = (q == null) ? "" : q.trim();
        List<Product> found = (categoryId == null)
                ? products.searchActive(term)
                : products.searchActiveByCategory(categoryId, term);
        return found.stream().map(ProductResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse getPublic(Long id) {
        Product p = products.findById(id)
                .filter(Product::isActive)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        return ProductResponse.from(p);
    }

    // ---------- admin ----------

    @Transactional(readOnly = true)
    public List<ProductResponse> adminList() {
        return products.findAllWithCategory().stream().map(ProductResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProductResponse adminGet(Long id) {
        return ProductResponse.from(find(id));
    }

    @Transactional
    public ProductResponse create(ProductRequest req) {
        Product p = new Product();
        apply(p, req);
        return ProductResponse.from(products.save(p));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest req) {
        Product p = find(id);
        apply(p, req);
        return ProductResponse.from(p);
    }

    @Transactional
    public ProductResponse updateStock(Long id, int newStock) {
        Product p = products.findByIdForUpdate(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        p.setStockQuantity(newStock);
        return ProductResponse.from(p);
    }

    /** Products that appear in past orders are hidden instead of deleted, so order history stays intact. */
    @Transactional
    public MessageResponse delete(Long id) {
        Product p = find(id);
        if (orderItems.existsByProductId(id)) {
            p.setActive(false);
            return new MessageResponse("This product appears in past orders, so it was hidden from the shop instead of deleted");
        }
        products.delete(p);
        return new MessageResponse("Product deleted");
    }

    // ---------- helpers ----------

    private Product find(Long id) {
        return products.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
    }

    private void apply(Product p, ProductRequest req) {
        Category category = categories.findById(req.categoryId())
                .orElseThrow(() -> new BadRequestException("Selected category does not exist"));
        p.setName(req.name().trim());
        p.setDescription(blankToNull(req.description()));
        p.setPrice(req.price().setScale(2, RoundingMode.HALF_UP));
        p.setUnit(req.unit().trim());
        p.setStockQuantity(req.stockQuantity());
        p.setImageUrl(blankToNull(req.imageUrl()));
        p.setCategory(category);
        p.setActive(req.active() == null || req.active());
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
