---
title: Comment visionner les vidéos d’une dashcam Thinkware sur PC et Mac
description: Thinkware répartit les vidéos dans des dossiers comme cont_rec, evt_rec et parking_rec. Voici comment tout voir sur une seule chronologie, avant et arrière ensemble, dans votre navigateur.
date: 2026-10-29
---

Les dashcams Thinkware comme les U3000, Q1000 et F70 Pro sont appréciées pour leur mode stationnement assisté par radar et leur bonne qualité d’image. Thinkware propose le **Thinkware Dashcam Viewer** pour Windows et Mac ainsi qu’une application mobile. Si vous préférez ne pas installer de logiciel, ou si vous êtes sur un ordinateur qui n’est pas le vôtre, il existe un chemin plus rapide.

## Comment Thinkware stocke les vidéos

Une carte Thinkware est répartie en dossiers selon le type d’enregistrement :

- `cont_rec` pour la conduite en continu
- `evt_rec` pour les incidents détectés par le capteur de choc
- `manual_rec` pour les clips enregistrés avec le bouton
- `parking_rec` et `motion_timelapse_rec` pour le mode stationnement

Les noms de fichiers ressemblent à ceci :

`REC_2024_03_15_14_30_22_F.MP4`

Le préfixe (`REC`, `EVT`, `MAN`, `MOT`, etc.) indique le type, puis viennent la date et l’heure, puis `F` ou `R` pour l’avant ou l’arrière.

Comme les dossiers découpent un même trajet en plusieurs listes, il est difficile de voir ce qui s’est passé dans l’ordre. Un clip d’événement se trouve dans un dossier, les minutes qui le précèdent dans un autre.

## Une seule chronologie avec Tripframe

[Tripframe](/) lit les noms et les dossiers Thinkware et remet chaque clip sur une seule chronologie par jour.

1. Mettez la carte microSD dans votre ordinateur.
2. Ouvrez [l’application](/app/) dans Chrome ou Edge.
3. Choisissez la carte.

Les clips d’événement, manuels et de stationnement restent étiquetés, pour que vous puissiez les filtrer, mais ils se placent parmi les clips normaux là où ils doivent être. L’avant et l’arrière se lisent ensemble ; appuyez sur `1`, `2` ou `3` pour passer entre côte à côte, image dans l’image et une seule caméra.

## L’avance image par image pour les plaques

Les caméras avant 4K de Thinkware captent beaucoup de détails, mais le flou de mouvement fait que seulement une ou deux images sont nettes. Mettez en pause, puis avancez avec les touches virgule et point jusqu’à ce que la plaque soit lisible, et appuyez sur `S` pour enregistrer cette image en PNG.

## Et le GPS ?

Tripframe trace actuellement les itinéraires GPS pour les fichiers de type Viofo (Novatek) et BlackVue. Les vidéos Thinkware se lisent entièrement, mais sans la carte. Pour le GPS Thinkware sur une carte, la visionneuse officielle reste la solution.

Voir aussi : [le mode stationnement des dashcams expliqué](/blog/dashcam-parking-mode-explained/) et les [meilleures dashcams haut de gamme](/blog/best-high-end-dashcams/).
