---
title: So siehst du TeslaCam- und Sentry-Mode-Aufnahmen auf deinem Computer an
description: Teslas Viewer im Auto ist für einen schnellen Blick in Ordnung. Um RecentClips, SavedClips und SentryClips am PC oder Mac durchzugehen, Front und Heck synchron, nutze deinen Browser.
date: 2026-10-29
---

Jeder Tesla zeichnet seine Kameras auf einen USB-Stick im Handschuhfach oder in der Mittelkonsole auf. Das Auto hat einen eingebauten Viewer, aber auf dem Fahrersitz durch Sentry-Ereignisse zu scrollen ist nicht ideal, und der Stick füllt sich schnell.

## Wie TeslaCam Aufnahmen speichert

Auf dem USB-Stick liegt ein Ordner `TeslaCam` mit drei Teilen:

- `RecentClips`: die letzte Stunde Fahrt, laufend überschrieben
- `SavedClips`: Clips, die du mit der Dashcam-Taste oder durch Hupen gespeichert hast (falls aktiviert)
- `SentryClips`: Ereignisse, die der Sentry Mode beim Parken aufgezeichnet hat

Jedes Ereignis ist ein Ordner, der nach Datum und Uhrzeit benannt ist und Ein-Minuten-Dateien pro Kamera enthält:

`2024-03-15_14-28-10-front.mp4`, `-back.mp4`, `-left_repeater.mp4`, `-right_repeater.mp4`

## TeslaCam-Aufnahmen mit Tripframe ansehen

[Tripframe](/) liest Datum und Kamera aus diesen Namen.

1. Stecke den Tesla-USB-Stick in deinen Computer.
2. Öffne [die App](/app/) in Chrome oder Edge.
3. Wähle den Ordner `TeslaCam`.

Jede Minute Material erscheint nach Tag und Uhrzeit. Gespeicherte Clips sind als Ereignisse gekennzeichnet und Sentry-Clips als Parken, sodass du nach dem filtern kannst, was du suchst. Die vordere und die hintere Kamera derselben Minute laufen zusammen, nebeneinander oder als Bild im Bild.

Auch die seitlichen Repeater-Kameras erscheinen, als separate Kacheln zur selben Zeit, sodass du sie gleich nach der Front- und Heckansicht öffnen kannst.

## Den Moment Bild für Bild durchgehen

Sentry-Ereignisse sind oft nur ein paar Sekunden, in denen jemand vorbeigeht. Pausiere, gehe mit `,` und `.` Bild für Bild weiter und drücke `S`, um das klarste Bild eines Gesichts oder eines Kennzeichens als PNG zu speichern, benannt nach der genauen Zeit.

## Bleibt lokal

Sentry-Clips zeigen deine Einfahrt und deine Nachbarn. Tripframe lädt nie etwas hoch: Die Dateien werden auf deinem eigenen Computer gelesen.

## Tipps

- Kopiere `SavedClips` und `SentryClips` auf deinen Computer, bevor der Stick voll wird; Tesla löscht ältere Clips, wenn der Platz ausgeht.
- Nutze einen schnellen Stick mit hoher Ausdauer; siehe [die besten SD-Karten und Speicher für Dashcams](/blog/best-sd-cards-for-dashcams/).
- Du willst einen Clip für deinen Versicherer sichern? Lies [so sicherst du Dashcam-Aufnahmen für Versicherung und Polizei](/blog/save-dashcam-footage-for-insurance/).
