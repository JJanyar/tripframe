---
title: "Cómo ver los datos GPS de la dashcam en un mapa"
description: "La mayoría de las dashcams con GPS esconden la posición y la velocidad dentro del archivo de vídeo. Dónde se guardan, qué marcas usan qué formato y cómo ver la ruta junto al vídeo."
date: 2026-10-29
---

Una dashcam con GPS registra dónde estuviste y a qué velocidad ibas, cada segundo. Eso puede importar mucho tras un incidente: demuestra que ibas dentro del límite o dónde ocurrió exactamente algo. Pero no encontrarás un archivo GPS aparte en la tarjeta. Los datos están escondidos dentro de los vídeos.

## Dónde se guardan los datos GPS

| Marca | Cómo se guarda el GPS |
|---|---|
| Viofo y otras cámaras basadas en Novatek | Dentro del archivo MP4, en un bloque que suele llamarse «freeGPS» |
| BlackVue | Sentencias NMEA dentro del archivo MP4 |
| Thinkware | Dentro del archivo, en el formato propio de Thinkware |
| Nextbase | Dentro del archivo, en el formato propio de Nextbase |
| Garmin | Dentro del archivo, en el formato propio de Garmin |
| Tesla | No se guarda en los archivos de la dashcam |

Un reproductor de vídeo normal ignora por completo estos datos. Necesitas un software que sepa dónde buscarlos.

## Ver la ruta junto al vídeo

[Tripframe](/app/) lee el GPS de archivos de **Viofo / Novatek** y **BlackVue**.

1. Abre la tarjeta en Tripframe.
2. Abre un clip y pulsa `G`, o haz clic en **Mapa**.

Aparece un mapa junto al vídeo con la ruta del clip. Un marcador sigue al coche mientras se reproduce el vídeo, con la velocidad en km/h debajo del mapa. Pulsa `R` para grabar el vídeo y el mapa juntos en un solo archivo.

Las teselas del mapa vienen de OpenStreetMap. Es lo único que Tripframe carga de internet; tus grabaciones y tus datos GPS se quedan en tu ordenador.

## Exportar los datos GPS

¿Necesitas la ruta como archivo? Debajo del mapa en Tripframe, elige **GPX** (para la mayoría de las apps de mapas y deporte), **KML** (para Google Earth) o **CSV** (una hoja de cálculo con hora, posición, velocidad y rumbo de cada punto). Para las marcas que Tripframe todavía no puede leer, usa un programa de escritorio como Dashcam Viewer o Registrator Viewer. Consulta [el mejor software para dashcam](/blog/best-dashcam-software/).

## ¿No aparece el GPS?

- Comprueba que el GPS está activado en los ajustes de la cámara y que el soporte o módulo GPS está conectado.
- Durante los primeros minutos tras el arranque puede faltar el GPS mientras la cámara encuentra satélites.
- Tu marca puede usar un formato que Tripframe todavía no lee; el vídeo se reproduce con normalidad.
