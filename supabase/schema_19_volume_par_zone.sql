-- Ajoute niveau et zones_prioritaires au planning partagé, pour que la page
-- cliente puisse afficher le même volume hebdomadaire par zone (séries de
-- renforcement/semaine vs objectif) que l'espace coach. On doit DROP avant
-- de recréer car la liste de colonnes du retour change.
drop function if exists get_planning_partage(uuid);

create or replace function get_planning_partage(p_cliente_id uuid)
returns table (
  prenom text,
  niveau text,
  zones_prioritaires jsonb,
  dernier_planning_sport jsonb,
  dernier_planning_repas jsonb,
  derniere_liste_courses jsonb,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select prenom, niveau, zones_prioritaires, dernier_planning_sport, dernier_planning_repas, derniere_liste_courses, updated_at
  from clientes
  where id = p_cliente_id;
$$;

grant execute on function get_planning_partage(uuid) to anon;
