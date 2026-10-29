---
title: Jak obejrzeć nagrania z kamery samochodowej Thinkware na PC i Macu
description: Thinkware dzieli nagrania na foldery takie jak cont_rec, evt_rec i parking_rec. Oto jak zobaczyć wszystko na jednej osi czasu, z kamerą przednią i tylną razem, w przeglądarce.
date: 2026-10-29
---

Kamery samochodowe Thinkware, takie jak U3000, Q1000 i F70 Pro, są popularne dzięki trybowi parkingowemu wspomaganemu radarem i solidnej jakości obrazu. Thinkware oferuje **Thinkware Dashcam Viewer** dla Windows i Maca oraz aplikację na telefon. Jeśli wolisz nie instalować oprogramowania albo korzystasz z cudzego komputera, jest szybsza droga.

## Jak Thinkware przechowuje nagrania

Karta Thinkware jest podzielona na foldery według rodzaju nagrania:

- `cont_rec` dla ciągłej jazdy
- `evt_rec` dla zdarzeń wykrytych przez czujnik G
- `manual_rec` dla nagrań zapisanych przyciskiem
- `parking_rec` i `motion_timelapse_rec` dla trybu parkingowego

Nazwy plików wyglądają tak:

`REC_2024_03_15_14_30_22_F.MP4`

Przedrostek (`REC`, `EVT`, `MAN`, `MOT` i tak dalej) oznacza rodzaj, potem idzie data i godzina, a następnie `F` lub `R` dla przodu lub tyłu.

Ponieważ foldery dzielą jeden przejazd na kilka list, trudno zobaczyć, co działo się po kolei. Nagranie zdarzenia leży w jednym folderze, a minuty przed nim w innym.

## Jedna oś czasu z Tripframe

[Tripframe](/) odczytuje nazwy i foldery Thinkware i układa każde nagranie z powrotem na jednej osi czasu dla danego dnia.

1. Włóż kartę microSD do komputera.
2. Otwórz [aplikację](/app/) w przeglądarce Chrome lub Edge.
3. Wybierz kartę.

Nagrania zdarzeń, ręczne i parkingowe pozostają oznaczone, więc możesz po nich filtrować, ale leżą między zwykłymi nagraniami, tam gdzie ich miejsce. Przód i tył odtwarzają się razem, a klawiszami `1`, `2` lub `3` przełączasz się między widokiem obok siebie, obrazem w obrazie i jedną kamerą.

## Przesuwanie klatek dla tablic rejestracyjnych

Przednie kamery 4K Thinkware rejestrują mnóstwo szczegółów, ale przez rozmycie ruchu tylko jedna lub dwie klatki są ostre. Wstrzymaj nagranie, a potem przesuwaj klawiszami przecinka i kropki, aż tablica będzie czytelna, i naciśnij `S`, aby zapisać tę klatkę jako PNG.

## A co z GPS?

Tripframe rysuje obecnie trasy GPS dla plików w stylu Viofo (Novatek) i BlackVue. Nagrania Thinkware odtwarzają się w całości, ale bez mapy. Aby zobaczyć GPS Thinkware na mapie, nadal najlepszy jest oficjalny program.

Zobacz też: [tryb parkingowy kamery samochodowej wyjaśniony](/blog/dashcam-parking-mode-explained/) oraz [najlepsze kamery samochodowe z wyższej półki](/blog/best-high-end-dashcams/).
