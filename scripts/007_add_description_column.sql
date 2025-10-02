-- Add description column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

-- Update existing products with descriptions
UPDATE products SET description = 'Nasi goreng dengan bumbu spesial, telur, ayam, dan sayuran segar. Disajikan panas dengan kerupuk.' WHERE name ILIKE '%nasi goreng%';
UPDATE products SET description = 'Mie goreng dengan campuran sayuran, telur, dan bumbu khas Indonesia yang gurih dan lezat.' WHERE name ILIKE '%mie goreng%';
UPDATE products SET description = 'Ayam goreng renyah dengan bumbu meresap sempurna. Disajikan dengan nasi putih hangat dan sambal.' WHERE name ILIKE '%ayam goreng%';
UPDATE products SET description = 'Sate ayam dengan bumbu kacang khas yang manis dan gurih. Dilengkapi dengan lontong dan acar.' WHERE name ILIKE '%sate ayam%';
UPDATE products SET description = 'Gado-gado dengan sayuran segar, tahu, tempe, dan bumbu kacang yang kental dan lezat.' WHERE name ILIKE '%gado%';
UPDATE products SET description = 'Soto ayam kuah kuning dengan suwiran ayam, telur, dan taburan bawang goreng. Hangat dan menyegarkan.' WHERE name ILIKE '%soto%';
UPDATE products SET description = 'Bakso sapi kenyal dengan kuah kaldu yang gurih. Dilengkapi mie, tahu, dan sayuran.' WHERE name ILIKE '%bakso%';
UPDATE products SET description = 'Rendang daging sapi dengan bumbu rempah khas Padang yang kaya rasa dan empuk.' WHERE name ILIKE '%rendang%';

-- Drinks
UPDATE products SET description = 'Es teh manis segar yang sempurna untuk menemani makanan. Dingin dan menyegarkan.' WHERE name ILIKE '%es teh%';
UPDATE products SET description = 'Es jeruk segar dari jeruk asli yang diperas langsung. Manis, asam, dan menyegarkan.' WHERE name ILIKE '%es jeruk%';
UPDATE products SET description = 'Jus alpukat creamy dengan susu kental manis. Kaya nutrisi dan sangat mengenyangkan.' WHERE name ILIKE '%jus alpukat%';
UPDATE products SET description = 'Kopi hitam dengan aroma khas yang kuat. Sempurna untuk memulai hari atau menemani kerja.' WHERE name ILIKE '%kopi%';
UPDATE products SET description = 'Teh tarik dengan campuran susu yang creamy dan manis. Hangat dan nikmat.' WHERE name ILIKE '%teh tarik%';
UPDATE products SET description = 'Air mineral dingin untuk menyegarkan tenggorokan. Bersih dan menyehatkan.' WHERE name ILIKE '%air mineral%';
