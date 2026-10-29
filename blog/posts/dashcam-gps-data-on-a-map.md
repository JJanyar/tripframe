---
title: How to see dashcam GPS data on a map
description: Most dashcams with GPS hide the position and speed inside the video file. Here is where it is stored, which brands use which format, and how to see the route next to the video.
date: 2026-10-29
---

A dashcam with GPS records where you were and how fast you drove, every second. That can matter a lot after an incident: it shows your speed was within the limit, or exactly where something happened. But you will not find a separate GPS file on the card. The data is hidden inside the videos.

## Where the GPS data is stored

| Brand | How GPS is stored |
|---|---|
| Viofo and other Novatek-based cameras | Inside the MP4 file, in a block often called "freeGPS" |
| BlackVue | NMEA sentences inside the MP4 file |
| Thinkware | Inside the file, in Thinkware's own format |
| Nextbase | Inside the file, in Nextbase's own format |
| Garmin | Inside the file, in Garmin's own format |
| Tesla | Not stored in the dashcam files |

A normal video player ignores this data completely. You need software that knows where to look.

## See the route next to the video

[Tripframe](/app/) reads GPS from **Viofo / Novatek** and **BlackVue** files.

1. Open the card in Tripframe.
2. Open a clip and press `G`, or click **Map**.

A map appears next to the video with the route of the clip. A marker follows the car as the video plays, with the speed in km/h below the map. Press `R` to record the video and the map together into one file.

The map tiles come from OpenStreetMap. That is the only thing Tripframe loads from the internet; your footage and GPS data stay on your computer.

## Exporting GPS data

Need the route as a file? Under the map in Tripframe, choose **GPX** (for most mapping and sports apps), **KML** (for Google Earth) or **CSV** (a spreadsheet with time, position, speed and heading for every point). For brands Tripframe cannot read yet, use a desktop program such as Dashcam Viewer or Registrator Viewer. See [the best dashcam software](/blog/best-dashcam-software/).

## No GPS showing up?

- Check that GPS is turned on in the camera settings and that the GPS mount or module is connected.
- The first minutes after starting can lack GPS while the camera finds satellites.
- Your brand may use a format Tripframe does not read yet; the video still plays normally.
