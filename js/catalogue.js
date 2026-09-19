/* =========================================================================
   DK Print — Catalogue produits
   =========================================================================
   Ce fichier contient les produits et les prix. Pour changer un prix, une
   taille, une couleur ou une photo, modifiez la section « DONNÉES ».
   Vos coordonnées, elles, sont dans js/site.js.
   Ce fichier a besoin de js/site.js, qui doit être chargé avant lui.
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. DONNÉES — la partie que vous modifiez
   ------------------------------------------------------------------------- */

/* Les paliers dégressifs, appliqués à tous les produits.
   'remise' est un pourcentage retiré du prix unitaire plein.        */
var PALIERS = [
  { libelle: '1 à 9 pièces',      min: 1,  remise: 0  },
  { libelle: '10 à 49 pièces',    min: 10, remise: 10 },
  { libelle: '50 pièces et plus', min: 50, remise: 20 }
];

/* Les emplacements de flocage proposés. Ils ne changent pas le prix :
   un supplément éventuel est discuté sur WhatsApp. */
var EMPLACEMENTS = ['Poitrine', 'Dos', 'Manche'];

/* Les produits.
   'prix' est le prix unitaire PLEIN, celui du palier 1 à 9 pièces.
   Les prix des autres paliers sont calculés automatiquement.
   'photo' : remplacez le fichier .svg par votre photo (.webp de
   préférence, 800 × 600 px) et mettez le nom du fichier ici.        */
var PRODUITS = [
  {
    id: 'tshirt',
    nom: 'T-shirt coton 180g',
    description: 'Coton peigné 180 g/m², coupe droite. La valeur sûre pour les tenues d’équipe et l’événementiel.',
    prix: 4500,
    photo: 'img/tshirt.webp',
    tailles: ['S', 'M', 'L', 'XL', 'XXL'],
    couleurs: [
      { nom: 'Blanc',      hex: '#ffffff' },
      { nom: 'Noir',       hex: '#1a1a1a' },
      { nom: 'Gris chiné', hex: '#9aa0a6' },
      { nom: 'Marine',     hex: '#1f3864' },
      { nom: 'Rouge',      hex: '#c0392b' },
      { nom: 'Vert',       hex: '#2e7d4f' }
    ]
  },
  {
    id: 'polo',
    nom: 'Polo piqué',
    description: 'Maille piquée respirante, col et poignets côtelés. Idéal pour les tenues professionnelles.',
    prix: 7500,
    photo: 'img/polo.svg',
    tailles: ['S', 'M', 'L', 'XL', 'XXL'],
    couleurs: [
      { nom: 'Blanc',    hex: '#ffffff' },
      { nom: 'Noir',     hex: '#1a1a1a' },
      { nom: 'Marine',   hex: '#1f3864' },
      { nom: 'Bordeaux', hex: '#6d2136' },
      { nom: 'Ciel',     hex: '#7fb3d5' }
    ]
  },
  {
    id: 'sweat',
    nom: 'Sweat molletonné',
    description: 'Molleton gratté, col rond, bords côtelés. Pour les saisons fraîches et les tenues de club.',
    prix: 12000,
    photo: 'img/sweat.svg',
    tailles: ['S', 'M', 'L', 'XL', 'XXL'],
    couleurs: [
      { nom: 'Noir',       hex: '#1a1a1a' },
      { nom: 'Gris chiné', hex: '#9aa0a6' },
      { nom: 'Marine',     hex: '#1f3864' },
      { nom: 'Bordeaux',   hex: '#6d2136' }
    ]
  },
  {
    id: 'casquette',
    nom: 'Casquette brodée',
    description: 'Casquette 6 panneaux, visière préformée, fermeture réglable. Personnalisation en broderie.',
    prix: 5000,
    photo: 'img/casquette.svg',
    tailles: ['Taille unique réglable'],
    couleurs: [
      { nom: 'Noir',   hex: '#1a1a1a' },
      { nom: 'Blanc',  hex: '#ffffff' },
      { nom: 'Marine', hex: '#1f3864' },
      { nom: 'Beige',  hex: '#d8c8a9' },
      { nom: 'Rouge',  hex: '#c0392b' }
    ]
  }
];

