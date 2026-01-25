-- Create enquiries table to store customer enquiries
CREATE TABLE IF NOT EXISTS enquiries (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  product_name VARCHAR(255),
  product_slug VARCHAR(255),
  product_link TEXT,
  status VARCHAR(50) DEFAULT 'new', -- new, contacted, closed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_enquiries_email ON enquiries(email);
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_product_slug ON enquiries(product_slug);

-- Create a trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_enquiry_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_enquiry_timestamp_trigger
BEFORE UPDATE ON enquiries
FOR EACH ROW
EXECUTE FUNCTION update_enquiry_timestamp();
