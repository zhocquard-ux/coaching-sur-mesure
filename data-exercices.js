/* Bibliothèque d'exercices — base de départ.
   niveau / materiel sont des SEUILS MINIMUM (un client de niveau supérieur
   ou avec plus de matériel a accès à l'exercice) :
     niveau      : 0 débutant · 1 intermédiaire · 2 avancé
     materiel    : 0 aucun · 1 quelques accessoires · 2 équipement complet
   type          : "renfo" ou "cardio"
   zone          : torse | dos | epaules | bras | abdos | jambes | fessiers | full_body
   contre_indications : tags de zones sensibles à éviter (genoux, dos, epaules, poignets, hanches, chevilles) */

const EXERCICES = [
  // ---- TORSE ----
  { id:"pompes", nom:"Pompes", zone:"torse", niveau:0, materiel:0, type:"renfo", contre_indications:["poignets","epaules"], format:"4x10" },
  { id:"pompes-genoux", nom:"Pompes sur les genoux", zone:"torse", niveau:0, materiel:0, type:"renfo", contre_indications:["poignets"], format:"3x12" },
  { id:"developpe-couche-halteres", nom:"Développé couché haltères", zone:"torse", niveau:1, materiel:1, type:"renfo", contre_indications:["epaules"], format:"4x10" },
  { id:"developpe-couche-barre", nom:"Développé couché barre", zone:"torse", niveau:2, materiel:2, type:"renfo", contre_indications:["epaules","poignets"], format:"5x6" },
  { id:"ecarte-halteres", nom:"Écarté haltères au sol", zone:"torse", niveau:1, materiel:1, type:"renfo", contre_indications:["epaules"], format:"3x12" },
  { id:"dips-banc", nom:"Dips sur banc", zone:"torse", niveau:1, materiel:1, type:"renfo", contre_indications:["epaules","poignets"], format:"3x12" },
  { id:"pompes-surelevees", nom:"Pompes mains surélevées", zone:"torse", niveau:0, materiel:1, type:"renfo", contre_indications:["poignets"], format:"3x12" },
  { id:"pull-over", nom:"Pull-over haltère", zone:"torse", niveau:1, materiel:1, type:"renfo", contre_indications:["epaules"], format:"3x12" },

  // ---- DOS ----
  { id:"rowing-halteres", nom:"Rowing haltères buste penché", zone:"dos", niveau:0, materiel:1, type:"renfo", contre_indications:["dos"], format:"4x10" },
  { id:"rowing-elastique", nom:"Rowing élastique", zone:"dos", niveau:0, materiel:1, type:"renfo", contre_indications:[], format:"3x15" },
  { id:"tirage-vertical", nom:"Tirage vertical poulie", zone:"dos", niveau:1, materiel:2, type:"renfo", contre_indications:["epaules"], format:"4x10" },
  { id:"tractions-assistees", nom:"Tractions assistées", zone:"dos", niveau:2, materiel:2, type:"renfo", contre_indications:["epaules","poignets"], format:"4x6" },
  { id:"superman", nom:"Superman", zone:"dos", niveau:0, materiel:0, type:"renfo", contre_indications:["dos"], format:"3x15" },
  { id:"good-morning", nom:"Good morning léger", zone:"dos", niveau:1, materiel:1, type:"renfo", contre_indications:["dos"], format:"3x12" },
  { id:"rowing-barre", nom:"Rowing barre", zone:"dos", niveau:2, materiel:2, type:"renfo", contre_indications:["dos"], format:"4x8" },
  { id:"extension-lombaire", nom:"Extension lombaire au sol", zone:"dos", niveau:0, materiel:0, type:"renfo", contre_indications:["dos"], format:"3x15" },

  // ---- ÉPAULES ----
  { id:"elevations-laterales", nom:"Élévations latérales haltères", zone:"epaules", niveau:0, materiel:1, type:"renfo", contre_indications:["epaules"], format:"3x15" },
  { id:"developpe-militaire", nom:"Développé militaire haltères", zone:"epaules", niveau:1, materiel:1, type:"renfo", contre_indications:["epaules"], format:"4x10" },
  { id:"elevations-frontales", nom:"Élévations frontales", zone:"epaules", niveau:0, materiel:1, type:"renfo", contre_indications:["epaules"], format:"3x12" },
  { id:"oiseau", nom:"Oiseau (deltoïde arrière)", zone:"epaules", niveau:1, materiel:1, type:"renfo", contre_indications:["epaules"], format:"3x15" },
  { id:"pike-push-up", nom:"Pike push-up", zone:"epaules", niveau:1, materiel:0, type:"renfo", contre_indications:["epaules","poignets"], format:"3x10" },
  { id:"developpe-machine", nom:"Développé épaules machine", zone:"epaules", niveau:2, materiel:2, type:"renfo", contre_indications:["epaules"], format:"4x10" },

  // ---- BRAS ----
  { id:"curl-biceps", nom:"Curl biceps haltères", zone:"bras", niveau:0, materiel:1, type:"renfo", contre_indications:["poignets"], format:"3x12" },
  { id:"extension-triceps", nom:"Extension triceps haltère", zone:"bras", niveau:0, materiel:1, type:"renfo", contre_indications:["epaules","poignets"], format:"3x12" },
  { id:"dips-chaise", nom:"Dips entre deux chaises", zone:"bras", niveau:1, materiel:0, type:"renfo", contre_indications:["poignets","epaules"], format:"3x12" },
  { id:"curl-marteau", nom:"Curl marteau", zone:"bras", niveau:0, materiel:1, type:"renfo", contre_indications:["poignets"], format:"3x12" },
  { id:"triceps-poulie", nom:"Extension triceps poulie", zone:"bras", niveau:1, materiel:2, type:"renfo", contre_indications:["poignets"], format:"3x15" },
  { id:"curl-barre", nom:"Curl barre", zone:"bras", niveau:1, materiel:2, type:"renfo", contre_indications:["poignets"], format:"4x10" },

  // ---- ABDOS ----
  { id:"gainage", nom:"Gainage planche", zone:"abdos", niveau:0, materiel:0, type:"renfo", contre_indications:["poignets"], format:"3x30s" },
  { id:"gainage-lateral", nom:"Gainage latéral", zone:"abdos", niveau:0, materiel:0, type:"renfo", contre_indications:["epaules"], format:"3x20s/côté" },
  { id:"crunch", nom:"Crunch", zone:"abdos", niveau:0, materiel:0, type:"renfo", contre_indications:["dos"], format:"3x20" },
  { id:"releve-jambes", nom:"Relevé de jambes suspendu", zone:"abdos", niveau:2, materiel:2, type:"renfo", contre_indications:["dos","epaules"], format:"3x12" },
  { id:"mountain-climber-abdo", nom:"Mountain climbers lents", zone:"abdos", niveau:0, materiel:0, type:"renfo", contre_indications:["poignets"], format:"3x20" },
  { id:"russian-twist", nom:"Russian twist", zone:"abdos", niveau:1, materiel:0, type:"renfo", contre_indications:["dos"], format:"3x20" },
  { id:"roulette-abdo", nom:"Roulette abdominale", zone:"abdos", niveau:2, materiel:1, type:"renfo", contre_indications:["dos","epaules"], format:"3x10" },
  { id:"bicycle-crunch", nom:"Bicycle crunch", zone:"abdos", niveau:1, materiel:0, type:"renfo", contre_indications:["dos"], format:"3x20" },

  // ---- JAMBES ----
  { id:"squat-poids-corps", nom:"Squat poids de corps", zone:"jambes", niveau:0, materiel:0, type:"renfo", contre_indications:["genoux"], format:"4x15" },
  { id:"squat-gobelet", nom:"Squat gobelet", zone:"jambes", niveau:0, materiel:1, type:"renfo", contre_indications:["genoux"], format:"4x12" },
  { id:"fentes", nom:"Fentes alternées", zone:"jambes", niveau:1, materiel:0, type:"renfo", contre_indications:["genoux"], format:"3x12/jambe" },
  { id:"squat-bulgare", nom:"Squat bulgare", zone:"jambes", niveau:2, materiel:1, type:"renfo", contre_indications:["genoux","chevilles"], format:"3x10/jambe" },
  { id:"presse-jambes", nom:"Presse à cuisses", zone:"jambes", niveau:1, materiel:2, type:"renfo", contre_indications:["genoux"], format:"4x12" },
  { id:"leg-extension", nom:"Leg extension machine", zone:"jambes", niveau:1, materiel:2, type:"renfo", contre_indications:["genoux"], format:"3x15" },
  { id:"leg-curl", nom:"Leg curl machine", zone:"jambes", niveau:1, materiel:2, type:"renfo", contre_indications:["genoux"], format:"3x15" },
  { id:"squat-barre", nom:"Squat barre", zone:"jambes", niveau:2, materiel:2, type:"renfo", contre_indications:["genoux","dos"], format:"5x6" },
  { id:"mollets-debout", nom:"Mollets debout", zone:"jambes", niveau:0, materiel:1, type:"renfo", contre_indications:["chevilles"], format:"4x15" },
  { id:"marche-fentes", nom:"Marche fentes avant", zone:"jambes", niveau:1, materiel:0, type:"renfo", contre_indications:["genoux"], format:"3x10/jambe" },

  // ---- FESSIERS ----
  { id:"hip-thrust", nom:"Hip thrust poids de corps", zone:"fessiers", niveau:0, materiel:0, type:"renfo", contre_indications:["hanches"], format:"4x15" },
  { id:"hip-thrust-charge", nom:"Hip thrust chargé", zone:"fessiers", niveau:1, materiel:1, type:"renfo", contre_indications:["hanches"], format:"4x12" },
  { id:"pont-fessier", nom:"Pont fessier", zone:"fessiers", niveau:0, materiel:0, type:"renfo", contre_indications:["hanches"], format:"3x15" },
  { id:"souleve-terre-jambes-tendues", nom:"Soulevé de terre jambes tendues", zone:"fessiers", niveau:1, materiel:1, type:"renfo", contre_indications:["dos","hanches"], format:"3x12" },
  { id:"abduction-hanche", nom:"Abduction de hanche élastique", zone:"fessiers", niveau:0, materiel:1, type:"renfo", contre_indications:["hanches"], format:"3x15/côté" },
  { id:"donkey-kick", nom:"Donkey kick", zone:"fessiers", niveau:0, materiel:0, type:"renfo", contre_indications:["genoux","hanches"], format:"3x15/côté" },
  { id:"souleve-terre-sumo", nom:"Soulevé de terre sumo", zone:"fessiers", niveau:2, materiel:2, type:"renfo", contre_indications:["dos","hanches"], format:"4x8" },
  { id:"step-up", nom:"Step-up sur banc", zone:"fessiers", niveau:1, materiel:1, type:"renfo", contre_indications:["genoux"], format:"3x10/jambe" },

  // ---- FULL BODY / CARDIO ----
  { id:"marche-rapide", nom:"Marche rapide", zone:"full_body", niveau:0, materiel:0, type:"cardio", contre_indications:[], format:"20-30 min" },
  { id:"jumping-jacks", nom:"Jumping jacks", zone:"full_body", niveau:0, materiel:0, type:"cardio", contre_indications:["genoux","chevilles"], format:"4x30s" },
  { id:"corde-a-sauter", nom:"Corde à sauter", zone:"full_body", niveau:1, materiel:1, type:"cardio", contre_indications:["genoux","chevilles"], format:"5x1min" },
  { id:"mountain-climbers", nom:"Mountain climbers", zone:"full_body", niveau:1, materiel:0, type:"cardio", contre_indications:["poignets"], format:"4x30s" },
  { id:"burpees", nom:"Burpees", zone:"full_body", niveau:2, materiel:0, type:"cardio", contre_indications:["genoux","poignets","epaules"], format:"4x10" },
  { id:"velo-elliptique", nom:"Vélo elliptique", zone:"full_body", niveau:0, materiel:2, type:"cardio", contre_indications:[], format:"20-30 min" },
  { id:"rameur", nom:"Rameur", zone:"full_body", niveau:1, materiel:2, type:"cardio", contre_indications:["dos"], format:"15-20 min" },
  { id:"hiit-poids-corps", nom:"Circuit HIIT poids de corps", zone:"full_body", niveau:2, materiel:0, type:"cardio", contre_indications:["genoux","poignets"], format:"6x40s/20s repos" },
  { id:"squat-jump", nom:"Squat jump", zone:"full_body", niveau:2, materiel:0, type:"cardio", contre_indications:["genoux","chevilles"], format:"4x12" },
  { id:"circuit-full-body-leger", nom:"Circuit léger poids de corps", zone:"full_body", niveau:0, materiel:0, type:"renfo", contre_indications:[], format:"3 tours" },
];

if (typeof module !== "undefined") module.exports = EXERCICES;
