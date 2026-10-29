---
title: Comment lire une vidéo de dashcam en H.265 (HEVC) sous Windows et Mac
description: Écran noir, son seul, ou « ce fichier ne peut pas être lu » ? Votre dashcam enregistre probablement en H.265. Voici comment le lire dans Edge, Chrome, Safari et VLC, ou l’éviter complètement.
date: 2026-10-29
---

De nombreuses dashcams récentes, dont les Viofo A229 Pro et A329, la 70mai A810 et plusieurs modèles BlackVue et Thinkware, peuvent enregistrer en **H.265**, aussi appelé **HEVC**. Il réduit à peu près de moitié la taille des fichiers par rapport au H.264 à qualité égale, si bien que la carte contient deux fois plus de vidéos.

Le revers : tous les ordinateurs ne lisent pas le H.265 d’emblée.

## Symptômes

- La vidéo reste noire, mais le temps avance ou il y a du son
- Une erreur du type « ce fichier ne peut pas être lu » ou « codec non pris en charge »
- Les miniatures sont vides

## La solution, selon le navigateur et le système

| Où | Lit le H.265 ? | Que faire |
|---|---|---|
| Edge sous Windows | Généralement oui | Rien sur la plupart des PC avec une puce graphique récente |
| Chrome sous Windows | Avec l’extension | Installez les **HEVC Video Extensions** depuis le Microsoft Store |
| Safari sur Mac | Oui | Rien |
| Chrome sur Mac | Généralement oui | Gardez Chrome et macOS à jour |
| Firefox | Limité | Utilisez plutôt Edge, Chrome ou Safari |
| VLC | Oui | VLC a son propre décodeur |

Les navigateurs utilisent le décodeur vidéo matériel de votre ordinateur. Un matériel graphique très ancien peut ne pas décoder du tout le H.265 ; VLC est alors la solution de repli.

## Ou passez la caméra en H.264

Si vous regardez vos vidéos sur plusieurs ordinateurs, il peut être plus simple de régler la caméra en H.264 dans son menu de réglages ou son application. Les fichiers deviennent plus gros, alors vérifiez la taille de votre carte : [les meilleures cartes SD pour dashcams](/blog/best-sd-cards-for-dashcams/).

## Dans Tripframe

[Tripframe](/app/) lit tout ce que votre navigateur sait décoder. Si un clip affiche une erreur, les étapes ci-dessus règlent le problème ; rechargez ensuite la page. Les clips en H.264 se lisent toujours.
