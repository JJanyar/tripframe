---
title: Zo bekijk je TeslaCam- en Wachtmodus-beelden op je computer
description: De viewer in de Tesla zelf is prima voor even snel kijken. Om RecentClips, SavedClips en SentryClips op een pc of Mac door te nemen, voor en achter synchroon, gebruik je je browser.
date: 2026-10-29
---

Elke Tesla neemt zijn camera's op naar een USB-stick in het handschoenenvak of de middenconsole. De auto heeft een ingebouwde viewer, maar op de bestuurdersstoel door Sentry-events scrollen is niet ideaal, en de stick raakt snel vol.

## Hoe TeslaCam beelden opslaat

De USB-stick heeft een map `TeslaCam` met drie onderdelen:

- `RecentClips`: het laatste uur rijden, doorlopend overschreven
- `SavedClips`: opnames die je hebt opgeslagen met de dashcamknop of door te toeteren (indien ingeschakeld)
- `SentryClips`: events die de Wachtmodus (Sentry Mode) heeft opgenomen tijdens het parkeren

Elk event is een map met de datum en tijd als naam, met bestanden van één minuut per camera:

`2024-03-15_14-28-10-front.mp4`, `-back.mp4`, `-left_repeater.mp4`, `-right_repeater.mp4`

## TeslaCam-beelden bekijken met Tripframe

[Tripframe](/) leest de datum en camera uit deze namen.

1. Steek de USB-stick van de Tesla in je computer.
2. Open [de app](/app/) in Chrome of Edge.
3. Kies de map `TeslaCam`.

Elke minuut beeld verschijnt per dag en tijd. Opgeslagen opnames worden als events gemarkeerd en Sentry-opnames als parkeren, zodat je kunt filteren op wat je zoekt. De voor- en achtercamera van dezelfde minuut spelen samen af, naast elkaar of beeld-in-beeld.

De zijcamera's in de spiegels verschijnen ook, als aparte tegels op hetzelfde tijdstip, zodat je ze direct na het voor- en achterbeeld kunt openen.

## Loop het moment stap voor stap door

Sentry-events zijn vaak een paar seconden van iemand die voorbijloopt. Pauzeer, ga beeld voor beeld met `,` en `.` en druk op `S` om het duidelijkste beeld van een gezicht of kenteken op te slaan als PNG, genoemd naar de exacte tijd.

## Houd het lokaal

Sentry-opnames tonen je oprit en je buren. Tripframe uploadt nooit iets: de bestanden worden op je eigen computer gelezen.

## Tips

- Kopieer `SavedClips` en `SentryClips` naar je computer voordat de stick vol raakt; Tesla verwijdert oudere opnames als er geen ruimte meer is.
- Gebruik een snelle stick met hoge schrijfduurzaamheid; zie [de beste SD-kaarten en opslag voor dashcams](/blog/best-sd-cards-for-dashcams/).
- Wil je een opname bewaren voor je verzekeraar? Lees [hoe je dashcambeelden bewaart voor verzekering en politie](/blog/save-dashcam-footage-for-insurance/).
