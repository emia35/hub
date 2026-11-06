// Test de fumée de « Comment je me sens ? » (jsdom, sans navigateur).
// Usage : npm install && npm test
// Ne remplace PAS le test sur vrai téléphone Android (voir CLAUDE.md, « Pièges Android »).
// Les fonctions sont des déclarations globales : on les appelle via window.<nom>.
// `config` est déclaré avec let : il n'est PAS lisible via window.config, on vérifie par le DOM ou l'URL.

const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');

function boot(url = 'https://exemple.github.io/douleur/') {
  const dom = new JSDOM(html, { runScripts: 'dangerously', url, pretendToBeVisual: true });
  dom.window.dispatchEvent(new dom.window.Event('load'));
  return dom.window;
}

const ok = [], ko = [];
const A = (cond, msg) => (cond ? ok : ko).push(msg);

// --- Démarrage
let w = boot(), d = w.document;
const ids = {}; d.querySelectorAll('[id]').forEach(e => (ids[e.id] = (ids[e.id] || 0) + 1));
A(Object.values(ids).every(n => n === 1), 'aucun id dupliqué');
A(d.getElementById('screen-home').classList.contains('active'), 'accueil actif au démarrage');
A(d.querySelectorAll('#bodyFront .body-zone').length > 10, 'silhouette face injectée');
A(d.querySelectorAll('#bodyBack .body-zone').length > 8, 'silhouette dos injectée');
A([...d.querySelectorAll('.home-btns button')].filter(b => b.textContent.includes('Je ne sais pas')).length === 1, 'un seul bouton « Je ne sais pas » à l’accueil');

// --- Parcours douleur, 2 nuances
w.startPain();
A(d.querySelectorAll('#intensityOptions .face-btn').length === 2, 'nuance 2 : deux choix');
w.selectIntensity({ v: 1, label: 'Un peu mal', spoken: 'un peu mal', face: '🙁' });
A(d.getElementById('screen-body').classList.contains('active'), 'intensité → corps');
w.toggleZone('bras-d', 'Bras droit', 'au bras droit');
w.goRecap();
A(d.getElementById('recapSentence').textContent === "J'ai un peu mal au bras droit.", 'phrase douleur');
A(d.querySelectorAll('#recapMiniBodies svg').length >= 1, 'mini-corps dans le récap');

// --- Douleur sans zone : visuel « je ne sais pas où »
w.startPain(); w.selectIntensity({ v: 2, label: 'Très très mal', spoken: 'très très mal', face: '😭' }); w.goRecap();
A(d.getElementById('recapMiniBodies').innerHTML.includes('?'), 'récap sans zone : silhouette + ?');

// --- Échelle numérique
w.setNuances('10'); w.startPain();
A(d.querySelectorAll('#intensityOptions .num-btn').length === 10, 'nuance 10 : dix chiffres');
w.selectIntensityNum(7); w.toggleZone('ventre', 'Ventre', 'au ventre'); w.goRecap();
A(d.getElementById('recapSentence').textContent === "J'ai mal, 7 sur 10 au ventre.", 'phrase numérique');
w.setNuances('5'); w.startPain();
A([...d.querySelectorAll('#intensityOptions .label')].some(l => l.textContent === 'Très très mal'), 'nuance 5 : libellé « Très très mal » complet');
w.setNuances('2');

// --- Parcours inconnu
w.startUnknown(); w.toggleZone('tete', 'Tête', 'à la tête'); w.goRecap();
A(d.getElementById('recapSentence').textContent === "J'ai quelque chose à la tête. Tu peux m'aider ?", 'phrase « je ne sais pas »');
A(d.getElementById('recapEmoji').textContent.includes('❓'), 'récap inconnu : ❓');

// --- Paramètres : triple appui, sans code
w.goHome();
w.titleTap(); w.titleTap(); w.titleTap();
A(d.getElementById('screen-settings').classList.contains('active'), 'triple appui → paramètres');
A(d.getElementById('header').style.display === 'none', 'en-tête global masqué dans les paramètres');
w.setSexe('femme');
A(d.querySelector('#segSexe button[data-v="femme"]').style.cssText.includes('background'), 'bouton Femme visuellement actif');
A(d.querySelector('#segSexe button[data-v="homme"]').style.cssText === '', 'bouton Homme désactivé');
w.setPeau('3');
A(d.getElementById('previewFront').innerHTML.includes('8B5E3C'), 'aperçu recoloré peau 3');
w.toggleSensations();
w.closeSettings();
A(d.getElementById('screen-home').classList.contains('active'), 'fermeture → accueil');
A(d.getElementById('btnSensation').style.display === 'flex', 'module sensations activé à la fermeture');
A(w.location.search.includes('peau=3') && w.location.search.includes('sexe=femme'), 'URL mise à jour à la fermeture seulement');

// --- Réouverture (régression « page blanche une fois sur deux »)
w.titleTap(); w.titleTap(); w.titleTap();
const s = d.getElementById('screen-settings');
A(s.classList.contains('active') && s.style.display === '', 'réouverture des paramètres sans style inline résiduel');
w.closeSettings();

// --- Parcours sensation
w.startSensation();
A(d.querySelectorAll('#sensOptions .sens-btn').length === 4, 'quatre sensations');
w.selectSensation({ key: 'brule', label: 'Ça brûle', spoken: 'ça brûle', icon: '🔥' });
w.toggleZone('main-g', 'Main gauche', 'à la main gauche'); w.goRecap();
A(d.getElementById('recapSentence').textContent === "Ça brûle à la main gauche. Tu peux m'aider ?", 'phrase sensation');

// --- Journal
const j = JSON.parse(w.localStorage.getItem('douleur_journal') || '[]');
A(j.length >= 5, 'journal alimenté (' + j.length + ' entrées)');
A(w.journalCSV().split('\n').length === j.length + 1, 'CSV cohérent avec le journal');

// --- Configuration lue depuis l'URL
w = boot('https://exemple.github.io/douleur/?sexe=femme&age=enfant&nuances=3&sensations=1&peau=2'); d = w.document;
A(d.getElementById('btnSensation').style.display === 'flex', 'URL : sensations=1 appliqué');
w.startPain();
A(d.querySelectorAll('#intensityOptions .face-btn').length === 3, 'URL : nuances=3 appliqué');
A(d.getElementById('bodyFront').innerHTML.includes('C8906A'), 'URL : peau=2 appliquée');

console.log('\nOK (' + ok.length + ')'); ok.forEach(m => console.log('  ✓ ' + m));
if (ko.length) { console.log('\nÉCHEC (' + ko.length + ')'); ko.forEach(m => console.log('  ✗ ' + m)); process.exit(1); }
console.log('\nTous les tests passent.');
