---
title: So siehst du Dashcam-GPS-Daten auf einer Karte
description: Die meisten Dashcams mit GPS verstecken Position und Geschwindigkeit in der Videodatei. Wo sie gespeichert sind, welche Marke welches Format nutzt und wie du die Route neben dem Video siehst.
date: 2026-10-29
updated: 2026-10-30
---

Eine Dashcam mit GPS zeichnet jede Sekunde auf, wo du warst und wie schnell du gefahren bist. Nach einem Vorfall kann das viel wert sein: Es zeigt, dass du innerhalb des Tempolimits warst, oder genau, wo etwas passiert ist. Eine eigene GPS-Datei findest du auf der Karte aber nicht. Die Daten stecken in den Videos.

## Wo die GPS-Daten gespeichert sind

| Marke | So wird GPS gespeichert |
|---|---|
| Viofo und andere Kameras auf Novatek-Basis | In der MP4-Datei, in einem Block, der oft „freeGPS“ heißt |
| BlackVue | NMEA-Sätze in der MP4-Datei |
| Thinkware | In der Datei, in einem eigenen Thinkware-Format |
| Nextbase | In der Datei, in einem eigenen Nextbase-Format |
| Garmin | In der Datei, in einem eigenen Garmin-Format |
| GoPro | Eine eigene Telemetriespur (GPMF) in der Datei, mit Höhe und Beschleunigungssensor |
| Tesla | Nicht in den Dashcam-Dateien gespeichert |

Ein normaler Videoplayer ignoriert diese Daten völlig. Du brauchst Software, die weiß, wo sie suchen muss.

## Die Route neben dem Video sehen

[Tripframe](/app/) liest GPS aus Dateien von **Viofo / Novatek**, **BlackVue** und **GoPro**.

1. Öffne die Karte in Tripframe.
2. Öffne einen Clip und drücke `G` oder klicke auf **Karte**.

Neben dem Video erscheint eine Karte mit der Route des Clips. Ein Pfeil folgt dem Auto, während das Video läuft, mit Geschwindigkeit, Richtung und Strecke unter der Karte, in km/h oder mph. Wechsle zwischen Karte, Satellit und Hybrid und färbe die Route nach Geschwindigkeit ein. Mit `R` nimmst du Video und Karte gemeinsam in einer Datei auf.

Unter der Karte zeigen Diagramme Geschwindigkeit, Strecke, Richtung und, wenn die Kamera sie aufzeichnet, Höhe, Steigung, G-Kraft und Satelliten. Klicke auf ein Diagramm, um zu diesem Moment zu springen. Mit `T` setzt du eine Markierung auf der Route, mit `H` blendest du die Fahrdaten direkt im Video ein.

Die Kartenbilder kommen von OpenStreetMap und, für die Satellitenansichten, von Esri. Wetter und Straßenadressen werden nur abgerufen, wenn du das einschaltest. Deine Aufnahmen und GPS-Daten bleiben auf deinem Computer.

## GPS-Daten exportieren

Du brauchst die Route als Datei? Wähle unter der Karte in Tripframe **GPX** (für die meisten Karten- und Sport-Apps), **KML** (für Google Earth), **CSV** (eine Tabelle mit Zeit, Position, Geschwindigkeit, Richtung und Höhe für jeden Punkt) oder **GeoJSON** (für GIS-Programme). Für Marken, die Tripframe noch nicht lesen kann, nimm ein Desktop-Programm wie Dashcam Viewer oder Registrator Viewer. Siehe [die beste Dashcam-Software](/blog/best-dashcam-software/).

## Kein GPS zu sehen?

- Prüfe, ob GPS in den Kameraeinstellungen eingeschaltet und die GPS-Halterung oder das GPS-Modul angeschlossen ist.
- In den ersten Minuten nach dem Start kann GPS fehlen, bis die Kamera Satelliten gefunden hat.
- Deine Marke nutzt vielleicht ein Format, das Tripframe noch nicht liest; das Video wird trotzdem normal abgespielt.
