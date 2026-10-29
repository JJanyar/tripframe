---
title: Jak obejrzeć nagrania TeslaCam i trybu Sentry na komputerze
description: Przeglądarka w samochodzie Tesli wystarczy do szybkiego rzutu oka. Aby przejrzeć RecentClips, SavedClips i SentryClips na PC lub Macu, z kamerami przednią i tylną w synchronizacji, użyj przeglądarki internetowej.
date: 2026-10-29
---

Każda Tesla zapisuje obraz ze swoich kamer na dysku USB w schowku lub w konsoli środkowej. Samochód ma wbudowaną przeglądarkę nagrań, ale przewijanie zdarzeń Sentry z fotela kierowcy nie jest wygodne, a dysk szybko się zapełnia.

## Jak TeslaCam przechowuje nagrania

Na dysku USB jest folder `TeslaCam` z trzema częściami:

- `RecentClips`: ostatnia godzina jazdy, nadpisywana na bieżąco
- `SavedClips`: nagrania zapisane przyciskiem kamery lub klaksonem (jeśli włączone)
- `SentryClips`: zdarzenia nagrane przez tryb Sentry podczas postoju

Każde zdarzenie to folder nazwany według daty i godziny, zawierający jednominutowe pliki dla każdej kamery:

`2024-03-15_14-28-10-front.mp4`, `-back.mp4`, `-left_repeater.mp4`, `-right_repeater.mp4`

## Oglądanie nagrań TeslaCam w Tripframe

[Tripframe](/) odczytuje datę i kamerę z tych nazw.

1. Podłącz dysk USB z Tesli do komputera.
2. Otwórz [aplikację](/app/) w przeglądarce Chrome lub Edge.
3. Wybierz folder `TeslaCam`.

Każda minuta nagrania pojawia się według dnia i godziny. Zapisane nagrania są oznaczone jako zdarzenia, a nagrania Sentry jako parkingowe, więc możesz filtrować według tego, czego szukasz. Kamery przednia i tylna z tej samej minuty odtwarzają się razem, obok siebie lub jako obraz w obrazie.

Kamery w lusterkach bocznych też się pojawiają, jako osobne kafelki z tego samego czasu, więc możesz je otworzyć zaraz po widoku z przodu i z tyłu.

## Przejdź przez moment krok po kroku

Zdarzenia Sentry to często kilka sekund, gdy ktoś przechodzi obok. Wstrzymaj nagranie, przesuwaj klatka po klatce klawiszami `,` i `.` oraz naciśnij `S`, aby zapisać najwyraźniejszą klatkę z twarzą lub tablicą rejestracyjną jako PNG o nazwie z dokładnym czasem.

## Zachowaj to lokalnie

Nagrania Sentry pokazują Twój podjazd i Twoich sąsiadów. Tripframe niczego nie wysyła: pliki są odczytywane na Twoim komputerze.

## Wskazówki

- Skopiuj `SavedClips` i `SentryClips` na komputer, zanim dysk się zapełni. Tesla usuwa starsze nagrania, gdy brakuje miejsca.
- Użyj szybkiego dysku o wysokiej wytrzymałości, zobacz [najlepsze karty SD i nośniki do kamer samochodowych](/blog/best-sd-cards-for-dashcams/).
- Zapisujesz nagranie dla ubezpieczyciela? Przeczytaj [jak zapisać nagrania z kamery samochodowej dla ubezpieczyciela i policji](/blog/save-dashcam-footage-for-insurance/).
