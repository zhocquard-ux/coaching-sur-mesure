-- Positionnement "accompagnement humain" : chaque cliente choisit si elle
-- veut rejoindre le groupe WhatsApp de la communauté ou rester en suivi
-- privé uniquement, et la coach programme un prochain call (point hebdo,
-- bilan...) avec une note — visible sur le tableau de bord pour ne pas
-- perdre le fil de la relation avec chacune.
alter table clientes add column if not exists preference_suivi text default 'groupe'; -- 'groupe' | 'prive'
alter table clientes add column if not exists prochain_call timestamptz;
alter table clientes add column if not exists notes_call text;

-- Le planning partagé à la cliente doit aussi porter ces deux infos (le lien
-- du groupe WhatsApp lui-même est un réglage unique pour toute la communauté,
-- géré côté site, pas par cliente).
drop function if exists get_planning_partage(uuid);

create or replace function get_planning_partage(p_cliente_id uuid)
returns table (
  prenom text,
  niveau text,
  zones_prioritaires jsonb,
  dernier_planning_sport jsonb,
  dernier_planning_repas jsonb,
  derniere_liste_courses jsonb,
  preference_suivi text,
  prochain_call timestamptz,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select prenom, niveau, zones_prioritaires, dernier_planning_sport, dernier_planning_repas, derniere_liste_courses,
    preference_suivi, prochain_call, updated_at
  from clientes
  where id = p_cliente_id;
$$;

grant execute on function get_planning_partage(uuid) to anon;
