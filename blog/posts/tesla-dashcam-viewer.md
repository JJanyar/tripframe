---
title: How to view TeslaCam and Sentry Mode footage on your computer
description: Tesla's in-car viewer is fine for a quick look. To go through RecentClips, SavedClips and SentryClips on a PC or Mac, front and rear in sync, use your browser.
date: 2026-10-29
---

Every Tesla records its cameras to a USB drive in the glovebox or centre console. The car has a built-in viewer, but sitting in the driver's seat scrolling through Sentry events is not ideal, and the drive fills up fast.

## How TeslaCam stores footage

The USB drive has a `TeslaCam` folder with three parts:

- `RecentClips`: the last hour of driving, overwritten continuously
- `SavedClips`: clips you saved with the dashcam button or by honking (if enabled)
- `SentryClips`: events recorded by Sentry Mode while parked

Each event is a folder named after its date and time, holding one-minute files per camera:

`2024-03-15_14-28-10-front.mp4`, `-back.mp4`, `-left_repeater.mp4`, `-right_repeater.mp4`

## Watching TeslaCam footage with Tripframe

[Tripframe](/) reads the date and camera from these names.

1. Plug the Tesla USB drive into your computer.
2. Open [the app](/app/) in Chrome or Edge.
3. Choose the `TeslaCam` folder.

Every minute of footage appears by day and time. Saved clips are marked as events and Sentry clips as parking, so you can filter on what you are looking for. The front and back cameras of the same minute play together, side by side or picture in picture.

The side repeater cameras show up too, as separate tiles at the same time, so you can open them right after the front and back view.

## Step through the moment

Sentry events are often a few seconds of someone walking past. Pause, step frame by frame with `,` and `.`, and press `S` to save the clearest frame of a face or a plate as a PNG named after the exact time.

## Keep it local

Sentry clips show your driveway and your neighbours. Tripframe never uploads anything: the files are read on your own computer.

## Tips

- Copy `SavedClips` and `SentryClips` to your computer before the drive fills up; Tesla deletes older clips when it runs out of space.
- Use a fast, high-endurance drive; see [the best SD cards and storage for dashcams](/blog/best-sd-cards-for-dashcams/).
- Saving a clip for your insurer? Read [how to save dashcam footage for insurance and police](/blog/save-dashcam-footage-for-insurance/).
