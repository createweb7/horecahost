-- Update brochures table to use external URLs from shared hosting
-- Replace "https://your-shared-hosting.com" with your actual domain

UPDATE brochures 
SET external_url = CONCAT('https://your-shared-hosting.com/brochures/', filename)
WHERE external_url IS NULL;

-- Verify the update
SELECT COUNT(*) as updated_count FROM brochures WHERE external_url IS NOT NULL;

-- Sample verification (check a few records)
SELECT id, filename, external_url FROM brochures LIMIT 5;
