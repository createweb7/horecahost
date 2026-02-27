# Brochure Integration Guide

## Overview

This guide explains how to add brochures to products from your old website.

## Database Schema

### PostgreSQL Table Structure (Supabase)

```sql
CREATE TABLE brochures (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL,              -- References products.id
  filename VARCHAR(255) NOT NULL,       -- e.g., "post_55130_374.pdf"
  file_path VARCHAR(500),               -- e.g., "/brochure/post_55130_374.pdf"
  is_main BOOLEAN DEFAULT false,        -- TRUE for primary/featured brochure
  active BOOLEAN DEFAULT true,          -- FALSE to hide brochure
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_brochures_product_id ON brochures(product_id);
CREATE INDEX idx_brochures_active ON brochures(active);
```

## Setup Steps

### Step 1: Create Table in Supabase

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Open SQL Editor
4. Copy the SQL from `migrations/brochure_setup.sql`
5. Execute the migration

### Step 2: Upload Brochures to Public Directory

```bash
# Files should be in: /public/brochure/
# Examples:
# - /public/brochure/post_55130_374.pdf
# - /public/brochure/post_32100_374.pdf
# - /public/brochure/post_36120_373.pdf
```

✅ All your brochures are already in `/public/brochure/` directory

### Step 3: Find and Map Product IDs

Your old MySQL database used `section_id` values (374, 373, 372, etc.) as product IDs.
Your new Supabase database has different product IDs.

#### 3A: Query Your Products

Run this SQL in Supabase SQL Editor to see your product IDs:

```sql
-- View all products with IDs
SELECT id, name_en, slug FROM products ORDER BY id LIMIT 100;
```

#### 3B: Map Old section_id → New product_id

Edit `scripts/product-id-mapping.json`:

```json
{
  "_comment": "Map old MySQL section_id → new product_id",
  "374": 15,      // Found "Blender" (old 374) = product id 15
  "373": 22,      // Found "Mixer" (old 373) = product id 22
  "372": 31,
  "368": 42,
  ...
}
```

**Helper Script:** Run this to generate recommendations:

```bash
node scripts/find-product-mappings.js
```

**SQL Helper:** Use `scripts/find-product-ids.sql` to search for products by name:

```sql
SELECT id, name_en FROM products WHERE name_en ILIKE '%blender%';
```

### Step 4: Apply Data Migration

Run the migration script:

```bash
node scripts/migrate-brochures.js
```

This will:

1. ✅ Validate all brochure files exist in `/public/brochure/`
2. Generate SQL INSERT statements
3. Display them for manual verification

Then:

1. Copy the generated SQL statements
2. Paste into Supabase SQL Editor
3. Execute to populate the brochures table

### Step 5: Add Brochures to Product Pages

#### Option A: Display in Product Detail Component

```tsx
import { useState, useEffect } from "react";

export default function ProductDetail({ productId }) {
  const [brochures, setBrochures] = useState([]);

  useEffect(() => {
    fetch("/api/brochures", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: productId }),
    })
      .then((res) => res.json())
      .then((data) => setBrochures(data.brochures));
  }, [productId]);

  return (
    <div>
      {brochures.length > 0 && (
        <div className="brochures-section">
          <h3>Product Brochures</h3>
          <ul>
            {brochures.map((brochure) => (
              <li key={brochure.id}>
                <a
                  href={brochure.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  📄 {brochure.filename}
                  {brochure.is_main && <span className="badge">Featured</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

#### Option B: Display in Admin Panel

Add a "Brochures" section to the product edit page:

```tsx
<div className="brochures-management">
  <h3>Upload Brochures</h3>
  <input type="file" multiple accept=".pdf,.docx,.png,.jpg" />
  <button onClick={handleUpload}>Upload Brochures</button>

  <h3>Current Brochures</h3>
  <table>
    <tr>
      <th>Filename</th>
      <th>Is Main</th>
      <th>Active</th>
      <th>Actions</th>
    </tr>
    {/* List brochures */}
  </table>
</div>
```

## API Documentation

### GET `/api/brochures`

**Request:**

```json
{
  "product_id": 1
}
```

**Response:**

```json
{
  "success": true,
  "count": 3,
  "brochures": [
    {
      "id": 1,
      "product_id": 1,
      "filename": "post_55130_374.pdf",
      "file_path": "/brochure/post_55130_374.pdf",
      "url": "/brochure/post_55130_374.pdf",
      "is_main": true,
      "active": true,
      "created_at": "2026-02-26T10:00:00Z"
    }
  ]
}
```

## File Organization

```
horecahost/
├── public/
│   └── brochure/                    ✅ All your brochure files
│       ├── post_55130_374.pdf
│       ├── post_32100_374.pdf
│       └── ... (260+ more files)
├── migrations/
│   └── brochure_setup.sql           ✅ PostgreSQL schema
├── app/
│   └── api/
│       └── brochures/
│           └── route.ts             ✅ API endpoint
└── scripts/
    ├── migrate-brochures.js         ✅ Migration helper
    └── product-id-mapping.json      TODO: Create this
```

## Troubleshooting

### Issue: Product IDs don't match

**Solution:** Create the mapping file with correct old→new ID pairs

### Issue: Brochure links return 404

**Solution:** Verify files are in `/public/brochure/` with exact filenames from database

### Issue: API returns empty list

**Solution:** Check that:

1. Brochures table has data
2. `product_id` values are correct (not old IDs)
3. `active` column is TRUE

## Next Steps

1. ✅ Table schema created (`migrations/001_create_brochures_table.sql`)
2. ✅ API endpoint ready (`app/api/brochures/route.ts`)
3. ✅ Migration script created (`scripts/migrate-brochures.js`)
4. ✅ Brochure files already in `/public/brochure/`
5. ✅ Helper scripts: `find-product-mappings.js` & `find-product-ids.sql`
6. **TODO**: Query your products to find ID mappings
7. **TODO**: Edit `scripts/product-id-mapping.json` with mappings
8. **TODO**: Run migration script to generate INSERT statements
9. **TODO**: Add brochure display to product pages

## Quick Reference: section_id vs product_id

```
Old MySQL (assets_brochure):          New Supabase (brochures):
├── id: 1                             ├── id: 1
├── section_id: 374 ──────────────→ ├── product_id: 15 (if that's the mapping)
├── image: post_55130_374.pdf       ├── filename: post_55130_374.pdf
└── state: 1 (active)              └── active: true
```
