---
title: "I nomi dei file delle dashcam spiegati, marchio per marchio"
description: "Cosa significano nomi come 2024_0315_143022_000123F.MP4 o REC_2024_03_15_14_30_22_F.MP4? Una guida ai codici di data, ora, telecamera ed evento nei nomi dei file delle dashcam."
date: 2026-10-29
---

I nomi dei file delle dashcam sembrano rumore, ma quasi tutti contengono le stesse quattro cose: la **data**, l’**ora**, la **telecamera** e spesso il **tipo di registrazione**. Una volta che sai dove guardare, puoi trovare qualsiasi momento.

## I codici, marchio per marchio

| Marchio | Esempio | Data | Ora | Telecamera | Tipo |
|---|---|---|---|---|---|
| Viofo (Novatek) | `2024_0315_143022_000123F.MP4` | `2024_0315` | `143022` | `F` `R` `I` | `P` parcheggio, `E` evento prima della lettera della telecamera |
| BlackVue | `20240315_143022_NF.mp4` | `20240315` | `143022` | seconda lettera `F` `R` `I` | prima lettera `N` normale, `E` evento, `P` parcheggio, `M` manuale |
| Thinkware | `REC_2024_03_15_14_30_22_F.MP4` | `2024_03_15` | `14_30_22` | `F` `R` | prefisso `REC`, `EVT`, `MAN`, `MOT` |
| 70mai | `NO20240315-143022-000123F.mp4` | `20240315` | `143022` | `F` `R` | prefisso `NO` normale, `EV` evento, `PA` parcheggio |
| Nextbase | `240315_143022_001_FH.MP4` | `240315` (anno a due cifre) | `143022` | `F` `R` | clip protette in una cartella a parte |
| Tesla | `2024-03-15_14-28-10-front.mp4` | `2024-03-15` | `14-28-10` | `front`, `back`, `left_repeater`… | cartella: `SavedClips`, `SentryClips` |
| Garmin | `GRMN0045.MP4` | nessuna | nessuna | per telecamera | per cartella |

## Cose che mettono in difficoltà

- **L’ora è quella in cui la clip è iniziata**, di solito nel fuso orario impostato nella telecamera. Se l’orologio non è mai stato impostato, o la telecamera non si adegua all’ora legale, l’ora può essere sbagliata di un’ora. Verificala con qualcosa che conosci.
- **Le clip durano da 1 a 3 minuti.** Il momento che cerchi è spesso verso la fine di una clip e l’inizio della successiva.
- **Anteriore e posteriore sono file separati** con la stessa ora e una diversa lettera della telecamera.
- **Le cartelle degli eventi** come `RO`, `Event`, `evt_rec` o `Protected` contengono le clip che la telecamera ha bloccato dopo un urto. Non vengono sovrascritte.

## Lascia che sia il software a leggerli

[Tripframe](/app/) legge tutti questi schemi e mostra ogni clip con una data e un’ora leggibili, con le telecamere dello stesso momento abbinate. I nomi senza data, come quelli di Garmin, vengono ordinati in base al momento in cui il file è stato scritto.

Puoi vedere la decodifica in azione sulla [home page di Tripframe](/#moment).
