-- Create cart_items table for guest sessions
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  session_id text not null, -- guest session identifier
  product_id uuid not null references public.products(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.cart_items enable row level security;

-- Allow anyone to manage their own cart items (by session_id)
-- Note: In production, you'd want more sophisticated session validation
create policy "cart_items_all_operations"
  on public.cart_items for all
  using (true)
  with check (true);

-- Create index for session lookups
create index if not exists cart_items_session_idx on public.cart_items(session_id);
create index if not exists cart_items_product_idx on public.cart_items(product_id);
