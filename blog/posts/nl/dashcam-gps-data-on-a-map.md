---
title: Zo zie je GPS-gegevens van je dashcam op een kaart
description: De meeste dashcams met GPS verbergen positie en snelheid in het videobestand. Hier lees je waar het staat, welk merk welk formaat gebruikt en hoe je de route naast de video ziet.
date: 2026-10-29
---

Een dashcam met GPS legt elke seconde vast waar je was en hoe hard je reed. Dat kan veel uitmaken na een incident: het laat zien dat je snelheid binnen de limiet bleef, of precies waar iets gebeurde. Maar je vindt geen apart GPS-bestand op de kaart. De gegevens zitten verborgen in de video's.

## Waar de GPS-gegevens staan

| Merk | Hoe GPS wordt opgeslagen |
|---|---|
| Viofo en andere camera's op basis van Novatek | In het MP4-bestand, in een blok dat vaak "freeGPS" heet |
| BlackVue | NMEA-zinnen in het MP4-bestand |
| Thinkware | In het bestand, in het eigen formaat van Thinkware |
| Nextbase | In het bestand, in het eigen formaat van Nextbase |
| Garmin | In het bestand, in het eigen formaat van Garmin |
| Tesla | Niet opgeslagen in de dashcambestanden |

Een gewone videospeler negeert deze gegevens volledig. Je hebt software nodig die weet waar ze moet zoeken.

## De route naast de video zien

[Tripframe](/app/) leest GPS uit **Viofo / Novatek**- en **BlackVue**-bestanden.

1. Open de kaart in Tripframe.
2. Open een opname en druk op `G`, of klik op **Kaart**.

Naast de video verschijnt een kaart met de route van de opname. Een markering volgt de auto terwijl de video afspeelt, met de snelheid in km/u onder de kaart. Druk op `R` om de video en de kaart samen in één bestand op te nemen.

De kaarttegels komen van OpenStreetMap. Dat is het enige wat Tripframe van internet laadt; je beelden en GPS-gegevens blijven op je computer.

## GPS-gegevens exporteren

Heb je de route als bestand nodig? Kies onder de kaart in Tripframe **GPX** (voor de meeste kaart- en sportapps), **KML** (voor Google Earth) of **CSV** (een spreadsheet met tijd, positie, snelheid en richting voor elk punt). Voor merken die Tripframe nog niet kan lezen gebruik je een desktopprogramma zoals Dashcam Viewer of Registrator Viewer. Zie [de beste dashcamsoftware](/blog/best-dashcam-software/).

## Geen GPS zichtbaar?

- Controleer of GPS is ingeschakeld in de camera-instellingen en of de GPS-houder of -module is aangesloten.
- In de eerste minuten na het starten kan GPS ontbreken terwijl de camera satellieten zoekt.
- Je merk gebruikt misschien een formaat dat Tripframe nog niet leest; de video speelt gewoon af.
