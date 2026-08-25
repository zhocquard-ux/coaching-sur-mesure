/* Moteur de génération — planning sport + planning repas + liste de courses.
   Dépend de EXERCICES (data-exercices.js) et RECETTES (data-recettes.js). */

const JOURS = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
const NIVEAU_TIER = { debutant:0, intermediaire:1, avance:2 };
const MATERIEL_TIER = { aucun:0, quelques_accessoires:1, complet:2 };
const RATIO_CARDIO = { perte_poids:0.6, tonus:0.2, energie:0.4, reprise:0.4, endurance:0.7 };

function minutesToHHMM(min){
  const h = Math.floor(((min % 1440) + 1440) % 1440 / 60);
  const m = Math.floor(((min % 1440) + 1440) % 1440 % 60);
  return `${String(h).padStart(2,"0")}h${String(m).padStart(2,"0")}`;
}

// ---------------------------------------------------------------- SPORT ----

function nbSeances(niveau, joursDispoCount){
  const ranges = { debutant:[2,3], intermediaire:[3,4], avance:[4,5] };
  const [lo, hi] = ranges[niveau];
  const n = Math.min(hi, joursDispoCount);
  return Math.max(1, n);
}

function choisirJours(joursDispoTries, n){
  if (joursDispoTries.length <= n) return joursDispoTries.slice();
  const chosen = [];
  const step = joursDispoTries.length / n;
  for (let i=0;i<n;i++) chosen.push(joursDispoTries[Math.min(joursDispoTries.length-1, Math.floor(i*step))]);
  return [...new Set(chosen)];
}

function getSplit(n){
  if (n <= 1) return ["Full Body"];
  if (n === 2) return ["Full Body A","Full Body B"];
  if (n === 3) return ["Full Body A","Full Body B","Full Body C"];
  if (n === 4) return ["Haut du corps","Bas du corps","Haut du corps","Bas du corps"];
  return ["Push","Pull","Jambes","Full Body","Zone prioritaire"];
}

function zonesPourJour(typeJour, zonesPrioritaires, indexFullBody){
  const rotationFullBody = [
    ["pectoraux","dos","quadriceps","abdominaux"],
    ["epaules","biceps","triceps","fessiers","ischio_jambiers"],
    ["dos","pectoraux","fessiers","obliques","mollets"],
  ];
  switch(typeJour){
    case "Haut du corps": return ["pectoraux","dos","epaules","biceps","triceps","trapezes","avant_bras"];
    case "Bas du corps": return ["quadriceps","ischio_jambiers","fessiers","mollets","adducteurs","abdominaux"];
    case "Push": return ["pectoraux","epaules","triceps"];
    case "Pull": return ["dos","trapezes","biceps"];
    case "Jambes": return ["quadriceps","ischio_jambiers","fessiers","mollets","adducteurs"];
    case "Zone prioritaire": return zonesPrioritaires.length ? zonesPrioritaires : ["abdominaux"];
    default: return rotationFullBody[indexFullBody % rotationFullBody.length];
  }
}

function exercicesValides(client){
  return EXERCICES.filter(e =>
    e.niveau <= client.niveauTier &&
    e.materiel <= client.materielTier &&
    !e.contre_indications.some(ci => client.problemesSante.includes(ci)) &&
    !(client.excludeIds || []).includes(e.id)
  );
}

