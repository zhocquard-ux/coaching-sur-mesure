-- Activités que la cliente a faites de son côté (ex : "course à pied 30 min"
-- un jour sans séance prévue) et que TOI tu ajoutes dans son suivi, pour que
-- son planning reflète ce qu'elle fait vraiment, pas seulement ce qui était
-- prévu au départ.
create table if not exists activites_libres (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  cliente_id uuid not null references clientes(id) on delete cascade,
  jour text not null,
  description text not null,
  duree_min int
);

alter table activites_libres enable row level security;

-- Toi (connectée) ajoutes/consultes/supprimes librement.
drop policy if exists "authenticated full access activites_libres" on activites_libres;
create policy "authenticated full access activites_libres" on activites_libres
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- La cliente consulte SES activités via son lien personnel (même principe
-- que le planning partagé et l'historique de performances : jeton
-- non-devinable plutôt qu'un accès anonyme ouvert sur la table).
create or replace function get_activites_libres(p_cliente_id uuid)
returns setof activites_libres
language sql
security definer
set search_path = public
as $$
  select * from activites_libres where cliente_id = p_cliente_id order by created_at asc;
$$;

grant execute on function get_activites_libres(uuid) to anon;
