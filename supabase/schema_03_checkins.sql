-- Suivi hebdomadaire (check-in) — rempli par la cliente elle-même via un lien
-- personnel, sans compte. Toi seule peux consulter les réponses.

create table if not exists checkins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  poids numeric,
  energie int,
  sport_suivi int,
  nutrition_suivi int,
  difficultes text,
  commentaire text
);

alter table checkins enable row level security;

-- La cliente (non connectée) peut seulement AJOUTER un check-in, jamais lire/modifier.
drop policy if exists "anon peut ajouter un checkin" on checkins;
create policy "anon peut ajouter un checkin" on checkins
  for insert
  with check (true);

-- Toi (connectée) peux tout voir et tout gérer.
drop policy if exists "authenticated full access checkins" on checkins;
create policy "authenticated full access checkins" on checkins
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
