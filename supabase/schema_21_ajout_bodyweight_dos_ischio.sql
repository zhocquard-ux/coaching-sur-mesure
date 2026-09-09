-- Autre trou de contenu du même type que les fessiers (schema_20) : pour une
-- cliente sans matériel ET ayant signalé des douleurs de dos, TOUS les
-- exercices dos et ischio-jambiers de la bibliothèque étaient soit trop
-- lourds en matériel, soit eux-mêmes tagués contre-indication "dos" (rowing,
-- tirage...). Résultat : 0 exercice disponible sur ces deux zones, même
-- quand elles sont prioritaires. Ajout de mouvements poids du corps qui ne
-- chargent pas la colonne (gainage, stabilisation, hip-hinge debout) —
-- des exercices couramment recommandés en rééducation du dos, pas seulement
-- tolérés.
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Bird Dog (Quadrupédie, Bras-Jambe Opposés)', 'dos', 0, 0, 'renfo', '["poignets"]'::jsonb, '3x10 par côté', true);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Rétraction Scapulaire, Debout Bras Tendus', 'dos', 0, 0, 'renfo', '[]'::jsonb, '3x15', false);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Extension de Hanche Debout, Genou Fléchi (Insistance Ischio-Jambiers)', 'ischio_jambiers', 0, 0, 'renfo', '[]'::jsonb, '3x15 par jambe', false);