/* -------------------------------------------------------------------------
   2. AFFICHAGE — inutile d'y toucher
   ------------------------------------------------------------------------- */

/* Prix d'un palier, arrondi aux 50 FCFA les plus proches. */
function prixPalier(prixPlein, remise) {
  return Math.round(prixPlein * (1 - remise / 100) / 50) * 50;
}

/* Le palier qui s'applique à une quantité donnée. */
function palierPour(quantite) {
  var retenu = PALIERS[0];
  PALIERS.forEach(function (palier) {
    if (quantite >= palier.min) { retenu = palier; }
  });
  return retenu;
}

/* Le palier suivant, s'il existe, pour dire au client ce qu'il gagnerait. */
function palierSuivant(quantite) {
  for (var i = 0; i < PALIERS.length; i++) {
    if (PALIERS[i].min > quantite) { return PALIERS[i]; }
  }
  return null;
}

/* Tout le calcul d'une commande, en un seul endroit.
   La remise est déduite du prix unitaire déjà arrondi : le détail affiché
   tombe donc toujours juste, sous-total moins remise égale bien le total. */
function calculer(produit, quantite) {
  var palier = palierPour(quantite);
  var unitaireRemise = prixPalier(produit.prix, palier.remise);
  return {
    palier: palier,
    unitairePlein: produit.prix,
    unitaireRemise: unitaireRemise,
    sousTotal: produit.prix * quantite,
    remise: (produit.prix - unitaireRemise) * quantite,
    total: unitaireRemise * quantite
  };
}

/* Le message WhatsApp, rempli avec ce que le client a configuré. */
function messageConfiguration(produit, choix) {
  var calcul = calculer(produit, choix.quantite);
  var lignes = ['Bonjour DK Print, je souhaite passer commande.', ''];

  lignes.push('Produit : ' + produit.nom);
  if (choix.couleur) { lignes.push('Couleur : ' + choix.couleur); }
  lignes.push('Taille : ' + choix.taille);
  lignes.push('Quantité : ' + pieces(choix.quantite));
  lignes.push('Emplacement : ' + (choix.emplacements.length ? choix.emplacements.join(' + ') : 'à définir ensemble'));
  if (choix.logo) {
    lignes.push('Visuel : je vous fournis mon logo');
  } else if (choix.texte) {
    lignes.push('Texte à floquer : « ' + choix.texte + ' »');
  }
  lignes.push('');

  lignes.push('Prix unitaire : ' + formatPrix(calcul.unitaireRemise) +
              (calcul.palier.remise ? ' (remise ' + calcul.palier.remise + ' %)' : ''));
  lignes.push('Total estimé : ' + formatPrix(calcul.total));
  lignes.push('');
  lignes.push('Je vous envoie mon visuel juste après dans cette conversation.');
  return lignes.join('\n');
}

/* -------------------------------------------------------------------------
   Le configurateur d'une fiche produit
   ------------------------------------------------------------------------- */

/* Une liste déroulante toute faite. */
function listeDeroulante(id, classe, valeurs) {
  var select = document.createElement('select');
  select.className = classe;
  select.id = id;
  valeurs.forEach(function (v) {
    var option = document.createElement('option');
    option.value = v;
    option.textContent = v;
    select.appendChild(option);
  });
  return select;
}

/* Un champ étiqueté. */
function champAvecLabel(id, texteLabel, controle) {
  var bloc = elem('p', 'champ');
  var label = elem('label', 'champ__label', texteLabel);
  label.htmlFor = id;
  bloc.appendChild(label);
  bloc.appendChild(controle);
  return bloc;
}

/* Une ligne du détail du calcul. */
function ligneDetail(classe) {
  var ligne = elem('p', 'detail__ligne' + (classe ? ' ' + classe : ''));
  ligne.appendChild(elem('span', 'detail__intitule'));
  ligne.appendChild(elem('span', 'detail__valeur'));
  return ligne;
}

