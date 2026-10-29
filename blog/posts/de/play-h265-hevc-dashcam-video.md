---
title: So spielst du H.265-(HEVC-)Dashcam-Videos unter Windows und Mac ab
description: Schwarzer Bildschirm, nur Ton oder „Diese Datei kann nicht abgespielt werden"? Deine Dashcam nimmt wahrscheinlich in H.265 auf. So spielst du es in Edge, Chrome, Safari und VLC ab oder umgehst das Problem ganz.
date: 2026-10-29
---

Viele neuere Dashcams, darunter die Viofo A229 Pro und A329, die 70mai A810 und mehrere Modelle von BlackVue und Thinkware, können in **H.265** aufnehmen, auch **HEVC** genannt. Es halbiert bei gleicher Qualität die Dateigröße gegenüber H.264 ungefähr, sodass auf die Karte doppelt so viel Material passt.

Der Haken: Nicht jeder Computer spielt H.265 von Haus aus ab.

## Symptome

- Das Video bleibt schwarz, aber die Zeit läuft oder es ist Ton zu hören
- Eine Fehlermeldung wie „Diese Datei kann nicht abgespielt werden" oder „Codec nicht unterstützt"
- Vorschaubilder sind leer

## Die Lösung, je nach Browser und System

| Wo | Spielt H.265? | Was zu tun ist |
|---|---|---|
| Edge unter Windows | Meist ja | Bei den meisten PCs mit aktuellem Grafikchip nichts |
| Chrome unter Windows | Mit der Erweiterung | Installiere die **HEVC-Videoerweiterungen** aus dem Microsoft Store |
| Safari auf dem Mac | Ja | Nichts |
| Chrome auf dem Mac | Meist ja | Halte Chrome und macOS aktuell |
| Firefox | Eingeschränkt | Nutze stattdessen Edge, Chrome oder Safari |
| VLC | Ja | VLC hat einen eigenen Decoder |

Browser nutzen den Hardware-Videodecoder deines Computers. Sehr alte Grafikhardware kann H.265 womöglich gar nicht decodieren; dann ist VLC die Ausweichlösung.

## Oder stelle die Kamera auf H.264 um

Wenn du Aufnahmen auf mehreren Computern ansiehst, kann es einfacher sein, die Kamera im Einstellungsmenü oder in der App auf H.264 umzustellen. Die Dateien werden größer, achte also auf die Kartengröße: [die besten SD-Karten für Dashcams](/blog/best-sd-cards-for-dashcams/).

## In Tripframe

[Tripframe](/app/) spielt alles ab, was dein Browser decodieren kann. Wenn ein Clip einen Fehler zeigt, beheben ihn die obigen Schritte; lade die Seite danach neu. Clips in H.264 laufen immer.
