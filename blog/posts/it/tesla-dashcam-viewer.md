---
title: "Come guardare sul computer i video TeslaCam e della modalità Sentry"
description: "Il lettore integrato di Tesla va bene per un’occhiata veloce. Per scorrere RecentClips, SavedClips e SentryClips su PC o Mac, con anteriore e posteriore sincronizzati, usa il browser."
date: 2026-10-29
---

Ogni Tesla registra le sue telecamere su un’unità USB nel vano portaoggetti o nella console centrale. L’auto ha un lettore integrato, ma stare seduti al posto di guida a scorrere gli eventi Sentry non è l’ideale, e l’unità si riempie in fretta.

## Come TeslaCam salva i video

L’unità USB ha una cartella `TeslaCam` con tre parti:

- `RecentClips`: l’ultima ora di guida, sovrascritta di continuo
- `SavedClips`: clip salvate con il pulsante della dashcam o suonando il clacson (se abilitato)
- `SentryClips`: eventi registrati dalla modalità Sentry durante la sosta

Ogni evento è una cartella con il nome della data e dell’ora, che contiene file di un minuto per telecamera:

`2024-03-15_14-28-10-front.mp4`, `-back.mp4`, `-left_repeater.mp4`, `-right_repeater.mp4`

## Guardare i video TeslaCam con Tripframe

[Tripframe](/) legge data e telecamera da questi nomi.

1. Collega al computer l’unità USB della Tesla.
2. Apri [l’app](/app/) in Chrome o Edge.
3. Scegli la cartella `TeslaCam`.

Ogni minuto di video compare per giorno e ora. Le clip salvate sono contrassegnate come eventi e le clip Sentry come parcheggio, così puoi filtrare in base a ciò che cerchi. Le telecamere anteriore e posteriore dello stesso minuto si riproducono insieme, affiancate o in picture in picture.

Compaiono anche le telecamere laterali dei retrovisori, come riquadri separati allo stesso orario, così puoi aprirle subito dopo la vista anteriore e posteriore.

## Scorrere il momento

Gli eventi Sentry spesso sono pochi secondi di qualcuno che passa. Metti in pausa, avanza fotogramma per fotogramma con `,` e `.` e premi `S` per salvare il fotogramma più chiaro di un volto o di una targa come PNG con il nome dell’ora esatta.

## Resta tutto in locale

Le clip Sentry mostrano il tuo vialetto e i tuoi vicini. Tripframe non carica mai nulla: i file vengono letti sul tuo computer.

## Consigli

- Copia `SavedClips` e `SentryClips` sul computer prima che l’unità si riempia; Tesla elimina le clip più vecchie quando finisce lo spazio.
- Usa un’unità veloce e ad alta resistenza; vedi [le migliori schede SD e supporti di memoria per dashcam](/blog/best-sd-cards-for-dashcams/).
- Vuoi salvare una clip per la tua assicurazione? Leggi [come salvare i video della dashcam per l’assicurazione e la polizia](/blog/save-dashcam-footage-for-insurance/).
