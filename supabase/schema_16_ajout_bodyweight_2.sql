-- Comble les zones tombées à 0 exercice pour les client·es sans matériel ou
-- avec peu d'équipement, suite à la suppression des doublons (2e vague) :
-- avant-bras, biceps, triceps, épaules (variante débutante), ischio-jambiers,
-- mollets, adducteurs. Testé sur toutes les combinaisons niveau/objectif/matériel.
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Pompes sur les Poings (Renforcement des Poignets)', 'avant_bras', 0, 0, 'renfo', '["poignets"]'::jsonb, '3x10', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Suspension à la Barre (Dead Hang)', 'avant_bras', 0, 1, 'renfo', '["epaules"]'::jsonb, '3x20-30s', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Curl Australien (Rowing Inversé, Prise Supination)', 'biceps', 0, 0, 'renfo', '["dos"]'::jsonb, '3x10', true);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Pompes Diamant (Prise Serrée en Losange)', 'triceps', 0, 0, 'renfo', '["poignets","epaules"]'::jsonb, '3x10', true);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Pike Push-Up sur les Genoux (Version Débutante)', 'epaules', 0, 0, 'renfo', '["epaules","poignets"]'::jsonb, '3x10', true);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Pont Ischio-Jambiers, Une Jambe au Sol', 'ischio_jambiers', 0, 0, 'renfo', '["dos"]'::jsonb, '3x10', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Flexion des Jambes Glissée, Serviette au Sol', 'ischio_jambiers', 1, 1, 'renfo', '["genoux"]'::jsonb, '3x10', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Extension des Mollets au Sol, Debout', 'mollets', 0, 0, 'renfo', '["chevilles"]'::jsonb, '3x15', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Extension des Mollets sur Marche, Poids du Corps', 'mollets', 0, 0, 'renfo', '["chevilles"]'::jsonb, '3x15', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Adduction de la Hanche au Sol, Allongé', 'adducteurs', 0, 0, 'renfo', '["hanches"]'::jsonb, '3x12', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Squat Sumo au Poids du Corps', 'adducteurs', 0, 0, 'renfo', '["genoux","hanches"]'::jsonb, '3x12', true);
