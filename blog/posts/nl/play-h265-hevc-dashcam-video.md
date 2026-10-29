---
title: H.265 (HEVC) dashcamvideo afspelen op Windows en Mac
description: Zwart scherm, alleen geluid of "dit bestand kan niet worden afgespeeld"? Je dashcam neemt waarschijnlijk op in H.265. Zo speel je het af in Edge, Chrome, Safari en VLC, of omzeil je het helemaal.
date: 2026-10-29
---

Veel nieuwere dashcams, waaronder de Viofo A229 Pro en A329, de 70mai A810 en verschillende BlackVue- en Thinkware-modellen, kunnen opnemen in **H.265**, ook wel **HEVC** genoemd. Bij dezelfde kwaliteit halveert dat ongeveer de bestandsgrootte ten opzichte van H.264, zodat de kaart twee keer zoveel beelden bevat.

Het addertje: niet elke computer speelt H.265 standaard af.

## Symptomen

- De video blijft zwart, maar de tijd loopt of er is geluid
- Een foutmelding als "dit bestand kan niet worden afgespeeld" of "codec niet ondersteund"
- Lege miniaturen

## De oplossing, per browser en systeem

| Waar | Speelt H.265 af? | Wat te doen |
|---|---|---|
| Edge op Windows | Meestal ja | Niets op de meeste pc's met een recente grafische chip |
| Chrome op Windows | Met de extensie | Installeer de **HEVC-videoextensies** uit de Microsoft Store |
| Safari op Mac | Ja | Niets |
| Chrome op Mac | Meestal ja | Houd Chrome en macOS up-to-date |
| Firefox | Beperkt | Gebruik in plaats daarvan Edge, Chrome of Safari |
| VLC | Ja | VLC heeft een eigen decoder |

Browsers gebruiken de hardwarematige videodecoder van je computer. Zeer oude grafische hardware kan H.265 misschien helemaal niet decoderen; dan is VLC de terugvaloptie.

## Of zet de camera op H.264

Bekijk je beelden op meerdere computers, dan is het soms makkelijker om de camera in het instellingenmenu of de app op H.264 te zetten. De bestanden worden groter, dus controleer de grootte van je kaart: [de beste SD-kaarten voor dashcams](/blog/best-sd-cards-for-dashcams/).

## In Tripframe

[Tripframe](/app/) speelt alles af wat je browser kan decoderen. Toont een opname een fout, dan lossen de stappen hierboven dat op; laad de pagina daarna opnieuw. Opnames in H.264 spelen altijd af.
