---
title: Comment voir les données GPS d’une dashcam sur une carte
description: La plupart des dashcams avec GPS cachent la position et la vitesse dans le fichier vidéo. Voici où elles sont stockées, quelles marques utilisent quel format, et comment voir l’itinéraire à côté de la vidéo.
date: 2026-10-29
---

Une dashcam avec GPS enregistre où vous étiez et à quelle vitesse vous rouliez, à chaque seconde. Cela peut compter énormément après un incident : cela montre que votre vitesse respectait la limite, ou l’endroit exact où quelque chose s’est produit. Mais vous ne trouverez pas de fichier GPS séparé sur la carte. Les données sont cachées à l’intérieur des vidéos.

## Où sont stockées les données GPS

| Marque | Comment le GPS est stocké |
|---|---|
| Viofo et autres caméras basées sur Novatek | Dans le fichier MP4, dans un bloc souvent appelé « freeGPS » |
| BlackVue | Phrases NMEA dans le fichier MP4 |
| Thinkware | Dans le fichier, au format propre à Thinkware |
| Nextbase | Dans le fichier, au format propre à Nextbase |
| Garmin | Dans le fichier, au format propre à Garmin |
| Tesla | Non stocké dans les fichiers de la dashcam |

Un lecteur vidéo ordinaire ignore complètement ces données. Il vous faut un logiciel qui sait où chercher.

## Voir l’itinéraire à côté de la vidéo

[Tripframe](/app/) lit le GPS des fichiers **Viofo / Novatek** et **BlackVue**.

1. Ouvrez la carte dans Tripframe.
2. Ouvrez un clip et appuyez sur `G`, ou cliquez sur **Carte**.

Une carte apparaît à côté de la vidéo avec l’itinéraire du clip. Un repère suit la voiture pendant la lecture, avec la vitesse en km/h sous la carte. Appuyez sur `R` pour enregistrer la vidéo et la carte ensemble dans un seul fichier.

Les tuiles de la carte viennent d’OpenStreetMap. C’est la seule chose que Tripframe charge depuis internet ; vos vidéos et vos données GPS restent sur votre ordinateur.

## Exporter les données GPS

Besoin de l’itinéraire sous forme de fichier ? Sous la carte dans Tripframe, choisissez **GPX** (pour la plupart des applications de cartographie et de sport), **KML** (pour Google Earth) ou **CSV** (un tableur avec l’heure, la position, la vitesse et le cap de chaque point). Pour les marques que Tripframe ne sait pas encore lire, utilisez un programme de bureau comme Dashcam Viewer ou Registrator Viewer. Voyez [les meilleurs logiciels de dashcam](/blog/best-dashcam-software/).

## Le GPS n’apparaît pas ?

- Vérifiez que le GPS est activé dans les réglages de la caméra et que le support GPS ou le module est connecté.
- Les premières minutes après le démarrage peuvent manquer de GPS, le temps que la caméra trouve les satellites.
- Votre marque utilise peut-être un format que Tripframe ne lit pas encore ; la vidéo se lit quand même normalement.
