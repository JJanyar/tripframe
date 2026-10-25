# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + vanilla JavaScript (user's choice). Static build, deployed on Vercel from the GitHub repo "Dashcam-dashboard".

## Users

A driver who owns a dashcam (Viofo first, other brands too) and has just taken the SD card out of the camera and put it in their laptop. They want to find a specific moment (an incident, a nice drive, a parking bump) without scrolling through a Windows Explorer folder full of cryptic names like `2024_0315_143022_000123F.MP4`. Primary device: laptop/desktop. Interface language: Dutch.

## Product Purpose

A file explorer for dashcam footage that runs entirely in the browser. Open the SD card folder and get an overview by date and time, with every clip labelled front / rear / interior and normal / event (locked) / parking, playable front and rear together.

Success: the user finds the clip of a given moment within seconds, plays both cameras in sync, steps frame by frame to the exact moment, and saves that frame as an image.

## Positioning

Nothing is uploaded. Files are read locally through the browser's File System Access API (with a folder-input fallback), so hours of private driving footage never leave the laptop, and nothing has to be installed.

## Operating Context

- Viofo SD-card layout: `DCIM/Movie`, `DCIM/Movie/RO` (locked/event), `DCIM/Movie/Parking`, `DCIM/Photo`.
- File names encode date, time and camera: Viofo `YYYY_MMDD_HHMMSS_NNNNNN[F|R|I].MP4`; BlackVue `YYYYMMDD_HHMMSS_[N|E|P|M][F|R].mp4`; Thinkware `REC_YYYY_MM_DD_HH_MM_SS_F.MP4`; 70mai `NOYYYYMMDD-HHMMSS-NNNNNNF.mp4`; Nextbase `YYMMDD_HHMMSS_NNN_FH.MP4`. Unknown names fall back to file modification time.
- Clips are 1–3 minutes each, often H.265, hundreds per card.
- GPS is embedded in the MP4 on Viofo/Novatek cameras (`freeGPS` blocks), as NMEA in BlackVue files, or as sidecar files on some brands.

## Capabilities and Constraints

- Timeline grouped per day, front+rear paired into one moment.
- Filters: camera, recording type (normal / event / parking), date.
- Thumbnails generated locally.
- Synced dual playback, frame-by-frame stepping, save current frame as PNG.
- GPS route on a map when GPS data is present; clearly says when there is none.
- Browser support: full experience in Chromium (Chrome/Edge); Firefox/Safari via folder input. H.265 playback depends on the browser/OS codecs.

## Evidence on Hand

No real footage in the repo. No testimonials, users or statistics exist; none may be invented.

## Product Principles

1. The moment is the unit: date, time and camera are read from the file, never left to the user to decode.
2. Local only. Nothing leaves the device, and the UI says so plainly.
3. Precision when it matters: frame stepping and frame export are first-class, not hidden.
4. Degrade honestly: unknown brands, missing GPS, unsupported codecs get a clear explanation, not a blank.

## Brand Commitments

Visual direction chosen by the user: the category standard, a calm media library (like Apple Photos / Google Photos / Windows Photos), executed at that craft level. Convention is the commitment; no themed costume.
