-- Run this in Supabase SQL Editor: supabase.com/dashboard/project/xiikmczdaehbnalmhpdd/sql

-- EVENTS TABLE
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_date timestamptz,
  location text,
  event_type text default 'private',
  image_url text,
  cta_label text default 'Register Interest',
  cta_link text default '/vip',
  visible boolean default true,
  featured boolean default false,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ADS / BANNERS TABLE
create table if not exists ads (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  image_url text,
  cta_label text,
  cta_link text,
  position text default 'homepage_banner',
  bg_color text default '#1C3D35',
  text_color text default '#F7F2E8',
  visible boolean default true,
  sort_order int default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS
alter table events enable row level security;
alter table ads enable row level security;

create policy if not exists "public_read_events" on events for select to anon using (visible = true);
create policy if not exists "public_read_ads" on ads for select to anon using (visible = true);

-- Add missing columns
alter table stones add column if not exists visible boolean default true;
alter table products add column if not exists price_amount numeric;
