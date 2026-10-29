---
title: Jak odtworzyć wideo H.265 (HEVC) z kamery samochodowej w systemie Windows i na Macu
description: "Czarny ekran, sam dźwięk albo komunikat „nie można odtworzyć tego pliku”? Twoja kamera samochodowa prawdopodobnie nagrywa w H.265. Oto jak odtworzyć to w Edge, Chrome, Safari i VLC albo w ogóle tego uniknąć."
date: 2026-10-29
---

Wiele nowszych kamer samochodowych, w tym Viofo A229 Pro i A329, 70mai A810 oraz kilka modeli BlackVue i Thinkware, potrafi nagrywać w **H.265**, zwanym też **HEVC**. Przy tej samej jakości pliki są mniej więcej o połowę mniejsze niż w H.264, więc na karcie mieści się dwa razy więcej nagrań.

Haczyk: nie każdy komputer odtwarza H.265 od razu po instalacji.

## Objawy

- Obraz pozostaje czarny, ale czas płynie lub słychać dźwięk
- Błąd w rodzaju „nie można odtworzyć tego pliku” albo „kodek nie jest obsługiwany”
- Puste miniatury

## Rozwiązanie dla każdej przeglądarki i systemu

| Gdzie | Odtwarza H.265? | Co zrobić |
|---|---|---|
| Edge w Windows | Zwykle tak | Nic, na większości komputerów z niedawnym układem graficznym |
| Chrome w Windows | Z rozszerzeniem | Zainstaluj **HEVC Video Extensions** ze sklepu Microsoft Store |
| Safari na Macu | Tak | Nic |
| Chrome na Macu | Zwykle tak | Aktualizuj Chrome i macOS |
| Firefox | Ograniczone | Użyj zamiast tego Edge, Chrome lub Safari |
| VLC | Tak | VLC ma własny dekoder |

Przeglądarki korzystają ze sprzętowego dekodera wideo w komputerze. Bardzo stary układ graficzny może w ogóle nie dekodować H.265, wtedy ratunkiem jest VLC.

## Albo przełącz kamerę na H.264

Jeśli oglądasz nagrania na kilku komputerach, łatwiej może być ustawić w kamerze H.264, w jej menu ustawień lub w aplikacji. Pliki będą większe, więc sprawdź pojemność karty: [najlepsze karty SD do kamer samochodowych](/blog/best-sd-cards-for-dashcams/).

## W Tripframe

[Tripframe](/app/) odtwarza wszystko, co potrafi zdekodować Twoja przeglądarka. Jeśli nagranie pokazuje błąd, pomogą kroki powyżej, a potem odśwież stronę. Nagrania w H.264 zawsze się odtwarzają.
