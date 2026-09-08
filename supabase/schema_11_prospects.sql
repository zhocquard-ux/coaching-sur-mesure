-- Fait le pont entre le questionnaire public (rempli par un nouveau prospect,
-- sans compte) et l'espace coach : chaque réponse arrive ici, prête à être
-- transformée en fiche cliente en un clic, sans tout retaper.

create table if not exists prospects (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  reponses jsonb not null,
  converti boolean not null default false,
  cliente_id uuid references clientes(id) on delete set null
);

alter table prospects enable row level security;

-- Le prospect (non connecté) peut seulement AJOUTER sa réponse, jamais lire/modifier.
drop policy if exists "anon peut ajouter un prospect" on prospects;
create policy "anon peut ajouter un prospect" on prospects
  for insert
  with check (true);

-- Toi (connectée) peux tout voir et tout gérer.
drop policy if exists "authenticated full access prospects" on prospects;
create policy "authenticated full access prospects" on prospects
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Coordonnées de contact, absentes jusqu'ici de la fiche cliente.
alter table clientes add column if not exists email text;
alter table clientes add column if not exists telephone text;
