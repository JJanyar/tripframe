---
title: Comment visionner les vidéos d’une Garmin Dash Cam sur PC ou Mac
description: Les dashcams Garmin enregistrent des fichiers aux noms courts, sans date. Voici comment regarder les vidéos des Mini, 47, 57, 67W et de la série X sur un ordinateur, triées selon leur moment d’enregistrement.
date: 2026-10-29
---

Les dashcams de Garmin, de la minuscule Dash Cam Mini aux 67W et à la série X, sont compactes, fiables et faciles à installer. Côté logiciel, Garmin mise sur l’application mobile **Garmin Drive**, qui gère la vue en direct, la sauvegarde des clips et les réglages en Wi-Fi.

Sur un ordinateur, les vidéos Garmin posent un problème particulier : les fichiers ont des noms courts comme `GRMN0045.MP4`, sans date ni heure. Les trier par nom ne vous dit rien sur le moment de l’enregistrement.

## Comment Tripframe gère les fichiers Garmin

Quand un nom de fichier ne contient pas de date, [Tripframe](/) utilise la date et l’heure de dernière écriture du fichier, qui, pour une dashcam, correspond à la fin de l’enregistrement du clip. C’est assez précis pour placer chaque clip au bon jour et dans le bon ordre.

1. Mettez la carte microSD dans votre ordinateur.
2. Ouvrez [l’application](/app/) dans Chrome ou Edge.
3. Choisissez la carte ou son dossier `DCIM`.

Chaque clip arrive au bon jour, du plus récent ou du plus ancien, avec une miniature, pour que vous retrouviez un trajet d’un coup d’œil au lieu d’ouvrir les fichiers un par un.

## À savoir

- **Copiez avec précaution.** Si vous copiez d’abord les fichiers Garmin sur un autre disque, certains outils de copie remplacent la date du fichier par celle de la copie. Ouvrez directement la carte, ou utilisez une méthode de copie qui conserve les dates (un simple glisser-déposer dans l’Explorateur ou le Finder le fait).
- **Plusieurs caméras Garmin.** La fonction Garmin Dash Cam Auto-Sync enregistre plusieurs caméras dans une seule application. Sur la carte, chaque caméra a ses propres fichiers. Tripframe les affiche tous, mais ne peut les apparier comme avant et arrière que si les noms de fichiers indiquent de quelle caméra ils viennent.
- **GPS.** Garmin stocke le GPS à sa façon, que Tripframe ne lit pas encore. La vidéo se lit entièrement, sans la carte.

## Enregistrer une image fixe

Mettez en pause, avancez image par image avec `,` et `.`, puis appuyez sur `S`. Le PNG est nommé d’après la date et l’heure de cette image, ce qui est utile puisque le nom du fichier d’origine ne l’est pas.

Voir aussi : [les noms de fichiers des dashcams expliqués](/blog/dashcam-file-names-explained/) et les [meilleures dashcams pas chères](/blog/best-budget-dashcams/).
