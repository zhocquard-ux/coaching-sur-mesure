-- Historique des performances (poids × répétitions par exercice, à chaque
-- séance) pour que la cliente suive sa progression sur plusieurs semaines
-- ou mois, et que la coach voie la même chose depuis sa fiche.
create table if not exists performances (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  jour text not null,
  nom_exercice text not null,
  zone text,
  poids numeric,
  repetitions int
);

alter table performances enable row level security;

-- La cliente (non connectée, via son lien personnel) peut ajouter ses
-- performances, jamais les lire/modifier directement.
drop policy if exists "anon peut ajouter une performance" on performances;
create policy "anon peut ajouter une performance" on performances
  for insert
  with check (true);

drop policy if exists "authenticated full access performances" on performances;
create policy "authenticated full access performances" on performances
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Lecture de son propre historique via le lien personnel (id = jeton non
-- devinable, même principe que le planning partagé et le suivi hebdomadaire).
create or replace function get_performances(p_cliente_id uuid)
returns setof performances
language sql
security definer
set search_path = public
as $$
  select * from performances where cliente_id = p_cliente_id order by created_at asc;
$$;

grant execute on function get_performances(uuid) to anon;
