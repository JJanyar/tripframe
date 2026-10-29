---
title: How to view Viofo dashcam footage on your computer
description: Viofo's own app is built for your phone. Here is how to watch A119, A129, A139, A229 and A329 footage on a PC or Mac, front and rear in sync, with the GPS route on a map.
date: 2026-10-29
---

Viofo makes some of the most popular dashcams around: the A119 Mini 2, the A229 Plus and A229 Pro, the three-channel A139 Pro and the A329 flagship. The hardware is excellent. Watching what it recorded on a computer is where most owners get stuck.

## What Viofo gives you

The **VIOFO app** for Android and iOS connects to the camera over Wi-Fi. It is fine for grabbing one clip at the roadside, but downloading a whole drive over Wi-Fi is slow, and a phone screen is not where you want to study a near miss frame by frame.

On a computer there is no official all-in-one player. Most owners end up in File Explorer or Finder, double-clicking files one at a time.

## How Viofo names its files

Viofo cameras use the Novatek naming scheme:

`2024_0315_143022_000123F.MP4`

- `2024_0315` is the date (15 March 2024)
- `143022` is the time (14:30:22)
- `000123` is a running number
- `F`, `R` or `I` is the camera: front, rear or interior
- A `P` or `E` before the camera letter marks a parking or event clip

Locked event clips go into a separate `RO` (read-only) folder, and photos into `Photo`.

## Watching Viofo footage with Tripframe

[Tripframe](/) is a free viewer that runs in your browser and was built around exactly these file names.

1. Take the microSD card out of the camera and put it in your computer (or use a USB card reader).
2. Open [tripframe.vercel.app/app](/app/) in Chrome or Edge.
3. Choose the card, or the `DCIM` folder on it.

Every clip is sorted by day and time. Front, rear and interior files recorded at the same moment are paired into one tile, so you play them together instead of hunting for the matching rear file. Events and parking clips get their own label and filter.

### GPS route and speed

If your Viofo has GPS (built into the mount on most current models), the position is stored inside each video. Tripframe reads it and draws the route on a map next to the video, with the speed at every moment. Press `G` to show or hide the map.

### Frame by frame

Pause and use the comma and full stop keys to step one frame at a time. Press `S` to save the exact frame as a PNG, named after the date and time it was recorded. That is usually the frame you want for a licence plate.

## A229 Pro and HEVC

The A229 Pro and A329 can record in H.265 (HEVC) to save space. Not every browser plays HEVC out of the box. Edge plays it on most Windows PCs, Safari on a Mac plays it, and Chrome on Windows needs the free HEVC Video Extension from the Microsoft Store. See [how to play H.265 dashcam video](/blog/play-h265-hevc-dashcam-video/) if your clips stay black. Switching the camera to H.264 also solves it, at the cost of larger files.

## Nothing is uploaded

Tripframe reads the card on your own computer. Your footage is never sent anywhere, which matters when the clip shows other people's faces and plates.

Looking for a new Viofo? See our [mid-range dashcam guide](/blog/best-mid-range-dashcams/) and the [best SD cards for dashcams](/blog/best-sd-cards-for-dashcams/).