function remplirLigne(ligne, intitule, valeurTexte) {
  ligne.querySelector('.detail__intitule').textContent = intitule;
  ligne.querySelector('.detail__valeur').textContent = valeurTexte;
}

function configurateur(produit) {
  var racine = elem('div', 'config');
  var prefixe = 'cfg-' + produit.id + '-';
  racine.appendChild(elem('h4', 'config__titre', 'Configurer votre commande'));

  /* --- Taille --- */
  var taille = listeDeroulante(prefixe + 'taille', 'champ__saisie', produit.tailles);
  racine.appendChild(champAvecLabel(prefixe + 'taille', 'Taille', taille));

  /* --- Couleur --- */
  var couleur = listeDeroulante(prefixe + 'couleur', 'champ__saisie',
    produit.couleurs.map(function (c) { return c.nom; }));
  racine.appendChild(champAvecLabel(prefixe + 'couleur', 'Couleur', couleur));

  /* --- Quantité --- */
  var quantite = document.createElement('input');
  quantite.className = 'champ__saisie';
  quantite.id = prefixe + 'quantite';
  quantite.type = 'number';
  quantite.min = '1';
  quantite.max = '999';
  quantite.step = '1';
  quantite.value = '1';
  quantite.inputMode = 'numeric';
  racine.appendChild(champAvecLabel(prefixe + 'quantite', 'Quantité', quantite));

  /* --- Emplacement du flocage --- */
  var groupeEmpl = elem('fieldset', 'champ');
  groupeEmpl.appendChild(elem('legend', 'champ__label', 'Emplacement du flocage'));
  var listeEmpl = elem('ul', 'puces-choix');
  var casesEmpl = [];
  EMPLACEMENTS.forEach(function (nom) {
    var li = document.createElement('li');
    var label = elem('label', 'choix');
    var cocher = document.createElement('input');
    cocher.type = 'checkbox';
    cocher.value = nom;
    casesEmpl.push(cocher);
    label.appendChild(cocher);
    label.appendChild(document.createTextNode(' ' + nom));
    li.appendChild(label);
    listeEmpl.appendChild(li);
  });
  groupeEmpl.appendChild(listeEmpl);
  racine.appendChild(groupeEmpl);

  /* --- Texte à floquer, ou logo fourni --- */
  var groupeFlocage = elem('fieldset', 'champ');
  groupeFlocage.appendChild(elem('legend', 'champ__label', 'Que faut-il floquer ?'));
  var listeFlocage = elem('ul', 'puces-choix');
  var radios = {};
  [['texte', 'Un texte'], ['logo', 'Je fournis un logo']].forEach(function (paire) {
    var li = document.createElement('li');
    var label = elem('label', 'choix');
    var radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = prefixe + 'flocage';
    radio.value = paire[0];
    if (paire[0] === 'texte') { radio.checked = true; }
    radios[paire[0]] = radio;
    label.appendChild(radio);
    label.appendChild(document.createTextNode(' ' + paire[1]));
    li.appendChild(label);
    listeFlocage.appendChild(li);
  });
  groupeFlocage.appendChild(listeFlocage);

  var texte = document.createElement('input');
  texte.className = 'champ__saisie';
  texte.id = prefixe + 'texte';
  texte.type = 'text';
  texte.maxLength = 120;
  texte.placeholder = 'Nom, numéro, slogan…';
  texte.setAttribute('aria-label', 'Texte à floquer');
  var blocTexte = elem('div', 'config__texte');
  blocTexte.appendChild(texte);
  groupeFlocage.appendChild(blocTexte);
  racine.appendChild(groupeFlocage);

  /* --- Le prix, en grand --- */
  var bloc = elem('div', 'prix-total');
  bloc.appendChild(elem('span', 'prix-total__mention', 'Total estimé'));
  var montant = elem('strong', 'prix-total__montant');
  montant.setAttribute('aria-live', 'polite');
  bloc.appendChild(montant);
  racine.appendChild(bloc);

  /* --- Le détail du calcul --- */
  var detail = elem('div', 'detail');
  detail.appendChild(elem('h5', 'detail__titre', 'Détail du calcul'));
  var lUnitaire = ligneDetail();
  var lQuantite = ligneDetail();
  var lSousTotal = ligneDetail();
  var lRemise = ligneDetail('detail__ligne--remise');
  var lTotal = ligneDetail('detail__ligne--total');
  [lUnitaire, lQuantite, lSousTotal, lRemise, lTotal].forEach(function (l) { detail.appendChild(l); });
  var mention = elem('p', 'detail__mention');
  detail.appendChild(mention);
  racine.appendChild(detail);

  /* --- Le bouton --- */
  var bouton = document.createElement('a');
  bouton.className = 'bouton bouton--commande';
  bouton.textContent = 'Commander sur WhatsApp';
  bouton.setAttribute('role', 'button');
  bouton.setAttribute('aria-label', 'Commander ' + produit.nom + ' sur WhatsApp');
  racine.appendChild(bouton);

  /* --- Ce qui fait vivre tout ça --- */
  function lireChoix() {
    var emplacements = [];
    casesEmpl.forEach(function (c) { if (c.checked) { emplacements.push(c.value); } });
    var n = parseInt(quantite.value, 10);
    if (isNaN(n) || n < 1) { n = 0; }
    return {
      taille: taille.value,
      couleur: couleur.value,
      quantite: Math.min(n, 999),
      emplacements: emplacements,
      logo: radios.logo.checked,
      texte: texte.value.trim()
    };
  }

  function rafraichir() {
    var choix = lireChoix();
    blocTexte.hidden = choix.logo;

    if (choix.quantite === 0) {
      montant.textContent = '—';
      detail.hidden = true;
      bouton.className = 'bouton bouton--commande bouton--inactif';
      bouton.setAttribute('aria-disabled', 'true');
      bouton.removeAttribute('href');
      return;
    }

    var calcul = calculer(produit, choix.quantite);
    montant.textContent = formatPrix(calcul.total);
    detail.hidden = false;

    remplirLigne(lUnitaire, 'Prix unitaire', formatPrix(calcul.unitairePlein));
    remplirLigne(lQuantite, 'Quantité', pieces(choix.quantite));
    remplirLigne(lSousTotal, 'Sous-total', formatPrix(calcul.sousTotal));

    if (calcul.palier.remise > 0) {
      lRemise.hidden = false;
      remplirLigne(lRemise,
        'Remise ' + calcul.palier.remise + ' % (' + calcul.palier.libelle + ')',
        '−' + formatPrix(calcul.remise));
    } else {
      lRemise.hidden = true;
    }
    remplirLigne(lTotal, 'Total', formatPrix(calcul.total));

    var suivant = palierSuivant(choix.quantite);
    if (suivant) {
      mention.textContent = 'Encore ' + pieces(suivant.min - choix.quantite) +
        ' et la remise passe à ' + suivant.remise + ' %.';
      mention.hidden = false;
    } else {
      mention.hidden = true;
    }

    bouton.className = 'bouton bouton--commande';
    bouton.setAttribute('aria-disabled', 'false');
    bouton.href = lienWhatsApp(messageConfiguration(produit, choix));
    bouton.target = '_blank';
    bouton.rel = 'noopener';
  }

  racine.addEventListener('input', rafraichir);
  racine.addEventListener('change', rafraichir);
  rafraichir();

  return racine;
}

