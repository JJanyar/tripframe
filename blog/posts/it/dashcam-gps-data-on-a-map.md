---
title: "Come vedere su una mappa i dati GPS della dashcam"
description: "La maggior parte delle dashcam con GPS nasconde posizione e velocità dentro il file video. Ecco dove sono salvati, quali marchi usano quale formato e come vedere il percorso accanto al video."
date: 2026-10-29
---

Una dashcam con GPS registra dove eri e quanto veloce andavi, ogni secondo. Può contare moltissimo dopo un incidente: dimostra che la tua velocità era entro i limiti, o dove è successo esattamente qualcosa. Ma sulla scheda non troverai un file GPS separato. I dati sono nascosti dentro i video.

## Dove sono salvati i dati GPS

| Marchio | Come viene salvato il GPS |
|---|---|
| Viofo e altre telecamere basate su Novatek | Dentro il file MP4, in un blocco spesso chiamato «freeGPS» |
| BlackVue | Frasi NMEA dentro il file MP4 |
| Thinkware | Dentro il file, nel formato proprietario di Thinkware |
| Nextbase | Dentro il file, nel formato proprietario di Nextbase |
| Garmin | Dentro il file, nel formato proprietario di Garmin |
| Tesla | Non salvato nei file della dashcam |

Un normale lettore video ignora completamente questi dati. Serve un software che sappia dove cercare.

## Vedere il percorso accanto al video

[Tripframe](/app/) legge il GPS dai file **Viofo / Novatek** e **BlackVue**.

1. Apri la scheda in Tripframe.
2. Apri una clip e premi `G`, oppure fai clic su **Mappa**.

Accanto al video compare una mappa con il percorso della clip. Un indicatore segue l’auto mentre il video va avanti, con la velocità in km/h sotto la mappa. Premi `R` per registrare video e mappa insieme in un unico file.

Le tessere della mappa provengono da OpenStreetMap. È l’unica cosa che Tripframe carica da internet; i tuoi video e i dati GPS restano sul tuo computer.

## Esportare i dati GPS

Ti serve il percorso come file? Sotto la mappa in Tripframe scegli **GPX** (per la maggior parte delle app di mappe e sport), **KML** (per Google Earth) o **CSV** (un foglio di calcolo con ora, posizione, velocità e direzione per ogni punto). Per i marchi che Tripframe non sa ancora leggere, usa un programma desktop come Dashcam Viewer o Registrator Viewer. Vedi [il miglior software per dashcam](/blog/best-dashcam-software/).

## Il GPS non compare?

- Controlla che il GPS sia attivo nelle impostazioni della telecamera e che il supporto o il modulo GPS sia collegato.
- Nei primi minuti dopo l’avvio il GPS può mancare mentre la telecamera trova i satelliti.
- Il tuo marchio potrebbe usare un formato che Tripframe non legge ancora; il video si riproduce comunque normalmente.
