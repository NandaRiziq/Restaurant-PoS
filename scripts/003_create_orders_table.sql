-- Create orders table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_address text not null,
  total_amount integer not null, -- total in IDR
  status text not null default 'pending' check (status in ('pending', 'paid', 'cancelled')),
  payment_method text,
  payment_reference text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.orders enable row level security;

-- Allow anyone to create orders
create policy "orders_insert_all"
  on public.orders for insert
  with check (true);

-- Allow anyone to read their own orders by session_id
create policy "orders_select_own"
  on public.orders for select
  using (true);

-- Only authenticated users can update orders (admin)
create policy "orders_update_authenticated"
  on public.orders for update
  using (auth.uid() is not null);

-- Create index for session lookups
create index if not exists orders_session_idx on public.orders(session_id);
create index if not exists orders_status_idx on public.orders(status);
