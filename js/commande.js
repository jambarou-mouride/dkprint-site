/* =========================================================================
   DK Print — Préparation de commande
   =========================================================================
   Construit le formulaire à partir des produits de js/catalogue.js, tient
   le récapitulatif à jour et fabrique le message WhatsApp.
   Ce fichier a besoin de js/site.js et js/catalogue.js, chargés avant lui.

   Le fichier choisi par le client ne quitte jamais son appareil : il est
   seulement lu par le navigateur pour en afficher un aperçu.
   ========================================================================= */

/* Largeur minimale conseillée pour un flocage net, en pixels. */
var LARGEUR_MINIMALE = 1500;

var urlApercu = null;   /* l'aperçu en cours, à libérer avant le suivant */

/* -------------------------------------------------------------------------
   Construction du formulaire
   ------------------------------------------------------------------------- */

function blocArticle(produit, ouvert) {
  var bloc = elem('details', 'article');
  bloc.open = ouvert;
  bloc.setAttribute('data-produit', produit.id);

  var titre = elem('summary', 'article__entete');
  titre.appendChild(elem('span', 'article__nom', produit.nom));
  titre.appendChild(elem('span', 'article__prix', 'à partir de ' + formatPrix(produit.prix)));
  titre.appendChild(elem('span', 'article__compteur'));
  bloc.appendChild(titre);

  var corps = elem('div', 'article__corps');

  /* Couleur */
  var champCouleur = elem('p', 'champ');
  var idCouleur = 'couleur-' + produit.id;
  var libelle = elem('label', 'champ__label', 'Couleur');
  libelle.htmlFor = idCouleur;
  champCouleur.appendChild(libelle);

  var select = document.createElement('select');
  select.className = 'champ__saisie';
  select.id = idCouleur;
  select.setAttribute('data-couleur', produit.id);
  var vide = document.createElement('option');
  vide.value = '';
  vide.textContent = 'À préciser';
  select.appendChild(vide);
  produit.couleurs.forEach(function (couleur) {
    var option = document.createElement('option');
    option.value = couleur.nom;
    option.textContent = couleur.nom;
    select.appendChild(option);
  });
  champCouleur.appendChild(select);
  corps.appendChild(champCouleur);

  /* Quantités par taille */
  var groupe = elem('fieldset', 'champ');
  groupe.appendChild(elem('legend', 'champ__label', 'Quantités par taille'));
  var grille = elem('div', 'tailles');
  produit.tailles.forEach(function (taille) {
    var cellule = elem('div', 'taille');
    var id = 'qte-' + produit.id + '-' + taille.replace(/\s+/g, '-');
    var etiquette = elem('label', 'taille__label', taille);
    etiquette.htmlFor = id;
    var saisie = document.createElement('input');
    saisie.className = 'taille__saisie';
    saisie.type = 'number';
    saisie.id = id;
    saisie.min = '0';
    saisie.max = '999';
    saisie.step = '1';
    saisie.inputMode = 'numeric';
    saisie.placeholder = '0';
    saisie.setAttribute('data-quantite', produit.id);
    saisie.setAttribute('data-taille', taille);
    cellule.appendChild(etiquette);
    cellule.appendChild(saisie);
    grille.appendChild(cellule);
  });
  groupe.appendChild(grille);
  corps.appendChild(groupe);

  bloc.appendChild(corps);
  return bloc;
}

function construireArticles() {
  var zone = document.getElementById('articles');
  if (!zone) { return; }
  var fragment = document.createDocumentFragment();
  PRODUITS.forEach(function (produit, index) {
    fragment.appendChild(blocArticle(produit, index === 0));
  });
  zone.appendChild(fragment);
}

/* -------------------------------------------------------------------------
   Lecture de ce qui a été saisi
   ------------------------------------------------------------------------- */

function valeur(id) {
  var n = document.getElementById(id);
  return n ? n.value.trim() : '';
}

/* Un nombre saisi, ramené à un entier positif raisonnable. */
function quantiteSaisie(champ) {
  var n = parseInt(champ.value, 10);
  if (isNaN(n) || n < 0) { return 0; }
  return Math.min(n, 999);
}

function lireArticles() {
  var resultat = [];
  PRODUITS.forEach(function (produit) {
    var champs = document.querySelectorAll('[data-quantite="' + produit.id + '"]');
    var lignes = [];
    var total = 0;
    for (var i = 0; i < champs.length; i++) {
      var n = quantiteSaisie(champs[i]);
      if (n > 0) {
        lignes.push({ taille: champs[i].getAttribute('data-taille'), nombre: n });
        total += n;
      }
    }
    if (total > 0) {
      var select = document.querySelector('[data-couleur="' + produit.id + '"]');
      resultat.push({
        nom: produit.nom,
        couleur: select ? select.value : '',
        lignes: lignes,
        total: total
      });
    }
  });
  return resultat;
}

