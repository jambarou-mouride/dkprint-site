# Site DK Print — flocage textile, Dakar

Site statique : HTML, CSS et JavaScript, sans aucun framework ni dépendance
externe. Il s'ouvre directement en double-cliquant sur un fichier `.html`,
et s'héberge tel quel (GitHub Pages, ou n'importe quel hébergeur).

## Fichiers

| Fichier | Rôle |
|---|---|
| `catalogue.html` | La page catalogue et tarifs |
| `css/style.css` | Toute la mise en forme du site |
| `js/catalogue.js` | **Les produits et les prix** — le fichier à modifier |
| `img/` | Les visuels des produits |

## Modifier les prix

Tout se passe dans `js/catalogue.js`, section « DONNÉES ».

Pour chaque produit, `prix` est le **prix unitaire plein**, celui du palier
1 à 9 pièces. Les prix des paliers 10 à 49 et 50 et plus sont calculés
automatiquement à partir des remises définies dans `PALIERS`, et arrondis
aux 50 FCFA les plus proches. Vous n'avez donc qu'un seul chiffre à changer
par produit.

Pour changer une remise, modifiez `PALIERS` : la nouvelle remise s'applique
d'un coup à tous les produits.

> Si vous modifiez un prix, reportez-le aussi dans le tableau `<noscript>`
> de `catalogue.html`. Ce tableau n'est vu que par les visiteurs dont le
> navigateur bloque JavaScript, mais il doit rester exact.

## Remplacer les visuels

Les fichiers de `img/` sont des dessins provisoires. Pour mettre vos photos :

1. Enregistrez chaque photo au format **WebP**, en **800 × 600 px**
   (cadrage 4/3), en visant moins de 80 Ko par image.
2. Déposez-la dans `img/`.
3. Dans `js/catalogue.js`, remplacez par exemple
   `photo: 'img/tshirt.svg'` par `photo: 'img/tshirt.webp'`.

## Activer les boutons de commande

Dans `js/catalogue.js`, remplacez la valeur de `WHATSAPP` par votre numéro
au format international, sans `+` ni espaces :

```js
var WHATSAPP = '221771234567';   // pour le 77 123 45 67
```

Tant que ce numéro n'est pas renseigné, un bandeau d'avertissement s'affiche
en haut de la page. Il disparaît tout seul une fois le numéro corrigé.

## Reste à construire

- `index.html` — la page vitrine (accroche, prestations, process, contact)
- `commander.html` — le configurateur de commande avec aperçu du visuel
