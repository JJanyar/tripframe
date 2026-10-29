---
title: Comment visionner les vidéos TeslaCam et du mode Sentinelle sur votre ordinateur
description: Le lecteur intégré de la Tesla suffit pour un coup d’œil rapide. Pour parcourir RecentClips, SavedClips et SentryClips sur PC ou Mac, avant et arrière synchronisés, utilisez votre navigateur.
date: 2026-10-29
---

Chaque Tesla enregistre ses caméras sur une clé USB dans la boîte à gants ou la console centrale. La voiture a un lecteur intégré, mais rester assis au volant à faire défiler les événements Sentinelle n’est pas idéal, et la clé se remplit vite.

## Comment TeslaCam stocke les vidéos

La clé USB contient un dossier `TeslaCam` en trois parties :

- `RecentClips` : la dernière heure de conduite, écrasée en continu
- `SavedClips` : les clips que vous avez enregistrés avec le bouton dashcam ou en klaxonnant (si l’option est activée)
- `SentryClips` : les événements enregistrés par le mode Sentinelle à l’arrêt

Chaque événement est un dossier nommé d’après sa date et son heure, contenant des fichiers d’une minute par caméra :

`2024-03-15_14-28-10-front.mp4`, `-back.mp4`, `-left_repeater.mp4`, `-right_repeater.mp4`

## Regarder les vidéos TeslaCam avec Tripframe

[Tripframe](/) lit la date et la caméra dans ces noms.

1. Branchez la clé USB de la Tesla sur votre ordinateur.
2. Ouvrez [l’application](/app/) dans Chrome ou Edge.
3. Choisissez le dossier `TeslaCam`.

Chaque minute de vidéo apparaît par jour et par heure. Les clips enregistrés sont marqués comme événements et les clips Sentinelle comme stationnement, pour que vous puissiez filtrer selon ce que vous cherchez. Les caméras avant et arrière de la même minute se lisent ensemble, côte à côte ou en image dans l’image.

Les caméras latérales des rétroviseurs apparaissent aussi, sous forme de vignettes séparées au même moment, pour que vous puissiez les ouvrir juste après la vue avant et arrière.

## Décortiquer le moment

Les événements Sentinelle sont souvent quelques secondes où quelqu’un passe à côté. Mettez en pause, avancez image par image avec `,` et `.`, puis appuyez sur `S` pour enregistrer l’image la plus claire d’un visage ou d’une plaque en PNG, nommé d’après l’heure exacte.

## Gardez tout en local

Les clips Sentinelle montrent votre allée et vos voisins. Tripframe n’envoie jamais rien : les fichiers sont lus sur votre propre ordinateur.

## Conseils

- Copiez `SavedClips` et `SentryClips` sur votre ordinateur avant que la clé ne se remplisse ; Tesla supprime les anciens clips quand il n’y a plus de place.
- Utilisez une clé rapide et haute endurance ; voyez [les meilleures cartes SD et solutions de stockage pour dashcams](/blog/best-sd-cards-for-dashcams/).
- Vous sauvegardez un clip pour votre assureur ? Lisez [comment sauvegarder les vidéos de dashcam pour l’assurance et la police](/blog/save-dashcam-footage-for-insurance/).
