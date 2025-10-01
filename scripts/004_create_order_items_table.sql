-- Create order_items table to store order details
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name text not null, -- snapshot of product name at time of order
  product_price integer not null, -- snapshot of price at time of order
  quantity integer not null check (quantity > 0),
  subtotal integer not null, -- quantity * product_price
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.order_items enable row level security;

-- Allow anyone to read order items
create policy "order_items_select_all"
  on public.order_items for select
  using (true);

-- Allow anyone to insert order items (during checkout)
create policy "order_items_insert_all"
  on public.order_items for insert
  with check (true);

-- Create index for order lookups
create index if not exists order_items_order_idx on public.order_items(order_id);
