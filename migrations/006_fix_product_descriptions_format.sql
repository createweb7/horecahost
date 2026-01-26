-- Migration: Fix product descriptions by removing excessive <p> tags
-- Issue: Each line was wrapped in <p> tags, creating unwanted line breaks
-- Solution: Join lines into paragraphs, remove excess bullets

BEGIN;

-- Fix English descriptions
UPDATE products
SET description_en = TRIM(
  -- Wrap cleaned content in <p> tags
  CONCAT(
    '<p>',
    -- Remove excessive bullets at start of joined lines
    REGEXP_REPLACE(
      -- Remove all <p> and </p> tags
      REGEXP_REPLACE(
        -- Join lines that are part of same sentence (replace </p><p> with space)
        REGEXP_REPLACE(
          description_en, 
          '</p>\s*<p>[\s•]*', 
          ' ',
          'g'
        ),
        '</?p>',
        '',
        'g'
      ),
      '^\s*•\s+',
      '• ',
      ''
    ),
    '</p>'
  )
)
WHERE description_en LIKE '%<p>%'
AND description_en IS NOT NULL;

-- Fix Arabic descriptions
UPDATE products
SET description_ar = TRIM(
  CONCAT(
    '<p>',
    REGEXP_REPLACE(
      REGEXP_REPLACE(
        REGEXP_REPLACE(
          description_ar, 
          '</p>\s*<p>[\s•]*', 
          ' ',
          'g'
        ),
        '</?p>',
        '',
        'g'
      ),
      '^\s*•\s+',
      '• ',
      ''
    ),
    '</p>'
  )
)
WHERE description_ar LIKE '%<p>%'
AND description_ar IS NOT NULL;

COMMIT;
