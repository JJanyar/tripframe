---
title: Dashcam-Dateinamen erklärt, Marke für Marke
description: Was bedeuten Namen wie 2024_0315_143022_000123F.MP4 oder REC_2024_03_15_14_30_22_F.MP4? Ein Leitfaden zu den Codes für Datum, Uhrzeit, Kamera und Ereignis in Dashcam-Dateinamen.
date: 2026-10-29
---

Dashcam-Dateinamen sehen aus wie Rauschen, enthalten aber fast alle dieselben vier Dinge: das **Datum**, die **Uhrzeit**, die **Kamera** und oft die **Aufnahmeart**. Wenn du weißt, wo du hinschauen musst, findest du jeden Moment.

## Die Codes, Marke für Marke

| Marke | Beispiel | Datum | Uhrzeit | Kamera | Art |
|---|---|---|---|---|---|
| Viofo (Novatek) | `2024_0315_143022_000123F.MP4` | `2024_0315` | `143022` | `F` `R` `I` | `P` Parken, `E` Ereignis vor dem Kamerabuchstaben |
| BlackVue | `20240315_143022_NF.mp4` | `20240315` | `143022` | zweiter Buchstabe `F` `R` `I` | erster Buchstabe `N` normal, `E` Ereignis, `P` Parken, `M` manuell |
| Thinkware | `REC_2024_03_15_14_30_22_F.MP4` | `2024_03_15` | `14_30_22` | `F` `R` | Präfix `REC`, `EVT`, `MAN`, `MOT` |
| 70mai | `NO20240315-143022-000123F.mp4` | `20240315` | `143022` | `F` `R` | Präfix `NO` normal, `EV` Ereignis, `PA` Parken |
| Nextbase | `240315_143022_001_FH.MP4` | `240315` (zweistelliges Jahr) | `143022` | `F` `R` | geschützte Clips in eigenem Ordner |
| Tesla | `2024-03-15_14-28-10-front.mp4` | `2024-03-15` | `14-28-10` | `front`, `back`, `left_repeater`… | Ordner: `SavedClips`, `SentryClips` |
| Garmin | `GRMN0045.MP4` | keins | keine | pro Kamera | nach Ordner |

## Stolperfallen

- **Die Uhrzeit ist der Beginn des Clips**, meist in der in der Kamera eingestellten Zeitzone. Wenn die Uhr nie gestellt wurde oder deine Kamera die Sommerzeit nicht berücksichtigt, kann die Zeit um eine Stunde abweichen. Prüfe sie anhand von etwas, das du sicher weißt.
- **Clips sind 1 bis 3 Minuten lang.** Der Moment, den du suchst, liegt oft am Ende eines Clips und am Anfang des nächsten.
- **Front und Heck sind getrennte Dateien** mit derselben Uhrzeit und einem anderen Kamerabuchstaben.
- **Ereignisordner** wie `RO`, `Event`, `evt_rec` oder `Protected` enthalten Clips, die die Kamera nach einem Stoß gesperrt hat. Sie werden nicht überschrieben.

## Lass Software das für dich lesen

[Tripframe](/app/) liest all diese Schemata und zeigt jeden Clip mit lesbarem Datum und lesbarer Uhrzeit, wobei die Kameras desselben Moments gepaart sind. Namen ohne Datum, wie bei Garmin, werden nach dem Zeitpunkt sortiert, zu dem die Datei geschrieben wurde.

Die Entschlüsselung siehst du live auf der [Tripframe-Startseite](/#moment).
