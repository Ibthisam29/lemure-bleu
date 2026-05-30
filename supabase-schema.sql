-- ============================================================
-- LEMURE BLUE — Supabase PostgreSQL Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── VIP LEADS ──
create table if not exists vip_leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  country text not null,
  preferred_contact text,
  interest_type text,
  budget_range text,
  message text,
  status text not null default 'new'
    check (status in ('new','contacted','qualified','appointment_booked','converted','not_suitable')),
  admin_notes text,
  created_at timestamptz not null default now()
);

-- ── APPOINTMENTS ──
create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  preferred_date date not null,
  preferred_time time,
  appointment_type text not null,
  budget_range text,
  message text,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','completed')),
  admin_notes text,
  created_at timestamptz not null default now()
);

-- ── PREORDERS ──
create table if not exists preorders (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text,
  stripe_customer_id text,
  stripe_payment_intent_id text,
  stripe_checkout_session_id text,
  preorder_tier text not null
    check (preorder_tier in ('blue_entry','maison','legacy')),
  amount numeric not null default 0,
  currency text not null default 'SGD',
  payment_status text not null default 'pending',
  allocation_status text not null default 'pending'
    check (allocation_status in ('pending','allocated','in_consultation','fulfilled','refunded')),
  assigned_stone_id uuid references stones(id) on delete set null,
  admin_notes text,
  created_at timestamptz not null default now()
);

-- ── STONES ──
create table if not exists stones (
  id uuid primary key default gen_random_uuid(),
  stone_name text not null,
  stone_type text,
  origin text,
  carat numeric,
  cut text,
  colour text,
  clarity text,
  treatment text default 'None',
  certificate_lab text,
  certificate_number text,
  description text,
  image_url text,
  price numeric,
  price_visibility text not null default 'price_on_request'
    check (price_visibility in ('price_on_request','starting_from','hidden')),
  status text not null default 'available'
    check (status in ('available','reserved','sold','private_viewing_only')),
  created_at timestamptz not null default now()
);

-- ── COLLECTIONS ──
create table if not exists collections (
  id uuid primary key default gen_random_uuid(),
  collection_name text not null,
  description text,
  launch_date date,
  quantity_total int not null default 0,
  quantity_available int not null default 0,
  price_range text,
  image_url text,
  stripe_price_id text,
  status text not null default 'draft'
    check (status in ('draft','published','sold_out')),
  created_at timestamptz not null default now()
);

-- ── SETTINGS ──
create table if not exists settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
alter table vip_leads enable row level security;
alter table appointments enable row level security;
alter table preorders enable row level security;
alter table stones enable row level security;
alter table collections enable row level security;
alter table settings enable row level security;

-- ── Anonymous users: INSERT only on public-facing tables ──
create policy "anon_insert_leads" on vip_leads
  for insert to anon with check (true);

create policy "anon_insert_appointments" on appointments
  for insert to anon with check (true);

-- ── Public read for stones (available/published) ──
create policy "public_read_stones" on stones
  for select to anon using (status != 'sold');

create policy "public_read_collections" on collections
  for select to anon using (status = 'published');

-- ── Service role (admin) has full access ──
-- The SUPABASE_SERVICE_ROLE_KEY bypasses RLS automatically.
-- No additional policies needed for admin operations.

-- ============================================================
-- INDEXES
-- ============================================================
create index on vip_leads (status);
create index on vip_leads (created_at desc);
create index on appointments (preferred_date);
create index on preorders (payment_status);
create index on preorders (created_at desc);
create index on stones (status);
create index on collections (status);