function lireEmplacements() {
  var cases = document.querySelectorAll('input[name="emplacement"]:checked');
  var liste = [];
  for (var i = 0; i < cases.length; i++) { liste.push(cases[i].value); }
  return liste;
}

/* 2026-10-12 devient 12/10/2026. */
function dateEnFrancais(valeurISO) {
  var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(valeurISO);
  return m ? m[3] + '/' + m[2] + '/' + m[1] : '';
}

function lireCommande() {
  var articles = lireArticles();
  var total = 0;
  articles.forEach(function (a) { total += a.total; });
  return {
    articles: articles,
    totalPieces: total,
    emplacements: lireEmplacements(),
    texte: valeur('texte-flocage'),
    couleurFlocage: valeur('couleur-flocage'),
    nom: valeur('nom'),
    date: dateEnFrancais(valeur('date-souhaitee')),
    remarques: valeur('remarques')
  };
}

/* -------------------------------------------------------------------------
   Le message WhatsApp
   ------------------------------------------------------------------------- */

function decrireArticle(article) {
  var tailles = article.lignes.map(function (l) {
    return l.taille + ' × ' + l.nombre;
  }).join(', ');
  var titre = article.nom + (article.couleur ? ' – ' + article.couleur : '');
  return '- ' + titre + ' : ' + tailles + ' (' + article.total + ' pièces)';
}

function messageCommande(commande) {
  var lignes = ['Bonjour DK Print, je souhaite passer commande.', ''];

  lignes.push('ARTICLES');
  commande.articles.forEach(function (a) { lignes.push(decrireArticle(a)); });
  lignes.push('Total : ' + commande.totalPieces + ' pièces');
  lignes.push('');

  lignes.push('FLOCAGE');
  lignes.push('Emplacement : ' + (commande.emplacements.length ? commande.emplacements.join(' + ') : 'à définir ensemble'));
  if (commande.texte)          { lignes.push('Texte à floquer : « ' + commande.texte + ' »'); }
  if (commande.couleurFlocage) { lignes.push('Couleur du flocage : ' + commande.couleurFlocage); }
  lignes.push('');

  if (commande.nom || commande.date || commande.remarques) {
    lignes.push('COMMANDE');
    if (commande.nom)       { lignes.push('De la part de : ' + commande.nom); }
    if (commande.date)      { lignes.push('Souhaitée pour le : ' + commande.date); }
    if (commande.remarques) { lignes.push('Remarques : ' + commande.remarques); }
    lignes.push('');
  }

  lignes.push('Je vous envoie mon visuel juste après dans cette conversation.');
  return lignes.join('\n');
}

/* -------------------------------------------------------------------------
   Le récapitulatif affiché
   ------------------------------------------------------------------------- */

function ligneRecap(intitule, valeurTexte) {
  var ligne = elem('p', 'recap__ligne');
  ligne.appendChild(elem('span', 'recap__intitule', intitule));
  ligne.appendChild(elem('span', 'recap__valeur', valeurTexte));
  return ligne;
}

function majCompteurs(commande) {
  PRODUITS.forEach(function (produit) {
    var bloc = document.querySelector('[data-produit="' + produit.id + '"]');
    if (!bloc) { return; }
    var compteur = bloc.querySelector('.article__compteur');
    var trouve = null;
    commande.articles.forEach(function (a) { if (a.nom === produit.nom) { trouve = a; } });
    compteur.textContent = trouve ? trouve.total + ' pièces' : '';
    compteur.hidden = !trouve;
  });
}

function majRecap() {
  var commande = lireCommande();
  var zone = document.getElementById('recap-contenu');
  var bouton = document.getElementById('envoi');
  if (!zone || !bouton) { return; }

  majCompteurs(commande);
  zone.textContent = '';

  if (commande.totalPieces === 0) {
    zone.appendChild(elem('p', 'recap__vide',
      'Indiquez au moins une quantité pour préparer votre demande.'));
    bouton.className = 'bouton bouton--commande bouton--inactif';
    bouton.setAttribute('aria-disabled', 'true');
    bouton.removeAttribute('href');
    bouton.removeAttribute('target');
    return;
  }

  commande.articles.forEach(function (a) {
    var tailles = a.lignes.map(function (l) { return l.taille + ' × ' + l.nombre; }).join(', ');
    zone.appendChild(ligneRecap(a.nom + (a.couleur ? ' – ' + a.couleur : ''), tailles));
  });
  zone.appendChild(ligneRecap('Total', commande.totalPieces + ' pièces'));
  if (commande.emplacements.length) {
    zone.appendChild(ligneRecap('Emplacement', commande.emplacements.join(' + ')));
  }
  if (commande.texte) { zone.appendChild(ligneRecap('Texte', '« ' + commande.texte + ' »')); }
  if (commande.date)  { zone.appendChild(ligneRecap('Pour le', commande.date)); }

  bouton.className = 'bouton bouton--commande';
  bouton.setAttribute('aria-disabled', 'false');
  bouton.href = lienWhatsApp(messageCommande(commande));
  bouton.target = '_blank';
  bouton.rel = 'noopener';
}

