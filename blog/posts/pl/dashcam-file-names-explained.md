---
title: Nazwy plików z kamer samochodowych wyjaśnione, marka po marce
description: Co znaczą nazwy takie jak 2024_0315_143022_000123F.MP4 albo REC_2024_03_15_14_30_22_F.MP4? Przewodnik po kodach daty, godziny, kamery i zdarzeń w nazwach plików z kamer samochodowych.
date: 2026-10-29
---

Nazwy plików z kamer samochodowych wyglądają jak szum, ale prawie wszystkie zawierają te same cztery rzeczy: **datę**, **godzinę**, **kamerę** i często **rodzaj nagrania**. Gdy wiesz, gdzie patrzeć, znajdziesz dowolną chwilę.

## Kody, marka po marce

| Marka | Przykład | Data | Godzina | Kamera | Rodzaj |
|---|---|---|---|---|---|
| Viofo (Novatek) | `2024_0315_143022_000123F.MP4` | `2024_0315` | `143022` | `F` `R` `I` | `P` parkingowe, `E` zdarzeniowe przed literą kamery |
| BlackVue | `20240315_143022_NF.mp4` | `20240315` | `143022` | druga litera `F` `R` `I` | pierwsza litera `N` zwykłe, `E` zdarzeniowe, `P` parkingowe, `M` ręczne |
| Thinkware | `REC_2024_03_15_14_30_22_F.MP4` | `2024_03_15` | `14_30_22` | `F` `R` | prefiks `REC`, `EVT`, `MAN`, `MOT` |
| 70mai | `NO20240315-143022-000123F.mp4` | `20240315` | `143022` | `F` `R` | prefiks `NO` zwykłe, `EV` zdarzeniowe, `PA` parkingowe |
| Nextbase | `240315_143022_001_FH.MP4` | `240315` (rok dwucyfrowy) | `143022` | `F` `R` | chronione klipy we własnym folderze |
| Tesla | `2024-03-15_14-28-10-front.mp4` | `2024-03-15` | `14-28-10` | `front`, `back`, `left_repeater`… | folder: `SavedClips`, `SentryClips` |
| Garmin | `GRMN0045.MP4` | brak | brak | zależnie od kamery | według folderu |

## Co potrafi zaskoczyć

- **Godzina to moment rozpoczęcia klipu**, zwykle w strefie czasowej ustawionej w kamerze. Jeśli zegar nigdy nie został ustawiony albo kamera nie uwzględnia zmiany czasu, godzina może być przesunięta o godzinę. Porównaj ją z czymś, co znasz.
- **Klipy trwają od 1 do 3 minut.** Szukany moment często znajduje się pod koniec jednego klipu i na początku następnego.
- **Przód i tył to osobne pliki** z tą samą godziną i inną literą kamery.
- **Foldery zdarzeń**, takie jak `RO`, `Event`, `evt_rec` czy `Protected`, zawierają klipy zablokowane przez kamerę po uderzeniu. Nie są nadpisywane.

## Niech oprogramowanie odczyta to za Ciebie

[Tripframe](/app/) odczytuje wszystkie te schematy i pokazuje każdy klip jako czytelną datę i godzinę, z kamerami z tego samego momentu połączonymi w parę. Nazwy bez daty, jak w Garminie, są sortowane według czasu zapisu pliku.

Dekodowanie na żywo zobaczysz na [stronie głównej Tripframe](/#moment).
