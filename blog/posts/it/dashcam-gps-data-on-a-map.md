---
title: Come vedere su una mappa i dati GPS della dashcam
description: La maggior parte delle dashcam con GPS nasconde posizione e velocità dentro il file video. Ecco dove sono salvati, quale marca usa quale formato e come vedere il percorso accanto al video.
date: 2026-10-29
updated: 2026-10-30
---

Una dashcam con GPS registra dove sei stato e a che velocità hai guidato, secondo per secondo. Dopo un incidente può contare molto: mostra che la tua velocità era entro il limite, o dove è successo esattamente qualcosa. Ma sulla scheda non troverai un file GPS separato. I dati sono nascosti dentro i video.

## Dove sono salvati i dati GPS

| Marca | Come viene salvato il GPS |
|---|---|
| Viofo e altre telecamere basate su Novatek | Dentro il file MP4, in un blocco spesso chiamato «freeGPS» |
| BlackVue | Frasi NMEA dentro il file MP4 |
| Thinkware | Dentro il file, in un formato proprietario di Thinkware |
| Nextbase | Dentro il file, in un formato proprietario di Nextbase |
| Garmin | Dentro il file, in un formato proprietario di Garmin |
| GoPro | Una traccia di telemetria separata (GPMF) nel file, con altitudine e accelerometro |
| Tesla | Non è salvato nei file della dashcam |

Un normale lettore video ignora completamente questi dati. Serve un software che sappia dove cercarli.

## Vedere il percorso accanto al video

[Tripframe](/app/) legge il GPS dai file **Viofo / Novatek**, **BlackVue** e **GoPro**.

1. Apri la scheda in Tripframe.
2. Apri una clip e premi `G`, oppure clicca su **Mappa**.

Accanto al video compare una mappa con il percorso della clip. Una freccia segue l’auto durante la riproduzione, con velocità, direzione e distanza sotto la mappa, in km/h o mph. Passa dalla vista mappa a quella satellite o ibrida e colora il percorso in base alla velocità. Premi `R` per registrare video e mappa insieme in un unico file.

Sotto la mappa, dei grafici mostrano velocità, distanza, direzione e, se la telecamera li registra, altitudine, pendenza, forza G e satelliti. Clicca su un grafico per saltare a quel momento. Premi `T` per mettere un segnaposto sul percorso e `H` per mostrare i dati di guida sul video stesso.

Le immagini della mappa provengono da OpenStreetMap e, per le viste satellite, da Esri. Meteo e indirizzi stradali vengono cercati solo se lo attivi. I tuoi video e i dati GPS restano sul tuo computer.

## Esportare i dati GPS

Ti serve il percorso come file? Sotto la mappa di Tripframe scegli **GPX** (per la maggior parte delle app di mappe e sport), **KML** (per Google Earth), **CSV** (un foglio di calcolo con ora, posizione, velocità, direzione e altitudine di ogni punto) o **GeoJSON** (per gli strumenti GIS). Per le marche che Tripframe non sa ancora leggere, usa un programma desktop come Dashcam Viewer o Registrator Viewer. Leggi [il miglior software per dashcam](/blog/best-dashcam-software/).

## Il GPS non compare?

- Controlla che il GPS sia attivo nelle impostazioni della telecamera e che il supporto o il modulo GPS sia collegato.
- Nei primi minuti dopo l’avvio il GPS può mancare mentre la telecamera cerca i satelliti.
- La tua marca potrebbe usare un formato che Tripframe non legge ancora; il video si riproduce comunque normalmente.
