-- Create countries lookup table
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(2) NOT NULL UNIQUE,  -- 'AE', 'SA', 'QA', 'KW', etc
  region VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default countries
INSERT INTO countries (name, code, region) VALUES
('United Arab Emirates', 'AE', 'Dubai'),
('Saudi Arabia', 'SA', 'Riyadh'),
('Qatar', 'QA', 'Doha'),
('Kuwait', 'KW', 'Kuwait City'),
('Bahrain', 'BH', 'Manama'),
('Oman', 'OM', 'Muscat')
ON CONFLICT DO NOTHING;

-- Create product metadata locations table (multi-country, multi-language)
CREATE TABLE IF NOT EXISTS product_metadata_locations (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
  language VARCHAR(2) NOT NULL DEFAULT 'en',  -- 'en', 'ar'
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, country_code, language)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_metadata_product_id ON product_metadata_locations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_metadata_country ON product_metadata_locations(country_code);
CREATE INDEX IF NOT EXISTS idx_product_metadata_language ON product_metadata_locations(language);
CREATE INDEX IF NOT EXISTS idx_product_metadata_composite ON product_metadata_locations(product_id, country_code, language);
