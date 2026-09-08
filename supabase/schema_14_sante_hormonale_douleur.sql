-- Champs santé additionnels : conditions hormonales/menstruelles (règles
-- douloureuses, endométriose, SOPK), maladie chronique (texte libre, pour un
-- conjoint ou toute autre condition non listée), et un mode "douleur en ce
-- moment" pour adapter une séance ponctuellement.
-- Ce ne sont pas des recommandations médicales — juste des adaptations
-- d'entraînement courantes, la cliente reste invitée à consulter un médecin.
alter table clientes add column if not exists sante_hormonale jsonb default '[]';
alter table clientes add column if not exists maladie_chronique text;
alter table clientes add column if not exists douleur_actuelle boolean default false;
alter table clientes add column if not exists jours_repos jsonb default '[]';

-- Exercices abdominaux/obliques à charge ou pression intra-abdominale élevée
-- (roulette, relevé de jambes suspendu, rotations lestées...) : à éviter en
-- cas de douleurs pelviennes/menstruelles aiguës selon les recommandations
-- courantes de kinésithérapie. Nouveau tag 'abdo_intense' ajouté à leurs
-- contre-indications existantes.
update exercices set contre_indications = contre_indications || '["abdo_intense"]'::jsonb where nom in (
  'Relevé de Jambes Suspendu',
  'Roulette à la Barre',
  'Roulette à la Barre EZ',
  'Roulette avec Haltères',
  'Roulette avec Roue Abdominale',
  'Crunch à la Machine',
  'Relevé de Jambes à la Machine',
  'Rotation Russe',
  'Rotation Russe avec Haltère',
  'Rotation Russe avec Kettlebell',
  'Rotation du Buste à la Barre',
  'Rotation du Buste à la Landmine',
  'Rotation du Buste à la Machine',
  'Rotation du Buste à la Poulie',
  'Rotation du Buste à la Poulie, Assis',
  'Crunch avec Rotation'
);

-- Recettes plus riches en oméga-3, fer et magnésium (souvent recommandés en
-- cas de règles douloureuses / endométriose), marquées d'un profil
-- supplémentaire pour être proposées en priorité quand pertinent.
update recettes set profils = profils || '["anti_inflammatoire"]'::jsonb where nom in (
  'Pavé de saumon, patate douce, haricots verts',
  'Bœuf haché maigre, quinoa, haricots rouges',
  'Lentilles corail, légumes racines',
  'Poke bowl saumon, riz vinaigré, edamame',
  'Smoothie protéiné banane-épinards',
  'Yaourt grec, muesli, graines de chia',
  'Mélange noix et fruits secs',
  'Fruit frais et poignée d''oléagineux',
  'Chili sin carne (haricots rouges, maïs)',
  'Curry de pois chiches, lait de coco, riz',
  'Poulet au curry léger, légumes, riz',
  'Steak haché, pommes de terre, salade verte'
);
