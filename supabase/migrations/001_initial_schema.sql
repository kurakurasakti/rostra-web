-- Enable pgcrypto extension for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) DEFAULT 'coffee',
  is_available BOOLEAN DEFAULT true,
  image_url VARCHAR(500),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_products_created_at ON products(created_at DESC);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_available ON products(is_available) WHERE is_available = true;

-- Product variants (grind sizes)
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, name)
);

CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sort_order ON product_variants(sort_order);

-- Product sizes (weights with stock)
CREATE TABLE IF NOT EXISTS product_sizes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  volume_gr INTEGER NOT NULL,
  price_modifier DECIMAL(10,2) DEFAULT 0,
  stock_quantity INTEGER DEFAULT 0,
  sku VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id, variant_id, name)
);

CREATE INDEX idx_product_sizes_product_id ON product_sizes(product_id);
CREATE INDEX idx_product_sizes_variant_id ON product_sizes(variant_id);
CREATE INDEX idx_product_sizes_stock ON product_sizes(stock_quantity);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(100) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50),
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  items JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- Admin users table (supplements auth.users)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_users_id ON admin_users(id);
CREATE INDEX idx_admin_users_active ON admin_users(is_active) WHERE is_active = true;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE id = auth.uid()
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Products: Public can read available products, admins can do everything
CREATE POLICY "Public can view available products" ON products
  FOR SELECT USING (is_available = true);

CREATE POLICY "Admins can do everything on products" ON products
  FOR ALL USING (is_admin());

-- Product variants: Public can read, admins can do everything
CREATE POLICY "Public can view variants" ON product_variants
  FOR SELECT USING (true);

CREATE POLICY "Admins can do everything on product_variants" ON product_variants
  FOR ALL USING (is_admin());

-- Product sizes: Public can read, admins can do everything
CREATE POLICY "Public can view sizes" ON product_sizes
  FOR SELECT USING (true);

CREATE POLICY "Admins can do everything on product_sizes" ON product_sizes
  FOR ALL USING (is_admin());

-- Orders: Customers can see their own, admins can see all
CREATE POLICY "Customers can view own orders" ON orders
  FOR SELECT USING (
    customer_email = (auth.jwt() ->> 'email')::text
    OR is_admin()
  );

CREATE POLICY "Admins can do everything on orders" ON orders
  FOR ALL USING (is_admin());

-- Admin users: Only admins can view/modify
CREATE POLICY "Admins can view admin_users" ON admin_users
  FOR SELECT USING (is_admin());

CREATE POLICY "Admins can insert admin_users" ON admin_users
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update admin_users" ON admin_users
  FOR UPDATE USING (is_admin());

-- Admin users table is not meant for deletion via app, but admins can
CREATE POLICY "Admins can delete admin_users" ON admin_users
  FOR DELETE USING (is_admin());

-- Brute force protection: need a separate table to track failed login attempts
-- Users can be created via Supabase dashboard, then added to admin_users table

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed data: Insert some initial grind variants (4 types)
-- These can be inserted programmatically or manually
-- INSERT INTO product_variants (product_id, name, description, sort_order)
-- SELECT 'product-uuid', 'Coarse', 'Coarse grind for French press', 1
-- WHERE EXISTS (SELECT 1 FROM products WHERE id = 'product-uuid');

-- Seed order status enum-like check constraint
ALTER TABLE orders
  ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'));

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS VARCHAR AS $$
DECLARE
  order_num VARCHAR;
BEGIN
  order_num := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
               LPAD(CAST(EXTRACT(EPOCH FROM NOW()) AS BIGINT) % 10000 AS TEXT, 4, '0');
  RETURN order_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate order_number
CREATE OR REPLACE FUNCTION set_order_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_number IS NULL OR NEW.order_number = '' THEN
    NEW.order_number := generate_order_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_order_number_trigger
  BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION set_order_number();
