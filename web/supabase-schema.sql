-- ============================================================
-- LifeDrop — Supabase Database Schema
-- Run this in Supabase SQL Editor (SQL Editor > New query)
-- ============================================================

-- 1. Profiles table (linked to auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  blood_type text not null default 'unknown',
  sex text not null default 'male',
  onboarding_completed boolean not null default false,
  notifications_enabled boolean not null default false,
  referral_code text unique,
  team_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Donations table
create table public.donations (
  id text primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date timestamptz not null,
  type text not null,
  location text,
  notes text,
  created_at timestamptz not null default now()
);

-- 3. User badges table
create table public.user_badges (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  badge_id text not null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

-- 4. Referrals table
create table public.referrals (
  id uuid default gen_random_uuid() primary key,
  referrer_id uuid references public.profiles(id) on delete cascade not null,
  referred_id uuid references public.profiles(id) on delete cascade not null,
  referral_code text not null,
  referred_first_donation boolean not null default false,
  created_at timestamptz not null default now(),
  unique(referred_id)
);

-- 6. Indexes for performance
create index idx_donations_user_id on public.donations(user_id);
create index idx_donations_date on public.donations(date desc);
create index idx_user_badges_user_id on public.user_badges(user_id);
create index idx_referrals_referrer on public.referrals(referrer_id);
create index idx_referrals_code on public.referrals(referral_code);

-- 5. Enable Row Level Security
alter table public.profiles enable row level security;
alter table public.donations enable row level security;
alter table public.user_badges enable row level security;
alter table public.referrals enable row level security;

-- 6. RLS Policies — users can only access their own data

-- Profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Donations
create policy "Users can view own donations"
  on public.donations for select
  using (auth.uid() = user_id);

create policy "Users can insert own donations"
  on public.donations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own donations"
  on public.donations for update
  using (auth.uid() = user_id);

create policy "Users can delete own donations"
  on public.donations for delete
  using (auth.uid() = user_id);

-- User Badges
create policy "Users can view own badges"
  on public.user_badges for select
  using (auth.uid() = user_id);

create policy "Users can insert own badges"
  on public.user_badges for insert
  with check (auth.uid() = user_id);

create policy "Users can upsert own badges"
  on public.user_badges for update
  using (auth.uid() = user_id);

create policy "Users can delete own badges"
  on public.user_badges for delete
  using (auth.uid() = user_id);

-- Referrals
create policy "Users can view own referrals"
  on public.referrals for select
  using (auth.uid() = referrer_id or auth.uid() = referred_id);

create policy "Users can insert referrals"
  on public.referrals for insert
  with check (auth.uid() = referred_id);

-- Auto-update updated_at on profiles
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();
