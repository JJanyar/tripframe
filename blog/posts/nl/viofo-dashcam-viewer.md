---
title: Zo bekijk je Viofo-dashcambeelden op je computer
description: De eigen app van Viofo is gemaakt voor je telefoon. Zo bekijk je beelden van de A119, A129, A139, A229 en A329 op een pc of Mac, voor en achter synchroon, met de GPS-route op een kaart.
date: 2026-10-29
---

Viofo maakt enkele van de populairste dashcams die er zijn: de A119 Mini 2, de A229 Plus en A229 Pro, de A139 Pro met drie kanalen en het vlaggenschip A329. De hardware is uitstekend. Het bekijken van wat er is opgenomen op een computer is waar de meeste bezitters vastlopen.

## Wat Viofo je biedt

De **VIOFO-app** voor Android en iOS maakt via wifi verbinding met de camera. Die is prima om langs de weg één opname op te halen, maar een hele rit downloaden via wifi is traag, en een telefoonscherm is niet de plek om een bijna-ongeval beeld voor beeld te bestuderen.

Op een computer is er geen officiële alles-in-één-speler. De meeste bezitters belanden in Verkenner of Finder, waar ze bestanden één voor één dubbelklikken.

## Hoe Viofo zijn bestanden noemt

Viofo-camera's gebruiken het Novatek-naamgevingsschema:

`2024_0315_143022_000123F.MP4`

- `2024_0315` is de datum (15 maart 2024)
- `143022` is de tijd (14:30:22)
- `000123` is een oplopend nummer
- `F`, `R` of `I` is de camera: voor, achter of binnen
- Een `P` of `E` vóór de cameraletter markeert een parkeer- of eventopname

Vergrendelde eventopnames komen in een aparte map `RO` (read-only) en foto's in `Photo`.

## Viofo-beelden bekijken met Tripframe

[Tripframe](/) is een gratis viewer die in je browser draait en is gebouwd rond precies deze bestandsnamen.

1. Haal de microSD-kaart uit de camera en steek hem in je computer (of gebruik een USB-kaartlezer).
2. Open [tripframe.vercel.app/app](/app/) in Chrome of Edge.
3. Kies de kaart, of de map `DCIM` erop.

Elke opname is gesorteerd op dag en tijd. Voor-, achter- en binnenbestanden die op hetzelfde moment zijn opgenomen, worden gekoppeld tot één tegel, zodat je ze samen afspeelt in plaats van het bijbehorende achterbestand te zoeken. Events en parkeeropnames krijgen een eigen label en filter.

### GPS-route en snelheid

Heeft je Viofo GPS (bij de meeste huidige modellen ingebouwd in de houder), dan staat de positie in elke video opgeslagen. Tripframe leest die en tekent de route op een kaart naast de video, met de snelheid op elk moment. Druk op `G` om de kaart te tonen of te verbergen.

### Beeld voor beeld

Pauzeer en gebruik de komma- en punttoets om één beeld tegelijk te doorlopen. Druk op `S` om het exacte beeld als PNG op te slaan, genoemd naar de datum en tijd waarop het is opgenomen. Dat is meestal het beeld dat je voor een kenteken wilt hebben.

## A229 Pro en HEVC

De A229 Pro en A329 kunnen opnemen in H.265 (HEVC) om ruimte te besparen. Niet elke browser speelt HEVC standaard af. Edge doet dat op de meeste Windows-pc's, Safari op een Mac speelt het af, en Chrome op Windows heeft de gratis HEVC-videoextensie uit de Microsoft Store nodig. Zie [hoe je H.265-dashcambeelden afspeelt](/blog/play-h265-hevc-dashcam-video/) als je opnames zwart blijven. De camera op H.264 zetten lost het ook op, ten koste van grotere bestanden.

## Er wordt niets geüpload

Tripframe leest de kaart op je eigen computer. Je beelden worden nergens heen gestuurd, wat ertoe doet als de opname gezichten en kentekens van anderen toont.

Op zoek naar een nieuwe Viofo? Zie onze [gids voor dashcams uit het middensegment](/blog/best-mid-range-dashcams/) en de [beste SD-kaarten voor dashcams](/blog/best-sd-cards-for-dashcams/).
