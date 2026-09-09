create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254),
  telefono text not null check (char_length(telefono) between 1 and 40),
  modelo_camara text not null check (char_length(modelo_camara) between 1 and 120),
  instagram text check (instagram is null or char_length(instagram) <= 120),
  consentimiento boolean not null check (consentimiento = true),
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;
revoke all on table public.leads from anon, authenticated;
grant insert on table public.leads to anon;

create policy "public_can_register"
on public.leads for insert to anon
with check (consentimiento = true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('nikon-phos', 'nikon-phos', true, 10485760, array['image/jpeg', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
