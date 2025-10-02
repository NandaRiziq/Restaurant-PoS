-- Migration: Update orders table for dine-in restaurant
-- Changes:
-- 1. Add table_number column for table assignments
-- 2. Remove customer_address (not needed for dine-in)
-- 3. Make customer_phone nullable (optional field)

-- Add table_number column
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS table_number INTEGER;

-- Make customer_phone nullable (if not already)
ALTER TABLE orders
ALTER COLUMN customer_phone DROP NOT NULL;

-- Remove customer_address column (not needed for dine-in service)
ALTER TABLE orders
DROP COLUMN IF EXISTS customer_address;

-- Add comment to table for documentation
COMMENT ON COLUMN orders.table_number IS 'Table number for dine-in orders';
COMMENT ON COLUMN orders.customer_phone IS 'Customer phone number (optional)';
