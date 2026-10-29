---
title: How to play H.265 (HEVC) dashcam video on Windows and Mac
description: Black screen, sound only, or "this file can't be played"? Your dashcam probably records in H.265. Here is how to play it in Edge, Chrome, Safari and VLC, or avoid it altogether.
date: 2026-10-29
---

Many newer dashcams, including the Viofo A229 Pro and A329, the 70mai A810 and several BlackVue and Thinkware models, can record in **H.265**, also called **HEVC**. It roughly halves the file size compared with H.264 at the same quality, so the card holds twice as much footage.

The catch: not every computer plays H.265 out of the box.

## Symptoms

- The video stays black, but the time runs or there is sound
- An error like "this file can't be played" or "codec not supported"
- Thumbnails are blank

## The fix, per browser and system

| Where | Plays H.265? | What to do |
|---|---|---|
| Edge on Windows | Usually yes | Nothing on most PCs with a recent graphics chip |
| Chrome on Windows | With the extension | Install the **HEVC Video Extensions** from the Microsoft Store |
| Safari on Mac | Yes | Nothing |
| Chrome on Mac | Usually yes | Keep Chrome and macOS up to date |
| Firefox | Limited | Use Edge, Chrome or Safari instead |
| VLC | Yes | VLC has its own decoder |

Browsers use the hardware video decoder of your computer. Very old graphics hardware may not decode H.265 at all; then VLC is the fallback.

## Or switch the camera to H.264

If you watch footage on several computers, it can be easier to set the camera to H.264 in its settings menu or app. The files get bigger, so check your card size: [the best SD cards for dashcams](/blog/best-sd-cards-for-dashcams/).

## In Tripframe

[Tripframe](/app/) plays whatever your browser can decode. If a clip shows an error, the steps above fix it; reload the page afterwards. Clips in H.264 always play.
