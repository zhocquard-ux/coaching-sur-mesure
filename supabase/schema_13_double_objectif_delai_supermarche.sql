-- Objectif secondaire (ex: perte de poids + prise de muscle en même temps),
-- délai souhaité pour la transformation (pour ajuster l'intensité hors salle),
-- et supermarché de référence pour l'estimation des prix.
alter table clientes add column if not exists objectif_secondaire text;
alter table clientes add column if not exists delai_mois int;
alter table clientes add column if not exists supermarche text default 'leclerc';
