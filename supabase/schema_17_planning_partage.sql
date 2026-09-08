-- Permet d'envoyer un lien public à la cliente pour consulter son planning
-- (sport + nutrition + liste de courses) sans compte, comme le lien de
-- suivi hebdomadaire. Expose uniquement les champs nécessaires (jamais
-- l'âge, le poids, les coordonnées ou les problèmes de santé) et ne permet
-- de modifier qu'un champ numérique précis (poids utilisé sur un exercice
-- donné), jamais du texte libre — pour éviter tout risque d'injection dans
-- l'espace coach.

create or replace function get_planning_partage(p_cliente_id uuid)
returns table (
  prenom text,
  dernier_planning_sport jsonb,
  dernier_planning_repas jsonb,
  derniere_liste_courses jsonb,
  updated_at timestamptz
)
language sql
security definer
set search_path = public
as $$
  select prenom, dernier_planning_sport, dernier_planning_repas, derniere_liste_courses, updated_at
  from clientes
  where id = p_cliente_id;
$$;

grant execute on function get_planning_partage(uuid) to anon;

create or replace function set_poids_exercice(p_cliente_id uuid, p_jour text, p_nom_exercice text, p_poids numeric)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  plan jsonb;
  i int;
  j int;
begin
  select dernier_planning_sport into plan from clientes where id = p_cliente_id;
  if plan is null then
    return;
  end if;
  for i in 0 .. jsonb_array_length(plan->'seances') - 1 loop
    if (plan->'seances'->i->>'jour') = p_jour then
      for j in 0 .. jsonb_array_length(plan->'seances'->i->'exercices') - 1 loop
        if (plan->'seances'->i->'exercices'->j->>'nom') = p_nom_exercice then
          plan := jsonb_set(plan, array['seances', i::text, 'exercices', j::text, 'poidsUtilise'], to_jsonb(p_poids::text));
        end if;
      end loop;
    end if;
  end loop;
  update clientes set dernier_planning_sport = plan where id = p_cliente_id;
end;
$$;

grant execute on function set_poids_exercice(uuid, text, text, numeric) to anon;
