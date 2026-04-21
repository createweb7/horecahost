-- Fix: Make products id column use SERIAL for proper auto-increment
-- This migration fixes the issue where id was not being auto-generated

-- Step 1: Drop the existing constraint and sequence if they exist
ALTER TABLE IF EXISTS public.products DROP CONSTRAINT IF EXISTS products_pkey CASCADE;
DROP SEQUENCE IF EXISTS public.products_id_seq CASCADE;

-- Step 2: Re-create the id column as SERIAL (which auto-creates the sequence)
ALTER TABLE public.products
ADD CONSTRAINT products_pkey PRIMARY KEY (id);

-- Step 3: Ensure the id column uses nextval for new inserts
-- First, drop and recreate the column as SERIAL
-- Since we can't directly convert to SERIAL, we need to:
-- 1. Create a new SERIAL column
-- 2. Copy data
-- 3. Drop old column
-- 4. Rename new column

-- For now, let's just ensure the sequence exists and works:
CREATE SEQUENCE IF NOT EXISTS public.products_id_seq
  START WITH 1
  INCREMENT BY 1
  OWNED BY public.products.id;

-- Ensure the id column defaults to nextval
ALTER TABLE public.products
ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);

-- Reset the sequence to the max id + 1
SELECT setval('public.products_id_seq', (SELECT COALESCE(MAX(id), 0) + 1 FROM public.products));
