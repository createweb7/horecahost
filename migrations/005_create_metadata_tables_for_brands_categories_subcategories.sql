-- Create metadata table for brands
CREATE TABLE IF NOT EXISTS brand_metadata_locations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  brand_id BIGINT NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL,
  language VARCHAR(2) NOT NULL DEFAULT 'en',
  h1_tag TEXT,
  h2_tag TEXT,
  paragraph_text TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(brand_id, country_code, language)
);

-- Create metadata table for categories
CREATE TABLE IF NOT EXISTS category_metadata_locations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  category_id BIGINT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL,
  language VARCHAR(2) NOT NULL DEFAULT 'en',
  h1_tag TEXT,
  h2_tag TEXT,
  paragraph_text TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category_id, country_code, language)
);

-- Create metadata table for subcategories
CREATE TABLE IF NOT EXISTS subcategory_metadata_locations (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  subcategory_id BIGINT NOT NULL REFERENCES subcategories(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL,
  language VARCHAR(2) NOT NULL DEFAULT 'en',
  h1_tag TEXT,
  h2_tag TEXT,
  paragraph_text TEXT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(subcategory_id, country_code, language)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_brand_metadata_brand_id ON brand_metadata_locations(brand_id);
CREATE INDEX IF NOT EXISTS idx_brand_metadata_country ON brand_metadata_locations(country_code, language);
CREATE INDEX IF NOT EXISTS idx_category_metadata_category_id ON category_metadata_locations(category_id);
CREATE INDEX IF NOT EXISTS idx_category_metadata_country ON category_metadata_locations(country_code, language);
CREATE INDEX IF NOT EXISTS idx_subcategory_metadata_subcategory_id ON subcategory_metadata_locations(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_subcategory_metadata_country ON subcategory_metadata_locations(country_code, language);
