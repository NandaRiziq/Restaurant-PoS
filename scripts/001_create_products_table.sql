-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price integer not null, -- price in IDR (no decimals)
  category text not null check (category in ('makanan', 'minuman')),
  image_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS (but allow public read access for storefront)
alter table public.products enable row level security;

-- Allow anyone to read products
create policy "products_select_all"
  on public.products for select
  using (true);

-- Only allow inserts/updates/deletes from authenticated users (admin)
create policy "products_insert_authenticated"
  on public.products for insert
  with check (auth.uid() is not null);

create policy "products_update_authenticated"
  on public.products for update
  using (auth.uid() is not null);

create policy "products_delete_authenticated"
  on public.products for delete
  using (auth.uid() is not null);

-- Create index for category filtering
create index if not exists products_category_idx on public.products(category);
