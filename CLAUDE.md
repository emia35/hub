# CLAUDE.md — Le HUB de l'EMIA35

En ligne : https://emia35.github.io/hub/ (dépôt public `emia35/hub`, branche `main`, GitHub Pages sur la racine).
Pousser avec la clé SSH `github.com-emia` (le remote `origin` est déjà réglé). `gh` est connecté au compte personnel d'Arthur, sans droit d'écriture sur emia35 : la création de dépôts et les réglages de Pages se font par Arthur sur le site.
Public : professionnels et familles. Registre partenaires de la charte (vouvoiement, phrases complètes), sauf dans l'outil « Comment je me sens ? » qui tutoie la personne.

## Contenu du dossier

`index.html` : tout le hub, en un seul fichier (HTML, CSS et JS). Une page = une `<section data-page="…">`, choisie par l'adresse.
`douleur/` : l'outil « Comment je me sens ? », fichier autonome, avec son contexte complet (`douleur/CLAUDE.md`, à lire avant d'y toucher : pièges Android, choix cliniques) et ses tests (`npm test`, jsdom).
`logos/`, `polices/` : copies du kit de la charte (polices réduites au latin, en woff2 ; logos non modifiés).
`actus/` : les images des actus. `equipe/` : les photos de l'équipe (sans métadonnées, avec accord écrit).
`documents/` : documents publics à ouvrir depuis le hub (aujourd'hui l'exemple fictif de bilan, « Nora », 24 pages, marqué « exemple fictif » à chaque page).
Non publiés (`.gitignore`) : `maquettes/` (maquettes cliquables à montrer à Arthur avant de toucher au vrai hub), `A lire/` (documents de travail d'Arthur : formulaires, présentations, trombinoscope Word avec photos, à ne jamais publier), `sources/`, `passation_claude_code_EMIA35/`, `Comment je me sens/`.

## Les pages

Navigation (depuis la v2026.11.09-1) : un menu toujours visible dans l'en-tête (À propos, Accompagnement, Comprendre, Outils, Actus, Contact) et le bouton « L'EMIA peut-elle vous aider ? » (vers `#orientation`) ; sous 1240 px, le menu se replie derrière un bouton « Menu ». Chaque rubrique de plusieurs pages a un sous-menu en pastilles (`#sous-nav`). Les rubriques se règlent dans `GROUPES` (pages du sous-menu) et `GROUPE_DE` (rubrique de chaque page) ; `majNavigation(vue)` est appelée par `route()`. Les liens « ← Revenir à… » sont masqués, sauf sur les articles d'actu. Une nouvelle page doit être ajoutée à `GROUPE_DE`, sinon aucun onglet du menu n'est surligné.

| Adresse | Contenu |
|---|---|
| `#accueil` | Fleur, nom de l'équipe, une phrase, deux boutons (arbre, processus), quatre cartes de rubrique, bandeau dernière actu + téléphone. Doit tenir sur un écran sans défiler à 1280×600 (à 360×640 il dépasse d'environ 30 px). |
| `#emia` | À propos : présentation de l'EMIA35. |
| `#equipe` | Trombinoscope : métiers par groupe, photo et nom seulement avec accord écrit. |
| `#processus` | Roue du processus d'intervention, six étapes. |
| `#bilan-exemple` | À quoi ressemble un bilan : les parties du bilan fictif de Nora, un extrait par partie, le PDF complet. Reliée depuis l'étape 5 et la page EMIA. |
| `#orientation` | Arbre « L'EMIA peut-elle vous aider ? ». |
| `#contact` | Nous contacter : téléphone, horaires, mail, adresse, les trois temps d'une demande, urgence 15/112. Aussi relié depuis le pied de page. |
| `#reperes` | Ancien sommaire de Comprendre, gardé pour les liens déjà diffusés (le menu mène à `#repere-autisme`). Vers `#repere-autisme`, `#repere-comportements`, `#repere-galaxie` (roue), `#repere-lexique`. |
| `#ressources` | Les outils (BAF, Comment je me sens). |
| `#actus`, `#actu-<id>` | Liste des actus et une page par actu (adresse à reprendre dans les posts LinkedIn). |
| `#notes` | Notes de version. |

## Pour faire vivre le hub

