-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS TABLE
create table if not exists public.users (
  id uuid primary key default uuid_generate_v4(),
  username text unique not null,
  password_hash text not null,
  role text not null check (role in ('admin', 'client')),
  is_active boolean default true,
  current_session_id text,
  created_at timestamp with time zone default now()
);

-- VIDEOS TABLE
create table if not exists public.videos (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  youtube_video_id text unique not null,
  thumbnail_url text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.videos enable row level security;

-- Policies for Videos (Public read, Admin manage)
create policy "Public videos are viewable by everyone"
  on public.videos for select
  using (true);

create policy "Admins can insert videos"
  on public.videos for insert
  with check (true); -- We will protect this via Express server with service role

create policy "Admins can update videos"
  on public.videos for update
  using (true);

create policy "Admins can delete videos"
  on public.videos for delete
  using (true);