function pickExercicesJour(zones, pool, ratioCardio, dejaUtilises, nbExercices, preferIds){
  preferIds = preferIds || [];
  const nbCardio = Math.max(0, Math.round(nbExercices * ratioCardio));
  const nbRenfo = nbExercices - nbCardio;
  const choisis = [];

  // Les exercices préférés du client passent en premier, zone par zone.
  zones.forEach(z => {
    const prefere = pool.find(e => e.zone === z && preferIds.includes(e.id) && !choisis.includes(e));
    if (prefere && choisis.filter(e=>e.type==="renfo").length < nbRenfo) choisis.push(prefere);
  });

  const renfoParZone = zones.map(z => pool.filter(e => e.type === "renfo" && e.zone === z));
  let zi = 0, tentatives = 0;
  while (choisis.filter(e=>e.type==="renfo").length < nbRenfo && tentatives < nbExercices*20){
    tentatives++;
    const candidats = renfoParZone[zi % renfoParZone.length].filter(e => !choisis.includes(e));
    const frais = candidats.filter(e => !dejaUtilises.has(e.id));
    const source = frais.length ? frais : candidats;
    if (source.length) choisis.push(source[Math.floor(Math.random()*source.length)]);
    zi++;
  }

  const cardioCandidats = pool.filter(e => e.type === "cardio" && (zones.includes(e.zone) || e.zone === "full_body"));
  const cardioPrefere = cardioCandidats.find(e => preferIds.includes(e.id) && !choisis.includes(e));
  if (cardioPrefere && nbCardio > 0) choisis.push(cardioPrefere);
  for (let i=choisis.filter(e=>e.type==="cardio").length; i<nbCardio && cardioCandidats.length; i++){
    const frais = cardioCandidats.filter(e => !choisis.includes(e) && !dejaUtilises.has(e.id));
    const source = frais.length ? frais : cardioCandidats.filter(e => !choisis.includes(e));
    if (!source.length) break;
    choisis.push(source[Math.floor(Math.random()*source.length)]);
  }

  choisis.forEach(e => dejaUtilises.add(e.id));
  return choisis;
}

function pickEtirements(zones, pool){
  const candidats = pool.filter(e => e.type === "etirement" && (zones.includes(e.zone) || e.zone === "full_body"));
  const choisis = [];
  zones.forEach(z => {
    if (choisis.length >= 2) return;
    const options = candidats.filter(e => e.zone === z && !choisis.includes(e));
    if (options.length) choisis.push(options[Math.floor(Math.random()*options.length)]);
  });
  if (!choisis.length){
    const fullBody = candidats.filter(e => e.zone === "full_body");
    if (fullBody.length) choisis.push(fullBody[Math.floor(Math.random()*fullBody.length)]);
  }
  return choisis;
}

function genererPlanningSport(client){
  const n = nbSeances(client.niveau, client.joursDispo.length);
  const joursTries = JOURS.filter(j => client.joursDispo.includes(j));
  const joursChoisis = choisirJours(joursTries, n);
  const split = getSplit(n);
  const pool = exercicesValides(client);
  const ratio = client.typeEffort === "cardio" ? 1 : client.typeEffort === "renfo" ? 0 : (RATIO_CARDIO[client.objectif] ?? 0.4);
  const dejaUtilises = new Set();
  let dernierType = null;

  const seances = joursChoisis.map((jour, idx) => {
    let typeJour = split[idx % split.length];
    if (typeJour === "Zone prioritaire" && dernierType && zonesPourJour(typeJour, client.zonesPrioritaires, idx).some(z => zonesPourJour(dernierType, client.zonesPrioritaires, idx-1).includes(z))){
      typeJour = "Zone prioritaire";
    }
    const zones = zonesPourJour(typeJour, client.zonesPrioritaires, idx);
    dernierType = typeJour;
    const nbEx = client.niveau === "avance" ? 7 : client.niveau === "intermediaire" ? 6 : 5;
    const exercices = pickExercicesJour(zones, pool, ratio, dejaUtilises, nbEx, client.preferIds);
    const etirements = pickEtirements(zones, pool);
    return { jour, typeJour, exercices, etirements };
  });

  return { nbSeances: n, seances };
}

