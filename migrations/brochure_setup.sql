-- Create brochures table for Supabase PostgreSQL
CREATE TABLE IF NOT EXISTS brochures (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  is_main BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_brochures_product_id ON brochures(product_id);
CREATE INDEX IF NOT EXISTS idx_brochures_active ON brochures(active);

-- Optional: Add foreign key constraint to products table
-- ALTER TABLE brochures 
-- ADD CONSTRAINT fk_brochures_product 
-- FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE;

-- Seed initial brochure data from your migration file
-- The old product ID needs to be mapped to new product IDs in your current system
-- You'll need to run a migration script to populate this table with actual product mappings
