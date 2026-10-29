---
title: How to view Thinkware dashcam footage on PC and Mac
description: Thinkware splits footage over folders like cont_rec, evt_rec and parking_rec. Here is how to see all of it on one timeline, front and rear together, in your browser.
date: 2026-10-29
---

Thinkware dashcams such as the U3000, Q1000 and F70 Pro are popular for their radar-assisted parking mode and solid image quality. Thinkware offers the **Thinkware Dashcam Viewer** for Windows and Mac and a phone app. If you would rather not install software, or you are on a computer that is not yours, there is a faster route.

## How Thinkware stores footage

A Thinkware card is split into folders by recording type:

- `cont_rec` for continuous driving
- `evt_rec` for incidents detected by the G-sensor
- `manual_rec` for clips saved with the button
- `parking_rec` and `motion_timelapse_rec` for parking mode

File names look like this:

`REC_2024_03_15_14_30_22_F.MP4`

The prefix (`REC`, `EVT`, `MAN`, `MOT` and so on) is the type, then the date and time, then `F` or `R` for front or rear.

Because the folders split one drive into several lists, it is hard to see what happened in order. An event clip sits in one folder, the minutes before it in another.

## One timeline with Tripframe

[Tripframe](/) reads Thinkware names and folders and puts every clip back on a single timeline per day.

1. Put the microSD card in your computer.
2. Open [the app](/app/) in Chrome or Edge.
3. Choose the card.

Event, manual and parking clips stay labelled, so you can filter on them, but they sit between the normal clips where they belong. Front and rear play together; press `1`, `2` or `3` to switch between side by side, picture in picture and one camera.

## Frame stepping for plates

Thinkware's 4K front cameras capture plenty of detail, but motion blur means only one or two frames are sharp. Pause, then step with the comma and full stop keys until the plate is readable, and press `S` to save that frame as a PNG.

## What about GPS?

Tripframe currently draws GPS routes for Viofo-style (Novatek) and BlackVue files. Thinkware footage plays fully, but without the map. For Thinkware GPS on a map, the official viewer is still the way to go.

See also: [dashcam parking mode explained](/blog/dashcam-parking-mode-explained/) and the [best high-end dashcams](/blog/best-high-end-dashcams/).