function placementHoraire(client){
  if (client.momentPrefere !== "matin" || !client.heureReveil || !client.heureDebutTravail){
    return null;
  }
  const reveil = client.heureReveil, debutTravail = client.heureDebutTravail;
  const trajetDS = client.trajetDomicileSalle || 0, trajetST = client.trajetSalleTravail || 0;
  const duree = client.dureeSeance || 45;
  // Temps réservé après la séance pour manger/se préparer avant de partir travailler.
  const tamponRepas = client.tamponRepas != null ? client.tamponRepas : 60;
  const fenetre = debutTravail - reveil - trajetDS - trajetST - tamponRepas;
  if (fenetre < duree){
    return { possible:false, message:"Ta fenêtre du matin est trop courte pour une séance en salle avant le travail, en gardant du temps pour manger — mieux vaut une séance à la maison, réduire le tampon repas, ou raccourcir la durée." };
  }
  const depart = debutTravail - trajetST - tamponRepas - duree - trajetDS;
  return {
    possible: true,
    resume: `Départ domicile ${minutesToHHMM(depart)} — salle ${minutesToHHMM(depart+trajetDS)} à ${minutesToHHMM(depart+trajetDS+duree)} — repas/préparation jusqu'à ${minutesToHHMM(debutTravail-trajetST)} — arrivée travail ${minutesToHHMM(debutTravail)}`
  };
}

// ------------------------------------------------------------- NUTRITION ----

/* Prix moyens estimés (€ par gramme/ml, ou € par pièce/tranche/portion) —
   base de départ approximative pour prioriser les recettes économiques
   quand un budget est fixé. */
const PRIX_INGREDIENTS = {
  "blanc de poulet":0.011, "bœuf haché 5%":0.014, "steak haché 5%":0.015, "escalope de dinde":0.013,
  "filet mignon de porc":0.013, "filet de cabillaud":0.02, "pavé de saumon":0.025, "saumon cru mariné":0.03,
  "thon au naturel":0.018, "crevettes":0.025, "tofu ferme":0.009, "jambon blanc":0.015,
  "whey protéine":0.04, "whey chocolat":0.04, "skyr nature":0.006, "yaourt grec":0.007,
  "fromage blanc":0.004, "fromage":0.012, "fromage râpé":0.012, "œufs":0.35,
  "lentilles corail":0.006, "pois chiches":0.005, "haricots rouges":0.005, "légumineuses":0.005,
  "edamame":0.012, "houmous":0.012, "beurre de cacahuète":0.01,
  "riz":0.003, "riz complet":0.0035, "riz basmati":0.004, "riz vinaigré":0.004,
  "quinoa":0.009, "quinoa cuit":0.009, "pâtes complètes":0.003, "nouilles de riz":0.005,
  "pommes de terre":0.0025, "patate douce":0.004, "flocons d'avoine":0.003, "farine complète":0.002,
  "pain complet":0.15, "tortilla complète":0.4, "pâte brisée":1.2, "granola":0.01, "muesli":0.008,
  "brocolis":0.004, "carottes":0.002, "carottes/concombre":0.003, "courgettes":0.003, "haricots verts":0.005,
  "légumes rôtis":0.004, "légumes sautés":0.004, "légumes vapeur":0.004, "légumes variés":0.004,
  "oignons":0.002, "poivron":0.005, "salade composée":0.006, "salade verte":0.005,
  "tomates cerises":0.006, "tomates concassées":0.003, "épinards frais":0.006, "maïs":0.004,
  "fruit de saison":0.5, "fruits de saison":0.005, "fruits rouges":0.015, "fruits secs":0.02,
  "mangue":0.006, "avocat":0.9, "banane":0.3, "pomme":0.4,
  "amandes":0.02, "amandes/noix":0.02, "noix mélangées":0.02, "graines de chia":0.03,
  "lait":0.0012, "lait d'amande":0.003, "lait de coco":0.004, "lait ou eau":0.0012, "bouillon":0.001, "miel":0.015,
};
const PRIX_DEFAUT = { g:0.005, ml:0.003, "pièce":0.5, tranche:0.15, tranches:0.15, portion:1.2 };

