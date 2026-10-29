---
title: So siehst du Dashcam-GPS-Daten auf einer Karte
description: Die meisten Dashcams mit GPS verstecken Position und Geschwindigkeit in der Videodatei. Hier steht, wo sie gespeichert sind, welche Marke welches Format nutzt und wie du die Route neben dem Video siehst.
date: 2026-10-29
---

Eine Dashcam mit GPS zeichnet jede Sekunde auf, wo du warst und wie schnell du gefahren bist. Nach einem Vorfall kann das viel wert sein: Es zeigt, dass du innerhalb des Tempolimits warst, oder genau, wo etwas passiert ist. Eine separate GPS-Datei findest du auf der Karte allerdings nicht. Die Daten stecken in den Videos.

## Wo die GPS-Daten gespeichert sind

| Marke | Wie GPS gespeichert wird |
|---|---|
| Viofo und andere Novatek-basierte Kameras | In der MP4-Datei, in einem Block, der oft „freeGPS" genannt wird |
| BlackVue | NMEA-Sätze in der MP4-Datei |
| Thinkware | In der Datei, in Thinkwares eigenem Format |
| Nextbase | In der Datei, in Nextbases eigenem Format |
| Garmin | In der Datei, in Garmins eigenem Format |
| Tesla | Nicht in den Dashcam-Dateien gespeichert |

Ein normaler Videoplayer ignoriert diese Daten komplett. Du brauchst Software, die weiß, wo sie suchen muss.

## Die Route neben dem Video sehen

[Tripframe](/app/) liest GPS aus **Viofo-/Novatek-** und **BlackVue**-Dateien.

1. Öffne die Karte in Tripframe.
2. Öffne einen Clip und drücke `G`, oder klicke auf **Karte**.

Neben dem Video erscheint eine Karte mit der Route des Clips. Während das Video läuft, folgt ein Marker dem Auto, und unter der Karte steht die Geschwindigkeit in km/h. Drücke `R`, um Video und Karte zusammen in einer Datei aufzuzeichnen.

Die Kartenkacheln stammen von OpenStreetMap. Das ist das Einzige, was Tripframe aus dem Internet lädt; deine Aufnahmen und GPS-Daten bleiben auf deinem Computer.

## GPS-Daten exportieren

Du brauchst die Route als Datei? Wähle in Tripframe unter der Karte **GPX** (für die meisten Karten- und Sport-Apps), **KML** (für Google Earth) oder **CSV** (eine Tabelle mit Zeit, Position, Geschwindigkeit und Richtung für jeden Punkt). Für Marken, die Tripframe noch nicht lesen kann, nutze ein Desktop-Programm wie Dashcam Viewer oder Registrator Viewer. Siehe [die beste Dashcam-Software](/blog/best-dashcam-software/).

## Es erscheint kein GPS?

- Prüfe, ob GPS in den Kameraeinstellungen eingeschaltet und die GPS-Halterung oder das Modul angeschlossen ist.
- In den ersten Minuten nach dem Start fehlt GPS eventuell, während die Kamera Satelliten sucht.
- Deine Marke nutzt vielleicht ein Format, das Tripframe noch nicht liest; das Video wird trotzdem normal abgespielt.
