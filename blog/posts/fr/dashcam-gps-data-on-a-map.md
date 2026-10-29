---
title: Comment voir les données GPS de votre dashcam sur une carte
description: La plupart des dashcams avec GPS cachent la position et la vitesse dans le fichier vidéo. Où elles sont stockées, quelle marque utilise quel format et comment voir le trajet à côté de la vidéo.
date: 2026-10-29
updated: 2026-10-30
---

Une dashcam avec GPS enregistre où vous étiez et à quelle vitesse vous rouliez, seconde après seconde. Cela peut compter énormément après un incident : cela montre que votre vitesse était dans la limite, ou l’endroit exact où quelque chose s’est produit. Mais vous ne trouverez aucun fichier GPS séparé sur la carte. Les données sont cachées dans les vidéos.

## Où sont stockées les données GPS

| Marque | Mode de stockage du GPS |
|---|---|
| Viofo et autres caméras basées sur Novatek | Dans le fichier MP4, dans un bloc souvent appelé « freeGPS » |
| BlackVue | Phrases NMEA dans le fichier MP4 |
| Thinkware | Dans le fichier, au format propre à Thinkware |
| Nextbase | Dans le fichier, au format propre à Nextbase |
| Garmin | Dans le fichier, au format propre à Garmin |
| GoPro | Une piste de télémétrie distincte (GPMF) dans le fichier, avec l’altitude et l’accéléromètre |
| Tesla | Non stocké dans les fichiers de la dashcam |

Un lecteur vidéo classique ignore totalement ces données. Il vous faut un logiciel qui sait où chercher.

## Voir le trajet à côté de la vidéo

[Tripframe](/app/) lit le GPS des fichiers **Viofo / Novatek**, **BlackVue** et **GoPro**.

1. Ouvrez la carte dans Tripframe.
2. Ouvrez un clip et appuyez sur `G`, ou cliquez sur **Carte**.

Une carte apparaît à côté de la vidéo avec le trajet du clip. Une flèche suit la voiture pendant la lecture, avec la vitesse, le cap et la distance sous la carte, en km/h ou en mph. Passez de la vue plan à la vue satellite ou hybride, et colorez le trajet selon la vitesse. Appuyez sur `R` pour enregistrer la vidéo et la carte ensemble dans un seul fichier.

Sous la carte, des graphiques montrent la vitesse, la distance, le cap et, quand la caméra les enregistre, l’altitude, la pente, la force G et les satellites. Cliquez sur un graphique pour aller à ce moment. Appuyez sur `T` pour placer un repère sur le trajet, et sur `H` pour afficher les données de conduite sur la vidéo elle-même.

Les images de carte viennent d’OpenStreetMap et, pour les vues satellite, d’Esri. La météo et les adresses ne sont recherchées que si vous l’activez. Vos vidéos et vos données GPS restent sur votre ordinateur.

## Exporter les données GPS

Besoin du trajet sous forme de fichier ? Sous la carte de Tripframe, choisissez **GPX** (pour la plupart des applications de cartographie et de sport), **KML** (pour Google Earth), **CSV** (un tableur avec l’heure, la position, la vitesse, le cap et l’altitude de chaque point) ou **GeoJSON** (pour les outils SIG). Pour les marques que Tripframe ne sait pas encore lire, utilisez un programme de bureau comme Dashcam Viewer ou Registrator Viewer. Voir [les meilleurs logiciels de dashcam](/blog/best-dashcam-software/).

## Le GPS n’apparaît pas ?

- Vérifiez que le GPS est activé dans les réglages de la caméra et que le support GPS ou le module est bien branché.
- Les premières minutes après le démarrage peuvent manquer de GPS, le temps que la caméra trouve les satellites.
- Votre marque utilise peut-être un format que Tripframe ne sait pas encore lire ; la vidéo se lit quand même normalement.
