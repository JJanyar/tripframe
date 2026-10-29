---
title: Comment visionner les vidéos d’une dashcam Viofo sur votre ordinateur
description: L’application de Viofo est conçue pour votre téléphone. Voici comment regarder les vidéos des A119, A129, A139, A229 et A329 sur PC ou Mac, avant et arrière synchronisés, avec l’itinéraire GPS sur une carte.
date: 2026-10-29
---

Viofo fabrique certaines des dashcams les plus populaires : l’A119 Mini 2, les A229 Plus et A229 Pro, l’A139 Pro à trois canaux et le modèle phare A329. Le matériel est excellent. C’est pour regarder ce qu’il a enregistré sur un ordinateur que la plupart des propriétaires bloquent.

## Ce que Viofo vous offre

L’**application VIOFO** pour Android et iOS se connecte à la caméra en Wi-Fi. Elle convient pour récupérer un clip au bord de la route, mais télécharger tout un trajet en Wi-Fi est lent, et un écran de téléphone n’est pas l’endroit où l’on veut étudier une quasi-collision image par image.

Sur un ordinateur, il n’existe aucun lecteur officiel tout-en-un. La plupart des propriétaires finissent dans l’Explorateur de fichiers ou le Finder, à double-cliquer sur les fichiers un par un.

## Comment Viofo nomme ses fichiers

Les caméras Viofo utilisent le schéma de nommage Novatek :

`2024_0315_143022_000123F.MP4`

- `2024_0315` est la date (15 mars 2024)
- `143022` est l’heure (14:30:22)
- `000123` est un numéro courant
- `F`, `R` ou `I` indique la caméra : avant, arrière ou intérieur
- Un `P` ou un `E` avant la lettre de la caméra marque un clip de stationnement ou d’événement

Les clips d’événement verrouillés vont dans un dossier `RO` (lecture seule), et les photos dans `Photo`.

## Regarder les vidéos Viofo avec Tripframe

[Tripframe](/) est une visionneuse gratuite qui fonctionne dans votre navigateur et a été conçue autour de ces noms de fichiers précisément.

1. Retirez la carte microSD de la caméra et mettez-la dans votre ordinateur (ou utilisez un lecteur de cartes USB).
2. Ouvrez [tripframe.vercel.app/app](/app/) dans Chrome ou Edge.
3. Choisissez la carte, ou le dossier `DCIM` qu’elle contient.

Chaque clip est trié par jour et par heure. Les fichiers avant, arrière et intérieur enregistrés au même moment sont appariés en une seule vignette, pour que vous les lisiez ensemble au lieu de chercher le fichier arrière correspondant. Les événements et les clips de stationnement ont leur propre étiquette et leur propre filtre.

### Itinéraire GPS et vitesse

Si votre Viofo a le GPS (intégré au support sur la plupart des modèles actuels), la position est stockée dans chaque vidéo. Tripframe la lit et trace l’itinéraire sur une carte à côté de la vidéo, avec la vitesse à chaque instant. Appuyez sur `G` pour afficher ou masquer la carte.

### Image par image

Mettez en pause et utilisez les touches virgule et point pour avancer d’une image à la fois. Appuyez sur `S` pour enregistrer l’image exacte en PNG, nommé d’après la date et l’heure de son enregistrement. C’est généralement l’image qu’il vous faut pour une plaque d’immatriculation.

## A229 Pro et HEVC

Les A229 Pro et A329 peuvent enregistrer en H.265 (HEVC) pour économiser de l’espace. Tous les navigateurs ne lisent pas le HEVC d’emblée. Edge le lit sur la plupart des PC Windows, Safari sur Mac le lit, et Chrome sous Windows a besoin de l’extension gratuite HEVC Video Extension du Microsoft Store. Voyez [comment lire une vidéo de dashcam en H.265](/blog/play-h265-hevc-dashcam-video/) si vos clips restent noirs. Passer la caméra en H.264 règle aussi le problème, au prix de fichiers plus gros.

## Rien n’est envoyé

Tripframe lit la carte sur votre propre ordinateur. Vos vidéos ne sont jamais envoyées nulle part, ce qui compte quand le clip montre les visages et les plaques d’autres personnes.

Vous cherchez une nouvelle Viofo ? Voyez notre [guide des dashcams de milieu de gamme](/blog/best-mid-range-dashcams/) et les [meilleures cartes SD pour dashcams](/blog/best-sd-cards-for-dashcams/).
