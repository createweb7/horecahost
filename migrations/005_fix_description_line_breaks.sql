-- Better approach: Replace newlines with a pipe delimiter, then handle in frontend
-- This query will replace \n with a visible separator we can split on

UPDATE products 
SET description_en = REPLACE(REPLACE(description_en, E'\r\n', '|||'), E'\n', '|||')
WHERE description_en IS NOT NULL;

UPDATE products 
SET description_ar = REPLACE(REPLACE(description_ar, E'\r\n', '|||'), E'\n', '|||')
WHERE description_ar IS NOT NULL;
