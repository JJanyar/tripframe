---
title: Jak obejrzeć nagrania z kamery samochodowej Viofo na komputerze
description: Własna aplikacja Viofo jest stworzona na telefon. Oto jak obejrzeć nagrania z modeli A119, A129, A139, A229 i A329 na PC lub Macu, z kamerą przednią i tylną w synchronizacji oraz trasą GPS na mapie.
date: 2026-10-29
---

Viofo produkuje jedne z najpopularniejszych kamer samochodowych: A119 Mini 2, A229 Plus i A229 Pro, trzykanałową A139 Pro oraz flagową A329. Sprzęt jest doskonały. Problem pojawia się, gdy trzeba obejrzeć nagrane materiały na komputerze, i tu utyka większość właścicieli.

## Co daje Viofo

Aplikacja **VIOFO** na Androida i iOS łączy się z kamerą przez Wi-Fi. Sprawdza się do pobrania jednego nagrania przy drodze, ale pobieranie całego przejazdu przez Wi-Fi jest wolne, a ekran telefonu to nie miejsce, w którym chcesz analizować niebezpieczną sytuację klatka po klatce.

Na komputerze nie ma oficjalnego odtwarzacza typu wszystko w jednym. Większość właścicieli ląduje w Eksploratorze plików lub Finderze i klika pliki po jednym.

## Jak Viofo nazywa swoje pliki

Kamery Viofo używają schematu nazewnictwa Novatek:

`2024_0315_143022_000123F.MP4`

- `2024_0315` to data (15 marca 2024)
- `143022` to godzina (14:30:22)
- `000123` to numer kolejny
- `F`, `R` lub `I` oznacza kamerę: przednią, tylną lub wewnętrzną
- Litera `P` lub `E` przed literą kamery oznacza nagranie parkingowe lub zdarzenia

Zablokowane nagrania zdarzeń trafiają do osobnego folderu `RO` (tylko do odczytu), a zdjęcia do folderu `Photo`.

## Oglądanie nagrań Viofo w Tripframe

[Tripframe](/) to darmowa przeglądarka nagrań działająca w Twojej przeglądarce, zbudowana właśnie wokół takich nazw plików.

1. Wyjmij kartę microSD z kamery i włóż ją do komputera (albo użyj czytnika kart USB).
2. Otwórz [tripframe.vercel.app/app](/app/) w przeglądarce Chrome lub Edge.
3. Wybierz kartę albo znajdujący się na niej folder `DCIM`.

Każde nagranie jest posortowane według dnia i godziny. Pliki z przodu, z tyłu i z wnętrza nagrane w tym samym momencie są łączone w jeden kafelek, więc odtwarzasz je razem, zamiast szukać pasującego pliku z tyłu. Zdarzenia i nagrania parkingowe mają własną etykietę i filtr.

### Trasa GPS i prędkość

Jeśli Twoja kamera Viofo ma GPS (wbudowany w uchwyt w większości obecnych modeli), pozycja jest zapisana wewnątrz każdego nagrania. Tripframe ją odczytuje i rysuje trasę na mapie obok wideo, z prędkością w każdym momencie. Naciśnij `G`, aby pokazać lub ukryć mapę.

### Klatka po klatce

Wstrzymaj nagranie i użyj klawiszy przecinka i kropki, aby przesuwać o jedną klatkę. Naciśnij `S`, aby zapisać dokładnie tę klatkę jako PNG, o nazwie z datą i godziną nagrania. To zwykle właśnie ta klatka, której potrzebujesz do odczytania tablicy rejestracyjnej.

## A229 Pro i HEVC

A229 Pro i A329 potrafią nagrywać w H.265 (HEVC), aby oszczędzać miejsce. Nie każda przeglądarka odtwarza HEVC od razu. Edge odtwarza go na większości komputerów z Windows, Safari na Macu też, a Chrome w Windows wymaga darmowego rozszerzenia HEVC Video Extension ze sklepu Microsoft Store. Jeśli nagrania pozostają czarne, zobacz [jak odtworzyć wideo H.265 z kamery samochodowej](/blog/play-h265-hevc-dashcam-video/). Problem rozwiązuje też przełączenie kamery na H.264, kosztem większych plików.

## Nic nie jest wysyłane

Tripframe odczytuje kartę na Twoim komputerze. Twoje nagrania nigdy nie są nigdzie wysyłane, co ma znaczenie, gdy na nagraniu widać twarze i tablice rejestracyjne innych osób.

Szukasz nowej kamery Viofo? Zobacz nasz [przewodnik po kamerach samochodowych ze średniej półki](/blog/best-mid-range-dashcams/) oraz [najlepsze karty SD do kamer samochodowych](/blog/best-sd-cards-for-dashcams/).
