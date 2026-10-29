---
title: Bestandsnamen van dashcams uitgelegd, merk voor merk
description: Wat betekenen namen als 2024_0315_143022_000123F.MP4 of REC_2024_03_15_14_30_22_F.MP4? Een gids voor de datum-, tijd-, camera- en eventcodes in bestandsnamen van dashcams.
date: 2026-10-29
---

Bestandsnamen van dashcams lijken ruis, maar bijna allemaal bevatten ze dezelfde vier dingen: de **datum**, de **tijd**, de **camera** en vaak het **type opname**. Als je weet waar je moet kijken, vind je elk moment terug.

## De codes, merk voor merk

| Merk | Voorbeeld | Datum | Tijd | Camera | Type |
|---|---|---|---|---|---|
| Viofo (Novatek) | `2024_0315_143022_000123F.MP4` | `2024_0315` | `143022` | `F` `R` `I` | `P` parkeren, `E` event vóór de cameraletter |
| BlackVue | `20240315_143022_NF.mp4` | `20240315` | `143022` | tweede letter `F` `R` `I` | eerste letter `N` normaal, `E` event, `P` parkeren, `M` handmatig |
| Thinkware | `REC_2024_03_15_14_30_22_F.MP4` | `2024_03_15` | `14_30_22` | `F` `R` | voorvoegsel `REC`, `EVT`, `MAN`, `MOT` |
| 70mai | `NO20240315-143022-000123F.mp4` | `20240315` | `143022` | `F` `R` | voorvoegsel `NO` normaal, `EV` event, `PA` parkeren |
| Nextbase | `240315_143022_001_FH.MP4` | `240315` (jaar met twee cijfers) | `143022` | `F` `R` | beveiligde opnames in een eigen map |
| Tesla | `2024-03-15_14-28-10-front.mp4` | `2024-03-15` | `14-28-10` | `front`, `back`, `left_repeater`… | map: `SavedClips`, `SentryClips` |
| Garmin | `GRMN0045.MP4` | geen | geen | per camera | per map |

## Dingen waar mensen over struikelen

- **De tijd is het moment waarop de opname begon**, meestal in de tijdzone die in de camera is ingesteld. Als de klok nooit is ingesteld, of je camera zomer- en wintertijd niet automatisch aanpast, kan de tijd een uur afwijken. Controleer hem aan de hand van iets wat je zeker weet.
- **Opnames duren 1 tot 3 minuten.** Het moment dat je zoekt zit vaak aan het einde van de ene opname en het begin van de volgende.
- **Voor en achter zijn aparte bestanden** met dezelfde tijd en een andere cameraletter.
- **Eventmappen** zoals `RO`, `Event`, `evt_rec` of `Protected` bevatten opnames die de camera na een stoot heeft vergrendeld. Ze worden niet overschreven.

## Laat software het voor je lezen

[Tripframe](/app/) leest al deze schema's en toont elke opname als een leesbare datum en tijd, met de camera's van hetzelfde moment aan elkaar gekoppeld. Namen zonder datum, zoals bij Garmin, worden gesorteerd op het moment waarop het bestand is geschreven.

Je ziet de decodering live op de [homepage van Tripframe](/#moment).
