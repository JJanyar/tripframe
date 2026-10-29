---
title: Jak oglądać nagrania z kamery samochodowej BlackVue bez BlackVue Viewer
description: Oglądaj nagrania z BlackVue DR970X, DR770X i DR900X na dowolnym komputerze, z uporządkowanymi klipami zwykłymi, zdarzeniowymi i parkingowymi oraz zsynchronizowanym przodem i tyłem. Bez instalacji.
date: 2026-10-29
---

Kamery BlackVue słyną z eleganckiego wyglądu, mocnego trybu parkingowego i funkcji chmurowych. Do oglądania nagrań na komputerze BlackVue oferuje własny program, **BlackVue Viewer**, na Windows i macOS. Działa, ale to kolejny program do zainstalowania i aktualizowania, a wiele osób chce po prostu przejrzeć jazdy z zeszłego tygodnia.

## Jak BlackVue nazywa pliki

`20240315_143022_NF.mp4`

- `20240315` to data
- `143022` to godzina
- Pierwsza litera po godzinie to rodzaj nagrania: `N` zwykłe, `E` zdarzeniowe, `P` parkingowe, `M` ręczne, plus kilka innych dla uderzeń i ruchu w trybie parkingowym
- Druga litera to kamera: `F` przód, `R` tył, `I` wnętrze

Klipy leżą w jednym folderze `Record`, więc pełna karta to jedna długa lista niemal identycznych nazw.

## Oglądanie nagrań BlackVue w przeglądarce

[Tripframe](/) od razu rozumie nazwy BlackVue.

1. Włóż kartę microSD do komputera.
2. Otwórz [aplikację](/app/) w Chrome lub Edge.
3. Wybierz kartę albo jej folder `Record`.

Klipy są pogrupowane według dni. Nagrania zwykłe, zdarzeniowe i parkingowe mają osobne etykiety, więc możesz filtrować tylko zdarzenia i od razu zobaczyć, co uruchomiło czujnik G. Pliki z przodu i z tyłu z tego samego momentu odtwarzają się obok siebie lub jako obraz w obrazie. Kliknij dwukrotnie mały podgląd albo naciśnij `W`, aby je zamienić.

### GPS

BlackVue zapisuje dziennik GPS jako dane NMEA wewnątrz pliku. Tripframe je odczytuje i pokazuje trasę oraz prędkość na mapie obok wideo.

## Kiedy BlackVue Viewer nadal jest właściwym narzędziem

BlackVue Viewer potrafi zmieniać ustawienia kamery, a aplikacja BlackVue obsługuje funkcje chmurowe, takie jak zdalny podgląd na żywo. Tripframe nie robi żadnej z tych rzeczy: to odtwarzacz. Do przeglądania tego, co się wydarzyło, jest szybszy i działa na każdym komputerze bez instalacji.

## Zachowaj swoje klipy prywatnie

Właściciele BlackVue często korzystają z chmury. Jeśli wolisz, by niektóre klipy nie trafiały na żaden serwer, Tripframe dobrze się do tego nadaje: pliki są odczytywane na Twoim komputerze i nigdy nie są wysyłane.

Porównujesz modele? Zobacz [najlepsze kamery samochodowe z najwyższej półki](/blog/best-high-end-dashcams/) i [najlepsze wielokanałowe kamery samochodowe](/blog/best-multi-channel-dashcams/).
