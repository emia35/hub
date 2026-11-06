# CLAUDE.md — « Comment je me sens ? » (outil d'auto-évaluation de la douleur)

Fichier de contexte pour Claude Code. À lire en entier avant toute modification.
État au 6 novembre 2026, passation depuis claude.ai.

## 1. Ce qu'est l'outil

Outil web d'auto-évaluation de la douleur pour des personnes autistes (TSA) **capables d'auto-report**, accompagnées par l'EMIA35 (Équipe Mobile d'Intervention Autisme 35, Adapei 35). Idée de Géraldine Deniard, infirmière (IDE) à l'EMIA35 ; co-créé avec Arthur Guillieux, psychologue. Né d'une version personnalisée pour un usager, devenu configurable.

La personne dit, en quelques appuis : qu'elle a mal (et combien), où sur le corps, ou qu'elle ressent autre chose (gratte, pique, brûle, gêne), ou qu'elle ne sait pas. Le récapitulatif affiche une phrase, un rappel visuel, un bouton « Écouter » (synthèse vocale) et l'invitation « Montre le téléphone à quelqu'un ».

Ce que l'outil n'est pas, et ne doit pas devenir sans décision d'Arthur : un instrument de mesure, un outil d'hétéro-évaluation (traité ailleurs), un outil de statistiques (écartées volontairement : un journal brut exportable suffit).

En ligne : https://emia35.github.io/hub/douleur/ (dans le dépôt emia35/hub). L'ancienne adresse https://arthurguillieux.github.io/douleur/ reste en service, inchangée, avec ses raccourcis sur des tablettes et téléphones.

## 2. Règles de travail (Arthur)

- Tout en français : interface, commentaires, messages de commit, échanges.
- **Un seul fichier HTML autonome** (`index.html`) : CSS, JS, images en base64 inline. Pas de framework, pas de build obligatoire. `icon.png` à côté (favicon + icône d'écran d'accueil).
- On valide le contenu avec Arthur avant de coder. On avance par **passes nommées** (A, B, C…), une intention par passe, `npm test` + test sur vrai téléphone Android après chacune.
- Retour franc, pas de compliments. Dire ce qu'on ne sait pas. Signaler les arbitrages pris et ce qui a été écarté.
- Avant de modifier un comportement visible par la personne accompagnée, demander : c'est un acte clinique, pas un réglage.

## 3. Contraintes non négociables

1. **Aucun écran ne défile** sur téléphone (layout `100dvh`, `overflow:hidden`), sauf l'écran Paramètres (géré par un professionnel). Tout ajout doit tenir sur un petit écran.
2. **Charge cognitive minimale côté personne** : la complexité vit dans les Paramètres, jamais dans le parcours. Pas de nouvelle option visible par la personne sans accord.
3. Ouvrir par ce qui donne à comprendre ; un seul choix par écran ; gros boutons.
4. **Aucune donnée nominative.** Le journal reste dans le `localStorage` de l'appareil.
5. Mode sombre neutralisé (`color-scheme: only light`, meta + CSS) : en mode sombre, Android recolorait les silhouettes (bras marron). Ne pas retirer.

## 4. Architecture de `index.html`

Écrans (`<div class="screen" id="screen-…">`, un seul `.active` à la fois) : `home`, `intensity`, `sensation`, `body`, `recap`, `bien`, `settings`. Navigation par `showScreen(id)` uniquement.

Parcours (`mode`) :
- `pain` : intensité → corps → récap
- `sensation` : sensation → corps → récap
- `unknown` (« Je ne sais pas ») : corps → récap
- « Je vais bien » : écran `bien` direct

Phrases (`buildSentence`) :
- douleur : « J'ai [un peu mal | très très mal…] [zones]. »
- numérique : « J'ai mal, X sur 10 [zones]. »
- sensation : « [Ça gratte] [zones]. Tu peux m'aider ? »
- inconnu : « J'ai quelque chose [zones]. Tu peux m'aider ? »

