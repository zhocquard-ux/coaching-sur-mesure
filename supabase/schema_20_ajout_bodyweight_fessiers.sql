-- Comble un vrai trou de contenu repéré via le nouveau suivi de volume par
-- zone : les fessiers n'avaient plus AUCUN exercice au poids du corps
-- (materiel = 0) dans la bibliothèque, toutes les options restantes exigeant
-- du matériel (haltères, machine, poulie...). Résultat concret pour une
-- cliente sans matériel avec fessiers en zone prioritaire : 0 série/semaine
-- sur la zone qu'elle veut justement travailler, et le générateur comblait
-- la séance avec des zones hors sujet (abdos, mollets...). Ajout de 4
-- exercices poids du corps, sans contre-indication genoux/épaules pour
-- rester compatibles avec les profils qui évitent ces articulations.
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Pont Fessiers (Glute Bridge)', 'fessiers', 0, 0, 'renfo', '["dos"]'::jsonb, '4x15', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Pont Fessiers, Une Jambe au Sol', 'fessiers', 1, 0, 'renfo', '["dos"]'::jsonb, '3x10 par jambe', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Extension de Hanche Debout, Jambe Tendue', 'fessiers', 0, 0, 'renfo', '[]'::jsonb, '3x15 par jambe', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Clamshell (Palourde), Allongé sur le Côté', 'fessiers', 0, 0, 'renfo', '[]'::jsonb, '3x15 par côté', false);
