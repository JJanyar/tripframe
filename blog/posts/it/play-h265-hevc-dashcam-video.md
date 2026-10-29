---
title: "Come riprodurre i video H.265 (HEVC) della dashcam su Windows e Mac"
description: "Schermo nero, solo audio o «impossibile riprodurre questo file»? Probabilmente la tua dashcam registra in H.265. Ecco come riprodurlo in Edge, Chrome, Safari e VLC, o evitarlo del tutto."
date: 2026-10-29
---

Molte dashcam recenti, tra cui Viofo A229 Pro e A329, 70mai A810 e diversi modelli BlackVue e Thinkware, possono registrare in **H.265**, chiamato anche **HEVC**. Dimezza più o meno la dimensione dei file rispetto all’H.264 a parità di qualità, quindi la scheda contiene il doppio dei video.

Il problema: non tutti i computer riproducono l’H.265 di serie.

## Sintomi

- Il video resta nero, ma il tempo scorre oppure c’è l’audio
- Un errore come «impossibile riprodurre questo file» o «codec non supportato»
- Le miniature sono vuote

## La soluzione, per browser e sistema

| Dove | Riproduce H.265? | Cosa fare |
|---|---|---|
| Edge su Windows | Di solito sì | Niente sulla maggior parte dei PC con un chip grafico recente |
| Chrome su Windows | Con l’estensione | Installa le **Estensioni video HEVC** dal Microsoft Store |
| Safari su Mac | Sì | Niente |
| Chrome su Mac | Di solito sì | Tieni aggiornati Chrome e macOS |
| Firefox | Limitato | Usa invece Edge, Chrome o Safari |
| VLC | Sì | VLC ha un proprio decodificatore |

I browser usano il decodificatore video hardware del tuo computer. Una scheda grafica molto vecchia potrebbe non decodificare affatto l’H.265; in quel caso VLC è la soluzione di ripiego.

## Oppure imposta la telecamera su H.264

Se guardi i video su più computer, può essere più semplice impostare la telecamera su H.264 nel menu delle impostazioni o nell’app. I file diventano più grandi, quindi controlla la dimensione della scheda: [le migliori schede SD per dashcam](/blog/best-sd-cards-for-dashcams/).

## In Tripframe

[Tripframe](/app/) riproduce tutto ciò che il tuo browser sa decodificare. Se una clip mostra un errore, i passaggi qui sopra lo risolvono; poi ricarica la pagina. Le clip in H.264 si riproducono sempre.
