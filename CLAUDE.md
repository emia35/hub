# CLAUDE.md — Le HUB de l'EMIA35

Lien public visé : https://emia35.github.io/hub/ (dépôt `emia35/hub`, à créer par Arthur sur le compte emia35, poussé par la clé SSH `github.com-emia`).
Public : professionnels et familles. Registre partenaires de la charte (vouvoiement, phrases complètes).

## Contenu du dossier

`index.html` : tout le hub, en un fichier. Pages par adresse : `#accueil`, `#emia`, `#processus`, `#reperes`, `#ressources`, `#notes`.
`logos/`, `polices/` : copies du kit de la charte (polices réduites au latin, en woff2 ; logos non modifiés).
`passation_claude_code_EMIA35/` et `Comment je me sens/` : archives de la passation, à ne pas publier. Le contexte complet de l'outil douleur est dans `passation_claude_code_EMIA35/passation/douleur/CLAUDE.md`.

## Pour faire vivre le hub

En tête du `<script>` d'`index.html` : `OUTILS` (un bloc par outil de la page Ressources), `NOTES_VERSION` (la plus récente en premier ; elle donne le numéro du pied de page), `ADRESSE_DOULEUR` (à passer à `'douleur/'` en passe 2).

## Règles

Tout en français. Charte EMIA35 v0.3 strictement (`Desktop\CLAUDE\EMIA - Communication`). On arbitre avant de coder, on avance par passes nommées, un commit par passe.
Réflexes repris de la BAF : boutons nommés d'après l'action, pas de `confirm()` natif, pages légères, texte de lecture justifié (pas dans le parcours de la personne), notes de version.

## Choix actés

Pas d'auteur nommé pour le hub (« Créé par l'EMIA35 »), mais les créateurs sous chaque outil dans Ressources.
« EMIA35 » du titre : couleurs de la colonne « texte coloré » de la charte (les couleurs pures sont interdites en texte sur blanc).
Le pro installe `/hub/douleur/` sur l'écran de la personne. Trois appuis sur la fleur de l'outil mènent à `../?retour=douleur`, qui affiche en haut du hub « Revenir à Comment je me sens ».
En-tête de l'outil : sur son écran d'accueil seulement, fleur à gauche et logo à droite, sans le texte du hub.