function prixIngredient(nom, unite){
  if (PRIX_INGREDIENTS[nom] != null) return PRIX_INGREDIENTS[nom];
  return PRIX_DEFAUT[unite] != null ? PRIX_DEFAUT[unite] : 0.005;
}
function estimerCoutRecette(r){
  return r.ingredients.reduce((total, ing) => total + ing.quantite * prixIngredient(ing.nom, ing.unite), 0);
}
function estimerCoutListe(liste){
  return liste.reduce((total, i) => total + i.quantite * prixIngredient(i.nom, i.unite), 0);
}

function quotaProteines(poids, objectif, age){
  const coeffs = {
    perte_poids:[1.6,2.0], tonus:[1.8,2.2], prise_masse:[1.8,2.2],
    energie:[1.2,1.6], reprise:[1.2,1.6], endurance:[1.2,1.6],
  };
  const [lo,hi] = coeffs[objectif] || [1.4,1.8];
  const coeff = age >= 50 ? hi : (lo+hi)/2;
  return Math.round(poids * coeff);
}

function recettesValides(repasType, client){
  const motsLibres = (client.alimentsEvitesLibre || []).map(m => m.toLowerCase().trim()).filter(Boolean);
  return RECETTES.filter(r => {
    if (r.repas !== repasType) return false;
    if (client.vegetarien && !r.vegetarien) return false;
    if (client.vegan && !r.vegan) return false;
    if (client.sansGluten && !r.sans_gluten) return false;
    if (client.sansLactose && !r.sans_lactose) return false;
    if (r.contient.some(tag => client.alimentsEvites.includes(tag))) return false;
    if (motsLibres.some(mot => r.ingredients.some(ing => ing.nom.toLowerCase().includes(mot)))) return false;
    return true;
  });
}

function choisirRecette(repasType, client, utiliseesSemaine){
  let candidats = recettesValides(repasType, client);
  const parObjectif = candidats.filter(r => r.profils.includes(client.objectif));
  if (parObjectif.length) candidats = parObjectif;
  if (!candidats.length) return null;
  const fraiches = candidats.filter(r => !utiliseesSemaine.has(r.id));
  let source = fraiches.length ? fraiches : candidats;
  if (client.budgetSemaine && client.budgetSemaine > 0){
    const triees = source.slice().sort((a,b) => estimerCoutRecette(a) - estimerCoutRecette(b));
    source = triees.slice(0, Math.max(1, Math.ceil(triees.length * 0.6)));
  }
  const choix = source[Math.floor(Math.random()*source.length)];
  utiliseesSemaine.add(choix.id);
  return choix;
}

function genererPlanningRepas(client){
  const utiliseesSemaine = new Set();
  const jours = JOURS.map(jour => {
    const repas = {};
    client.repasInclus.forEach(slot => {
      const type = (slot === "collation_matin" || slot === "gouter") ? "collation"
        : (slot === "dejeuner" || slot === "diner") ? "dejeuner_diner"
        : slot;
      repas[slot] = choisirRecette(type, client, utiliseesSemaine);
    });
    return { jour, repas };
  });
  return { proteinesCible: quotaProteines(client.poidsActuel, client.objectif, client.age), jours };
}

function genererListeCourses(planningRepas){
  const totaux = {};
  planningRepas.jours.forEach(j => {
    Object.values(j.repas).forEach(r => {
      if (!r) return;
      r.ingredients.forEach(ing => {
        const cle = `${ing.nom}__${ing.unite}`;
        totaux[cle] = (totaux[cle] || 0) + ing.quantite;
      });
    });
  });
  return Object.entries(totaux)
    .map(([cle, qte]) => {
      const [nom, unite] = cle.split("__");
      return { nom, quantite: Math.round(qte*10)/10, unite };
    })
    .sort((a,b) => a.nom.localeCompare(b.nom, "fr"));
}