Constantes : `NUANCES` (2, 3, 5 niveaux, visages + libellés + forme parlée ; 10 = grille numérique colorée), `SENSATIONS` (4 entrées, icône = emoji ou `<img>` base64), `FIGURES` (silhouettes SVG : adulte/enfant × homme/femme en face, + dos), `SKIN_PALETTES` (3 teintes de peau, recoloration par remplacement de codes dans le SVG via `skinSVG`), `BODY_QM` (silhouette grise + « ? » affichée au récap quand aucune zone n'est choisie).

Récap : emoji/visage du niveau (ou icône sensation, ou ❓), mini-corps clonés depuis `#bodyFront`/`#bodyBack` (seules les vues marquées), phrase, bouton Écouter, puis bloc « Montre le téléphone à quelqu'un » (sans fond, sous le bouton).

Configuration :
- Objet `config = {sexe, age, nuances, sensations, peau}`, déclaré avec `let` (pas accessible via `window.config`).
- Priorité : URL > `localStorage['douleur_config']` > défauts (`homme`, `adulte`, `2`, `false`, `1`).
- Paramètres d'URL : `sexe=homme|femme`, `age=adulte|enfant`, `nuances=2|3|5|10`, `sensations=0|1`, `peau=1|2|3`.
- Usage visé : un professionnel configure, copie le lien (bouton « Copier »), l'envoie à l'équipe qui ajoute le raccourci.

Paramètres : ouverture par **trois appuis sur « Comment je me sens ? »** (pas de code : le code PIN a été retiré, voir §6). Contenu : profil (sexe, âge, peau + aperçu), niveaux de douleur accessibles (+ « Si vous avez un doute sur le niveau de compréhension de la personne, partez du plus simple. »), module sensations, lien de partage, journal (CSV avec BOM, copier, vider), FAQ (ce que l'outil fait / ne fait pas ; l'hétéro-évaluation est indispensable mais hors objet).

Journal : `localStorage['douleur_journal']`, une entrée par récap atteint (`ts`, `type`, `intensite`, `sensation`, `zones`, `phrase`).

Synthèse vocale : Web Speech API, `fr-FR`, voix masculine ou féminine cherchée par nom selon `config.sexe`, repli sur la première voix française.

En-tête : sur l'accueil, fleur avec repères à gauche (trois appuis mènent au hub, `../?retour=douleur`) et logo texte à droite, 120 px ; ailleurs, bouton Accueil et titre centré. Pied de page fixe sur toutes les pages : « Outil créé par l'EMIA35 — emia35@adapei35.asso.fr », non cliquable (les usagers ouvraient leur messagerie par erreur). L'en-tête global est masqué dans les Paramètres, qui ont le leur.

## 5. Pièges Android : à lire avant de toucher aux Paramètres

Une longue session de débogage sur Android (Brave et Chrome) a établi ce qui suit. Chaque point a coûté plusieurs allers-retours ; ne pas les réintroduire.

1. **`history.replaceState` à chaque clic casse l'affichage des boutons.** Le style changeait une fraction de seconde puis revenait. `saveConfig()` n'écrit que le `localStorage` ; l'URL n'est mise à jour (`saveConfigAndURL()`) qu'au chargement et à la fermeture des Paramètres. Ne jamais remettre `replaceState` dans un gestionnaire de clic.
2. **Pas de `style.display` inline sur un `.screen`.** Un `display:none` inline laissé par `goHome()` écrasait `.screen.active` : page blanche une fois sur deux à la réouverture. `showScreen()` remet `style.display=''` sur tous les écrans. L'affichage passe par la classe `active`, et par rien d'autre.
3. **`showScreen` active le nouvel écran avant de désactiver les autres**, pour qu'il n'y ait jamais zéro écran actif.
4. Les Paramètres sont un `.screen` ordinaire (pas de `position:fixed`, pas d'overlay, pas de z-index). Les essais en `fixed`/`absolute` ont produit des mises en page cassées et des appuis captés par d'autres couches.
5. Pas d'animation `fade-in` sur l'écran Paramètres.
6. État visuel des boutons de segment : `segOn`/`segOff` (style inline `cssText` avec `!important`), pas `classList.toggle(…, bool)`.
7. Ne pas reconstruire les silhouettes du parcours (`applyConfig`) à chaque clic dans les Paramètres : seulement à la fermeture. L'aperçu (`#previewFront`) est, lui, mis à jour à chaque changement.
8. `titleTap` : synchrone, sans `requestAnimationFrame`, ignoré si les Paramètres sont déjà ouverts.

Diagnostic qui a marché : construire une page de test minimale qui reproduit un seul mécanisme, la faire ouvrir à Arthur sur son téléphone, journal d'événements affiché à l'écran. Le débogage USB (`brave://inspect`) n'a pas abouti.

## 6. Choix faits, à ne pas défaire sans demander

- PIN 1234 retiré (l'overlay perturbait les Paramètres) : seul le triple appui protège, contre l'ouverture accidentelle, pas contre un tiers. Le code PIN est encore présent mais neutralisé (`openPin`, `pinPress`, `.pin-overlay{display:none!important}`) : **code mort à nettoyer**, après accord.
- Icônes « Une sensation » et « Ça gratte » : **PNG fournis par Arthur, intégrés tels quels** (fond noir rendu transparent). Originaux dans `sources/`. Arthur a refusé plusieurs versions dessinées en SVG : ne pas redessiner sans demande.
- Bouton « Je ne sais pas où » (écran corps) : silhouette grise + « ? » ; ❓ sur « Je ne sais pas » (intensité, sensation).
- Aucune statistique. Hétéro-évaluation hors périmètre. Non-lecteurs : chantier futur, non tranché.

## 7. Points ouverts (cliniques ou techniques)

- Latéralité : gauche/droite = côté de l'écran, pas côté anatomique de la personne. Non validé cliniquement.
- Mot « sexe » pour la zone génitale : à adapter au vocabulaire de chaque personne ?
- Compréhension des icônes de sensation : à vérifier personne par personne.
- Voix masculine/féminine : dépend des voix installées ; iOS muet en mode silencieux.
- Les emojis (visages, 🤕, 😊, 🤷, ❓) ne s'affichent pas pareil selon l'appareil (Android, iOS, Windows). Pour un support de communication, c'est un défaut de stabilité. À discuter avec le lifting.
- Police Nunito chargée depuis Google Fonts : l'outil n'est pas entièrement hors ligne.
- Poids : ~410 Ko, dont ~350 Ko d'images base64 (logo raster 177 Ko, gratte 138 Ko, sensation 33 Ko). Le logo SVG du kit de la charte réduirait nettement.
- Proportions « enfant » : première approximation (tête agrandie).
- Raccourcis existants : si l'URL change (déplacement vers l'organisation GitHub `emia35`, hub), les raccourcis déjà posés sur les tablettes cassent. Prévoir une page de redirection à l'ancienne adresse et vérifier avant tout déplacement.

## 8. Tests

```bash
npm install
npm test        # test de fumée jsdom : 42 vérifications, toutes doivent passer
```

jsdom ne voit ni la mise en page, ni le défilement, ni les bugs de rendu Android du §5. Après chaque passe : test sur vrai téléphone Android par Arthur (ouvrir/fermer les Paramètres plusieurs fois de suite, changer chaque réglage, vérifier l'aperçu, refaire un parcours complet).

`build.py` (générateur Python des silhouettes, utilisé pendant le développement sur claude.ai) n'a pas été conservé : **`index.html` est désormais la source**. Les silhouettes sont dans la constante `FIGURES`.

## 9. Passe 3, mise à la charte (6 novembre 2026)

Faite sur la nouvelle adresse seulement ; l'ancienne reste telle quelle, ce qui autorise les essais. Décisions d'Arthur :

- Couleurs de la charte (variables `--emia-…`). « Je vais bien » : texte marine.
- Échelle de 1 à 10 : rouge EMIA de plus en plus intense (constante `ECHELLE`), chiffre marine puis blanc pour 9 et 10.
- Emojis : dessins Noto (Android) embarqués en SVG (`EMOJIS`, `emo()`, attribut `data-emo`), licence Apache 2.0, citée dans les Paramètres. Les deux PNG d'Arthur sont inchangés.
- **Écart à la charte assumé** : la police côté personne est Nunito (titres en Montserrat), alors que la charte prévoit Arial pour les supports CAA et FALC. Pour essayer Arial, changer `--police-personne` en une ligne.
- **Écart à la charte assumé** : petite fleur sur l'accueil de l'outil, côté personne.
- Polices et logos embarqués en base64, sauf les logos partenaires des Paramètres (`../logos/`). Plus de Google Fonts.
- « Vider le journal » : confirmation dans la carte, sans fenêtre par-dessus (voir §5), « Garder le journal » ayant le focus.
- Hauteurs inférieures à 600 px : accueil resserré (`@media (max-height:600px)`).

Restent ouverts : le message sur l'ancienne adresse (rien pour l'instant), le code PIN mort à nettoyer, l'avis de Géraldine Deniard quand les essais auront avancé.
