-- Adds a source/tag column so enquiries can be traced back to where they came from
-- (e.g. 'quick' = Kitchen Consultancy hero quick-start form, 'consultation' = full
-- Kitchen Consultancy form). Existing rows and other enquiry sources (product pages,
-- contact form) are left as NULL — no backend behavior changes for them.

ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS source VARCHAR(50);

CREATE INDEX IF NOT EXISTS idx_enquiries_source ON enquiries(source);
