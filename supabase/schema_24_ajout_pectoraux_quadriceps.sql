-- Audit de stabilisation avant lancement : deux zones où absolument TOUS les
-- exercices existants partagent la même contre-indication, ce qui les vide
-- complètement pour un profil de santé courant, quel que soit le matériel.
-- - Pectoraux : les 6 exercices existants (développé, pompes, écarté...)
--   sont tous tagués "épaules" (logique, un mouvement de poussée horizontale
--   sollicite l'épaule) → 0 exercice pour une cliente qui signale une
--   douleur/contre-indication à l'épaule.
-- - Quadriceps : au poids du corps (matériel = aucun/quelques accessoires),
--   le seul exercice existant est tagué "hanches" → 0 exercice pour une
--   cliente qui évite la sollicitation des hanches.
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Développé Couché au Sol, Amplitude Limitée (Floor Press)', 'pectoraux', 0, 1, 'renfo', '[]'::jsonb, '3x12', true);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Pompes sur les Genoux, Amplitude Réduite', 'pectoraux', 0, 0, 'renfo', '[]'::jsonb, '3x12', true);
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Squat Isométrique au Mur (Wall Sit)', 'quadriceps', 0, 0, 'renfo', '["genoux"]'::jsonb, '3x30-45s', true);
-- Même chose pour biceps : le seul exercice poids du corps existant (rowing
-- inversé en supination) charge le dos par nature → 0 option pour une
-- cliente qui évite justement de solliciter son dos.
insert into exercices (nom, zone, niveau, materiel, type, contre_indications, format, polyarticulaire) values ('Curl Isométrique avec Serviette (Auto-Résistance)', 'biceps', 0, 0, 'renfo', '[]'::jsonb, '3x10', false);
