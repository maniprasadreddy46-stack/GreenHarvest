package com.greenharvest.controller;

import com.greenharvest.dto.MessageResponse;
import com.greenharvest.dto.ProductRequest;
import com.greenharvest.dto.ProductResponse;
import com.greenharvest.dto.StockUpdateRequest;
import com.greenharvest.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** ADMIN only: protected twice (URL rule in SecurityConfig + @PreAuthorize here). */
@RestController
@RequestMapping("/api/admin/products")
@PreAuthorize("hasRole('ADMIN')")
public class AdminProductController {

    private final ProductService productService;

    public AdminProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> list() {
        return productService.adminList();
    }

    @GetMapping("/{id}")
    public ProductResponse one(@PathVariable Long id) {
        return productService.adminGet(id);
    }

    @PostMapping
    public ResponseEntity<ProductResponse> create(@Valid @RequestBody ProductRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(productService.create(request));
    }

    @PutMapping("/{id}")
    public ProductResponse update(@PathVariable Long id, @Valid @RequestBody ProductRequest request) {
        return productService.update(id, request);
    }

    @PatchMapping("/{id}/stock")
    public ProductResponse updateStock(@PathVariable Long id, @Valid @RequestBody StockUpdateRequest request) {
        return productService.updateStock(id, request.stockQuantity());
    }

    @DeleteMapping("/{id}")
    public MessageResponse delete(@PathVariable Long id) {
        return productService.delete(id);
    }
}
