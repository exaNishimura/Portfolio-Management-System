-- projects テーブル
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  image_url text,
  project_url text,
  github_url text,
  technologies text[] not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  is_featured boolean default false,
  project_year integer,
  project_scale text
);

-- categories テーブル
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now())
); 