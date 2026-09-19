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
  { libelle: '1 à 9 pièces',      remise: 0  },
  { libelle: '10 à 49 pièces',    remise: 10 },
  { libelle: '50 pièces et plus', remise: 20 }
];

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
    photo: 'img/tshirt.svg',
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

/* Le message WhatsApp pré-rempli pour un produit donné. */
function messageProduit(produit) {
  return 'Bonjour DK Print, je souhaite un devis pour du flocage.\n\n' +
         'Produit : ' + produit.nom + '\n' +
         'Quantité : \n' +
         'Tailles : \n' +
         'Couleur : \n\n' +
         'Je vous envoie mon visuel juste après dans cette conversation.';
}

/* Construit la carte complète d'un produit, pour la page catalogue. */
function carteProduit(produit, index) {
  var carte = elem('article', 'carte');

  var media = elem('div', 'carte__media');
  var img = document.createElement('img');
  img.src = produit.photo;
  img.alt = produit.nom + ' personnalisable par DK Print';
  img.width = 800;
  img.height = 600;
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

  /* Bouton de commande */
  var bouton = document.createElement('a');
  bouton.className = 'bouton bouton--commande';
  bouton.href = lienWhatsApp(messageProduit(produit));
  bouton.rel = 'noopener';
  bouton.textContent = 'Commander sur WhatsApp';
  bouton.setAttribute('aria-label', 'Commander ' + produit.nom + ' sur WhatsApp');
  corps.appendChild(bouton);

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
