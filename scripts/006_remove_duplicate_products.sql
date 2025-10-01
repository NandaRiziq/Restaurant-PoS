-- Remove duplicate products, keeping only the first occurrence of each product name
DELETE FROM products
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at ASC) as row_num
    FROM products
  ) t
  WHERE row_num > 1
);

-- Verify the cleanup
SELECT name, COUNT(*) as count
FROM products
GROUP BY name
HAVING COUNT(*) > 1;
