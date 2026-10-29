---
title: So siehst du Thinkware-Dashcam-Aufnahmen am PC und Mac an
description: Thinkware verteilt Aufnahmen auf Ordner wie cont_rec, evt_rec und parking_rec. So siehst du alles auf einer Zeitleiste, Front und Heck zusammen, in deinem Browser.
date: 2026-10-29
---

Thinkware-Dashcams wie die U3000, Q1000 und F70 Pro sind beliebt wegen ihres radargestützten Parkmodus und der soliden Bildqualität. Thinkware bietet den **Thinkware Dashcam Viewer** für Windows und Mac sowie eine Smartphone-App an. Wenn du lieber keine Software installieren willst oder an einem Computer sitzt, der nicht dir gehört, gibt es einen schnelleren Weg.

## Wie Thinkware Aufnahmen speichert

Eine Thinkware-Karte ist nach Aufnahmeart in Ordner aufgeteilt:

- `cont_rec` für die durchgehende Fahrt
- `evt_rec` für Vorfälle, die der G-Sensor erkennt
- `manual_rec` für Clips, die per Taste gespeichert wurden
- `parking_rec` und `motion_timelapse_rec` für den Parkmodus

Die Dateinamen sehen so aus:

`REC_2024_03_15_14_30_22_F.MP4`

Das Präfix (`REC`, `EVT`, `MAN`, `MOT` und so weiter) ist die Art, dann folgen Datum und Uhrzeit, dann `F` oder `R` für vorne oder hinten.

Weil die Ordner eine Fahrt auf mehrere Listen verteilen, ist die Reihenfolge der Ereignisse schwer zu erkennen. Ein Ereignisclip liegt in einem Ordner, die Minuten davor in einem anderen.

## Eine Zeitleiste mit Tripframe

[Tripframe](/) liest Thinkware-Namen und -Ordner und legt jeden Clip pro Tag zurück auf eine einzige Zeitleiste.

1. Stecke die microSD-Karte in deinen Computer.
2. Öffne [die App](/app/) in Chrome oder Edge.
3. Wähle die Karte.

Ereignis-, manuelle und Parkclips bleiben gekennzeichnet, sodass du danach filtern kannst, sie sitzen aber zwischen den normalen Clips, wo sie hingehören. Front und Heck laufen zusammen; mit `1`, `2` oder `3` wechselst du zwischen nebeneinander, Bild im Bild und einer Kamera.

## Bild-für-Bild-Schaltung für Kennzeichen

Thinkwares 4K-Frontkameras fangen viele Details ein, aber wegen der Bewegungsunschärfe sind nur ein oder zwei Bilder scharf. Pausiere, gehe dann mit den Tasten Komma und Punkt weiter, bis das Kennzeichen lesbar ist, und drücke `S`, um dieses Bild als PNG zu speichern.

## Und was ist mit GPS?

Tripframe zeichnet derzeit GPS-Routen für Dateien im Viofo-Stil (Novatek) und für BlackVue-Dateien. Thinkware-Aufnahmen werden vollständig abgespielt, aber ohne Karte. Für Thinkware-GPS auf einer Karte ist der offizielle Viewer weiterhin der richtige Weg.

Lies auch: [Dashcam-Parkmodus erklärt](/blog/dashcam-parking-mode-explained/) und die [besten High-End-Dashcams](/blog/best-high-end-dashcams/).
