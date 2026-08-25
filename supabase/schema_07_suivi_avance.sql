-- Suivi hebdomadaire enrichi : mesures, satiété, force ressentie, sommeil,
-- satisfaction, pour donner au coach un vrai retour sur la progression
-- (prise de masse, sèche...) au fil des semaines.

alter table checkins add column if not exists tour_taille numeric;
alter table checkins add column if not exists sommeil int;
alter table checkins add column if not exists appetit int;
alter table checkins add column if not exists ressenti_force int;
alter table checkins add column if not exists satisfaction int;
