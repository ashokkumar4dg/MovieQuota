create extension if not exists pgcrypto;

create table if not exists titles (
  id uuid primary key default gen_random_uuid(),
  source_id text unique,
  title text not null,
  content_type text not null default 'movie',
  industry text,
  language text,
  overview text,
  poster_url text,
  backdrop_url text,
  release_date date,
  runtime text,
  imdb_rating numeric(3,1),
  tmdb_rating numeric(3,1),
  genres jsonb default '[]'::jsonb,
  popularity_score numeric default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists anonymous_users (
  id uuid primary key default gen_random_uuid(),
  device_token text unique not null,
  first_seen_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

create table if not exists daily_batches (
  id uuid primary key default gen_random_uuid(),
  batch_date date not null,
  title_id uuid not null references titles(id) on delete cascade,
  slot_number int not null,
  created_at timestamptz not null default now(),
  unique (batch_date, slot_number)
);

create table if not exists user_actions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references anonymous_users(id) on delete cascade,
  title_id uuid not null references titles(id) on delete cascade,
  action_date date not null,
  swipe_direction text,
  liked boolean not null default false,
  rating int check (rating between 1 and 10),
  acted_at timestamptz not null default now(),
  unique (user_id, title_id, action_date)
);

create or replace view daily_titles_api as
select
  t.id::text as id,
  coalesce(t.source_id, t.id::text) as source_id,
  t.title,
  initcap(t.content_type) as type,
  coalesce(t.industry, 'Mixed') as industry,
  extract(year from t.release_date)::text as year,
  coalesce(t.runtime, 'Trending pick') as duration,
  coalesce(t.imdb_rating, 0)::text as imdb_rating,
  coalesce(t.tmdb_rating, 0)::text as tmdb_rating,
  coalesce(array(select jsonb_array_elements_text(t.genres)), array['Trending']) as genres,
  coalesce(t.overview, 'Fresh recommendation for today.') as overview,
  coalesce(t.poster_url, t.backdrop_url) as poster_url
from daily_batches b
join titles t on t.id = b.title_id
where b.batch_date = current_date
order by b.slot_number asc;
