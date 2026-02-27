-- ============================================
-- FIND PRODUCT ID MAPPINGS
-- ============================================
-- Run this in Supabase SQL Editor to see your products
-- Then use the IDs to populate scripts/product-id-mapping.json

-- View all your current products
SELECT 
  id,
  name_en,
  name_ar,
  slug,
  active,
  COALESCE(category_id, 0) as category_id
FROM products
ORDER BY id
LIMIT 100;

-- If you need to search for specific products by name:
-- (uncomment the LIKE line below and edit the product name)

-- SELECT id, name_en, slug FROM products
-- WHERE name_en ILIKE '%blender%'  -- Change 'blender' to search term
-- ORDER BY id;

-- Show how many products you have
SELECT COUNT(*) as total_products FROM products;

-- Show products with related category/subcategory info
SELECT 
  p.id,
  p.name_en,
  p.slug,
  cat.name_en as category,
  subcat.name_en as subcategory
FROM products p
LEFT JOIN categories cat ON p.category_id = cat.id
LEFT JOIN subcategories subcat ON p.subcategory_id = subcat.id
ORDER BY p.id
LIMIT 50;
