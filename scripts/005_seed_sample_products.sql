-- Seed sample products
insert into public.products (name, price, category, image_url) values
  ('Nasi Goreng Spesial', 25000, 'makanan', '/placeholder.svg?height=300&width=300'),
  ('Mie Goreng', 20000, 'makanan', '/placeholder.svg?height=300&width=300'),
  ('Ayam Bakar', 30000, 'makanan', '/placeholder.svg?height=300&width=300'),
  ('Sate Ayam', 28000, 'makanan', '/placeholder.svg?height=300&width=300'),
  ('Gado-Gado', 22000, 'makanan', '/placeholder.svg?height=300&width=300'),
  ('Rendang', 35000, 'makanan', '/placeholder.svg?height=300&width=300'),
  ('Es Teh Manis', 8000, 'minuman', '/placeholder.svg?height=300&width=300'),
  ('Es Jeruk', 10000, 'minuman', '/placeholder.svg?height=300&width=300'),
  ('Kopi Susu', 15000, 'minuman', '/placeholder.svg?height=300&width=300'),
  ('Es Kelapa Muda', 12000, 'minuman', '/placeholder.svg?height=300&width=300'),
  ('Jus Alpukat', 18000, 'minuman', '/placeholder.svg?height=300&width=300'),
  ('Air Mineral', 5000, 'minuman', '/placeholder.svg?height=300&width=300')
on conflict do nothing;
