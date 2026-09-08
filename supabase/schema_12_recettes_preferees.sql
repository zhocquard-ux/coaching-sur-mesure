-- Permet de marquer des recettes à privilégier pour une cliente, comme pour
-- les exercices préférés.
alter table clientes add column if not exists recettes_preferees jsonb default '[]';
