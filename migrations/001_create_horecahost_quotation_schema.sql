-- Supabase Migration: Copy horecahost schema to horecahost_quotation
-- Date: 30/12/2025
-- Purpose: Create new database with same table structure for quotation management

-- Step 1: Create sequences for ID generation
CREATE SEQUENCE IF NOT EXISTS brands_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS categories_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS subcategories_id_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS products_id_seq START WITH 1 INCREMENT BY 1;

-- Step 2: Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id integer NOT NULL DEFAULT nextval('brands_id_seq'::regclass),
  name_en character varying NOT NULL UNIQUE,
  name_ar character varying NOT NULL UNIQUE,
  slug character varying NOT NULL UNIQUE,
  country_en character varying,
  country_ar character varying,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT brands_pkey PRIMARY KEY (id)
);

-- Step 3: Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  name_en character varying NOT NULL UNIQUE,
  name_ar character varying NOT NULL UNIQUE,
  slug character varying NOT NULL UNIQUE,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

-- Step 4: Create subcategories table
CREATE TABLE IF NOT EXISTS public.subcategories (
  id integer NOT NULL DEFAULT nextval('subcategories_id_seq'::regclass),
  category_id integer NOT NULL,
  name_en character varying NOT NULL,
  name_ar character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT subcategories_pkey PRIMARY KEY (id),
  CONSTRAINT subcategories_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE
);

-- Step 5: Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  brand_id integer NOT NULL,
  category_id integer NOT NULL,
  subcategory_id integer NOT NULL,
  name_en character varying NOT NULL,
  name_ar character varying NOT NULL,
  model character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  price numeric DEFAULT 0,
  discount_price numeric,
  description_en text,
  description_ar text,
  specifications jsonb DEFAULT '{}'::jsonb,
  images jsonb DEFAULT '[]'::jsonb,
  active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_brand_id_fkey FOREIGN KEY (brand_id) REFERENCES public.brands(id) ON DELETE CASCADE,
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE,
  CONSTRAINT products_subcategory_id_fkey FOREIGN KEY (subcategory_id) REFERENCES public.subcategories(id) ON DELETE CASCADE
);

-- Step 6: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_brand_id ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory_id ON public.products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(active);
CREATE INDEX IF NOT EXISTS idx_subcategories_category_id ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_brands_slug ON public.brands(slug);
CREATE INDEX IF NOT EXISTS idx_brands_active ON public.brands(active);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON public.categories(active);

-- Step 7: Enable RLS (Row Level Security) for better security
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Note: After running this migration, configure RLS policies based on your requirements
-- For development/testing, you may want to allow all operations:
-- CREATE POLICY "Allow all for authenticated users" ON public.brands FOR ALL USING (auth.role() = 'authenticated');
