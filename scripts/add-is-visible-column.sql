-- Add is_visible column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT true NOT NULL;

-- Set all existing products to visible
UPDATE products
SET is_visible = true
WHERE is_visible IS NULL;

-- Add comment
COMMENT ON COLUMN products.is_visible IS 'Whether the product is visible to customers';