Tout se règle dans des tableaux en JS, dans le `<script>` d'`index.html` :
`OUTILS` (Ressources), `ACTUS` (la plus récente en premier ; la première est annoncée sur l'accueil), `EQUIPE`, `ETAPES` (roue du processus), `GALAXIE` (roue des partenaires), `ARBRE` et `RESULTATS` (l'arbre), `LEXIQUE`, `NOTES_VERSION` (la plus récente en premier ; elle donne le numéro du pied de page, format `v2026.11.08-5`).

La roue : `creerRoue(o)` construit une roue dans une `section.page-roue` dont les identifiants commencent par un préfixe (`processus-zone`, `processus-svg`, `processus-panneau`, `processus-pastilles`, `processus-precedente`, `processus-suivante`). Six éléments au plus (un par pétale, dans l'ordre de la palette). Les roues sont rangées dans `ROUES[vue]` ; `route()` appelle `placer()` à l'affichage.

## Avant de publier

1. Vérifier la syntaxe du script (`node --check` sur le contenu du `<script>`). Une apostrophe non échappée dans une chaîne entre `'…'` a déjà cassé tout le hub : écrire les textes entre `"…"`.
2. Cliquer dans toutes les pages, pas seulement celle qu'on a modifiée : une retouche de l'accueil a déjà masqué toutes les autres pages (attribut `data-page` posé sur `body`, d'où `data-vue`).
3. Vérifier l'accueil sans défilement, et l'absence de débordement horizontal sur téléphone.
4. Ajouter une entrée dans `NOTES_VERSION`.
5. Un commit par passe ; après l'envoi, attendre la mise en ligne (une à trois minutes) et vérifier sur le site publié (le navigateur garde les pages en cache dix minutes).

## Règles

Tout en français. Charte EMIA35 v0.3 strictement (`Desktop\CLAUDE\EMIA - Communication`) : variables `--emia-…`, contrastes de la section 4, pas de couleur inventée. On arbitre avant de coder, on avance par passes nommées, Arthur donne le feu vert avant chaque publication.
Réflexes repris de la BAF : boutons nommés d'après l'action, pas de `confirm()` natif, pages légères (le détail derrière un bouton), texte de lecture justifié (pas dans le parcours de la personne), notes de version.
Terme : **comportements-défis** (l'ANESM dit « comportements-problèmes » : le signaler, ne pas l'employer).
Aucun formulaire en ligne : les demandes passent par téléphone ou mail (le formulaire de demande contient des données de santé).

## Choix actés

Pas d'auteur nommé pour le hub (« Créé par l'EMIA35 »), mais les créateurs sous chaque outil dans Ressources.
« EMIA35 » du titre : couleurs pleines du logo, à la demande d'Arthur. Exception assumée à la section 4 de la charte (orange, cyan et vert purs interdits en texte sur blanc), à reporter dans la prochaine version.
Organisation du hub (09/11/2026) : menu permanent par rubrique plutôt que modules sur l'accueil, après le constat d'Arthur qu'on ne trouvait pas instinctivement ce qu'on cherchait. Le logo texte EMIA35 n'est plus en haut à droite (pas la place à côté du menu) ; toutes les anciennes adresses restent valables.
Logos partenaires du pied de page plus petits que les 40 mm de la charte Adapei, à la demande d'Arthur.
Le pro installe `/hub/douleur/` sur l'écran de la personne. Trois appuis sur la fleur de l'outil mènent à `../?retour=douleur`, qui affiche en haut du hub « Revenir à Comment je me sens ».
Actus : on écrit le texte dans le hub, le post LinkedIn renvoie vers `#actu-<id>`. Pas de fil LinkedIn intégré (traceurs, accord de LinkedIn nécessaire).
Équipe : seule la photo d'Arthur est publiée ; les collègues apparaissent en silhouettes, sans nom, jusqu'à leur accord écrit.

## Restent ouverts (à faire valider par l'équipe)

Arbre : les interlocuteurs cités (CRA, CMP, MDPH, SAMSAH, PCPE), « l'EMIA ne pose pas de diagnostic », le seuil de la question 4 (« quotidien très difficile »), le ton des titres.
Repères : la galaxie (MAS retirée du sanitaire, UEDE 35 et ADITSA non développés), la phrase « un comportement-défi est souvent une tentative de répondre à un besoin », les définitions du lexique.
Équipe : la liste des métiers (neuropsychologue, cadre de santé, « assistant social »).
Exemple de bilan : la page reprend des extraits du PDF d'Arthur ; si le bilan fictif change, mettre à jour les extraits de `#bilan-exemple`.
