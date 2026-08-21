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
    ["torse","dos","jambes","abdos"],
    ["epaules","bras","jambes","fessiers"],
    ["dos","torse","fessiers","abdos"],
  ];
  switch(typeJour){
    case "Haut du corps": return ["torse","dos","epaules","bras"];
    case "Bas du corps": return ["jambes","fessiers","abdos"];
    case "Push": return ["torse","epaules","bras"];
    case "Pull": return ["dos","bras"];
    case "Jambes": return ["jambes","fessiers"];
    case "Zone prioritaire": return zonesPrioritaires.length ? zonesPrioritaires : ["abdos"];
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
    return { jour, typeJour, exercices };
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
  const source = fraiches.length ? fraiches : candidats;
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
