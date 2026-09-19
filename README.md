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

## Activer les boutons de commande

Dans `js/site.js`, remplacez la valeur de `WHATSAPP` par votre numéro
au format international, sans `+` ni espaces, ainsi que `TELEPHONE_AFFICHE`,
qui est le même numéro tel qu'il s'affiche à l'écran :

```js
var WHATSAPP = '221771234567';
var TELEPHONE_AFFICHE = '+221 77 123 45 67';
```

Le numéro n'est écrit qu'à cet endroit : tous les boutons du site, sur toutes
les pages, s'y alimentent.

Tant que ce numéro n'est pas renseigné, un bandeau d'avertissement s'affiche
en haut de la page. Il disparaît tout seul une fois le numéro corrigé.

## À compléter sur la page d'accueil

Trois informations manquent, faute de les avoir. Elles sont repérables
dans `index.html` :

- le délai de fabrication et le montant de l'acompte, notés `[à confirmer]`
  dans les questions fréquentes ;
- l'adresse et les horaires de l'atelier, dans la section « Nous joindre »,
  en italique ;
- les photos de réalisations, toutes provisoirement `img/realisation.svg`.

## Le visuel du client

La page de commande affiche un aperçu du fichier choisi et prévient si
l'image fait moins de 1 500 pixels de large. **Ce fichier ne quitte jamais
l'appareil du client** : il est seulement lu par son navigateur. C'est lui
qui le joint ensuite dans la conversation WhatsApp, un lien WhatsApp ne
pouvant pas transporter de fichier.

Pour changer le seuil d'alerte, modifiez `LARGEUR_MINIMALE` en haut de
`js/commande.js`.
