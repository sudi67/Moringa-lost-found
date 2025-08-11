-- Seed data for PrintCraft database

-- Insert categories
INSERT INTO categories (name, description, slug) VALUES
('T-Shirts', 'Custom printed t-shirts in various styles and colors', 'tshirts'),
('Mugs', 'Personalized ceramic and travel mugs', 'mugs'),
('Couple Outfits', 'Matching outfits for couples', 'couple-outfits'),
('Business', 'Corporate and promotional items', 'business');

-- Insert products
INSERT INTO products (category_id, name, description, base_price, image_url) VALUES
(1, 'Custom T-Shirt', 'High-quality cotton t-shirt with custom design printing', 15.00, '/custom-t-shirt-printing.png'),
(1, 'Premium T-Shirt', 'Premium quality cotton blend t-shirt', 20.00, '/premium-tshirt.png'),
(2, 'Ceramic Mug', 'Standard ceramic mug with custom printing', 12.00, '/ceramic-mug.png'),
(2, 'Travel Mug', 'Insulated travel mug with custom design', 18.00, '/travel-mug.png'),
(3, 'Couple T-Shirt Set', 'Matching t-shirt set for couples', 35.00, '/matching-couple-outfits.png'),
(3, 'Couple Hoodie Set', 'Matching hoodie set for couples', 55.00, '/couple-hoodies.png');

-- Insert product variants for t-shirts
INSERT INTO product_variants (product_id, size, color, color_hex, price_modifier, stock_quantity, sku) VALUES
-- Custom T-Shirt variants
(1, 'XS', 'White', '#FFFFFF', 0.00, 100, 'CTSHIRT-XS-WHITE'),
(1, 'S', 'White', '#FFFFFF', 0.00, 100, 'CTSHIRT-S-WHITE'),
(1, 'M', 'White', '#FFFFFF', 0.00, 100, 'CTSHIRT-M-WHITE'),
(1, 'L', 'White', '#FFFFFF', 0.00, 100, 'CTSHIRT-L-WHITE'),
(1, 'XL', 'White', '#FFFFFF', 2.00, 100, 'CTSHIRT-XL-WHITE'),
(1, 'XXL', 'White', '#FFFFFF', 4.00, 100, 'CTSHIRT-XXL-WHITE'),
(1, 'XS', 'Black', '#000000', 0.00, 100, 'CTSHIRT-XS-BLACK'),
(1, 'S', 'Black', '#000000', 0.00, 100, 'CTSHIRT-S-BLACK'),
(1, 'M', 'Black', '#000000', 0.00, 100, 'CTSHIRT-M-BLACK'),
(1, 'L', 'Black', '#000000', 0.00, 100, 'CTSHIRT-L-BLACK'),
(1, 'XL', 'Black', '#000000', 2.00, 100, 'CTSHIRT-XL-BLACK'),
(1, 'XXL', 'Black', '#000000', 4.00, 100, 'CTSHIRT-XXL-BLACK'),
(1, 'XS', 'Navy', '#1E3A8A', 0.00, 100, 'CTSHIRT-XS-NAVY'),
(1, 'S', 'Navy', '#1E3A8A', 0.00, 100, 'CTSHIRT-S-NAVY'),
(1, 'M', 'Navy', '#1E3A8A', 0.00, 100, 'CTSHIRT-M-NAVY'),
(1, 'L', 'Navy', '#1E3A8A', 0.00, 100, 'CTSHIRT-L-NAVY'),
(1, 'XL', 'Navy', '#1E3A8A', 2.00, 100, 'CTSHIRT-XL-NAVY'),
(1, 'XXL', 'Navy', '#1E3A8A', 4.00, 100, 'CTSHIRT-XXL-NAVY');

-- Insert mug variants
INSERT INTO product_variants (product_id, size, color, color_hex, price_modifier, stock_quantity, sku) VALUES
(3, 'Standard', 'White', '#FFFFFF', 0.00, 200, 'MUG-STD-WHITE'),
(3, 'Standard', 'Black', '#000000', 2.00, 200, 'MUG-STD-BLACK'),
(4, 'Large', 'Silver', '#C0C0C0', 0.00, 150, 'TMUG-LG-SILVER'),
(4, 'Large', 'Black', '#000000', 0.00, 150, 'TMUG-LG-BLACK');

-- Insert portfolio items
INSERT INTO portfolio_items (title, description, category, subcategory, image_url, is_featured) VALUES
('Corporate Branded T-Shirts', 'Custom branded t-shirts for tech startup with modern logo design', 'T-Shirts', 'Business', '/placeholder-ml1gr.png', true),
('Wedding Anniversary Mugs', 'Personalized ceramic mugs celebrating 25th wedding anniversary', 'Mugs', 'Personal', '/placeholder-hmei8.png', true),
('Matching Couple Hoodies', 'Cozy matching hoodies with complementary designs for young couple', 'Couples', 'Personal', '/matching-couple-outfits.png', true),
('Sports Team Jerseys', 'Professional jerseys for local basketball team with player names and numbers', 'T-Shirts', 'Business', '/placeholder-twnmb.png', false),
('Promotional Coffee Mugs', 'Branded coffee mugs for marketing campaign and corporate gifts', 'Mugs', 'Business', '/promotional-business-mugs.png', false),
('Valentine Day Couple Shirts', 'Romantic matching t-shirts for Valentine Day celebration', 'Couples', 'Personal', '/anniversary-couple-matching-shirts.png', false),
('Family Reunion T-Shirts', 'Custom family reunion shirts with family tree design and names', 'T-Shirts', 'Personal', '/family-reunion-tshirts.png', false);
