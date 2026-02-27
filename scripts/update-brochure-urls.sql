-- ============================================
-- UPDATE BROCHURES WITH EXTERNAL URLS
-- ============================================
-- This updates all brochures to use the external hosting domain
-- Domain: https://admin.horecahost.com/brochure/

-- Step 1: Add external_url column if it doesn't exist
ALTER TABLE brochures ADD COLUMN IF NOT EXISTS external_url VARCHAR(500);

-- Step 2: Update all brochures with the external URL
UPDATE brochures 
SET external_url = CONCAT('https://admin.horecahost.com/brochure/', filename)
WHERE external_url IS NULL OR external_url = '';

-- Step 3: Verify the update
SELECT COUNT(*) as total_brochures, COUNT(external_url) as with_external_urls FROM brochures;

-- Step 4: Check a sample record
SELECT id, filename, external_url FROM brochures LIMIT 5;

-- Step 5: Verify all 265 records have URLs
SELECT COUNT(*) as missing_urls FROM brochures WHERE external_url IS NULL OR external_url = '';
-- Should return: 0 (all have URLs)
