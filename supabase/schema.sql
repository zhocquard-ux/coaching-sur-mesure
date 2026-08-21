-- Coaching Sur-Mesure — schéma de sauvegarde des fiches clientes
-- À exécuter dans Supabase : Project → SQL Editor → coller → Run

create table if not exists clientes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- profil
  prenom text not null,
  age int,
  sexe text,
  objectif text,
  poids_actuel numeric,
  poids_souhaite numeric,
  niveau text,
  type_effort text,

  -- sport
  zones_prioritaires jsonb default '[]',
  problemes_sante jsonb default '[]',
  exclude_exercices jsonb default '[]',
  jours_dispo jsonb default '[]',
  duree_seance int,
  lieu text,
  materiel text,
  moment_prefere text,
  heure_reveil text,
  heure_debut_travail text,
  trajet_domicile_salle int,
  trajet_salle_travail int,

  -- nutrition
  vegetarien boolean default false,
  vegan boolean default false,
  sans_gluten boolean default false,
  sans_lactose boolean default false,
  aliments_evites jsonb default '[]',
  repas_inclus jsonb default '[]',

  -- dernier planning généré (snapshot, pour retrouver ce qui a été envoyé)
  dernier_planning_sport jsonb,
  dernier_planning_repas jsonb,
  derniere_liste_courses jsonb
);

-- Ne garder que la date de mise à jour à jour automatiquement
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists clientes_set_updated_at on clientes;
create trigger clientes_set_updated_at
  before update on clientes
  for each row execute function set_updated_at();

-- Sécurité : seule une personne connectée (toi) peut lire/écrire.
-- Outil mono-utilisatrice : pas de distinction par compte, juste "connecté ou pas".
alter table clientes enable row level security;

drop policy if exists "authenticated full access" on clientes;
create policy "authenticated full access" on clientes
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
