---
title: So siehst du Viofo-Dashcam-Aufnahmen auf deinem Computer an
description: Viofos eigene App ist für dein Smartphone gebaut. So schaust du Aufnahmen von A119, A129, A139, A229 und A329 am PC oder Mac an, Front und Heck synchron, mit der GPS-Route auf einer Karte.
date: 2026-10-29
---

Viofo baut einige der beliebtesten Dashcams überhaupt: die A119 Mini 2, die A229 Plus und A229 Pro, die Dreikanal-A139 Pro und das Flaggschiff A329. Die Hardware ist hervorragend. Wo die meisten Besitzer nicht weiterkommen, ist das Ansehen der Aufnahmen am Computer.

## Was Viofo dir bietet

Die **VIOFO-App** für Android und iOS verbindet sich per WLAN mit der Kamera. Sie ist in Ordnung, um am Straßenrand einen Clip zu holen, aber eine ganze Fahrt per WLAN herunterzuladen ist langsam, und auf einem Smartphone-Display willst du keine Beinahe-Kollision Bild für Bild untersuchen.

Am Computer gibt es keinen offiziellen Allround-Player. Die meisten Besitzer landen im Datei-Explorer oder im Finder und doppelklicken Dateien einzeln.

## So benennt Viofo seine Dateien

Viofo-Kameras verwenden das Novatek-Namensschema:

`2024_0315_143022_000123F.MP4`

- `2024_0315` ist das Datum (15. März 2024)
- `143022` ist die Uhrzeit (14:30:22)
- `000123` ist eine laufende Nummer
- `F`, `R` oder `I` ist die Kamera: vorne, hinten oder innen
- Ein `P` oder `E` vor dem Kamerabuchstaben kennzeichnet einen Park- oder Ereignisclip

Gesperrte Ereignisclips landen in einem separaten Ordner `RO` (Read-only), Fotos in `Photo`.

## Viofo-Aufnahmen mit Tripframe ansehen

[Tripframe](/) ist ein kostenloser Viewer, der in deinem Browser läuft und genau um diese Dateinamen herum gebaut wurde.

1. Nimm die microSD-Karte aus der Kamera und stecke sie in deinen Computer (oder nutze einen USB-Kartenleser).
2. Öffne [tripframe.vercel.app/app](/app/) in Chrome oder Edge.
3. Wähle die Karte oder den Ordner `DCIM` darauf.

Jeder Clip ist nach Tag und Uhrzeit sortiert. Front-, Heck- und Innenraumdateien, die im selben Moment aufgenommen wurden, werden zu einer Kachel gepaart, sodass du sie gemeinsam abspielst, statt die passende Heckdatei zu suchen. Ereignis- und Parkclips bekommen eine eigene Kennzeichnung und einen eigenen Filter.

### GPS-Route und Geschwindigkeit

Wenn deine Viofo GPS hat (bei den meisten aktuellen Modellen in der Halterung eingebaut), ist die Position in jedem Video gespeichert. Tripframe liest sie und zeichnet die Route auf einer Karte neben dem Video, mit der Geschwindigkeit in jedem Moment. Mit `G` blendest du die Karte ein oder aus.

### Bild für Bild

Pausiere und gehe mit den Tasten Komma und Punkt jeweils ein Bild weiter. Drücke `S`, um genau dieses Bild als PNG zu speichern, benannt nach Datum und Uhrzeit der Aufnahme. Das ist meist das Bild, das du für ein Kennzeichen brauchst.

## A229 Pro und HEVC

Die A229 Pro und A329 können in H.265 (HEVC) aufnehmen, um Platz zu sparen. Nicht jeder Browser spielt HEVC von Haus aus ab. Edge spielt es auf den meisten Windows-PCs ab, Safari auf dem Mac ebenfalls, und Chrome unter Windows braucht die kostenlose HEVC-Videoerweiterung aus dem Microsoft Store. Siehe [so spielst du H.265-Dashcam-Videos ab](/blog/play-h265-hevc-dashcam-video/), falls deine Clips schwarz bleiben. Auch die Umstellung der Kamera auf H.264 löst das, zum Preis größerer Dateien.

## Nichts wird hochgeladen

Tripframe liest die Karte auf deinem eigenen Computer. Deine Aufnahmen werden nie irgendwohin gesendet, was wichtig ist, wenn der Clip Gesichter und Kennzeichen anderer Leute zeigt.

Du suchst eine neue Viofo? Sieh dir unseren [Ratgeber zu Mittelklasse-Dashcams](/blog/best-mid-range-dashcams/) und die [besten SD-Karten für Dashcams](/blog/best-sd-cards-for-dashcams/) an.
