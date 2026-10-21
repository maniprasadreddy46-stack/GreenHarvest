package com.greenharvest.config;

import com.greenharvest.entity.Category;
import com.greenharvest.entity.Product;
import com.greenharvest.entity.Role;
import com.greenharvest.entity.User;
import com.greenharvest.repository.CategoryRepository;
import com.greenharvest.repository.ProductRepository;
import com.greenharvest.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Runs once when the backend starts:
 *  1. creates the first ADMIN account from ADMIN_EMAIL / ADMIN_PASSWORD (password is BCrypt-hashed);
 *  2. adds sample categories and products if the tables are empty (same data as database/schema.sql).
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository users;
    private final CategoryRepository categories;
    private final ProductRepository products;
    private final PasswordEncoder passwordEncoder;

    private final String adminEmail;
    private final String adminPassword;
    private final String adminName;

    public DataInitializer(UserRepository users,
                           CategoryRepository categories,
                           ProductRepository products,
                           PasswordEncoder passwordEncoder,
                           @Value("${app.admin.email}") String adminEmail,
                           @Value("${app.admin.password}") String adminPassword,
                           @Value("${app.admin.name}") String adminName) {
        this.users = users;
        this.categories = categories;
        this.products = products;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
        this.adminName = adminName;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedCatalog();
    }

    private void seedAdmin() {
        if (users.existsByRole(Role.ADMIN)) {
            return;
        }
        if (adminPassword == null || adminPassword.length() < 8) {
            throw new IllegalStateException("ADMIN_PASSWORD must be at least 8 characters. Set it in backend/.env");
        }
        String email = adminEmail.trim().toLowerCase();
        if (users.existsByEmail(email)) {
            log.warn("No admin exists, but {} is already registered as a customer. Use another ADMIN_EMAIL.", email);
            return;
        }
        User admin = new User();
        admin.setFullName(adminName);
        admin.setEmail(email);
        admin.setPasswordHash(passwordEncoder.encode(adminPassword));
        admin.setRole(Role.ADMIN);
        users.save(admin);
        log.info("Admin account created: {}", email);
    }

    private void seedCatalog() {
        if (categories.count() == 0) {
            categories.save(new Category("Vegetables", "Fresh seasonal vegetables grown without synthetic pesticides"));
            categories.save(new Category("Fruits", "Tree-ripened organic fruits"));
            categories.save(new Category("Grains & Pulses", "Stone-milled grains, rice and pulses"));
            categories.save(new Category("Dairy & Eggs", "Farm-fresh milk, ghee and eggs"));
            categories.save(new Category("Honey & Preserves", "Raw honey, jaggery and homemade preserves"));
        }
        if (products.count() > 0) {
            return;
        }
        Map<String, Category> byName = new java.util.HashMap<>();
        categories.findAll().forEach(c -> byName.put(c.getName(), c));
        if (!byName.keySet().containsAll(java.util.List.of(
                "Vegetables", "Fruits", "Grains & Pulses", "Dairy & Eggs", "Honey & Preserves"))) {
            return; // categories were customised, so skip sample products
        }

        add(byName.get("Vegetables"), "Organic Tomatoes", "Vine-ripened, sweet and juicy.", "60.00", "kg", 120);
        add(byName.get("Vegetables"), "Spinach Bunch", "Tender leaves harvested the same morning.", "25.00", "bunch", 80);
        add(byName.get("Vegetables"), "Carrots", "Crunchy, naturally sweet carrots.", "55.00", "kg", 100);
        add(byName.get("Fruits"), "Alphonso Mangoes", "Seasonal, naturally ripened mangoes.", "320.00", "dozen", 40);
        add(byName.get("Fruits"), "Bananas (Robusta)", "Grown without chemical ripening.", "50.00", "dozen", 90);
        add(byName.get("Grains & Pulses"), "Sona Masoori Rice", "Unpolished, aged rice.", "85.00", "kg", 200);
        add(byName.get("Grains & Pulses"), "Toor Dal", "Hand-cleaned split pigeon peas.", "140.00", "kg", 150);
        add(byName.get("Dairy & Eggs"), "Free-Range Eggs", "From hens raised on open pasture.", "90.00", "dozen", 60);
        add(byName.get("Dairy & Eggs"), "A2 Cow Ghee", "Slow-churned, traditional bilona method.", "950.00", "litre", 30);
        add(byName.get("Honey & Preserves"), "Raw Forest Honey", "Unheated, unfiltered honey.", "450.00", "kg", 45);
        add(byName.get("Honey & Preserves"), "Organic Jaggery", "Chemical-free sugarcane jaggery blocks.", "90.00", "kg", 70);
        log.info("Sample products added");
    }

    private void add(Category category, String name, String description, String price, String unit, int stock) {
        Product p = new Product();
        p.setCategory(category);
        p.setName(name);
        p.setDescription(description);
        p.setPrice(new BigDecimal(price));
        p.setUnit(unit);
        p.setStockQuantity(stock);
        p.setActive(true);
        products.save(p);
    }
}
