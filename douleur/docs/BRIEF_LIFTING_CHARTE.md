# Brief — Mise à la charte EMIA35 de « Comment je me sens ? »

Référence : `CHARTE_GRAPHIQUE_EMIA35.md` v0.3 (5 novembre 2026). Les logos vectoriels (`logos/…`) et les polices (`polices/`) sont dans le kit de la charte, à demander à Arthur s'ils ne sont pas dans le dépôt.

**Règle d'or de ce chantier.** L'outil est un support de communication pour des personnes autistes, pas une plaquette institutionnelle. La charte prévoit ce cas (sections 8, 9 et 10, « Support de CAA ») : peu de couleurs, pas de décor, pas de fleur, gros éléments, stabilité d'un support à l'autre. Quand l'identité visuelle et la lisibilité pour la personne s'opposent, la lisibilité gagne, et on le signale à Arthur.

## 1. État des lieux : écarts mesurés

Couleurs actuelles (`:root`) : fond `#F7F5F2`, texte `#1a1a1a`, gris `#8a8a8a`, rouge `#E8514A`, vert `#5CB87A`, bleu `#4A90D9`. Aucune n'est dans la palette.

Contrastes actuels, calculés (WCAG) :

| Élément | Actuel | Rapport | Seuil | Verdict |
|---|---|---|---|---|
| « J'AI MAL » blanc sur rouge | `#E8514A` | 3,7 | 3 (gros gras) | passe de justesse |
| « Je vais bien » blanc sur vert | `#5CB87A` | 2,4 | 3 | **échoue** |
| « Écouter » blanc sur bleu | `#4A90D9` | 3,3 | 4,5 | **échoue** (texte de taille moyenne) |
| Texte gris sur fond | `#8a8a8a` / `#F7F5F2` | 3,2 | 4,5 | **échoue** (consigne des Paramètres, astuce PIN, pied de page) |
| Chiffre 1 de l'échelle 10, blanc sur vert vif | hsl(120,68%,52%) | 1,9 | 3 | **échoue** (les chiffres verts/jaunes sont presque illisibles) |

Polices : Nunito seule, chargée depuis Google Fonts. Charte : Montserrat (titres) + Nunito (texte) ; Arial pour les supports facile à lire et la CAA.

Logo : PNG raster du logo texte (177 Ko), affiché à 22 px de haut, soit environ 80 px de large. La charte demande **120 px minimum à l'écran**, avec zone de protection, et privilégie le SVG du kit (`logos/1_logo-texte/`).

Pictogrammes : trois styles coexistent (emojis système, une icône au trait importée, une illustration en couleur importée). La charte demande un seul style par document et, pour la CAA, des pictogrammes stables d'un support à l'autre. Les emojis changent de dessin selon le fabricant du téléphone.

## 2. Correspondance proposée (à valider)

| Rôle | Proposition | Rapport |
|---|---|---|
| Texte principal | Marine `#043471` | 12,1 sur blanc |
| Texte secondaire | Gris texte `#5B6275` | 5,7 sur `#F7F8FB` |
| Fond de page | Blanc ou fond clair `#F7F8FB` | |
| Filets, bordures | Gris filet `#E3E6EE` | |
| « J'AI MAL » | Rouge EMIA `#F13F22`, texte blanc gras ≥ 19 px | 3,8 |
| « Je vais bien » | Vert EMIA `#68C252`, **texte marine** (blanc interdit) | 5,4 |
| « Écouter » | Bleu EMIA `#1975DD`, texte blanc | 4,5 |
| « Je ne sais pas », « Une sensation » | Fond clair ou pastel, bordure, texte marine | ≥ 10 |
| Zones touchées sur le corps | Rouge EMIA translucide | |
| Variables | Celles de la section 6 de la charte, telles quelles (`--emia-…`) | |

Ne changent pas : les trois teintes de peau (`SKIN_PALETTES`), qui ne sont pas des couleurs d'identité, et le neutralisateur de mode sombre.

## 3. Arbitrages à faire trancher par Arthur avant de coder

1. **Rouge = douleur, vert = bien.** La charte dit que les couleurs n'ont pas de sens par défaut. Ici elles en ont un, et il est fonctionnel. Garder ce codage (avec le rouge et le vert EMIA), ou neutraliser ?
2. **Échelle 1 à 10.** Le dégradé vert → rouge sort de la charte (« partout ailleurs : aplats ») et échoue au contraste. Options : six couleurs de la palette par paliers, une seule couleur avec intensité croissante, ou chiffres marine sur fond pastel. Faut-il aussi des repères (visages) sur l'échelle ?
3. **Police côté personne.** Nunito (charte, texte courant) ou Arial (charte, facile à lire et CAA, 14 pt minimum, règle Adapei pour le FALC) ? Arial a un second avantage : plus aucune dépendance à Google Fonts, donc vraiment hors ligne. Montserrat resterait pour les Paramètres et le hub.
4. **Emojis.** Les remplacer par un jeu de pictogrammes fixe (SVG maison au trait marine, ou banque reconnue type ARASAAC, licence CC BY-NC-SA, à citer) ? Ce serait le plus gros changement du lifting, et il touche la clinique : une personne habituée au visage actuel le verrait changer. Faut-il un mode « garder les emojis » ?
5. **Les deux PNG fournis** (« Une sensation » au trait, « Ça gratte » en couleur) ne sont pas du même style. Si le point 4 est retenu, qui les refait, et dans quel style ? Ne rien redessiner sans accord : Arthur a déjà refusé plusieurs versions.
6. **Logo de l'accueil.** Passer au SVG du kit et respecter les 120 px (le titre et l'en-tête doivent alors tenir sur petit écran), ou assumer une exception documentée ? Garder la mention « by » ?
7. **Fleur EMIA35.** Proposition : absente du parcours de la personne (conforme à la charte), possible dans l'en-tête des Paramètres (fleur avec repères, petite).
8. **Tutoiement.** Le parcours tutoie (« Comment tu as mal ? »), les Paramètres vouvoient : deux publics distincts, donc conforme. La charte laisse ouverte la question du « tu » par défaut dans le facile à lire ; on garde le « tu » sauf avis contraire.
9. **Pied de page.** Logos partenaires (Adapei 35, CH Guillaume Régnier) dans les Paramètres uniquement ? Pas sur les écrans de la personne (décor, distraction).

## 4. Passes proposées (après réponses)

- **Passe A, couleurs et contrastes** : variables `--emia-…`, correspondance du tableau 2, échelle 10 selon l'arbitrage 2. Aucun changement de mise en page.
- **Passe B, typographie** : polices selon l'arbitrage 3 ; si Montserrat/Nunito sont gardées, les embarquer en base64 (woff2, sous-ensemble latin) pour le hors-ligne, en surveillant le poids.
- **Passe C, logo** : SVG du kit, taille et zone de protection, retrait du PNG raster (−177 Ko).
- **Passe D, pictogrammes** : seulement si l'arbitrage 4 est retenu, et après validation des dessins par Arthur et Géraldine.
- **Passe E, Paramètres** : composants de la charte (cartes pastel, pastilles, encadré « à savoir » pour la FAQ), logos partenaires.

Après chaque passe : `npm test`, puis contrôle sur téléphone Android (aucun écran ne défile, Paramètres ouverts et fermés plusieurs fois, parcours complet), puis la grille de la section 11 de la charte.
