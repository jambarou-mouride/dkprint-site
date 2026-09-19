/* =========================================================================
   DK Print — réglages communs à toutes les pages
   =========================================================================
   Ce fichier contient vos coordonnées. Il est chargé par toutes les pages :
   vous ne modifiez votre numéro qu'ici, une seule fois.
   ========================================================================= */

/* -------------------------------------------------------------------------
   1. VOS COORDONNÉES — la partie que vous modifiez
   ------------------------------------------------------------------------- */

/* Numéro WhatsApp au format international, sans + ni espaces.
   Exemple pour le 77 123 45 67 à Dakar : '221771234567'            */
var WHATSAPP = '221771236367';

/* Le même numéro, tel qu'il doit s'afficher à l'écran.             */
var TELEPHONE_AFFICHE = '+221 77 123 63 67';

/* -------------------------------------------------------------------------
   2. OUTILS COMMUNS — inutile d'y toucher
   ------------------------------------------------------------------------- */

/* Espace insécable : séparateur de milliers, et espace avant FCFA.
   Écrit sous forme de code pour rester visible dans l'éditeur.     */
var ESPACE_INSECABLE = String.fromCharCode(160);

/* 12500 devient « 12 500 FCFA », sans risque de coupure en fin de ligne. */
function formatPrix(montant) {
  var s = String(Math.round(montant)).replace(/\B(?=(\d{3})+(?!\d))/g, ESPACE_INSECABLE);
  return s + ESPACE_INSECABLE + 'FCFA';
}

/* Construit un lien WhatsApp avec un message déjà rédigé. */
function lienWhatsApp(message) {
  return 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message);
}

/* Le message par défaut, pour les boutons qui ne visent pas un produit. */
function messageGeneral() {
  return 'Bonjour DK Print, je souhaite un devis pour du flocage.\n\n' +
         'Produit : \n' +
         'Quantité : \n\n' +
         'Je vous envoie mon visuel juste après dans cette conversation.';
}

/* « 1 pièce », « 12 pièces » : l'accord du pluriel, une bonne fois. */
function pieces(n) {
  return n + ' pièce' + (n > 1 ? 's' : '');
}

/* Encadre un texte de guillemets français, sauf s'il en porte déjà :
   « « Ndakaru » » se lit mal. */
function citer(texte) {
  if (texte.indexOf('\u00AB') !== -1 || texte.indexOf('\u00BB') !== -1) { return texte; }
  return '\u00AB ' + texte + ' \u00BB';
}

function elem(balise, classe, texte) {
  var n = document.createElement(balise);
  if (classe) { n.className = classe; }
  if (texte)  { n.textContent = texte; }
  return n;
}

/* Renseigne tous les liens marqués data-whatsapp et affiche le numéro
   partout où il est marqué data-telephone. */
function preparerLiensWhatsApp() {
  var liens = document.querySelectorAll('[data-whatsapp]');
  var i;
  for (i = 0; i < liens.length; i++) {
    liens[i].href = lienWhatsApp(liens[i].getAttribute('data-whatsapp') || messageGeneral());
    liens[i].rel = 'noopener';
  }
  var numeros = document.querySelectorAll('[data-telephone]');
  for (i = 0; i < numeros.length; i++) {
    numeros[i].textContent = TELEPHONE_AFFICHE;
  }
}

/* Rappel visible tant que le vrai numéro n'est pas renseigné.
   Il disparaît tout seul dès que WHATSAPP est corrigé. */
function verifierConfiguration() {
  if (WHATSAPP.indexOf('X') === -1) { return; }
  var principal = document.querySelector('main');
  if (!principal) { return; }
  var avis = elem('p', 'avis-config',
    'Configuration à terminer : remplacez le numéro WhatsApp dans js/site.js pour activer les boutons de commande.');
  /* Le bandeau doit rester aligné sur le contenu : si <main> n'est pas
     lui-même un conteneur, on lui en donne un. */
  var aInserer = avis;
  if (principal.className.indexOf('conteneur') === -1) {
    aInserer = elem('div', 'conteneur');
    aInserer.appendChild(avis);
  }
  principal.insertBefore(aInserer, principal.firstChild);
}

document.addEventListener('DOMContentLoaded', function () {
  preparerLiensWhatsApp();
  verifierConfiguration();
});
