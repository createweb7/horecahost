-- Create brand metadata locations table (multi-country, multi-language)
CREATE TABLE IF NOT EXISTS brand_metadata_locations (
  id SERIAL PRIMARY KEY,
  brand_id INT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
  language VARCHAR(2) NOT NULL DEFAULT 'en',  -- 'en', 'ar'
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(brand_id, country_code, language)
);

-- Create category metadata locations table (multi-country, multi-language)
CREATE TABLE IF NOT EXISTS category_metadata_locations (
  id SERIAL PRIMARY KEY,
  category_id INT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
  language VARCHAR(2) NOT NULL DEFAULT 'en',  -- 'en', 'ar'
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id, country_code, language)
);

-- Create subcategory metadata locations table (multi-country, multi-language)
CREATE TABLE IF NOT EXISTS subcategory_metadata_locations (
  id SERIAL PRIMARY KEY,
  subcategory_id INT NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
  language VARCHAR(2) NOT NULL DEFAULT 'en',  -- 'en', 'ar'
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(subcategory_id, country_code, language)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_brand_metadata_brand_id ON brand_metadata_locations(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_metadata_country ON brand_metadata_locations(country_code);
CREATE INDEX IF NOT EXISTS idx_brand_metadata_language ON brand_metadata_locations(language);
CREATE INDEX IF NOT EXISTS idx_brand_metadata_composite ON brand_metadata_locations(brand_id, country_code, language);

CREATE INDEX IF NOT EXISTS idx_category_metadata_category_id ON category_metadata_locations(category_id);
CREATE INDEX IF NOT EXISTS idx_category_metadata_country ON category_metadata_locations(country_code);
CREATE INDEX IF NOT EXISTS idx_category_metadata_language ON category_metadata_locations(language);
CREATE INDEX IF NOT EXISTS idx_category_metadata_composite ON category_metadata_locations(category_id, country_code, language);

CREATE INDEX IF NOT EXISTS idx_subcategory_metadata_subcategory_id ON subcategory_metadata_locations(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_subcategory_metadata_country ON subcategory_metadata_locations(country_code);
CREATE INDEX IF NOT EXISTS idx_subcategory_metadata_language ON subcategory_metadata_locations(language);
CREATE INDEX IF NOT EXISTS idx_subcategory_metadata_composite ON subcategory_metadata_locations(subcategory_id, country_code, language);
