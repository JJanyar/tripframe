---
title: "Come guardare sul computer i video della dashcam Viofo"
description: "L’app di Viofo è pensata per il telefono. Ecco come guardare su PC o Mac i video di A119, A129, A139, A229 e A329, anteriore e posteriore sincronizzati, con il percorso GPS su una mappa."
date: 2026-10-29
---

Viofo produce alcune delle dashcam più popolari in circolazione: la A119 Mini 2, la A229 Plus e la A229 Pro, la A139 Pro a tre canali e la ammiraglia A329. L’hardware è eccellente. Guardare ciò che ha registrato su un computer è dove la maggior parte dei possessori si blocca.

## Cosa offre Viofo

L’**app VIOFO** per Android e iOS si collega alla telecamera via Wi-Fi. Va bene per scaricare una clip a bordo strada, ma scaricare un intero viaggio via Wi-Fi è lento, e lo schermo di un telefono non è il posto dove studiare un incidente sfiorato fotogramma per fotogramma.

Su un computer non esiste un lettore ufficiale tutto in uno. La maggior parte dei possessori finisce in Esplora file o Finder, a fare doppio clic sui file uno alla volta.

## Come Viofo assegna i nomi ai file

Le telecamere Viofo usano lo schema di nomi Novatek:

`2024_0315_143022_000123F.MP4`

- `2024_0315` è la data (15 marzo 2024)
- `143022` è l’ora (14:30:22)
- `000123` è un numero progressivo
- `F`, `R` o `I` indica la telecamera: anteriore, posteriore o interna
- Una `P` o una `E` prima della lettera della telecamera indica una clip di parcheggio o evento

Le clip evento bloccate vanno in una cartella `RO` (sola lettura) separata, e le foto in `Photo`.

## Guardare i video Viofo con Tripframe

[Tripframe](/) è un lettore gratuito che funziona nel browser ed è stato costruito proprio attorno a questi nomi di file.

1. Estrai la scheda microSD dalla telecamera e inseriscila nel computer (o usa un lettore di schede USB).
2. Apri [tripframe.vercel.app/app](/app/) in Chrome o Edge.
3. Scegli la scheda, o la cartella `DCIM` al suo interno.

Ogni clip è ordinata per giorno e ora. I file anteriore, posteriore e interno registrati nello stesso momento sono abbinati in un unico riquadro, così li riproduci insieme invece di cercare il file posteriore corrispondente. Eventi e clip del parcheggio hanno una propria etichetta e un proprio filtro.

### Percorso GPS e velocità

Se la tua Viofo ha il GPS (integrato nel supporto sulla maggior parte dei modelli attuali), la posizione è salvata dentro ogni video. Tripframe la legge e disegna il percorso su una mappa accanto al video, con la velocità in ogni momento. Premi `G` per mostrare o nascondere la mappa.

### Fotogramma per fotogramma

Metti in pausa e usa i tasti virgola e punto per avanzare un fotogramma alla volta. Premi `S` per salvare il fotogramma esatto come PNG, con il nome della data e dell’ora in cui è stato registrato. Di solito è il fotogramma che ti serve per una targa.

## A229 Pro e HEVC

La A229 Pro e la A329 possono registrare in H.265 (HEVC) per risparmiare spazio. Non tutti i browser riproducono l’HEVC di serie. Edge lo riproduce sulla maggior parte dei PC Windows, Safari su Mac lo riproduce, e Chrome su Windows richiede la HEVC Video Extension gratuita dal Microsoft Store. Se le tue clip restano nere, vedi [come riprodurre i video H.265 della dashcam](/blog/play-h265-hevc-dashcam-video/). Impostare la telecamera su H.264 risolve comunque il problema, al prezzo di file più grandi.

## Non viene caricato nulla

Tripframe legge la scheda sul tuo computer. I tuoi video non vengono mai inviati da nessuna parte, cosa importante quando la clip mostra volti e targhe di altre persone.

Cerchi una nuova Viofo? Vedi la nostra [guida alle dashcam di fascia media](/blog/best-mid-range-dashcams/) e le [migliori schede SD per dashcam](/blog/best-sd-cards-for-dashcams/).
