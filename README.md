# Coaching Sur-Mesure — Site public

Site vitrine + questionnaire du programme "Coaching Sur-Mesure". HTML/CSS/JS pur,
aucune dépendance, aucune étape de build.

- `index.html` — page de vente (pitch, offre, garantie, prix, mini-formulaire de réservation d'appel)
- `questionnaire.html` — bilan client complet (10 sections), envoyé par email au coach dès validation
- `styles.css` — palette, typographie et composants partagés entre les deux pages

## Déployer sur Vercel avec ton propre nom de domaine

1. Achète ton nom de domaine (Vercel, Namecheap, OVH, etc.) — inutile de le faire avant cette étape.
2. Sur https://vercel.com → **Add New Project** → importe ce dépôt GitHub (`coaching-sur-mesure`).
3. **Framework Preset** → `Other` (aucune commande de build nécessaire). Root Directory reste vide (racine du dépôt).
4. Clique **Deploy**. Le site est en ligne sur une adresse `https://ton-projet.vercel.app`.
5. Dans les réglages du projet Vercel → **Domains**, ajoute ton nom de domaine et suis les
   instructions DNS (Vercel les fournit automatiquement).

Une fois branché, mets l'adresse de `index.html` en bio (Instagram, etc.) — c'est la page d'accueil.

## Ce qui a changé par rapport aux pages Send d'origine

- Le prix affiché est **100€/mois** (corrigé, il était encore à 250€).
- Une navigation commune (en-tête + pied de page) relie les deux pages entre elles.
- La page questionnaire n'a plus d'"espace coach" avec mot de passe : cette fonction
  s'appuyait sur le stockage interne de Send, qui n'existe plus une fois le site hébergé
  ailleurs. Chaque réponse continue d'arriver par email (Web3Forms) comme avant — c'est
  déjà le canal fiable. Si tu veux un vrai historique consultable en ligne, il faudra
  brancher une vraie base de données.
- Les deux formulaires utilisent toujours la même clé Web3Forms et envoient à la même adresse
  (zooecoach@gmail.com).

## Historique

Ce projet vivait auparavant dans le dépôt `louve-agenda-` (dossier `coaching-site/`), aux côtés
d'une app personnelle sans rapport. Il a été déplacé ici pour que les deux projets restent
complètement indépendants (code, déploiements Vercel, domaines).
