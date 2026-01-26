-- Add bullet points to all product descriptions
-- This will make each line start with a bullet point (•)

UPDATE products 
SET description_en = '• ' || REPLACE(description_en, E'\n', E'\n• ')
WHERE description_en IS NOT NULL AND description_en NOT LIKE '• %';

UPDATE products 
SET description_ar = '• ' || REPLACE(description_ar, E'\n', E'\n• ')
WHERE description_ar IS NOT NULL AND description_ar NOT LIKE '• %';
