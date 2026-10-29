---
title: So siehst du BlackVue-Dashcam-Aufnahmen ohne BlackVue Viewer an
description: Schau BlackVue-Aufnahmen von DR970X, DR770X und DR900X auf jedem Computer an, mit sortierten Normal-, Ereignis- und Parkclips und synchroner Front und Heck. Ohne Installation.
date: 2026-10-29
---

BlackVue-Kameras sind bekannt für ihr sauberes Design, den starken Parkmodus und die Cloud-Funktionen. Um die Aufnahmen am Computer anzusehen, bietet BlackVue ein eigenes Desktop-Programm an, den **BlackVue Viewer**, für Windows und macOS. Er funktioniert, ist aber ein weiteres Programm, das du installieren und aktuell halten musst, und viele wollen einfach nur die Fahrten der letzten Woche durchsehen.

## So benennt BlackVue seine Dateien

`20240315_143022_NF.mp4`

- `20240315` ist das Datum
- `143022` ist die Uhrzeit
- Der erste Buchstabe nach der Uhrzeit ist die Aufnahmeart: `N` normal, `E` Ereignis, `P` Parken, `M` manuell, dazu ein paar weitere für Aufprall und Bewegung im Parkmodus
- Der zweite Buchstabe ist die Kamera: `F` vorne, `R` hinten, `I` innen

Die Clips liegen in einem einzigen Ordner `Record`, sodass eine volle Karte eine lange Liste fast identischer Namen ist.

## BlackVue-Aufnahmen im Browser ansehen

[Tripframe](/) versteht BlackVue-Namen von Haus aus.

1. Stecke die microSD-Karte in deinen Computer.
2. Öffne [die App](/app/) in Chrome oder Edge.
3. Wähle die Karte oder ihren Ordner `Record`.

Die Clips sind nach Tag gruppiert. Normale, Ereignis- und Parkaufnahmen bekommen jeweils eine Kennzeichnung, sodass du nur Ereignisse filtern und sofort sehen kannst, was den G-Sensor ausgelöst hat. Front- und Heckdateien desselben Moments laufen nebeneinander oder als Bild im Bild. Mit einem Doppelklick auf die kleine Ansicht oder mit `W` tauschst du sie.

### GPS

BlackVue schreibt sein GPS-Protokoll als NMEA-Daten in die Datei. Tripframe liest es und zeigt Route und Geschwindigkeit auf einer Karte neben dem Video.

## Wann BlackVue Viewer trotzdem das richtige Werkzeug ist

BlackVue Viewer kann Kameraeinstellungen ändern, und die BlackVue-App übernimmt Cloud-Funktionen wie die Live-Ansicht aus der Ferne. Tripframe kann beides nicht: Es ist ein Player. Um zurückzuschauen, was passiert ist, geht es schneller, und es läuft auf jedem Computer, ohne dass du etwas installieren musst.

## Halte deine Clips privat

BlackVue-Besitzer nutzen oft die Cloud. Wenn du bestimmte Clips lieber von jedem Server fernhalten willst, passt Tripframe gut: Die Dateien werden auf deinem eigenen Computer gelesen und nie hochgeladen.

Du vergleichst Modelle? Sieh dir die [besten High-End-Dashcams](/blog/best-high-end-dashcams/) und die [besten Mehrkanal-Dashcams](/blog/best-multi-channel-dashcams/) an.
