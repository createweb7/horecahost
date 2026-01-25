# SEO Metadata Generation - Multi-Country Scalable Approach

This guide implements a **scalable, multi-country SEO metadata solution** using separate metadata location tables. Perfect for when you're expanding to multiple countries later.

## Strategy

1. **Separate metadata table** - Each product can have different SEO for each country/language
2. **Auto-generate all products** - Uses template variations with location names
3. **Manually refine top sellers** - Override auto-generated content for best products
4. **Scale to any number of countries** - Add new countries anytime

## Database Structure

### New Tables Created

```sql
-- Countries lookup table
countries (id, name, code, region)
  - AE: United Arab Emirates (Dubai)
  - SA: Saudi Arabia (Riyadh)
  - QA: Qatar (Doha)
  - KW: Kuwait (Kuwait City)
  - BH: Bahrain (Manama)
  - OM: Oman (Muscat)
  - Add more anytime!

-- Product metadata locations (separate from products)
product_metadata_locations (
  id,
  product_id,
  country_code,      -- 'AE', 'SA', 'QA'
  language,           -- 'en', 'ar'
  meta_title,
  meta_description,
  meta_keywords
)
```

### Key Advantages

✅ **Scalable** - Supports unlimited countries without schema changes
✅ **Flexible** - Different SEO content for each country/language
✅ **Clean** - Products table unchanged, metadata is separate
✅ **Performant** - Indexed queries for fast lookups

## Step-by-Step Implementation

### Step 1: Run Database Migration (REQUIRED!)

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Create countries lookup table
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  code VARCHAR(2) NOT NULL UNIQUE,
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

-- Create product metadata locations table
CREATE TABLE IF NOT EXISTS product_metadata_locations (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code),
  language VARCHAR(2) NOT NULL DEFAULT 'en',
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, country_code, language)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_metadata_product_id ON product_metadata_locations(product_id);
CREATE INDEX IF NOT EXISTS idx_product_metadata_country ON product_metadata_locations(country_code);
CREATE INDEX IF NOT EXISTS idx_product_metadata_language ON product_metadata_locations(language);
CREATE INDEX IF NOT EXISTS idx_product_metadata_composite ON product_metadata_locations(product_id, country_code, language);
```

### Step 2: Auto-Generate for UAE (Default)

Generate SEO metadata for all products in UAE (English & Arabic):

```bash
node scripts/generate-seo-metadata.js --country AE
```

**Output:**
```
🚀 Starting multi-country SEO metadata generation...

📊 Found 420 products
🌍 Processing 1 countries
🗣️  Processing 2 languages: en, ar

🌏 Processing AE (United Arab Emirates)
──────────────────────────────────────
  📝 Language: en
    ✅ Inserted 420 metadata entries
  📝 Language: ar
    ✅ Inserted 420 metadata entries

✨ Completed!
✅ Total inserted: 840
```

### Step 3: Generate for Other Countries (When Ready)

```bash
# Saudi Arabia
node scripts/generate-seo-metadata.js --country SA

# Qatar
node scripts/generate-seo-metadata.js --country QA

# All countries at once
node scripts/generate-seo-metadata.js
```

Each country gets location-specific content automatically:

**UAE (Dubai):**
- Title: `Buy Premium Commercial Refrigerator by SUBZERO in Dubai | HorecaHost`

**Saudi Arabia (Riyadh):**
- Title: `Buy Premium Commercial Refrigerator by SUBZERO in Riyadh | HorecaHost`

**Qatar (Doha):**
- Title: `Buy Premium Commercial Refrigerator by SUBZERO in Doha | HorecaHost`

### Step 4: Check Generation Status

View completion statistics by country and language:

```bash
node scripts/seo-report.js 50 AE      # UAE only
node scripts/seo-report.js 50 SA      # Saudi Arabia only
node scripts/seo-report.js             # All countries
```

**Output:**
```
📊 SEO Metadata Report - Multi-Country

🌍 Reporting on: AE (United Arab Emirates)

📋 Top 50 Products

🌏 AE - United Arab Emirates
────────────────────────────────────────────────────────────────────────────────

  EN (English)
    ✅ Complete: 50/50 (100%)
    ⚠️  Partial: 0
    ❌ Missing: 0

  AR (العربية)
    ✅ Complete: 50/50 (100%)
    ⚠️  Partial: 0
    ❌ Missing: 0
```

### Step 5: Manually Optimize Top Products

Override auto-generated content for your best sellers:

```bash
# Edit product 5 for UAE, English
node scripts/edit-seo-metadata.js 5 AE en

# Edit same product for UAE, Arabic
node scripts/edit-seo-metadata.js 5 AE ar

