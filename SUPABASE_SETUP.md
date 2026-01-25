# Supabase horecahost_quotation Database Setup Guide

## Overview
This guide helps you copy the table structure from your existing `horecahost` Supabase database to a new `horecahost_quotation` database for testing and quotation management.

## Option 1: Using Supabase SQL Editor (Recommended)

### Step 1: Login to Supabase
1. Go to https://app.supabase.com/
2. Select your project
3. Click on **SQL Editor** in the left sidebar

### Step 2: Run the Migration
1. Click **"New Query"**
2. Copy and paste the contents of `migrations/001_create_horecahost_quotation_schema.sql`
3. Click **"Run"** button

### Step 3: Verify Tables
1. Go to **Table Editor**
2. You should see:
   - brands
   - categories
   - subcategories
   - products

---

## Option 2: Using psql (Command Line)

### Prerequisites
```bash
# Install PostgreSQL client tools if not already installed
brew install postgresql  # macOS
# or
sudo apt-get install postgresql-client  # Linux
```

### Steps
```bash
# 1. Get your Supabase connection string from:
#    Project Settings > Database > Connection String
#    (Choose "psql" tab)

# 2. Run the migration file
psql "your-connection-string" < migrations/001_create_horecahost_quotation_schema.sql

# 3. Verify the tables were created
psql "your-connection-string" -c "\dt"
```

---

## Option 3: Copy Data from horecahost (If Needed)

If you want to copy existing data from horecahost to horecahost_quotation:

```sql
-- Copy brands (schema-only, no data)
INSERT INTO public.brands (name_en, name_ar, slug, country_en, country_ar, active, created_at, updated_at)
SELECT name_en, name_ar, slug, country_en, country_ar, active, created_at, updated_at 
FROM horecahost.public.brands;

-- Copy categories
INSERT INTO public.categories (name_en, name_ar, slug, active, created_at, updated_at)
SELECT name_en, name_ar, slug, active, created_at, updated_at 
FROM horecahost.public.categories;

-- Copy subcategories
INSERT INTO public.subcategories (category_id, name_en, name_ar, slug, active, created_at, updated_at)
SELECT category_id, name_en, name_ar, slug, active, created_at, updated_at 
FROM horecahost.public.subcategories;

-- Copy products
INSERT INTO public.products (brand_id, category_id, subcategory_id, name_en, name_ar, model, slug, price, discount_price, description_en, description_ar, specifications, images, active, created_at, updated_at)
SELECT brand_id, category_id, subcategory_id, name_en, name_ar, model, slug, price, discount_price, description_en, description_ar, specifications, images, active, created_at, updated_at 
FROM horecahost.public.products;
```

---

## Table Structure

### brands
- `id` - Auto-increment primary key
- `name_en` - Brand name (English)
- `name_ar` - Brand name (Arabic)
- `slug` - URL-friendly identifier
- `country_en` - Country (English)
- `country_ar` - Country (Arabic)
- `active` - Active status (true/false)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### categories
- `id` - Auto-increment primary key
- `name_en` - Category name (English)
- `name_ar` - Category name (Arabic)
- `slug` - URL-friendly identifier
- `active` - Active status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### subcategories
- `id` - Auto-increment primary key
- `category_id` - Foreign key to categories
- `name_en` - Subcategory name (English)
- `name_ar` - Subcategory name (Arabic)
- `slug` - URL-friendly identifier
- `active` - Active status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### products
- `id` - Auto-increment primary key
- `brand_id` - Foreign key to brands
- `category_id` - Foreign key to categories
- `subcategory_id` - Foreign key to subcategories
- `name_en` - Product name (English)
- `name_ar` - Product name (Arabic)
- `model` - Product model
- `slug` - URL-friendly identifier
- `price` - Product price
- `discount_price` - Discounted price (optional)
- `description_en` - Long description (English)
- `description_ar` - Long description (Arabic)
- `specifications` - JSON field for product specs
- `images` - JSON array of image URLs
- `active` - Active status
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

---

## Row Level Security (RLS) Setup

If you want to enable RLS for security:

```sql
-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- For development (allow authenticated users to read/write all)
CREATE POLICY "Enable read access for authenticated users" ON public.brands
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.categories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.subcategories
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON public.products
  FOR SELECT USING (auth.role() = 'authenticated');
```

---

## Troubleshooting

### Foreign Key Constraint Errors
If you get errors about foreign key constraints, make sure tables are created in this order:
1. brands
2. categories
3. subcategories
4. products

### Duplicate Key Errors
If you get "duplicate key" errors:
- Make sure the database was empty before migration
- Check that the sequences were created properly
- Reset sequences: `SELECT setval('brands_id_seq', (SELECT MAX(id) FROM brands) + 1);`

### Connection Issues
- Verify your Supabase URL and key in `.env.local`
- Check that your IP is whitelisted in Supabase settings
- Ensure you're using the correct database connection string

---

## Next Steps

1. After creating the tables, you can connect via your Next.js app
2. Update your Supabase client to use the new database
3. Configure RLS policies based on your security requirements
4. Add sample data for testing
5. Set up monitoring and backups