/* Construit la carte complète d'un produit, pour la page catalogue. */
function carteProduit(produit, index) {
  var carte = elem('article', 'carte');

  var media = elem('div', 'carte__media');
  var img = document.createElement('img');
  img.src = produit.photo;
  img.alt = produit.nom + ' personnalisable par DK Print';
  img.width = 800;
  img.height = 1000;
  /* Les deux premières images sont visibles d'emblée, les suivantes
     ne se chargent qu'au défilement : économie de données en mobile. */
  img.loading = index < 2 ? 'eager' : 'lazy';
  img.decoding = 'async';
  media.appendChild(img);
  carte.appendChild(media);

  var corps = elem('div', 'carte__corps');
  corps.appendChild(elem('h3', 'carte__nom', produit.nom));
  corps.appendChild(elem('p', 'carte__desc', produit.description));

  /* Prix de départ */
  var depart = elem('p', 'carte__depart');
  depart.appendChild(elem('span', 'carte__depart-mention', 'À partir de'));
  depart.appendChild(elem('span', 'carte__depart-prix', formatPrix(produit.prix)));
  depart.appendChild(elem('span', 'carte__depart-unite', 'l’unité'));
  corps.appendChild(depart);

  /* Paliers dégressifs */
  var paliers = elem('ul', 'paliers');
  PALIERS.forEach(function (palier) {
    var li = elem('li', 'paliers__ligne');
    li.appendChild(elem('span', 'paliers__qte', palier.libelle));
    var prix = elem('span', 'paliers__prix', formatPrix(prixPalier(produit.prix, palier.remise)));
    if (palier.remise > 0) {
      prix.appendChild(elem('span', 'paliers__remise',
        String.fromCharCode(8722) + palier.remise + ESPACE_INSECABLE + '%'));
    }
    li.appendChild(prix);
    paliers.appendChild(li);
  });
  corps.appendChild(paliers);

  /* Tailles */
  var blocTailles = elem('div', 'bloc');
  blocTailles.appendChild(elem('h4', 'bloc__titre', 'Tailles disponibles'));
  var listeTailles = elem('ul', 'puces');
  produit.tailles.forEach(function (taille) {
    listeTailles.appendChild(elem('li', 'puce', taille));
  });
  blocTailles.appendChild(listeTailles);
  corps.appendChild(blocTailles);

  /* Couleurs */
  var blocCouleurs = elem('div', 'bloc');
  blocCouleurs.appendChild(elem('h4', 'bloc__titre', 'Couleurs disponibles'));
  var listeCouleurs = elem('ul', 'couleurs');
  produit.couleurs.forEach(function (couleur) {
    var li = elem('li', 'couleur');
    var pastille = elem('span', 'couleur__pastille');
    pastille.style.backgroundColor = couleur.hex;
    li.appendChild(pastille);
    li.appendChild(elem('span', 'couleur__nom', couleur.nom));
    listeCouleurs.appendChild(li);
  });
  blocCouleurs.appendChild(listeCouleurs);
  corps.appendChild(blocCouleurs);

  /* Configurateur */
  corps.appendChild(configurateur(produit));

  carte.appendChild(corps);
  return carte;
}

/* Page catalogue : la grille complète. */
function afficherCatalogue() {
  var grille = document.getElementById('catalogue');
  if (!grille) { return; }
  var fragment = document.createDocumentFragment();
  PRODUITS.forEach(function (produit, index) {
    fragment.appendChild(carteProduit(produit, index));
  });
  grille.appendChild(fragment);
}

/* Page d'accueil : la bande « à partir de », alimentée par les mêmes
   données, pour que les prix ne puissent pas diverger d'une page à l'autre. */
function afficherApercuTarifs() {
  var bande = document.getElementById('apercu-tarifs');
  if (!bande) { return; }
  var fragment = document.createDocumentFragment();
  PRODUITS.forEach(function (produit) {
    var lien = document.createElement('a');
    lien.className = 'tarif';
    lien.href = 'catalogue.html';
    lien.appendChild(elem('span', 'tarif__nom', produit.nom));
    lien.appendChild(elem('span', 'tarif__mention', 'à partir de'));
    lien.appendChild(elem('span', 'tarif__prix', formatPrix(produit.prix)));
    fragment.appendChild(lien);
  });
  bande.appendChild(fragment);
}

document.addEventListener('DOMContentLoaded', function () {
  afficherCatalogue();
  afficherApercuTarifs();
});
