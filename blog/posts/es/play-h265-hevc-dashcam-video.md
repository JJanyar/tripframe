---
title: "Cómo reproducir vídeo de dashcam en H.265 (HEVC) en Windows y Mac"
description: "¿Pantalla negra, solo sonido o «no se puede reproducir este archivo»? Tu dashcam probablemente graba en H.265. Cómo reproducirlo en Edge, Chrome, Safari y VLC, o evitarlo por completo."
date: 2026-10-29
---

Muchas dashcams recientes, entre ellas la Viofo A229 Pro y la A329, la 70mai A810 y varios modelos de BlackVue y Thinkware, pueden grabar en **H.265**, también llamado **HEVC**. Reduce el tamaño de los archivos a más o menos la mitad que H.264 con la misma calidad, así que la tarjeta guarda el doble de grabaciones.

La pega: no todos los ordenadores reproducen H.265 de serie.

## Síntomas

- El vídeo se queda negro, pero el tiempo avanza o hay sonido
- Un error como «no se puede reproducir este archivo» o «códec no compatible»
- Las miniaturas salen en blanco

## La solución, según navegador y sistema

| Dónde | ¿Reproduce H.265? | Qué hacer |
|---|---|---|
| Edge en Windows | Normalmente sí | Nada en la mayoría de PC con un chip gráfico reciente |
| Chrome en Windows | Con la extensión | Instala las **HEVC Video Extensions** desde la Microsoft Store |
| Safari en Mac | Sí | Nada |
| Chrome en Mac | Normalmente sí | Mantén Chrome y macOS actualizados |
| Firefox | Limitado | Usa Edge, Chrome o Safari en su lugar |
| VLC | Sí | VLC tiene su propio decodificador |

Los navegadores usan el decodificador de vídeo por hardware de tu ordenador. Un hardware gráfico muy antiguo puede no decodificar H.265 en absoluto; entonces VLC es la alternativa.

## O cambia la cámara a H.264

Si ves las grabaciones en varios ordenadores, puede ser más fácil configurar la cámara en H.264 desde su menú de ajustes o su app. Los archivos serán más grandes, así que revisa el tamaño de tu tarjeta: [las mejores tarjetas SD para dashcam](/blog/best-sd-cards-for-dashcams/).

## En Tripframe

[Tripframe](/app/) reproduce todo lo que tu navegador sepa decodificar. Si un clip muestra un error, los pasos anteriores lo arreglan; recarga la página después. Los clips en H.264 siempre se reproducen.
