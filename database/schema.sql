-- GreenHarvest database setup (MySQL 8+)
-- Run:  mysql -u root -p < database/schema.sql
-- (The backend can also create these tables itself via Hibernate ddl-auto=update;
--  this script documents the schema and lets you set it up manually.)

CREATE DATABASE IF NOT EXISTS greenharvest
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE greenharvest;

CREATE TABLE IF NOT EXISTS users (
  id            BIGINT AUTO_INCREMENT PRIMARY KEY,
  full_name     VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(100) NOT NULL,
  role          VARCHAR(20)  NOT NULL DEFAULT 'CUSTOMER',   -- CUSTOMER or ADMIN
  created_at    DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
);

CREATE TABLE IF NOT EXISTS categories (
  id          BIGINT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(80) NOT NULL UNIQUE,
  description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS products (
  id             BIGINT AUTO_INCREMENT PRIMARY KEY,
  name           VARCHAR(120) NOT NULL,
  description    VARCHAR(1000),
  price          DECIMAL(10,2) NOT NULL,
  unit           VARCHAR(30)  NOT NULL,                     -- kg, dozen, litre, bunch ...
  stock_quantity INT          NOT NULL DEFAULT 0,
  image_url      VARCHAR(500),
  active         BOOLEAN      NOT NULL DEFAULT TRUE,
  category_id    BIGINT       NOT NULL,
  created_at     DATETIME(6)  NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE IF NOT EXISTS orders (
  id               BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id          BIGINT        NOT NULL,
  customer_name    VARCHAR(100)  NOT NULL,
  phone            VARCHAR(20)   NOT NULL,
  delivery_address VARCHAR(500)  NOT NULL,
  total_amount     DECIMAL(12,2) NOT NULL,
  status           VARCHAR(20)   NOT NULL DEFAULT 'PLACED', -- PLACED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
  created_at       DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
  id           BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id     BIGINT        NOT NULL,
  product_id   BIGINT        NOT NULL,
  product_name VARCHAR(120)  NOT NULL,                      -- snapshot at purchase time
  unit_price   DECIMAL(10,2) NOT NULL,                      -- snapshot at purchase time
  quantity     INT           NOT NULL,
  line_total   DECIMAL(12,2) NOT NULL,
  CONSTRAINT fk_items_order   FOREIGN KEY (order_id)   REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_items_product FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ---------- Sample data ----------
INSERT IGNORE INTO categories (name, description) VALUES
  ('Vegetables', 'Fresh seasonal vegetables grown without synthetic pesticides'),
  ('Fruits',     'Tree-ripened organic fruits'),
  ('Grains & Pulses', 'Stone-milled grains, rice and pulses'),
  ('Dairy & Eggs',    'Farm-fresh milk, ghee and eggs'),
  ('Honey & Preserves','Raw honey, jaggery and homemade preserves');

INSERT INTO products (name, description, price, unit, stock_quantity, image_url, category_id)
SELECT * FROM (
  SELECT 'Organic Tomatoes' AS name, 'Vine-ripened, sweet and juicy.' AS description, 60.00 AS price, 'kg' AS unit, 120 AS stock_quantity, NULL AS image_url, (SELECT id FROM categories WHERE name='Vegetables') AS category_id
  UNION ALL SELECT 'Spinach Bunch', 'Tender leaves harvested the same morning.', 25.00, 'bunch', 80, NULL, (SELECT id FROM categories WHERE name='Vegetables')
  UNION ALL SELECT 'Carrots', 'Crunchy, naturally sweet carrots.', 55.00, 'kg', 100, NULL, (SELECT id FROM categories WHERE name='Vegetables')
  UNION ALL SELECT 'Alphonso Mangoes', 'Seasonal, naturally ripened mangoes.', 320.00, 'dozen', 40, NULL, (SELECT id FROM categories WHERE name='Fruits')
  UNION ALL SELECT 'Bananas (Robusta)', 'Grown without chemical ripening.', 50.00, 'dozen', 90, NULL, (SELECT id FROM categories WHERE name='Fruits')
  UNION ALL SELECT 'Sona Masoori Rice', 'Unpolished, aged rice.', 85.00, 'kg', 200, NULL, (SELECT id FROM categories WHERE name='Grains & Pulses')
  UNION ALL SELECT 'Toor Dal', 'Hand-cleaned split pigeon peas.', 140.00, 'kg', 150, NULL, (SELECT id FROM categories WHERE name='Grains & Pulses')
  UNION ALL SELECT 'Free-Range Eggs', 'From hens raised on open pasture.', 90.00, 'dozen', 60, NULL, (SELECT id FROM categories WHERE name='Dairy & Eggs')
  UNION ALL SELECT 'A2 Cow Ghee', 'Slow-churned, traditional bilona method.', 950.00, 'litre', 30, NULL, (SELECT id FROM categories WHERE name='Dairy & Eggs')
  UNION ALL SELECT 'Raw Forest Honey', 'Unheated, unfiltered honey.', 450.00, 'kg', 45, NULL, (SELECT id FROM categories WHERE name='Honey & Preserves')
  UNION ALL SELECT 'Organic Jaggery', 'Chemical-free sugarcane jaggery blocks.', 90.00, 'kg', 70, NULL, (SELECT id FROM categories WHERE name='Honey & Preserves')
) AS seed
WHERE NOT EXISTS (SELECT 1 FROM products);

-- NOTE: the admin user is NOT created here, because passwords must be BCrypt-hashed.
-- The backend creates the admin on first start from ADMIN_EMAIL / ADMIN_PASSWORD in backend/.env.
