-- Ajout de 9 exercices 100% poids du corps (dos, épaules, trapèzes).
-- Sans ces exercices, un client sans matériel n'avait plus AUCUN exercice
-- pour ces 3 zones après la suppression des machines/haltères (schema_08) —
-- déjà un peu vrai avant la suppression, mais devenu bloquant après.
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format) values ('Rowing Inversé sous Table', 'dos', 1, 0, 'renfo', '["dos","poignets"]'::jsonb, '3x10');
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format) values ('Extension du Dos au Sol (Superman Dos)', 'dos', 0, 0, 'renfo', '["dos"]'::jsonb, '3x15');
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format) values ('Rowing Isométrique en W, Allongé', 'dos', 0, 0, 'renfo', '["dos"]'::jsonb, '3x20s');
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format) values ('Pompes Piquées (Pike Push-Up)', 'epaules', 1, 0, 'renfo', '["epaules","poignets"]'::jsonb, '3x10');
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format) values ('Élévation Frontale Isométrique, Sans Charge', 'epaules', 0, 0, 'renfo', '["epaules"]'::jsonb, '3x20s');
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format) values ('Gainage Épaules en Planche Haute', 'epaules', 0, 0, 'renfo', '["epaules","poignets"]'::jsonb, '3x30s');
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format) values ('Y-Raise au Sol, Bras Tendus', 'trapezes', 0, 0, 'renfo', '["epaules"]'::jsonb, '3x15');
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format) values ('Rotation d''Épaules en Cercles, Debout', 'trapezes', 0, 0, 'renfo', '[]'::jsonb, '3x20 rotations');
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format) values ('Haussement d''Épaules Isométrique, Maintien', 'trapezes', 0, 0, 'renfo', '[]'::jsonb, '3x20s');
