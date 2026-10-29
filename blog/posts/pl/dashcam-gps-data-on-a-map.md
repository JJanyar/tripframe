---
title: Jak zobaczyć dane GPS z kamery samochodowej na mapie
description: Większość kamer samochodowych z GPS ukrywa pozycję i prędkość w pliku wideo. Oto gdzie jest zapisana, które marki używają jakiego formatu i jak zobaczyć trasę obok nagrania.
date: 2026-10-29
---

Kamera samochodowa z GPS zapisuje, gdzie byłeś i jak szybko jechałeś, w każdej sekundzie. Po zdarzeniu może to mieć duże znaczenie: pokazuje, że Twoja prędkość mieściła się w limicie, albo dokładnie, gdzie coś się wydarzyło. Ale na karcie nie znajdziesz osobnego pliku GPS. Dane są ukryte wewnątrz nagrań.

## Gdzie zapisane są dane GPS

| Marka | Jak zapisany jest GPS |
|---|---|
| Viofo i inne kamery oparte na Novatek | Wewnątrz pliku MP4, w bloku często nazywanym "freeGPS" |
| BlackVue | Zdania NMEA wewnątrz pliku MP4 |
| Thinkware | Wewnątrz pliku, we własnym formacie Thinkware |
| Nextbase | Wewnątrz pliku, we własnym formacie Nextbase |
| Garmin | Wewnątrz pliku, we własnym formacie Garmin |
| Tesla | Nie jest zapisywany w plikach kamery |

Zwykły odtwarzacz wideo całkowicie ignoruje te dane. Potrzebujesz oprogramowania, które wie, gdzie szukać.

## Zobacz trasę obok nagrania

[Tripframe](/app/) odczytuje GPS z plików **Viofo / Novatek** i **BlackVue**.

1. Otwórz kartę w Tripframe.
2. Otwórz klip i naciśnij `G` albo kliknij **Mapa**.

Obok wideo pojawi się mapa z trasą klipu. Znacznik podąża za autem w trakcie odtwarzania, a pod mapą widać prędkość w km/h. Naciśnij `R`, aby nagrać wideo razem z mapą do jednego pliku.

Kafelki mapy pochodzą z OpenStreetMap. To jedyna rzecz, jaką Tripframe pobiera z internetu; Twoje nagrania i dane GPS zostają na Twoim komputerze.

## Eksport danych GPS

Potrzebujesz trasy jako pliku? Pod mapą w Tripframe wybierz **GPX** (dla większości aplikacji mapowych i sportowych), **KML** (dla Google Earth) albo **CSV** (arkusz z czasem, pozycją, prędkością i kierunkiem dla każdego punktu). Dla marek, których Tripframe jeszcze nie odczytuje, użyj programu na komputer, takiego jak Dashcam Viewer lub Registrator Viewer. Zobacz [najlepsze oprogramowanie do kamer samochodowych](/blog/best-dashcam-software/).

## GPS się nie pokazuje?

- Sprawdź, czy GPS jest włączony w ustawieniach kamery i czy uchwyt GPS lub moduł jest podłączony.
- W pierwszych minutach po uruchomieniu GPS może brakować, gdy kamera szuka satelitów.
- Twoja marka może używać formatu, którego Tripframe jeszcze nie odczytuje; wideo nadal odtwarza się normalnie.
