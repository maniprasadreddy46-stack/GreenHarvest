package com.greenharvest.controller;

import com.greenharvest.dto.CategoryResponse;
import com.greenharvest.dto.ProductResponse;
import com.greenharvest.service.CategoryService;
import com.greenharvest.service.ProductService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Public (no login needed): browse the shop. */
@RestController
@RequestMapping("/api")
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    public ProductController(ProductService productService, CategoryService categoryService) {
        this.productService = productService;
        this.categoryService = categoryService;
    }

    /** GET /api/products?q=tomato&categoryId=1  (both parameters optional) */
    @GetMapping("/products")
    public List<ProductResponse> search(@RequestParam(required = false) String q,
                                        @RequestParam(required = false) Long categoryId) {
        return productService.searchPublic(q, categoryId);
    }

    @GetMapping("/products/{id}")
    public ProductResponse one(@PathVariable Long id) {
        return productService.getPublic(id);
    }

    @GetMapping("/categories")
    public List<CategoryResponse> categories() {
        return categoryService.list();
    }
}