/* -------------------------------------------------------------------------
   L'aperçu du visuel — tout se passe dans le navigateur
   ------------------------------------------------------------------------- */

function poidsLisible(octets) {
  if (octets < 1024) { return octets + ' o'; }
  if (octets < 1024 * 1024) { return Math.round(octets / 1024) + ' Ko'; }
  return (octets / (1024 * 1024)).toFixed(1).replace('.', ',') + ' Mo';
}

function messageQualite(largeur) {
  if (largeur >= LARGEUR_MINIMALE) {
    return { texte: 'Résolution suffisante pour un flocage net.', classe: 'apercu__avis apercu__avis--bon' };
  }
  return {
    texte: 'Image un peu petite (moins de ' + LARGEUR_MINIMALE + ' pixels de large). ' +
           'Le rendu risque d’être flou en grand format. Si vous avez l’original, préférez-le.',
    classe: 'apercu__avis apercu__avis--alerte'
  };
}

function afficherApercu(fichier) {
  var zone = document.getElementById('apercu-visuel');
  if (!zone) { return; }

  if (urlApercu) { URL.revokeObjectURL(urlApercu); urlApercu = null; }
  zone.textContent = '';

  if (!fichier) { zone.hidden = true; return; }
  zone.hidden = false;

  zone.appendChild(ligneRecap('Fichier', fichier.name));
  zone.appendChild(ligneRecap('Poids', poidsLisible(fichier.size)));

  /* Un PDF ne s'affiche pas ici, et ce n'est pas un problème : c'est même
     l'un des meilleurs formats pour le flocage. Tout autre format non
     affichable mérite en revanche un avertissement. */
  if (fichier.type.indexOf('image/') !== 0) {
    if (fichier.type === 'application/pdf') {
      zone.appendChild(elem('p', 'apercu__avis',
        'Un PDF ne s’affiche pas ici, mais c’est un excellent format pour le flocage. ' +
        'Envoyez-le-nous sur WhatsApp, nous le vérifierons.'));
    } else {
      zone.appendChild(elem('p', 'apercu__avis apercu__avis--alerte',
        'Ce format ne peut pas être affiché ici, et n’est peut-être pas exploitable. ' +
        'Les formats conseillés sont le PNG à fond transparent, le PDF ou un fichier ' +
        'vectoriel. Dans le doute, envoyez-le-nous sur WhatsApp.'));
    }
    return;
  }

  urlApercu = URL.createObjectURL(fichier);
  var img = document.createElement('img');
  img.className = 'apercu__image';
  img.alt = 'Aperçu de votre visuel';
  img.onload = function () {
    zone.appendChild(ligneRecap('Dimensions', img.naturalWidth + ' × ' + img.naturalHeight + ' pixels'));
    var avis = messageQualite(img.naturalWidth);
    zone.appendChild(elem('p', avis.classe, avis.texte));
    zone.appendChild(elem('p', 'apercu__mention',
      'Ce fichier n’a pas été envoyé : il est resté sur votre appareil. ' +
      'Joignez-le dans la conversation WhatsApp.'));
  };
  img.onerror = function () {
    zone.appendChild(elem('p', 'apercu__avis apercu__avis--alerte',
      'Ce fichier n’a pas pu être ouvert. Vérifiez qu’il s’agit bien d’une image.'));
  };
  img.src = urlApercu;
  zone.appendChild(img);
}

/* -------------------------------------------------------------------------
   Mise en route
   ------------------------------------------------------------------------- */

function preparerCommande() {
  var formulaire = document.getElementById('commande');
  if (!formulaire) { return; }

  construireArticles();

  formulaire.addEventListener('input', majRecap);
  formulaire.addEventListener('change', majRecap);
  formulaire.addEventListener('submit', function (e) { e.preventDefault(); });

  var fichier = document.getElementById('fichier-visuel');
  if (fichier) {
    fichier.addEventListener('change', function () {
      afficherApercu(this.files && this.files[0] ? this.files[0] : null);
    });
  }

  majRecap();
}

document.addEventListener('DOMContentLoaded', preparerCommande);
