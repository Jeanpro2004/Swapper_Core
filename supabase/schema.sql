drop table if exists public.garments cascade;

create table public.garments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid null,
  title text not null,
  description text,
  size text not null,
  brand text,
  condition text not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.garments disable row level security;

create table if not exists public.styles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamp with time zone default now()
);

insert into public.styles (name, description)
values
('Minimalista', 'Estilo limpio, simple y funcional.'),
('Vintage', 'Estilo inspirado en prendas clásicas o retro.'),
('Streetwear', 'Estilo urbano, casual y moderno.'),
('Grunge', 'Estilo alternativo con estética rebelde y noventera.'),
('Y2K', 'Estilo inspirado en la moda de los años 2000.')
on conflict (name) do nothing;

alter table public.garments
add column if not exists style_id uuid references public.styles(id);

create index if not exists idx_garments_style_id
on public.garments(style_id);