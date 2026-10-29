---
title: Dashcam file names explained, brand by brand
description: What do names like 2024_0315_143022_000123F.MP4 or REC_2024_03_15_14_30_22_F.MP4 mean? A guide to the date, time, camera and event codes in dashcam file names.
date: 2026-10-29
---

Dashcam file names look like noise, but nearly all of them contain the same four things: the **date**, the **time**, the **camera** and often the **type of recording**. Once you know where to look, you can find any moment.

## The codes, brand by brand

| Brand | Example | Date | Time | Camera | Type |
|---|---|---|---|---|---|
| Viofo (Novatek) | `2024_0315_143022_000123F.MP4` | `2024_0315` | `143022` | `F` `R` `I` | `P` parking, `E` event before the camera letter |
| BlackVue | `20240315_143022_NF.mp4` | `20240315` | `143022` | second letter `F` `R` `I` | first letter `N` normal, `E` event, `P` parking, `M` manual |
| Thinkware | `REC_2024_03_15_14_30_22_F.MP4` | `2024_03_15` | `14_30_22` | `F` `R` | prefix `REC`, `EVT`, `MAN`, `MOT` |
| 70mai | `NO20240315-143022-000123F.mp4` | `20240315` | `143022` | `F` `R` | prefix `NO` normal, `EV` event, `PA` parking |
| Nextbase | `240315_143022_001_FH.MP4` | `240315` (two-digit year) | `143022` | `F` `R` | protected clips in their own folder |
| Tesla | `2024-03-15_14-28-10-front.mp4` | `2024-03-15` | `14-28-10` | `front`, `back`, `left_repeater`… | folder: `SavedClips`, `SentryClips` |
| Garmin | `GRMN0045.MP4` | none | none | per camera | by folder |

## Things that catch people out

- **The time is when the clip started**, usually in the time zone set in the camera. If the clock was never set, or your camera does not adjust for daylight saving, the time can be off by an hour. Check it against something you know.
- **Clips are 1 to 3 minutes long.** The moment you are looking for is often near the end of one clip and the start of the next.
- **Front and rear are separate files** with the same time and a different camera letter.
- **Event folders** such as `RO`, `Event`, `evt_rec` or `Protected` hold clips the camera locked after a bump. They are not overwritten.

## Let software read it for you

[Tripframe](/app/) reads all of these schemes and shows each clip as a readable date and time, with the cameras of the same moment paired together. Names without a date, like Garmin's, are sorted by the time the file was written.

You can see the decoding live on the [Tripframe homepage](/#moment).
