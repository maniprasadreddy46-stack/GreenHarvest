package com.greenharvest.service;

import com.greenharvest.dto.CategoryRequest;
import com.greenharvest.dto.CategoryResponse;
import com.greenharvest.dto.MessageResponse;
import com.greenharvest.entity.Category;
import com.greenharvest.exception.ConflictException;
import com.greenharvest.exception.ResourceNotFoundException;
import com.greenharvest.repository.CategoryRepository;
import com.greenharvest.repository.ProductRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categories;
    private final ProductRepository products;

    public CategoryService(CategoryRepository categories, ProductRepository products) {
        this.categories = categories;
        this.products = products;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> list() {
        return categories.findAll(Sort.by("name")).stream().map(CategoryResponse::from).toList();
    }

    @Transactional
    public CategoryResponse create(CategoryRequest req) {
        String name = req.name().trim();
        if (categories.findByNameIgnoreCase(name).isPresent()) {
            throw new ConflictException("A category named '" + name + "' already exists");
        }
        Category c = new Category(name, blankToNull(req.description()));
        return CategoryResponse.from(categories.save(c));
    }

    @Transactional
    public CategoryResponse update(Long id, CategoryRequest req) {
        Category c = categories.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        String name = req.name().trim();
        boolean taken = categories.findByNameIgnoreCase(name)
                .filter(other -> !other.getId().equals(id))
                .isPresent();
        if (taken) {
            throw new ConflictException("A category named '" + name + "' already exists");
        }
        c.setName(name);
        c.setDescription(blankToNull(req.description()));
        return CategoryResponse.from(c);
    }

    @Transactional
    public MessageResponse delete(Long id) {
        Category c = categories.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        if (products.existsByCategoryId(id)) {
            throw new ConflictException("This category still has products. Move or delete them first");
        }
        categories.delete(c);
        return new MessageResponse("Category deleted");
    }

    private static String blankToNull(String s) {
        return (s == null || s.isBlank()) ? null : s.trim();
    }
}
