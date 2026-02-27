-- ============================================
-- BROCHURE TABLE SETUP FOR SUPABASE
-- ============================================
-- Copy this entire SQL and run in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste here → Run

-- Drop existing table if you want to reset
-- DROP TABLE IF EXISTS brochures CASCADE;

-- Create brochures table
CREATE TABLE IF NOT EXISTS brochures (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  is_main BOOLEAN DEFAULT false,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_brochures_product_id ON brochures(product_id);
CREATE INDEX IF NOT EXISTS idx_brochures_active ON brochures(active);
CREATE INDEX IF NOT EXISTS idx_brochures_product_active ON brochures(product_id, active);

-- Enable RLS (Row Level Security) if needed
ALTER TABLE brochures ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Enable read access for all users"
ON brochures FOR SELECT
USING (active = true);

-- Create policy for admin write access (optional)
-- You can restrict this based on your auth setup
CREATE POLICY "Enable write for authenticated users"
ON brochures FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

-- Optional: Add foreign key constraint if products table exists
-- Uncomment if your products table is properly set up:
-- ALTER TABLE brochures
-- ADD CONSTRAINT fk_brochures_product_id
-- FOREIGN KEY (product_id) REFERENCES products(id)
-- ON DELETE CASCADE
-- ON UPDATE CASCADE;

-- Create trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION brochures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER brochures_updated_at_trigger
BEFORE UPDATE ON brochures
FOR EACH ROW
EXECUTE FUNCTION brochures_updated_at();

-- Grant permissions
GRANT SELECT ON brochures TO anon, authenticated;
GRANT ALL ON brochures TO authenticated;

-- Verify table was created
SELECT * FROM brochures LIMIT 1;
