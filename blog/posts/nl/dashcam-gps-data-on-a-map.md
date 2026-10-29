---
title: Zo zie je GPS-gegevens van je dashcam op een kaart
description: De meeste dashcams met GPS verbergen positie en snelheid in het videobestand. Hier lees je waar het staat, welk merk welk formaat gebruikt en hoe je de route naast de video ziet.
date: 2026-10-29
updated: 2026-10-30
---

Een dashcam met GPS legt elke seconde vast waar je was en hoe hard je reed. Dat kan veel uitmaken na een incident: het laat zien dat je snelheid binnen de limiet bleef, of precies waar iets gebeurde. Maar je vindt geen apart GPS-bestand op de kaart. De gegevens zitten verborgen in de video’s.

## Waar de GPS-gegevens staan

| Merk | Hoe GPS wordt opgeslagen |
|---|---|
| Viofo en andere camera’s op basis van Novatek | In het MP4-bestand, in een blok dat vaak "freeGPS" heet |
| BlackVue | NMEA-zinnen in het MP4-bestand |
| Thinkware | In het bestand, in een eigen formaat van Thinkware |
| Nextbase | In het bestand, in een eigen formaat van Nextbase |
| Garmin | In het bestand, in een eigen formaat van Garmin |
| GoPro | Een apart telemetriespoor (GPMF) in het bestand, met hoogte en de versnellingsmeter |
| Tesla | Niet opgeslagen in de dashcambestanden |

Een gewone videospeler negeert deze gegevens helemaal. Je hebt software nodig die weet waar ze te vinden zijn.

## Zie de route naast de video

[Tripframe](/app/) leest GPS uit bestanden van **Viofo / Novatek**, **BlackVue** en **GoPro**.

1. Open de kaart in Tripframe.
2. Open een clip en druk op `G`, of klik op **Kaart**.

Naast de video verschijnt een kaart met de route van de clip. Een pijl volgt de auto terwijl de video speelt, met de snelheid, richting en afstand onder de kaart, in km/u of mph. Wissel tussen kaart-, satelliet- en hybride weergave en kleur de route in op snelheid. Druk op `R` om de video en de kaart samen in één bestand op te nemen.

Onder de kaart tonen grafieken snelheid, afstand, richting en, als de camera ze vastlegt, hoogte, helling, G-kracht en satellieten. Klik op een grafiek om naar dat moment te springen. Druk op `T` om een markering op de route te zetten en op `H` om de rijgegevens op de video zelf te tonen.

De kaartbeelden komen van OpenStreetMap en, voor de satellietweergave, van Esri. Weer en straatadressen worden alleen opgezocht als je dat aanzet. Je beelden en GPS-gegevens blijven op je computer.

## GPS-gegevens exporteren

Heb je de route als bestand nodig? Kies onder de kaart in Tripframe **GPX** (voor de meeste kaart- en sportapps), **KML** (voor Google Earth), **CSV** (een spreadsheet met tijd, positie, snelheid, richting en hoogte van elk punt) of **GeoJSON** (voor GIS-tools). Voor merken die Tripframe nog niet kan lezen gebruik je een desktopprogramma zoals Dashcam Viewer of Registrator Viewer. Zie [de beste dashcamsoftware](/blog/best-dashcam-software/).

## Geen GPS te zien?

- Controleer of GPS aanstaat in de camera-instellingen en of de GPS-houder of -module is aangesloten.
- In de eerste minuten na het starten kan GPS ontbreken terwijl de camera satellieten zoekt.
- Je merk gebruikt misschien een formaat dat Tripframe nog niet leest; de video speelt dan gewoon af.
