---
title: Jak zobaczyć dane GPS z kamery samochodowej na mapie
description: Większość kamer samochodowych z GPS ukrywa pozycję i prędkość w pliku wideo. Gdzie to jest zapisane, które marki używają jakiego formatu i jak zobaczyć trasę obok nagrania.
date: 2026-10-29
updated: 2026-10-30
---

Kamera samochodowa z GPS zapisuje co sekundę, gdzie byłeś i jak szybko jechałeś. Po zdarzeniu drogowym może to mieć duże znaczenie: pokazuje, że Twoja prędkość mieściła się w limicie, albo dokładnie, gdzie coś się stało. Na karcie nie znajdziesz jednak osobnego pliku GPS. Dane są ukryte wewnątrz filmów.

## Gdzie zapisane są dane GPS

| Marka | Jak zapisany jest GPS |
|---|---|
| Viofo i inne kamery oparte na Novatek | Wewnątrz pliku MP4, w bloku często nazywanym „freeGPS” |
| BlackVue | Zdania NMEA wewnątrz pliku MP4 |
| Thinkware | Wewnątrz pliku, we własnym formacie Thinkware |
| Nextbase | Wewnątrz pliku, we własnym formacie Nextbase |
| Garmin | Wewnątrz pliku, we własnym formacie Garmin |
| GoPro | Osobna ścieżka telemetrii (GPMF) w pliku, z wysokością i akcelerometrem |
| Tesla | Nie jest zapisywany w plikach kamery |

Zwykły odtwarzacz wideo całkowicie ignoruje te dane. Potrzebujesz programu, który wie, gdzie szukać.

## Zobacz trasę obok nagrania

[Tripframe](/app/) odczytuje GPS z plików **Viofo / Novatek**, **BlackVue** i **GoPro**.

1. Otwórz kartę w Tripframe.
2. Otwórz klip i naciśnij `G` albo kliknij **Mapa**.

Obok wideo pojawi się mapa z trasą klipu. Strzałka podąża za samochodem w trakcie odtwarzania, a pod mapą widać prędkość, kierunek i dystans, w km/h lub mph. Możesz przełączać widok mapy, satelitarny i hybrydowy oraz kolorować trasę według prędkości. Naciśnij `R`, aby nagrać wideo razem z mapą do jednego pliku.

Pod mapą wykresy pokazują prędkość, dystans, kierunek, a gdy kamera je zapisuje, także wysokość, nachylenie, przeciążenie (G) i satelity. Kliknij wykres, aby przejść do tego momentu. Naciśnij `T`, aby dodać znacznik na trasie, i `H`, aby pokazać dane z jazdy na samym wideo.

Obrazy mapy pochodzą z OpenStreetMap, a dla widoków satelitarnych z Esri. Pogoda i adresy ulic są sprawdzane tylko wtedy, gdy to włączysz. Twoje nagrania i dane GPS zostają na Twoim komputerze.

## Eksport danych GPS

Potrzebujesz trasy jako pliku? Pod mapą w Tripframe wybierz **GPX** (dla większości aplikacji mapowych i sportowych), **KML** (dla Google Earth), **CSV** (arkusz z czasem, pozycją, prędkością, kierunkiem i wysokością każdego punktu) albo **GeoJSON** (dla narzędzi GIS). Dla marek, których Tripframe jeszcze nie odczytuje, użyj programu na komputer, takiego jak Dashcam Viewer lub Registrator Viewer. Zobacz [najlepsze oprogramowanie do kamer samochodowych](/blog/best-dashcam-software/).

## GPS się nie pokazuje?

- Sprawdź, czy GPS jest włączony w ustawieniach kamery i czy uchwyt GPS lub moduł jest podłączony.
- W pierwszych minutach po uruchomieniu GPS może nie działać, gdy kamera szuka satelitów.
- Twoja marka może używać formatu, którego Tripframe jeszcze nie odczytuje; wideo nadal odtwarza się normalnie.