# Edit for Saudi Arabia
node scripts/edit-seo-metadata.js 5 SA en
```

**Interactive Editor:**
```
📝 Editing SEO Metadata
────────────────────────────────────────────────────
Product: Commercial Refrigerator
Country: United Arab Emirates (AE)
Language: English
Category: Refrigeration Equipment
Brand: SUBZERO

Current Values:
Title (45/255): Buy Premium Commercial Refrigerator...
Description (156): Explore the Commercial Refrigerator...
Keywords: Commercial Refrigerator, Refrigeration...

New Title (leave blank to keep): SUBZERO 500L Stainless Steel Refrigerator for Dubai Hotels
New Description (leave blank to keep):
New Keywords (leave blank to keep):

✅ Metadata updated for AE (en)!
```

## Template Examples

Templates automatically localize based on country:

### Title Templates (with location variation)

```
1. "Buy Premium {name} {subcat} by {brand} in {location}"
   → "Buy Premium Commercial Refrigerator by SUBZERO in Dubai"
   → "Buy Premium Commercial Refrigerator by SUBZERO in Riyadh"

2. "{name} - Best {subcat} in {location} | {brand} Supplier"
   → "Commercial Refrigerator - Best Refrigeration Equipment in Dubai"

3. "{brand} {name} {subcat} in {location} | Professional Quality"
   → "SUBZERO Commercial Refrigerator Refrigeration Equipment in Dubai"
```

### Description Templates (with location)

```
"Explore the {name} {subcat} by {brand} in {location}. 
Designed for efficient quality with advanced features."

→ Dubai: "Explore the Commercial Refrigerator by SUBZERO in Dubai..."
→ Riyadh: "Explore the Commercial Refrigerator by SUBZERO in Riyadh..."
```

## Workflow Summary

| Phase | Command | Time | Result |
|-------|---------|------|--------|
| 1 | Run migration in Supabase | 2 min | Tables created |
| 2 | `generate-seo-metadata.js --country AE` | 5 min | UAE content generated (en+ar) |
| 3 | `seo-report.js 100 AE` | 1 min | Verify generation |
| 4 | `edit-seo-metadata.js [id] [country] [lang]` | 1-2 hrs | Top 50 manually optimized |
| 5 | Test on frontend | 30 min | Verify display |
| 6 (Later) | `generate-seo-metadata.js --country SA` | 5 min | Add Saudi Arabia |
| 7 (Later) | `generate-seo-metadata.js --country QA` | 5 min | Add Qatar |

**Total for initial setup: ~3 hours**
**Time to add new country: ~5 minutes**

## Using Metadata in Next.js

### Query single product metadata:

```typescript
// Get metadata for UAE, English
const metadata = await supabase
  .from('product_metadata_locations')
  .select('*')
  .eq('product_id', productId)
  .eq('country_code', 'AE')
  .eq('language', 'en')
  .single();

const { meta_title, meta_description, meta_keywords } = metadata.data;
```

### Set page metadata:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const metadata = await getProductMetadata(productId, 'AE', 'en');
  
  return {
    title: metadata.meta_title,
    description: metadata.meta_description,
    keywords: metadata.meta_keywords,
  };
}
```

## Adding New Countries Later

**Step 1:** Add to countries table (manual or script)

```sql
INSERT INTO countries (name, code, region) VALUES
('United Kingdom', 'UK', 'London'),
('Canada', 'CA', 'Toronto');
```

**Step 2:** Generate for new country

```bash
node scripts/generate-seo-metadata.js --country UK
node scripts/generate-seo-metadata.js --country CA
```

**That's it!** No code changes needed.

## Best Practices

### ✅ DO:
- Generate for all countries together when first expanding
- Keep location names consistent (Dubai, Riyadh, Doha, etc)
- Manually optimize your top 50 best-selling products
- Test each new country before going live
- Review templates match your brand voice

### ❌ DON'T:
- Mix country codes (use standards: AE, SA, QA, UK, CA)
- Keyword stuff (max 7-8 keywords per entry)
- Exceed 255 characters for titles
- Forget to run migration before generating
- Delete countries table (products reference it)

## Troubleshooting

**"Country not found" error:**
```bash
# Check available countries
node scripts/seo-report.js

# Add missing country to countries table
```

**"Connection failed" error:**
- Verify `.env.local` has valid Supabase credentials
- Check `SUPABASE_SERVICE_ROLE_KEY` is correct

**Want to regenerate:**
```sql
-- Delete all metadata for a country
DELETE FROM product_metadata_locations 
WHERE country_code = 'AE';

-- Then regenerate
node scripts/generate-seo-metadata.js --country AE
```

---

**Ready to start?** Run the migration in Supabase first, then execute generation!


