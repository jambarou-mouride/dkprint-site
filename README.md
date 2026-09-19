# Site DK Print — flocage textile, Dakar

Site statique : HTML, CSS et JavaScript, sans aucun framework ni dépendance
externe. Il s'ouvre directement en double-cliquant sur un fichier `.html`,
et s'héberge tel quel (GitHub Pages, ou n'importe quel hébergeur).

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html` | La page d'accueil |
| `catalogue.html` | La page catalogue et tarifs |
| `commander.html` | Le formulaire de préparation de commande |
| `css/style.css` | Toute la mise en forme du site |
| `js/site.js` | **Vos coordonnées** — numéro WhatsApp et téléphone affiché |
| `js/catalogue.js` | **Les produits et les prix** |
| `js/commande.js` | Le formulaire de commande et le message WhatsApp |
| `img/` | Les visuels |

L'ordre de chargement compte : `js/site.js`, puis `js/catalogue.js`, puis
`js/commande.js`.

Le formulaire de commande se construit tout seul à partir des produits de
`js/catalogue.js` : un produit ajouté au catalogue apparaît automatiquement
dans le formulaire, avec ses tailles et ses couleurs. Il n'y a rien à
modifier dans `commander.html`.

## Modifier les prix

Tout se passe dans `js/catalogue.js`, section « DONNÉES ».

Pour chaque produit, `prix` est le **prix unitaire plein**, celui du palier
1 à 9 pièces. Les prix des paliers 10 à 49 et 50 et plus sont calculés
automatiquement à partir des remises définies dans `PALIERS`, et arrondis
aux 50 FCFA les plus proches. Vous n'avez donc qu'un seul chiffre à changer
par produit.

Pour changer une remise, modifiez `PALIERS` : la nouvelle remise s'applique
d'un coup à tous les produits.

> Si vous modifiez un prix, reportez-le aussi dans les deux blocs
> `<noscript>` : le tableau de `catalogue.html` et la ligne de `index.html`.
> Ils ne sont vus que par les visiteurs dont le navigateur bloque
> JavaScript, mais ils doivent rester exacts.

## Remplacer les visuels

Les fichiers de `img/` sont des dessins provisoires. Pour mettre vos photos :

1. Enregistrez chaque photo au format **WebP**, en **800 × 600 px**
   (cadrage 4/3), en visant moins de 80 Ko par image.
2. Déposez-la dans `img/`.
3. Dans `js/catalogue.js`, remplacez par exemple
   `photo: 'img/tshirt.svg'` par `photo: 'img/tshirt.webp'`.

## Changer le numéro WhatsApp

Il est renseigné. Pour en changer, modifiez `js/site.js` : `WHATSAPP` au
format international sans `+` ni espaces, et `TELEPHONE_AFFICHE`, le même
numéro tel qu'il doit s'afficher à l'écran.

```js
var WHATSAPP = '221771236367';
var TELEPHONE_AFFICHE = '+221 77 123 63 67';
```

Le numéro n'est écrit qu'à cet endroit : tous les boutons du site, sur toutes
les pages, s'y alimentent. Pensez aussi au bloc `<noscript>` de la section
« Nous joindre » dans `index.html`, qui le répète en clair.

Si `WHATSAPP` contient encore un `X`, un bandeau d'avertissement s'affiche en
haut des pages. Il disparaît de lui-même une fois le numéro renseigné.

## Les images

Les photos fournies ont été recadrées au format 4/5 (vertical, adapté aux
vêtements sur cintre), leur liseré rouge retiré, et réencodées en WebP.
Chacune pèse moins de 20 Ko.

| Fichier | Où |
|---|---|
| `tshirt.webp` | Carte t-shirt du catalogue |
| `realisation-veste.webp` | Galerie de l'accueil |
| `realisation-tshirt-gris.webp` | Galerie de l'accueil |
| `realisation-tshirt-bordeaux.webp` | Galerie de l'accueil |
| `realisation-tshirt-kaki.webp` | Galerie de l'accueil |

**Il manque encore les photos du polo, du sweat et de la casquette** :
ces trois cartes affichent toujours un dessin provisoire. Déposez la photo
dans `img/` et changez la ligne `photo:` du produit dans `js/catalogue.js`.

Pour préparer une photo : format vertical 4/5, 800 × 1000 px pour une carte
produit, 600 × 750 px pour une vignette de réalisation, en WebP.

Les coordonnées, le délai et l'acompte sont renseignés.

## Le visuel du client

La page de commande affiche un aperçu du fichier choisi et prévient si
l'image fait moins de 1 500 pixels de large. **Ce fichier ne quitte jamais
l'appareil du client** : il est seulement lu par son navigateur. C'est lui
qui le joint ensuite dans la conversation WhatsApp, un lien WhatsApp ne
pouvant pas transporter de fichier.

Pour changer le seuil d'alerte, modifiez `LARGEUR_MINIMALE` en haut de
`js/commande.js`.
