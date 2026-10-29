---
title: "Nombres de archivo de dashcam explicados, marca por marca"
description: "¿Qué significan nombres como 2024_0315_143022_000123F.MP4 o REC_2024_03_15_14_30_22_F.MP4? Una guía de los códigos de fecha, hora, cámara y evento en los nombres de archivo de las dashcams."
date: 2026-10-29
---

Los nombres de archivo de las dashcams parecen ruido, pero casi todos contienen las mismas cuatro cosas: la **fecha**, la **hora**, la **cámara** y, a menudo, el **tipo de grabación**. Cuando sabes dónde mirar, puedes encontrar cualquier momento.

## Los códigos, marca por marca

| Marca | Ejemplo | Fecha | Hora | Cámara | Tipo |
|---|---|---|---|---|---|
| Viofo (Novatek) | `2024_0315_143022_000123F.MP4` | `2024_0315` | `143022` | `F` `R` `I` | `P` aparcamiento, `E` evento, antes de la letra de la cámara |
| BlackVue | `20240315_143022_NF.mp4` | `20240315` | `143022` | segunda letra `F` `R` `I` | primera letra `N` normal, `E` evento, `P` aparcamiento, `M` manual |
| Thinkware | `REC_2024_03_15_14_30_22_F.MP4` | `2024_03_15` | `14_30_22` | `F` `R` | prefijo `REC`, `EVT`, `MAN`, `MOT` |
| 70mai | `NO20240315-143022-000123F.mp4` | `20240315` | `143022` | `F` `R` | prefijo `NO` normal, `EV` evento, `PA` aparcamiento |
| Nextbase | `240315_143022_001_FH.MP4` | `240315` (año de dos cifras) | `143022` | `F` `R` | clips protegidos en su propia carpeta |
| Tesla | `2024-03-15_14-28-10-front.mp4` | `2024-03-15` | `14-28-10` | `front`, `back`, `left_repeater`… | carpeta: `SavedClips`, `SentryClips` |
| Garmin | `GRMN0045.MP4` | ninguna | ninguna | según la cámara | por carpeta |

## Cosas que despistan

- **La hora es la del inicio del clip**, normalmente en la zona horaria configurada en la cámara. Si nunca se ajustó el reloj, o tu cámara no cambia con el horario de verano, la hora puede estar desfasada una hora. Compárala con algo que sepas seguro.
- **Los clips duran de 1 a 3 minutos.** El momento que buscas suele estar cerca del final de un clip y el principio del siguiente.
- **La delantera y la trasera son archivos distintos**, con la misma hora y una letra de cámara diferente.
- **Las carpetas de eventos**, como `RO`, `Event`, `evt_rec` o `Protected`, guardan los clips que la cámara bloqueó tras un golpe. No se sobrescriben.

## Deja que el software lo lea por ti

[Tripframe](/app/) lee todos estos esquemas y muestra cada clip con una fecha y hora legibles, con las cámaras del mismo momento emparejadas. Los nombres sin fecha, como los de Garmin, se ordenan por el momento en que se escribió el archivo.

Puedes ver la decodificación en vivo en la [página de inicio de Tripframe](/#moment).
