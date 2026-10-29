---
title: Les noms de fichiers des dashcams expliqués, marque par marque
description: Que signifient des noms comme 2024_0315_143022_000123F.MP4 ou REC_2024_03_15_14_30_22_F.MP4 ? Un guide des codes de date, d’heure, de caméra et d’événement dans les noms de fichiers de dashcam.
date: 2026-10-29
---

Les noms de fichiers des dashcams ressemblent à du bruit, mais presque tous contiennent les mêmes quatre éléments : la **date**, l’**heure**, la **caméra** et souvent le **type d’enregistrement**. Une fois que vous savez où regarder, vous pouvez retrouver n’importe quel moment.

## Les codes, marque par marque

| Marque | Exemple | Date | Heure | Caméra | Type |
|---|---|---|---|---|---|
| Viofo (Novatek) | `2024_0315_143022_000123F.MP4` | `2024_0315` | `143022` | `F` `R` `I` | `P` stationnement, `E` événement avant la lettre de la caméra |
| BlackVue | `20240315_143022_NF.mp4` | `20240315` | `143022` | deuxième lettre `F` `R` `I` | première lettre `N` normal, `E` événement, `P` stationnement, `M` manuel |
| Thinkware | `REC_2024_03_15_14_30_22_F.MP4` | `2024_03_15` | `14_30_22` | `F` `R` | préfixe `REC`, `EVT`, `MAN`, `MOT` |
| 70mai | `NO20240315-143022-000123F.mp4` | `20240315` | `143022` | `F` `R` | préfixe `NO` normal, `EV` événement, `PA` stationnement |
| Nextbase | `240315_143022_001_FH.MP4` | `240315` (année à deux chiffres) | `143022` | `F` `R` | clips protégés dans leur propre dossier |
| Tesla | `2024-03-15_14-28-10-front.mp4` | `2024-03-15` | `14-28-10` | `front`, `back`, `left_repeater`… | dossier : `SavedClips`, `SentryClips` |
| Garmin | `GRMN0045.MP4` | aucune | aucune | selon la caméra | par dossier |

## Les pièges classiques

- **L’heure est celle du début du clip**, généralement dans le fuseau horaire réglé dans la caméra. Si l’horloge n’a jamais été réglée, ou si votre caméra ne gère pas le passage à l’heure d’été, l’heure peut être décalée d’une heure. Vérifiez-la avec un repère que vous connaissez.
- **Les clips durent de 1 à 3 minutes.** Le moment que vous cherchez se trouve souvent vers la fin d’un clip et le début du suivant.
- **L’avant et l’arrière sont des fichiers séparés**, avec la même heure et une lettre de caméra différente.
- **Les dossiers d’événements** comme `RO`, `Event`, `evt_rec` ou `Protected` contiennent les clips que la caméra a verrouillés après un choc. Ils ne sont pas écrasés.

## Laissez un logiciel les lire pour vous

[Tripframe](/app/) lit tous ces schémas et affiche chaque clip avec une date et une heure lisibles, les caméras d’un même moment étant appariées. Les noms sans date, comme ceux de Garmin, sont triés selon l’heure d’écriture du fichier.

Vous pouvez voir le décodage en direct sur la [page d’accueil de Tripframe](/#moment).
